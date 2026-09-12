import React, { createContext, useContext, useState } from "react";
import {
  ApplicantFormData,
  AssessmentResult,
  DEMO_APPLICANT,
  EMPTY_APPLICANT,
} from "../types/assessment";
import { calculateCreditScore } from "../services/scoringEngine";
import {
  fetchApplicantById,
  submitAssessmentRecord,
  runAndSavePrediction,
  AssessmentRecordData,
  PredictionRecordData,
} from "../services/supabaseService";

// ─── Context shape ────────────────────────────────────────────────────────────

interface AssessmentContextType {
  // ── Step navigation ──────────────────────────────────────────────────────
  /** 0 = Lookup, 1 = Financial & Loan, 2 = Applicant & Employment, 3 = Credit & Risk, 4 = Review */
  currentStep: number;
  setCurrentStep: (step: number) => void;
  handleNext: () => boolean;
  handleBack: () => void;

  // ── Applicant data ───────────────────────────────────────────────────────
  /**
   * Read-only snapshot of the record as it arrived from the backend.
   * null until an applicant is looked up / loaded.
   * Never mutated after being set — used for change-tracking later.
   */
  originalApplicantData: ApplicantFormData | null;

  /**
   * Editable copy that the user may change in the form.
   * Initialised from originalApplicantData when an applicant is loaded.
   */
  formData: ApplicantFormData;
  setFormData: React.Dispatch<React.SetStateAction<ApplicantFormData>>;

  /**
   * The ID string typed into the lookup input (Step 0).
   * Kept separate so it does not clobber formData.SK_ID_CURR prematurely.
   */
  lookupId: string;
  setLookupId: (id: string) => void;

  // ── Load / reset actions ─────────────────────────────────────────────────
  /**
   * Called when applicant data arrives (from backend later, or demo now).
   * Sets both originalApplicantData and formData, then advances to Step 1.
   */
  loadApplicant: (data: ApplicantFormData) => void;

  /** Pre-fills form with the demo applicant record and advances to Step 1. */
  loadDemoApplicant: () => void;

  /** Loads an applicant by ID from Supabase demo_applicants / backend API. */
  loadApplicantById: (id: string | number) => Promise<boolean>;
  isLoadingApplicant: boolean;
  lookupError: string | null;

  /** Clears all state back to the initial blank condition. */
  resetAssessment: () => void;

  // ── Validation & completion ──────────────────────────────────────────────
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  validateStep: (step?: number) => boolean;

  /** 0-100 percentage of non-empty form fields. */
  completion: number;

  // ── Draft ────────────────────────────────────────────────────────────────
  saveDraft: () => void;
  savedDraftToast: boolean;

  // ── Score generation & Supabase audit persistence ────────────────────────
  result: AssessmentResult | null;
  setResult: React.Dispatch<React.SetStateAction<AssessmentResult | null>>;
  generateScore: () => AssessmentResult;
  submitAndScore: () => Promise<AssessmentResult>;
  isAnalyzing: boolean;
  setIsAnalyzing: (val: boolean) => void;

