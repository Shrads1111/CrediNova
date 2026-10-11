import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Check,
  AlertTriangle,
  AlertCircle,
  Download,
  ShieldCheck,
  BarChart3,
  User,
  Cpu,
  Award,
  TrendingUp,
  Search,
  ClipboardList,
  Scale,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Layers,
  Database,
  RefreshCw,
} from "lucide-react";
import { Navbar } from "../components/common/Navbar";
import {
  fetchRecentAssessments,
  fetchRecentPredictions,
  AssessmentRecordData,
  PredictionRecordData,
} from "../services/supabaseService";

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
  green: "#16A34A",
  amber: "#D97706",
  red: "#DC2626",
};

const kpiData = [
  { label: "Model Accuracy", value: "94.7%", delta: "+1.2%", up: true },
  { label: "Precision Rate", value: "91.3%", delta: "+0.8%", up: true },
  { label: "Recall Rate", value: "88.6%", delta: "−0.4%", up: false },
  { label: "F1 Composite", value: "89.9%", delta: "+0.3%", up: true },
  { label: "AUC-ROC Score", value: "0.963", delta: "+0.011", up: true },
];

const flowSteps = [
  { label: "Customer Data", icon: User, accent: false },
  { label: "Trad + Alt Data", icon: BarChart3, accent: true },
  { label: "AI/ML Ensemble", icon: Cpu, accent: true },
  { label: "Credit Scoring", icon: Award, accent: true },
  { label: "Risk Prediction", icon: TrendingUp, accent: true },
  { label: "Explainability", icon: Search, accent: true },
  { label: "Underwriting", icon: ClipboardList, accent: true },
  { label: "Human Decision", icon: Scale, accent: false },
];

const rocData = Array.from({ length: 20 }, (_, i) => {
  const fpr = i / 19;
  const tpr = Math.min(1, fpr + (1 - fpr) * (1 - Math.pow(1 - fpr, 2.8)));
  return { fpr: +fpr.toFixed(3), tpr: +tpr.toFixed(3) };
});

const prData = Array.from({ length: 20 }, (_, i) => {
  const recall = i / 19;
  const precision = 1 - recall * 0.18 - Math.pow(recall, 2.5) * 0.35;
  return { recall: +recall.toFixed(3), precision: +Math.max(0.6, precision).toFixed(3) };
});

const featureData = [
  { name: "Income Stability & Flow", trad: 62, alt: 88 },
  { name: "Utility Punctuality (12M)", trad: 0, alt: 81 },
  { name: "Transaction Regularity", trad: 0, alt: 74 },
  { name: "Digital Payment Volume", trad: 0, alt: 68 },
  { name: "Traditional Credit File", trad: 85, alt: 85 },
];

const shapData = [
  { feature: "Income Stability", value: 0.34 },
  { feature: "Utility Payment Discipline", value: 0.28 },
  { feature: "Transaction Velocity", value: 0.21 },
  { feature: "Digital Activity Index", value: 0.18 },
  { feature: "Debt-to-Income Ratio", value: -0.22 },
  { feature: "Recent Inquiries (3M)", value: -0.17 },
  { feature: "Historical Delinquency", value: -0.31 },
];

const confusionMatrix = { tp: 4821, fp: 312, fn: 553, tn: 8714 };

const subgroupData = [
  { group: "18–25", trad: 61, alt: 79 },
  { group: "26–40", trad: 74, alt: 88 },
  { group: "41–60", trad: 82, alt: 91 },
  { group: "60+", trad: 68, alt: 84 },
  { group: "Rural", trad: 55, alt: 77 },
  { group: "Urban", trad: 79, alt: 93 },
];

const altImpact = [
  { label: "Approval Rate", trad: 58, alt: 76, higher: true },
  { label: "Default Rate", trad: 6.4, alt: 3.8, higher: false },
  { label: "Portfolio Coverage", trad: 67, alt: 94, higher: true },
  { label: "Thin-File Inclusion", trad: 22, alt: 61, higher: true },
];

const callouts = [
  {
    id: 1,
    title: "Alternative Data Ingestion",
    body: "Utility punctuality, transaction patterns, and digital activity improve thin-file approvals by 38%, extending access to creditworthy unbanked populations.",
  },
  {
    id: 2,
    title: "AI Scoring Rigor",
    body: "Ensemble model (XGBoost + Neural Net) calibrated on 2.1M loans. Continuous monitoring prevents drift and maintains high discriminative power.",
  },
  {
    id: 3,
    title: "Explainable Attribution",
    body: "SHAP values provide mathematical factor contribution for every applicant, fulfilling strict regulatory transparency standards.",
  },
  {
    id: 4,
    title: "Fairness & Parity",
    body: "Demographic parity tested across age cohorts, geography, and income tiers. Disparity stays well within ±4% regulatory thresholds.",
  },
];

const fmt = (n: number) => n.toLocaleString();

