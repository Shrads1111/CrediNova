import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Navbar } from "../components/common/Navbar";
import { useAssessment } from "../context/AssessmentContext";
import { calculateCreditScore } from "../services/scoringEngine";
import { ScoreBarItem } from "../types/assessment";

// ── Icons ───────────────────────────────────────────────────────────────────
function IconDownload() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function IconLightbulb() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="9" y1="18" x2="15" y2="18" />
      <line x1="10" y1="22" x2="14" y2="22" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

function IconTrendUp() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function IconArrowDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

// ── Circular Gauge (Matching Figma arc) ─────────────────────────────────────
function CircularGauge({ score, max }: { score: number; max: number }) {
  const r = 88;
  const cx = 110;
  const cy = 110;
  const startAngle = 135;
  const endAngle = 405; // 270° sweep
  const pct = Math.min(1, Math.max(0, score / max));
  const sweepAngle = 270 * pct;

  function polarToXY(angle: number, radius: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  }

  function arcPath(start: number, end: number, radius: number) {
    const s = polarToXY(start, radius);
    const e = polarToXY(end, radius);
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const progressEnd = startAngle + sweepAngle;
  const id = "gaugeGradResults";

  return (
    <svg width={220} height={220} viewBox="0 0 220 220">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0EA5A0" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
      </defs>
      {/* Background track */}
      <path
        d={arcPath(startAngle, endAngle, r)}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Progress */}
      {sweepAngle > 0 && (
        <path
          d={arcPath(startAngle, progressEnd, r)}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="14"
          strokeLinecap="round"
        />
      )}
      {/* Center text */}
      <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="middle" fontSize="38" fontWeight="800" fill="#1A2B3C">
        {score}
      </text>
      <text x={cx} y={cy + 26} textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="500" fill="#4B5563">
        out of {max}
      </text>
      {/* Min / Max labels */}
      <text x={30} y={186} textAnchor="middle" fontSize="11" fill="#9CA3AF" fontWeight="500">0</text>
      <text x={190} y={186} textAnchor="middle" fontSize="11" fill="#9CA3AF" fontWeight="500">{max}</text>
    </svg>
  );
}

// ── Score Bar ───────────────────────────────────────────────────────────────
function ScoreBar({ item }: { item: ScoreBarItem }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-44 flex-shrink-0">
        <span style={{ fontSize: 13, color: "#4B5563", fontWeight: 500 }}>{item.label}</span>
      </div>
      <div className="flex-1 bg-[#E5E7EB] rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${item.pct}%`, background: item.color }}
        />
      </div>
      <div className="w-10 text-right" style={{ fontSize: 13, fontWeight: 600, color: "#1A2B3C" }}>
        {item.value}
      </div>
    </div>
  );
}

// ── Custom Tooltip ──────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 shadow-lg">
        <p style={{ fontSize: 12, color: "#4B5563", fontWeight: 500 }}>{label}</p>
        <p style={{ fontSize: 16, color: "#0EA5A0", fontWeight: 700 }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
}

