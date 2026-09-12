import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Save,
  Zap,
  Sparkles,
  Cpu,
  Search,
  User,
  DollarSign,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { Navbar } from "../components/common/Navbar";
import { useAssessment } from "../context/AssessmentContext";
import { fieldLabel } from "../constants/fieldLabels";
import {
  ApplicantFormData,
  CONTRACT_TYPES,
  GENDER_OPTIONS,
  OWN_CAR_OPTIONS,
  INCOME_TYPES,
  EDUCATION_TYPES,
  FAMILY_STATUSES,
  HOUSING_TYPES,
  OCCUPATION_TYPES,
  ORGANIZATION_TYPES,
} from "../types/assessment";

// ─── Theme (unchanged from original) ─────────────────────────────────────────
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

// ─── Step definitions ─────────────────────────────────────────────────────────
const STEPS = [
  { label: "Applicant Lookup",            icon: Search   },
  { label: "Financial & Loan",            icon: DollarSign },
  { label: "Applicant & Employment",      icon: User     },
  { label: "Credit & Risk",               icon: ShieldCheck },
  { label: "Review & Submit",             icon: Layers   },
];

// ─── Shared input style (unchanged) ──────────────────────────────────────────
const inputStyle: React.CSSProperties = {
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

// ─── Reusable form primitives (design unchanged) ──────────────────────────────
function FormField({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
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
          {label}{required && <span style={{ color: THEME.signalOrange }}> *</span>}
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
          style={{ fontSize: "22px", fontWeight: 500, color: THEME.ink, marginBottom: "6px" }}
        >
          {title}
        </h3>
        {subtitle && (
          <p style={{ fontSize: "14.5px", color: THEME.slateGray, margin: 0 }}>{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// Convenience: field label lookup shorthand
const fl = (key: string) => fieldLabel(key);

// ─── Numeric field helper ─────────────────────────────────────────────────────
// Formats raw number strings with commas for display; stores raw digits in state.
function NumericInput({
  value,
  onChange,
  placeholder,
  prefix,
  step = "1",
  min,
  max,
}: {
  value: string;
  onChange: (raw: string) => void;
  placeholder?: string;
  prefix?: string;
  step?: string;
  min?: string;
  max?: string;
}) {
  return (
    <div style={{ position: "relative" }}>
      {prefix && (
        <span
          style={{
            position: "absolute",
            left: "16px",
            top: "12px",
            color: THEME.slateGray,
            fontWeight: 600,
            pointerEvents: "none",
          }}
        >
          {prefix}
        </span>
      )}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        step={step}
        min={min}
        max={max}
        style={{ ...inputStyle, paddingLeft: prefix ? "36px" : inputStyle.padding as string }}
      />
    </div>
  );
}

// ─── Page Header (design unchanged) ──────────────────────────────────────────
function PageHeader() {
  const { loadDemoApplicant, resetAssessment, saveDraft } = useAssessment();

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
              Enter an Applicant ID to load their record, review the relevant fields, and
              launch the AI-calibrated credit scoring engine.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={loadDemoApplicant}
              className="btn-secondary"
              style={{ fontSize: "14px", padding: "8px 20px" }}
              title="Pre-fill with demo applicant ID 100001"
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

// ─── Progress Bar (design unchanged) ─────────────────────────────────────────
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
              <div key={step.label} className="flex items-center flex-1 min-w-[190px]">
                <button
                  onClick={() => onSelectStep(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: isCurr ? THEME.white : "transparent",
                    border: isCurr
                      ? `1px solid ${THEME.borderLight}`
                      : "1px solid transparent",
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
                      backgroundColor: isDone || isCurr ? THEME.ink : THEME.white,
                      color: isDone || isCurr ? THEME.canvas : THEME.slateGray,
                      border:
                        isDone || isCurr
                          ? `1.5px solid ${THEME.ink}`
                          : `1px solid ${THEME.borderLight}`,
                      flexShrink: 0,
                    }}
                  >
                    {isDone ? (
                      <Check size={16} strokeWidth={2.5} color="#FFFFFF" />
                    ) : (
                      i + 1
                    )}
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
                      {step.label}
                    </div>
                  </div>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: "1.5px",
                      backgroundColor:
                        i < currentStep ? THEME.ink : THEME.borderLight,
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

// ─── Step 0: Applicant Lookup ─────────────────────────────────────────────────
function StepLookup() {
  const {
    lookupId,
    setLookupId,
    loadApplicantById,
    loadDemoApplicant,
    isLoadingApplicant,
    lookupError,
    errors,
  } = useAssessment();

  const sampleApplicants = [
    { id: "100001", label: "Applicant #100001 (Prime / Low Risk)" },
    { id: "100005", label: "Applicant #100005 (Standard Loan)" },
    { id: "100013", label: "Applicant #100013 (High Credit Tier)" },
    { id: "100028", label: "Applicant #100028 (Thin-File Inclusion)" },
  ];

  const handleConfirmId = async (idToLoad?: string) => {
    const target = idToLoad ?? lookupId;
    if (!target.trim()) return;
    await loadApplicantById(target.trim());
  };

  return (
    <div className="animate-fade-in">
      <SectionCard
        title="Applicant Lookup & Ingestion"
        subtitle="Retrieve benchmark applicant data from the Supabase demo_applicants table to populate the credit evaluation parameters."
      >
        {/* ID input */}
        <div style={{ maxWidth: "560px" }}>
          <FormField
            label={fl("SK_ID_CURR")}
            required
            error={errors.lookupId || lookupError || undefined}
            hint="Database benchmark identifier (SK_ID_CURR)"
          >
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="text"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConfirmId()}
                placeholder="e.g. 100001, 100005, 100013..."
                style={inputStyle}
                autoFocus
                disabled={isLoadingApplicant}
              />
              <button
                onClick={() => handleConfirmId()}
                disabled={isLoadingApplicant}
                className="btn-primary"
                style={{
                  padding: "11px 24px",
                  flexShrink: 0,
                  opacity: isLoadingApplicant ? 0.7 : 1,
                }}
              >
                {isLoadingApplicant ? (
                  <span className="flex items-center gap-2">
                    <span
                      style={{
                        width: "14px",
                        height: "14px",
                        border: "2px solid #FFFFFF",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        display: "inline-block",
                      }}
                    />
                    <span>Loading...</span>
                  </span>
                ) : (
                  <>
                    <Search size={16} />
                    <span>Load Record</span>
                  </>
                )}
              </button>
            </div>
          </FormField>
        </div>

        {/* Quick sample chips */}
        <div style={{ marginTop: "16px", marginBottom: "24px" }}>
          <p
            style={{
              fontSize: "12.5px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: THEME.slateGray,
              marginBottom: "10px",
            }}
          >
            Quick Benchmarks from demo_applicants table:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {sampleApplicants.map((samp) => (
              <button
                key={samp.id}
                onClick={() => {
                  setLookupId(samp.id);
                  handleConfirmId(samp.id);
                }}
                disabled={isLoadingApplicant}
                style={{
                  padding: "8px 16px",
                  borderRadius: "999px",
                  border: `1.5px solid ${
                    lookupId === samp.id ? THEME.ink : THEME.borderLight
                  }`,
                  backgroundColor:
                    lookupId === samp.id ? THEME.ink : THEME.white,
                  color: lookupId === samp.id ? "#FFFFFF" : THEME.ink,
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Sparkles
                  size={13}
                  color={
                    lookupId === samp.id
                      ? THEME.lightSignalOrange
                      : THEME.signalOrange
                  }
                />
                <span>{samp.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Info notice */}
        <div
          style={{
            marginTop: "8px",
            padding: "18px 22px",
            borderRadius: "20px",
            backgroundColor: THEME.canvas,
            border: `1px solid ${THEME.borderLight}`,
            fontSize: "13.5px",
            color: THEME.charcoal,
            lineHeight: 1.6,
            maxWidth: "640px",
          }}
        >
          <p style={{ margin: 0 }}>
            <strong style={{ color: THEME.ink }}>Live Supabase Connection:</strong>{" "}
            Clicking any applicant above or entering an ID queries the live{" "}
            <code>demo_applicants</code> table in Supabase. All 25 form fields are
            auto-populated so you can review them and proceed to the AI credit evaluation.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Step 1: Financial & Loan Information ────────────────────────────────────
function StepFinancial() {
  const { formData, setFormData, errors } = useAssessment();

  const update = (key: keyof ApplicantFormData, val: string) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="animate-fade-in">
      <SectionCard
        title="Financial & Loan Information"
        subtitle="Core loan application details and income profile from the applicant record."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">

          {/* Loan Contract Type */}
          <FormField
            label={fl("NAME_CONTRACT_TYPE")}
            required
            error={errors.NAME_CONTRACT_TYPE}
          >
            <select
              value={formData.NAME_CONTRACT_TYPE}
              onChange={(e) => update("NAME_CONTRACT_TYPE", e.target.value)}
              style={inputStyle}
            >
              <option value="">— Select —</option>
              {CONTRACT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </FormField>

          {/* Total Annual Income */}
          <FormField
            label={fl("AMT_INCOME_TOTAL")}
            required
            error={errors.AMT_INCOME_TOTAL}
            hint="Annual figure from dataset"
          >
            <NumericInput
              value={formData.AMT_INCOME_TOTAL}
              onChange={(v) => update("AMT_INCOME_TOTAL", v)}
              placeholder="e.g. 135000"
              step="1000"
              min="0"
            />
          </FormField>

          {/* Loan Credit Amount */}
          <FormField
            label={fl("AMT_CREDIT")}
            required
            error={errors.AMT_CREDIT}
          >
            <NumericInput
              value={formData.AMT_CREDIT}
              onChange={(v) => update("AMT_CREDIT", v)}
              placeholder="e.g. 568800"
              step="1000"
              min="0"
            />
          </FormField>

          {/* Loan Annuity Amount */}
          <FormField
            label={fl("AMT_ANNUITY")}
            error={errors.AMT_ANNUITY}
          >
            <NumericInput
              value={formData.AMT_ANNUITY}
              onChange={(v) => update("AMT_ANNUITY", v)}
              placeholder="e.g. 20560.5"
              step="0.01"
              min="0"
            />
          </FormField>

          {/* Loaned Goods Price */}
          <FormField
            label={fl("AMT_GOODS_PRICE")}
            error={errors.AMT_GOODS_PRICE}
          >
            <NumericInput
              value={formData.AMT_GOODS_PRICE}
              onChange={(v) => update("AMT_GOODS_PRICE", v)}
              placeholder="e.g. 450000"
              step="1000"
              min="0"
            />
          </FormField>

        </div>

        {/* Derived ratio summary card */}
        {formData.AMT_INCOME_TOTAL && formData.AMT_ANNUITY && (
          <div
            style={{
              marginTop: "8px",
              padding: "18px 24px",
              borderRadius: "20px",
              backgroundColor: THEME.white,
              border: `1px solid ${THEME.borderLight}`,
              display: "inline-flex",
              alignItems: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            {(() => {
              const income = parseFloat(formData.AMT_INCOME_TOTAL) || 0;
              const annuity = parseFloat(formData.AMT_ANNUITY) || 0;
              const credit = parseFloat(formData.AMT_CREDIT) || 0;
              const annuityRatio = income > 0 ? ((annuity / income) * 100).toFixed(1) : "—";
              const creditRatio = income > 0 ? ((credit / income) * 100).toFixed(1) : "—";
              return (
                <>
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: THEME.slateGray, letterSpacing: "0.05em" }}>
                      ANNUITY / INCOME
                    </p>
                    <p style={{ fontFamily: "'Sofia Sans', sans-serif", fontSize: "22px", fontWeight: 700, color: THEME.ink, margin: "2px 0 0" }}>
                      {annuityRatio}%
                    </p>
                  </div>
                  <div style={{ width: "1px", height: "36px", backgroundColor: THEME.borderLight }} />
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: THEME.slateGray, letterSpacing: "0.05em" }}>
                      CREDIT / INCOME
                    </p>
                    <p style={{ fontFamily: "'Sofia Sans', sans-serif", fontSize: "22px", fontWeight: 700, color: THEME.ink, margin: "2px 0 0" }}>
                      {creditRatio}%
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

// ─── Step 2: Applicant & Employment Information ───────────────────────────────
function StepApplicant() {
  const { formData, setFormData, errors } = useAssessment();

  const update = (key: keyof ApplicantFormData, val: string) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  // Convert DAYS_BIRTH (negative days) to a human-readable age in years
  const daysToAge = (days: string): string => {
    const d = parseFloat(days);
    if (!days || isNaN(d)) return "";
    return `${Math.abs(Math.floor(d / 365))} years`;
  };

  // Convert DAYS_EMPLOYED (negative days) to years + months
  const daysToEmployment = (days: string): string => {
    const d = parseFloat(days);
    if (!days || isNaN(d)) return "";
    const totalDays = Math.abs(d);
    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    if (years === 0) return `${months} month${months !== 1 ? "s" : ""}`;
    return `${years} yr${years !== 1 ? "s" : ""} ${months} mo`;
  };

  return (
    <div className="animate-fade-in">
      <SectionCard
        title="Applicant Information"
        subtitle="Demographic and personal classification data from the applicant record."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">

          {/* Gender */}
          <FormField label={fl("CODE_GENDER")} required error={errors.CODE_GENDER}>
            <select
              value={formData.CODE_GENDER}
              onChange={(e) => update("CODE_GENDER", e.target.value)}
              style={inputStyle}
            >
              <option value="">— Select —</option>
              {GENDER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </FormField>

          {/* Car Ownership */}
          <FormField label={fl("FLAG_OWN_CAR")} error={errors.FLAG_OWN_CAR}>
            <select
              value={formData.FLAG_OWN_CAR}
              onChange={(e) => update("FLAG_OWN_CAR", e.target.value)}
              style={inputStyle}
            >
              <option value="">— Select —</option>
              {OWN_CAR_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </FormField>

          {/* Income Type */}
          <FormField label={fl("NAME_INCOME_TYPE")} required error={errors.NAME_INCOME_TYPE}>
            <select
              value={formData.NAME_INCOME_TYPE}
              onChange={(e) => update("NAME_INCOME_TYPE", e.target.value)}
              style={inputStyle}
            >
              <option value="">— Select —</option>
              {INCOME_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </FormField>

          {/* Education Level */}
          <FormField label={fl("NAME_EDUCATION_TYPE")} required error={errors.NAME_EDUCATION_TYPE}>
            <select
              value={formData.NAME_EDUCATION_TYPE}
              onChange={(e) => update("NAME_EDUCATION_TYPE", e.target.value)}
              style={inputStyle}
            >
              <option value="">— Select —</option>
              {EDUCATION_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </FormField>

          {/* Family Status */}
          <FormField label={fl("NAME_FAMILY_STATUS")} error={errors.NAME_FAMILY_STATUS}>
            <select
              value={formData.NAME_FAMILY_STATUS}
              onChange={(e) => update("NAME_FAMILY_STATUS", e.target.value)}
              style={inputStyle}
            >
              <option value="">— Select —</option>
              {FAMILY_STATUSES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </FormField>

          {/* Housing Type */}
          <FormField label={fl("NAME_HOUSING_TYPE")} error={errors.NAME_HOUSING_TYPE}>
            <select
              value={formData.NAME_HOUSING_TYPE}
              onChange={(e) => update("NAME_HOUSING_TYPE", e.target.value)}
              style={inputStyle}
            >
              <option value="">— Select —</option>
              {HOUSING_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </FormField>

        </div>
      </SectionCard>

      <SectionCard
        title="Employment Information"
        subtitle="Age and employment duration in days relative to the application date."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">

          {/* Age (DAYS_BIRTH) */}
          <FormField
            label={fl("DAYS_BIRTH")}
            required
            error={errors.DAYS_BIRTH}
            hint={daysToAge(formData.DAYS_BIRTH) || "e.g. 19241 days"}
          >
            <input
              type="number"
              value={formData.DAYS_BIRTH}
              onChange={(e) => update("DAYS_BIRTH", e.target.value)}
              placeholder="e.g. 19241"
              style={inputStyle}
              min="0"
              step="1"
            />
          </FormField>

          {/* Employment Duration (DAYS_EMPLOYED) */}
          <FormField
            label={fl("DAYS_EMPLOYED")}
            error={errors.DAYS_EMPLOYED}
            hint={daysToEmployment(formData.DAYS_EMPLOYED) || "e.g. 3036 days"}
          >
            <input
              type="number"
              value={formData.DAYS_EMPLOYED}
              onChange={(e) => update("DAYS_EMPLOYED", e.target.value)}
              placeholder="e.g. 3036"
              style={inputStyle}
              min="0"
              step="1"
            />
          </FormField>

          {/* Occupation */}
          <FormField label={fl("OCCUPATION_TYPE")} error={errors.OCCUPATION_TYPE}>
            <select
              value={formData.OCCUPATION_TYPE}
              onChange={(e) => update("OCCUPATION_TYPE", e.target.value)}
              style={inputStyle}
            >
              <option value="">— Select —</option>
              {OCCUPATION_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </FormField>

          {/* Organization Type */}
          <FormField label={fl("ORGANIZATION_TYPE")} error={errors.ORGANIZATION_TYPE}>
            <select
              value={formData.ORGANIZATION_TYPE}
              onChange={(e) => update("ORGANIZATION_TYPE", e.target.value)}
              style={inputStyle}
            >
              <option value="">— Select —</option>
              {ORGANIZATION_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </FormField>

        </div>
      </SectionCard>
    </div>
  );
}

// ─── Step 3: Credit & Risk Information ───────────────────────────────────────
function StepCreditRisk() {
  const { formData, setFormData, errors } = useAssessment();

  const update = (key: keyof ApplicantFormData, val: string) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="animate-fade-in">
      <SectionCard
        title="External Risk Indicators"
        subtitle="Third-party risk scores sourced externally. Values typically range 0–1; higher is lower risk."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">

          <FormField label={fl("EXT_SOURCE_1")} error={errors.EXT_SOURCE_1} hint="0 – 1">
            <input
              type="number"
              value={formData.EXT_SOURCE_1}
              onChange={(e) => update("EXT_SOURCE_1", e.target.value)}
              placeholder="e.g. 0.7524"
              step="0.0001"
              min="0"
              max="1"
              style={inputStyle}
            />
          </FormField>

          <FormField label={fl("EXT_SOURCE_2")} required error={errors.EXT_SOURCE_2} hint="0 – 1">
            <input
              type="number"
              value={formData.EXT_SOURCE_2}
              onChange={(e) => update("EXT_SOURCE_2", e.target.value)}
              placeholder="e.g. 0.6235"
              step="0.0001"
              min="0"
              max="1"
              style={inputStyle}
            />
          </FormField>

          <FormField label={fl("EXT_SOURCE_3")} error={errors.EXT_SOURCE_3} hint="0 – 1">
            <input
              type="number"
              value={formData.EXT_SOURCE_3}
              onChange={(e) => update("EXT_SOURCE_3", e.target.value)}
              placeholder="e.g. 0.5"
              step="0.0001"
              min="0"
              max="1"
              style={inputStyle}
            />
          </FormField>

        </div>
      </SectionCard>

      <SectionCard
        title="Credit Bureau & Social Circle"
        subtitle="Bureau inquiry activity and observed default behaviour in the applicant's social network."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">

          <FormField
            label={fl("DEF_30_CNT_SOCIAL_CIRCLE")}
            error={errors.DEF_30_CNT_SOCIAL_CIRCLE}
          >
            <input
              type="number"
              value={formData.DEF_30_CNT_SOCIAL_CIRCLE}
              onChange={(e) => update("DEF_30_CNT_SOCIAL_CIRCLE", e.target.value)}
              placeholder="e.g. 2"
              step="1"
              min="0"
              style={inputStyle}
            />
          </FormField>

          <FormField
            label={fl("DEF_60_CNT_SOCIAL_CIRCLE")}
            error={errors.DEF_60_CNT_SOCIAL_CIRCLE}
          >
            <input
              type="number"
              value={formData.DEF_60_CNT_SOCIAL_CIRCLE}
              onChange={(e) => update("DEF_60_CNT_SOCIAL_CIRCLE", e.target.value)}
              placeholder="e.g. 2"
              step="1"
              min="0"
              style={inputStyle}
            />
          </FormField>

          <FormField
            label={fl("AMT_REQ_CREDIT_BUREAU_QRT")}
            error={errors.AMT_REQ_CREDIT_BUREAU_QRT}
          >
            <input
              type="number"
              value={formData.AMT_REQ_CREDIT_BUREAU_QRT}
              onChange={(e) => update("AMT_REQ_CREDIT_BUREAU_QRT", e.target.value)}
              placeholder="e.g. 0"
              step="1"
              min="0"
              style={inputStyle}
            />
          </FormField>

        </div>
      </SectionCard>

      <SectionCard
        title="Regional Indicators"
        subtitle="Regional credit quality ratings and population density relative to the national average."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8">

          <FormField
            label={fl("REGION_RATING_CLIENT")}
            required
            error={errors.REGION_RATING_CLIENT}
            hint="1 = best, 3 = worst"
          >
            <select
              value={formData.REGION_RATING_CLIENT}
              onChange={(e) => update("REGION_RATING_CLIENT", e.target.value)}
              style={inputStyle}
            >
              <option value="">— Select —</option>
              <option value="1">1 — Best</option>
              <option value="2">2 — Average</option>
              <option value="3">3 — Below average</option>
            </select>
          </FormField>

          <FormField
            label={fl("REGION_RATING_CLIENT_W_CITY")}
            error={errors.REGION_RATING_CLIENT_W_CITY}
            hint="City-adjusted rating"
          >
            <select
              value={formData.REGION_RATING_CLIENT_W_CITY}
              onChange={(e) => update("REGION_RATING_CLIENT_W_CITY", e.target.value)}
              style={inputStyle}
            >
              <option value="">— Select —</option>
              <option value="1">1 — Best</option>
              <option value="2">2 — Average</option>
              <option value="3">3 — Below average</option>
            </select>
          </FormField>

          <FormField
            label={fl("REGION_POPULATION_RELATIVE")}
            error={errors.REGION_POPULATION_RELATIVE}
            hint="Relative to national avg"
          >
            <input
              type="number"
              value={formData.REGION_POPULATION_RELATIVE}
              onChange={(e) => update("REGION_POPULATION_RELATIVE", e.target.value)}
              placeholder="e.g. 0.018801"
              step="0.000001"
              min="0"
              style={inputStyle}
            />
          </FormField>

        </div>
      </SectionCard>
    </div>
  );
}

// ─── Step 4: Review & Submit ──────────────────────────────────────────────────
function StepReview({ onEdit }: { onEdit: (step: number) => void }) {
  const { formData, originalApplicantData } = useAssessment();

  // Helper: render a label/value row in the review panel
  const Row = ({
    label,
    value,
    changed,
  }: {
    label: string;
    value: string | React.ReactNode;
    changed?: boolean;
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
      <span
        style={{
          fontWeight: 600,
          color: changed ? THEME.signalOrange : THEME.ink,
          textAlign: "right",
        }}
      >
        {value || "—"}
        {changed && (
          <span
            style={{
              marginLeft: "6px",
              fontSize: "10px",
              fontWeight: 700,
              padding: "2px 7px",
              borderRadius: "999px",
              backgroundColor: "rgba(207,69,0,0.1)",
              color: THEME.signalOrange,
              verticalAlign: "middle",
            }}
          >
            EDITED
          </span>
        )}
      </span>
    </div>
  );

  // Check whether a field was changed relative to the original
  const changed = (key: keyof ApplicantFormData): boolean => {
    if (!originalApplicantData) return false;
    return String(formData[key]) !== String(originalApplicantData[key]);
  };

  const daysToAge = (days: string) => {
    const d = parseFloat(days);
    if (!days || isNaN(d)) return days || "—";
    return `${Math.abs(Math.floor(d / 365))} years (${days} days)`;
  };

  const daysToEmployment = (days: string) => {
    const d = parseFloat(days);
    if (!days || isNaN(d)) return days || "—";
    const totalDays = Math.abs(d);
    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    const readable = years > 0 ? `${years} yr${years !== 1 ? "s" : ""} ${months} mo` : `${months} mo`;
    return `${readable} (${days} days)`;
  };

  return (
    <div className="animate-fade-in space-y-6">

      {/* Header banner */}
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
          <h3 style={{ fontSize: "20px", fontWeight: 500, color: THEME.ink, margin: 0 }}>
            Review Applicant Assessment Dossier
          </h3>
          <p style={{ fontSize: "14px", color: THEME.slateGray, margin: "4px 0 0" }}>
            Applicant ID: <strong style={{ color: THEME.ink }}>{formData.SK_ID_CURR || "—"}</strong>
            {originalApplicantData && (
              <span style={{ marginLeft: "12px", fontSize: "12px", color: THEME.slateGray }}>
                Fields highlighted in{" "}
                <span style={{ color: THEME.signalOrange, fontWeight: 600 }}>orange</span> were
                edited from the original record.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Section 1: Financial & Loan */}
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
            1. Financial & Loan Information
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
            <Row label={fl("NAME_CONTRACT_TYPE")} value={formData.NAME_CONTRACT_TYPE} changed={changed("NAME_CONTRACT_TYPE")} />
            <Row label={fl("AMT_INCOME_TOTAL")} value={formData.AMT_INCOME_TOTAL ? Number(formData.AMT_INCOME_TOTAL).toLocaleString() : ""} changed={changed("AMT_INCOME_TOTAL")} />
            <Row label={fl("AMT_CREDIT")} value={formData.AMT_CREDIT ? Number(formData.AMT_CREDIT).toLocaleString() : ""} changed={changed("AMT_CREDIT")} />
          </div>
          <div>
            <Row label={fl("AMT_ANNUITY")} value={formData.AMT_ANNUITY ? Number(formData.AMT_ANNUITY).toLocaleString() : ""} changed={changed("AMT_ANNUITY")} />
            <Row label={fl("AMT_GOODS_PRICE")} value={formData.AMT_GOODS_PRICE ? Number(formData.AMT_GOODS_PRICE).toLocaleString() : ""} changed={changed("AMT_GOODS_PRICE")} />
          </div>
        </div>
      </div>

      {/* Section 2: Applicant & Employment */}
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
            2. Applicant & Employment Information
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div>
            <Row label={fl("CODE_GENDER")} value={GENDER_OPTIONS.find(o => o.value === formData.CODE_GENDER)?.label ?? formData.CODE_GENDER} changed={changed("CODE_GENDER")} />
            <Row label={fl("FLAG_OWN_CAR")} value={OWN_CAR_OPTIONS.find(o => o.value === formData.FLAG_OWN_CAR)?.label ?? formData.FLAG_OWN_CAR} changed={changed("FLAG_OWN_CAR")} />
            <Row label={fl("NAME_INCOME_TYPE")} value={formData.NAME_INCOME_TYPE} changed={changed("NAME_INCOME_TYPE")} />
            <Row label={fl("NAME_EDUCATION_TYPE")} value={formData.NAME_EDUCATION_TYPE} changed={changed("NAME_EDUCATION_TYPE")} />
            <Row label={fl("NAME_FAMILY_STATUS")} value={formData.NAME_FAMILY_STATUS} changed={changed("NAME_FAMILY_STATUS")} />
          </div>
          <div>
            <Row label={fl("NAME_HOUSING_TYPE")} value={formData.NAME_HOUSING_TYPE} changed={changed("NAME_HOUSING_TYPE")} />
            <Row label={fl("DAYS_BIRTH")} value={daysToAge(formData.DAYS_BIRTH)} changed={changed("DAYS_BIRTH")} />
            <Row label={fl("DAYS_EMPLOYED")} value={daysToEmployment(formData.DAYS_EMPLOYED)} changed={changed("DAYS_EMPLOYED")} />
            <Row label={fl("OCCUPATION_TYPE")} value={formData.OCCUPATION_TYPE} changed={changed("OCCUPATION_TYPE")} />
            <Row label={fl("ORGANIZATION_TYPE")} value={formData.ORGANIZATION_TYPE} changed={changed("ORGANIZATION_TYPE")} />
          </div>
        </div>
      </div>

      {/* Section 3: Credit & Risk */}
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
            3. Credit & Risk Information
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div>
            <Row label={fl("EXT_SOURCE_1")} value={formData.EXT_SOURCE_1} changed={changed("EXT_SOURCE_1")} />
            <Row label={fl("EXT_SOURCE_2")} value={formData.EXT_SOURCE_2} changed={changed("EXT_SOURCE_2")} />
            <Row label={fl("EXT_SOURCE_3")} value={formData.EXT_SOURCE_3} changed={changed("EXT_SOURCE_3")} />
            <Row label={fl("DEF_30_CNT_SOCIAL_CIRCLE")} value={formData.DEF_30_CNT_SOCIAL_CIRCLE} changed={changed("DEF_30_CNT_SOCIAL_CIRCLE")} />
            <Row label={fl("DEF_60_CNT_SOCIAL_CIRCLE")} value={formData.DEF_60_CNT_SOCIAL_CIRCLE} changed={changed("DEF_60_CNT_SOCIAL_CIRCLE")} />
          </div>
          <div>
            <Row label={fl("AMT_REQ_CREDIT_BUREAU_QRT")} value={formData.AMT_REQ_CREDIT_BUREAU_QRT} changed={changed("AMT_REQ_CREDIT_BUREAU_QRT")} />
            <Row label={fl("REGION_RATING_CLIENT")} value={formData.REGION_RATING_CLIENT} changed={changed("REGION_RATING_CLIENT")} />
            <Row label={fl("REGION_RATING_CLIENT_W_CITY")} value={formData.REGION_RATING_CLIENT_W_CITY} changed={changed("REGION_RATING_CLIENT_W_CITY")} />
            <Row label={fl("REGION_POPULATION_RELATIVE")} value={formData.REGION_POPULATION_RELATIVE} changed={changed("REGION_POPULATION_RELATIVE")} />
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── Live Sidebar ─────────────────────────────────────────────────────────────
function AssessmentSidebar() {
  const { currentStep, completion, formData } = useAssessment();

  const ext2 = parseFloat(formData.EXT_SOURCE_2) || null;
  const income = parseFloat(formData.AMT_INCOME_TOTAL) || 0;
  const credit = parseFloat(formData.AMT_CREDIT) || 0;
  const annuity = parseFloat(formData.AMT_ANNUITY) || 0;

  return (
    <div className="space-y-6 sticky top-28">

      {/* Progress summary */}
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
          <strong style={{ color: THEME.ink }}>{STEPS[currentStep].label}</strong>
        </p>
      </div>

      {/* Applicant identity card */}
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
            {formData.SK_ID_CURR ? formData.SK_ID_CURR.charAt(0) : "A"}
          </div>
          <div>
            <h4 style={{ fontSize: "15px", fontWeight: 600, color: THEME.ink, margin: 0 }}>
              {formData.SK_ID_CURR
                ? `Applicant #${formData.SK_ID_CURR}`
                : "No applicant loaded"}
            </h4>
            <p style={{ fontSize: "12px", color: THEME.slateGray, margin: "2px 0 0" }}>
              {formData.NAME_INCOME_TYPE || "—"}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span style={{ color: THEME.slateGray }}>{fl("CODE_GENDER")}</span>
            <span style={{ fontWeight: 600, color: THEME.ink }}>
              {GENDER_OPTIONS.find(o => o.value === formData.CODE_GENDER)?.label ?? "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: THEME.slateGray }}>{fl("NAME_EDUCATION_TYPE")}</span>
            <span style={{ fontWeight: 600, color: THEME.ink, textAlign: "right", maxWidth: "160px" }}>
              {formData.NAME_EDUCATION_TYPE || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: THEME.slateGray }}>{fl("OCCUPATION_TYPE")}</span>
            <span style={{ fontWeight: 600, color: THEME.ink, textAlign: "right", maxWidth: "160px" }}>
              {formData.OCCUPATION_TYPE || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Live financial snapshot */}
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
          LIVE FINANCIAL SNAPSHOT
        </h4>
        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-baseline">
            <span style={{ color: THEME.slateGray }}>Annual Income</span>
            <span style={{ fontWeight: 700, color: THEME.ink }}>
              {income ? income.toLocaleString() : "—"}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span style={{ color: THEME.slateGray }}>Loan Amount</span>
            <span style={{ fontWeight: 700, color: THEME.ink }}>
              {credit ? credit.toLocaleString() : "—"}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span style={{ color: THEME.slateGray }}>Annuity / Income</span>
            <span style={{ fontWeight: 700, color: income && annuity ? THEME.ink : THEME.slateGray }}>
              {income && annuity ? `${((annuity / income) * 100).toFixed(1)}%` : "—"}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span style={{ color: THEME.slateGray }}>{fl("EXT_SOURCE_2")}</span>
            <span style={{ fontWeight: 700, color: THEME.signalOrange }}>
              {ext2 !== null ? ext2.toFixed(4) : "—"}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

// ─── Action Bar (design unchanged) ───────────────────────────────────────────
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
              style={{ backgroundColor: THEME.ink, padding: "12px 32px", fontSize: "15px" }}
            >
              <Sparkles size={17} color={THEME.lightSignalOrange} />
              <span>Generate Credit Score &amp; AI Explanation</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Loading overlay (design unchanged) ──────────────────────────────────────
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
        CrediNova AI Engine Processing
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AssessmentPage() {
  const navigate = useNavigate();
  const {
    currentStep,
    setCurrentStep,
    handleNext,
    handleBack,
    saveDraft,
    savedDraftToast,
    generateScore,
    submitAndScore,
    isAnalyzing,
    setIsAnalyzing,
  } = useAssessment();

  const [loadingStepText, setLoadingStepText] = useState(
    "Calibrating external risk indicators..."
  );

  const handleGenerateScore = async () => {
    setIsAnalyzing(true);
    setLoadingStepText("Persisting applicant dossier to Supabase assessments table...");
    setTimeout(() => setLoadingStepText("Evaluating applicant features with 10-fold LightGBM ensemble..."), 600);
    setTimeout(() => setLoadingStepText("Computing tree SHAP factor attributions..."), 1200);
    setTimeout(() => setLoadingStepText("Persisting audit log to Supabase predictions table..."), 1800);

    try {
      await submitAndScore();
    } catch (e) {
      console.error("Score generation error:", e);
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
        navigate("/assessment/results");
      }, 2100);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: THEME.canvas }}>
      <Navbar />

      <div style={{ paddingTop: "76px" }}>
        <PageHeader />
        <ProgressBar currentStep={currentStep} onSelectStep={(s) => setCurrentStep(s)} />

        {/* Main form + sidebar layout (unchanged) */}
        <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "36px 24px 140px" }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start">
            <div>
              {currentStep === 0 && <StepLookup />}
              {currentStep === 1 && <StepFinancial />}
              {currentStep === 2 && <StepApplicant />}
              {currentStep === 3 && <StepCreditRisk />}
              {currentStep === 4 && <StepReview onEdit={(s) => setCurrentStep(s)} />}
            </div>
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

      {/* Save draft toast (design unchanged) */}
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

      {isAnalyzing && <AnalysisOverlay stepText={loadingStepText} />}
    </div>
  );
}
