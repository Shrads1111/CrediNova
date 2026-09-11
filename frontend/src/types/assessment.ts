export interface PersonalData {
  fullName: string;
  age: string;
  occupation: string;
  businessType: string;
  location: string;
  email: string;
  phone: string;
  customerId: string;
}

export interface FinancialData {
  monthlyIncome: string;
  monthlyExpenses: string;
  existingLoans: string;
  emiAmount: string;
  savings: string;
}

export interface TransactionData {
  monthlyVolume: string;
  frequency: string;
  balanceTrend: string; // "Growing", "Stable", "Declining"
  bouncedPayments: string;
}

export interface PaymentData {
  electricity: boolean;
  water: boolean;
  mobileInternet: boolean;
  upiActivity: number; // 0 - 100
  repaymentHistory: string;
}

export interface ScoreBarItem {
  label: string;
  value: string;
  pct: number;
  color: string;
}

export interface ScoreBandInfo {
  label: string;
  range: string;
  color: string;
  active: boolean;
}

export interface SuggestionItem {
  title: string;
  desc: string;
}

export interface BackendMlResult {
  applicantId: number;
  creditScore: number;
  defaultProbability: number;
  defaultProbabilityPercent: number;
  riskBand: string;
  modelVersion: string;
  scoreScale: string;
  source: "ml_ensemble";
  predictionId?: string | null;
  assessmentId?: string | null;
  shapSummary?: Array<Record<string, unknown>> | null;
}

export interface AssessmentResult {
  applicantId: string;
  assessmentDate: string;
  creditScore: number;
  maxScore: number;
  scoreDelta: number;
  scoreBand: string;
  riskLevel: "LOW RISK" | "MEDIUM RISK" | "HIGH RISK";
  riskColor: string;
  defaultProbability: string;
  defaultDelta: string;
  eligibleAmountMin: string;
  eligibleAmountMax: string;
  recommendedTenure: string;
  recommendation: "APPROVE" | "CONDITIONAL APPROVE" | "MANUAL REVIEW";
  recommendationSubtitle: string;
  scoreBars: ScoreBarItem[];
  positives: string[];
  risks: string[];
  aiExplanation: string;
  trendData: Array<{ month: string; score: number }>;
  suggestions: SuggestionItem[];
  rawAssessment: {
    personal: PersonalData;
    financial: FinancialData;
    transaction: TransactionData;
    payment: PaymentData;
    dti: number | null;
  };
  /** Present when score came from local scoringEngine only */
  scoreSource?: "client_simulation" | "hybrid";
}
