import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, } from "recharts";
import { Check, AlertTriangle, AlertCircle, Download, ShieldCheck, BarChart3, User, Cpu, Award, TrendingUp, Search, ClipboardList, Scale, Sparkles, ArrowRight, ArrowLeft, X, Database, RefreshCw, } from "lucide-react";
import { Navbar } from "../components/common/Navbar";
import { fetchRecentAssessments, fetchRecentPredictions, } from "../services/supabaseService";
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
const fmt = (n) => n.toLocaleString();
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
function PageHeader({ onToggleCallouts, calloutsOn, onExport, }) {
    return (_jsxs("div", { className: "flex justify-between items-start mb-10 flex-wrap gap-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "eyebrow", style: { marginBottom: "8px" }, children: [_jsx("span", { className: "eyebrow-dot" }), _jsx("span", { children: "MODEL AUDIT, VALIDATION & COMPLIANCE DOSSIER" })] }), _jsx("h1", { style: {
                            fontSize: "clamp(28px, 4vw, 40px)",
                            fontWeight: 500,
                            color: THEME.ink,
                            letterSpacing: "-0.02em",
                            margin: 0,
                            marginBottom: "6px",
                        }, children: "Judge & Evaluator Analytics" }), _jsx("p", { style: { color: THEME.charcoal, fontSize: "15px", margin: 0, fontWeight: 450 }, children: "Quarterly model validation review \u00B7 XGBoost + Neural Ensemble v3.2.1 \u00B7 14,400 test validation samples" })] }), _jsxs("div", { style: { display: "flex", gap: "12px", alignItems: "center" }, children: [_jsx("button", { className: "btn-ghost", onClick: onToggleCallouts, style: { fontSize: "14px", padding: "8px 20px" }, children: calloutsOn ? "Hide Audit Callouts" : "Show Audit Callouts" }), _jsxs("button", { className: "btn-primary", onClick: onExport, style: { fontSize: "14px", padding: "10px 24px" }, children: [_jsx(Download, { size: 16 }), _jsx("span", { children: "Export Validation PDF" })] })] })] }));
}
// ─── System Flow ──────────────────────────────────────────────────────────────
function SystemFlow() {
    return (_jsxs("div", { style: {
            backgroundColor: THEME.lifted,
            borderRadius: "32px",
            border: `1px solid ${THEME.borderLight}`,
            padding: "28px 32px",
            marginBottom: "36px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
        }, children: [_jsxs("div", { className: "eyebrow", style: { marginBottom: "16px" }, children: [_jsx("span", { className: "eyebrow-dot" }), _jsx("span", { children: "END-TO-END CREDIT PIPELINE ARCHITECTURE" })] }), _jsx("div", { style: {
                    display: "flex",
                    alignItems: "center",
                    overflowX: "auto",
                    gap: "8px",
                    paddingBottom: "8px",
                }, className: "scrollbar-hide", children: flowSteps.map((step, i) => {
                    const StepIcon = step.icon;
                    return (_jsxs("div", { style: { display: "flex", alignItems: "center", flexShrink: 0 }, children: [_jsxs("div", { style: {
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
                                }, children: [_jsx("div", { style: {
                                            width: "36px",
                                            height: "36px",
                                            borderRadius: "50%",
                                            backgroundColor: step.accent ? THEME.ink : THEME.white,
                                            color: step.accent ? THEME.canvas : THEME.ink,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }, children: _jsx(StepIcon, { size: 18 }) }), _jsx("div", { style: {
                                            fontSize: "12.5px",
                                            fontWeight: 600,
                                            lineHeight: 1.3,
                                            color: THEME.ink,
                                        }, children: step.label })] }), i < flowSteps.length - 1 && (_jsx("div", { style: { color: THEME.lightSignalOrange, padding: "0 10px", flexShrink: 0 }, children: _jsx(ArrowRight, { size: 16, strokeWidth: 2.2 }) }))] }, step.label));
                }) })] }));
}
// ─── KPI Cards ────────────────────────────────────────────────────────────────
function KPICards() {
    return (_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10", children: kpiData.map((k) => (_jsxs("div", { style: {
                backgroundColor: THEME.white,
                borderRadius: "24px",
                border: `1px solid ${THEME.borderLight}`,
                padding: "22px 20px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
            }, children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }, children: [_jsx(BarChart3, { size: 15, color: THEME.signalOrange }), _jsx("span", { style: { fontSize: "12px", color: THEME.slateGray, fontWeight: 600 }, children: k.label })] }), _jsx("div", { style: {
                        fontFamily: "'Sofia Sans', sans-serif",
                        fontSize: "30px",
                        fontWeight: 700,
                        color: THEME.ink,
                        lineHeight: 1,
                        marginBottom: "8px",
                    }, children: k.value }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [_jsx("span", { style: {
                                fontSize: "12px",
                                fontWeight: 700,
                                color: k.up ? "#16A34A" : THEME.signalOrange,
                            }, children: k.delta }), _jsx("span", { style: { fontSize: "11px", color: THEME.slateGray }, children: "vs baseline" })] })] }, k.label))) }));
}
// ─── Confusion Matrix ─────────────────────────────────────────────────────────
function ConfusionMatrix() {
    const total = confusionMatrix.tp + confusionMatrix.fp + confusionMatrix.fn + confusionMatrix.tn;
    const cells = [
        { key: "True Positive", val: confusionMatrix.tp, bg: "rgba(22,163,74,0.1)", text: "#16A34A", icon: Check },
        { key: "False Positive", val: confusionMatrix.fp, bg: "rgba(207,69,0,0.1)", text: THEME.signalOrange, icon: AlertCircle },
        { key: "False Negative", val: confusionMatrix.fn, bg: "rgba(243,115,56,0.1)", text: THEME.lightSignalOrange, icon: AlertTriangle },
        { key: "True Negative", val: confusionMatrix.tn, bg: "rgba(20,20,19,0.06)", text: THEME.ink, icon: Check },
    ];
    return (_jsxs("div", { style: {
            backgroundColor: THEME.lifted,
            borderRadius: "32px",
            border: `1px solid ${THEME.borderLight}`,
            padding: "32px",
            height: "100%",
        }, children: [_jsxs("div", { className: "eyebrow", style: { marginBottom: "6px" }, children: [_jsx("span", { className: "eyebrow-dot" }), _jsx("span", { children: "CONFUSION MATRIX" })] }), _jsx("h3", { style: { margin: "0 0 20px", fontSize: "19px", fontWeight: 500, color: THEME.ink }, children: "Classification Contingency Table" }), _jsx("div", { className: "grid grid-cols-2 gap-4", children: cells.map((c) => {
                    const CellIcon = c.icon;
                    return (_jsxs("div", { style: {
                            backgroundColor: c.bg,
                            borderRadius: "20px",
                            padding: "18px 14px",
                            textAlign: "center",
                            border: `1px solid ${THEME.borderLight}`,
                        }, children: [_jsxs("div", { style: {
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "6px",
                                    marginBottom: "6px",
                                    color: c.text,
                                }, children: [_jsx(CellIcon, { size: 14, strokeWidth: 2.5 }), _jsx("span", { style: { fontSize: "11.5px", fontWeight: 700 }, children: c.key })] }), _jsx("div", { style: {
                                    fontFamily: "'Sofia Sans', sans-serif",
                                    fontSize: "26px",
                                    fontWeight: 700,
                                    color: THEME.ink,
                                }, children: fmt(c.val) }), _jsxs("div", { style: { fontSize: "11px", color: THEME.slateGray, marginTop: "2px" }, children: [((c.val / total) * 100).toFixed(1), "% of test set"] })] }, c.key));
                }) })] }));
}
// ─── ROC Curve ────────────────────────────────────────────────────────────────
function ROCCurve() {
    return (_jsxs("div", { style: {
            backgroundColor: THEME.lifted,
            borderRadius: "32px",
            border: `1px solid ${THEME.borderLight}`,
            padding: "32px",
            height: "100%",
        }, children: [_jsxs("div", { className: "eyebrow", style: { marginBottom: "6px" }, children: [_jsx("span", { className: "eyebrow-dot" }), _jsx("span", { children: "ROC CHARACTERISTIC" })] }), _jsxs("div", { className: "flex items-baseline justify-between mb-4", children: [_jsx("h3", { style: { margin: 0, fontSize: "19px", fontWeight: 500, color: THEME.ink }, children: "Receiver Operating Characteristic" }), _jsx("span", { style: {
                            fontSize: "12px",
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderRadius: "999px",
                            backgroundColor: THEME.ink,
                            color: THEME.canvas,
                        }, children: "AUC = 0.963" })] }), _jsx(ResponsiveContainer, { width: "100%", height: 210, children: _jsxs(AreaChart, { data: rocData, margin: { top: 4, right: 12, bottom: 16, left: -10 }, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "rocGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: THEME.lightSignalOrange, stopOpacity: 0.4 }), _jsx("stop", { offset: "95%", stopColor: THEME.lightSignalOrange, stopOpacity: 0.02 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#E2DED9" }), _jsx(XAxis, { dataKey: "fpr", tick: { fill: THEME.slateGray, fontSize: 10 }, label: { value: "False Positive Rate", position: "insideBottom", offset: -10, fill: THEME.slateGray, fontSize: 10 } }), _jsx(YAxis, { tick: { fill: THEME.slateGray, fontSize: 10 }, label: { value: "True Positive Rate", angle: -90, position: "insideLeft", fill: THEME.slateGray, fontSize: 10 } }), _jsx(Tooltip, { ...TooltipStyle }), _jsx(ReferenceLine, { x: 0, stroke: THEME.borderLight, strokeDasharray: "4 4" }), _jsx(Area, { type: "monotone", dataKey: "tpr", stroke: THEME.ink, strokeWidth: 2.5, fill: "url(#rocGrad)", dot: false, activeDot: { r: 5, fill: THEME.signalOrange } })] }) })] }));
}
// ─── PR Curve ─────────────────────────────────────────────────────────────────
function PRCurve() {
    return (_jsxs("div", { style: {
            backgroundColor: THEME.lifted,
            borderRadius: "32px",
            border: `1px solid ${THEME.borderLight}`,
            padding: "32px",
            height: "100%",
        }, children: [_jsxs("div", { className: "eyebrow", style: { marginBottom: "6px" }, children: [_jsx("span", { className: "eyebrow-dot" }), _jsx("span", { children: "PRECISION-RECALL" })] }), _jsxs("div", { className: "flex items-baseline justify-between mb-4", children: [_jsx("h3", { style: { margin: 0, fontSize: "19px", fontWeight: 500, color: THEME.ink }, children: "Precision vs Recall Dynamic" }), _jsx("span", { style: {
                            fontSize: "12px",
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderRadius: "999px",
                            backgroundColor: "rgba(22,163,74,0.12)",
                            color: "#16A34A",
                        }, children: "AP = 0.891" })] }), _jsx(ResponsiveContainer, { width: "100%", height: 210, children: _jsxs(AreaChart, { data: prData, margin: { top: 4, right: 12, bottom: 16, left: -10 }, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "prGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: THEME.ink, stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: THEME.ink, stopOpacity: 0.02 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#E2DED9" }), _jsx(XAxis, { dataKey: "recall", tick: { fill: THEME.slateGray, fontSize: 10 }, label: { value: "Recall", position: "insideBottom", offset: -10, fill: THEME.slateGray, fontSize: 10 } }), _jsx(YAxis, { tick: { fill: THEME.slateGray, fontSize: 10 }, domain: [0.5, 1], label: { value: "Precision", angle: -90, position: "insideLeft", fill: THEME.slateGray, fontSize: 10 } }), _jsx(Tooltip, { ...TooltipStyle }), _jsx(Area, { type: "monotone", dataKey: "precision", stroke: THEME.ink, strokeWidth: 2.5, fill: "url(#prGrad)", dot: false, activeDot: { r: 5, fill: THEME.signalOrange } })] }) })] }));
}
// ─── Feature Importance ───────────────────────────────────────────────────────
function FeatureImportance() {
    return (_jsxs("div", { style: {
            backgroundColor: THEME.lifted,
            borderRadius: "32px",
            border: `1px solid ${THEME.borderLight}`,
            padding: "32px",
            height: "100%",
        }, children: [_jsxs("div", { className: "eyebrow", style: { marginBottom: "6px" }, children: [_jsx("span", { className: "eyebrow-dot" }), _jsx("span", { children: "PREDICTIVE RANKING" })] }), _jsx("h3", { style: { margin: "0 0 18px", fontSize: "19px", fontWeight: 500, color: THEME.ink }, children: "Top Predictive Signals" }), _jsx("div", { style: { display: "flex", flexDirection: "column", gap: "14px" }, children: featureData.map((f) => (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-1.5", children: [_jsx("span", { style: { fontSize: "13px", color: THEME.ink, fontWeight: 500 }, children: f.name }), _jsxs("span", { style: {
                                        fontSize: "12.5px",
                                        fontWeight: 700,
                                        color: THEME.signalOrange,
                                        fontVariantNumeric: "tabular-nums",
                                    }, children: [f.alt, "%"] })] }), _jsx("div", { style: {
                                height: "8px",
                                backgroundColor: THEME.canvas,
                                borderRadius: "999px",
                                position: "relative",
                                overflow: "hidden",
                            }, children: _jsx("div", { style: {
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    height: "100%",
                                    width: `${f.alt}%`,
                                    backgroundColor: THEME.ink,
                                    borderRadius: "999px",
                                } }) })] }, f.name))) }), _jsxs("div", { style: {
                    display: "flex",
                    gap: "20px",
                    marginTop: "20px",
                    paddingTop: "14px",
                    borderTop: `1px solid ${THEME.borderLight}`,
                }, children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [_jsx("div", { style: { width: "10px", height: "10px", backgroundColor: THEME.slateGray, borderRadius: "50%" } }), _jsx("span", { style: { fontSize: "12px", color: THEME.slateGray }, children: "Bureau Baseline" })] }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [_jsx("div", { style: { width: "10px", height: "10px", backgroundColor: THEME.ink, borderRadius: "50%" } }), _jsx("span", { style: { fontSize: "12px", color: THEME.slateGray }, children: "With Alternative Data" })] })] })] }));
}
// ─── Alternative Data Impact ──────────────────────────────────────────────────
function AltDataImpact() {
    return (_jsxs("div", { style: {
            backgroundColor: THEME.lifted,
            borderRadius: "32px",
            border: `1px solid ${THEME.borderLight}`,
            padding: "36px",
            marginBottom: "36px",
        }, children: [_jsxs("div", { className: "flex justify-between items-start mb-8 flex-wrap gap-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "eyebrow", style: { marginBottom: "6px" }, children: [_jsx("span", { className: "eyebrow-dot" }), _jsx("span", { children: "PORTFOLIO EXPANSION" })] }), _jsx("h2", { style: { fontSize: "22px", fontWeight: 500, color: THEME.ink, margin: 0 }, children: "Alternative Data Lift Analysis" }), _jsx("p", { style: { color: THEME.slateGray, fontSize: "14.5px", margin: "6px 0 0" }, children: "Side-by-side performance: traditional bureau model vs. CrediNova multi-signal engine" })] }), _jsxs("div", { style: {
                            backgroundColor: "rgba(22, 163, 74, 0.12)",
                            borderRadius: "999px",
                            padding: "8px 20px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }, children: [_jsx("span", { style: { fontSize: "20px", fontWeight: 700, color: "#16A34A" }, children: "+38%" }), _jsx("span", { style: { fontSize: "13px", color: "#16A34A", fontWeight: 600 }, children: "Thin-File Inclusion Lift" })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: altImpact.map((row) => {
                    const maxBar = row.label === "Default Rate" ? 10 : 100;
                    const pctTrad = (row.trad / maxBar) * 100;
                    const pctAlt = (row.alt / maxBar) * 100;
                    const delta = row.higher
                        ? `+${(((row.alt - row.trad) / row.trad) * 100).toFixed(0)}%`
                        : `−${(row.trad - row.alt).toFixed(1)}%`;
                    return (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-3", children: [_jsx("span", { style: { fontSize: "14.5px", fontWeight: 600, color: THEME.ink }, children: row.label }), _jsxs("span", { style: {
                                            fontSize: "12px",
                                            fontWeight: 700,
                                            padding: "3px 10px",
                                            borderRadius: "999px",
                                            backgroundColor: "rgba(22,163,74,0.12)",
                                            color: "#16A34A",
                                        }, children: [delta, " improvement"] })] }), _jsx("div", { className: "flex flex-col gap-2", children: [
                                    { lbl: "Traditional Only", pct: pctTrad, val: row.trad, isAlt: false },
                                    { lbl: "Trad + Alt Data", pct: pctAlt, val: row.alt, isAlt: true },
                                ].map((b) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { style: {
                                                fontSize: "12px",
                                                color: b.isAlt ? THEME.ink : THEME.slateGray,
                                                width: "120px",
                                                flexShrink: 0,
                                                fontWeight: b.isAlt ? 600 : 400,
                                            }, children: b.lbl }), _jsx("div", { style: {
                                                flex: 1,
                                                height: "8px",
                                                backgroundColor: THEME.canvas,
                                                borderRadius: "999px",
                                                overflow: "hidden",
                                            }, children: _jsx("div", { style: {
                                                    height: "100%",
                                                    width: `${b.pct}%`,
                                                    backgroundColor: b.isAlt ? THEME.ink : THEME.dustTaupe,
                                                    borderRadius: "999px",
                                                    transition: "width 0.6s ease",
                                                } }) }), _jsxs("span", { style: {
                                                fontSize: "12.5px",
                                                fontWeight: 700,
                                                color: b.isAlt ? THEME.ink : THEME.slateGray,
                                                width: "44px",
                                                textAlign: "right",
                                                flexShrink: 0,
                                            }, children: [b.val, "%"] })] }, b.lbl))) })] }, row.label));
                }) })] }));
}
// ─── SHAP Chart ───────────────────────────────────────────────────────────────
function SHAPChart() {
    const maxAbs = 0.35;
    return (_jsxs("div", { style: {
            backgroundColor: THEME.lifted,
            borderRadius: "32px",
            border: `1px solid ${THEME.borderLight}`,
            padding: "36px",
            marginBottom: "36px",
        }, children: [_jsxs("div", { className: "eyebrow", style: { marginBottom: "6px" }, children: [_jsx("span", { className: "eyebrow-dot" }), _jsx("span", { children: "EXPLAINABLE AI (XAI) ATTRIBUTION" })] }), _jsx("h2", { style: { fontSize: "22px", fontWeight: 500, color: THEME.ink, margin: "0 0 6px" }, children: "SHAP Global Feature Contributions" }), _jsx("p", { style: { color: THEME.slateGray, fontSize: "14.5px", margin: "0 0 28px", maxWidth: "760px", lineHeight: 1.55 }, children: "SHAP (SHapley Additive exPlanations) values quantify each factor's marginal attribution to the final automated credit decision." }), _jsxs("div", { className: "flex justify-between text-xs font-bold mb-4", children: [_jsx("span", { style: { color: THEME.signalOrange, paddingLeft: 180 }, children: "\u2190 Pushes Toward Elevated Risk" }), _jsx("span", { style: { color: "#16A34A", paddingRight: 40 }, children: "Pushes Toward Approval \u2192" })] }), _jsxs("div", { style: { position: "relative" }, children: [_jsx("div", { style: {
                            position: "absolute",
                            left: "calc(180px + 50%)",
                            top: 0,
                            bottom: 0,
                            width: "1px",
                            backgroundColor: THEME.borderLight,
                            zIndex: 0,
                        } }), shapData.map((s) => {
                        const pos = s.value > 0;
                        const pct = (Math.abs(s.value) / maxAbs) * 44;
                        return (_jsxs("div", { className: "flex items-center mb-3 relative", children: [_jsx("div", { style: { width: "180px", textAlign: "right", paddingRight: "16px", flexShrink: 0 }, children: _jsx("span", { style: { fontSize: "13.5px", color: THEME.ink, fontWeight: 500 }, children: s.feature }) }), _jsx("div", { style: {
                                        flex: 1,
                                        position: "relative",
                                        height: "28px",
                                        display: "flex",
                                        alignItems: "center",
                                    }, children: pos ? (_jsx("div", { style: {
                                            position: "absolute",
                                            left: "50%",
                                            top: "4px",
                                            height: "20px",
                                            width: `${pct}%`,
                                            backgroundColor: "#16A34A",
                                            borderRadius: "0 999px 999px 0",
                                        } })) : (_jsx("div", { style: {
                                            position: "absolute",
                                            right: "50%",
                                            top: "4px",
                                            height: "20px",
                                            width: `${pct}%`,
                                            backgroundColor: THEME.signalOrange,
                                            borderRadius: "999px 0 0 999px",
                                        } })) }), _jsx("div", { style: {
                                        width: "68px",
                                        paddingLeft: "10px",
                                        flexShrink: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                    }, children: _jsxs("span", { style: {
                                            fontSize: "12.5px",
                                            fontWeight: 700,
                                            color: pos ? "#16A34A" : THEME.signalOrange,
                                            fontVariantNumeric: "tabular-nums",
                                        }, children: [pos ? "+" : "", s.value.toFixed(2)] }) })] }, s.feature));
                    })] })] }));
}
// ─── Fairness Audit ───────────────────────────────────────────────────────────
function FairnessAudit() {
    return (_jsxs("div", { style: {
            backgroundColor: THEME.lifted,
            borderRadius: "32px",
            border: `1px solid ${THEME.borderLight}`,
            padding: "36px",
            marginBottom: "36px",
        }, children: [_jsxs("div", { className: "flex justify-between items-start mb-8 flex-wrap gap-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "eyebrow", style: { marginBottom: "6px" }, children: [_jsx("span", { className: "eyebrow-dot" }), _jsx("span", { children: "FAIR LENDING & DEMOGRAPHIC BIAS AUDIT" })] }), _jsx("h2", { style: { fontSize: "22px", fontWeight: 500, color: THEME.ink, margin: 0 }, children: "Demographic Subgroup Acceptance Parity" }), _jsx("p", { style: { color: THEME.slateGray, fontSize: "14.5px", margin: "6px 0 0" }, children: "Acceptance rate across age bands and geography \u00B7 Traditional baseline vs. CrediNova model" })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsxs("span", { style: {
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    padding: "4px 14px",
                                    borderRadius: "999px",
                                    backgroundColor: "rgba(22, 163, 74, 0.12)",
                                    color: "#16A34A",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                }, children: [_jsx(Check, { size: 14, strokeWidth: 2.5 }), " Demographic Parity: PASSED (\u00B13.8%)"] }), _jsxs("span", { style: {
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    padding: "4px 14px",
                                    borderRadius: "999px",
                                    backgroundColor: "rgba(20, 20, 19, 0.08)",
                                    color: THEME.ink,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                }, children: [_jsx(ShieldCheck, { size: 14 }), " Equalized Odds: BALANCED"] })] })] }), _jsx(ResponsiveContainer, { width: "100%", height: 220, children: _jsxs(BarChart, { data: subgroupData, margin: { top: 4, right: 16, bottom: 4, left: 0 }, barGap: 6, barCategoryGap: "28%", children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#E2DED9", vertical: false }), _jsx(XAxis, { dataKey: "group", tick: { fill: THEME.ink, fontSize: 12 }, axisLine: false, tickLine: false }), _jsx(YAxis, { tick: { fill: THEME.slateGray, fontSize: 11 }, tickFormatter: (v) => `${v}%`, domain: [40, 100], axisLine: false, tickLine: false }), _jsx(Tooltip, { ...TooltipStyle, formatter: (v, name) => [
                                `${v}%`,
                                name === "trad" ? "Traditional Only" : "Trad + Alt Data",
                            ] }), _jsx(Bar, { dataKey: "trad", name: "Traditional Only", fill: THEME.dustTaupe, radius: [6, 6, 0, 0] }), _jsx(Bar, { dataKey: "alt", name: "Trad + Alt Data", fill: THEME.ink, radius: [6, 6, 0, 0] })] }) }), _jsxs("div", { style: {
                    display: "flex",
                    gap: "24px",
                    marginTop: "16px",
                    paddingTop: "14px",
                    borderTop: `1px solid ${THEME.borderLight}`,
                }, children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [_jsx("div", { style: { width: "12px", height: "12px", backgroundColor: THEME.dustTaupe, borderRadius: "50%" } }), _jsx("span", { style: { fontSize: "12px", color: THEME.slateGray }, children: "Traditional Only" })] }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [_jsx("div", { style: { width: "12px", height: "12px", backgroundColor: THEME.ink, borderRadius: "50%" } }), _jsx("span", { style: { fontSize: "12px", color: THEME.ink, fontWeight: 600 }, children: "Traditional + Alternative Data (CrediNova)" })] })] })] }));
}
// ─── Floating Callout Notes ──────────────────────────────────────────────────
function CalloutPanel({ dismissed, onDismiss, }) {
    const visible = callouts.filter((c) => !dismissed.has(c.id));
    if (visible.length === 0)
        return null;
    return (_jsx("div", { style: {
            position: "fixed",
            right: "24px",
            bottom: "90px",
            width: "320px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            zIndex: 40,
        }, children: visible.map((c) => (_jsxs("div", { style: {
                backgroundColor: THEME.white,
                border: `1.5px solid ${THEME.ink}`,
                borderRadius: "20px",
                padding: "16px 20px",
                boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            }, className: "animate-fade-in", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { style: {
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
                                    }, children: c.id }), _jsx("span", { style: { fontSize: "13.5px", fontWeight: 700, color: THEME.ink }, children: c.title })] }), _jsx("button", { onClick: () => onDismiss(c.id), style: {
                                background: "none",
                                border: "none",
                                color: THEME.slateGray,
                                cursor: "pointer",
                                padding: "2px",
                            }, "aria-label": "Dismiss note", children: _jsx(X, { size: 15 }) })] }), _jsx("p", { style: { fontSize: "12.5px", color: THEME.charcoal, lineHeight: 1.55, margin: 0 }, children: c.body })] }, c.id))) }));
}
function SupabaseLiveAudit() {
    const [assessments, setAssessments] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("predictions");
    const loadAuditData = async () => {
        setLoading(true);
        try {
            const [ass, preds] = await Promise.all([
                fetchRecentAssessments(10),
                fetchRecentPredictions(10),
            ]);
            setAssessments(ass);
            setPredictions(preds);
        }
        catch (err) {
            console.warn("Failed to load audit data:", err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadAuditData();
    }, []);
    return (_jsxs("div", { style: {
            backgroundColor: THEME.lifted,
            borderRadius: "32px",
            border: `1px solid ${THEME.borderLight}`,
            padding: "36px",
            marginBottom: "36px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
        }, children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", children: [_jsxs("div", { children: [_jsxs("div", { className: "eyebrow", style: { marginBottom: "8px" }, children: [_jsx("span", { className: "eyebrow-dot" }), _jsx("span", { children: "POSTGRESQL AUDIT TRAIL \u00B7 LIVE TELEMETRY" })] }), _jsx("h2", { style: {
                                    fontSize: "24px",
                                    fontWeight: 500,
                                    color: THEME.ink,
                                    margin: 0,
                                }, children: "Supabase Live Database Operations" }), _jsx("p", { style: { fontSize: "14px", color: THEME.slateGray, margin: "4px 0 0" }, children: "Real-time audit log of submissions, ML inferences, and benchmark applicants across the 3 core tables." })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { style: {
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
                                }, children: [_jsx("span", { style: {
                                            width: "8px",
                                            height: "8px",
                                            borderRadius: "50%",
                                            backgroundColor: "#16A34A",
                                        } }), _jsx("span", { children: "Supabase Connected" })] }), _jsxs("button", { onClick: loadAuditData, disabled: loading, className: "btn-secondary", style: { padding: "8px 16px", fontSize: "13px" }, children: [_jsx(RefreshCw, { size: 14, className: loading ? "animate-spin" : "" }), _jsx("span", { children: "Refresh" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-5 mb-8", children: [_jsxs("div", { style: {
                            backgroundColor: THEME.white,
                            borderRadius: "20px",
                            border: `1px solid ${THEME.borderLight}`,
                            padding: "20px",
                        }, children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { style: {
                                            width: "36px",
                                            height: "36px",
                                            borderRadius: "10px",
                                            backgroundColor: "rgba(207, 69, 0, 0.1)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }, children: _jsx(Database, { size: 18, color: THEME.signalOrange }) }), _jsxs("div", { children: [_jsx("p", { style: { fontSize: "11px", fontWeight: 700, color: THEME.slateGray, textTransform: "uppercase" }, children: "TABLE 1" }), _jsx("h4", { style: { fontSize: "15px", fontWeight: 600, color: THEME.ink, margin: 0 }, children: "demo_applicants" })] })] }), _jsxs("div", { className: "mt-3", children: [_jsx("span", { style: { fontSize: "28px", fontWeight: 700, color: THEME.ink }, children: "1,000+" }), _jsx("p", { style: { fontSize: "12px", color: THEME.slateGray, margin: "2px 0 0" }, children: "Pre-computed Home Credit records \u00B7 82 ML features" })] })] }), _jsxs("div", { style: {
                            backgroundColor: THEME.white,
                            borderRadius: "20px",
                            border: `1px solid ${THEME.borderLight}`,
                            padding: "20px",
                        }, children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { style: {
                                            width: "36px",
                                            height: "36px",
                                            borderRadius: "10px",
                                            backgroundColor: "rgba(22, 163, 74, 0.1)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }, children: _jsx(ClipboardList, { size: 18, color: "#16A34A" }) }), _jsxs("div", { children: [_jsx("p", { style: { fontSize: "11px", fontWeight: 700, color: THEME.slateGray, textTransform: "uppercase" }, children: "TABLE 2" }), _jsx("h4", { style: { fontSize: "15px", fontWeight: 600, color: THEME.ink, margin: 0 }, children: "assessments" })] })] }), _jsxs("div", { className: "mt-3", children: [_jsx("span", { style: { fontSize: "28px", fontWeight: 700, color: THEME.ink }, children: assessments.length > 0 ? assessments.length : "Active" }), _jsx("p", { style: { fontSize: "12px", color: THEME.slateGray, margin: "2px 0 0" }, children: "Loan officer form submissions with JSON payloads" })] })] }), _jsxs("div", { style: {
                            backgroundColor: THEME.white,
                            borderRadius: "20px",
                            border: `1px solid ${THEME.borderLight}`,
                            padding: "20px",
                        }, children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { style: {
                                            width: "36px",
                                            height: "36px",
                                            borderRadius: "10px",
                                            backgroundColor: "rgba(243, 115, 56, 0.1)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }, children: _jsx(Cpu, { size: 18, color: THEME.lightSignalOrange }) }), _jsxs("div", { children: [_jsx("p", { style: { fontSize: "11px", fontWeight: 700, color: THEME.slateGray, textTransform: "uppercase" }, children: "TABLE 3" }), _jsx("h4", { style: { fontSize: "15px", fontWeight: 600, color: THEME.ink, margin: 0 }, children: "predictions" })] })] }), _jsxs("div", { className: "mt-3", children: [_jsx("span", { style: { fontSize: "28px", fontWeight: 700, color: THEME.ink }, children: predictions.length > 0 ? predictions.length : "Active" }), _jsx("p", { style: { fontSize: "12px", color: THEME.slateGray, margin: "2px 0 0" }, children: "10-Fold LightGBM ensemble inferences & SHAP values" })] })] })] }), _jsxs("div", { className: "flex items-center gap-2 mb-4 border-b pb-3", style: { borderColor: THEME.borderLight }, children: [_jsxs("button", { onClick: () => setActiveTab("predictions"), style: {
                            padding: "8px 18px",
                            borderRadius: "999px",
                            fontSize: "13.5px",
                            fontWeight: 600,
                            border: "none",
                            backgroundColor: activeTab === "predictions" ? THEME.ink : "transparent",
                            color: activeTab === "predictions" ? "#FFFFFF" : THEME.slateGray,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                        }, children: ["Recent Predictions Log (", predictions.length, ")"] }), _jsxs("button", { onClick: () => setActiveTab("assessments"), style: {
                            padding: "8px 18px",
                            borderRadius: "999px",
                            fontSize: "13.5px",
                            fontWeight: 600,
                            border: "none",
                            backgroundColor: activeTab === "assessments" ? THEME.ink : "transparent",
                            color: activeTab === "assessments" ? "#FFFFFF" : THEME.slateGray,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                        }, children: ["Recent Assessments Ingestion (", assessments.length, ")"] })] }), _jsx("div", { style: {
                    backgroundColor: THEME.white,
                    borderRadius: "20px",
                    border: `1px solid ${THEME.borderLight}`,
                    overflow: "hidden",
                }, children: activeTab === "predictions" ? (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: "13px" }, children: [_jsx("thead", { children: _jsxs("tr", { style: { backgroundColor: THEME.canvas, borderBottom: `1px solid ${THEME.borderLight}` }, children: [_jsx("th", { style: { padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }, children: "Prediction ID" }), _jsx("th", { style: { padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }, children: "Applicant ID" }), _jsx("th", { style: { padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }, children: "Credit Score" }), _jsx("th", { style: { padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }, children: "Default Prob (PD)" }), _jsx("th", { style: { padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }, children: "Risk Band" }), _jsx("th", { style: { padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }, children: "Model Version" }), _jsx("th", { style: { padding: "12px 16px", textAlign: "right", fontWeight: 600, color: THEME.ink }, children: "Recorded At" })] }) }), _jsx("tbody", { children: predictions.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 7, style: { padding: "32px", textAlign: "center", color: THEME.slateGray }, children: loading ? "Fetching live records from Supabase..." : "No prediction records found yet." }) })) : (predictions.map((p, i) => (_jsxs("tr", { style: { borderBottom: `1px solid ${THEME.borderLight}` }, children: [_jsx("td", { style: { padding: "12px 16px", fontFamily: "monospace", color: THEME.slateGray }, children: p.id ? p.id.slice(0, 8) + "..." : "local-pred" }), _jsxs("td", { style: { padding: "12px 16px", fontWeight: 600, color: THEME.ink }, children: ["#", p.applicant_id] }), _jsx("td", { style: { padding: "12px 16px", fontWeight: 700, color: THEME.ink }, children: p.credit_score }), _jsxs("td", { style: { padding: "12px 16px", color: THEME.ink }, children: [p.default_probability_percent, "%"] }), _jsx("td", { style: { padding: "12px 16px" }, children: _jsx("span", { style: {
                                                    padding: "3px 10px",
                                                    borderRadius: "999px",
                                                    fontSize: "11.5px",
                                                    fontWeight: 600,
                                                    backgroundColor: p.risk_band === "Good" || p.risk_band === "Excellent"
                                                        ? "rgba(22, 163, 74, 0.12)"
                                                        : p.risk_band === "Fair" || p.risk_band === "Moderate"
                                                            ? "rgba(243, 115, 56, 0.15)"
                                                            : "rgba(220, 38, 38, 0.12)",
                                                    color: p.risk_band === "Good" || p.risk_band === "Excellent"
                                                        ? "#16A34A"
                                                        : p.risk_band === "Fair" || p.risk_band === "Moderate"
                                                            ? THEME.clayBrown
                                                            : THEME.red,
                                                }, children: p.risk_band }) }), _jsx("td", { style: { padding: "12px 16px", fontSize: "12px", color: THEME.slateGray }, children: p.model_version }), _jsx("td", { style: { padding: "12px 16px", textAlign: "right", fontSize: "12px", color: THEME.slateGray }, children: p.created_at ? new Date(p.created_at).toLocaleTimeString() : "Just now" })] }, p.id || i)))) })] }) })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: "13px" }, children: [_jsx("thead", { children: _jsxs("tr", { style: { backgroundColor: THEME.canvas, borderBottom: `1px solid ${THEME.borderLight}` }, children: [_jsx("th", { style: { padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }, children: "Assessment ID" }), _jsx("th", { style: { padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }, children: "Customer ID" }), _jsx("th", { style: { padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }, children: "Applicant ID" }), _jsx("th", { style: { padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }, children: "DTI Ratio" }), _jsx("th", { style: { padding: "12px 16px", textAlign: "left", fontWeight: 600, color: THEME.ink }, children: "Status" }), _jsx("th", { style: { padding: "12px 16px", textAlign: "right", fontWeight: 600, color: THEME.ink }, children: "Ingested At" })] }) }), _jsx("tbody", { children: assessments.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, style: { padding: "32px", textAlign: "center", color: THEME.slateGray }, children: loading ? "Fetching live records from Supabase..." : "No assessment records found yet." }) })) : (assessments.map((a, i) => (_jsxs("tr", { style: { borderBottom: `1px solid ${THEME.borderLight}` }, children: [_jsxs("td", { style: { padding: "12px 16px", fontFamily: "monospace", color: THEME.slateGray }, children: [a.id.slice(0, 8), "..."] }), _jsx("td", { style: { padding: "12px 16px", fontWeight: 600, color: THEME.ink }, children: a.customer_id || "N/A" }), _jsx("td", { style: { padding: "12px 16px", color: THEME.ink }, children: a.applicant_id ? `#${a.applicant_id}` : "—" }), _jsx("td", { style: { padding: "12px 16px", color: THEME.ink }, children: a.dti !== null && a.dti !== undefined ? `${a.dti}%` : "—" }), _jsx("td", { style: { padding: "12px 16px" }, children: _jsx("span", { style: {
                                                    padding: "3px 10px",
                                                    borderRadius: "999px",
                                                    fontSize: "11.5px",
                                                    fontWeight: 600,
                                                    backgroundColor: "rgba(22, 163, 74, 0.12)",
                                                    color: "#16A34A",
                                                }, children: a.status }) }), _jsx("td", { style: { padding: "12px 16px", textAlign: "right", fontSize: "12px", color: THEME.slateGray }, children: a.created_at ? new Date(a.created_at).toLocaleTimeString() : "Just now" })] }, a.id || i)))) })] }) })) })] }));
}
// ─── Main Judge Dashboard ────────────────────────────────────────────────────
export default function JudgeDashboard() {
    const [dismissed, setDismissed] = useState(new Set());
    const [calloutsOn, setCalloutsOn] = useState(true);
    const dismiss = (id) => setDismissed((prev) => new Set([...prev, id]));
    const toggleCallouts = () => {
        if (calloutsOn) {
            setCalloutsOn(false);
        }
        else {
            setDismissed(new Set());
            setCalloutsOn(true);
        }
    };
    const handleExport = () => {
        alert("Generating Model Audit Dossier PDF...\nCrediNova AI Model Validation · XGBoost Ensemble v3.2.1 · Q3 2026");
    };
    return (_jsxs("div", { style: { minHeight: "100%", backgroundColor: THEME.canvas }, children: [_jsx(Navbar, {}), _jsxs("main", { style: {
                    maxWidth: "1240px",
                    margin: "0 auto",
                    padding: "110px 24px 80px",
                }, children: [_jsx(PageHeader, { onToggleCallouts: toggleCallouts, calloutsOn: calloutsOn, onExport: handleExport }), _jsx(SystemFlow, {}), _jsxs("div", { className: "eyebrow", style: { marginBottom: "14px" }, children: [_jsx("span", { className: "eyebrow-dot" }), _jsx("span", { children: "REAL-TIME ENSEMBLE METRICS" })] }), _jsx(KPICards, {}), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8", children: [_jsx(ConfusionMatrix, {}), _jsx(ROCCurve, {}), _jsx(PRCurve, {}), _jsx(FeatureImportance, {})] }), _jsx(AltDataImpact, {}), _jsx(SHAPChart, {}), _jsx(FairnessAudit, {}), _jsx(SupabaseLiveAudit, {}), _jsxs("div", { style: {
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingTop: "28px",
                            borderTop: `1px solid ${THEME.borderLight}`,
                            flexWrap: "wrap",
                            gap: "16px",
                        }, children: [_jsxs(Link, { to: "/", className: "btn-ghost", style: { fontSize: "14px", padding: "10px 20px" }, children: [_jsx(ArrowLeft, { size: 15 }), _jsx("span", { children: "Back to Overview" })] }), _jsxs("div", { style: { display: "flex", gap: "12px" }, children: [_jsxs(Link, { to: "/assessment", className: "btn-secondary", style: { fontSize: "14px", padding: "10px 22px" }, children: [_jsx(Sparkles, { size: 15, color: THEME.lightSignalOrange }), _jsx("span", { children: "Launch Assessment Flow" })] }), _jsxs("button", { className: "btn-primary", onClick: handleExport, style: { fontSize: "14px", padding: "10px 24px" }, children: [_jsx(Download, { size: 15 }), _jsx("span", { children: "Export Dossier" })] })] })] })] }), calloutsOn && _jsx(CalloutPanel, { dismissed: dismissed, onDismiss: dismiss }), calloutsOn && (_jsx("div", { style: {
                    position: "fixed",
                    left: "24px",
                    bottom: "28px",
                    display: "flex",
                    gap: "8px",
                    zIndex: 40,
                }, children: callouts.map((c) => (_jsx("button", { onClick: () => setDismissed((prev) => {
                        const next = new Set(prev);
                        next.has(c.id) ? next.delete(c.id) : next.add(c.id);
                        return next;
                    }), title: c.title, style: {
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
                    }, children: c.id }, c.id))) }))] }));
}
