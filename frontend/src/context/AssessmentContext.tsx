import React, { createContext, useContext, useState } from "react";
import {
  PersonalData,
  FinancialData,
  TransactionData,
  PaymentData,
  AssessmentResult,
  BackendMlResult,
} from "../types/assessment";
import { calculateCreditScore } from "../services/scoringEngine";
import {
  createAssessment,
  predictApplicant,
  BackendPrediction,
} from "../services/api";

export const DEFAULT_PERSONAL: PersonalData = {
  fullName: "Rahul Sharma",
  age: "34",
  occupation: "Business Owner",
  businessType: "Retail",
  location: "Mumbai, Maharashtra",
  email: "rahul.sharma@example.com",
  phone: "+91 98765 43210",
  customerId: "CRD-102938",
};

export const DEFAULT_FINANCIAL: FinancialData = {
  monthlyIncome: "125,000",
  monthlyExpenses: "45,000",
  existingLoans: "350,000",
  emiAmount: "28,000",
  savings: "420,000",
};

export const DEFAULT_TRANSACTION: TransactionData = {
  monthlyVolume: "340,000",
  frequency: "Daily (20+ per month)",
  balanceTrend: "Growing",
  bouncedPayments: "0",
};

export const DEFAULT_PAYMENT: PaymentData = {
  electricity: true,
  water: true,
  mobileInternet: true,
  upiActivity: 85,
  repaymentHistory: "Excellent – No delays",
};

/** Curated demo SK_ID_CURR values from Home Credit test cache */
export const DEMO_APPLICANT_IDS = [100001, 100005, 100013, 100028, 100038] as const;

interface AssessmentContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  personal: PersonalData;
  setPersonal: React.Dispatch<React.SetStateAction<PersonalData>>;
  financial: FinancialData;
  setFinancial: React.Dispatch<React.SetStateAction<FinancialData>>;
  transaction: TransactionData;
  setTransaction: React.Dispatch<React.SetStateAction<TransactionData>>;
  payment: PaymentData;
  setPayment: React.Dispatch<React.SetStateAction<PaymentData>>;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  dti: number | null;
  completion: number;
  validateStep: (step?: number) => boolean;
  handleNext: () => boolean;
  handleBack: () => void;
  saveDraft: () => void;
  savedDraftToast: boolean;
  loadDemoApplicant: () => void;
  resetAssessment: () => void;
  result: AssessmentResult | null;
  setResult: React.Dispatch<React.SetStateAction<AssessmentResult | null>>;
  backendResult: BackendMlResult | null;
  setBackendResult: React.Dispatch<React.SetStateAction<BackendMlResult | null>>;
  selectedDemoApplicantId: number | null;
  setSelectedDemoApplicantId: React.Dispatch<React.SetStateAction<number | null>>;
  generateScore: () => AssessmentResult;
  submitAssessmentAndPredict: () => Promise<{
    simulation: AssessmentResult;
    backend: BackendMlResult | null;
    error?: string;
  }>;
  isAnalyzing: boolean;
  setIsAnalyzing: (val: boolean) => void;
  backendError: string | null;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function calcDTI(income: string, emi: string, loans: string): number | null {
  const inc = parseFloat(income.replace(/,/g, "")) || 0;
  const e = parseFloat(emi.replace(/,/g, "")) || 0;
  const l = parseFloat(loans.replace(/,/g, "")) || 0;
  if (inc <= 0) return null;
  return Math.round(((e + l * 0.01) / inc) * 100);
}

export function calcCompletion(
  personal: PersonalData,
  financial: FinancialData,
  transaction: TransactionData,
  payment: PaymentData
): number {
  const fields = [
    personal.fullName,
    personal.age,
    personal.occupation,
    personal.businessType,
    personal.location,
    personal.phone,
    financial.monthlyIncome,
    financial.monthlyExpenses,
    financial.savings,
    transaction.monthlyVolume,
    transaction.frequency,
    transaction.balanceTrend,
    payment.repaymentHistory,
  ];
  const filled = fields.filter((f) => f && f.trim() !== "").length;
  return Math.round((filled / fields.length) * 100);
}