// ── Main Results Page ───────────────────────────────────────────────────────
export default function ResultsPage() {
  const navigate = useNavigate();
  const { result, personal, financial, transaction, payment, dti, resetAssessment } = useAssessment();

  // If no result exists in state, compute dynamically or fallback
  const activeResult =
    result ||
    calculateCreditScore(personal, financial, transaction, payment, dti);

  const scoreBands = [
    { label: "Exceptional", range: "850–1000", color: "#22C55E" },
    { label: "Very Good", range: "740–849", color: "#0EA5A0" },
    { label: "Good", range: "670–739", color: "#F59E0B" },
    { label: "Fair", range: "580–669", color: "#F97316" },
    { label: "Poor", range: "0–579", color: "#EF4444" },
  ];

  const handleRetake = () => {
    resetAssessment();
    navigate("/assessment");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-full bg-[#F7FAFA]">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-6 pt-24 pb-16">
        {/* ── Assessment Header ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0EA5A0", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                AI Credit Assessment Results
              </span>
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>·</span>
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>{activeResult.assessmentDate}</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1A2B3C", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
              {personal.fullName || "Rahul Sharma"}
            </h1>
            <p style={{ fontSize: 13, color: "#4B5563", marginTop: 4 }}>
              Applicant ID: <span style={{ fontWeight: 600, color: "#1A2B3C" }}>{activeResult.applicantId}</span>
              <span style={{ margin: "0 8px", color: "#E5E7EB" }}>|</span>
              Assessment Date: <span style={{ fontWeight: 600, color: "#1A2B3C" }}>{activeResult.assessmentDate}</span>
              <span style={{ margin: "0 8px", color: "#E5E7EB" }}>|</span>
              Model Version: <span style={{ fontWeight: 600, color: "#0EA5A0" }}>Ensemble v3.2.1</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#0EA5A0] text-[#0EA5A0] font-semibold hover:bg-[#F0FAFA] transition-colors duration-150"
              style={{ fontSize: 14 }}
            >
              <IconDownload />
              Download Report
            </button>
            <Link
              to="/judge"
              className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1A2B3C] font-semibold transition-colors"
              style={{ fontSize: 14 }}
            >
              <span>⚖️</span> View Model Audit
            </Link>
          </div>
        </div>

        {/* ── Hero Grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr_1fr] gap-5 mb-5">
          {/* Gauge Card */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 flex flex-col items-center justify-center shadow-sm">
            <p style={{ fontSize: 12, fontWeight: 700, color: "#4B5563", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
              AI Credit Score
            </p>
            <CircularGauge score={activeResult.creditScore} max={activeResult.maxScore} />
            <div className="mt-1 flex items-center justify-center">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  background: activeResult.riskLevel === "LOW RISK" ? "#DCFCE7" : activeResult.riskLevel === "MEDIUM RISK" ? "#FEF3C7" : "#FEE2E2",
                  color: activeResult.riskColor,
                }}
              >
                <IconCheck />
                {activeResult.riskLevel}
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 10, textAlign: "center" }}>
              Score improved <span style={{ color: "#22C55E", fontWeight: 700 }}>+{activeResult.scoreDelta} pts</span> over 6 months
            </p>
          </div>

          {/* Middle — key metrics */}
          <div className="flex flex-col gap-4">
            {/* Probability of Default */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] px-6 py-4 shadow-sm flex items-center justify-between">
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#4B5563", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Probability of Default
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span style={{ fontSize: 32, fontWeight: 800, color: "#1A2B3C", letterSpacing: "-0.03em" }}>
                    {activeResult.defaultProbability}
                  </span>
                  <span
                    className="flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "#DCFCE7", color: "#16A34A" }}
                  >
                    <IconArrowDown /> {activeResult.defaultDelta}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Low portfolio risk threshold</p>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#DCFCE7" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
            </div>

            {/* Loan Eligibility */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] px-6 py-4 shadow-sm flex items-center justify-between">
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#4B5563", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Recommended Loan Eligibility
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span style={{ fontSize: 24, fontWeight: 800, color: "#1A2B3C", letterSpacing: "-0.02em" }}>
                    {activeResult.eligibleAmountMin}
                  </span>
                  <span style={{ fontSize: 14, color: "#4B5563", fontWeight: 500 }}>–</span>
                  <span style={{ fontSize: 24, fontWeight: 800, color: "#0EA5A0", letterSpacing: "-0.02em" }}>
                    {activeResult.eligibleAmountMax}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                  Recommended tenure: {activeResult.recommendedTenure}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#F0FAFA" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0EA5A0" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
            </div>

            {/* AI Recommendation */}
            <div
              className="rounded-2xl px-6 py-4 shadow-sm flex items-center justify-between"
              style={{
                background:
                  activeResult.recommendation === "APPROVE"
                    ? "linear-gradient(135deg, #0EA5A0 0%, #14B8A6 50%, #22C55E 100%)"
                    : activeResult.recommendation === "CONDITIONAL APPROVE"
                    ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
                    : "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
              }}
            >
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  AI Recommendation
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span style={{ fontSize: 28, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
                    {activeResult.recommendation}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
                  {activeResult.recommendationSubtitle}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right — score band visual */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm flex flex-col justify-between">
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#4B5563", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>
                Credit Score Band
              </p>
              {scoreBands.map((band) => {
                const isActive = band.label.toLowerCase() === activeResult.scoreBand.toLowerCase();
                return (
                  <div
                    key={band.label}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl mb-2 transition-all ${
                      isActive ? "ring-1 ring-[#0EA5A0]" : ""
                    }`}
                    style={{ background: isActive ? "#F0FAFA" : "transparent" }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: band.color }} />
                      <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 400, color: isActive ? "#0EA5A0" : "#4B5563" }}>
                        {band.label}
                      </span>
                      {isActive && (
                        <span style={{ fontSize: 11, background: "#0EA5A0", color: "white", fontWeight: 700, padding: "1px 7px", borderRadius: 20 }}>
                          Applicant
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>{band.range}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 p-3 rounded-xl" style={{ background: "#F7FAFA" }}>
              <p style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.5 }}>
                Score of <strong style={{ color: "#0EA5A0" }}>{activeResult.creditScore}</strong> places {personal.fullName || "the applicant"} in the <strong>{activeResult.scoreBand}</strong> band, qualifying for institutional rates.
              </p>
            </div>
          </div>
        </div>

        {/* ── Score Breakdown ───────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-7 shadow-sm mb-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1A2B3C", letterSpacing: "-0.01em" }}>
                Score Breakdown & Factor Weights
              </h2>
              <p style={{ fontSize: 13, color: "#4B5563", marginTop: 2 }}>
                Contribution of each parameter to the composite AI credit score
              </p>
            </div>
            <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600 }}>
              Weighted score: {activeResult.creditScore}/1000
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {activeResult.scoreBars.map((bar) => (
              <ScoreBar key={bar.label} item={bar} />
            ))}
          </div>
        </div>

        {/* ── Why This Score ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {/* Positive factors */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#DCFCE7" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1A2B3C" }}>Key Positive Factors</h3>
            </div>
            <div className="flex flex-col gap-3">
              {activeResult.positives.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "#F0FDF4" }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "#22C55E", color: "white" }}>
                    <IconCheck />
                  </div>
                  <span style={{ fontSize: 13.5, color: "#1A2B3C", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk factors */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#FEF3C7" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1A2B3C" }}>Identified Risk Flags</h3>
            </div>
            <div className="flex flex-col gap-3">
              {activeResult.risks.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "#FFFBEB" }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "#F59E0B" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 13.5, color: "#1A2B3C", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── AI Explanation Callout ────────────────────────────────── */}
        <div
          className="rounded-2xl p-6 mb-5 border border-[#A7F3D0]"
          style={{ background: "linear-gradient(135deg, #F0FAFA 0%, #ECFDF5 100%)" }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #0EA5A0, #14B8A6)", color: "white" }}
            >
              <IconShield />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A2B3C" }}>
                  Explainable AI (XAI) Synthesis
                </h3>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#0EA5A0", background: "#CCFBF1", padding: "2px 8px", borderRadius: 20 }}>
                  SHAP-Calibrated
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#16A34A", background: "#DCFCE7", padding: "2px 8px", borderRadius: 20 }}>
                  Fair Lending Compliant
                </span>
              </div>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, maxWidth: 960 }}>
                {activeResult.aiExplanation}
              </p>
            </div>
          </div>
        </div>

        {/* ── Score Trend + Suggestions ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 mb-6">
          {/* Trend chart */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1A2B3C", letterSpacing: "-0.01em" }}>
                  Score Trajectory (6 Months)
                </h2>
                <p style={{ fontSize: 13, color: "#4B5563", marginTop: 2 }}>Apr 2026 – Sep 2026</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "#DCFCE7" }}>
                <div className="text-[#16A34A]"><IconTrendUp /></div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#16A34A" }}>
                  +{activeResult.scoreDelta} points
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={activeResult.trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0EA5A0" />
                    <stop offset="100%" stopColor="#22C55E" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="url(#lineGrad)"
                  strokeWidth={2.5}
                  dot={{ fill: "#0EA5A0", strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: "#0EA5A0", stroke: "#CCFBF1", strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Improvement suggestions */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1A2B3C", letterSpacing: "-0.01em", marginBottom: 4 }}>
              Customer Improvement Suggestions
            </h2>
            <p style={{ fontSize: 13, color: "#4B5563", marginBottom: 18 }}>
              Actionable pathways to elevate score to next tier
            </p>
            <div className="flex flex-col gap-3">
              {activeResult.suggestions.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-[#E5E7EB] hover:border-[#0EA5A0] hover:bg-[#F0FAFA] transition-all duration-150"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#F0FAFA", color: "#0EA5A0" }}>
                    <IconLightbulb />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#1A2B3C", marginBottom: 2 }}>{s.title}</p>
                    <p style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.5 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Action Buttons ────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E5E7EB]">
          <Link
            to="/judge"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#0EA5A0] text-[#0EA5A0] font-semibold hover:bg-[#F0FAFA] transition-colors"
            style={{ fontSize: 14, textDecoration: "none" }}
          >
            <span>⚖️</span> Explore Model Metrics on Judge Dashboard →
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-[#4B5563] font-semibold hover:border-[#0EA5A0] hover:text-[#0EA5A0] transition-all"
              style={{ fontSize: 14, textDecoration: "none" }}
            >
              <IconHome />
              Home
            </Link>
            <button
              onClick={handleRetake}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-[#4B5563] font-semibold hover:border-[#0EA5A0] hover:text-[#0EA5A0] transition-all"
              style={{ fontSize: 14 }}
            >
              <IconRefresh />
              Retake Assessment
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{ fontSize: 14, background: "linear-gradient(135deg, #0EA5A0, #14B8A6)" }}
            >
              <IconDownload />
              Download Report
            </button>
          </div>
        </div>
      </main>

      {/* Footer note */}
      <div className="border-t border-[#E5E7EB] bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <span>© 2026 CrediNove AI · For authorized bank officers only</span>
          <span>Assessment ID: {activeResult.applicantId} · Calibration: XGBoost Ensemble v3.2.1</span>
        </div>
      </div>
    </div>
  );
}
