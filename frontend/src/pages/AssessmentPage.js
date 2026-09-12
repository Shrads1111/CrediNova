import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, AlertCircle, ArrowRight, ArrowLeft, RotateCcw, Save, Zap, Sparkles, Cpu, Search, User, DollarSign, ShieldCheck, Layers, } from "lucide-react";
import { Navbar } from "../components/common/Navbar";
import { useAssessment } from "../context/AssessmentContext";
import { fieldLabel } from "../constants/fieldLabels";
import { CONTRACT_TYPES, GENDER_OPTIONS, OWN_CAR_OPTIONS, INCOME_TYPES, EDUCATION_TYPES, FAMILY_STATUSES, HOUSING_TYPES, OCCUPATION_TYPES, ORGANIZATION_TYPES, } from "../types/assessment";
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
    { label: "Applicant Lookup", icon: Search },
    { label: "Financial & Loan", icon: DollarSign },
    { label: "Applicant & Employment", icon: User },
    { label: "Credit & Risk", icon: ShieldCheck },
    { label: "Review & Submit", icon: Layers },
];
// ─── Shared input style (unchanged) ──────────────────────────────────────────
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
// ─── Reusable form primitives (design unchanged) ──────────────────────────────
function FormField({ label, required, error, hint, children, }) {
    return (_jsxs("div", { style: { marginBottom: "20px" }, children: [_jsxs("div", { style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "8px",
                }, children: [_jsxs("label", { style: { fontSize: "14px", fontWeight: 600, color: THEME.ink }, children: [label, required && _jsx("span", { style: { color: THEME.signalOrange }, children: " *" })] }), hint && _jsx("span", { style: { fontSize: "12px", color: THEME.slateGray }, children: hint })] }), children, error && (_jsxs("p", { style: {
                    fontSize: "12.5px",
                    color: THEME.signalOrange,
                    marginTop: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontWeight: 500,
                }, children: [_jsx(AlertCircle, { size: 14 }), _jsx("span", { children: error })] }))] }));
}
function SectionCard({ title, subtitle, children, }) {
    return (_jsxs("div", { className: "card-lifted mb-8", style: {
            padding: "36px",
            backgroundColor: THEME.lifted,
            borderRadius: "32px",
            border: `1px solid ${THEME.borderLight}`,
            boxShadow: "0 12px 36px rgba(0,0,0,0.04)",
        }, children: [_jsxs("div", { style: { marginBottom: "28px" }, children: [_jsx("h3", { style: { fontSize: "22px", fontWeight: 500, color: THEME.ink, marginBottom: "6px" }, children: title }), subtitle && (_jsx("p", { style: { fontSize: "14.5px", color: THEME.slateGray, margin: 0 }, children: subtitle }))] }), children] }));
}
// Convenience: field label lookup shorthand
const fl = (key) => fieldLabel(key);
// ─── Numeric field helper ─────────────────────────────────────────────────────
// Formats raw number strings with commas for display; stores raw digits in state.
function NumericInput({ value, onChange, placeholder, prefix, step = "1", min, max, }) {
    return (_jsxs("div", { style: { position: "relative" }, children: [prefix && (_jsx("span", { style: {
                    position: "absolute",
                    left: "16px",
                    top: "12px",
                    color: THEME.slateGray,
                    fontWeight: 600,
                    pointerEvents: "none",
                }, children: prefix })), _jsx("input", { type: "number", value: value, onChange: (e) => onChange(e.target.value), placeholder: placeholder, step: step, min: min, max: max, style: { ...inputStyle, paddingLeft: prefix ? "36px" : inputStyle.padding } })] }));
}
// ─── Page Header (design unchanged) ──────────────────────────────────────────
function PageHeader() {
    const { loadDemoApplicant, resetAssessment, saveDraft } = useAssessment();
    return (_jsx("div", { style: {
            backgroundColor: THEME.lifted,
            borderBottom: `1px solid ${THEME.borderLight}`,
            padding: "28px 0",
        }, children: _jsx("div", { style: { maxWidth: "1240px", margin: "0 auto", padding: "0 24px" }, children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "eyebrow", style: { marginBottom: "8px" }, children: [_jsx("span", { className: "eyebrow-dot" }), _jsx("span", { children: "LOAN OFFICER ASSESSMENT WORKFLOW" })] }), _jsx("h1", { style: {
                                    fontSize: "clamp(26px, 3.5vw, 36px)",
                                    fontWeight: 500,
                                    color: THEME.ink,
                                    letterSpacing: "-0.02em",
                                    margin: 0,
                                }, children: "Applicant Credit Intelligence Evaluation" }), _jsx("p", { style: {
                                    fontSize: "15px",
                                    color: THEME.charcoal,
                                    marginTop: "6px",
                                    fontWeight: 450,
                                }, children: "Enter an Applicant ID to load their record, review the relevant fields, and launch the AI-calibrated credit scoring engine." })] }), _jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [_jsxs("button", { onClick: loadDemoApplicant, className: "btn-secondary", style: { fontSize: "14px", padding: "8px 20px" }, title: "Pre-fill with demo applicant ID 100001", children: [_jsx(Zap, { size: 15, color: THEME.lightSignalOrange }), _jsx("span", { children: "Pre-fill Demo Applicant" })] }), _jsxs("button", { onClick: saveDraft, className: "btn-ghost", style: { fontSize: "14px", padding: "8px 18px" }, children: [_jsx(Save, { size: 15 }), _jsx("span", { children: "Save Draft" })] }), _jsxs("button", { onClick: resetAssessment, className: "btn-ghost", style: {
                                    fontSize: "14px",
                                    padding: "8px 18px",
                                    borderColor: "rgba(207, 69, 0, 0.3)",
                                    color: THEME.signalOrange,
                                }, children: [_jsx(RotateCcw, { size: 15 }), _jsx("span", { children: "Reset" })] })] })] }) }) }));
}
// ─── Progress Bar (design unchanged) ─────────────────────────────────────────
function ProgressBar({ currentStep, onSelectStep, }) {
    return (_jsx("div", { style: {
            backgroundColor: THEME.canvas,
            borderBottom: `1px solid ${THEME.borderLight}`,
            padding: "16px 0",
        }, children: _jsx("div", { style: { maxWidth: "1240px", margin: "0 auto", padding: "0 24px" }, children: _jsx("div", { className: "flex items-center justify-between overflow-x-auto pb-2 scrollbar-hide", children: STEPS.map((step, i) => {
                    const isDone = i < currentStep;
                    const isCurr = i === currentStep;
                    return (_jsxs("div", { className: "flex items-center flex-1 min-w-[190px]", children: [_jsxs("button", { onClick: () => onSelectStep(i), style: {
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
                                }, children: [_jsx("div", { style: {
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
                                            border: isDone || isCurr
                                                ? `1.5px solid ${THEME.ink}`
                                                : `1px solid ${THEME.borderLight}`,
                                            flexShrink: 0,
                                        }, children: isDone ? (_jsx(Check, { size: 16, strokeWidth: 2.5, color: "#FFFFFF" })) : (i + 1) }), _jsxs("div", { children: [_jsxs("div", { style: {
                                                    fontSize: "11px",
                                                    fontWeight: 700,
                                                    textTransform: "uppercase",
                                                    color: isCurr ? THEME.signalOrange : THEME.slateGray,
                                                    letterSpacing: "0.05em",
                                                }, children: ["Step 0", i + 1] }), _jsx("div", { style: {
                                                    fontSize: "13.5px",
                                                    fontWeight: isCurr ? 600 : 450,
                                                    color: THEME.ink,
                                                    whiteSpace: "nowrap",
                                                }, children: step.label })] })] }), i < STEPS.length - 1 && (_jsx("div", { style: {
                                    flex: 1,
                                    height: "1.5px",
                                    backgroundColor: i < currentStep ? THEME.ink : THEME.borderLight,
                                    margin: "0 10px",
                                    minWidth: "16px",
                                } }))] }, step.label));
                }) }) }) }));
}
// ─── Step 0: Applicant Lookup ─────────────────────────────────────────────────
function StepLookup() {
    const { lookupId, setLookupId, loadApplicantById, loadDemoApplicant, isLoadingApplicant, lookupError, errors, } = useAssessment();
    const sampleApplicants = [
        { id: "100001", label: "Applicant #100001 (Prime / Low Risk)" },
        { id: "100005", label: "Applicant #100005 (Standard Loan)" },
        { id: "100013", label: "Applicant #100013 (High Credit Tier)" },
        { id: "100028", label: "Applicant #100028 (Thin-File Inclusion)" },
    ];
    const handleConfirmId = async (idToLoad) => {
        const target = idToLoad ?? lookupId;
        if (!target.trim())
            return;
        await loadApplicantById(target.trim());
    };
    return (_jsx("div", { className: "animate-fade-in", children: _jsxs(SectionCard, { title: "Applicant Lookup & Ingestion", subtitle: "Retrieve benchmark applicant data from the Supabase demo_applicants table to populate the credit evaluation parameters.", children: [_jsx("div", { style: { maxWidth: "560px" }, children: _jsx(FormField, { label: fl("SK_ID_CURR"), required: true, error: errors.lookupId || lookupError || undefined, hint: "Database benchmark identifier (SK_ID_CURR)", children: _jsxs("div", { style: { display: "flex", gap: "12px" }, children: [_jsx("input", { type: "text", value: lookupId, onChange: (e) => setLookupId(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleConfirmId(), placeholder: "e.g. 100001, 100005, 100013...", style: inputStyle, autoFocus: true, disabled: isLoadingApplicant }), _jsx("button", { onClick: () => handleConfirmId(), disabled: isLoadingApplicant, className: "btn-primary", style: {
                                        padding: "11px 24px",
                                        flexShrink: 0,
                                        opacity: isLoadingApplicant ? 0.7 : 1,
                                    }, children: isLoadingApplicant ? (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx("span", { style: {
                                                    width: "14px",
                                                    height: "14px",
                                                    border: "2px solid #FFFFFF",
                                                    borderTopColor: "transparent",
                                                    borderRadius: "50%",
                                                    animation: "spin 1s linear infinite",
                                                    display: "inline-block",
                                                } }), _jsx("span", { children: "Loading..." })] })) : (_jsxs(_Fragment, { children: [_jsx(Search, { size: 16 }), _jsx("span", { children: "Load Record" })] })) })] }) }) }), _jsxs("div", { style: { marginTop: "16px", marginBottom: "24px" }, children: [_jsx("p", { style: {
                                fontSize: "12.5px",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                color: THEME.slateGray,
                                marginBottom: "10px",
                            }, children: "Quick Benchmarks from demo_applicants table:" }), _jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "8px" }, children: sampleApplicants.map((samp) => (_jsxs("button", { onClick: () => {
                                    setLookupId(samp.id);
                                    handleConfirmId(samp.id);
                                }, disabled: isLoadingApplicant, style: {
                                    padding: "8px 16px",
                                    borderRadius: "999px",
                                    border: `1.5px solid ${lookupId === samp.id ? THEME.ink : THEME.borderLight}`,
                                    backgroundColor: lookupId === samp.id ? THEME.ink : THEME.white,
                                    color: lookupId === samp.id ? "#FFFFFF" : THEME.ink,
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                }, children: [_jsx(Sparkles, { size: 13, color: lookupId === samp.id
                                            ? THEME.lightSignalOrange
                                            : THEME.signalOrange }), _jsx("span", { children: samp.label })] }, samp.id))) })] }), _jsx("div", { style: {
                        marginTop: "8px",
                        padding: "18px 22px",
                        borderRadius: "20px",
                        backgroundColor: THEME.canvas,
                        border: `1px solid ${THEME.borderLight}`,
                        fontSize: "13.5px",
                        color: THEME.charcoal,
                        lineHeight: 1.6,
                        maxWidth: "640px",
                    }, children: _jsxs("p", { style: { margin: 0 }, children: [_jsx("strong", { style: { color: THEME.ink }, children: "Live Supabase Connection:" }), " ", "Clicking any applicant above or entering an ID queries the live", " ", _jsx("code", { children: "demo_applicants" }), " table in Supabase. All 25 form fields are auto-populated so you can review them and proceed to the AI credit evaluation."] }) })] }) }));
}
// ─── Step 1: Financial & Loan Information ────────────────────────────────────
function StepFinancial() {
    const { formData, setFormData, errors } = useAssessment();
    const update = (key, val) => setFormData((prev) => ({ ...prev, [key]: val }));
    return (_jsx("div", { className: "animate-fade-in", children: _jsxs(SectionCard, { title: "Financial & Loan Information", subtitle: "Core loan application details and income profile from the applicant record.", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-8", children: [_jsx(FormField, { label: fl("NAME_CONTRACT_TYPE"), required: true, error: errors.NAME_CONTRACT_TYPE, children: _jsxs("select", { value: formData.NAME_CONTRACT_TYPE, onChange: (e) => update("NAME_CONTRACT_TYPE", e.target.value), style: inputStyle, children: [_jsx("option", { value: "", children: "\u2014 Select \u2014" }), CONTRACT_TYPES.map((t) => (_jsx("option", { value: t, children: t }, t)))] }) }), _jsx(FormField, { label: fl("AMT_INCOME_TOTAL"), required: true, error: errors.AMT_INCOME_TOTAL, hint: "Annual figure from dataset", children: _jsx(NumericInput, { value: formData.AMT_INCOME_TOTAL, onChange: (v) => update("AMT_INCOME_TOTAL", v), placeholder: "e.g. 135000", step: "1000", min: "0" }) }), _jsx(FormField, { label: fl("AMT_CREDIT"), required: true, error: errors.AMT_CREDIT, children: _jsx(NumericInput, { value: formData.AMT_CREDIT, onChange: (v) => update("AMT_CREDIT", v), placeholder: "e.g. 568800", step: "1000", min: "0" }) }), _jsx(FormField, { label: fl("AMT_ANNUITY"), error: errors.AMT_ANNUITY, children: _jsx(NumericInput, { value: formData.AMT_ANNUITY, onChange: (v) => update("AMT_ANNUITY", v), placeholder: "e.g. 20560.5", step: "0.01", min: "0" }) }), _jsx(FormField, { label: fl("AMT_GOODS_PRICE"), error: errors.AMT_GOODS_PRICE, children: _jsx(NumericInput, { value: formData.AMT_GOODS_PRICE, onChange: (v) => update("AMT_GOODS_PRICE", v), placeholder: "e.g. 450000", step: "1000", min: "0" }) })] }), formData.AMT_INCOME_TOTAL && formData.AMT_ANNUITY && (_jsx("div", { style: {
                        marginTop: "8px",
                        padding: "18px 24px",
                        borderRadius: "20px",
                        backgroundColor: THEME.white,
                        border: `1px solid ${THEME.borderLight}`,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "24px",
                        flexWrap: "wrap",
                    }, children: (() => {
                        const income = parseFloat(formData.AMT_INCOME_TOTAL) || 0;
                        const annuity = parseFloat(formData.AMT_ANNUITY) || 0;
                        const credit = parseFloat(formData.AMT_CREDIT) || 0;
                        const annuityRatio = income > 0 ? ((annuity / income) * 100).toFixed(1) : "—";
                        const creditRatio = income > 0 ? ((credit / income) * 100).toFixed(1) : "—";
                        return (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("p", { style: { fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: THEME.slateGray, letterSpacing: "0.05em" }, children: "ANNUITY / INCOME" }), _jsxs("p", { style: { fontFamily: "'Sofia Sans', sans-serif", fontSize: "22px", fontWeight: 700, color: THEME.ink, margin: "2px 0 0" }, children: [annuityRatio, "%"] })] }), _jsx("div", { style: { width: "1px", height: "36px", backgroundColor: THEME.borderLight } }), _jsxs("div", { children: [_jsx("p", { style: { fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: THEME.slateGray, letterSpacing: "0.05em" }, children: "CREDIT / INCOME" }), _jsxs("p", { style: { fontFamily: "'Sofia Sans', sans-serif", fontSize: "22px", fontWeight: 700, color: THEME.ink, margin: "2px 0 0" }, children: [creditRatio, "%"] })] })] }));
                    })() }))] }) }));
}
// ─── Step 2: Applicant & Employment Information ───────────────────────────────
function StepApplicant() {
    const { formData, setFormData, errors } = useAssessment();
    const update = (key, val) => setFormData((prev) => ({ ...prev, [key]: val }));
    // Convert DAYS_BIRTH (negative days) to a human-readable age in years
    const daysToAge = (days) => {
        const d = parseFloat(days);
        if (!days || isNaN(d))
            return "";
        return `${Math.abs(Math.floor(d / 365))} years`;
    };
    // Convert DAYS_EMPLOYED (negative days) to years + months
    const daysToEmployment = (days) => {
        const d = parseFloat(days);
        if (!days || isNaN(d))
            return "";
        const totalDays = Math.abs(d);
        const years = Math.floor(totalDays / 365);
        const months = Math.floor((totalDays % 365) / 30);
        if (years === 0)
            return `${months} month${months !== 1 ? "s" : ""}`;
        return `${years} yr${years !== 1 ? "s" : ""} ${months} mo`;
    };
    return (_jsxs("div", { className: "animate-fade-in", children: [_jsx(SectionCard, { title: "Applicant Information", subtitle: "Demographic and personal classification data from the applicant record.", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-8", children: [_jsx(FormField, { label: fl("CODE_GENDER"), required: true, error: errors.CODE_GENDER, children: _jsxs("select", { value: formData.CODE_GENDER, onChange: (e) => update("CODE_GENDER", e.target.value), style: inputStyle, children: [_jsx("option", { value: "", children: "\u2014 Select \u2014" }), GENDER_OPTIONS.map((o) => (_jsx("option", { value: o.value, children: o.label }, o.value)))] }) }), _jsx(FormField, { label: fl("FLAG_OWN_CAR"), error: errors.FLAG_OWN_CAR, children: _jsxs("select", { value: formData.FLAG_OWN_CAR, onChange: (e) => update("FLAG_OWN_CAR", e.target.value), style: inputStyle, children: [_jsx("option", { value: "", children: "\u2014 Select \u2014" }), OWN_CAR_OPTIONS.map((o) => (_jsx("option", { value: o.value, children: o.label }, o.value)))] }) }), _jsx(FormField, { label: fl("NAME_INCOME_TYPE"), required: true, error: errors.NAME_INCOME_TYPE, children: _jsxs("select", { value: formData.NAME_INCOME_TYPE, onChange: (e) => update("NAME_INCOME_TYPE", e.target.value), style: inputStyle, children: [_jsx("option", { value: "", children: "\u2014 Select \u2014" }), INCOME_TYPES.map((t) => (_jsx("option", { value: t, children: t }, t)))] }) }), _jsx(FormField, { label: fl("NAME_EDUCATION_TYPE"), required: true, error: errors.NAME_EDUCATION_TYPE, children: _jsxs("select", { value: formData.NAME_EDUCATION_TYPE, onChange: (e) => update("NAME_EDUCATION_TYPE", e.target.value), style: inputStyle, children: [_jsx("option", { value: "", children: "\u2014 Select \u2014" }), EDUCATION_TYPES.map((t) => (_jsx("option", { value: t, children: t }, t)))] }) }), _jsx(FormField, { label: fl("NAME_FAMILY_STATUS"), error: errors.NAME_FAMILY_STATUS, children: _jsxs("select", { value: formData.NAME_FAMILY_STATUS, onChange: (e) => update("NAME_FAMILY_STATUS", e.target.value), style: inputStyle, children: [_jsx("option", { value: "", children: "\u2014 Select \u2014" }), FAMILY_STATUSES.map((t) => (_jsx("option", { value: t, children: t }, t)))] }) }), _jsx(FormField, { label: fl("NAME_HOUSING_TYPE"), error: errors.NAME_HOUSING_TYPE, children: _jsxs("select", { value: formData.NAME_HOUSING_TYPE, onChange: (e) => update("NAME_HOUSING_TYPE", e.target.value), style: inputStyle, children: [_jsx("option", { value: "", children: "\u2014 Select \u2014" }), HOUSING_TYPES.map((t) => (_jsx("option", { value: t, children: t }, t)))] }) })] }) }), _jsx(SectionCard, { title: "Employment Information", subtitle: "Age and employment duration in days relative to the application date.", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-8", children: [_jsx(FormField, { label: fl("DAYS_BIRTH"), required: true, error: errors.DAYS_BIRTH, hint: daysToAge(formData.DAYS_BIRTH) || "e.g. 19241 days", children: _jsx("input", { type: "number", value: formData.DAYS_BIRTH, onChange: (e) => update("DAYS_BIRTH", e.target.value), placeholder: "e.g. 19241", style: inputStyle, min: "0", step: "1" }) }), _jsx(FormField, { label: fl("DAYS_EMPLOYED"), error: errors.DAYS_EMPLOYED, hint: daysToEmployment(formData.DAYS_EMPLOYED) || "e.g. 3036 days", children: _jsx("input", { type: "number", value: formData.DAYS_EMPLOYED, onChange: (e) => update("DAYS_EMPLOYED", e.target.value), placeholder: "e.g. 3036", style: inputStyle, min: "0", step: "1" }) }), _jsx(FormField, { label: fl("OCCUPATION_TYPE"), error: errors.OCCUPATION_TYPE, children: _jsxs("select", { value: formData.OCCUPATION_TYPE, onChange: (e) => update("OCCUPATION_TYPE", e.target.value), style: inputStyle, children: [_jsx("option", { value: "", children: "\u2014 Select \u2014" }), OCCUPATION_TYPES.map((t) => (_jsx("option", { value: t, children: t }, t)))] }) }), _jsx(FormField, { label: fl("ORGANIZATION_TYPE"), error: errors.ORGANIZATION_TYPE, children: _jsxs("select", { value: formData.ORGANIZATION_TYPE, onChange: (e) => update("ORGANIZATION_TYPE", e.target.value), style: inputStyle, children: [_jsx("option", { value: "", children: "\u2014 Select \u2014" }), ORGANIZATION_TYPES.map((t) => (_jsx("option", { value: t, children: t }, t)))] }) })] }) })] }));
}
// ─── Step 3: Credit & Risk Information ───────────────────────────────────────
function StepCreditRisk() {
    const { formData, setFormData, errors } = useAssessment();
    const update = (key, val) => setFormData((prev) => ({ ...prev, [key]: val }));
    return (_jsxs("div", { className: "animate-fade-in", children: [_jsx(SectionCard, { title: "External Risk Indicators", subtitle: "Third-party risk scores sourced externally. Values typically range 0\u20131; higher is lower risk.", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-x-8", children: [_jsx(FormField, { label: fl("EXT_SOURCE_1"), error: errors.EXT_SOURCE_1, hint: "0 \u2013 1", children: _jsx("input", { type: "number", value: formData.EXT_SOURCE_1, onChange: (e) => update("EXT_SOURCE_1", e.target.value), placeholder: "e.g. 0.7524", step: "0.0001", min: "0", max: "1", style: inputStyle }) }), _jsx(FormField, { label: fl("EXT_SOURCE_2"), required: true, error: errors.EXT_SOURCE_2, hint: "0 \u2013 1", children: _jsx("input", { type: "number", value: formData.EXT_SOURCE_2, onChange: (e) => update("EXT_SOURCE_2", e.target.value), placeholder: "e.g. 0.6235", step: "0.0001", min: "0", max: "1", style: inputStyle }) }), _jsx(FormField, { label: fl("EXT_SOURCE_3"), error: errors.EXT_SOURCE_3, hint: "0 \u2013 1", children: _jsx("input", { type: "number", value: formData.EXT_SOURCE_3, onChange: (e) => update("EXT_SOURCE_3", e.target.value), placeholder: "e.g. 0.5", step: "0.0001", min: "0", max: "1", style: inputStyle }) })] }) }), _jsx(SectionCard, { title: "Credit Bureau & Social Circle", subtitle: "Bureau inquiry activity and observed default behaviour in the applicant's social network.", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-8", children: [_jsx(FormField, { label: fl("DEF_30_CNT_SOCIAL_CIRCLE"), error: errors.DEF_30_CNT_SOCIAL_CIRCLE, children: _jsx("input", { type: "number", value: formData.DEF_30_CNT_SOCIAL_CIRCLE, onChange: (e) => update("DEF_30_CNT_SOCIAL_CIRCLE", e.target.value), placeholder: "e.g. 2", step: "1", min: "0", style: inputStyle }) }), _jsx(FormField, { label: fl("DEF_60_CNT_SOCIAL_CIRCLE"), error: errors.DEF_60_CNT_SOCIAL_CIRCLE, children: _jsx("input", { type: "number", value: formData.DEF_60_CNT_SOCIAL_CIRCLE, onChange: (e) => update("DEF_60_CNT_SOCIAL_CIRCLE", e.target.value), placeholder: "e.g. 2", step: "1", min: "0", style: inputStyle }) }), _jsx(FormField, { label: fl("AMT_REQ_CREDIT_BUREAU_QRT"), error: errors.AMT_REQ_CREDIT_BUREAU_QRT, children: _jsx("input", { type: "number", value: formData.AMT_REQ_CREDIT_BUREAU_QRT, onChange: (e) => update("AMT_REQ_CREDIT_BUREAU_QRT", e.target.value), placeholder: "e.g. 0", step: "1", min: "0", style: inputStyle }) })] }) }), _jsx(SectionCard, { title: "Regional Indicators", subtitle: "Regional credit quality ratings and population density relative to the national average.", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-x-8", children: [_jsx(FormField, { label: fl("REGION_RATING_CLIENT"), required: true, error: errors.REGION_RATING_CLIENT, hint: "1 = best, 3 = worst", children: _jsxs("select", { value: formData.REGION_RATING_CLIENT, onChange: (e) => update("REGION_RATING_CLIENT", e.target.value), style: inputStyle, children: [_jsx("option", { value: "", children: "\u2014 Select \u2014" }), _jsx("option", { value: "1", children: "1 \u2014 Best" }), _jsx("option", { value: "2", children: "2 \u2014 Average" }), _jsx("option", { value: "3", children: "3 \u2014 Below average" })] }) }), _jsx(FormField, { label: fl("REGION_RATING_CLIENT_W_CITY"), error: errors.REGION_RATING_CLIENT_W_CITY, hint: "City-adjusted rating", children: _jsxs("select", { value: formData.REGION_RATING_CLIENT_W_CITY, onChange: (e) => update("REGION_RATING_CLIENT_W_CITY", e.target.value), style: inputStyle, children: [_jsx("option", { value: "", children: "\u2014 Select \u2014" }), _jsx("option", { value: "1", children: "1 \u2014 Best" }), _jsx("option", { value: "2", children: "2 \u2014 Average" }), _jsx("option", { value: "3", children: "3 \u2014 Below average" })] }) }), _jsx(FormField, { label: fl("REGION_POPULATION_RELATIVE"), error: errors.REGION_POPULATION_RELATIVE, hint: "Relative to national avg", children: _jsx("input", { type: "number", value: formData.REGION_POPULATION_RELATIVE, onChange: (e) => update("REGION_POPULATION_RELATIVE", e.target.value), placeholder: "e.g. 0.018801", step: "0.000001", min: "0", style: inputStyle }) })] }) })] }));
}
// ─── Step 4: Review & Submit ──────────────────────────────────────────────────
function StepReview({ onEdit }) {
    const { formData, originalApplicantData } = useAssessment();
    // Helper: render a label/value row in the review panel
    const Row = ({ label, value, changed, }) => (_jsxs("div", { style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            borderBottom: `1px solid ${THEME.borderLight}`,
            fontSize: "14px",
        }, children: [_jsx("span", { style: { color: THEME.slateGray }, children: label }), _jsxs("span", { style: {
                    fontWeight: 600,
                    color: changed ? THEME.signalOrange : THEME.ink,
                    textAlign: "right",
                }, children: [value || "—", changed && (_jsx("span", { style: {
                            marginLeft: "6px",
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "2px 7px",
                            borderRadius: "999px",
                            backgroundColor: "rgba(207,69,0,0.1)",
                            color: THEME.signalOrange,
                            verticalAlign: "middle",
                        }, children: "EDITED" }))] })] }));
    // Check whether a field was changed relative to the original
    const changed = (key) => {
        if (!originalApplicantData)
            return false;
        return String(formData[key]) !== String(originalApplicantData[key]);
    };
    const daysToAge = (days) => {
        const d = parseFloat(days);
        if (!days || isNaN(d))
            return days || "—";
        return `${Math.abs(Math.floor(d / 365))} years (${days} days)`;
    };
    const daysToEmployment = (days) => {
        const d = parseFloat(days);
        if (!days || isNaN(d))
            return days || "—";
        const totalDays = Math.abs(d);
        const years = Math.floor(totalDays / 365);
        const months = Math.floor((totalDays % 365) / 30);
        const readable = years > 0 ? `${years} yr${years !== 1 ? "s" : ""} ${months} mo` : `${months} mo`;
        return `${readable} (${days} days)`;
    };
    return (_jsxs("div", { className: "animate-fade-in space-y-6", children: [_jsx("div", { style: {
                    padding: "24px 30px",
                    borderRadius: "24px",
                    backgroundColor: THEME.white,
                    border: `1.5px solid ${THEME.ink}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
                }, children: _jsxs("div", { children: [_jsxs("div", { className: "eyebrow", style: { marginBottom: "6px" }, children: [_jsx("span", { className: "eyebrow-dot" }), _jsx("span", { children: "READY FOR AI SCORING ENGINE" })] }), _jsx("h3", { style: { fontSize: "20px", fontWeight: 500, color: THEME.ink, margin: 0 }, children: "Review Applicant Assessment Dossier" }), _jsxs("p", { style: { fontSize: "14px", color: THEME.slateGray, margin: "4px 0 0" }, children: ["Applicant ID: ", _jsx("strong", { style: { color: THEME.ink }, children: formData.SK_ID_CURR || "—" }), originalApplicantData && (_jsxs("span", { style: { marginLeft: "12px", fontSize: "12px", color: THEME.slateGray }, children: ["Fields highlighted in", " ", _jsx("span", { style: { color: THEME.signalOrange, fontWeight: 600 }, children: "orange" }), " were edited from the original record."] }))] })] }) }), _jsxs("div", { style: {
                    backgroundColor: THEME.lifted,
                    borderRadius: "24px",
                    padding: "28px",
                    border: `1px solid ${THEME.borderLight}`,
                }, children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h4", { style: { fontSize: "17px", fontWeight: 600, color: THEME.ink, margin: 0 }, children: "1. Financial & Loan Information" }), _jsx("button", { onClick: () => onEdit(1), style: {
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: THEME.signalOrange,
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                }, children: "Edit Step" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-8", children: [_jsxs("div", { children: [_jsx(Row, { label: fl("NAME_CONTRACT_TYPE"), value: formData.NAME_CONTRACT_TYPE, changed: changed("NAME_CONTRACT_TYPE") }), _jsx(Row, { label: fl("AMT_INCOME_TOTAL"), value: formData.AMT_INCOME_TOTAL ? Number(formData.AMT_INCOME_TOTAL).toLocaleString() : "", changed: changed("AMT_INCOME_TOTAL") }), _jsx(Row, { label: fl("AMT_CREDIT"), value: formData.AMT_CREDIT ? Number(formData.AMT_CREDIT).toLocaleString() : "", changed: changed("AMT_CREDIT") })] }), _jsxs("div", { children: [_jsx(Row, { label: fl("AMT_ANNUITY"), value: formData.AMT_ANNUITY ? Number(formData.AMT_ANNUITY).toLocaleString() : "", changed: changed("AMT_ANNUITY") }), _jsx(Row, { label: fl("AMT_GOODS_PRICE"), value: formData.AMT_GOODS_PRICE ? Number(formData.AMT_GOODS_PRICE).toLocaleString() : "", changed: changed("AMT_GOODS_PRICE") })] })] })] }), _jsxs("div", { style: {
                    backgroundColor: THEME.lifted,
                    borderRadius: "24px",
                    padding: "28px",
                    border: `1px solid ${THEME.borderLight}`,
                }, children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h4", { style: { fontSize: "17px", fontWeight: 600, color: THEME.ink, margin: 0 }, children: "2. Applicant & Employment Information" }), _jsx("button", { onClick: () => onEdit(2), style: {
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: THEME.signalOrange,
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                }, children: "Edit Step" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-8", children: [_jsxs("div", { children: [_jsx(Row, { label: fl("CODE_GENDER"), value: GENDER_OPTIONS.find(o => o.value === formData.CODE_GENDER)?.label ?? formData.CODE_GENDER, changed: changed("CODE_GENDER") }), _jsx(Row, { label: fl("FLAG_OWN_CAR"), value: OWN_CAR_OPTIONS.find(o => o.value === formData.FLAG_OWN_CAR)?.label ?? formData.FLAG_OWN_CAR, changed: changed("FLAG_OWN_CAR") }), _jsx(Row, { label: fl("NAME_INCOME_TYPE"), value: formData.NAME_INCOME_TYPE, changed: changed("NAME_INCOME_TYPE") }), _jsx(Row, { label: fl("NAME_EDUCATION_TYPE"), value: formData.NAME_EDUCATION_TYPE, changed: changed("NAME_EDUCATION_TYPE") }), _jsx(Row, { label: fl("NAME_FAMILY_STATUS"), value: formData.NAME_FAMILY_STATUS, changed: changed("NAME_FAMILY_STATUS") })] }), _jsxs("div", { children: [_jsx(Row, { label: fl("NAME_HOUSING_TYPE"), value: formData.NAME_HOUSING_TYPE, changed: changed("NAME_HOUSING_TYPE") }), _jsx(Row, { label: fl("DAYS_BIRTH"), value: daysToAge(formData.DAYS_BIRTH), changed: changed("DAYS_BIRTH") }), _jsx(Row, { label: fl("DAYS_EMPLOYED"), value: daysToEmployment(formData.DAYS_EMPLOYED), changed: changed("DAYS_EMPLOYED") }), _jsx(Row, { label: fl("OCCUPATION_TYPE"), value: formData.OCCUPATION_TYPE, changed: changed("OCCUPATION_TYPE") }), _jsx(Row, { label: fl("ORGANIZATION_TYPE"), value: formData.ORGANIZATION_TYPE, changed: changed("ORGANIZATION_TYPE") })] })] })] }), _jsxs("div", { style: {
                    backgroundColor: THEME.lifted,
                    borderRadius: "24px",
                    padding: "28px",
                    border: `1px solid ${THEME.borderLight}`,
                }, children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h4", { style: { fontSize: "17px", fontWeight: 600, color: THEME.ink, margin: 0 }, children: "3. Credit & Risk Information" }), _jsx("button", { onClick: () => onEdit(3), style: {
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: THEME.signalOrange,
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                }, children: "Edit Step" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-8", children: [_jsxs("div", { children: [_jsx(Row, { label: fl("EXT_SOURCE_1"), value: formData.EXT_SOURCE_1, changed: changed("EXT_SOURCE_1") }), _jsx(Row, { label: fl("EXT_SOURCE_2"), value: formData.EXT_SOURCE_2, changed: changed("EXT_SOURCE_2") }), _jsx(Row, { label: fl("EXT_SOURCE_3"), value: formData.EXT_SOURCE_3, changed: changed("EXT_SOURCE_3") }), _jsx(Row, { label: fl("DEF_30_CNT_SOCIAL_CIRCLE"), value: formData.DEF_30_CNT_SOCIAL_CIRCLE, changed: changed("DEF_30_CNT_SOCIAL_CIRCLE") }), _jsx(Row, { label: fl("DEF_60_CNT_SOCIAL_CIRCLE"), value: formData.DEF_60_CNT_SOCIAL_CIRCLE, changed: changed("DEF_60_CNT_SOCIAL_CIRCLE") })] }), _jsxs("div", { children: [_jsx(Row, { label: fl("AMT_REQ_CREDIT_BUREAU_QRT"), value: formData.AMT_REQ_CREDIT_BUREAU_QRT, changed: changed("AMT_REQ_CREDIT_BUREAU_QRT") }), _jsx(Row, { label: fl("REGION_RATING_CLIENT"), value: formData.REGION_RATING_CLIENT, changed: changed("REGION_RATING_CLIENT") }), _jsx(Row, { label: fl("REGION_RATING_CLIENT_W_CITY"), value: formData.REGION_RATING_CLIENT_W_CITY, changed: changed("REGION_RATING_CLIENT_W_CITY") }), _jsx(Row, { label: fl("REGION_POPULATION_RELATIVE"), value: formData.REGION_POPULATION_RELATIVE, changed: changed("REGION_POPULATION_RELATIVE") })] })] })] })] }));
}
// ─── Live Sidebar ─────────────────────────────────────────────────────────────
function AssessmentSidebar() {
    const { currentStep, completion, formData } = useAssessment();
    const ext2 = parseFloat(formData.EXT_SOURCE_2) || null;
    const income = parseFloat(formData.AMT_INCOME_TOTAL) || 0;
    const credit = parseFloat(formData.AMT_CREDIT) || 0;
    const annuity = parseFloat(formData.AMT_ANNUITY) || 0;
    return (_jsxs("div", { className: "space-y-6 sticky top-28", children: [_jsxs("div", { style: {
                    backgroundColor: THEME.white,
                    borderRadius: "24px",
                    padding: "24px",
                    border: `1px solid ${THEME.borderLight}`,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
                }, children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("span", { style: {
                                    fontSize: "11.5px",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                    color: THEME.slateGray,
                                }, children: "ASSESSMENT PROGRESS" }), _jsxs("span", { style: {
                                    fontFamily: "'Sofia Sans', sans-serif",
                                    fontSize: "16px",
                                    fontWeight: 700,
                                    color: THEME.ink,
                                }, children: [completion, "%"] })] }), _jsx("div", { style: {
                            width: "100%",
                            height: "6px",
                            borderRadius: "999px",
                            backgroundColor: THEME.canvas,
                            overflow: "hidden",
                            marginBottom: "12px",
                        }, children: _jsx("div", { style: {
                                height: "100%",
                                width: `${completion}%`,
                                backgroundColor: THEME.ink,
                                transition: "width 0.4s ease",
                            } }) }), _jsxs("p", { style: { fontSize: "13px", color: THEME.slateGray, margin: 0 }, children: ["Step ", currentStep + 1, " of ", STEPS.length, ":", " ", _jsx("strong", { style: { color: THEME.ink }, children: STEPS[currentStep].label })] })] }), _jsxs("div", { style: {
                    backgroundColor: THEME.white,
                    borderRadius: "24px",
                    padding: "24px",
                    border: `1px solid ${THEME.borderLight}`,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
                }, children: [_jsxs("div", { style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            paddingBottom: "16px",
                            borderBottom: `1px solid ${THEME.borderLight}`,
                            marginBottom: "16px",
                        }, children: [_jsx("div", { style: {
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
                                }, children: formData.SK_ID_CURR ? formData.SK_ID_CURR.charAt(0) : "A" }), _jsxs("div", { children: [_jsx("h4", { style: { fontSize: "15px", fontWeight: 600, color: THEME.ink, margin: 0 }, children: formData.SK_ID_CURR
                                            ? `Applicant #${formData.SK_ID_CURR}`
                                            : "No applicant loaded" }), _jsx("p", { style: { fontSize: "12px", color: THEME.slateGray, margin: "2px 0 0" }, children: formData.NAME_INCOME_TYPE || "—" })] })] }), _jsxs("div", { className: "space-y-2 text-xs", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { style: { color: THEME.slateGray }, children: fl("CODE_GENDER") }), _jsx("span", { style: { fontWeight: 600, color: THEME.ink }, children: GENDER_OPTIONS.find(o => o.value === formData.CODE_GENDER)?.label ?? "—" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { style: { color: THEME.slateGray }, children: fl("NAME_EDUCATION_TYPE") }), _jsx("span", { style: { fontWeight: 600, color: THEME.ink, textAlign: "right", maxWidth: "160px" }, children: formData.NAME_EDUCATION_TYPE || "—" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { style: { color: THEME.slateGray }, children: fl("OCCUPATION_TYPE") }), _jsx("span", { style: { fontWeight: 600, color: THEME.ink, textAlign: "right", maxWidth: "160px" }, children: formData.OCCUPATION_TYPE || "—" })] })] })] }), _jsxs("div", { style: {
                    backgroundColor: THEME.white,
                    borderRadius: "24px",
                    padding: "24px",
                    border: `1px solid ${THEME.borderLight}`,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
                }, children: [_jsx("h4", { style: {
                            fontSize: "12px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            color: THEME.slateGray,
                            marginBottom: "16px",
                        }, children: "LIVE FINANCIAL SNAPSHOT" }), _jsxs("div", { className: "space-y-3 text-xs", children: [_jsxs("div", { className: "flex justify-between items-baseline", children: [_jsx("span", { style: { color: THEME.slateGray }, children: "Annual Income" }), _jsx("span", { style: { fontWeight: 700, color: THEME.ink }, children: income ? income.toLocaleString() : "—" })] }), _jsxs("div", { className: "flex justify-between items-baseline", children: [_jsx("span", { style: { color: THEME.slateGray }, children: "Loan Amount" }), _jsx("span", { style: { fontWeight: 700, color: THEME.ink }, children: credit ? credit.toLocaleString() : "—" })] }), _jsxs("div", { className: "flex justify-between items-baseline", children: [_jsx("span", { style: { color: THEME.slateGray }, children: "Annuity / Income" }), _jsx("span", { style: { fontWeight: 700, color: income && annuity ? THEME.ink : THEME.slateGray }, children: income && annuity ? `${((annuity / income) * 100).toFixed(1)}%` : "—" })] }), _jsxs("div", { className: "flex justify-between items-baseline", children: [_jsx("span", { style: { color: THEME.slateGray }, children: fl("EXT_SOURCE_2") }), _jsx("span", { style: { fontWeight: 700, color: THEME.signalOrange }, children: ext2 !== null ? ext2.toFixed(4) : "—" })] })] })] })] }));
}
// ─── Action Bar (design unchanged) ───────────────────────────────────────────
function ActionBar({ currentStep, onBack, onSaveDraft, onNext, onGenerate, }) {
    return (_jsx("div", { style: {
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: THEME.white,
            borderTop: `1px solid ${THEME.borderLight}`,
            boxShadow: "0 -8px 24px rgba(0, 0, 0, 0.06)",
            zIndex: 40,
            padding: "16px 24px",
        }, children: _jsxs("div", { style: {
                maxWidth: "1240px",
                margin: "0 auto",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }, children: [_jsxs("button", { onClick: onBack, disabled: currentStep === 0, className: "btn-ghost", style: {
                        opacity: currentStep === 0 ? 0.35 : 1,
                        cursor: currentStep === 0 ? "not-allowed" : "pointer",
                    }, children: [_jsx(ArrowLeft, { size: 16 }), _jsx("span", { children: "Previous Step" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: onSaveDraft, className: "btn-secondary hidden sm:inline-flex", style: { padding: "8px 20px" }, children: _jsx("span", { children: "Save Draft" }) }), currentStep < 4 ? (_jsxs("button", { onClick: onNext, className: "btn-primary", style: { padding: "10px 26px" }, children: [_jsxs("span", { children: ["Continue to Step 0", currentStep + 2] }), _jsx(ArrowRight, { size: 16, strokeWidth: 2.2 })] })) : (_jsxs("button", { onClick: onGenerate, className: "btn-primary", style: { backgroundColor: THEME.ink, padding: "12px 32px", fontSize: "15px" }, children: [_jsx(Sparkles, { size: 17, color: THEME.lightSignalOrange }), _jsx("span", { children: "Generate Credit Score & AI Explanation" })] }))] })] }) }));
}
// ─── Loading overlay (design unchanged) ──────────────────────────────────────
function AnalysisOverlay({ stepText }) {
    return (_jsxs("div", { style: {
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
        }, children: [_jsx("div", { style: {
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
                }, children: _jsx(Cpu, { size: 26, color: THEME.lightSignalOrange }) }), _jsx("h3", { style: {
                    fontSize: "24px",
                    fontWeight: 500,
                    marginBottom: "8px",
                    textAlign: "center",
                    color: "#FFFFFF",
                }, children: "CrediNova AI Engine Processing" }), _jsx("p", { style: {
                    fontSize: "15px",
                    color: THEME.dustTaupe,
                    marginBottom: "24px",
                    textAlign: "center",
                    maxWidth: "400px",
                }, children: stepText }), _jsx("div", { style: {
                    width: "280px",
                    height: "4px",
                    borderRadius: "999px",
                    backgroundColor: "rgba(255,255,255,0.15)",
                    overflow: "hidden",
                }, children: _jsx("div", { style: {
                        height: "100%",
                        width: "100%",
                        backgroundColor: THEME.lightSignalOrange,
                        animation: "pulse 1.5s infinite",
                    } }) })] }));
}
// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AssessmentPage() {
    const navigate = useNavigate();
    const { currentStep, setCurrentStep, handleNext, handleBack, saveDraft, savedDraftToast, generateScore, submitAndScore, isAnalyzing, setIsAnalyzing, } = useAssessment();
    const [loadingStepText, setLoadingStepText] = useState("Calibrating external risk indicators...");
    const handleGenerateScore = async () => {
        setIsAnalyzing(true);
        setLoadingStepText("Persisting applicant dossier to Supabase assessments table...");
        setTimeout(() => setLoadingStepText("Evaluating applicant features with 10-fold LightGBM ensemble..."), 600);
        setTimeout(() => setLoadingStepText("Computing tree SHAP factor attributions..."), 1200);
        setTimeout(() => setLoadingStepText("Persisting audit log to Supabase predictions table..."), 1800);
        try {
            await submitAndScore();
        }
        catch (e) {
            console.error("Score generation error:", e);
        }
        finally {
            setTimeout(() => {
                setIsAnalyzing(false);
                navigate("/assessment/results");
            }, 2100);
        }
    };
    return (_jsxs("div", { style: { minHeight: "100vh", backgroundColor: THEME.canvas }, children: [_jsx(Navbar, {}), _jsxs("div", { style: { paddingTop: "76px" }, children: [_jsx(PageHeader, {}), _jsx(ProgressBar, { currentStep: currentStep, onSelectStep: (s) => setCurrentStep(s) }), _jsx("div", { style: { maxWidth: "1240px", margin: "0 auto", padding: "36px 24px 140px" }, children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start", children: [_jsxs("div", { children: [currentStep === 0 && _jsx(StepLookup, {}), currentStep === 1 && _jsx(StepFinancial, {}), currentStep === 2 && _jsx(StepApplicant, {}), currentStep === 3 && _jsx(StepCreditRisk, {}), currentStep === 4 && _jsx(StepReview, { onEdit: (s) => setCurrentStep(s) })] }), _jsx(AssessmentSidebar, {})] }) })] }), _jsx(ActionBar, { currentStep: currentStep, onBack: handleBack, onSaveDraft: saveDraft, onNext: handleNext, onGenerate: handleGenerateScore }), savedDraftToast && (_jsxs("div", { style: {
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
                }, className: "animate-fade-in", children: [_jsx(Check, { size: 16, color: THEME.lightSignalOrange, strokeWidth: 2.5 }), _jsx("span", { children: "Draft saved successfully to local storage" })] })), isAnalyzing && _jsx(AnalysisOverlay, { stepText: loadingStepText })] }));
}
