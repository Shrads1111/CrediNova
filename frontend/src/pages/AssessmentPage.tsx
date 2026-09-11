import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  Check,
  AlertCircle,
  TrendingUp,
  Scale,
  TrendingDown,
  Droplets,
  Wifi,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Save,
  User,
  DollarSign,
  Layers,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { Navbar } from "../components/common/Navbar";
import { useAssessment, DEMO_APPLICANT_IDS } from "../context/AssessmentContext";
import {
  PersonalData,
  FinancialData,
  TransactionData,
  PaymentData,
} from "../types/assessment";

const THEME = {
  canvas: "#F3F0EE",
  lifted: "#FCFBFA",
  white: "#FFFFFF",
  softBone: "#F4F4F4",
  ink: "#141413",
  charcoal: "#262627",
  signalOrange: "#CF4500",
  lightSignalOrange: "#F37338",
  clayBrown: "#9A3A0A",
  slateGray: "#696969",
  dustTaupe: "#D1CDC7",
  borderLight: "#E2DED9",
  borderSubtle: "rgba(20, 20, 19, 0.08)",
};

const STEPS = [
  "Personal Information",
  "Financial Information",
  "Transaction Behavior",
  "Alternative Signals",
  "Review & Submit",
];

const OCCUPATIONS = [
  "Business Owner",
  "Salaried Employee",
  "Self-Employed",
  "Farmer",
  "Professional",
  "Trader",
  "Contractor",
  "Other",
];

const BUSINESS_TYPES = [
  "Micro Enterprise",
  "Small Enterprise",
  "Medium Enterprise",
  "Retail",
  "Manufacturing",
  "Services",
  "Agriculture",
  "Other",
];

const REPAYMENT_OPTIONS = [
  "Excellent – No delays",
  "Good – Minor delays (<30 days)",
  "Fair – Occasional delays (30–90 days)",
  "Poor – Frequent delays (>90 days)",
  "Default – Loan default recorded",
];