  /** Stored Supabase audit records */
  assessmentRecord: AssessmentRecordData | null;
  backendPrediction: PredictionRecordData | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Percentage of the 24 data fields (excluding SK_ID_CURR) that are non-empty. */
function calcCompletion(data: ApplicantFormData): number {
  const dataFields: (keyof ApplicantFormData)[] = [
    "NAME_CONTRACT_TYPE",
    "AMT_INCOME_TOTAL",
    "AMT_CREDIT",
    "AMT_ANNUITY",
    "AMT_GOODS_PRICE",
    "CODE_GENDER",
    "FLAG_OWN_CAR",
    "NAME_INCOME_TYPE",
    "NAME_EDUCATION_TYPE",
    "NAME_FAMILY_STATUS",
    "NAME_HOUSING_TYPE",
    "DAYS_BIRTH",
    "DAYS_EMPLOYED",
    "OCCUPATION_TYPE",
    "ORGANIZATION_TYPE",
    "EXT_SOURCE_1",
    "EXT_SOURCE_2",
    "EXT_SOURCE_3",
    "DEF_30_CNT_SOCIAL_CIRCLE",
    "DEF_60_CNT_SOCIAL_CIRCLE",
    "AMT_REQ_CREDIT_BUREAU_QRT",
    "REGION_RATING_CLIENT",
    "REGION_RATING_CLIENT_W_CITY",
    "REGION_POPULATION_RELATIVE",
  ];
  const filled = dataFields.filter((k) => String(data[k] ?? "").trim() !== "").length;
  return Math.round((filled / dataFields.length) * 100);
}

// Required fields per step for validation
const REQUIRED_BY_STEP: Record<number, (keyof ApplicantFormData)[]> = {
  1: ["NAME_CONTRACT_TYPE", "AMT_INCOME_TOTAL", "AMT_CREDIT"],
  2: ["CODE_GENDER", "FLAG_OWN_CAR", "NAME_INCOME_TYPE", "NAME_EDUCATION_TYPE", "DAYS_BIRTH"],
  3: ["EXT_SOURCE_2"],
};

// ─── Provider ────────────────────────────────────────────────────────────────

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Navigation
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Applicant records
  const [originalApplicantData, setOriginalApplicantData] =
    useState<ApplicantFormData | null>(null);
  const [formData, setFormData] = useState<ApplicantFormData>(() => {
    try {
      const saved = localStorage.getItem("credinova_form_data");
      return saved ? (JSON.parse(saved) as ApplicantFormData) : EMPTY_APPLICANT;
    } catch {
      return EMPTY_APPLICANT;
    }
  });

  const [lookupId, setLookupId] = useState<string>(() => {
    return localStorage.getItem("credinova_lookup_id") || "";
  });

