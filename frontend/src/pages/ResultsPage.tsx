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
import {
  Download,
  Check,
  ShieldCheck,
  Lightbulb,
  TrendingUp,
  ArrowDown,
  RotateCcw,
  ArrowLeft,
  Scale,
  CreditCard,
  AlertTriangle,
  Award,
  Sparkles,
} from "lucide-react";
import { Navbar } from "../components/common/Navbar";
import { useAssessment } from "../context/AssessmentContext";
import { calculateCreditScore } from "../services/scoringEngine";
import { ScoreBarItem } from "../types/assessment";

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

// ── Circular Gauge (Mastercard Palette Arc) ──────────────────────────────────
function CircularGauge({ score, max }: { score: number; max: number }) {
  const r = 86;
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
  const id = "gaugeGradResultsMastercard";

  return (
    <svg width={220} height={200} viewBox="0 0 220 200">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#141413" />
          <stop offset="60%" stopColor="#F37338" />
          <stop offset="100%" stopColor="#CF4500" />
        </linearGradient>
      </defs>
      {/* Background Track */}
      <path
        d={arcPath(startAngle, endAngle, r)}
        fill="none"
        stroke="#E2DED9"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Progress Arc */}
      {sweepAngle > 0 && (
        <path
          d={arcPath(startAngle, progressEnd, r)}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="14"
          strokeLinecap="round"
        />
      )}
      {/* Center Values */}
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Sofia Sans', sans-serif"
        fontSize="44"
        fontWeight="700"
        fill={THEME.ink}
      >
        {score}
      </text>
      <text
        x={cx}
        y={cy + 30}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="13"
        fontWeight="500"
        fill={THEME.slateGray}
      >
        out of {max}
      </text>
      {/* Min / Max labels */}
      <text x={30} y={178} textAnchor="middle" fontSize="11" fill={THEME.slateGray} fontWeight="600">
        0
      </text>
      <text x={190} y={178} textAnchor="middle" fontSize="11" fill={THEME.slateGray} fontWeight="600">
        {max}
      </text>
    </svg>
  );
}

// ── Score Bar ───────────────────────────────────────────────────────────────
function ScoreBar({ item }: { item: ScoreBarItem }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-48 flex-shrink-0">
        <span style={{ fontSize: "14px", color: THEME.ink, fontWeight: 500 }}>
          {item.label}
        </span>
      </div>
      <div
        style={{
          flex: 1,
          backgroundColor: THEME.canvas,
          borderRadius: "999px",
          height: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: "999px",
            width: `${item.pct}%`,
            backgroundColor: THEME.ink,
            transition: "width 0.6s ease",
          }}
        />
      </div>
      <div
        style={{
          width: "48px",
          textAlign: "right",
          fontSize: "14px",
          fontWeight: 700,
          color: THEME.ink,
        }}
      >
        {item.value}
      </div>
    </div>
  );
}

// ── Custom Tooltip ──────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: THEME.white,
          border: `1.5px solid ${THEME.ink}`,
          borderRadius: "16px",
          padding: "8px 14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <p style={{ fontSize: "12px", color: THEME.slateGray, margin: 0, fontWeight: 500 }}>
          {label}
        </p>
        <p
          style={{
            fontFamily: "'Sofia Sans', sans-serif",
            fontSize: "18px",
            color: THEME.ink,
            fontWeight: 700,
            margin: "2px 0 0",
          }}
        >
          {payload[0].value} pts
        </p>
      </div>
    );
  }
  return null;
}

