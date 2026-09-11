// ─── Applicant form data ─────────────────────────────────────────────────────
//
// Keys are the original CSV / database column names.
// Labels come from src/constants/fieldLabels.ts — never change the keys here.
//
// originalApplicantData  = data as fetched from the backend (read-only snapshot)
// ApplicantFormData      = editable copy shown in the assessment form

export interface ApplicantFormData {
  // ── Identification ─────────────────────────────────────────────────────────
  SK_ID_CURR: string; // stored as string in the form for easy input handling

  // ── Financial & Loan Information (Step 1) ──────────────────────────────────
  NAME_CONTRACT_TYPE: string;
  AMT_INCOME_TOTAL: string;
  AMT_CREDIT: string;
  AMT_ANNUITY: string;
  AMT_GOODS_PRICE: string;

  // ── Applicant Information (Step 2) ─────────────────────────────────────────
  CODE_GENDER: string;
  FLAG_OWN_CAR: string;
  NAME_INCOME_TYPE: string;
  NAME_EDUCATION_TYPE: string;
  NAME_FAMILY_STATUS: string;
  NAME_HOUSING_TYPE: string;

  // ── Employment Information (Step 2 continued) ──────────────────────────────
  DAYS_BIRTH: string;       // Raw value from dataset (negative days); displayed as Age
  DAYS_EMPLOYED: string;    // Raw value from dataset (negative days); displayed as Employment Duration
  OCCUPATION_TYPE: string;
  ORGANIZATION_TYPE: string;

  // ── Credit & Risk Information (Step 3) ─────────────────────────────────────
  EXT_SOURCE_1: string;
  EXT_SOURCE_2: string;
  EXT_SOURCE_3: string;
  DEF_30_CNT_SOCIAL_CIRCLE: string;
  DEF_60_CNT_SOCIAL_CIRCLE: string;
  AMT_REQ_CREDIT_BUREAU_QRT: string;
  REGION_RATING_CLIENT: string;
  REGION_RATING_CLIENT_W_CITY: string;
  REGION_POPULATION_RELATIVE: string;
}

// Blank default — all fields empty, ready for lookup/autofill
export const EMPTY_APPLICANT: ApplicantFormData = {
  SK_ID_CURR: "",
  NAME_CONTRACT_TYPE: "",
  AMT_INCOME_TOTAL: "",
  AMT_CREDIT: "",
  AMT_ANNUITY: "",
  AMT_GOODS_PRICE: "",
  CODE_GENDER: "",
  FLAG_OWN_CAR: "",
  NAME_INCOME_TYPE: "",
  NAME_EDUCATION_TYPE: "",
  NAME_FAMILY_STATUS: "",
  NAME_HOUSING_TYPE: "",
  DAYS_BIRTH: "",
  DAYS_EMPLOYED: "",
  OCCUPATION_TYPE: "",
  ORGANIZATION_TYPE: "",
  EXT_SOURCE_1: "",
  EXT_SOURCE_2: "",
  EXT_SOURCE_3: "",
  DEF_30_CNT_SOCIAL_CIRCLE: "",
  DEF_60_CNT_SOCIAL_CIRCLE: "",
  AMT_REQ_CREDIT_BUREAU_QRT: "",
  REGION_RATING_CLIENT: "",
  REGION_RATING_CLIENT_W_CITY: "",
  REGION_POPULATION_RELATIVE: "",
};