  const [isLoadingApplicant, setIsLoadingApplicant] = useState<boolean>(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Draft toast
  const [savedDraftToast, setSavedDraftToast] = useState<boolean>(false);

  // Score & Supabase persistence
  const [result, setResult] = useState<AssessmentResult | null>(() => {
    try {
      const saved = localStorage.getItem("credinova_last_result");
      return saved ? (JSON.parse(saved) as AssessmentResult) : null;
    } catch {
      return null;
    }
  });
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [assessmentRecord, setAssessmentRecord] = useState<AssessmentRecordData | null>(null);
  const [backendPrediction, setBackendPrediction] = useState<PredictionRecordData | null>(null);

  // Completion percentage
  const completion = calcCompletion(formData);

  // ── Load applicant ─────────────────────────────────────────────────────────
  const loadApplicant = (data: ApplicantFormData) => {
    setOriginalApplicantData(data);
    setFormData(data);
    setLookupId(data.SK_ID_CURR || "");
    setErrors({});
    setLookupError(null);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loadDemoApplicant = () => {
    setLookupId(DEMO_APPLICANT.SK_ID_CURR);
    localStorage.setItem("credinova_lookup_id", DEMO_APPLICANT.SK_ID_CURR);
    loadApplicant(DEMO_APPLICANT);
  };

  const loadApplicantById = async (id: string | number): Promise<boolean> => {
    setIsLoadingApplicant(true);
    setLookupError(null);
    try {
      const data = await fetchApplicantById(id);
      loadApplicant(data);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load applicant from database";
      setLookupError(msg);
      return false;
    } finally {
      setIsLoadingApplicant(false);
    }
  };

  // ── Reset ──────────────────────────────────────────────────────────────────
  const resetAssessment = () => {
    setOriginalApplicantData(null);
    setFormData(EMPTY_APPLICANT);
    setLookupId("");
    setCurrentStep(0);
    setErrors({});
    setLookupError(null);
    setResult(null);
    setAssessmentRecord(null);
    setBackendPrediction(null);
    localStorage.removeItem("credinova_form_data");
    localStorage.removeItem("credinova_lookup_id");
    localStorage.removeItem("credinova_last_result");
  };

  // ── Validation ─────────────────────────────────────────────────────────────
  const validateStep = (stepToCheck = currentStep): boolean => {
    const e: Record<string, string> = {};

    if (stepToCheck === 0) {
      if (!lookupId.trim()) {
        e.lookupId = "Please enter an Applicant ID to continue.";
      }
    } else {
      const required = REQUIRED_BY_STEP[stepToCheck] ?? [];
      for (const key of required) {
        if (!String(formData[key] ?? "").trim()) {
          e[key] = "This field is required.";
        }
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Navigation ─────────────────────────────────────────────────────────────
  const handleNext = (): boolean => {
    if (!validateStep(currentStep)) return false;
    setErrors({});
    setCurrentStep((s) => Math.min(s + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Draft ──────────────────────────────────────────────────────────────────
  const saveDraft = () => {
    localStorage.setItem("credinova_form_data", JSON.stringify(formData));
    localStorage.setItem("credinova_lookup_id", lookupId);
    setSavedDraftToast(true);
    setTimeout(() => setSavedDraftToast(false), 2500);
  };

  // ── Score generation & Supabase audit persistence ──────────────────────────
  const generateScore = (): AssessmentResult => {
    const generated = calculateCreditScore(formData);
    setResult(generated);
    localStorage.setItem("credinova_last_result", JSON.stringify(generated));
    return generated;
  };

  const submitAndScore = async (): Promise<AssessmentResult> => {
    const baseScore = calculateCreditScore(formData);
    const applicantId = Number(formData.SK_ID_CURR);

    try {
      // 1. Ingest assessment submission into Supabase `assessments` table
      const savedAssessment = await submitAssessmentRecord(formData);
      setAssessmentRecord(savedAssessment);

      // 2. Run ML ensemble inference and save prediction into `predictions` table
      if (!isNaN(applicantId) && applicantId > 0) {
        const pred = await runAndSavePrediction({
          applicantId,
          assessmentId: savedAssessment.id,
          explain: true,
        });
        setBackendPrediction(pred);

        // Derive SHAP driver points for display if available
        let topPositives = baseScore.positives;
        let topRisks = baseScore.risks;
        if (pred.shap_summary && pred.shap_summary.length > 0) {
          const positiveDrivers = pred.shap_summary
            .filter((s) => (s.impact ?? 0) < 0)
            .map((s) => `${s.feature}: Reduces risk by ${(Math.abs(s.impact ?? 0) * 100).toFixed(1)}%`);
          const riskDrivers = pred.shap_summary
            .filter((s) => (s.impact ?? 0) > 0)
            .map((s) => `${s.feature}: Increases default risk by ${((s.impact ?? 0) * 100).toFixed(1)}%`);
          if (positiveDrivers.length > 0) topPositives = positiveDrivers.slice(0, 4);
          if (riskDrivers.length > 0) topRisks = riskDrivers.slice(0, 4);
        }

        const mappedResult: AssessmentResult = {
          ...baseScore,
          applicantId: String(applicantId),
          creditScore: pred.credit_score,
          defaultProbability: `${pred.default_probability_percent}%`,
          riskLevel:
            pred.risk_band === "Good" || pred.risk_band === "Excellent"
              ? "LOW RISK"
              : pred.risk_band === "Fair" || pred.risk_band === "Moderate"
              ? "MEDIUM RISK"
              : "HIGH RISK",
          recommendation:
            pred.credit_score >= 720
              ? "APPROVE"
              : pred.credit_score >= 620
              ? "CONDITIONAL APPROVE"
              : "MANUAL REVIEW",
          positives: topPositives,
          risks: topRisks,
          assessmentId: savedAssessment.id,
          predictionId: pred.id ?? undefined,
          modelVersion: pred.model_version,
          isMlPrediction: true,
          shapSummary: pred.shap_summary,
        };

        setResult(mappedResult);
        localStorage.setItem("credinova_last_result", JSON.stringify(mappedResult));
        return mappedResult;
      }
    } catch (err) {
      console.warn("Supabase/backend assessment submission encountered error, fallback to local:", err);
    }

    setResult(baseScore);
    localStorage.setItem("credinova_last_result", JSON.stringify(baseScore));
    return baseScore;
  };

  const handleSetLookupId = (id: string) => {
    setLookupId(id);
  };

  return (
    <AssessmentContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        handleNext,
        handleBack,
        originalApplicantData,
        formData,
        setFormData,
        lookupId,
        setLookupId: handleSetLookupId,
        loadApplicant,
        loadDemoApplicant,
        loadApplicantById,
        isLoadingApplicant,
        lookupError,
        resetAssessment,
        errors,
        setErrors,
        validateStep,
        completion,
        saveDraft,
        savedDraftToast,
        result,
        setResult,
        generateScore,
        submitAndScore,
        isAnalyzing,
        setIsAnalyzing,
        assessmentRecord,
        backendPrediction,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAssessment(): AssessmentContextType {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error("useAssessment must be used inside AssessmentProvider");
  return ctx;
}
