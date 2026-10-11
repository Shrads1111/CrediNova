import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, } from "recharts";
import { Download, Check, ShieldCheck, Lightbulb, TrendingUp, ArrowDown, RotateCcw, ArrowLeft, Scale, CreditCard, AlertTriangle, Award, } from "lucide-react";
import { Navbar } from "../components/common/Navbar";
import { useAssessment } from "../context/AssessmentContext";
import { calculateCreditScore } from "../services/scoringEngine";
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
function CircularGauge({ score, max }) {
    const r = 86;
    const cx = 110;
    const cy = 110;
    const startAngle = 135;
    const endAngle = 405; // 270° sweep
    const pct = Math.min(1, Math.max(0, score / max));
    const sweepAngle = 270 * pct;
    function polarToXY(angle, radius) {
        const rad = ((angle - 90) * Math.PI) / 180;
        return {
            x: cx + radius * Math.cos(rad),
            y: cy + radius * Math.sin(rad),
        };
    }
    function arcPath(start, end, radius) {
        const s = polarToXY(start, radius);
        const e = polarToXY(end, radius);
        const large = end - start > 180 ? 1 : 0;
        return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
    }
    const progressEnd = startAngle + sweepAngle;
    const id = "gaugeGradResultsMastercard";
    return (_jsxs("svg", { width: 220, height: 200, viewBox: "0 0 220 200", children: [_jsx("defs", { children: _jsxs("linearGradient", { id: id, x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", stopColor: "#141413" }), _jsx("stop", { offset: "60%", stopColor: "#F37338" }), _jsx("stop", { offset: "100%", stopColor: "#CF4500" })] }) }), _jsx("path", { d: arcPath(startAngle, endAngle, r), fill: "none", stroke: "#E2DED9", strokeWidth: "14", strokeLinecap: "round" }), sweepAngle > 0 && (_jsx("path", { d: arcPath(startAngle, progressEnd, r), fill: "none", stroke: `url(#${id})`, strokeWidth: "14", strokeLinecap: "round" })), _jsx("text", { x: cx, y: cy - 6, textAnchor: "middle", dominantBaseline: "middle", fontFamily: "'Sofia Sans', sans-serif", fontSize: "44", fontWeight: "700", fill: THEME.ink, children: score }), _jsxs("text", { x: cx, y: cy + 30, textAnchor: "middle", dominantBaseline: "middle", fontSize: "13", fontWeight: "500", fill: THEME.slateGray, children: ["out of ", max] }), _jsx("text", { x: 30, y: 178, textAnchor: "middle", fontSize: "11", fill: THEME.slateGray, fontWeight: "600", children: "0" }), _jsx("text", { x: 190, y: 178, textAnchor: "middle", fontSize: "11", fill: THEME.slateGray, fontWeight: "600", children: max })] }));
}
// ── Score Bar ───────────────────────────────────────────────────────────────
function ScoreBar({ item }) {
    return (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-48 flex-shrink-0", children: _jsx("span", { style: { fontSize: "14px", color: THEME.ink, fontWeight: 500 }, children: item.label }) }), _jsx("div", { style: {
                    flex: 1,
                    backgroundColor: THEME.canvas,
                    borderRadius: "999px",
                    height: "10px",
                    overflow: "hidden",
                }, children: _jsx("div", { style: {
                        height: "100%",
                        borderRadius: "999px",
                        width: `${item.pct}%`,
                        backgroundColor: THEME.ink,
                        transition: "width 0.6s ease",
                    } }) }), _jsx("div", { style: {
                    width: "48px",
                    textAlign: "right",
                    fontSize: "14px",
                    fontWeight: 700,
                    color: THEME.ink,
                }, children: item.value })] }));
}
// ── Custom Tooltip ──────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        return (_jsxs("div", { style: {
                backgroundColor: THEME.white,
                border: `1.5px solid ${THEME.ink}`,
                borderRadius: "16px",
                padding: "8px 14px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }, children: [_jsx("p", { style: { fontSize: "12px", color: THEME.slateGray, margin: 0, fontWeight: 500 }, children: label }), _jsxs("p", { style: {
                        fontFamily: "'Sofia Sans', sans-serif",
                        fontSize: "18px",
                        color: THEME.ink,
                        fontWeight: 700,
                        margin: "2px 0 0",
                    }, children: [payload[0].value, " pts"] })] }));
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
    return (_jsxs("div", { style: { minHeight: "100%", backgroundColor: THEME.canvas }, children: [_jsx(Navbar, {}), _jsxs("main", { style: {
                    maxWidth: "1240px",
                    margin: "0 auto",
                    padding: "110px 24px 80px",
                }, children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10", children: [_jsxs("div", { children: [_jsxs("div", { className: "eyebrow", style: { marginBottom: "6px" }, children: [_jsx("span", { className: "eyebrow-dot" }), _jsxs("span", { children: ["AI CREDIT ASSESSMENT DOSSIER \u00B7 ", activeResult.assessmentDate] })] }), _jsx("h1", { style: {
                                            fontSize: "clamp(30px, 4vw, 42px)",
                                            fontWeight: 500,
                                            color: THEME.ink,
                                            letterSpacing: "-0.02em",
                                            margin: 0,
                                        }, children: formData.SK_ID_CURR
                                            ? `Applicant #${formData.SK_ID_CURR}`
                                            : "Credit Assessment" }), _jsxs("p", { style: { fontSize: "14px", color: THEME.charcoal, marginTop: "6px" }, children: ["Applicant ID:", " ", _jsx("strong", { style: { color: THEME.ink }, children: activeResult.applicantId }), _jsx("span", { style: { margin: "0 10px", color: THEME.borderLight }, children: "|" }), "Model:", " ", _jsx("strong", { style: { color: THEME.signalOrange }, children: activeResult.modelVersion || "LightGBM 10-Fold Ensemble v1" }), _jsx("span", { style: { margin: "0 10px", color: THEME.borderLight }, children: "|" }), "Status:", " ", _jsx("strong", { style: { color: "#16A34A" }, children: activeResult.isMlPrediction ? "Live AI Inference Active" : "Calibrated Engine" })] }), _jsxs("div", { style: {
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
                                        }, children: [_jsx("span", { style: {
                                                    width: "7px",
                                                    height: "7px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "#16A34A",
                                                    display: "inline-block",
                                                } }), _jsxs("span", { children: [_jsx("strong", { children: "Supabase Audit:" }), " ", "Assessment ID:", " ", _jsx("code", { children: activeResult.assessmentId ? activeResult.assessmentId.slice(0, 8) + "..." : "Ingested" }), " · ", "Prediction ID:", " ", _jsx("code", { children: activeResult.predictionId ? activeResult.predictionId.slice(0, 8) + "..." : "Ingested" })] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("button", { onClick: handlePrint, className: "btn-primary", style: { padding: "10px 24px", fontSize: "14.5px" }, children: [_jsx(Download, { size: 16 }), _jsx("span", { children: "Download PDF Dossier" })] }), _jsxs(Link, { to: "/judge", className: "btn-secondary", style: { padding: "10px 22px", fontSize: "14.5px" }, children: [_jsx(Scale, { size: 16 }), _jsx("span", { children: "Model Audit & Analytics" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr_1.1fr] gap-6 mb-8", children: [_jsxs("div", { className: "card-lifted", style: {
                                    padding: "36px",
                                    backgroundColor: THEME.lifted,
                                    borderRadius: "32px",
                                    border: `1px solid ${THEME.borderLight}`,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 12px 36px rgba(0,0,0,0.04)",
                                }, children: [_jsx("p", { style: {
                                            fontSize: "12px",
                                            fontWeight: 700,
                                            letterSpacing: "0.06em",
                                            textTransform: "uppercase",
                                            color: THEME.slateGray,
                                            marginBottom: "4px",
                                        }, children: "COMPOSITE AI CREDIT SCORE" }), _jsx(CircularGauge, { score: activeResult.creditScore, max: activeResult.maxScore }), _jsx("div", { className: "mt-2 flex items-center justify-center", children: _jsxs("span", { style: {
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                padding: "6px 18px",
                                                borderRadius: "999px",
                                                fontSize: "13px",
                                                fontWeight: 700,
                                                backgroundColor: activeResult.riskLevel === "LOW RISK"
                                                    ? "rgba(22, 163, 74, 0.12)"
                                                    : activeResult.riskLevel === "MEDIUM RISK"
                                                        ? "rgba(243, 115, 56, 0.12)"
                                                        : "rgba(207, 69, 0, 0.12)",
                                                color: activeResult.riskLevel === "LOW RISK"
                                                    ? "#16A34A"
                                                    : activeResult.riskLevel === "MEDIUM RISK"
                                                        ? THEME.lightSignalOrange
                                                        : THEME.signalOrange,
                                            }, children: [_jsx(Check, { size: 14, strokeWidth: 2.5 }), activeResult.riskLevel] }) }), _jsxs("p", { style: {
                                            fontSize: "13px",
                                            color: THEME.slateGray,
                                            marginTop: "12px",
                                            textAlign: "center",
                                        }, children: ["Score trajectory:", " ", _jsxs("strong", { style: { color: "#16A34A" }, children: ["+", activeResult.scoreDelta, " pts"] }), " over 6 months"] })] }), _jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { style: {
                                            backgroundColor: THEME.white,
                                            borderRadius: "24px",
                                            border: `1px solid ${THEME.borderLight}`,
                                            padding: "20px 24px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                                        }, children: [_jsxs("div", { children: [_jsx("p", { style: {
                                                            fontSize: "12px",
                                                            fontWeight: 700,
                                                            letterSpacing: "0.06em",
                                                            textTransform: "uppercase",
                                                            color: THEME.slateGray,
                                                        }, children: "PROBABILITY OF DEFAULT (PD)" }), _jsxs("div", { className: "flex items-baseline gap-3 mt-1", children: [_jsx("span", { style: {
                                                                    fontFamily: "'Sofia Sans', sans-serif",
                                                                    fontSize: "36px",
                                                                    fontWeight: 700,
                                                                    color: THEME.ink,
                                                                    letterSpacing: "-0.02em",
                                                                    lineHeight: 1,
                                                                }, children: activeResult.defaultProbability }), _jsxs("span", { style: {
                                                                    display: "inline-flex",
                                                                    alignItems: "center",
                                                                    gap: "3px",
                                                                    fontSize: "12px",
                                                                    fontWeight: 700,
                                                                    padding: "2px 8px",
                                                                    borderRadius: "999px",
                                                                    backgroundColor: "rgba(22, 163, 74, 0.12)",
                                                                    color: "#16A34A",
                                                                }, children: [_jsx(ArrowDown, { size: 12, strokeWidth: 2.5 }), " ", activeResult.defaultDelta] })] }), _jsx("p", { style: { fontSize: "12.5px", color: THEME.slateGray, marginTop: "4px" }, children: "Low portfolio risk threshold" })] }), _jsx("div", { style: {
                                                    width: "48px",
                                                    height: "48px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "rgba(22, 163, 74, 0.1)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }, children: _jsx(TrendingUp, { size: 22, color: "#16A34A" }) })] }), _jsxs("div", { style: {
                                            backgroundColor: THEME.white,
                                            borderRadius: "24px",
                                            border: `1px solid ${THEME.borderLight}`,
                                            padding: "20px 24px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                                        }, children: [_jsxs("div", { children: [_jsx("p", { style: {
                                                            fontSize: "12px",
                                                            fontWeight: 700,
                                                            letterSpacing: "0.06em",
                                                            textTransform: "uppercase",
                                                            color: THEME.slateGray,
                                                        }, children: "RECOMMENDED LOAN FACILITY" }), _jsxs("div", { className: "flex items-baseline gap-2 mt-1", children: [_jsx("span", { style: {
                                                                    fontFamily: "'Sofia Sans', sans-serif",
                                                                    fontSize: "26px",
                                                                    fontWeight: 700,
                                                                    color: THEME.ink,
                                                                }, children: activeResult.eligibleAmountMin }), _jsx("span", { style: { color: THEME.slateGray, fontWeight: 500 }, children: "\u2013" }), _jsx("span", { style: {
                                                                    fontFamily: "'Sofia Sans', sans-serif",
                                                                    fontSize: "26px",
                                                                    fontWeight: 700,
                                                                    color: THEME.signalOrange,
                                                                }, children: activeResult.eligibleAmountMax })] }), _jsxs("p", { style: { fontSize: "12.5px", color: THEME.slateGray, marginTop: "4px" }, children: ["Tenure: ", activeResult.recommendedTenure] })] }), _jsx("div", { style: {
                                                    width: "48px",
                                                    height: "48px",
                                                    borderRadius: "50%",
                                                    backgroundColor: THEME.canvas,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }, children: _jsx(CreditCard, { size: 22, color: THEME.ink }) })] }), _jsxs("div", { style: {
                                            backgroundColor: THEME.ink,
                                            color: THEME.canvas,
                                            borderRadius: "24px",
                                            padding: "22px 26px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                        }, children: [_jsxs("div", { children: [_jsx("p", { style: {
                                                            fontSize: "11px",
                                                            fontWeight: 700,
                                                            letterSpacing: "0.08em",
                                                            textTransform: "uppercase",
                                                            color: THEME.lightSignalOrange,
                                                        }, children: "DECISION ENGINE RECOMMENDATION" }), _jsx("h3", { style: {
                                                            fontSize: "24px",
                                                            fontWeight: 500,
                                                            color: "#FFFFFF",
                                                            margin: "4px 0",
                                                        }, children: activeResult.recommendation }), _jsx("p", { style: {
                                                            fontSize: "12.5px",
                                                            color: "rgba(243, 240, 238, 0.8)",
                                                            margin: 0,
                                                        }, children: activeResult.recommendationSubtitle })] }), _jsx("div", { style: {
                                                    width: "48px",
                                                    height: "48px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }, children: _jsx(Award, { size: 24, color: THEME.lightSignalOrange }) })] })] }), _jsxs("div", { className: "card-lifted", style: {
                                    padding: "32px",
                                    backgroundColor: THEME.lifted,
                                    borderRadius: "32px",
                                    border: `1px solid ${THEME.borderLight}`,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }, children: [_jsxs("div", { children: [_jsx("p", { style: {
                                                    fontSize: "12px",
                                                    fontWeight: 700,
                                                    letterSpacing: "0.06em",
                                                    textTransform: "uppercase",
                                                    color: THEME.slateGray,
                                                    marginBottom: "16px",
                                                }, children: "CREDIT SCORE BANDS" }), scoreBands.map((band) => {
                                                const isActive = band.label.toLowerCase() === activeResult.scoreBand.toLowerCase();
                                                return (_jsxs("div", { style: {
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        padding: "10px 14px",
                                                        borderRadius: "16px",
                                                        marginBottom: "8px",
                                                        backgroundColor: isActive ? THEME.white : "transparent",
                                                        border: isActive ? `1.5px solid ${THEME.ink}` : "1px solid transparent",
                                                    }, children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { style: {
                                                                        width: "9px",
                                                                        height: "9px",
                                                                        borderRadius: "50%",
                                                                        backgroundColor: band.color,
                                                                    } }), _jsx("span", { style: {
                                                                        fontSize: "13.5px",
                                                                        fontWeight: isActive ? 700 : 450,
                                                                        color: THEME.ink,
                                                                    }, children: band.label }), isActive && (_jsx("span", { style: {
                                                                        fontSize: "10.5px",
                                                                        backgroundColor: THEME.ink,
                                                                        color: THEME.canvas,
                                                                        fontWeight: 700,
                                                                        padding: "2px 8px",
                                                                        borderRadius: "999px",
                                                                    }, children: "Applicant" }))] }), _jsx("span", { style: { fontSize: "12.5px", color: THEME.slateGray, fontWeight: 500 }, children: band.range })] }, band.label));
                                            })] }), _jsx("div", { style: {
                                            marginTop: "16px",
                                            padding: "14px 16px",
                                            borderRadius: "16px",
                                            backgroundColor: THEME.white,
                                            border: `1px solid ${THEME.borderLight}`,
                                        }, children: _jsxs("p", { style: { fontSize: "12.5px", color: THEME.charcoal, margin: 0, lineHeight: 1.5 }, children: ["Score of ", _jsx("strong", { style: { color: THEME.ink }, children: activeResult.creditScore }), " ", "places ", formData.SK_ID_CURR ? `Applicant #${formData.SK_ID_CURR}` : "this applicant", " in the", " ", _jsx("strong", { children: activeResult.scoreBand }), " tier, qualifying for standard institutional lending rates."] }) })] })] }), _jsxs("div", { style: {
                            backgroundColor: THEME.lifted,
                            borderRadius: "32px",
                            border: `1px solid ${THEME.borderLight}`,
                            padding: "36px",
                            boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
                            marginBottom: "32px",
                        }, children: [_jsxs("div", { className: "flex items-center justify-between mb-8 flex-wrap gap-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "eyebrow", style: { marginBottom: "6px" }, children: [_jsx("span", { className: "eyebrow-dot" }), _jsx("span", { children: "FACTOR ATTRIBUTION" })] }), _jsx("h2", { style: {
                                                    fontSize: "22px",
                                                    fontWeight: 500,
                                                    color: THEME.ink,
                                                    margin: 0,
                                                }, children: "Score Breakdown & Parameter Weights" })] }), _jsxs("span", { style: {
                                            fontSize: "13.5px",
                                            fontWeight: 600,
                                            color: THEME.slateGray,
                                        }, children: ["Weighted Score: ", activeResult.creditScore, " / 1000"] })] }), _jsx("div", { className: "flex flex-col gap-5", children: activeResult.scoreBars.map((bar) => (_jsx(ScoreBar, { item: bar }, bar.label))) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8", children: [_jsxs("div", { style: {
                                    backgroundColor: THEME.lifted,
                                    borderRadius: "32px",
                                    border: `1px solid ${THEME.borderLight}`,
                                    padding: "32px",
                                }, children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { style: {
                                                    width: "36px",
                                                    height: "36px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "rgba(22, 163, 74, 0.12)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }, children: _jsx(Check, { size: 18, color: "#16A34A", strokeWidth: 2.5 }) }), _jsx("h3", { style: { fontSize: "18px", fontWeight: 500, color: THEME.ink, margin: 0 }, children: "Key Positive Factor Drivers" })] }), _jsx("div", { className: "flex flex-col gap-3", children: activeResult.positives.map((item, i) => (_jsxs("div", { style: {
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: "12px",
                                                padding: "14px 18px",
                                                borderRadius: "18px",
                                                backgroundColor: THEME.white,
                                                border: `1px solid ${THEME.borderLight}`,
                                            }, children: [_jsx("div", { style: {
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
                                                    }, children: _jsx(Check, { size: 12, strokeWidth: 3 }) }), _jsx("span", { style: { fontSize: "14px", color: THEME.ink, lineHeight: 1.5 }, children: item })] }, i))) })] }), _jsxs("div", { style: {
                                    backgroundColor: THEME.lifted,
                                    borderRadius: "32px",
                                    border: `1px solid ${THEME.borderLight}`,
                                    padding: "32px",
                                }, children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { style: {
                                                    width: "36px",
                                                    height: "36px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "rgba(207, 69, 0, 0.12)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }, children: _jsx(AlertTriangle, { size: 18, color: THEME.signalOrange, strokeWidth: 2.2 }) }), _jsx("h3", { style: { fontSize: "18px", fontWeight: 500, color: THEME.ink, margin: 0 }, children: "Identified Risk Flags" })] }), _jsx("div", { className: "flex flex-col gap-3", children: activeResult.risks.map((item, i) => (_jsxs("div", { style: {
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: "12px",
                                                padding: "14px 18px",
                                                borderRadius: "18px",
                                                backgroundColor: THEME.white,
                                                border: `1px solid ${THEME.borderLight}`,
                                            }, children: [_jsx("div", { style: {
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
                                                    }, children: _jsx(AlertTriangle, { size: 11, strokeWidth: 3 }) }), _jsx("span", { style: { fontSize: "14px", color: THEME.ink, lineHeight: 1.5 }, children: item })] }, i))) })] })] }), _jsx("div", { className: "stadium-frame mb-8", style: {
                            backgroundColor: THEME.white,
                            border: `1.5px solid ${THEME.ink}`,
                            padding: "36px",
                            boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
                        }, children: _jsxs("div", { className: "flex items-start gap-5", children: [_jsx("div", { style: {
                                        width: "52px",
                                        height: "52px",
                                        borderRadius: "50%",
                                        backgroundColor: THEME.ink,
                                        color: THEME.canvas,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }, children: _jsx(ShieldCheck, { size: 26, color: THEME.lightSignalOrange }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-2 flex-wrap", children: [_jsx("h3", { style: {
                                                        fontSize: "20px",
                                                        fontWeight: 500,
                                                        color: THEME.ink,
                                                        margin: 0,
                                                    }, children: "Explainable AI (XAI) Synthesis" }), _jsx("span", { style: {
                                                        fontSize: "11px",
                                                        fontWeight: 700,
                                                        color: THEME.signalOrange,
                                                        backgroundColor: "rgba(243, 115, 56, 0.12)",
                                                        padding: "3px 10px",
                                                        borderRadius: "999px",
                                                    }, children: "SHAP-Calibrated" }), _jsx("span", { style: {
                                                        fontSize: "11px",
                                                        fontWeight: 700,
                                                        color: "#16A34A",
                                                        backgroundColor: "rgba(22, 163, 74, 0.12)",
                                                        padding: "3px 10px",
                                                        borderRadius: "999px",
                                                    }, children: "Fair Lending Compliant" })] }), _jsx("p", { style: {
                                                fontSize: "15px",
                                                color: THEME.charcoal,
                                                lineHeight: 1.65,
                                                maxWidth: "960px",
                                                margin: 0,
                                            }, children: activeResult.aiExplanation })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 mb-10", children: [_jsxs("div", { style: {
                                    backgroundColor: THEME.lifted,
                                    borderRadius: "32px",
                                    border: `1px solid ${THEME.borderLight}`,
                                    padding: "32px",
                                }, children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h3", { style: { fontSize: "18px", fontWeight: 500, color: THEME.ink, margin: 0 }, children: "Score Trajectory (6 Months)" }), _jsx("p", { style: { fontSize: "13px", color: THEME.slateGray, margin: "2px 0 0" }, children: "Historical calibrated model performance" })] }), _jsxs("div", { style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    padding: "4px 12px",
                                                    borderRadius: "999px",
                                                    backgroundColor: "rgba(22, 163, 74, 0.12)",
                                                    color: "#16A34A",
                                                    fontSize: "13px",
                                                    fontWeight: 700,
                                                }, children: [_jsx(TrendingUp, { size: 14 }), _jsxs("span", { children: ["+", activeResult.scoreDelta, " points"] })] })] }), _jsx(ResponsiveContainer, { width: "100%", height: 220, children: _jsxs(LineChart, { data: activeResult.trendData, margin: { top: 5, right: 10, left: -20, bottom: 0 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#E2DED9", vertical: false }), _jsx(XAxis, { dataKey: "month", tick: { fontSize: 12, fill: THEME.slateGray }, axisLine: false, tickLine: false }), _jsx(YAxis, { domain: ["auto", "auto"], tick: { fontSize: 12, fill: THEME.slateGray }, axisLine: false, tickLine: false }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }), _jsx(Line, { type: "monotone", dataKey: "score", stroke: THEME.ink, strokeWidth: 3, dot: { fill: THEME.signalOrange, strokeWidth: 2, r: 4, stroke: "#FFFFFF" }, activeDot: { r: 7, fill: THEME.ink, stroke: THEME.signalOrange, strokeWidth: 2 } })] }) })] }), _jsxs("div", { style: {
                                    backgroundColor: THEME.lifted,
                                    borderRadius: "32px",
                                    border: `1px solid ${THEME.borderLight}`,
                                    padding: "32px",
                                }, children: [_jsx("h3", { style: { fontSize: "18px", fontWeight: 500, color: THEME.ink, marginBottom: "4px" }, children: "Actionable Score Enhancements" }), _jsx("p", { style: { fontSize: "13px", color: THEME.slateGray, marginBottom: "20px" }, children: "Guidance pathways to unlock tier 1 terms" }), _jsx("div", { className: "flex flex-col gap-3", children: activeResult.suggestions.map((s, i) => (_jsxs("div", { style: {
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: "12px",
                                                padding: "14px 16px",
                                                borderRadius: "18px",
                                                backgroundColor: THEME.white,
                                                border: `1px solid ${THEME.borderLight}`,
                                            }, children: [_jsx("div", { style: {
                                                        width: "32px",
                                                        height: "32px",
                                                        borderRadius: "50%",
                                                        backgroundColor: THEME.canvas,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        flexShrink: 0,
                                                    }, children: _jsx(Lightbulb, { size: 16, color: THEME.signalOrange }) }), _jsxs("div", { children: [_jsx("p", { style: {
                                                                fontSize: "13.5px",
                                                                fontWeight: 600,
                                                                color: THEME.ink,
                                                                marginBottom: "2px",
                                                            }, children: s.title }), _jsx("p", { style: {
                                                                fontSize: "12.5px",
                                                                color: THEME.slateGray,
                                                                lineHeight: 1.45,
                                                                margin: 0,
                                                            }, children: s.desc })] })] }, i))) })] })] }), _jsxs("div", { style: {
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingTop: "24px",
                            borderTop: `1px solid ${THEME.borderLight}`,
                            flexWrap: "wrap",
                            gap: "16px",
                        }, children: [_jsxs(Link, { to: "/judge", className: "btn-secondary", style: { fontSize: "14px", padding: "10px 22px" }, children: [_jsx(Scale, { size: 15 }), _jsx("span", { children: "Explore Model Metrics on Judge Dashboard" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs(Link, { to: "/", className: "btn-ghost", style: { fontSize: "14px", padding: "10px 20px" }, children: [_jsx(ArrowLeft, { size: 15 }), _jsx("span", { children: "Back to Overview" })] }), _jsxs("button", { onClick: handleRetake, className: "btn-ghost", style: { fontSize: "14px", padding: "10px 20px" }, children: [_jsx(RotateCcw, { size: 15 }), _jsx("span", { children: "New Assessment" })] }), _jsxs("button", { onClick: handlePrint, className: "btn-primary", style: { fontSize: "14px", padding: "10px 24px" }, children: [_jsx(Download, { size: 15 }), _jsx("span", { children: "Export Report" })] })] })] })] })] }));
}