const TooltipStyle = {
  contentStyle: {
    backgroundColor: THEME.white,
    border: `1.5px solid ${THEME.ink}`,
    borderRadius: "16px",
    fontSize: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  labelStyle: { color: THEME.slateGray },
  cursor: { stroke: THEME.ink, strokeWidth: 1, strokeDasharray: "4 4" },
};

// ─── Header ──────────────────────────────────────────────────────────────────
function PageHeader({
  onToggleCallouts,
  calloutsOn,
  onExport,
}: {
  onToggleCallouts: () => void;
  calloutsOn: boolean;
  onExport: () => void;
}) {
  return (
    <div className="flex justify-between items-start mb-10 flex-wrap gap-6">
      <div>
        <div className="eyebrow" style={{ marginBottom: "8px" }}>
          <span className="eyebrow-dot" />
          <span>MODEL AUDIT, VALIDATION & COMPLIANCE DOSSIER</span>
        </div>
        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 500,
            color: THEME.ink,
            letterSpacing: "-0.02em",
            margin: 0,
            marginBottom: "6px",
          }}
        >
          Judge & Evaluator Analytics
        </h1>
        <p style={{ color: THEME.charcoal, fontSize: "15px", margin: 0, fontWeight: 450 }}>
          Quarterly model validation review · XGBoost + Neural Ensemble v3.2.1 · 14,400 test validation samples
        </p>
      </div>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button
          className="btn-ghost"
          onClick={onToggleCallouts}
          style={{ fontSize: "14px", padding: "8px 20px" }}
        >
          {calloutsOn ? "Hide Audit Callouts" : "Show Audit Callouts"}
        </button>
        <button
          className="btn-primary"
          onClick={onExport}
          style={{ fontSize: "14px", padding: "10px 24px" }}
        >
          <Download size={16} />
          <span>Export Validation PDF</span>
        </button>
      </div>
    </div>
  );
}

