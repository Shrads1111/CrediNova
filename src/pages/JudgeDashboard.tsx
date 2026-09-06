import React, { useState } from "react";
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
import { Navbar } from "../components/common/Navbar";

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = {
  check: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 7l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warn: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1.5L13 12.5H1L7 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M7 6v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="7" cy="10.5" r="0.7" fill="currentColor" />
    </svg>
  ),
  alert: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1.5L13 12.5H1L7 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M7 5.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="7" cy="10" r="0.7" fill="currentColor" />
    </svg>
  ),
  export: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1v8M4 5l3-4 3 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 10v2a1 1 0 001 1h8a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  shield: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1.5L12 3.5v3.5c0 3-2.5 5-5 6-2.5-1-5-3-5-6V3.5L7 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  chart: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="7" width="3" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="5.5" y="4" width="3" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="10" y="1.5" width="3" height="11" rx="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const kpiData = [
  { label: "Accuracy", value: "94.7%", delta: "+1.2%", up: true },
  { label: "Precision", value: "91.3%", delta: "+0.8%", up: true },
  { label: "Recall", value: "88.6%", delta: "−0.4%", up: false },
  { label: "F1 Score", value: "89.9%", delta: "+0.3%", up: true },
  { label: "AUC-ROC", value: "0.963", delta: "+0.011", up: true },
];

const flowSteps = [
  { label: "Customer Data", icon: "👤", accent: false },
  { label: "Traditional + Alt Data", icon: "📊", accent: true },
  { label: "AI/ML Model", icon: "🧠", accent: true },
  { label: "Credit Score", icon: "💯", accent: true },
  { label: "Risk Prediction", icon: "📈", accent: true },
  { label: "Explainability", icon: "🔍", accent: true },
  { label: "Loan Recommendation", icon: "📋", accent: true },
  { label: "Human Decision", icon: "⚖️", accent: false },
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
  { name: "Income Stability", trad: 62, alt: 88 },
  { name: "Utility Payments", trad: 0, alt: 81 },
  { name: "Transaction Behavior", trad: 0, alt: 74 },
  { name: "Digital Payment Activity", trad: 0, alt: 68 },
  { name: "Traditional Credit History", trad: 85, alt: 85 },
];

const shapData = [
  { feature: "Income Stability", value: 0.34 },
  { feature: "Utility Payment History", value: 0.28 },
  { feature: "Transaction Regularity", value: 0.21 },
  { feature: "Digital Pay Activity", value: 0.18 },
  { feature: "Debt-to-Income Ratio", value: -0.22 },
  { feature: "Recent Credit Inquiries", value: -0.17 },
  { feature: "Late Payment History", value: -0.31 },
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
  { label: "Model Coverage", trad: 67, alt: 94, higher: true },
  { label: "Thin-File Approvals", trad: 22, alt: 61, higher: true },
];

const callouts = [
  { id: 1, title: "Alternative Data", body: "Utility payments, transaction patterns, and digital activity improve thin-file approvals by 38%, extending credit access to underserved segments." },
  { id: 2, title: "AI Credit Score", body: "Ensemble model (XGBoost + Neural Net) trained on 2.1M applications. Quarterly retraining cycle with drift detection and champion/challenger testing." },
  { id: 3, title: "Explainable AI", body: "SHAP values provide per-applicant factor breakdown, satisfying RBI and Basel III interpretability requirements for all automated credit decisions." },
  { id: 4, title: "Fairness Audit", body: "Demographic parity tested across age, geography, and income bands. All subgroups within ±4% acceptance rate differential, meeting regulatory thresholds." },
];

const fmt = (n: number) => n.toLocaleString();
const TEAL = "#0EA5A0";
const TEAL2 = "#14B8A6";
const GREEN = "#22C55E";
const RED = "#EF4444";
const NAVY = "#1A2B3C";
const SLATE = "#4B5563";
const BORDER = "#E5E7EB";
const GRAY_L = "#9CA3AF";
const WHITE = "#FFFFFF";