// Demo applicant — representative values that match the CSV dataset format.
// Used by the "Pre-fill Demo Applicant" button so reviewers can see a complete form.
export const DEMO_APPLICANT: ApplicantFormData = {
  SK_ID_CURR: "100001",
  NAME_CONTRACT_TYPE: "Cash loans",
  AMT_INCOME_TOTAL: "135000",
  AMT_CREDIT: "568800",
  AMT_ANNUITY: "20560.5",
  AMT_GOODS_PRICE: "450000",
  CODE_GENDER: "M",
  FLAG_OWN_CAR: "N",
  NAME_INCOME_TYPE: "Working",
  NAME_EDUCATION_TYPE: "Secondary / secondary special",
  NAME_FAMILY_STATUS: "Married",
  NAME_HOUSING_TYPE: "House / apartment",
  DAYS_BIRTH: "-19241",
  DAYS_EMPLOYED: "-3036",
  OCCUPATION_TYPE: "Laborers",
  ORGANIZATION_TYPE: "Business Entity Type 3",
  EXT_SOURCE_1: "0.7524",
  EXT_SOURCE_2: "0.6235",
  EXT_SOURCE_3: "0.5",
  DEF_30_CNT_SOCIAL_CIRCLE: "2",
  DEF_60_CNT_SOCIAL_CIRCLE: "2",
  AMT_REQ_CREDIT_BUREAU_QRT: "0",
  REGION_RATING_CLIENT: "2",
  REGION_RATING_CLIENT_W_CITY: "2",
  REGION_POPULATION_RELATIVE: "0.018801",
};

// ─── Dropdown option lists ────────────────────────────────────────────────────
// Values are from the dataset — do not invent values not present in the CSV.

export const CONTRACT_TYPES = ["Cash loans", "Revolving loans"];

export const GENDER_OPTIONS = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
];

export const OWN_CAR_OPTIONS = [
  { value: "Y", label: "Yes" },
  { value: "N", label: "No" },
];

export const INCOME_TYPES = [
  "Working",
  "State servant",
  "Commercial associate",
  "Pensioner",
  "Unemployed",
  "Student",
  "Businessman",
  "Maternity leave",
];

export const EDUCATION_TYPES = [
  "Secondary / secondary special",
  "Higher education",
  "Incomplete higher",
  "Lower secondary",
  "Academic degree",
];

export const FAMILY_STATUSES = [
  "Married",
  "Single / not married",
  "Civil marriage",
  "Separated",
  "Widow",
];

export const HOUSING_TYPES = [
  "House / apartment",
  "With parents",
  "Municipal apartment",
  "Rented apartment",
  "Office apartment",
  "Co-op apartment",
];

export const OCCUPATION_TYPES = [
  "Laborers",
  "Core staff",
  "Accountants",
  "Managers",
  "Drivers",
  "Sales staff",
  "Cleaning staff",
  "Cooking staff",
  "Private service staff",
  "Medicine staff",
  "Security staff",
  "High skill tech staff",
  "Waiters/barmen staff",
  "Low-skill Laborers",
  "Realty agents",
  "Secretaries",
  "IT staff",
  "HR staff",
];

export const ORGANIZATION_TYPES = [
  "Business Entity Type 3",
  "School",
  "Government",
  "Religion",
  "Other",
  "Medicine",
  "Business Entity Type 2",
  "Self-employed",
  "Transport: type 2",
  "Construction",
  "Housing",
  "Kindergarten",
  "Trade: type 7",
  "Industry: type 11",
  "Military",
  "Services",
  "Security Ministries",
  "Transport: type 4",
  "Industry: type 1",
  "Emergency",
  "Security",
  "Trade: type 2",
  "University",
  "Transport: type 3",
  "Police",
  "Business Entity Type 1",
  "Postal",
  "Industry: type 4",
  "Agriculture",
  "Restaurant",
  "Culture",
  "Hotel",
  "Industry: type 7",
  "Trade: type 3",
  "Industry: type 3",
  "Bank",
  "Industry: type 9",
  "Insurance",
  "Trade: type 6",
  "Industry: type 2",
  "Transport: type 1",
  "Industry: type 12",
  "Mobile",
  "Trade: type 1",
  "Industry: type 5",
  "Industry: type 10",
  "Legal Services",
  "Advertising",
  "Trade: type 5",
  "Cleaning",
  "Industry: type 13",
  "Trade: type 4",
  "Telecom",
  "Industry: type 6",
  "Industry: type 8",
  "Realtor",
  "Industry: type 14",
  "XNA",
];

// ─── Score output types (unchanged — ResultsPage depends on these) ────────────

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
  /** Snapshot of the editable form data at submission time. */
  rawApplicant: ApplicantFormData;
}