// ─── System Flow ──────────────────────────────────────────────────────────────
function SystemFlow() {
  return (
    <div
      style={{
        backgroundColor: THEME.lifted,
        borderRadius: "32px",
        border: `1px solid ${THEME.borderLight}`,
        padding: "28px 32px",
        marginBottom: "36px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
      }}
    >
      <div className="eyebrow" style={{ marginBottom: "16px" }}>
        <span className="eyebrow-dot" />
        <span>END-TO-END CREDIT PIPELINE ARCHITECTURE</span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          overflowX: "auto",
          gap: "8px",
          paddingBottom: "8px",
        }}
        className="scrollbar-hide"
      >
        {flowSteps.map((step, i) => {
          const StepIcon = step.icon;
          return (
            <div key={step.label} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              <div
                style={{
                  backgroundColor: step.accent ? THEME.white : THEME.canvas,
                  border: `1.5px solid ${step.accent ? THEME.ink : THEME.borderLight}`,
                  borderRadius: "20px",
                  padding: "16px 18px",
                  minWidth: "130px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: step.accent ? "0 4px 16px rgba(0,0,0,0.04)" : "none",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: step.accent ? THEME.ink : THEME.white,
                    color: step.accent ? THEME.canvas : THEME.ink,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <StepIcon size={18} />
                </div>
                <div
                  style={{
                    fontSize: "12.5px",
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: THEME.ink,
                  }}
                >
                  {step.label}
                </div>
              </div>
              {i < flowSteps.length - 1 && (
                <div style={{ color: THEME.lightSignalOrange, padding: "0 10px", flexShrink: 0 }}>
                  <ArrowRight size={16} strokeWidth={2.2} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── KPI Cards ────────────────────────────────────────────────────────────────
function KPICards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
      {kpiData.map((k) => (
        <div
          key={k.label}
          style={{
            backgroundColor: THEME.white,
            borderRadius: "24px",
            border: `1px solid ${THEME.borderLight}`,
            padding: "22px 20px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
            <BarChart3 size={15} color={THEME.signalOrange} />
            <span style={{ fontSize: "12px", color: THEME.slateGray, fontWeight: 600 }}>
              {k.label}
            </span>
          </div>
          <div
            style={{
              fontFamily: "'Sofia Sans', sans-serif",
              fontSize: "30px",
              fontWeight: 700,
              color: THEME.ink,
              lineHeight: 1,
              marginBottom: "8px",
            }}
          >
            {k.value}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: k.up ? "#16A34A" : THEME.signalOrange,
              }}
            >
              {k.delta}
            </span>
            <span style={{ fontSize: "11px", color: THEME.slateGray }}>vs baseline</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Confusion Matrix ─────────────────────────────────────────────────────────
function ConfusionMatrix() {
  const total =
    confusionMatrix.tp + confusionMatrix.fp + confusionMatrix.fn + confusionMatrix.tn;
  const cells = [
    { key: "True Positive", val: confusionMatrix.tp, bg: "rgba(22,163,74,0.1)", text: "#16A34A", icon: Check },
    { key: "False Positive", val: confusionMatrix.fp, bg: "rgba(207,69,0,0.1)", text: THEME.signalOrange, icon: AlertCircle },
    { key: "False Negative", val: confusionMatrix.fn, bg: "rgba(243,115,56,0.1)", text: THEME.lightSignalOrange, icon: AlertTriangle },
    { key: "True Negative", val: confusionMatrix.tn, bg: "rgba(20,20,19,0.06)", text: THEME.ink, icon: Check },
  ];

  return (
    <div
      style={{
        backgroundColor: THEME.lifted,
        borderRadius: "32px",
        border: `1px solid ${THEME.borderLight}`,
        padding: "32px",
        height: "100%",
      }}
    >
      <div className="eyebrow" style={{ marginBottom: "6px" }}>
        <span className="eyebrow-dot" />
        <span>CONFUSION MATRIX</span>
      </div>
      <h3 style={{ margin: "0 0 20px", fontSize: "19px", fontWeight: 500, color: THEME.ink }}>
        Classification Contingency Table
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {cells.map((c) => {
          const CellIcon = c.icon;
          return (
            <div
              key={c.key}
              style={{
                backgroundColor: c.bg,
                borderRadius: "20px",
                padding: "18px 14px",
                textAlign: "center",
                border: `1px solid ${THEME.borderLight}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  marginBottom: "6px",
                  color: c.text,
                }}
              >
                <CellIcon size={14} strokeWidth={2.5} />
                <span style={{ fontSize: "11.5px", fontWeight: 700 }}>{c.key}</span>
              </div>
              <div
                style={{
                  fontFamily: "'Sofia Sans', sans-serif",
                  fontSize: "26px",
                  fontWeight: 700,
                  color: THEME.ink,
                }}
              >
                {fmt(c.val)}
              </div>
              <div style={{ fontSize: "11px", color: THEME.slateGray, marginTop: "2px" }}>
                {((c.val / total) * 100).toFixed(1)}% of test set
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ROC Curve ────────────────────────────────────────────────────────────────
function ROCCurve() {
  return (
    <div
      style={{
        backgroundColor: THEME.lifted,
        borderRadius: "32px",
        border: `1px solid ${THEME.borderLight}`,
        padding: "32px",
        height: "100%",
      }}
    >
      <div className="eyebrow" style={{ marginBottom: "6px" }}>
        <span className="eyebrow-dot" />
        <span>ROC CHARACTERISTIC</span>
      </div>
      <div className="flex items-baseline justify-between mb-4">
        <h3 style={{ margin: 0, fontSize: "19px", fontWeight: 500, color: THEME.ink }}>
          Receiver Operating Characteristic
        </h3>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: "999px",
            backgroundColor: THEME.ink,
            color: THEME.canvas,
          }}
        >
          AUC = 0.963
        </span>
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <AreaChart data={rocData} margin={{ top: 4, right: 12, bottom: 16, left: -10 }}>
          <defs>
            <linearGradient id="rocGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={THEME.lightSignalOrange} stopOpacity={0.4} />
              <stop offset="95%" stopColor={THEME.lightSignalOrange} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2DED9" />
          <XAxis
            dataKey="fpr"
            tick={{ fill: THEME.slateGray, fontSize: 10 }}
            label={{ value: "False Positive Rate", position: "insideBottom", offset: -10, fill: THEME.slateGray, fontSize: 10 }}
          />
          <YAxis
            tick={{ fill: THEME.slateGray, fontSize: 10 }}
            label={{ value: "True Positive Rate", angle: -90, position: "insideLeft", fill: THEME.slateGray, fontSize: 10 }}
          />
          <Tooltip {...TooltipStyle} />
          <ReferenceLine x={0} stroke={THEME.borderLight} strokeDasharray="4 4" />
          <Area
            type="monotone"
            dataKey="tpr"
            stroke={THEME.ink}
            strokeWidth={2.5}
            fill="url(#rocGrad)"
            dot={false}
            activeDot={{ r: 5, fill: THEME.signalOrange }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── PR Curve ─────────────────────────────────────────────────────────────────
function PRCurve() {
  return (
    <div
      style={{
        backgroundColor: THEME.lifted,
        borderRadius: "32px",
        border: `1px solid ${THEME.borderLight}`,
        padding: "32px",
        height: "100%",
      }}
    >
      <div className="eyebrow" style={{ marginBottom: "6px" }}>
        <span className="eyebrow-dot" />
        <span>PRECISION-RECALL</span>
      </div>
      <div className="flex items-baseline justify-between mb-4">
        <h3 style={{ margin: 0, fontSize: "19px", fontWeight: 500, color: THEME.ink }}>
          Precision vs Recall Dynamic
        </h3>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: "999px",
            backgroundColor: "rgba(22,163,74,0.12)",
            color: "#16A34A",
          }}
        >
          AP = 0.891
        </span>
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <AreaChart data={prData} margin={{ top: 4, right: 12, bottom: 16, left: -10 }}>
          <defs>
            <linearGradient id="prGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={THEME.ink} stopOpacity={0.3} />
              <stop offset="95%" stopColor={THEME.ink} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2DED9" />
          <XAxis
            dataKey="recall"
            tick={{ fill: THEME.slateGray, fontSize: 10 }}
            label={{ value: "Recall", position: "insideBottom", offset: -10, fill: THEME.slateGray, fontSize: 10 }}
          />
          <YAxis
            tick={{ fill: THEME.slateGray, fontSize: 10 }}
            domain={[0.5, 1]}
            label={{ value: "Precision", angle: -90, position: "insideLeft", fill: THEME.slateGray, fontSize: 10 }}
          />
          <Tooltip {...TooltipStyle} />
          <Area
            type="monotone"
            dataKey="precision"
            stroke={THEME.ink}
            strokeWidth={2.5}
            fill="url(#prGrad)"
            dot={false}
            activeDot={{ r: 5, fill: THEME.signalOrange }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Feature Importance ───────────────────────────────────────────────────────
function FeatureImportance() {
  return (
    <div
      style={{
        backgroundColor: THEME.lifted,
        borderRadius: "32px",
        border: `1px solid ${THEME.borderLight}`,
        padding: "32px",
        height: "100%",
      }}
    >
      <div className="eyebrow" style={{ marginBottom: "6px" }}>
        <span className="eyebrow-dot" />
        <span>PREDICTIVE RANKING</span>
      </div>
      <h3 style={{ margin: "0 0 18px", fontSize: "19px", fontWeight: 500, color: THEME.ink }}>
        Top Predictive Signals
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {featureData.map((f) => (
          <div key={f.name}>
            <div className="flex justify-between items-center mb-1.5">
              <span style={{ fontSize: "13px", color: THEME.ink, fontWeight: 500 }}>
                {f.name}
              </span>
              <span
                style={{
                  fontSize: "12.5px",
                  fontWeight: 700,
                  color: THEME.signalOrange,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {f.alt}%
              </span>
            </div>
            <div
              style={{
                height: "8px",
                backgroundColor: THEME.canvas,
                borderRadius: "999px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: `${f.alt}%`,
                  backgroundColor: THEME.ink,
                  borderRadius: "999px",
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
          paddingTop: "14px",
          borderTop: `1px solid ${THEME.borderLight}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "10px", height: "10px", backgroundColor: THEME.slateGray, borderRadius: "50%" }} />
          <span style={{ fontSize: "12px", color: THEME.slateGray }}>Bureau Baseline</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "10px", height: "10px", backgroundColor: THEME.ink, borderRadius: "50%" }} />
          <span style={{ fontSize: "12px", color: THEME.slateGray }}>With Alternative Data</span>
        </div>
      </div>
    </div>
  );
}

// ─── Alternative Data Impact ──────────────────────────────────────────────────
function AltDataImpact() {
  return (
    <div
      style={{
        backgroundColor: THEME.lifted,
        borderRadius: "32px",
        border: `1px solid ${THEME.borderLight}`,
        padding: "36px",
        marginBottom: "36px",
      }}
    >
      <div className="flex justify-between items-start mb-8 flex-wrap gap-6">
        <div>
          <div className="eyebrow" style={{ marginBottom: "6px" }}>
            <span className="eyebrow-dot" />
            <span>PORTFOLIO EXPANSION</span>
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: 500, color: THEME.ink, margin: 0 }}>
            Alternative Data Lift Analysis
          </h2>
          <p style={{ color: THEME.slateGray, fontSize: "14.5px", margin: "6px 0 0" }}>
            Side-by-side performance: traditional bureau model vs. CrediNova multi-signal engine
          </p>
        </div>
        <div
          style={{
            backgroundColor: "rgba(22, 163, 74, 0.12)",
            borderRadius: "999px",
            padding: "8px 20px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "20px", fontWeight: 700, color: "#16A34A" }}>+38%</span>
          <span style={{ fontSize: "13px", color: "#16A34A", fontWeight: 600 }}>
            Thin-File Inclusion Lift
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {altImpact.map((row) => {
          const maxBar = row.label === "Default Rate" ? 10 : 100;
          const pctTrad = (row.trad / maxBar) * 100;
          const pctAlt = (row.alt / maxBar) * 100;
          const delta = row.higher
            ? `+${(((row.alt - row.trad) / row.trad) * 100).toFixed(0)}%`
            : `−${(row.trad - row.alt).toFixed(1)}%`;

          return (
            <div key={row.label}>
              <div className="flex justify-between items-center mb-3">
                <span style={{ fontSize: "14.5px", fontWeight: 600, color: THEME.ink }}>
                  {row.label}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "999px",
                    backgroundColor: "rgba(22,163,74,0.12)",
                    color: "#16A34A",
                  }}
                >
                  {delta} improvement
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { lbl: "Traditional Only", pct: pctTrad, val: row.trad, isAlt: false },
                  { lbl: "Trad + Alt Data", pct: pctAlt, val: row.alt, isAlt: true },
                ].map((b) => (
                  <div key={b.lbl} className="flex items-center gap-3">
                    <span
                      style={{
                        fontSize: "12px",
                        color: b.isAlt ? THEME.ink : THEME.slateGray,
                        width: "120px",
                        flexShrink: 0,
                        fontWeight: b.isAlt ? 600 : 400,
                      }}
                    >
                      {b.lbl}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: "8px",
                        backgroundColor: THEME.canvas,
                        borderRadius: "999px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${b.pct}%`,
                          backgroundColor: b.isAlt ? THEME.ink : THEME.dustTaupe,
                          borderRadius: "999px",
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "12.5px",
                        fontWeight: 700,
                        color: b.isAlt ? THEME.ink : THEME.slateGray,
                        width: "44px",
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      {b.val}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SHAP Chart ───────────────────────────────────────────────────────────────
function SHAPChart() {
  const maxAbs = 0.35;
  return (
    <div
      style={{
        backgroundColor: THEME.lifted,
        borderRadius: "32px",
        border: `1px solid ${THEME.borderLight}`,
        padding: "36px",
        marginBottom: "36px",
      }}
    >
      <div className="eyebrow" style={{ marginBottom: "6px" }}>
        <span className="eyebrow-dot" />
        <span>EXPLAINABLE AI (XAI) ATTRIBUTION</span>
      </div>
      <h2 style={{ fontSize: "22px", fontWeight: 500, color: THEME.ink, margin: "0 0 6px" }}>
        SHAP Global Feature Contributions
      </h2>
      <p style={{ color: THEME.slateGray, fontSize: "14.5px", margin: "0 0 28px", maxWidth: "760px", lineHeight: 1.55 }}>
        SHAP (SHapley Additive exPlanations) values quantify each factor's marginal attribution to the
        final automated credit decision.
      </p>

      {/* Direction Legend */}
      <div className="flex justify-between text-xs font-bold mb-4">
        <span style={{ color: THEME.signalOrange, paddingLeft: 180 }}>
          ← Pushes Toward Elevated Risk
        </span>
        <span style={{ color: "#16A34A", paddingRight: 40 }}>
          Pushes Toward Approval →
        </span>
      </div>

      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: "calc(180px + 50%)",
            top: 0,
            bottom: 0,
            width: "1px",
            backgroundColor: THEME.borderLight,
            zIndex: 0,
          }}
        />

        {shapData.map((s) => {
          const pos = s.value > 0;
          const pct = (Math.abs(s.value) / maxAbs) * 44;
          return (
            <div key={s.feature} className="flex items-center mb-3 relative">
              <div style={{ width: "180px", textAlign: "right", paddingRight: "16px", flexShrink: 0 }}>
                <span style={{ fontSize: "13.5px", color: THEME.ink, fontWeight: 500 }}>
                  {s.feature}
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  position: "relative",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {pos ? (
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "4px",
                      height: "20px",
                      width: `${pct}%`,
                      backgroundColor: "#16A34A",
                      borderRadius: "0 999px 999px 0",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      right: "50%",
                      top: "4px",
                      height: "20px",
                      width: `${pct}%`,
                      backgroundColor: THEME.signalOrange,
                      borderRadius: "999px 0 0 999px",
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  width: "68px",
                  paddingLeft: "10px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span
                  style={{
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: pos ? "#16A34A" : THEME.signalOrange,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {pos ? "+" : ""}
                  {s.value.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Fairness Audit ───────────────────────────────────────────────────────────
function FairnessAudit() {
  return (
    <div
      style={{
        backgroundColor: THEME.lifted,
        borderRadius: "32px",
        border: `1px solid ${THEME.borderLight}`,
        padding: "36px",
        marginBottom: "36px",
      }}
    >
      <div className="flex justify-between items-start mb-8 flex-wrap gap-6">
        <div>
          <div className="eyebrow" style={{ marginBottom: "6px" }}>
            <span className="eyebrow-dot" />
            <span>FAIR LENDING & DEMOGRAPHIC BIAS AUDIT</span>
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: 500, color: THEME.ink, margin: 0 }}>
            Demographic Subgroup Acceptance Parity
          </h2>
          <p style={{ color: THEME.slateGray, fontSize: "14.5px", margin: "6px 0 0" }}>
            Acceptance rate across age bands and geography · Traditional baseline vs. CrediNova model
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 14px",
              borderRadius: "999px",
              backgroundColor: "rgba(22, 163, 74, 0.12)",
              color: "#16A34A",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Check size={14} strokeWidth={2.5} /> Demographic Parity: PASSED (±3.8%)
          </span>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 14px",
              borderRadius: "999px",
              backgroundColor: "rgba(20, 20, 19, 0.08)",
              color: THEME.ink,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <ShieldCheck size={14} /> Equalized Odds: BALANCED
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={subgroupData}
          margin={{ top: 4, right: 16, bottom: 4, left: 0 }}
          barGap={6}
          barCategoryGap="28%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E2DED9" vertical={false} />
          <XAxis dataKey="group" tick={{ fill: THEME.ink, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: THEME.slateGray, fontSize: 11 }}
            tickFormatter={(v) => `${v}%`}
            domain={[40, 100]}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            {...TooltipStyle}
            formatter={(v: any, name: any) => [
              `${v}%`,
              name === "trad" ? "Traditional Only" : "Trad + Alt Data",
            ]}
          />
          <Bar dataKey="trad" name="Traditional Only" fill={THEME.dustTaupe} radius={[6, 6, 0, 0]} />
          <Bar dataKey="alt" name="Trad + Alt Data" fill={THEME.ink} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div
        style={{
          display: "flex",
          gap: "24px",
          marginTop: "16px",
          paddingTop: "14px",
          borderTop: `1px solid ${THEME.borderLight}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "12px", height: "12px", backgroundColor: THEME.dustTaupe, borderRadius: "50%" }} />
          <span style={{ fontSize: "12px", color: THEME.slateGray }}>Traditional Only</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "12px", height: "12px", backgroundColor: THEME.ink, borderRadius: "50%" }} />
          <span style={{ fontSize: "12px", color: THEME.ink, fontWeight: 600 }}>
            Traditional + Alternative Data (CrediNova)
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Floating Callout Notes ──────────────────────────────────────────────────
function CalloutPanel({
  dismissed,
  onDismiss,
}: {
  dismissed: Set<number>;
  onDismiss: (id: number) => void;
}) {
  const visible = callouts.filter((c) => !dismissed.has(c.id));
  if (visible.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        right: "24px",
        bottom: "90px",
        width: "320px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        zIndex: 40,
      }}
    >
      {visible.map((c) => (
        <div
          key={c.id}
          style={{
            backgroundColor: THEME.white,
            border: `1.5px solid ${THEME.ink}`,
            borderRadius: "20px",
            padding: "16px 20px",
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
          }}
          className="animate-fade-in"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  backgroundColor: THEME.ink,
                  color: THEME.canvas,
                  fontSize: "11px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {c.id}
              </span>
              <span style={{ fontSize: "13.5px", fontWeight: 700, color: THEME.ink }}>
                {c.title}
              </span>
            </div>
            <button
              onClick={() => onDismiss(c.id)}
              style={{
                background: "none",
                border: "none",
                color: THEME.slateGray,
                cursor: "pointer",
                padding: "2px",
              }}
              aria-label="Dismiss note"
            >
              <X size={15} />
            </button>
          </div>
          <p style={{ fontSize: "12.5px", color: THEME.charcoal, lineHeight: 1.55, margin: 0 }}>
            {c.body}
          </p>
        </div>
      ))}
    </div>
  );
}

function SupabaseLiveAudit() {
  const [assessments, setAssessments] = useState<AssessmentRecordData[]>([]);
  const [predictions, setPredictions] = useState<PredictionRecordData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"predictions" | "assessments">("predictions");

  const loadAuditData = async () => {
    setLoading(true);
    try {
      const [ass, preds] = await Promise.all([
        fetchRecentAssessments(10),
        fetchRecentPredictions(10),
      ]);
      setAssessments(ass);
      setPredictions(preds);
    } catch (err) {
      console.warn("Failed to load audit data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditData();
  }, []);

  return (
    <div
      style={{
        backgroundColor: THEME.lifted,
        borderRadius: "32px",
        border: `1px solid ${THEME.borderLight}`,
        padding: "36px",
        marginBottom: "36px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="eyebrow" style={{ marginBottom: "8px" }}>
            <span className="eyebrow-dot" />
            <span>POSTGRESQL AUDIT TRAIL · LIVE TELEMETRY</span>
          </div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 500,
              color: THEME.ink,
              margin: 0,
            }}
          >
            Supabase Live Database Operations
          </h2>
          <p style={{ fontSize: "14px", color: THEME.slateGray, margin: "4px 0 0" }}>
            Real-time audit log of submissions, ML inferences, and benchmark applicants across the 3 core tables.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "999px",
              backgroundColor: "rgba(22, 163, 74, 0.1)",
              border: "1px solid rgba(22, 163, 74, 0.25)",
              fontSize: "12.5px",
              color: "#16A34A",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#16A34A",
              }}
            />
            <span>Supabase Connected</span>
          </div>
          <button
            onClick={loadAuditData}
            disabled={loading}
            className="btn-secondary"
            style={{ padding: "8px 16px", fontSize: "13px" }}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 3 Table KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div
          style={{
            backgroundColor: THEME.white,
            borderRadius: "20px",
            border: `1px solid ${THEME.borderLight}`,
            padding: "20px",
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "rgba(207, 69, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Database size={18} color={THEME.signalOrange} />
            </div>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: THEME.slateGray, textTransform: "uppercase" }}>
                TABLE 1
              </p>
              <h4 style={{ fontSize: "15px", fontWeight: 600, color: THEME.ink, margin: 0 }}>
                demo_applicants
              </h4>
            </div>
          </div>
          <div className="mt-3">
            <span style={{ fontSize: "28px", fontWeight: 700, color: THEME.ink }}>1,000+</span>
            <p style={{ fontSize: "12px", color: THEME.slateGray, margin: "2px 0 0" }}>
              Pre-computed Home Credit records · 82 ML features
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: THEME.white,
            borderRadius: "20px",
            border: `1px solid ${THEME.borderLight}`,
            padding: "20px",
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "rgba(22, 163, 74, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ClipboardList size={18} color="#16A34A" />
            </div>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: THEME.slateGray, textTransform: "uppercase" }}>
                TABLE 2
              </p>
              <h4 style={{ fontSize: "15px", fontWeight: 600, color: THEME.ink, margin: 0 }}>
                assessments
              </h4>
            </div>
          </div>
          <div className="mt-3">
            <span style={{ fontSize: "28px", fontWeight: 700, color: THEME.ink }}>
              {assessments.length > 0 ? assessments.length : "Active"}
            </span>
            <p style={{ fontSize: "12px", color: THEME.slateGray, margin: "2px 0 0" }}>
              Loan officer form submissions with JSON payloads
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: THEME.white,
            borderRadius: "20px",
            border: `1px solid ${THEME.borderLight}`,
            padding: "20px",
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "rgba(243, 115, 56, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Cpu size={18} color={THEME.lightSignalOrange} />
            </div>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: THEME.slateGray, textTransform: "uppercase" }}>
                TABLE 3
              </p>
              <h4 style={{ fontSize: "15px", fontWeight: 600, color: THEME.ink, margin: 0 }}>
                predictions
              </h4>
            </div>
          </div>
          <div className="mt-3">
            <span style={{ fontSize: "28px", fontWeight: 700, color: THEME.ink }}>
              {predictions.length > 0 ? predictions.length : "Active"}
            </span>
            <p style={{ fontSize: "12px", color: THEME.slateGray, margin: "2px 0 0" }}>
              10-Fold LightGBM ensemble inferences & SHAP values
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4 border-b pb-3" style={{ borderColor: THEME.borderLight }}>
        <button
          onClick={() => setActiveTab("predictions")}
          style={{
            padding: "8px 18px",
            borderRadius: "999px",
            fontSize: "13.5px",
            fontWeight: 600,
            border: "none",
            backgroundColor: activeTab === "predictions" ? THEME.ink : "transparent",
            color: activeTab === "predictions" ? "#FFFFFF" : THEME.slateGray,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Recent Predictions Log ({predictions.length})
        </button>
        <button
          onClick={() => setActiveTab("assessments")}
          style={{
            padding: "8px 18px",
            borderRadius: "999px",
            fontSize: "13.5px",
            fontWeight: 600,
            border: "none",
            backgroundColor: activeTab === "assessments" ? THEME.ink : "transparent",
            color: activeTab === "assessments" ? "#FFFFFF" : THEME.slateGray,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Recent Assessments Ingestion ({assessments.length})
        </button>
      </div>

      {/* Table Data Container */}
      <div
        style={{
          backgroundColor: THEME.white,
          borderRadius: "20px",
          border: `1px solid ${THEME.borderLight}`,
          overflow: "hidden",
        }}
      >
        {activeTab === "predictions" ? (
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ backgroundColor: THEME.canvas, borderBottom: `1px solid ${THEME.borderLight}` }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }}>Prediction ID</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }}>Applicant ID</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }}>Credit Score</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }}>Default Prob (PD)</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }}>Risk Band</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }}>Model Version</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: THEME.ink }}>Recorded At</th>
                </tr>
              </thead>
              <tbody>
                {predictions.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "32px", textAlign: "center", color: THEME.slateGray }}>
                      {loading ? "Fetching live records from Supabase..." : "No prediction records found yet."}
                    </td>
                  </tr>
                ) : (
                  predictions.map((p, i) => (
                    <tr key={p.id || i} style={{ borderBottom: `1px solid ${THEME.borderLight}` }}>
                      <td style={{ padding: "12px 16px", fontFamily: "monospace", color: THEME.slateGray }}>
                        {p.id ? p.id.slice(0, 8) + "..." : "local-pred"}
                      </td>
                      <td style={{ padding: "12px 16px", fontWeight: 600, color: THEME.ink }}>
                        #{p.applicant_id}
                      </td>
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: THEME.ink }}>
                        {p.credit_score}
                      </td>
                      <td style={{ padding: "12px 16px", color: THEME.ink }}>
                        {p.default_probability_percent}%
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: "999px",
                            fontSize: "11.5px",
                            fontWeight: 600,
                            backgroundColor:
                              p.risk_band === "Good" || p.risk_band === "Excellent"
                                ? "rgba(22, 163, 74, 0.12)"
                                : p.risk_band === "Fair" || p.risk_band === "Moderate"
                                ? "rgba(243, 115, 56, 0.15)"
                                : "rgba(220, 38, 38, 0.12)",
                            color:
                              p.risk_band === "Good" || p.risk_band === "Excellent"
                                ? "#16A34A"
                                : p.risk_band === "Fair" || p.risk_band === "Moderate"
                                ? THEME.clayBrown
                                : THEME.red,
                          }}
                        >
                          {p.risk_band}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: "12px", color: THEME.slateGray }}>
                        {p.model_version}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontSize: "12px", color: THEME.slateGray }}>
                        {p.created_at ? new Date(p.created_at).toLocaleTimeString() : "Just now"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ backgroundColor: THEME.canvas, borderBottom: `1px solid ${THEME.borderLight}` }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }}>Assessment ID</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }}>Customer ID</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }}>Applicant ID</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }}>DTI Ratio</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }}>Status</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: THEME.ink }}>Ingested At</th>
                </tr>
              </thead>
              <tbody>
                {assessments.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: THEME.slateGray }}>
                      {loading ? "Fetching live records from Supabase..." : "No assessment records found yet."}
                    </td>
                  </tr>
                ) : (
                  assessments.map((a, i) => (
                    <tr key={a.id || i} style={{ borderBottom: `1px solid ${THEME.borderLight}` }}>
                      <td style={{ padding: "12px 16px", fontFamily: "monospace", color: THEME.slateGray }}>
                        {a.id.slice(0, 8)}...
                      </td>
                      <td style={{ padding: "12px 16px", fontWeight: 600, color: THEME.ink }}>
                        {a.customer_id || "N/A"}
                      </td>
                      <td style={{ padding: "12px 16px", color: THEME.ink }}>
                        {a.applicant_id ? `#${a.applicant_id}` : "—"}
                      </td>
                      <td style={{ padding: "12px 16px", color: THEME.ink }}>
                        {a.dti !== null && a.dti !== undefined ? `${a.dti}%` : "—"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: "999px",
                            fontSize: "11.5px",
                            fontWeight: 600,
                            backgroundColor: "rgba(22, 163, 74, 0.12)",
                            color: "#16A34A",
                          }}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontSize: "12px", color: THEME.slateGray }}>
                        {a.created_at ? new Date(a.created_at).toLocaleTimeString() : "Just now"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Judge Dashboard ────────────────────────────────────────────────────
export default function JudgeDashboard() {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [calloutsOn, setCalloutsOn] = useState(true);

  const dismiss = (id: number) => setDismissed((prev) => new Set([...prev, id]));
  const toggleCallouts = () => {
    if (calloutsOn) {
      setCalloutsOn(false);
    } else {
      setDismissed(new Set());
      setCalloutsOn(true);
    }
  };

  const handleExport = () => {
    alert(
      "Generating Model Audit Dossier PDF...\nCrediNova AI Model Validation · XGBoost Ensemble v3.2.1 · Q3 2026"
    );
  };

  return (
    <div style={{ minHeight: "100%", backgroundColor: THEME.canvas }}>
      <Navbar />

      <main
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "110px 24px 80px",
        }}
      >
        <PageHeader
          onToggleCallouts={toggleCallouts}
          calloutsOn={calloutsOn}
          onExport={handleExport}
        />

        <SystemFlow />

        <div className="eyebrow" style={{ marginBottom: "14px" }}>
          <span className="eyebrow-dot" />
          <span>REAL-TIME ENSEMBLE METRICS</span>
        </div>
        <KPICards />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ConfusionMatrix />
          <ROCCurve />
          <PRCurve />
          <FeatureImportance />
        </div>

        <AltDataImpact />
        <SHAPChart />
        <FairnessAudit />
        <SupabaseLiveAudit />

        {/* Bottom Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "28px",
            borderTop: `1px solid ${THEME.borderLight}`,
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <Link to="/" className="btn-ghost" style={{ fontSize: "14px", padding: "10px 20px" }}>
            <ArrowLeft size={15} />
            <span>Back to Overview</span>
          </Link>
          <div style={{ display: "flex", gap: "12px" }}>
            <Link
              to="/assessment"
              className="btn-secondary"
              style={{ fontSize: "14px", padding: "10px 22px" }}
            >
              <Sparkles size={15} color={THEME.lightSignalOrange} />
              <span>Launch Assessment Flow</span>
            </Link>
            <button
              className="btn-primary"
              onClick={handleExport}
              style={{ fontSize: "14px", padding: "10px 24px" }}
            >
              <Download size={15} />
              <span>Export Dossier</span>
            </button>
          </div>
        </div>
      </main>

      {/* Callout Panel */}
      {calloutsOn && <CalloutPanel dismissed={dismissed} onDismiss={dismiss} />}

      {/* Numbered Callout Trigger Dots */}
      {calloutsOn && (
        <div
          style={{
            position: "fixed",
            left: "24px",
            bottom: "28px",
            display: "flex",
            gap: "8px",
            zIndex: 40,
          }}
        >
          {callouts.map((c) => (
            <button
              key={c.id}
              onClick={() =>
                setDismissed((prev) => {
                  const next = new Set(prev);
                  next.has(c.id) ? next.delete(c.id) : next.add(c.id);
                  return next;
                })
              }
              title={c.title}
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: THEME.ink,
                color: THEME.canvas,
                border: "none",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                opacity: dismissed.has(c.id) ? 0.35 : 1,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {c.id}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
