import React, { createContext, useContext, useState } from "react";
import {
  ApplicantFormData,
  AssessmentResult,
  DEMO_APPLICANT,
  EMPTY_APPLICANT,
} from "../types/assessment";
import { calculateCreditScore } from "../services/scoringEngine";

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

  // ── Score generation ─────────────────────────────────────────────────────
  result: AssessmentResult | null;
  setResult: React.Dispatch<React.SetStateAction<AssessmentResult | null>>;
  generateScore: () => AssessmentResult;
  isAnalyzing: boolean;
  setIsAnalyzing: (val: boolean) => void;
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

// ─── Fields required per step for validation ─────────────────────────────────

const REQUIRED_BY_STEP: Record<number, (keyof ApplicantFormData)[]> = {
  // Step 0 (Lookup) validated separately via lookupId
  1: ["NAME_CONTRACT_TYPE", "AMT_INCOME_TOTAL", "AMT_CREDIT"],
  2: ["CODE_GENDER", "NAME_INCOME_TYPE", "NAME_EDUCATION_TYPE", "DAYS_BIRTH"],
  3: ["EXT_SOURCE_2", "REGION_RATING_CLIENT"],
};

// ─── Context creation ─────────────────────────────────────────────────────────

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

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
    return localStorage.getItem("credinova_lookup_id") ?? "";
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedDraftToast, setSavedDraftToast] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [result, setResult] = useState<AssessmentResult | null>(() => {
    try {
      const saved = localStorage.getItem("credinova_last_result");
      return saved ? (JSON.parse(saved) as AssessmentResult) : null;
    } catch {
      return null;
    }
  });

  // ── Completion ─────────────────────────────────────────────────────────────
  const completion = calcCompletion(formData);

  // ── Load applicant ─────────────────────────────────────────────────────────
  const loadApplicant = (data: ApplicantFormData) => {
    setOriginalApplicantData(data);
    setFormData(data);
    setErrors({});
    setCurrentStep(1);
  };

  const loadDemoApplicant = () => {
    setLookupId(DEMO_APPLICANT.SK_ID_CURR);
    localStorage.setItem("credinova_lookup_id", DEMO_APPLICANT.SK_ID_CURR);
    loadApplicant(DEMO_APPLICANT);
  };

  // ── Reset ──────────────────────────────────────────────────────────────────
  const resetAssessment = () => {
    setOriginalApplicantData(null);
    setFormData(EMPTY_APPLICANT);
    setLookupId("");
    setCurrentStep(0);
    setErrors({});
    setResult(null);
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

  // ── Score generation ───────────────────────────────────────────────────────
  const generateScore = (): AssessmentResult => {
    const generated = calculateCreditScore(formData);
    setResult(generated);
    localStorage.setItem("credinova_last_result", JSON.stringify(generated));
    return generated;
  };

  // ── Expose lookupId setter with side-effect ────────────────────────────────
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
        isAnalyzing,
        setIsAnalyzing,
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
