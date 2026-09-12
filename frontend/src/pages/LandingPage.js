import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Scale, ShieldCheck, Cpu, ChevronDown, Globe, Linkedin, Facebook, Twitter, Youtube, HelpCircle, CreditCard, MapPin, Mail, Layers, BarChart3, Sparkles, } from "lucide-react";
import { Navbar, Logo } from "../components/common/Navbar";
// ─── Design Tokens ───────────────────────────────────────────────────────────
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
    granite: "#555555",
    dustTaupe: "#D1CDC7",
    borderLight: "#E2DED9",
    borderSubtle: "rgba(20, 20, 19, 0.08)",
    linkBlue: "#3860BE",
};
// ─── Announcement Bar ────────────────────────────────────────────────────────
function AnnouncementBar() {
    return (_jsxs("div", { style: {
            background: THEME.ink,
            color: "#F3F0EE",
            fontSize: "13px",
            textAlign: "center",
            padding: "10px 16px",
            fontFamily: "'Sofia Sans', 'Inter', sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
        }, children: [_jsx("span", { style: {
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor: THEME.lightSignalOrange,
                    display: "inline-block",
                } }), _jsx("span", { style: { fontWeight: 450, opacity: 0.9 }, children: "AI-Powered Credit Intelligence Trusted by Financial Institutions Nationwide" }), _jsxs(Link, { to: "/judge", style: {
                    color: THEME.lightSignalOrange,
                    textDecoration: "none",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    marginLeft: "6px",
                }, children: ["Explore Model Performance & Analytics ", _jsx(ArrowUpRight, { size: 14 })] })] }));
}
// ─── Hero Section ────────────────────────────────────────────────────────────
function Hero() {
    return (_jsxs("section", { id: "home", style: {
            paddingTop: "110px",
            paddingBottom: "80px",
            background: THEME.canvas,
            position: "relative",
            overflow: "hidden",
        }, children: [_jsx("div", { className: "ghost-watermark hidden md:block", style: {
                    position: "absolute",
                    top: "80px",
                    right: "-40px",
                    zIndex: 0,
                }, children: "INTELLIGENCE" }), _jsx("div", { style: {
                    maxWidth: "1240px",
                    margin: "0 auto",
                    padding: "0 24px",
                    position: "relative",
                    zIndex: 1,
                }, children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center", children: [_jsxs("div", { className: "lg:col-span-6", style: { paddingRight: "10px" }, children: [_jsxs("div", { className: "eyebrow", style: { marginBottom: "18px" }, children: [_jsx("span", { className: "eyebrow-dot" }), _jsx("span", { children: "AI-POWERED CREDIT INTELLIGENCE" })] }), _jsx("h1", { style: {
                                        fontSize: "clamp(38px, 5.2vw, 64px)",
                                        fontWeight: 500,
                                        color: THEME.ink,
                                        letterSpacing: "-0.025em",
                                        lineHeight: 1.05,
                                        marginBottom: "24px",
                                    }, children: "Smarter credit decisions, built on better data." }), _jsx("p", { style: {
                                        fontSize: "17px",
                                        lineHeight: 1.5,
                                        color: THEME.charcoal,
                                        fontWeight: 450,
                                        maxWidth: "520px",
                                        marginBottom: "36px",
                                    }, children: "CrediNova AI combines traditional bureau history with alternative digital signals \u2014 utility punctuality, cash flow velocity, and digital transaction behavior \u2014 to deliver accurate, fair, and explainable credit assessments." }), _jsxs("div", { style: {
                                        display: "flex",
                                        gap: "14px",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                        marginBottom: "52px",
                                    }, children: [_jsxs(Link, { to: "/assessment", className: "btn-primary", style: { padding: "12px 28px" }, children: [_jsx("span", { children: "Start Assessment" }), _jsx(ArrowRight, { size: 17, strokeWidth: 2.2 })] }), _jsxs(Link, { to: "/judge", className: "btn-secondary", style: { padding: "12px 24px" }, children: [_jsx(Scale, { size: 16, strokeWidth: 2 }), _jsx("span", { children: "Judge Analytics Dashboard" })] })] }), _jsxs("div", { style: {
                                        display: "grid",
                                        gridTemplateColumns: "repeat(3, 1fr)",
                                        gap: "24px",
                                        paddingTop: "28px",
                                        borderTop: `1px solid ${THEME.borderLight}`,
                                    }, children: [_jsxs("div", { children: [_jsx("p", { style: {
                                                        fontFamily: "'Sofia Sans', sans-serif",
                                                        fontWeight: 700,
                                                        fontSize: "32px",
                                                        color: THEME.ink,
                                                        letterSpacing: "-0.02em",
                                                        lineHeight: 1,
                                                    }, children: "98.2%" }), _jsx("p", { style: { fontSize: "13px", color: THEME.slateGray, marginTop: "6px" }, children: "Scoring accuracy" })] }), _jsxs("div", { children: [_jsx("p", { style: {
                                                        fontFamily: "'Sofia Sans', sans-serif",
                                                        fontWeight: 700,
                                                        fontSize: "32px",
                                                        color: THEME.ink,
                                                        letterSpacing: "-0.02em",
                                                        lineHeight: 1,
                                                    }, children: "200+" }), _jsx("p", { style: { fontSize: "13px", color: THEME.slateGray, marginTop: "6px" }, children: "Institutions" })] }), _jsxs("div", { children: [_jsx("p", { style: {
                                                        fontFamily: "'Sofia Sans', sans-serif",
                                                        fontWeight: 700,
                                                        fontSize: "32px",
                                                        color: THEME.ink,
                                                        letterSpacing: "-0.02em",
                                                        lineHeight: 1,
                                                    }, children: "<3s" }), _jsx("p", { style: { fontSize: "13px", color: THEME.slateGray, marginTop: "6px" }, children: "Decision time" })] })] })] }), _jsx("div", { className: "lg:col-span-6", children: _jsxs("div", { className: "stadium-frame", style: {
                                    background: THEME.lifted,
                                    border: `1px solid ${THEME.borderSubtle}`,
                                    boxShadow: "0px 24px 48px rgba(0, 0, 0, 0.08)",
                                    padding: "36px",
                                    position: "relative",
                                }, children: [_jsx("svg", { style: {
                                            position: "absolute",
                                            inset: 0,
                                            width: "100%",
                                            height: "100%",
                                            pointerEvents: "none",
                                            zIndex: 0,
                                        }, children: _jsx("path", { d: "M 60 80 Q 280 20 420 220 T 260 400", fill: "none", stroke: THEME.lightSignalOrange, strokeWidth: "1.5", strokeDasharray: "4 4", opacity: "0.8" }) }), _jsxs("div", { style: {
                                            position: "relative",
                                            zIndex: 1,
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }, children: [_jsxs("div", { style: {
                                                    position: "relative",
                                                    width: "280px",
                                                    height: "280px",
                                                    marginBottom: "28px",
                                                }, children: [_jsx("img", { src: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&h=600&fit=crop&crop=faces&auto=format&q=85", alt: "Financial intelligence modeling", style: {
                                                            width: "100%",
                                                            height: "100%",
                                                            borderRadius: "50%",
                                                            objectFit: "cover",
                                                            boxShadow: "0px 16px 36px rgba(0, 0, 0, 0.12)",
                                                        } }), _jsx(Link, { to: "/assessment", className: "satellite-cta", style: {
                                                            position: "absolute",
                                                            bottom: "-8px",
                                                            right: "-8px",
                                                        }, title: "Launch assessment", children: _jsx(ArrowRight, { size: 22, color: THEME.ink, strokeWidth: 2.2 }) })] }), _jsxs("div", { style: {
                                                    backgroundColor: "#FFFFFF",
                                                    borderRadius: "24px",
                                                    padding: "20px 24px",
                                                    width: "100%",
                                                    maxWidth: "420px",
                                                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                                                    border: `1px solid ${THEME.borderLight}`,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                }, children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [_jsx("div", { style: {
                                                                    width: "10px",
                                                                    height: "10px",
                                                                    borderRadius: "50%",
                                                                    backgroundColor: "#16A34A",
                                                                } }), _jsxs("div", { children: [_jsx("p", { style: {
                                                                            fontSize: "12px",
                                                                            fontWeight: 700,
                                                                            color: THEME.slateGray,
                                                                            letterSpacing: "0.04em",
                                                                            textTransform: "uppercase",
                                                                        }, children: "Live Intelligence Engine" }), _jsx("p", { style: {
                                                                            fontFamily: "'Sofia Sans', sans-serif",
                                                                            fontSize: "20px",
                                                                            fontWeight: 700,
                                                                            color: THEME.ink,
                                                                            margin: "2px 0 0",
                                                                        }, children: "Rahul Sharma \u00B7 782 CIBIL" })] })] }), _jsx("span", { style: {
                                                            backgroundColor: "rgba(34, 197, 94, 0.12)",
                                                            color: "#16A34A",
                                                            fontSize: "12px",
                                                            fontWeight: 700,
                                                            padding: "4px 12px",
                                                            borderRadius: "999px",
                                                        }, children: "Tier 1 (Prime)" })] })] })] }) })] }) }), _jsx("div", { style: {
                    marginTop: "70px",
                    borderTop: `1px solid ${THEME.borderLight}`,
                    borderBottom: `1px solid ${THEME.borderLight}`,
                    backgroundColor: THEME.lifted,
                    padding: "24px 0",
                }, children: _jsxs("div", { style: {
                        maxWidth: "1240px",
                        margin: "0 auto",
                        padding: "0 24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "24px",
                    }, children: [_jsx("p", { style: {
                                fontSize: "13px",
                                fontWeight: 700,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                color: THEME.slateGray,
                            }, children: "Trusted by modern banking networks" }), _jsx("div", { style: {
                                display: "flex",
                                alignItems: "center",
                                gap: "36px",
                                flexWrap: "wrap",
                            }, children: [
                                "National Bank",
                                "Pacific Finance Corp",
                                "Metro Credit Union",
                                "Global Trust",
                                "First Banking Group",
                            ].map((name) => (_jsx("span", { style: {
                                    fontSize: "15px",
                                    fontWeight: 600,
                                    color: THEME.ink,
                                    opacity: 0.7,
                                    letterSpacing: "-0.01em",
                                }, children: name }, name))) })] }) })] }));
}
// ─── Constellation / Services Section ────────────────────────────────────────
function ConstellationServices() {
    const serviceCards = [
        {
            img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&h=500&fit=crop&crop=faces&auto=format&q=85",
            eyebrow: "SERVICES",
            title: "Credit Scoring & Modeling",
            desc: "Composite credit scores calibrated against 200+ multi-dimensional behavioral variables in real-time.",
            link: "/assessment",
        },
        {
            img: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=500&h=500&fit=crop&crop=faces&auto=format&q=85",
            eyebrow: "ALTERNATIVE DATA",
            title: "Thin-File Inclusion",
            desc: "Surface creditworthiness through utility punctuality, telecom flows, and merchant cash flow velocity.",
            link: "/assessment",
        },
        {
            img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=500&fit=crop&crop=faces&auto=format&q=85",
            eyebrow: "EXPLAINABILITY",
            title: "Model Transparency & SHAP",
            desc: "Per-decision feature attribution providing clear factor breakdown for regulatory auditability.",
            link: "/judge",
        },
    ];
    return (_jsxs("section", { id: "services", style: {
            padding: "110px 0",
            background: THEME.canvas,
            position: "relative",
        }, children: [_jsx("div", { className: "ghost-watermark hidden md:block", style: {
                    position: "absolute",
                    top: "60px",
                    left: "20px",
                    zIndex: 0,
                }, children: "CONSTELLATION" }), _jsxs("div", { style: {
                    maxWidth: "1240px",
                    margin: "0 auto",
                    padding: "0 24px",
                    position: "relative",
                    zIndex: 1,
                }, children: [_jsxs("div", { style: {
                            maxWidth: "680px",
                            marginBottom: "72px",
                        }, children: [_jsxs("div", { className: "eyebrow", style: { marginBottom: "14px" }, children: [_jsx("span", { className: "eyebrow-dot" }), _jsx("span", { children: "SOLUTIONS & CAPABILITIES" })] }), _jsx("h2", { style: {
                                    fontSize: "clamp(30px, 4vw, 42px)",
                                    fontWeight: 500,
                                    color: THEME.ink,
                                    lineHeight: 1.15,
                                }, children: "A constellation of intelligent lending services." }), _jsx("p", { style: {
                                    fontSize: "17px",
                                    color: THEME.charcoal,
                                    marginTop: "16px",
                                    fontWeight: 450,
                                }, children: "Each module functions autonomously or connects as a unified pipeline \u2014 giving financial institutions total precision from ingestion to decision." })] }), _jsxs("div", { style: { position: "relative" }, children: [_jsx("svg", { className: "hidden lg:block", style: {
                                    position: "absolute",
                                    top: "140px",
                                    left: "8%",
                                    width: "84%",
                                    height: "120px",
                                    pointerEvents: "none",
                                    zIndex: 0,
                                }, children: _jsx("path", { d: "M 50 40 Q 380 -20 720 70 T 1100 20", fill: "none", stroke: THEME.lightSignalOrange, strokeWidth: "1.5", strokeDasharray: "4 4" }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative z-10", children: serviceCards.map((card, idx) => (_jsxs("div", { style: {
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        textAlign: "center",
                                    }, children: [_jsxs("div", { style: {
                                                position: "relative",
                                                width: "260px",
                                                height: "260px",
                                                marginBottom: "28px",
                                            }, children: [_jsx("img", { src: card.img, alt: card.title, style: {
                                                        width: "100%",
                                                        height: "100%",
                                                        borderRadius: "50%",
                                                        objectFit: "cover",
                                                        boxShadow: "0px 16px 36px rgba(0, 0, 0, 0.1)",
                                                    } }), _jsx(Link, { to: card.link, className: "satellite-cta", style: {
                                                        position: "absolute",
                                                        bottom: "-6px",
                                                        right: "-6px",
                                                    }, title: `Explore ${card.title}`, children: _jsx(ArrowRight, { size: 20, color: THEME.ink, strokeWidth: 2.2 }) })] }), _jsxs("div", { className: "eyebrow", style: { marginBottom: "10px" }, children: [_jsx("span", { className: "eyebrow-dot" }), _jsx("span", { children: card.eyebrow })] }), _jsx("h3", { style: {
                                                fontSize: "22px",
                                                fontWeight: 500,
                                                color: THEME.ink,
                                                marginBottom: "10px",
                                                lineHeight: 1.25,
                                            }, children: card.title }), _jsx("p", { style: {
                                                fontSize: "15px",
                                                lineHeight: 1.5,
                                                color: THEME.slateGray,
                                                maxWidth: "320px",
                                            }, children: card.desc })] }, card.title))) })] })] })] }));
}
// ─── Pill Carousel / Featured Stories Section ────────────────────────────────
function PillCarouselSection() {
    const stories = [
        {
            category: "Case Study",
            headline: "How Pacific Finance expanded MSME loan approvals by 42%",
            body: "By incorporating utility punctuality and cash flow telemetry, Pacific unlocked lending to 18,000 previously unserved micro-enterprises.",
            badge: "Commercial Banking",
            cta: "Read Case Study",
            link: "/assessment",
        },
        {
            category: "Innovation",
            headline: "Zero-bias credit assessment across demographic cohorts",
            body: "Our multi-layer algorithmic fairness engine enforces strict demographic parity without sacrificing risk predictive accuracy.",
            badge: "Fair Lending AI",
            cta: "View Audit Metrics",
            link: "/judge",
        },
    ];
    return (_jsx("section", { style: {
            padding: "100px 0",
            background: THEME.lifted,
            borderTop: `1px solid ${THEME.borderLight}`,
            borderBottom: `1px solid ${THEME.borderLight}`,
        }, children: _jsxs("div", { style: { maxWidth: "1240px", margin: "0 auto", padding: "0 24px" }, children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "eyebrow", style: { marginBottom: "12px" }, children: [_jsx("span", { className: "eyebrow-dot" }), _jsx("span", { children: "IMPACT & EVIDENCE" })] }), _jsx("h2", { style: {
                                        fontSize: "clamp(28px, 3.5vw, 38px)",
                                        fontWeight: 500,
                                        color: THEME.ink,
                                    }, children: "Proven outcomes in production banking." })] }), _jsxs(Link, { to: "/judge", className: "btn-secondary", children: [_jsx("span", { children: "Explore Technical Dashboard" }), _jsx(ArrowUpRight, { size: 16 })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: stories.map((story) => (_jsxs("div", { className: "stadium-frame", style: {
                            background: THEME.canvas,
                            border: `1px solid ${THEME.borderLight}`,
                            padding: "44px 38px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            minHeight: "360px",
                            boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
                        }, children: [_jsxs("div", { children: [_jsxs("div", { style: {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            marginBottom: "20px",
                                        }, children: [_jsx("span", { className: "pill-chip", children: story.category }), _jsx("span", { style: {
                                                    fontSize: "13px",
                                                    color: THEME.slateGray,
                                                    fontWeight: 500,
                                                }, children: story.badge })] }), _jsx("h3", { style: {
                                            fontSize: "24px",
                                            fontWeight: 500,
                                            color: THEME.ink,
                                            lineHeight: 1.25,
                                            marginBottom: "14px",
                                        }, children: story.headline }), _jsx("p", { style: {
                                            fontSize: "15.5px",
                                            lineHeight: 1.55,
                                            color: THEME.charcoal,
                                        }, children: story.body })] }), _jsx("div", { style: { marginTop: "32px" }, children: _jsxs(Link, { to: story.link, className: "btn-primary", style: { padding: "10px 24px" }, children: [_jsx("span", { children: story.cta }), _jsx(ArrowRight, { size: 16, strokeWidth: 2.2 })] }) })] }, story.headline))) })] }) }));
}
// ─── How It Works (5-Stage Decision Pipeline) ────────────────────────────────
function HowItWorks() {
    const steps = [
        {
            num: "01",
            title: "Data Ingestion",
            desc: "Securely aggregate bureau records, digital payment telemetry, and utility punctuality.",
            icon: Layers,
        },
        {
            num: "02",
            title: "Feature Engineering",
            desc: "Synthesize 200+ alternative variables including debt service velocity and cash-flow regularity.",
            icon: Cpu,
        },
        {
            num: "03",
            title: "Ensemble AI Scoring",
            desc: "Real-time probability calculation combining gradient boosted trees with calibrated neural heads.",
            icon: Sparkles,
        },
        {
            num: "04",
            title: "Explainable Attribution",
            desc: "Produce compliant factor contributions (SHAP values) satisfying RBI and Basel III standards.",
            icon: BarChart3,
        },
        {
            num: "05",
            title: "Underwriting Decision",
            desc: "Deliver instant loan term recommendations, risk categorization, and maximum credit limits.",
            icon: ShieldCheck,
        },
    ];
    return (_jsx("section", { id: "how-it-works", style: {
            padding: "110px 0",
            background: THEME.canvas,
        }, children: _jsx("div", { style: { maxWidth: "1240px", margin: "0 auto", padding: "0 24px" }, children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start", children: [_jsxs("div", { className: "lg:col-span-4", children: [_jsxs("div", { className: "eyebrow", style: { marginBottom: "14px" }, children: [_jsx("span", { className: "eyebrow-dot" }), _jsx("span", { children: "THE PIPELINE" })] }), _jsx("h2", { style: {
                                    fontSize: "clamp(30px, 3.8vw, 42px)",
                                    fontWeight: 500,
                                    color: THEME.ink,
                                    lineHeight: 1.15,
                                    marginBottom: "20px",
                                }, children: "From data to decision in three seconds." }), _jsx("p", { style: {
                                    fontSize: "16px",
                                    lineHeight: 1.55,
                                    color: THEME.charcoal,
                                    marginBottom: "32px",
                                }, children: "A deterministic five-stage intelligence pipeline ensuring absolute mathematical rigor, regulatory compliance, and real-time processing." }), _jsxs(Link, { to: "/assessment", className: "btn-primary", style: { padding: "12px 28px" }, children: [_jsx("span", { children: "Launch Live Flow" }), _jsx(ArrowRight, { size: 16, strokeWidth: 2.2 })] })] }), _jsx("div", { className: "lg:col-span-8 flex flex-col gap-4", children: steps.map((step) => {
                            const IconComponent = step.icon;
                            return (_jsxs("div", { style: {
                                    backgroundColor: THEME.lifted,
                                    borderRadius: "24px",
                                    padding: "24px 30px",
                                    border: `1px solid ${THEME.borderLight}`,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "24px",
                                    transition: "all 0.2s ease",
                                }, children: [_jsx("div", { style: {
                                            width: "48px",
                                            height: "48px",
                                            borderRadius: "50%",
                                            backgroundColor: THEME.white,
                                            border: `1.5px solid ${THEME.ink}`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontFamily: "'Sofia Sans', sans-serif",
                                            fontWeight: 700,
                                            fontSize: "16px",
                                            color: THEME.ink,
                                            flexShrink: 0,
                                        }, children: step.num }), _jsxs("div", { style: { flex: 1 }, children: [_jsxs("div", { style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    marginBottom: "4px",
                                                }, children: [_jsx(IconComponent, { size: 17, color: THEME.signalOrange }), _jsx("h3", { style: {
                                                            fontSize: "19px",
                                                            fontWeight: 500,
                                                            color: THEME.ink,
                                                            margin: 0,
                                                        }, children: step.title })] }), _jsx("p", { style: {
                                                    fontSize: "14.5px",
                                                    lineHeight: 1.5,
                                                    color: THEME.slateGray,
                                                    margin: 0,
                                                }, children: step.desc })] })] }, step.num));
                        }) })] }) }) }));
}
// ─── Interactive Score Simulator Preview ─────────────────────────────────────
function ScorePreviewCalculator() {
    const [income, setIncome] = useState(75000);
    const [billsPaid, setBillsPaid] = useState(95);
    const [existingDebt, setExistingDebt] = useState(15000);
    // Quick heuristic score calculation
    const dti = (existingDebt / income) * 100;
    const baseScore = 650 + (income > 50000 ? 50 : 20) + (billsPaid * 1.2) - (dti * 1.5);
    const score = Math.min(880, Math.max(450, Math.round(baseScore)));
    const getTier = (s) => {
        if (s >= 750)
            return { label: "Prime (Tier 1)", color: "#16A34A" };
        if (s >= 650)
            return { label: "Standard (Tier 2)", color: THEME.lightSignalOrange };
        return { label: "High Risk (Tier 3)", color: THEME.signalOrange };
    };
    const tier = getTier(score);
    return (_jsx("section", { style: {
            padding: "100px 0",
            background: THEME.lifted,
            borderTop: `1px solid ${THEME.borderLight}`,
            borderBottom: `1px solid ${THEME.borderLight}`,
        }, children: _jsx("div", { style: { maxWidth: "1240px", margin: "0 auto", padding: "0 24px" }, children: _jsx("div", { className: "stadium-frame", style: {
                    background: THEME.canvas,
                    border: `1px solid ${THEME.borderLight}`,
                    padding: "52px 44px",
                    boxShadow: "0px 24px 48px rgba(0, 0, 0, 0.05)",
                }, children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-12 items-center", children: [_jsxs("div", { className: "lg:col-span-7", children: [_jsxs("div", { className: "eyebrow", style: { marginBottom: "14px" }, children: [_jsx("span", { className: "eyebrow-dot" }), _jsx("span", { children: "INTERACTIVE SIMULATOR" })] }), _jsx("h2", { style: {
                                        fontSize: "clamp(28px, 3.5vw, 38px)",
                                        fontWeight: 500,
                                        color: THEME.ink,
                                        marginBottom: "14px",
                                    }, children: "Experience the multi-signal scoring model." }), _jsx("p", { style: {
                                        fontSize: "16px",
                                        color: THEME.charcoal,
                                        marginBottom: "36px",
                                    }, children: "Adjust the applicant's variables below to see real-time impact on credit score, risk tier, and loan approval likelihood." }), _jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "28px" }, children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("label", { style: { fontSize: "14px", fontWeight: 600, color: THEME.ink }, children: "Monthly Verified Income" }), _jsxs("span", { style: {
                                                                fontFamily: "'Sofia Sans', sans-serif",
                                                                fontSize: "17px",
                                                                fontWeight: 700,
                                                                color: THEME.ink,
                                                            }, children: ["INR ", income.toLocaleString("en-IN")] })] }), _jsx("input", { type: "range", min: 15000, max: 250000, step: 5000, value: income, onChange: (e) => setIncome(Number(e.target.value)), style: { width: "100%" } })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("label", { style: { fontSize: "14px", fontWeight: 600, color: THEME.ink }, children: "Utility & Digital Bill Punctuality" }), _jsxs("span", { style: {
                                                                fontFamily: "'Sofia Sans', sans-serif",
                                                                fontSize: "17px",
                                                                fontWeight: 700,
                                                                color: THEME.ink,
                                                            }, children: [billsPaid, "% on-time"] })] }), _jsx("input", { type: "range", min: 40, max: 100, step: 1, value: billsPaid, onChange: (e) => setBillsPaid(Number(e.target.value)), style: { width: "100%" } })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("label", { style: { fontSize: "14px", fontWeight: 600, color: THEME.ink }, children: "Monthly Debt Obligations (EMIs)" }), _jsxs("span", { style: {
                                                                fontFamily: "'Sofia Sans', sans-serif",
                                                                fontSize: "17px",
                                                                fontWeight: 700,
                                                                color: THEME.ink,
                                                            }, children: ["INR ", existingDebt.toLocaleString("en-IN")] })] }), _jsx("input", { type: "range", min: 0, max: 100000, step: 2000, value: existingDebt, onChange: (e) => setExistingDebt(Number(e.target.value)), style: { width: "100%" } })] })] })] }), _jsx("div", { className: "lg:col-span-5 flex justify-center", children: _jsxs("div", { style: {
                                    backgroundColor: THEME.white,
                                    borderRadius: "36px",
                                    padding: "40px",
                                    width: "100%",
                                    maxWidth: "360px",
                                    boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.08)",
                                    border: `1px solid ${THEME.borderLight}`,
                                    textAlign: "center",
                                }, children: [_jsx("p", { style: {
                                            fontSize: "12px",
                                            fontWeight: 700,
                                            letterSpacing: "0.06em",
                                            textTransform: "uppercase",
                                            color: THEME.slateGray,
                                            marginBottom: "12px",
                                        }, children: "Estimated Credit Score" }), _jsx("div", { style: {
                                            fontFamily: "'Sofia Sans', sans-serif",
                                            fontSize: "68px",
                                            fontWeight: 700,
                                            color: THEME.ink,
                                            letterSpacing: "-0.03em",
                                            lineHeight: 1,
                                            marginBottom: "8px",
                                        }, children: score }), _jsx("div", { style: {
                                            display: "inline-block",
                                            padding: "6px 18px",
                                            borderRadius: "999px",
                                            backgroundColor: `${tier.color}18`,
                                            color: tier.color,
                                            fontSize: "13px",
                                            fontWeight: 700,
                                            marginBottom: "24px",
                                        }, children: tier.label }), _jsxs("div", { style: {
                                            padding: "16px 0",
                                            borderTop: `1px solid ${THEME.borderLight}`,
                                            borderBottom: `1px solid ${THEME.borderLight}`,
                                            marginBottom: "24px",
                                            display: "flex",
                                            justifyContent: "space-around",
                                        }, children: [_jsxs("div", { children: [_jsx("p", { style: { fontSize: "11px", color: THEME.slateGray, fontWeight: 600 }, children: "DTI RATIO" }), _jsxs("p", { style: { fontSize: "16px", fontWeight: 700, color: THEME.ink, marginTop: "2px" }, children: [dti.toFixed(1), "%"] })] }), _jsxs("div", { children: [_jsx("p", { style: { fontSize: "11px", color: THEME.slateGray, fontWeight: 600 }, children: "APPROVAL" }), _jsx("p", { style: { fontSize: "16px", fontWeight: 700, color: THEME.ink, marginTop: "2px" }, children: score > 700 ? "94%" : score > 600 ? "76%" : "38%" })] })] }), _jsxs(Link, { to: "/assessment", className: "btn-primary", style: { width: "100%", padding: "10px 20px" }, children: [_jsx("span", { children: "Full Assessment Flow" }), _jsx(ArrowRight, { size: 15 })] })] }) })] }) }) }) }));
}
// ─── CTA Stadium Banner ──────────────────────────────────────────────────────
function CTAStadium() {
    return (_jsx("section", { style: { padding: "110px 0", background: THEME.canvas }, children: _jsx("div", { style: { maxWidth: "1240px", margin: "0 auto", padding: "0 24px" }, children: _jsxs("div", { className: "stadium-frame", style: {
                    backgroundColor: THEME.ink,
                    color: THEME.canvas,
                    padding: "72px 56px",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0px 30px 60px rgba(0, 0, 0, 0.25)",
                }, children: [_jsx("svg", { style: {
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: "50%",
                            height: "100%",
                            pointerEvents: "none",
                            opacity: 0.3,
                        }, children: _jsx("circle", { cx: "400", cy: "200", r: "280", fill: "none", stroke: THEME.lightSignalOrange, strokeWidth: "2" }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10", children: [_jsxs("div", { className: "lg:col-span-8", children: [_jsxs("div", { style: {
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            fontSize: "13px",
                                            fontWeight: 700,
                                            letterSpacing: "0.06em",
                                            textTransform: "uppercase",
                                            color: THEME.lightSignalOrange,
                                            marginBottom: "16px",
                                        }, children: [_jsx("span", { style: {
                                                    width: "6px",
                                                    height: "6px",
                                                    borderRadius: "50%",
                                                    backgroundColor: THEME.lightSignalOrange,
                                                } }), "TRANSFORM CREDIT UNDERWRITING"] }), _jsx("h2", { style: {
                                            fontSize: "clamp(32px, 4vw, 48px)",
                                            fontWeight: 500,
                                            color: "#FFFFFF",
                                            lineHeight: 1.1,
                                            marginBottom: "20px",
                                        }, children: "Ready to deploy next-generation credit intelligence?" }), _jsx("p", { style: {
                                            fontSize: "17px",
                                            lineHeight: 1.55,
                                            color: "rgba(243, 240, 238, 0.8)",
                                            maxWidth: "600px",
                                        }, children: "Join forward-thinking banks and non-bank lenders using CrediNova AI to approve more qualified borrowers while systematically mitigating portfolio default risk." })] }), _jsxs("div", { className: "lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center", children: [_jsxs(Link, { to: "/assessment", className: "btn-secondary", style: {
                                            padding: "14px 32px",
                                            justifyContent: "center",
                                            fontSize: "16px",
                                        }, children: [_jsx("span", { children: "Start Assessment" }), _jsx(ArrowRight, { size: 18, strokeWidth: 2.2 })] }), _jsxs(Link, { to: "/judge", className: "btn-ghost", style: {
                                            color: "#FFFFFF",
                                            borderColor: "rgba(255, 255, 255, 0.25)",
                                            padding: "14px 28px",
                                            justifyContent: "center",
                                            fontSize: "16px",
                                        }, children: [_jsx(Scale, { size: 18 }), _jsx("span", { children: "Open Judge Dashboard" })] })] })] })] }) }) }));
}
// ─── Footer (Mastercard Dark Warm-Black Specification) ────────────────────────
function Footer() {
    const [countryOpen, setCountryOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState("United States · EN");
    const countries = [
        "United States · EN",
        "India · EN / HI",
        "United Kingdom · EN",
        "Singapore · EN",
        "European Union · EN",
    ];
    return (_jsx("footer", { id: "contact", style: {
            backgroundColor: THEME.ink,
            color: "#FFFFFF",
            padding: "100px 0 148px",
        }, children: _jsxs("div", { style: { maxWidth: "1240px", margin: "0 auto", padding: "0 24px" }, children: [_jsx("div", { style: { marginBottom: "64px" }, children: _jsx("h2", { style: {
                            fontFamily: "'Sofia Sans', sans-serif",
                            fontSize: "clamp(32px, 4.5vw, 52px)",
                            fontWeight: 500,
                            color: "#FFFFFF",
                            letterSpacing: "-0.02em",
                            maxWidth: "680px",
                            lineHeight: 1.1,
                        }, children: "We're always here when you need us." }) }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12", style: { marginBottom: "80px" }, children: [_jsxs("div", { children: [_jsx("p", { style: {
                                        fontSize: "13px",
                                        fontWeight: 700,
                                        letterSpacing: "0.06em",
                                        textTransform: "uppercase",
                                        color: THEME.dustTaupe,
                                        marginBottom: "20px",
                                    }, children: "SOLUTIONS" }), _jsx("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }, children: [
                                        { name: "Credit Scoring Engine", link: "/assessment" },
                                        { name: "Alternative Data Ingestion", link: "/assessment" },
                                        { name: "Explainable AI (SHAP)", link: "/judge" },
                                        { name: "Demographic Fair Lending", link: "/judge" },
                                        { name: "API Documentation", link: "/judge", ext: true },
                                    ].map((item) => (_jsx("li", { children: _jsxs(Link, { to: item.link, style: {
                                                color: "#FFFFFF",
                                                fontSize: "14.5px",
                                                fontWeight: 450,
                                                textDecoration: "none",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "4px",
                                                opacity: 0.9,
                                            }, children: [item.name, item.ext && _jsx(ArrowUpRight, { size: 13, opacity: 0.7 })] }) }, item.name))) })] }), _jsxs("div", { children: [_jsx("p", { style: {
                                        fontSize: "13px",
                                        fontWeight: 700,
                                        letterSpacing: "0.06em",
                                        textTransform: "uppercase",
                                        color: THEME.dustTaupe,
                                        marginBottom: "20px",
                                    }, children: "FOR INSTITUTIONS" }), _jsx("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }, children: [
                                        { name: "Commercial Banks", link: "/assessment" },
                                        { name: "Microfinance & NBFCs", link: "/assessment" },
                                        { name: "Fintech Underwriters", link: "/assessment" },
                                        { name: "Model Governance Audits", link: "/judge" },
                                        { name: "Enterprise Security SLA", link: "/judge" },
                                    ].map((item) => (_jsx("li", { children: _jsx(Link, { to: item.link, style: {
                                                color: "#FFFFFF",
                                                fontSize: "14.5px",
                                                fontWeight: 450,
                                                textDecoration: "none",
                                                opacity: 0.9,
                                            }, children: item.name }) }, item.name))) })] }), _jsxs("div", { children: [_jsx("p", { style: {
                                        fontSize: "13px",
                                        fontWeight: 700,
                                        letterSpacing: "0.06em",
                                        textTransform: "uppercase",
                                        color: THEME.dustTaupe,
                                        marginBottom: "20px",
                                    }, children: "NEED HELP?" }), _jsx("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }, children: [
                                        { name: "Customer Support Desk", icon: HelpCircle, link: "/assessment" },
                                        { name: "Report Lost Card / Security", icon: CreditCard, link: "/assessment" },
                                        { name: "Global Branch Locator", icon: MapPin, link: "/" },
                                        { name: "Compliance & RBI Inquiries", icon: Mail, link: "/judge" },
                                    ].map((item) => {
                                        const IconComp = item.icon;
                                        return (_jsx("li", { children: _jsxs(Link, { to: item.link, style: {
                                                    color: "#FFFFFF",
                                                    fontSize: "14.5px",
                                                    fontWeight: 450,
                                                    textDecoration: "none",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    opacity: 0.9,
                                                }, children: [_jsx(IconComp, { size: 15, color: THEME.lightSignalOrange }), item.name] }) }, item.name));
                                    }) })] }), _jsxs("div", { children: [_jsx("div", { style: { marginBottom: "20px" }, children: _jsx(Logo, { inverted: true }) }), _jsx("p", { style: {
                                        fontSize: "14px",
                                        lineHeight: 1.6,
                                        color: "rgba(255, 255, 255, 0.7)",
                                        marginBottom: "24px",
                                    }, children: "CrediNova AI is an enterprise financial intelligence platform pioneering fair, transparent, and high-accuracy credit assessment." }), _jsx("div", { style: { display: "flex", gap: "12px" }, children: [
                                        { icon: Linkedin, label: "LinkedIn" },
                                        { icon: Twitter, label: "X" },
                                        { icon: Facebook, label: "Facebook" },
                                        { icon: Youtube, label: "YouTube" },
                                    ].map((s) => {
                                        const SocialIcon = s.icon;
                                        return (_jsx("a", { href: "#contact", style: {
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#FFFFFF",
                                                transition: "background 0.2s ease",
                                            }, "aria-label": s.label, children: _jsx(SocialIcon, { size: 17 }) }, s.label));
                                    }) })] })] }), _jsx("div", { style: {
                        width: "100%",
                        height: "1px",
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                        marginBottom: "36px",
                    } }), _jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-6 text-sm", style: { color: "rgba(255, 255, 255, 0.6)" }, children: [_jsx("span", { children: "\u00A9 2026 CrediNova AI, Inc. All rights reserved." }), _jsx("a", { href: "#contact", style: { color: "inherit", textDecoration: "none" }, children: "Privacy Policy" }), _jsx("a", { href: "#contact", style: { color: "inherit", textDecoration: "none" }, children: "Terms of Use" }), _jsx("a", { href: "#contact", style: { color: "inherit", textDecoration: "none" }, children: "Regulatory Disclosures" })] }), _jsxs("div", { style: { position: "relative" }, children: [_jsxs("button", { onClick: () => setCountryOpen(!countryOpen), style: {
                                        backgroundColor: THEME.ink,
                                        color: "#FFFFFF",
                                        border: "1px solid rgba(255, 255, 255, 0.4)",
                                        borderRadius: "999px",
                                        padding: "8px 18px",
                                        fontSize: "13.5px",
                                        fontWeight: 500,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        cursor: "pointer",
                                    }, children: [_jsx(Globe, { size: 15, color: THEME.lightSignalOrange }), _jsx("span", { children: selectedCountry }), _jsx(ChevronDown, { size: 14 })] }), countryOpen && (_jsx("div", { style: {
                                        position: "absolute",
                                        bottom: "48px",
                                        right: 0,
                                        backgroundColor: THEME.charcoal,
                                        borderRadius: "16px",
                                        padding: "8px 0",
                                        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.4)",
                                        border: "1px solid rgba(255, 255, 255, 0.15)",
                                        minWidth: "200px",
                                        zIndex: 50,
                                    }, children: countries.map((c) => (_jsx("div", { onClick: () => {
                                            setSelectedCountry(c);
                                            setCountryOpen(false);
                                        }, style: {
                                            padding: "8px 16px",
                                            fontSize: "13px",
                                            color: "#FFFFFF",
                                            cursor: "pointer",
                                            backgroundColor: c === selectedCountry ? "rgba(255,255,255,0.1)" : "transparent",
                                        }, children: c }, c))) }))] })] })] }) }));
}
// ─── Main Landing Page ───────────────────────────────────────────────────────
export default function LandingPage() {
    return (_jsxs("div", { style: { minHeight: "100%", backgroundColor: THEME.canvas }, children: [_jsx(AnnouncementBar, {}), _jsx(Navbar, {}), _jsxs("main", { children: [_jsx(Hero, {}), _jsx(ConstellationServices, {}), _jsx(PillCarouselSection, {}), _jsx(HowItWorks, {}), _jsx(ScorePreviewCalculator, {}), _jsx(CTAStadium, {})] }), _jsx(Footer, {})] }));
}