// ─── Header & Actions ────────────────────────────────────────────────────────
function PageHeader() {
  const {
    loadDemoApplicant,
    resetAssessment,
    saveDraft,
    selectedDemoApplicantId,
    setSelectedDemoApplicantId,
  } = useAssessment();

  return (
    <div
      style={{
        backgroundColor: THEME.lifted,
        borderBottom: `1px solid ${THEME.borderLight}`,
        padding: "28px 0",
      }}
    >
      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 24px" }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="eyebrow" style={{ marginBottom: "8px" }}>
              <span className="eyebrow-dot" />
              <span>LOAN OFFICER ASSESSMENT WORKFLOW</span>
            </div>
            <h1
              style={{
                fontSize: "clamp(26px, 3.5vw, 36px)",
                fontWeight: 500,
                color: THEME.ink,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              Applicant Credit Intelligence Evaluation
            </h1>
            <p
              style={{
                fontSize: "15px",
                color: THEME.charcoal,
                marginTop: "6px",
                fontWeight: 450,
              }}
            >
              Enter borrower profile and alternative digital indicators for instant AI-calibrated
              credit scoring and risk categorization.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: THEME.slateGray,
              }}
            >
              Demo applicant (ML)
              <select
                value={selectedDemoApplicantId ?? ""}
                onChange={(e) => {
                  const value = e.target.value ? Number(e.target.value) : null;
                  setSelectedDemoApplicantId(value);
                  if (value != null) {
                    localStorage.setItem("credinove_demo_applicant_id", String(value));
                  }
                }}
                style={{
                  minWidth: "160px",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  border: `1px solid ${THEME.borderLight}`,
                  backgroundColor: THEME.white,
                  color: THEME.ink,
                  fontSize: "14px",
                  fontWeight: 600,
                }}
                title="Links assessment to a Home Credit demo applicant for verified ML scoring"
              >
                <option value="">None (simulation only)</option>
                {DEMO_APPLICANT_IDS.map((id) => (
                  <option key={id} value={id}>
                    SK_ID_CURR {id}
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={loadDemoApplicant}
              className="btn-secondary"
              style={{ fontSize: "14px", padding: "8px 20px" }}
              title="Pre-fill form with Rahul Sharma's verified profile"
            >
              <Zap size={15} color={THEME.lightSignalOrange} />
              <span>Pre-fill Demo Applicant</span>
            </button>
            <button
              onClick={saveDraft}
              className="btn-ghost"
              style={{ fontSize: "14px", padding: "8px 18px" }}
            >
              <Save size={15} />
              <span>Save Draft</span>
            </button>
            <button
              onClick={resetAssessment}
              className="btn-ghost"
              style={{
                fontSize: "14px",
                padding: "8px 18px",
                borderColor: "rgba(207, 69, 0, 0.3)",
                color: THEME.signalOrange,
              }}
              title="Reset all form fields"
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step Progress Indicator ──────────────────────────────────────────────────
function ProgressBar({
  currentStep,
  onSelectStep,
}: {
  currentStep: number;
  onSelectStep: (step: number) => void;
}) {
  return (
    <div
      style={{
        backgroundColor: THEME.canvas,
        borderBottom: `1px solid ${THEME.borderLight}`,
        padding: "16px 0",
      }}
    >
      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 24px" }}>
        <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-hide">
          {STEPS.map((step, i) => {
            const isDone = i < currentStep;
            const isCurr = i === currentStep;

            return (
              <div key={step} className="flex items-center flex-1 min-w-[190px]">
                <button
                  onClick={() => onSelectStep(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: isCurr ? THEME.white : "transparent",
                    border: isCurr ? `1px solid ${THEME.borderLight}` : "1px solid transparent",
                    boxShadow: isCurr ? "0 4px 12px rgba(0,0,0,0.04)" : "none",
                    cursor: "pointer",
                    padding: "8px 14px",
                    borderRadius: "999px",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: 700,
                      backgroundColor: isDone
                        ? THEME.ink
                        : isCurr
                        ? THEME.ink
                        : THEME.white,
                      color: isDone || isCurr ? THEME.canvas : THEME.slateGray,
                      border: isDone || isCurr ? `1.5px solid ${THEME.ink}` : `1px solid ${THEME.borderLight}`,
                      flexShrink: 0,
                    }}
                  >
                    {isDone ? <Check size={16} strokeWidth={2.5} color="#FFFFFF" /> : i + 1}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: isCurr ? THEME.signalOrange : THEME.slateGray,
                        letterSpacing: "0.05em",
                      }}
                    >
                      Step 0{i + 1}
                    </div>
                    <div
                      style={{
                        fontSize: "13.5px",
                        fontWeight: isCurr ? 600 : 450,
                        color: THEME.ink,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {step}
                    </div>
                  </div>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: "1.5px",
                      backgroundColor: i < currentStep ? THEME.ink : THEME.borderLight,
                      margin: "0 10px",
                      minWidth: "16px",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Reusable Form Components ────────────────────────────────────────────────
function FormField({
  label,
  required,
  error,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "8px",
        }}
      >
        <label style={{ fontSize: "14px", fontWeight: 600, color: THEME.ink }}>
          {label} {required && <span style={{ color: THEME.signalOrange }}>*</span>}
        </label>
        {hint && <span style={{ fontSize: "12px", color: THEME.slateGray }}>{hint}</span>}
      </div>
      {children}
      {error && (
        <p
          style={{
            fontSize: "12.5px",
            color: THEME.signalOrange,
            marginTop: "6px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontWeight: 500,
          }}
        >
          <AlertCircle size={14} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="card-lifted mb-8"
      style={{
        padding: "36px",
        backgroundColor: THEME.lifted,
        borderRadius: "32px",
        border: `1px solid ${THEME.borderLight}`,
        boxShadow: "0 12px 36px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ marginBottom: "28px" }}>
        <h3
          style={{
            fontSize: "22px",
            fontWeight: 500,
            color: THEME.ink,
            marginBottom: "6px",
          }}
        >
          {title}
        </h3>
        {subtitle && (
          <p style={{ fontSize: "14.5px", color: THEME.slateGray, margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "11px 18px",
  borderRadius: "16px",
  border: `1.5px solid ${THEME.borderLight}`,
  fontSize: "14.5px",
  color: THEME.ink,
  backgroundColor: THEME.white,
  transition: "all 0.2s ease",
  outline: "none",
};

// ─── Step 1: Personal ────────────────────────────────────────────────────────
function StepPersonal() {
  const { personal, setPersonal, errors } = useAssessment();

  const update = (field: keyof PersonalData, val: string) => {
    setPersonal((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <div className="animate-fade-in">
      <SectionCard
        title="Personal & Demographic Profile"
        subtitle="Core borrower identity and classification inputs required for baseline verification."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <FormField label="Full Name" required error={errors.fullName}>
            <input
              type="text"
              value={personal.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="e.g. Rahul Sharma"
              style={inputStyle}
            />
          </FormField>

          <FormField label="Age" required error={errors.age}>
            <input
              type="number"
              value={personal.age}
              onChange={(e) => update("age", e.target.value)}
              placeholder="e.g. 34"
              min={18}
              max={99}
              style={inputStyle}
            />
          </FormField>

          <FormField label="Primary Occupation" required>
            <select
              value={personal.occupation}
              onChange={(e) => update("occupation", e.target.value)}
              style={inputStyle}
            >
              {OCCUPATIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Business / Enterprise Type">
            <select
              value={personal.businessType}
              onChange={(e) => update("businessType", e.target.value)}
              style={inputStyle}
            >
              {BUSINESS_TYPES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Location / City & State" required error={errors.location}>
            <input
              type="text"
              value={personal.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="e.g. Mumbai, Maharashtra"
              style={inputStyle}
            />
          </FormField>

          <FormField label="Contact Phone Number" required error={errors.phone}>
            <input
              type="text"
              value={personal.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="e.g. +91 98765 43210"
              style={inputStyle}
            />
          </FormField>

          <FormField label="Email Address">
            <input
              type="email"
              value={personal.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="e.g. rahul.sharma@example.com"
              style={inputStyle}
            />
          </FormField>

          <FormField label="Core Banking / Applicant ID" hint="Auto-generated ID">
            <input
              type="text"
              value={personal.customerId}
              onChange={(e) => update("customerId", e.target.value)}
              placeholder="CRD-102938"
              style={inputStyle}
            />
          </FormField>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Step 2: Financial ───────────────────────────────────────────────────────
function StepFinancial() {
  const { financial, setFinancial, errors, dti } = useAssessment();

  const update = (field: keyof FinancialData, val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "");
    const formatted = cleaned ? parseInt(cleaned, 10).toLocaleString("en-IN") : "";
    setFinancial((prev) => ({ ...prev, [field]: formatted }));
  };

  const inc = parseFloat(financial.monthlyIncome.replace(/,/g, "")) || 0;
  const exp = parseFloat(financial.monthlyExpenses.replace(/,/g, "")) || 0;
  const emi = parseFloat(financial.emiAmount.replace(/,/g, "")) || 0;
  const netDisposable = Math.max(0, inc - exp - emi);

  return (
    <div className="animate-fade-in">
      <SectionCard
        title="Financial Information & Debt Obligations"
        subtitle="Monthly income capacity, existing obligations, and calculated debt service coverage."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <FormField label="Monthly Gross Income (INR)" required error={errors.monthlyIncome}>
            <div className="relative">
              <span
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "12px",
                  color: THEME.slateGray,
                  fontWeight: 600,
                }}
              >
                ₹
              </span>
              <input
                type="text"
                value={financial.monthlyIncome}
                onChange={(e) => update("monthlyIncome", e.target.value)}
                placeholder="1,25,000"
                style={{ ...inputStyle, paddingLeft: "36px" }}
              />
            </div>
          </FormField>

          <FormField label="Monthly Living Expenses (INR)" required error={errors.monthlyExpenses}>
            <div className="relative">
              <span
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "12px",
                  color: THEME.slateGray,
                  fontWeight: 600,
                }}
              >
                ₹
              </span>
              <input
                type="text"
                value={financial.monthlyExpenses}
                onChange={(e) => update("monthlyExpenses", e.target.value)}
                placeholder="45,000"
                style={{ ...inputStyle, paddingLeft: "36px" }}
              />
            </div>
          </FormField>

          <FormField label="Total Active Loan Principal (INR)" hint="Existing debt lines">
            <div className="relative">
              <span
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "12px",
                  color: THEME.slateGray,
                  fontWeight: 600,
                }}
              >
                ₹
              </span>
              <input
                type="text"
                value={financial.existingLoans}
                onChange={(e) => update("existingLoans", e.target.value)}
                placeholder="3,50,000"
                style={{ ...inputStyle, paddingLeft: "36px" }}
              />
            </div>
          </FormField>

          <FormField label="Current Monthly EMI Commitments (INR)">
            <div className="relative">
              <span
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "12px",
                  color: THEME.slateGray,
                  fontWeight: 600,
                }}
              >
                ₹
              </span>
              <input
                type="text"
                value={financial.emiAmount}
                onChange={(e) => update("emiAmount", e.target.value)}
                placeholder="28,000"
                style={{ ...inputStyle, paddingLeft: "36px" }}
              />
            </div>
          </FormField>

          <FormField label="Total Liquid Savings & Deposits (INR)" required error={errors.savings}>
            <div className="relative">
              <span
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "12px",
                  color: THEME.slateGray,
                  fontWeight: 600,
                }}
              >
                ₹
              </span>
              <input
                type="text"
                value={financial.savings}
                onChange={(e) => update("savings", e.target.value)}
                placeholder="4,20,000"
                style={{ ...inputStyle, paddingLeft: "36px" }}
              />
            </div>
          </FormField>
        </div>

        {/* Dynamic Calculation Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-[#E2DED9]">
          <div
            style={{
              padding: "20px 24px",
              borderRadius: "20px",
              backgroundColor: THEME.white,
              border: `1px solid ${THEME.borderLight}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: THEME.slateGray,
                  letterSpacing: "0.05em",
                }}
              >
                CALCULATED DEBT-TO-INCOME (DTI)
              </p>
              <div className="flex items-baseline gap-3 mt-1">
                <span
                  style={{
                    fontFamily: "'Sofia Sans', sans-serif",
                    fontSize: "28px",
                    fontWeight: 700,
                    color: THEME.ink,
                  }}
                >
                  {dti !== null ? `${dti}%` : "—"}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "999px",
                    backgroundColor:
                      (dti || 0) < 35
                        ? "rgba(34, 197, 94, 0.12)"
                        : (dti || 0) <= 45
                        ? "rgba(243, 115, 56, 0.12)"
                        : "rgba(207, 69, 0, 0.12)",
                    color:
                      (dti || 0) < 35
                        ? "#16A34A"
                        : (dti || 0) <= 45
                        ? THEME.lightSignalOrange
                        : THEME.signalOrange,
                  }}
                >
                  {(dti || 0) < 35
                    ? "Optimal (<35%)"
                    : (dti || 0) <= 45
                    ? "Moderate (35–45%)"
                    : "High Risk (>45%)"}
                </span>
              </div>
            </div>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: THEME.canvas,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                color: THEME.ink,
              }}
            >
              %
            </div>
          </div>

          <div
            style={{
              padding: "20px 24px",
              borderRadius: "20px",
              backgroundColor: THEME.white,
              border: `1px solid ${THEME.borderLight}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: THEME.slateGray,
                  letterSpacing: "0.05em",
                }}
              >
                NET DISPOSABLE SURPLUS / MO
              </p>
              <p
                style={{
                  fontFamily: "'Sofia Sans', sans-serif",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: THEME.ink,
                  marginTop: "4px",
                }}
              >
                ₹{netDisposable.toLocaleString("en-IN")}
              </p>
            </div>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: THEME.canvas,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                color: THEME.ink,
              }}
            >
              ₹
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Step 3: Transactions ────────────────────────────────────────────────────
function StepTransactions() {
  const { transaction, setTransaction, errors } = useAssessment();

  const update = (field: keyof TransactionData, val: string) => {
    setTransaction((prev) => ({ ...prev, [field]: val }));
  };

  const handleVolume = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "");
    const formatted = cleaned ? parseInt(cleaned, 10).toLocaleString("en-IN") : "";
    update("monthlyVolume", formatted);
  };

  return (
    <div className="animate-fade-in">
      <SectionCard
        title="Transaction Behavior & Cash Flow Velocity"
        subtitle="Banking friction indicators, payment frequency, and balance growth trajectory."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <FormField
            label="Average Monthly Transaction Volume (INR)"
            required
            error={errors.monthlyVolume}
          >
            <div className="relative">
              <span
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "12px",
                  color: THEME.slateGray,
                  fontWeight: 600,
                }}
              >
                ₹
              </span>
              <input
                type="text"
                value={transaction.monthlyVolume}
                onChange={(e) => handleVolume(e.target.value)}
                placeholder="3,40,000"
                style={{ ...inputStyle, paddingLeft: "36px" }}
              />
            </div>
          </FormField>

          <FormField label="Monthly Transaction Frequency" required error={errors.frequency}>
            <select
              value={transaction.frequency}
              onChange={(e) => update("frequency", e.target.value)}
              style={inputStyle}
            >
              <option value="Daily (20+ per month)">Daily (20+ transactions / month)</option>
              <option value="Weekly (4–10 per month)">Weekly (4–10 transactions / month)</option>
              <option value="Bi-weekly (2–4 per month)">Bi-weekly (2–4 transactions / month)</option>
              <option value="Sporadic (<2 per month)">Sporadic (&lt;2 transactions / month)</option>
            </select>
          </FormField>

          <FormField label="Quarterly Average Balance Trend" required error={errors.balanceTrend}>
            <div className="grid grid-cols-3 gap-3">
              {[
                { trend: "Growing", icon: TrendingUp },
                { trend: "Stable", icon: Scale },
                { trend: "Declining", icon: TrendingDown },
              ].map(({ trend, icon: IconComponent }) => {
                const isSelected = transaction.balanceTrend === trend;
                return (
                  <button
                    key={trend}
                    type="button"
                    onClick={() => update("balanceTrend", trend)}
                    style={{
                      padding: "14px 8px",
                      borderRadius: "16px",
                      border: `1.5px solid ${isSelected ? THEME.ink : THEME.borderLight}`,
                      backgroundColor: isSelected ? THEME.ink : THEME.white,
                      color: isSelected ? THEME.canvas : THEME.charcoal,
                      fontWeight: isSelected ? 600 : 450,
                      fontSize: "13.5px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <IconComponent
                      size={18}
                      color={isSelected ? THEME.lightSignalOrange : THEME.slateGray}
                    />
                    <span>{trend}</span>
                  </button>
                );
              })}
            </div>
          </FormField>

          <FormField label="Bounced Cheques / Auto-Debits (Past 12M)">
            <select
              value={transaction.bouncedPayments}
              onChange={(e) => update("bouncedPayments", e.target.value)}
              style={inputStyle}
            >
              <option value="0">0 (Zero bounced debits)</option>
              <option value="1">1 incident</option>
              <option value="2">2 incidents</option>
              <option value="3">3+ incidents (Elevated risk)</option>
            </select>
          </FormField>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Step 4: Alternative Signals ─────────────────────────────────────────────
function StepPayments() {
  const { payment, setPayment } = useAssessment();

  const toggle = (field: "electricity" | "water" | "mobileInternet") => {
    setPayment((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="animate-fade-in">
      <SectionCard
        title="Alternative Payment Records & Digital Footprint"
        subtitle="Verify off-bureau data points: utility payment discipline, UPI regularity, and historical credit file."
      >
        {/* Utility Checkboxes with Lucide icons */}
        <div style={{ marginBottom: "28px" }}>
          <label
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: THEME.ink,
              display: "block",
              marginBottom: "12px",
            }}
          >
            Verified Utility Accounts (Timely On-Time History 12M+)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: "electricity", label: "Electricity Bill", icon: Zap, checked: payment.electricity },
              { id: "water", label: "Municipal Water", icon: Droplets, checked: payment.water },
              { id: "mobileInternet", label: "Broadband / Telecom", icon: Wifi, checked: payment.mobileInternet },
            ].map((u) => {
              const IconComp = u.icon;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => toggle(u.id as any)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 18px",
                    borderRadius: "18px",
                    border: `1.5px solid ${u.checked ? THEME.ink : THEME.borderLight}`,
                    backgroundColor: u.checked ? THEME.white : THEME.canvas,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <IconComp
                      size={20}
                      color={u.checked ? THEME.signalOrange : THEME.slateGray}
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: u.checked ? 600 : 450,
                        color: THEME.ink,
                      }}
                    >
                      {u.label}
                    </span>
                  </div>
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      backgroundColor: u.checked ? THEME.ink : THEME.white,
                      border: `1px solid ${THEME.borderLight}`,
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {u.checked && <Check size={13} strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* UPI Activity Intensity Slider */}
        <div style={{ marginBottom: "28px" }}>
          <div className="flex justify-between items-center mb-2">
            <label style={{ fontSize: "14px", fontWeight: 600, color: THEME.ink }}>
              Digital & UPI Activity Intensity (Index 0 – 100)
            </label>
            <span
              style={{
                fontFamily: "'Sofia Sans', sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                color: THEME.ink,
              }}
            >
              {payment.upiActivity} / 100
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={payment.upiActivity}
            onChange={(e) =>
              setPayment((prev) => ({ ...prev, upiActivity: parseInt(e.target.value, 10) }))
            }
            style={{ width: "100%" }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Low (Cash dominant)</span>
            <span>Moderate (Mixed channels)</span>
            <span>High (Extensive digital footprint)</span>
          </div>
        </div>

        {/* Repayment History Dropdown */}
        <FormField label="Historical Loan / Facility Repayment Record">
          <select
            value={payment.repaymentHistory}
            onChange={(e) =>
              setPayment((prev) => ({ ...prev, repaymentHistory: e.target.value }))
            }
            style={inputStyle}
          >
            {REPAYMENT_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </FormField>
      </SectionCard>
    </div>
  );
}

// ─── Step 5: Review ──────────────────────────────────────────────────────────
function StepReview({ onEdit }: { onEdit: (step: number) => void }) {
  const { personal, financial, transaction, payment, dti } = useAssessment();

  const Row = ({
    label,
    value,
  }: {
    label: string;
    value: string | React.ReactNode;
  }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: `1px solid ${THEME.borderLight}`,
        fontSize: "14px",
      }}
    >
      <span style={{ color: THEME.slateGray }}>{label}</span>
      <span style={{ fontWeight: 600, color: THEME.ink, textAlign: "right" }}>
        {value || "—"}
      </span>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div
        style={{
          padding: "24px 30px",
          borderRadius: "24px",
          backgroundColor: THEME.white,
          border: `1.5px solid ${THEME.ink}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
        }}
      >
        <div>
          <div className="eyebrow" style={{ marginBottom: "6px" }}>
            <span className="eyebrow-dot" />
            <span>READY FOR AI SCORING ENGINE</span>
          </div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: 500,
              color: THEME.ink,
              margin: 0,
            }}
          >
            Review Applicant Assessment Dossier
          </h3>
          <p style={{ fontSize: "14px", color: THEME.slateGray, margin: "4px 0 0" }}>
            Verify entered financial figures, liquidity telemetry, and alternative indicators before
            launching the scoring model.
          </p>
        </div>
      </div>

      {/* Personal Dossier */}
      <div
        style={{
          backgroundColor: THEME.lifted,
          borderRadius: "24px",
          padding: "28px",
          border: `1px solid ${THEME.borderLight}`,
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h4 style={{ fontSize: "17px", fontWeight: 600, color: THEME.ink, margin: 0 }}>
            1. Personal Details
          </h4>
          <button
            onClick={() => onEdit(0)}
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: THEME.signalOrange,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Edit Step
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div>
            <Row label="Full Name" value={personal.fullName} />
            <Row label="Age" value={personal.age ? `${personal.age} years` : ""} />
            <Row label="Occupation" value={personal.occupation} />
            <Row label="Business Type" value={personal.businessType} />
          </div>
          <div>
            <Row label="Location" value={personal.location} />
            <Row label="Phone" value={personal.phone} />
            <Row label="Email" value={personal.email} />
            <Row label="Applicant ID" value={personal.customerId} />
          </div>
        </div>
      </div>

      {/* Financial Position */}
      <div
        style={{
          backgroundColor: THEME.lifted,
          borderRadius: "24px",
          padding: "28px",
          border: `1px solid ${THEME.borderLight}`,
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h4 style={{ fontSize: "17px", fontWeight: 600, color: THEME.ink, margin: 0 }}>
            2. Financial Position & Obligations
          </h4>
          <button
            onClick={() => onEdit(1)}
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: THEME.signalOrange,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Edit Step
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div>
            <Row label="Monthly Gross Income" value={`₹${financial.monthlyIncome}`} />
            <Row label="Monthly Living Expenses" value={`₹${financial.monthlyExpenses}`} />
            <Row label="Liquid Savings" value={`₹${financial.savings}`} />
          </div>
          <div>
            <Row label="Active Loan Balance" value={`₹${financial.existingLoans}`} />
            <Row label="Current Monthly EMI" value={`₹${financial.emiAmount}`} />
            <Row
              label="Calculated DTI Ratio"
              value={
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: "999px",
                    backgroundColor: dti && dti < 35 ? "rgba(34,197,94,0.12)" : "rgba(243,115,56,0.12)",
                    color: dti && dti < 35 ? "#16A34A" : THEME.signalOrange,
                    fontWeight: 700,
                  }}
                >
                  {dti !== null ? `${dti}%` : "—"}
                </span>
              }
            />
          </div>
        </div>
      </div>

      {/* Transaction & Alternative Signals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          style={{
            backgroundColor: THEME.lifted,
            borderRadius: "24px",
            padding: "28px",
            border: `1px solid ${THEME.borderLight}`,
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h4 style={{ fontSize: "17px", fontWeight: 600, color: THEME.ink, margin: 0 }}>
              3. Transactions
            </h4>
            <button
              onClick={() => onEdit(2)}
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: THEME.signalOrange,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Edit Step
            </button>
          </div>
          <Row label="Monthly Volume" value={`₹${transaction.monthlyVolume}`} />
          <Row label="Frequency" value={transaction.frequency} />
          <Row label="Balance Trajectory" value={transaction.balanceTrend} />
          <Row label="Bounced Cheques" value={transaction.bouncedPayments} />
        </div>

        <div
          style={{
            backgroundColor: THEME.lifted,
            borderRadius: "24px",
            padding: "28px",
            border: `1px solid ${THEME.borderLight}`,
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h4 style={{ fontSize: "17px", fontWeight: 600, color: THEME.ink, margin: 0 }}>
              4. Alternative Signals
            </h4>
            <button
              onClick={() => onEdit(3)}
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: THEME.signalOrange,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Edit Step
            </button>
          </div>
          <Row
            label="Verified Utilities"
            value={
              [
                payment.electricity ? "Power" : null,
                payment.water ? "Water" : null,
                payment.mobileInternet ? "Telecom" : null,
              ]
                .filter(Boolean)
                .join(", ") || "None"
            }
          />
          <Row label="UPI Activity Index" value={`${payment.upiActivity} / 100`} />
          <Row label="Repayment Record" value={payment.repaymentHistory} />
        </div>
      </div>
    </div>
  );
}

// ─── Live Sidebar ────────────────────────────────────────────────────────────
function AssessmentSidebar() {
  const { currentStep, completion, personal, financial, transaction, payment, dti } =
    useAssessment();

  const inc = parseFloat(financial.monthlyIncome.replace(/,/g, "")) || 0;
  const exp = parseFloat(financial.monthlyExpenses.replace(/,/g, "")) || 0;
  const emi = parseFloat(financial.emiAmount.replace(/,/g, "")) || 0;
  const disposable = Math.max(0, inc - exp - emi);

  const utilitiesCount = [payment.electricity, payment.water, payment.mobileInternet].filter(
    Boolean
  ).length;

  return (
    <div className="space-y-6 sticky top-28">
      {/* Progress Summary Card */}
      <div
        style={{
          backgroundColor: THEME.white,
          borderRadius: "24px",
          padding: "24px",
          border: `1px solid ${THEME.borderLight}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span
            style={{
              fontSize: "11.5px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: THEME.slateGray,
            }}
          >
            ASSESSMENT PROGRESS
          </span>
          <span
            style={{
              fontFamily: "'Sofia Sans', sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              color: THEME.ink,
            }}
          >
            {completion}%
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: "6px",
            borderRadius: "999px",
            backgroundColor: THEME.canvas,
            overflow: "hidden",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${completion}%`,
              backgroundColor: THEME.ink,
              transition: "width 0.4s ease",
            }}
          />
        </div>
        <p style={{ fontSize: "13px", color: THEME.slateGray, margin: 0 }}>
          Step {currentStep + 1} of {STEPS.length}:{" "}
          <strong style={{ color: THEME.ink }}>{STEPS[currentStep]}</strong>
        </p>
      </div>

      {/* Borrower Profile Card */}
      <div
        style={{
          backgroundColor: THEME.white,
          borderRadius: "24px",
          padding: "24px",
          border: `1px solid ${THEME.borderLight}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            paddingBottom: "16px",
            borderBottom: `1px solid ${THEME.borderLight}`,
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              backgroundColor: THEME.ink,
              color: THEME.canvas,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            {personal.fullName ? personal.fullName.charAt(0) : "A"}
          </div>
          <div>
            <h4
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: THEME.ink,
                margin: 0,
              }}
            >
              {personal.fullName || "Applicant Profile"}
            </h4>
            <p
              style={{
                fontSize: "12px",
                color: THEME.slateGray,
                margin: "2px 0 0",
              }}
            >
              {personal.customerId || "CRD-PENDING"}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span style={{ color: THEME.slateGray }}>Occupation</span>
            <span style={{ fontWeight: 600, color: THEME.ink }}>{personal.occupation}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: THEME.slateGray }}>Location</span>
            <span style={{ fontWeight: 600, color: THEME.ink }}>{personal.location || "—"}</span>
          </div>
        </div>
      </div>

      {/* Live Financial Metrics */}
      <div
        style={{
          backgroundColor: THEME.white,
          borderRadius: "24px",
          padding: "24px",
          border: `1px solid ${THEME.borderLight}`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
        }}
      >
        <h4
          style={{
            fontSize: "12px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: THEME.slateGray,
            marginBottom: "16px",
          }}
        >
          LIVE FINANCIAL RATIOS
        </h4>
        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-baseline">
            <span style={{ color: THEME.slateGray }}>Debt-to-Income (DTI)</span>
            <span style={{ fontSize: "16px", fontWeight: 700, color: THEME.ink }}>
              {dti !== null ? `${dti}%` : "—"}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span style={{ color: THEME.slateGray }}>Net Disposable / Mo</span>
            <span style={{ fontWeight: 700, color: THEME.ink }}>
              ₹{disposable.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span style={{ color: THEME.slateGray }}>Utilities Verified</span>
            <span style={{ fontWeight: 700, color: THEME.signalOrange }}>
              {utilitiesCount} of 3
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span style={{ color: THEME.slateGray }}>Balance Trajectory</span>
            <span style={{ fontWeight: 600, color: THEME.ink }}>
              {transaction.balanceTrend}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Action Bar ──────────────────────────────────────────────────────────────
function ActionBar({
  currentStep,
  onBack,
  onSaveDraft,
  onNext,
  onGenerate,
}: {
  currentStep: number;
  onBack: () => void;
  onSaveDraft: () => void;
  onNext: () => void;
  onGenerate: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: THEME.white,
        borderTop: `1px solid ${THEME.borderLight}`,
        boxShadow: "0 -8px 24px rgba(0, 0, 0, 0.06)",
        zIndex: 40,
        padding: "16px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={onBack}
          disabled={currentStep === 0}
          className="btn-ghost"
          style={{
            opacity: currentStep === 0 ? 0.35 : 1,
            cursor: currentStep === 0 ? "not-allowed" : "pointer",
          }}
        >
          <ArrowLeft size={16} />
          <span>Previous Step</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onSaveDraft}
            className="btn-secondary hidden sm:inline-flex"
            style={{ padding: "8px 20px" }}
          >
            <span>Save Draft</span>
          </button>

          {currentStep < 4 ? (
            <button onClick={onNext} className="btn-primary" style={{ padding: "10px 26px" }}>
              <span>Continue to Step 0{currentStep + 2}</span>
              <ArrowRight size={16} strokeWidth={2.2} />
            </button>
          ) : (
            <button
              onClick={onGenerate}
              className="btn-primary"
              style={{
                backgroundColor: THEME.ink,
                padding: "12px 32px",
                fontSize: "15px",
              }}
            >
              <Sparkles size={17} color={THEME.lightSignalOrange} />
              <span>Generate Credit Score & AI Explanation</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Analysis Loading Overlay ────────────────────────────────────────────────
function AnalysisOverlay({ stepText }: { stepText: string }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(20, 20, 19, 0.88)",
        backdropFilter: "blur(8px)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#FFFFFF",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.15)",
          borderTopColor: THEME.lightSignalOrange,
          animation: "spin 1s linear infinite",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
        }}
      >
        <Cpu size={26} color={THEME.lightSignalOrange} />
      </div>
      <h3
        style={{
          fontSize: "24px",
          fontWeight: 500,
          marginBottom: "8px",
          textAlign: "center",
          color: "#FFFFFF",
        }}
      >
        CrediNove AI Engine Processing
      </h3>
      <p
        style={{
          fontSize: "15px",
          color: THEME.dustTaupe,
          marginBottom: "24px",
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        {stepText}
      </p>
      <div
        style={{
          width: "280px",
          height: "4px",
          borderRadius: "999px",
          backgroundColor: "rgba(255,255,255,0.15)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: THEME.lightSignalOrange,
            animation: "pulse 1.5s infinite",
          }}
        />
      </div>
    </div>
  );
}

// ─── Main Assessment Page ────────────────────────────────────────────────────
export default function AssessmentPage() {
  const navigate = useNavigate();
  const {
    currentStep,
    setCurrentStep,
    handleNext,
    handleBack,
    saveDraft,
    savedDraftToast,
    submitAssessmentAndPredict,
    isAnalyzing,
    setIsAnalyzing,
  } = useAssessment();

  const [loadingStepText, setLoadingStepText] = useState(
    "Calibrating traditional financial records..."
  );

  const handleGenerateScore = async () => {
    setIsAnalyzing(true);
    setLoadingStepText("Ingesting financial statements & calculating DTI...");

    const t1 = window.setTimeout(() => {
      setLoadingStepText("Synthesizing utility records & alternative UPI signals...");
    }, 600);
    const t2 = window.setTimeout(() => {
      setLoadingStepText("Running LightGBM 10-fold ensemble on linked demo applicant...");
    }, 1200);

    try {
      await submitAssessmentAndPredict();
    } finally {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      setIsAnalyzing(false);
      navigate("/assessment/results");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: THEME.canvas }}>
      <Navbar />

      <div style={{ paddingTop: "76px" }}>
        <PageHeader />
        <ProgressBar currentStep={currentStep} onSelectStep={(s) => setCurrentStep(s)} />

        {/* Main Form & Sidebar Layout */}
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "36px 24px 140px",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">
            {/* Form Steps */}
            <div>
              {currentStep === 0 && <StepPersonal />}
              {currentStep === 1 && <StepFinancial />}
              {currentStep === 2 && <StepTransactions />}
              {currentStep === 3 && <StepPayments />}
              {currentStep === 4 && <StepReview onEdit={(s) => setCurrentStep(s)} />}
            </div>

            {/* Live Sidebar */}
            <AssessmentSidebar />
          </div>
        </div>
      </div>

      <ActionBar
        currentStep={currentStep}
        onBack={handleBack}
        onSaveDraft={saveDraft}
        onNext={handleNext}
        onGenerate={handleGenerateScore}
      />

      {/* Save Draft Toast */}
      {savedDraftToast && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: THEME.ink,
            color: THEME.canvas,
            padding: "12px 28px",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: 500,
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          }}
          className="animate-fade-in"
        >
          <Check size={16} color={THEME.lightSignalOrange} strokeWidth={2.5} />
          <span>Draft saved successfully to local storage</span>
        </div>
      )}

      {/* Loading Overlay */}
      {isAnalyzing && <AnalysisOverlay stepText={loadingStepText} />}
    </div>
  );
}
