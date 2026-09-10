import React, { createContext, useContext, useState, useEffect } from "react";
import {
  PersonalData,
  FinancialData,
  TransactionData,
  PaymentData,
  AssessmentResult,
} from "../types/assessment";
import { calculateCreditScore } from "../services/scoringEngine";

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
  generateScore: () => AssessmentResult;
  isAnalyzing: boolean;
  setIsAnalyzing: (val: boolean) => void;
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
  const [result, setResult] = useState<AssessmentResult | null>(() => {
    const saved = localStorage.getItem("credinove_last_result");
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
    setSavedDraftToast(true);
    setTimeout(() => setSavedDraftToast(false), 2500);
  };

  const loadDemoApplicant = () => {
    setPersonal(DEFAULT_PERSONAL);
    setFinancial(DEFAULT_FINANCIAL);
    setTransaction(DEFAULT_TRANSACTION);
    setPayment(DEFAULT_PAYMENT);
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
    localStorage.removeItem("credinove_last_result");
  };

  const generateScore = (): AssessmentResult => {
    const generated = calculateCreditScore(personal, financial, transaction, payment, dti);
    setResult(generated);
    localStorage.setItem("credinove_last_result", JSON.stringify(generated));
    return generated;
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
        generateScore,
        isAnalyzing,
        setIsAnalyzing,
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
