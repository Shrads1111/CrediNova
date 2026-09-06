import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";
import { useAssessment } from "../context/AssessmentContext";
import {
  PersonalData,
  FinancialData,
  TransactionData,
  PaymentData,
} from "../types/assessment";

const STEPS = [
  "Personal Information",
  "Financial Information",
  "Transaction Behavior",
  "Payment History",
  "Review",
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

function fmtCurrency(v: string) {
  const n = parseFloat(v.replace(/,/g, ""));
  if (isNaN(n)) return "";
  return n.toLocaleString("en-IN");
}

// ─── Header & Stepper ────────────────────────────────────────────────────────
function PageHeader() {
  const { loadDemoApplicant, resetAssessment, saveDraft } = useAssessment();

  return (
    <div style={{ background: "white", borderBottom: "1px solid #E5E7EB", padding: "24px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-teal" style={{ fontSize: 11 }}>
                LOAN OFFICER PORTAL
              </span>
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>·</span>
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>AI-Assisted Assessment</span>
            </div>
            <h1 style={{ fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 800, color: "#1A2B3C", letterSpacing: "-0.02em" }}>
              Customer Credit Assessment
            </h1>
            <p style={{ fontSize: 14, color: "#4B5563", marginTop: 4 }}>
              Enter borrower data and alternative digital signals to calculate real-time credit score, DTI, and default risk.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={loadDemoApplicant}
              className="btn-secondary"
              style={{ fontSize: "13px", padding: "8px 16px" }}
              title="Pre-fill form with Rahul Sharma's verified profile for instant testing"
            >
              <span>⚡</span> Pre-fill Demo Applicant
            </button>
            <button
              onClick={saveDraft}
              className="btn-ghost"
              style={{ fontSize: "13px", padding: "8px 14px" }}
            >
              Save Draft
            </button>
            <button
              onClick={resetAssessment}
              className="btn-ghost"
              style={{ fontSize: "13px", padding: "8px 14px", color: "#EF4444" }}
              title="Reset all form fields"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ currentStep, onSelectStep }: { currentStep: number; onSelectStep: (step: number) => void }) {
  return (
    <div style={{ background: "white", borderBottom: "1px solid #E5E7EB", padding: "16px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {STEPS.map((step, i) => {
            const isDone = i < currentStep;
            const isCurr = i === currentStep;

            return (
              <div key={step} className="flex items-center flex-1 min-w-[170px]">
                <button
                  onClick={() => onSelectStep(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px 8px",
                    borderRadius: 8,
                    textAlign: "left",
                  }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      background: isDone ? "#22C55E" : isCurr ? "#0EA5A0" : "#F3F4F6",
                      color: isDone || isCurr ? "white" : "#6B7280",
                      border: isCurr ? "2px solid #0EA5A0" : "1px solid transparent",
                      flexShrink: 0,
                    }}
                  >
                    {isDone ? "✓" : i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: isCurr ? "#0EA5A0" : "#9CA3AF", letterSpacing: "0.05em" }}>
                      Step {i + 1}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: isCurr ? 700 : 500, color: isCurr ? "#1A2B3C" : "#4B5563", whiteSpace: "nowrap" }}>
                      {step}
                    </div>
                  </div>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      background: i < currentStep ? "#22C55E" : "#E5E7EB",
                      margin: "0 12px",
                      minWidth: 20,
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
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#1A2B3C" }}>
          {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
        </label>
        {hint && <span style={{ fontSize: 11, color: "#9CA3AF" }}>{hint}</span>}
      </div>
      {children}
      {error && (
        <p style={{ fontSize: 12, color: "#EF4444", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="card mb-6">
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1A2B3C", marginBottom: 4 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: 13, color: "#6B7280" }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── Step 1: Personal ────────────────────────────────────────────────────────
function StepPersonal() {
  const { personal, setPersonal, errors } = useAssessment();

  const update = (field: keyof PersonalData, val: string) => {
    setPersonal((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <div className="animate-fade-in">
      <SectionCard
        title="Personal & Demographic Details"
        subtitle="Basic borrower profile information used for identity verification and classification."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <FormField label="Full Name" required error={errors.fullName}>
            <input
              type="text"
              value={personal.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#1A2B3C] bg-white transition-all"
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
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#1A2B3C] bg-white transition-all"
            />
          </FormField>

          <FormField label="Occupation" required>
            <select
              value={personal.occupation}
              onChange={(e) => update("occupation", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#1A2B3C] bg-white transition-all"
            >
              {OCCUPATIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Business / Enterprise Type">
            <select
              value={personal.businessType}
              onChange={(e) => update("businessType", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#1A2B3C] bg-white transition-all"
            >
              {BUSINESS_TYPES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Location / City & State" required error={errors.location}>
            <input
              type="text"
              value={personal.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="e.g. Mumbai, Maharashtra"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#1A2B3C] bg-white transition-all"
            />
          </FormField>

          <FormField label="Contact Phone Number" required error={errors.phone}>
            <input
              type="text"
              value={personal.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#1A2B3C] bg-white transition-all"
            />
          </FormField>

          <FormField label="Email Address">
            <input
              type="email"
              value={personal.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="e.g. rahul.sharma@example.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#1A2B3C] bg-white transition-all"
            />
          </FormField>

          <FormField label="Customer / Applicant ID" hint="Auto-generated or Core Banking ID">
            <input
              type="text"
              value={personal.customerId}
              onChange={(e) => update("customerId", e.target.value)}
              placeholder="CRD-102938"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#1A2B3C] bg-white transition-all"
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
    // Keep numbers and commas
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
        subtitle="Provide monthly earnings, commitments, and savings for debt service capacity calculation."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <FormField label="Monthly Gross Income (₹)" required error={errors.monthlyIncome}>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-gray-400 font-semibold">₹</span>
              <input
                type="text"
                value={financial.monthlyIncome}
                onChange={(e) => update("monthlyIncome", e.target.value)}
                placeholder="1,25,000"
                className="w-full pl-8 pr-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#1A2B3C] bg-white transition-all"
              />
            </div>
          </FormField>

          <FormField label="Monthly Living Expenses (₹)" required error={errors.monthlyExpenses}>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-gray-400 font-semibold">₹</span>
              <input
                type="text"
                value={financial.monthlyExpenses}
                onChange={(e) => update("monthlyExpenses", e.target.value)}
                placeholder="45,000"
                className="w-full pl-8 pr-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#1A2B3C] bg-white transition-all"
              />
            </div>
          </FormField>

          <FormField label="Total Active Loan Principal (₹)" hint="Existing outstanding credit lines">
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-gray-400 font-semibold">₹</span>
              <input
                type="text"
                value={financial.existingLoans}
                onChange={(e) => update("existingLoans", e.target.value)}
                placeholder="3,50,000"
                className="w-full pl-8 pr-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#1A2B3C] bg-white transition-all"
              />
            </div>
          </FormField>

          <FormField label="Current Monthly EMI Outflow (₹)">
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-gray-400 font-semibold">₹</span>
              <input
                type="text"
                value={financial.emiAmount}
                onChange={(e) => update("emiAmount", e.target.value)}
                placeholder="28,000"
                className="w-full pl-8 pr-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#1A2B3C] bg-white transition-all"
              />
            </div>
          </FormField>

          <FormField label="Total Liquid Savings & Deposits (₹)" required error={errors.savings}>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-gray-400 font-semibold">₹</span>
              <input
                type="text"
                value={financial.savings}
                onChange={(e) => update("savings", e.target.value)}
                placeholder="4,20,000"
                className="w-full pl-8 pr-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#1A2B3C] bg-white transition-all"
              />
            </div>
          </FormField>
        </div>

        {/* Dynamic calculation callouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#E5E7EB]">
          <div className="p-4 rounded-xl bg-[#F0FAFA] border border-[#0EA5A0]/20 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#0EA5A0] uppercase tracking-wider">Calculated Debt-to-Income (DTI)</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-[#1A2B3C]">
                  {dti !== null ? `${dti}%` : "—"}
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: (dti || 0) < 35 ? "#DCFCE7" : (dti || 0) <= 45 ? "#FEF3C7" : "#FEE2E2",
                    color: (dti || 0) < 35 ? "#16A34A" : (dti || 0) <= 45 ? "#D97706" : "#DC2626",
                  }}
                >
                  {(dti || 0) < 35 ? "Optimal (<35%)" : (dti || 0) <= 45 ? "Moderate (35–45%)" : "High Risk (>45%)"}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#0EA5A0]/10 flex items-center justify-center text-[#0EA5A0] font-bold">
              %
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Monthly Disposable</p>
              <p className="text-2xl font-extrabold text-[#1A2B3C] mt-1">
                ₹{netDisposable.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
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
        title="Transaction Behavior & Cash Flow Analytics"
        subtitle="Evaluate liquidity velocity, operational stability, and banking friction flags."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <FormField label="Average Monthly Transaction Volume (₹)" required error={errors.monthlyVolume}>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-gray-400 font-semibold">₹</span>
              <input
                type="text"
                value={transaction.monthlyVolume}
                onChange={(e) => handleVolume(e.target.value)}
                placeholder="3,40,000"
                className="w-full pl-8 pr-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#1A2B3C] bg-white transition-all"
              />
            </div>
          </FormField>

          <FormField label="Transaction Frequency" required error={errors.frequency}>
            <select
              value={transaction.frequency}
              onChange={(e) => update("frequency", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#1A2B3C] bg-white transition-all"
            >
              <option value="Daily (20+ per month)">Daily (20+ transactions / month)</option>
              <option value="Weekly (4–10 per month)">Weekly (4–10 transactions / month)</option>
              <option value="Bi-weekly (2–4 per month)">Bi-weekly (2–4 transactions / month)</option>
              <option value="Sporadic (<2 per month)">Sporadic (&lt;2 transactions / month)</option>
            </select>
          </FormField>

          <FormField label="Quarterly Average Balance Trend" required error={errors.balanceTrend}>
            <div className="grid grid-cols-3 gap-3">
              {["Growing", "Stable", "Declining"].map((trend) => {
                const isSelected = transaction.balanceTrend === trend;
                return (
                  <button
                    key={trend}
                    type="button"
                    onClick={() => update("balanceTrend", trend)}
                    style={{
                      padding: "10px",
                      borderRadius: 8,
                      border: `1.5px solid ${isSelected ? "#0EA5A0" : "#E5E7EB"}`,
                      background: isSelected ? "#F0FAFA" : "white",
                      color: isSelected ? "#0EA5A0" : "#4B5563",
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: 13,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span>{trend === "Growing" ? "📈" : trend === "Stable" ? "⚖️" : "📉"}</span>
                    <span>{trend}</span>
                  </button>
                );
              })}
            </div>
          </FormField>

          <FormField label="Bounced Cheques / Failed Auto-Debits (Past 12M)">
            <select
              value={transaction.bouncedPayments}
              onChange={(e) => update("bouncedPayments", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#1A2B3C] bg-white transition-all"
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

// ─── Step 4: Payments ────────────────────────────────────────────────────────
function StepPayments() {
  const { payment, setPayment } = useAssessment();

  const toggle = (field: "electricity" | "water" | "mobileInternet") => {
    setPayment((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="animate-fade-in">
      <SectionCard
        title="Alternative Payment Records & Digital Behavior"
        subtitle="Verify off-bureau data points: utility payment discipline, UPI transaction footprints, and credit history."
      >
        {/* Utility checkboxes */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#1A2B3C", display: "block", marginBottom: 12 }}>
            Utility Services Verified (Timely Payment History 12M+)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "electricity", label: "Electricity Bill", icon: "⚡", checked: payment.electricity },
              { id: "water", label: "Municipal Water", icon: "💧", checked: payment.water },
              { id: "mobileInternet", label: "Broadband / Mobile", icon: "📶", checked: payment.mobileInternet },
            ].map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => toggle(u.id as any)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 16px",
                  borderRadius: 8,
                  border: `1.5px solid ${u.checked ? "#22C55E" : "#E5E7EB"}`,
                  background: u.checked ? "#F0FDF4" : "white",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span style={{ fontSize: 18 }}>{u.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: u.checked ? "#16A34A" : "#4B5563" }}>
                    {u.label}
                  </span>
                </div>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    background: u.checked ? "#22C55E" : "#E5E7EB",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {u.checked ? "✓" : ""}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* UPI slider */}
        <div style={{ marginBottom: 24 }}>
          <div className="flex justify-between items-center mb-2">
            <label style={{ fontSize: 13, fontWeight: 600, color: "#1A2B3C" }}>
              Digital & UPI Activity Intensity (Index 0 – 100)
            </label>
            <span className="badge badge-teal font-mono font-bold">
              {payment.upiActivity} / 100
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={payment.upiActivity}
            onChange={(e) => setPayment((prev) => ({ ...prev, upiActivity: parseInt(e.target.value, 10) }))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Low (Cash dominant)</span>
            <span>Moderate (Mixed channels)</span>
            <span>High (Extensive digital footprint)</span>
          </div>
        </div>

        {/* Repayment History */}
        <FormField label="Historical Loan / Facility Repayment Record">
          <select
            value={payment.repaymentHistory}
            onChange={(e) => setPayment((prev) => ({ ...prev, repaymentHistory: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#1A2B3C] bg-white transition-all"
          >
            {REPAYMENT_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
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

  const Row = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
    <div className="flex justify-between items-center py-2 border-b border-[#F3F4F6] text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-[#1A2B3C] text-right">{value || "—"}</span>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      {/* Overview Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#0EA5A0]/10 via-[#14B8A6]/10 to-[#22C55E]/10 border border-[#0EA5A0]/30 flex items-center justify-between">
        <div>
          <span className="badge badge-teal font-bold text-xs uppercase mb-1">
            Ready For AI Scoring
          </span>
          <h3 className="text-lg font-bold text-[#1A2B3C]">
            Review Applicant Assessment Details
          </h3>
          <p className="text-xs text-gray-600">
            Please verify all entered financial figures and alternative indicators prior to generating the AI score.
          </p>
        </div>
      </div>

      {/* Section 1 */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-[#1A2B3C] text-base">1. Personal Details</h4>
          <button onClick={() => onEdit(0)} className="text-xs font-bold text-[#0EA5A0] hover:underline">
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

      {/* Section 2 */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-[#1A2B3C] text-base">2. Financial Position</h4>
          <button onClick={() => onEdit(1)} className="text-xs font-bold text-[#0EA5A0] hover:underline">
            Edit Step
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div>
            <Row label="Monthly Gross Income" value={`₹${financial.monthlyIncome}`} />
            <Row label="Monthly Expenses" value={`₹${financial.monthlyExpenses}`} />
            <Row label="Liquid Savings" value={`₹${financial.savings}`} />
          </div>
          <div>
            <Row label="Active Loan Balance" value={`₹${financial.existingLoans}`} />
            <Row label="Current EMI Commitments" value={`₹${financial.emiAmount}`} />
            <Row
              label="Calculated DTI Ratio"
              value={
                <span className={`badge ${dti && dti < 35 ? "badge-green" : "badge-amber"}`}>
                  {dti !== null ? `${dti}%` : "—"}
                </span>
              }
            />
          </div>
        </div>
      </div>

      {/* Section 3 & 4 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-[#1A2B3C] text-base">3. Transactions</h4>
            <button onClick={() => onEdit(2)} className="text-xs font-bold text-[#0EA5A0] hover:underline">
              Edit Step
            </button>
          </div>
          <Row label="Monthly Volume" value={`₹${transaction.monthlyVolume}`} />
          <Row label="Frequency" value={transaction.frequency} />
          <Row label="Balance Trend" value={transaction.balanceTrend} />
          <Row label="Bounced Cheques" value={transaction.bouncedPayments} />
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-[#1A2B3C] text-base">4. Alternative Signals</h4>
            <button onClick={() => onEdit(3)} className="text-xs font-bold text-[#0EA5A0] hover:underline">
              Edit Step
            </button>
          </div>
          <Row
            label="Verified Utilities"
            value={[
              payment.electricity ? "Power" : null,
              payment.water ? "Water" : null,
              payment.mobileInternet ? "Telecom" : null,
            ].filter(Boolean).join(", ") || "None"}
          />
          <Row label="UPI Activity Score" value={`${payment.upiActivity} / 100`} />
          <Row label="Repayment History" value={payment.repaymentHistory} />
        </div>
      </div>
    </div>
  );
}

// ─── Live Sidebar ────────────────────────────────────────────────────────────
function AssessmentSidebar() {
  const { currentStep, completion, personal, financial, transaction, payment, dti } = useAssessment();

  const inc = parseFloat(financial.monthlyIncome.replace(/,/g, "")) || 0;
  const exp = parseFloat(financial.monthlyExpenses.replace(/,/g, "")) || 0;
  const emi = parseFloat(financial.emiAmount.replace(/,/g, "")) || 0;
  const disposable = Math.max(0, inc - exp - emi);

  const utilitiesCount = [payment.electricity, payment.water, payment.mobileInternet].filter(Boolean).length;

  return (
    <div className="space-y-5 sticky top-24">
      {/* Progress summary card */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0EA5A0]">
            Assessment Progress
          </span>
          <span className="text-sm font-extrabold text-[#1A2B3C] font-mono">{completion}%</span>
        </div>
        <div className="w-full bg-[#E5E7EB] rounded-full h-2 overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${completion}%`,
              background: "linear-gradient(90deg, #0EA5A0, #22C55E)",
            }}
          />
        </div>
        <p className="text-xs text-gray-500">
          Step {currentStep + 1} of {STEPS.length}: <strong>{STEPS[currentStep]}</strong>
        </p>
      </div>

      {/* Borrower Card */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E5E7EB]">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0EA5A0] to-[#22C55E] text-white font-bold flex items-center justify-center text-sm shadow-sm">
            {personal.fullName ? personal.fullName.charAt(0) : "A"}
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#1A2B3C] leading-tight">
              {personal.fullName || "Applicant Profile"}
            </h4>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">
              {personal.customerId || "CRD-PENDING"}
            </p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Occupation</span>
            <span className="font-semibold text-[#1A2B3C]">{personal.occupation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Location</span>
            <span className="font-semibold text-[#1A2B3C] truncate max-w-[150px]">{personal.location || "—"}</span>
          </div>
        </div>
      </div>

      {/* Live Financial Metrics */}
      <div className="card">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Live Financial Ratio
        </h4>
        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-baseline">
            <span className="text-gray-500">Debt-to-Income (DTI)</span>
            <span className="text-base font-extrabold text-[#1A2B3C]">
              {dti !== null ? `${dti}%` : "—"}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-gray-500">Net Disposable / Mo</span>
            <span className="font-bold text-[#1A2B3C]">₹{disposable.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-gray-500">Utilities Verified</span>
            <span className="font-bold text-[#0EA5A0]">{utilitiesCount} of 3</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-gray-500">Balance Trajectory</span>
            <span className="font-semibold text-[#1A2B3C]">{transaction.balanceTrend}</span>
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
        background: "white",
        borderTop: "1px solid #E5E7EB",
        boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
        zIndex: 40,
        padding: "14px 24px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={onBack}
          disabled={currentStep === 0}
          className="btn-ghost"
          style={{ opacity: currentStep === 0 ? 0.4 : 1, cursor: currentStep === 0 ? "not-allowed" : "pointer" }}
        >
          ← Back
        </button>

        <div className="flex items-center gap-3">
          <button onClick={onSaveDraft} className="btn-secondary hidden sm:inline-flex">
            Save Draft
          </button>

          {currentStep < 4 ? (
            <button onClick={onNext} className="btn-primary">
              Continue to Step {currentStep + 2} →
            </button>
          ) : (
            <button
              onClick={onGenerate}
              className="btn-primary"
              style={{ background: "linear-gradient(135deg, #0EA5A0 0%, #14B8A6 50%, #22C55E 100%)", padding: "12px 28px" }}
            >
              ⚡ Generate Credit Score & AI Explanation
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
        background: "rgba(10, 25, 41, 0.85)",
        backdropFilter: "blur(6px)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        padding: 24,
      }}
    >
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-[#0EA5A0]/20 animate-ping" />
        <div className="w-20 h-20 rounded-full border-4 border-t-[#0EA5A0] border-r-[#22C55E] border-b-transparent border-l-transparent animate-spin flex items-center justify-center">
          <span className="text-xl">🧠</span>
        </div>
      </div>
      <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, textAlign: "center" }}>
        CrediNove AI Engine Processing
      </h3>
      <p style={{ fontSize: 14, color: "#9CA3AF", marginBottom: 16, textAlign: "center" }}>
        {stepText}
      </p>
      <div className="w-64 bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0EA5A0] to-[#22C55E] h-full w-full animate-pulse" />
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
    generateScore,
    isAnalyzing,
    setIsAnalyzing,
  } = useAssessment();

  const [loadingStepText, setLoadingStepText] = useState("Calibrating traditional financial records...");

  const handleGenerateScore = () => {
    setIsAnalyzing(true);
    setLoadingStepText("Ingesting financial statements & calculating DTI...");

    setTimeout(() => {
      setLoadingStepText("Synthesizing utility records & alternative UPI signals...");
    }, 600);

    setTimeout(() => {
      setLoadingStepText("Computing risk classification & SHAP factor contributions...");
    }, 1200);

    setTimeout(() => {
      generateScore();
      setIsAnalyzing(false);
      navigate("/assessment/results");
    }, 1800);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F7FAFA" }}>
      <Navbar />

      <div style={{ paddingTop: 64 }}>
        <PageHeader />
        <ProgressBar currentStep={currentStep} onSelectStep={(s) => setCurrentStep(s)} />

        {/* Main 2-column form & sidebar */}
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "28px 24px 120px",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
            {/* Form area */}
            <div>
              {currentStep === 0 && <StepPersonal />}
              {currentStep === 1 && <StepFinancial />}
              {currentStep === 2 && <StepTransactions />}
              {currentStep === 3 && <StepPayments />}
              {currentStep === 4 && <StepReview onEdit={(s) => setCurrentStep(s)} />}
            </div>

            {/* Sidebar */}
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

      {/* Save draft toast */}
      {savedDraftToast && (
        <div
          style={{
            position: "fixed",
            bottom: 84,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1A2B3C",
            color: "white",
            padding: "10px 22px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          }}
        >
          <span style={{ color: "#22C55E" }}>✓</span> Draft saved successfully to local storage
        </div>
      )}

      {/* Loading sequence overlay */}
      {isAnalyzing && <AnalysisOverlay stepText={loadingStepText} />}
    </div>
  );
}