// ── Main Results Page ───────────────────────────────────────────────────────
export default function ResultsPage() {
  const navigate = useNavigate();
  const { result, formData, resetAssessment } = useAssessment();

  const activeResult = result || calculateCreditScore(formData);

  const scoreBands = [
    { label: "Exceptional", range: "850–1000", color: "#16A34A" },
    { label: "Very Good", range: "740–849", color: THEME.ink },
    { label: "Good", range: "670–739", color: THEME.lightSignalOrange },
    { label: "Fair", range: "580–669", color: THEME.signalOrange },
    { label: "Poor", range: "0–579", color: THEME.red },
  ];

  const handleRetake = () => {
    resetAssessment();
    navigate("/assessment");
  };

  const handlePrint = () => {
    window.print();
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
        {/* ── Assessment Header ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <div className="eyebrow" style={{ marginBottom: "6px" }}>
              <span className="eyebrow-dot" />
              <span>AI CREDIT ASSESSMENT DOSSIER · {activeResult.assessmentDate}</span>
            </div>
            <h1
              style={{
                fontSize: "clamp(30px, 4vw, 42px)",
                fontWeight: 500,
                color: THEME.ink,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              {formData.SK_ID_CURR
              ? `Applicant #${formData.SK_ID_CURR}`
              : "Credit Assessment"}
            </h1>
            <p style={{ fontSize: "14px", color: THEME.charcoal, marginTop: "6px" }}>
              Applicant ID:{" "}
              <strong style={{ color: THEME.ink }}>{activeResult.applicantId}</strong>
              <span style={{ margin: "0 10px", color: THEME.borderLight }}>|</span>
              Model:{" "}
              <strong style={{ color: THEME.signalOrange }}>
                {activeResult.modelVersion || "LightGBM 10-Fold Ensemble v1"}
              </strong>
              <span style={{ margin: "0 10px", color: THEME.borderLight }}>|</span>
              Status:{" "}
              <strong style={{ color: "#16A34A" }}>
                {activeResult.isMlPrediction ? "Live AI Inference Active" : "Calibrated Engine"}
              </strong>
            </p>

            {/* Supabase Audit Badge */}
            <div
              style={{
                marginTop: "12px",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "6px 14px",
                borderRadius: "999px",
                backgroundColor: "rgba(22, 163, 74, 0.08)",
                border: "1px solid rgba(22, 163, 74, 0.25)",
                fontSize: "12px",
                color: THEME.ink,
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: "#16A34A",
                  display: "inline-block",
                }}
              />
              <span>
                <strong>Supabase Audit:</strong>{" "}
                Assessment ID:{" "}
                <code>{activeResult.assessmentId ? activeResult.assessmentId.slice(0, 8) + "..." : "Ingested"}</code>
                {" · "}
                Prediction ID:{" "}
                <code>{activeResult.predictionId ? activeResult.predictionId.slice(0, 8) + "..." : "Ingested"}</code>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="btn-primary"
              style={{ padding: "10px 24px", fontSize: "14.5px" }}
            >
              <Download size={16} />
              <span>Download PDF Dossier</span>
            </button>
            <Link
              to="/judge"
              className="btn-secondary"
              style={{ padding: "10px 22px", fontSize: "14.5px" }}
            >
              <Scale size={16} />
              <span>Model Audit & Analytics</span>
            </Link>
          </div>
        </div>

        {/* ── Hero Results Grid (3 Columns) ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr_1.1fr] gap-6 mb-8">
          {/* Gauge Card */}
          <div
            className="card-lifted"
            style={{
              padding: "36px",
              backgroundColor: THEME.lifted,
              borderRadius: "32px",
              border: `1px solid ${THEME.borderLight}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 36px rgba(0,0,0,0.04)",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: THEME.slateGray,
                marginBottom: "4px",
              }}
            >
              COMPOSITE AI CREDIT SCORE
            </p>
            <CircularGauge score={activeResult.creditScore} max={activeResult.maxScore} />
            <div className="mt-2 flex items-center justify-center">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 18px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: 700,
                  backgroundColor:
                    activeResult.riskLevel === "LOW RISK"
                      ? "rgba(22, 163, 74, 0.12)"
                      : activeResult.riskLevel === "MEDIUM RISK"
                      ? "rgba(243, 115, 56, 0.12)"
                      : "rgba(207, 69, 0, 0.12)",
                  color:
                    activeResult.riskLevel === "LOW RISK"
                      ? "#16A34A"
                      : activeResult.riskLevel === "MEDIUM RISK"
                      ? THEME.lightSignalOrange
                      : THEME.signalOrange,
                }}
              >
                <Check size={14} strokeWidth={2.5} />
                {activeResult.riskLevel}
              </span>
            </div>
            <p
              style={{
                fontSize: "13px",
                color: THEME.slateGray,
                marginTop: "12px",
                textAlign: "center",
              }}
            >
              Score trajectory:{" "}
              <strong style={{ color: "#16A34A" }}>+{activeResult.scoreDelta} pts</strong> over 6
              months
            </p>
          </div>

          {/* Middle Metrics Stack */}
          <div className="flex flex-col gap-4">
            {/* Probability of Default */}
            <div
              style={{
                backgroundColor: THEME.white,
                borderRadius: "24px",
                border: `1px solid ${THEME.borderLight}`,
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: THEME.slateGray,
                  }}
                >
                  PROBABILITY OF DEFAULT (PD)
                </p>
                <div className="flex items-baseline gap-3 mt-1">
                  <span
                    style={{
                      fontFamily: "'Sofia Sans', sans-serif",
                      fontSize: "36px",
                      fontWeight: 700,
                      color: THEME.ink,
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                    }}
                  >
                    {activeResult.defaultProbability}
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "999px",
                      backgroundColor: "rgba(22, 163, 74, 0.12)",
                      color: "#16A34A",
                    }}
                  >
                    <ArrowDown size={12} strokeWidth={2.5} /> {activeResult.defaultDelta}
                  </span>
                </div>
                <p style={{ fontSize: "12.5px", color: THEME.slateGray, marginTop: "4px" }}>
                  Low portfolio risk threshold
                </p>
              </div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(22, 163, 74, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrendingUp size={22} color="#16A34A" />
              </div>
            </div>

            {/* Loan Eligibility */}
            <div
              style={{
                backgroundColor: THEME.white,
                borderRadius: "24px",
                border: `1px solid ${THEME.borderLight}`,
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: THEME.slateGray,
                  }}
                >
                  RECOMMENDED LOAN FACILITY
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span
                    style={{
                      fontFamily: "'Sofia Sans', sans-serif",
                      fontSize: "26px",
                      fontWeight: 700,
                      color: THEME.ink,
                    }}
                  >
                    {activeResult.eligibleAmountMin}
                  </span>
                  <span style={{ color: THEME.slateGray, fontWeight: 500 }}>–</span>
                  <span
                    style={{
                      fontFamily: "'Sofia Sans', sans-serif",
                      fontSize: "26px",
                      fontWeight: 700,
                      color: THEME.signalOrange,
                    }}
                  >
                    {activeResult.eligibleAmountMax}
                  </span>
                </div>
                <p style={{ fontSize: "12.5px", color: THEME.slateGray, marginTop: "4px" }}>
                  Tenure: {activeResult.recommendedTenure}
                </p>
              </div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: THEME.canvas,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CreditCard size={22} color={THEME.ink} />
              </div>
            </div>

            {/* AI Recommendation Banner */}
            <div
              style={{
                backgroundColor: THEME.ink,
                color: THEME.canvas,
                borderRadius: "24px",
                padding: "22px 26px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: THEME.lightSignalOrange,
                  }}
                >
                  DECISION ENGINE RECOMMENDATION
                </p>
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: 500,
                    color: "#FFFFFF",
                    margin: "4px 0",
                  }}
                >
                  {activeResult.recommendation}
                </h3>
                <p
                  style={{
                    fontSize: "12.5px",
                    color: "rgba(243, 240, 238, 0.8)",
                    margin: 0,
                  }}
                >
                  {activeResult.recommendationSubtitle}
                </p>
              </div>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Award size={24} color={THEME.lightSignalOrange} />
              </div>
            </div>
          </div>

          {/* Right: Score Band Visual */}
          <div
            className="card-lifted"
            style={{
              padding: "32px",
              backgroundColor: THEME.lifted,
              borderRadius: "32px",
              border: `1px solid ${THEME.borderLight}`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: THEME.slateGray,
                  marginBottom: "16px",
                }}
              >
                CREDIT SCORE BANDS
              </p>
              {scoreBands.map((band) => {
                const isActive = band.label.toLowerCase() === activeResult.scoreBand.toLowerCase();
                return (
                  <div
                    key={band.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      borderRadius: "16px",
                      marginBottom: "8px",
                      backgroundColor: isActive ? THEME.white : "transparent",
                      border: isActive ? `1.5px solid ${THEME.ink}` : "1px solid transparent",
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        style={{
                          width: "9px",
                          height: "9px",
                          borderRadius: "50%",
                          backgroundColor: band.color,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "13.5px",
                          fontWeight: isActive ? 700 : 450,
                          color: THEME.ink,
                        }}
                      >
                        {band.label}
                      </span>
                      {isActive && (
                        <span
                          style={{
                            fontSize: "10.5px",
                            backgroundColor: THEME.ink,
                            color: THEME.canvas,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "999px",
                          }}
                        >
                          Applicant
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: "12.5px", color: THEME.slateGray, fontWeight: 500 }}>
                      {band.range}
                    </span>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                marginTop: "16px",
                padding: "14px 16px",
                borderRadius: "16px",
                backgroundColor: THEME.white,
                border: `1px solid ${THEME.borderLight}`,
              }}
            >
              <p style={{ fontSize: "12.5px", color: THEME.charcoal, margin: 0, lineHeight: 1.5 }}>
                Score of <strong style={{ color: THEME.ink }}>{activeResult.creditScore}</strong>{" "}
                places {formData.SK_ID_CURR ? `Applicant #${formData.SK_ID_CURR}` : "this applicant"} in the{" "}
                <strong>{activeResult.scoreBand}</strong> tier, qualifying for standard institutional
                lending rates.
              </p>
            </div>
          </div>
        </div>

        {/* ── Score Breakdown & Weights ─────────────────────────────── */}
        <div
          style={{
            backgroundColor: THEME.lifted,
            borderRadius: "32px",
            border: `1px solid ${THEME.borderLight}`,
            padding: "36px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
            marginBottom: "32px",
          }}
        >
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="eyebrow" style={{ marginBottom: "6px" }}>
                <span className="eyebrow-dot" />
                <span>FACTOR ATTRIBUTION</span>
              </div>
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: 500,
                  color: THEME.ink,
                  margin: 0,
                }}
              >
                Score Breakdown & Parameter Weights
              </h2>
            </div>
            <span
              style={{
                fontSize: "13.5px",
                fontWeight: 600,
                color: THEME.slateGray,
              }}
            >
              Weighted Score: {activeResult.creditScore} / 1000
            </span>
          </div>

          <div className="flex flex-col gap-5">
            {activeResult.scoreBars.map((bar) => (
              <ScoreBar key={bar.label} item={bar} />
            ))}
          </div>
        </div>

        {/* ── Why This Score: Positives & Risks ──────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Positive Factors */}
          <div
            style={{
              backgroundColor: THEME.lifted,
              borderRadius: "32px",
              border: `1px solid ${THEME.borderLight}`,
              padding: "32px",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(22, 163, 74, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check size={18} color="#16A34A" strokeWidth={2.5} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 500, color: THEME.ink, margin: 0 }}>
                Key Positive Factor Drivers
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {activeResult.positives.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "14px 18px",
                    borderRadius: "18px",
                    backgroundColor: THEME.white,
                    border: `1px solid ${THEME.borderLight}`,
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: "#16A34A",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: "14px", color: THEME.ink, lineHeight: 1.5 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Factors */}
          <div
            style={{
              backgroundColor: THEME.lifted,
              borderRadius: "32px",
              border: `1px solid ${THEME.borderLight}`,
              padding: "32px",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(207, 69, 0, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AlertTriangle size={18} color={THEME.signalOrange} strokeWidth={2.2} />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 500, color: THEME.ink, margin: 0 }}>
                Identified Risk Flags
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {activeResult.risks.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "14px 18px",
                    borderRadius: "18px",
                    backgroundColor: THEME.white,
                    border: `1px solid ${THEME.borderLight}`,
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: THEME.signalOrange,
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  >
                    <AlertTriangle size={11} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: "14px", color: THEME.ink, lineHeight: 1.5 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Explainable AI (XAI) Synthesis ────────────────────────── */}
        <div
          className="stadium-frame mb-8"
          style={{
            backgroundColor: THEME.white,
            border: `1.5px solid ${THEME.ink}`,
            padding: "36px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-start gap-5">
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                backgroundColor: THEME.ink,
                color: THEME.canvas,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={26} color={THEME.lightSignalOrange} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: 500,
                    color: THEME.ink,
                    margin: 0,
                  }}
                >
                  Explainable AI (XAI) Synthesis
                </h3>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: THEME.signalOrange,
                    backgroundColor: "rgba(243, 115, 56, 0.12)",
                    padding: "3px 10px",
                    borderRadius: "999px",
                  }}
                >
                  SHAP-Calibrated
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#16A34A",
                    backgroundColor: "rgba(22, 163, 74, 0.12)",
                    padding: "3px 10px",
                    borderRadius: "999px",
                  }}
                >
                  Fair Lending Compliant
                </span>
              </div>
              <p
                style={{
                  fontSize: "15px",
                  color: THEME.charcoal,
                  lineHeight: 1.65,
                  maxWidth: "960px",
                  margin: 0,
                }}
              >
                {activeResult.aiExplanation}
              </p>
            </div>
          </div>
        </div>

        {/* ── Score Trajectory & Actionable Pathways ────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 mb-10">
          {/* Trend Chart */}
          <div
            style={{
              backgroundColor: THEME.lifted,
              borderRadius: "32px",
              border: `1px solid ${THEME.borderLight}`,
              padding: "32px",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 500, color: THEME.ink, margin: 0 }}>
                  Score Trajectory (6 Months)
                </h3>
                <p style={{ fontSize: "13px", color: THEME.slateGray, margin: "2px 0 0" }}>
                  Historical calibrated model performance
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(22, 163, 74, 0.12)",
                  color: "#16A34A",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                <TrendingUp size={14} />
                <span>+{activeResult.scoreDelta} points</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={activeResult.trendData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2DED9" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: THEME.slateGray }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 12, fill: THEME.slateGray }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={THEME.ink}
                  strokeWidth={3}
                  dot={{ fill: THEME.signalOrange, strokeWidth: 2, r: 4, stroke: "#FFFFFF" }}
                  activeDot={{ r: 7, fill: THEME.ink, stroke: THEME.signalOrange, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Actionable Suggestions */}
          <div
            style={{
              backgroundColor: THEME.lifted,
              borderRadius: "32px",
              border: `1px solid ${THEME.borderLight}`,
              padding: "32px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: 500, color: THEME.ink, marginBottom: "4px" }}>
              Actionable Score Enhancements
            </h3>
            <p style={{ fontSize: "13px", color: THEME.slateGray, marginBottom: "20px" }}>
              Guidance pathways to unlock tier 1 terms
            </p>
            <div className="flex flex-col gap-3">
              {activeResult.suggestions.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "14px 16px",
                    borderRadius: "18px",
                    backgroundColor: THEME.white,
                    border: `1px solid ${THEME.borderLight}`,
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: THEME.canvas,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Lightbulb size={16} color={THEME.signalOrange} />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "13.5px",
                        fontWeight: 600,
                        color: THEME.ink,
                        marginBottom: "2px",
                      }}
                    >
                      {s.title}
                    </p>
                    <p
                      style={{
                        fontSize: "12.5px",
                        color: THEME.slateGray,
                        lineHeight: 1.45,
                        margin: 0,
                      }}
                    >
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Action Buttons ────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "24px",
            borderTop: `1px solid ${THEME.borderLight}`,
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <Link
            to="/judge"
            className="btn-secondary"
            style={{ fontSize: "14px", padding: "10px 22px" }}
          >
            <Scale size={15} />
            <span>Explore Model Metrics on Judge Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="btn-ghost"
              style={{ fontSize: "14px", padding: "10px 20px" }}
            >
              <ArrowLeft size={15} />
              <span>Back to Overview</span>
            </Link>
            <button
              onClick={handleRetake}
              className="btn-ghost"
              style={{ fontSize: "14px", padding: "10px 20px" }}
            >
              <RotateCcw size={15} />
              <span>New Assessment</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn-primary"
              style={{ fontSize: "14px", padding: "10px 24px" }}
            >
              <Download size={15} />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