function mapBackendPrediction(pred: BackendPrediction): BackendMlResult {
  return {
    applicantId: pred.applicant_id,
    creditScore: pred.credit_score,
    defaultProbability: pred.default_probability,
    defaultProbabilityPercent: pred.default_probability_percent,
    riskBand: pred.risk_band,
    modelVersion: pred.model_version,
    scoreScale: pred.score_scale,
    source: "ml_ensemble",
    predictionId: pred.id,
    assessmentId: pred.assessment_id,
    shapSummary: pred.shap_summary ?? null,
  };
}

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [personal, setPersonal] = useState<PersonalData>(() => {
    const saved = localStorage.getItem("credinove_personal");
    return saved ? JSON.parse(saved) : DEFAULT_PERSONAL;
  });
  const [financial, setFinancial] = useState<FinancialData>(() => {
    const saved = localStorage.getItem("credinove_financial");
    return saved ? JSON.parse(saved) : DEFAULT_FINANCIAL;
  });
  const [transaction, setTransaction] = useState<TransactionData>(() => {
    const saved = localStorage.getItem("credinove_transaction");
    return saved ? JSON.parse(saved) : DEFAULT_TRANSACTION;
  });
  const [payment, setPayment] = useState<PaymentData>(() => {
    const saved = localStorage.getItem("credinove_payment");
    return saved ? JSON.parse(saved) : DEFAULT_PAYMENT;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedDraftToast, setSavedDraftToast] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [selectedDemoApplicantId, setSelectedDemoApplicantId] = useState<number | null>(() => {
    const saved = localStorage.getItem("credinove_demo_applicant_id");
    return saved ? Number(saved) : 100001;
  });
  const [result, setResult] = useState<AssessmentResult | null>(() => {
    const saved = localStorage.getItem("credinove_last_result");
    return saved ? JSON.parse(saved) : null;
  });
  const [backendResult, setBackendResult] = useState<BackendMlResult | null>(() => {
    const saved = localStorage.getItem("credinove_backend_result");
    return saved ? JSON.parse(saved) : null;
  });

  const dti = calcDTI(financial.monthlyIncome, financial.emiAmount, financial.existingLoans);
  const completion = calcCompletion(personal, financial, transaction, payment);

  const validateStep = (stepToCheck = currentStep): boolean => {
    const e: Record<string, string> = {};

    if (stepToCheck === 0) {
      if (!personal.fullName.trim()) e.fullName = "Full name is required";
      if (!personal.age.trim()) e.age = "Age is required";
      else if (parseInt(personal.age) < 18 || parseInt(personal.age) > 99)
        e.age = "Age must be between 18 and 99";
      if (!personal.phone.trim()) e.phone = "Phone number is required";
      if (!personal.location.trim()) e.location = "Location is required";
    } else if (stepToCheck === 1) {
      if (!financial.monthlyIncome.trim()) e.monthlyIncome = "Monthly income is required";
      if (!financial.monthlyExpenses.trim()) e.monthlyExpenses = "Monthly expenses required";
      if (!financial.savings.trim()) e.savings = "Savings amount required";
    } else if (stepToCheck === 2) {
      if (!transaction.monthlyVolume.trim()) e.monthlyVolume = "Transaction volume required";
      if (!transaction.frequency.trim()) e.frequency = "Frequency required";
      if (!transaction.balanceTrend.trim()) e.balanceTrend = "Select a balance trend";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

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

  const saveDraft = () => {
    localStorage.setItem("credinove_personal", JSON.stringify(personal));
    localStorage.setItem("credinove_financial", JSON.stringify(financial));
    localStorage.setItem("credinove_transaction", JSON.stringify(transaction));
    localStorage.setItem("credinove_payment", JSON.stringify(payment));
    if (selectedDemoApplicantId != null) {
      localStorage.setItem(
        "credinove_demo_applicant_id",
        String(selectedDemoApplicantId)
      );
    }
    setSavedDraftToast(true);
    setTimeout(() => setSavedDraftToast(false), 2500);
  };

  const loadDemoApplicant = () => {
    setPersonal(DEFAULT_PERSONAL);
    setFinancial(DEFAULT_FINANCIAL);
    setTransaction(DEFAULT_TRANSACTION);
    setPayment(DEFAULT_PAYMENT);
    setSelectedDemoApplicantId(100001);
    localStorage.setItem("credinove_demo_applicant_id", "100001");
    setErrors({});
  };

  const resetAssessment = () => {
    setPersonal({
      fullName: "",
      age: "",
      occupation: "Business Owner",
      businessType: "Micro Enterprise",
      location: "",
      email: "",
      phone: "",
      customerId: `CRD-${Math.floor(100000 + Math.random() * 900000)}`,
    });
    setFinancial({
      monthlyIncome: "",
      monthlyExpenses: "",
      existingLoans: "0",
      emiAmount: "0",
      savings: "",
    });
    setTransaction({
      monthlyVolume: "",
      frequency: "Weekly (4–10 per month)",
      balanceTrend: "Stable",
      bouncedPayments: "0",
    });
    setPayment({
      electricity: true,
      water: false,
      mobileInternet: true,
      upiActivity: 60,
      repaymentHistory: "Good – Minor delays (<30 days)",
    });
    setCurrentStep(0);
    setErrors({});
    setResult(null);
    setBackendResult(null);
    setBackendError(null);
    setSelectedDemoApplicantId(100001);
    localStorage.removeItem("credinove_last_result");
    localStorage.removeItem("credinove_backend_result");
  };

  const generateScore = (): AssessmentResult => {
    const generated = calculateCreditScore(personal, financial, transaction, payment, dti);
    generated.scoreSource = "client_simulation";
    setResult(generated);
    localStorage.setItem("credinove_last_result", JSON.stringify(generated));
    return generated;
  };

  const submitAssessmentAndPredict = async () => {
    const simulation = generateScore();
    setBackendError(null);

    if (selectedDemoApplicantId == null) {
      setBackendResult(null);
      localStorage.removeItem("credinove_backend_result");
      return {
        simulation,
        backend: null,
        error: "Select a demo applicant to run the verified ML ensemble.",
      };
    }

    try {
      const assessment = await createAssessment({
        customer_id: personal.customerId,
        applicant_id: selectedDemoApplicantId,
        personal_data: { ...personal },
        financial_data: { ...financial },
        transaction_data: { ...transaction },
        payment_data: { ...payment },
        dti,
        status: "completed",
      });

      const prediction = await predictApplicant({
        applicant_id: selectedDemoApplicantId,
        assessment_id: assessment.id,
        explain: false,
      });

      const backend = mapBackendPrediction(prediction);
      setBackendResult(backend);
      localStorage.setItem("credinove_backend_result", JSON.stringify(backend));
      localStorage.setItem(
        "credinove_demo_applicant_id",
        String(selectedDemoApplicantId)
      );
      return { simulation, backend };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Backend prediction unavailable";
      setBackendError(message);
      setBackendResult(null);
      localStorage.removeItem("credinove_backend_result");
      return { simulation, backend: null, error: message };
    }
  };

  return (
    <AssessmentContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        personal,
        setPersonal,
        financial,
        setFinancial,
        transaction,
        setTransaction,
        payment,
        setPayment,
        errors,
        setErrors,
        dti,
        completion,
        validateStep,
        handleNext,
        handleBack,
        saveDraft,
        savedDraftToast,
        loadDemoApplicant,
        resetAssessment,
        result,
        setResult,
        backendResult,
        setBackendResult,
        selectedDemoApplicantId,
        setSelectedDemoApplicantId,
        generateScore,
        submitAssessmentAndPredict,
        isAnalyzing,
        setIsAnalyzing,
        backendError,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within an AssessmentProvider");
  }
  return context;
}