const TooltipStyle = {
  contentStyle: { background: WHITE, border: `1px solid ${BORDER}`, borderRadius: 10, fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" },
  labelStyle: { color: SLATE },
  cursor: { stroke: TEAL, strokeWidth: 1, strokeDasharray: "4 4" },
};

// ─── Header ──────────────────────────────────────────────────────────────────
function PageHeader({ onToggleCallouts, calloutsOn, onExport }: { onToggleCallouts: () => void; calloutsOn: boolean; onExport: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
      <div>
        <div className="section-label" style={{ marginBottom: 6 }}>CrediNove · Model Audit & Compliance Dashboard</div>
        <h1 style={{ fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 800, color: NAVY, margin: 0, marginBottom: 6 }}>
          Judge & Evaluator Analytics
        </h1>
        <p style={{ color: SLATE, fontSize: 15, margin: 0 }}>
          Quarterly model validation review · XGBoost Ensemble v3.2.1 · 14,400 test validation samples
        </p>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button className="btn-ghost" onClick={onToggleCallouts} style={{ fontSize: 13 }}>
          {calloutsOn ? "Hide Audit Callouts" : "Show Audit Callouts"}
        </button>
        <button className="btn-primary" onClick={onExport} style={{ fontSize: 13, padding: "8px 16px" }}>
          <Icon.export /> Export Validation PDF
        </button>
      </div>
    </div>
  );
}

// ─── System Flow ──────────────────────────────────────────────────────────────
function SystemFlow() {
  return (
    <div className="card" style={{ marginBottom: 32, padding: "20px 24px" }}>
      <div className="section-label" style={{ marginBottom: 14 }}>AI Credit Pipeline Overview</div>
      <div style={{ display: "flex", alignItems: "center", overflowX: "auto", gap: 0, paddingBottom: 6 }}>
        {flowSteps.map((step, i) => (
          <div key={step.label} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <div
              style={{
                background: step.accent ? `linear-gradient(135deg, ${TEAL}15, ${TEAL2}20)` : "#F9FAFB",
                border: `1px solid ${step.accent ? TEAL + "50" : BORDER}`,
                borderRadius: 10,
                padding: "10px 14px",
                minWidth: 114,
                textAlign: "center",
                transition: "box-shadow 0.2s",
                cursor: "default",
              }}
              className="card-hover"
            >
              <div style={{ fontSize: 20, marginBottom: 5 }}>{step.icon}</div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  lineHeight: 1.35,
                  color: step.accent ? TEAL : SLATE,
                }}
              >
                {step.label}
              </div>
            </div>
            {i < flowSteps.length - 1 && (
              <div style={{ color: TEAL, opacity: 0.5, fontSize: 18, padding: "0 8px", flexShrink: 0 }}>→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── KPI Cards ────────────────────────────────────────────────────────────────
function KPICards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {kpiData.map((k) => (
        <div key={k.label} className="card card-hover" style={{ cursor: "default", padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
            <span style={{ color: TEAL }}><Icon.chart /></span>
            <span style={{ fontSize: 12, color: SLATE, fontWeight: 600 }}>{k.label}</span>
          </div>
          <div className="kpi-value" style={{ fontSize: "28px", marginBottom: 6 }}>{k.value}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span className={k.up ? "trend-up" : "trend-down"} style={{ fontWeight: 700 }}>
              {k.up ? "▲" : "▼"} {k.delta}
            </span>
            <span style={{ fontSize: 11, color: GRAY_L }}>vs baseline</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Confusion Matrix ─────────────────────────────────────────────────────────
function ConfusionMatrix() {
  const total = confusionMatrix.tp + confusionMatrix.fp + confusionMatrix.fn + confusionMatrix.tn;
  const cells = [
    { key: "True Positive", val: confusionMatrix.tp, bg: "#DCFCE7", border: "#22C55E40", text: "#16A34A", icon: <Icon.check /> },
    { key: "False Positive", val: confusionMatrix.fp, bg: "#FEE2E2", border: "#EF444440", text: "#DC2626", icon: <Icon.alert /> },
    { key: "False Negative", val: confusionMatrix.fn, bg: "#FEF3C7", border: "#F59E0B40", text: "#D97706", icon: <Icon.warn /> },
    { key: "True Negative", val: confusionMatrix.tn, bg: "#E6F7F7", border: "#0EA5A040", text: "#0d9490", icon: <Icon.check /> },
  ];
  return (
    <div className="card" style={{ height: "100%" }}>
      <div className="section-label" style={{ marginBottom: 4 }}>Confusion Matrix</div>
      <h3 style={{ margin: "0 0 16px", fontSize: "17px" }}>Classification Results</h3>
      <div className="grid grid-cols-2 gap-3">
        {cells.map((c) => (
          <div
            key={c.key}
            style={{
              background: c.bg,
              border: `1px solid ${c.border}`,
              borderRadius: 10,
              padding: "14px 12px",
              textAlign: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 6, color: c.text }}>
              {c.icon}
              <span style={{ fontSize: 11, fontWeight: 700, color: c.text }}>{c.key}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: NAVY, fontVariantNumeric: "tabular-nums" }}>
              {fmt(c.val)}
            </div>
            <div style={{ fontSize: 11, color: GRAY_L, marginTop: 2 }}>
              {(c.val / total * 100).toFixed(1)}% of total
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ROC Curve ────────────────────────────────────────────────────────────────
function ROCCurve() {
  return (
    <div className="card" style={{ height: "100%" }}>
      <div className="section-label" style={{ marginBottom: 4 }}>ROC Curve</div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontSize: "17px" }}>Receiver Operating Characteristic</h3>
        <span className="badge badge-teal" style={{ fontSize: 11, fontWeight: 700 }}>AUC = 0.963</span>
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <AreaChart data={rocData} margin={{ top: 4, right: 12, bottom: 16, left: -10 }}>
          <defs>
            <linearGradient id="rocGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={TEAL} stopOpacity={0.25} />
              <stop offset="95%" stopColor={TEAL} stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis dataKey="fpr" tick={{ fill: GRAY_L, fontSize: 10 }} label={{ value: "False Positive Rate", position: "insideBottom", offset: -10, fill: GRAY_L, fontSize: 10 }} />
          <YAxis tick={{ fill: GRAY_L, fontSize: 10 }} label={{ value: "True Positive Rate", angle: -90, position: "insideLeft", fill: GRAY_L, fontSize: 10 }} />
          <Tooltip {...TooltipStyle} />
          <ReferenceLine x={0} stroke={BORDER} strokeDasharray="4 4" />
          <Area type="monotone" dataKey="tpr" stroke={TEAL} strokeWidth={2.5} fill="url(#rocGrad)" dot={false} activeDot={{ r: 4, fill: TEAL }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── PR Curve ─────────────────────────────────────────────────────────────────
function PRCurve() {
  return (
    <div className="card" style={{ height: "100%" }}>
      <div className="section-label" style={{ marginBottom: 4 }}>Precision-Recall Curve</div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontSize: "17px" }}>Precision vs Recall</h3>
        <span className="badge badge-green" style={{ fontSize: 11, fontWeight: 700 }}>AP = 0.891</span>
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <AreaChart data={prData} margin={{ top: 4, right: 12, bottom: 16, left: -10 }}>
          <defs>
            <linearGradient id="prGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={GREEN} stopOpacity={0.25} />
              <stop offset="95%" stopColor={GREEN} stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis dataKey="recall" tick={{ fill: GRAY_L, fontSize: 10 }} label={{ value: "Recall", position: "insideBottom", offset: -10, fill: GRAY_L, fontSize: 10 }} />
          <YAxis tick={{ fill: GRAY_L, fontSize: 10 }} domain={[0.5, 1]} label={{ value: "Precision", angle: -90, position: "insideLeft", fill: GRAY_L, fontSize: 10 }} />
          <Tooltip {...TooltipStyle} />
          <Area type="monotone" dataKey="precision" stroke={GREEN} strokeWidth={2.5} fill="url(#prGrad)" dot={false} activeDot={{ r: 4, fill: GREEN }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Feature Importance ───────────────────────────────────────────────────────
function FeatureImportance() {
  return (
    <div className="card" style={{ height: "100%" }}>
      <div className="section-label" style={{ marginBottom: 4 }}>Feature Importance</div>
      <h3 style={{ margin: "0 0 16px", fontSize: "17px" }}>Top Predictive Signals</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {featureData.map((f) => (
          <div key={f.name}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: SLATE, fontWeight: 500 }}>{f.name}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: TEAL, fontVariantNumeric: "tabular-nums" }}>
                {f.alt}%
              </span>
            </div>
            <div style={{ height: 8, background: "#F3F4F6", borderRadius: 6, position: "relative", overflow: "hidden" }}>
              {f.trad > 0 && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: `${f.trad}%`,
                    background: "#D1D5DB",
                    borderRadius: 6,
                  }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: `${f.alt}%`,
                  background: `linear-gradient(90deg, ${TEAL}, ${TEAL2})`,
                  borderRadius: 6,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 20, marginTop: 20, paddingTop: 14, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, background: "#D1D5DB", borderRadius: 2 }} />
          <span style={{ fontSize: 11, color: GRAY_L }}>Traditional only</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 10, height: 10, background: TEAL, borderRadius: 2 }} />
          <span style={{ fontSize: 11, color: GRAY_L }}>With alternative data</span>
        </div>
      </div>
    </div>
  );
}

// ─── Alternative Data Impact ──────────────────────────────────────────────────
function AltDataImpact() {
  return (
    <div className="card" style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div className="section-label" style={{ marginBottom: 6 }}>Impact Analysis</div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: NAVY, margin: 0 }}>Alternative Data Lift</h2>
          <p style={{ color: SLATE, fontSize: 14, margin: "6px 0 0" }}>
            Comparative performance: traditional bureau model vs. CrediNove alternative-enhanced model
          </p>
        </div>
        <div
          style={{
            background: "#DCFCE7",
            border: "1px solid #22C55E50",
            borderRadius: 10,
            padding: "8px 18px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 800, color: "#16A34A" }}>+38%</span>
          <span style={{ fontSize: 13, color: "#16A34A", fontWeight: 700 }}>Portfolio Coverage Lift</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {altImpact.map((row) => {
          const maxBar = row.label === "Default Rate" ? 10 : 100;
          const pctTrad = (row.trad / maxBar) * 100;
          const pctAlt = (row.alt / maxBar) * 100;
          const delta = row.higher
            ? `+${(((row.alt - row.trad) / row.trad) * 100).toFixed(0)}%`
            : `−${(row.trad - row.alt).toFixed(1)}%`;

          return (
            <div key={row.label}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{row.label}</span>
                <span className="badge badge-green" style={{ fontSize: 11, fontWeight: 700 }}>{delta} improvement</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { lbl: "Traditional Only", pct: pctTrad, val: row.trad, isAlt: false },
                  { lbl: "Trad + Alt Data", pct: pctAlt, val: row.alt, isAlt: true },
                ].map((b) => (
                  <div key={b.lbl} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, color: b.isAlt ? TEAL : GRAY_L, width: 120, flexShrink: 0, fontWeight: b.isAlt ? 700 : 400 }}>
                      {b.lbl}
                    </span>
                    <div style={{ flex: 1, height: 9, background: "#F3F4F6", borderRadius: 6, overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${b.pct}%`,
                          background: b.isAlt ? `linear-gradient(90deg, ${TEAL}, ${TEAL2})` : "#D1D5DB",
                          borderRadius: 6,
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: b.isAlt ? TEAL : SLATE, width: 44, textAlign: "right", flexShrink: 0 }}>
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
    <div className="card" style={{ marginBottom: 32 }}>
      <div className="section-label" style={{ marginBottom: 6 }}>Explainable AI (XAI)</div>
      <h2 style={{ fontSize: "22px", fontWeight: 800, color: NAVY, margin: "0 0 6px" }}>
        SHAP Global Feature Contributions
      </h2>
      <p style={{ color: SLATE, fontSize: 14, margin: "0 0 24px", maxWidth: 720, lineHeight: 1.6 }}>
        SHAP (SHapley Additive exPlanations) values quantify each feature's marginal attribution to the final decision score.
        <span style={{ color: GREEN, fontWeight: 700 }}> Green bars </span>support approval;
        <span style={{ color: RED, fontWeight: 700 }}> red bars </span>push toward rejection.
      </p>

      {/* Direction Legend */}
      <div className="flex justify-between text-xs font-bold mb-3">
        <span style={{ color: RED, paddingLeft: 180 }}>← Pushes Toward Rejection</span>
        <span style={{ color: GREEN, paddingRight: 40 }}>Pushes Toward Approval →</span>
      </div>

      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: "calc(180px + 50%)",
            top: 0,
            bottom: 0,
            width: 1,
            background: BORDER,
            zIndex: 0,
          }}
        />

        {shapData.map((s) => {
          const pos = s.value > 0;
          const pct = (Math.abs(s.value) / maxAbs) * 44;
          return (
            <div key={s.feature} className="flex items-center mb-2.5 relative">
              <div style={{ width: 180, textAlign: "right", paddingRight: 16, flexShrink: 0 }}>
                <span style={{ fontSize: 13, color: SLATE, fontWeight: 500 }}>{s.feature}</span>
              </div>
              <div style={{ flex: 1, position: "relative", height: 28, display: "flex", alignItems: "center" }}>
                {pos ? (
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: 4,
                      height: 20,
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${GREEN}60, ${GREEN}DD)`,
                      borderRadius: "0 5px 5px 0",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: "absolute",
                      right: "50%",
                      top: 4,
                      height: 20,
                      width: `${pct}%`,
                      background: `linear-gradient(270deg, ${RED}60, ${RED}DD)`,
                      borderRadius: "5px 0 0 5px",
                    }}
                  />
                )}
              </div>
              <div style={{ width: 64, paddingLeft: 10, flexShrink: 0, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: pos ? GREEN : RED }}>{pos ? <Icon.check /> : <Icon.alert />}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: pos ? GREEN : RED, fontVariantNumeric: "tabular-nums" }}>
                  {pos ? "+" : ""}{s.value.toFixed(2)}
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
    <div className="card" style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div className="section-label" style={{ marginBottom: 6 }}>Fairness & Bias Audit</div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: NAVY, margin: 0 }}>
            Demographic Subgroup Performance
          </h2>
          <p style={{ color: SLATE, fontSize: 14, margin: "6px 0 0" }}>
            Acceptance rate across age bands and geography · Traditional vs. Alternative-enhanced model
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="badge badge-green" style={{ justifyContent: "flex-start", fontSize: 11, fontWeight: 700 }}>
            <Icon.check /> Demographic Parity: PASSED (±3.8%)
          </span>
          <span className="badge badge-green" style={{ justifyContent: "flex-start", fontSize: 11, fontWeight: 700 }}>
            <Icon.shield /> Equalized Odds: BALANCED
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={subgroupData} margin={{ top: 4, right: 16, bottom: 4, left: 0 }} barGap={4} barCategoryGap="28%">
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis dataKey="group" tick={{ fill: SLATE, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: GRAY_L, fontSize: 11 }} tickFormatter={(v) => `${v}%`} domain={[40, 100]} axisLine={false} tickLine={false} />
          <Tooltip
            {...TooltipStyle}
            formatter={(v: any, name: any) => [`${v}%`, name === "trad" ? "Traditional Only" : "Trad + Alt Data"]}
          />
          <Bar dataKey="trad" name="Traditional Only" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
          <Bar dataKey="alt" name="Trad + Alt Data" fill={TEAL} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div style={{ display: "flex", gap: 24, marginTop: 16, paddingTop: 14, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, background: "#E5E7EB", borderRadius: 3 }} />
          <span style={{ fontSize: 12, color: GRAY_L }}>Traditional Only</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, background: TEAL, borderRadius: 3 }} />
          <span style={{ fontSize: 12, color: GRAY_L }}>Traditional + Alternative Data (CrediNove)</span>
        </div>
      </div>
    </div>
  );
}

// ─── Floating Callout Panel ──────────────────────────────────────────────────
function CalloutPanel({ dismissed, onDismiss }: { dismissed: Set<number>; onDismiss: (id: number) => void }) {
  const visible = callouts.filter((c) => !dismissed.has(c.id));
  if (visible.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        right: 24,
        bottom: 90,
        width: 300,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        zIndex: 40,
      }}
    >
      {visible.map((c) => (
        <div
          key={c.id}
          style={{
            background: WHITE,
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            padding: "14px 16px",
            boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
          }}
          className="animate-fade-in"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="callout-dot">{c.id}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{c.title}</span>
            </div>
            <button
              onClick={() => onDismiss(c.id)}
              style={{
                background: "none",
                border: "none",
                color: GRAY_L,
                cursor: "pointer",
                fontSize: 18,
                lineHeight: 1,
                padding: "0 2px",
              }}
              aria-label="Dismiss note"
            >
              ×
            </button>
          </div>
          <p style={{ fontSize: 12, color: SLATE, lineHeight: 1.6, margin: 0 }}>{c.body}</p>
        </div>
      ))}
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
    alert("Generating model audit PDF report…\nCrediNove AI Model Validation · XGBoost Ensemble v3.2.1 · Q3 2026");
  };

  return (
    <div style={{ minHeight: "100%", background: "#F7FAFA" }}>
      <Navbar />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 24px 80px" }}>
        <PageHeader onToggleCallouts={toggleCallouts} calloutsOn={calloutsOn} onExport={handleExport} />

        <SystemFlow />

        {/* KPI section */}
        <div className="section-label" style={{ marginBottom: 14 }}>Model Metrics</div>
        <KPICards />

        {/* 4-chart grid */}
        <div className="section-label" style={{ marginBottom: 14 }}>Model Performance & Confusion Matrix</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <ConfusionMatrix />
          <ROCCurve />
          <PRCurve />
          <FeatureImportance />
        </div>

        <AltDataImpact />
        <SHAPChart />
        <FairnessAudit />

        {/* Bottom actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 28,
            borderTop: `1px solid ${BORDER}`,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <Link to="/" className="btn-ghost" style={{ textDecoration: "none" }}>
            ← Back to Home
          </Link>
          <div style={{ display: "flex", gap: 12 }}>
            <Link to="/assessment" className="btn-secondary" style={{ textDecoration: "none" }}>
              ⚡ Launch Assessment Flow
            </Link>
            <button className="btn-primary" onClick={handleExport} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon.export /> Export Report
            </button>
          </div>
        </div>
      </main>

      {/* Callout panel */}
      {calloutsOn && <CalloutPanel dismissed={dismissed} onDismiss={dismiss} />}

      {/* Numbered callout dots */}
      {calloutsOn && (
        <div style={{ position: "fixed", left: 24, bottom: 28, display: "flex", gap: 8, zIndex: 40 }}>
          {callouts.map((c) => (
            <button
              key={c.id}
              className="callout-dot"
              onClick={() =>
                setDismissed((prev) => {
                  const next = new Set(prev);
                  next.has(c.id) ? next.delete(c.id) : next.add(c.id);
                  return next;
                })
              }
              title={c.title}
              style={{ opacity: dismissed.has(c.id) ? 0.35 : 1 }}
            >
              {c.id}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
