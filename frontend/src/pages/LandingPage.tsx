import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Search,
  Scale,
  ShieldCheck,
  Cpu,
  Zap,
  ChevronRight,
  ChevronDown,
  Globe,
  Linkedin,
  Facebook,
  Twitter,
  Youtube,
  HelpCircle,
  CreditCard,
  MapPin,
  Mail,
  Building,
  Users,
  Layers,
  TrendingUp,
  BarChart3,
  Sparkles,
  Phone,
} from "lucide-react";
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
  return (
    <div
      style={{
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
      }}
    >
      <span
        style={{
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          backgroundColor: THEME.lightSignalOrange,
          display: "inline-block",
        }}
      />
      <span style={{ fontWeight: 450, opacity: 0.9 }}>
        AI-Powered Credit Intelligence Trusted by Financial Institutions Nationwide
      </span>
      <Link
        to="/judge"
        style={{
          color: THEME.lightSignalOrange,
          textDecoration: "none",
          fontWeight: 600,
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          marginLeft: "6px",
        }}
      >
        Explore Model Performance & Analytics <ArrowUpRight size={14} />
      </Link>
    </div>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="home"
      style={{
        paddingTop: "110px",
        paddingBottom: "80px",
        background: THEME.canvas,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Ghost Watermark */}
      <div
        className="ghost-watermark hidden md:block"
        style={{
          position: "absolute",
          top: "80px",
          right: "-40px",
          zIndex: 0,
        }}
      >
        INTELLIGENCE
      </div>

      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-6" style={{ paddingRight: "10px" }}>
            <div className="eyebrow" style={{ marginBottom: "18px" }}>
              <span className="eyebrow-dot" />
              <span>AI-POWERED CREDIT INTELLIGENCE</span>
            </div>

            <h1
              style={{
                fontSize: "clamp(38px, 5.2vw, 64px)",
                fontWeight: 500,
                color: THEME.ink,
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
                marginBottom: "24px",
              }}
            >
              Smarter credit decisions, built on better data.
            </h1>

            <p
              style={{
                fontSize: "17px",
                lineHeight: 1.5,
                color: THEME.charcoal,
                fontWeight: 450,
                maxWidth: "520px",
                marginBottom: "36px",
              }}
            >
              CrediNove AI combines traditional bureau history with alternative digital signals —
              utility punctuality, cash flow velocity, and digital transaction behavior — to deliver
              accurate, fair, and explainable credit assessments.
            </p>

            <div
              style={{
                display: "flex",
                gap: "14px",
                flexWrap: "wrap",
                alignItems: "center",
                marginBottom: "52px",
              }}
            >
              <Link to="/assessment" className="btn-primary" style={{ padding: "12px 28px" }}>
                <span>Start Assessment</span>
                <ArrowRight size={17} strokeWidth={2.2} />
              </Link>
              <Link to="/judge" className="btn-secondary" style={{ padding: "12px 24px" }}>
                <Scale size={16} strokeWidth={2} />
                <span>Judge Analytics Dashboard</span>
              </Link>
            </div>

            {/* Credibility Metric Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "24px",
                paddingTop: "28px",
                borderTop: `1px solid ${THEME.borderLight}`,
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "'Sofia Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "32px",
                    color: THEME.ink,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  98.2%
                </p>
                <p style={{ fontSize: "13px", color: THEME.slateGray, marginTop: "6px" }}>
                  Scoring accuracy
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "'Sofia Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "32px",
                    color: THEME.ink,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  200+
                </p>
                <p style={{ fontSize: "13px", color: THEME.slateGray, marginTop: "6px" }}>
                  Institutions
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "'Sofia Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "32px",
                    color: THEME.ink,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  &lt;3s
                </p>
                <p style={{ fontSize: "13px", color: THEME.slateGray, marginTop: "6px" }}>
                  Decision time
                </p>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Stadium Frame with Circular Portrait & Satellite CTA */}
          <div className="lg:col-span-6">
            <div
              className="stadium-frame"
              style={{
                background: THEME.lifted,
                border: `1px solid ${THEME.borderSubtle}`,
                boxShadow: "0px 24px 48px rgba(0, 0, 0, 0.08)",
                padding: "36px",
                position: "relative",
              }}
            >
              {/* Orbital SVG Decorative Arc */}
              <svg
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              >
                <path
                  d="M 60 80 Q 280 20 420 220 T 260 400"
                  fill="none"
                  stroke={THEME.lightSignalOrange}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.8"
                />
              </svg>

              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* Circular Portrait with Docked Satellite CTA */}
                <div
                  style={{
                    position: "relative",
                    width: "280px",
                    height: "280px",
                    marginBottom: "28px",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&h=600&fit=crop&crop=faces&auto=format&q=85"
                    alt="Financial intelligence modeling"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                      boxShadow: "0px 16px 36px rgba(0, 0, 0, 0.12)",
                    }}
                  />
                  {/* Attached White Satellite Micro-CTA */}
                  <Link
                    to="/assessment"
                    className="satellite-cta"
                    style={{
                      position: "absolute",
                      bottom: "-8px",
                      right: "-8px",
                    }}
                    title="Launch assessment"
                  >
                    <ArrowRight size={22} color={THEME.ink} strokeWidth={2.2} />
                  </Link>
                </div>

                {/* Overlaid Card Info */}
                <div
                  style={{
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
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "#16A34A",
                      }}
                    />
                    <div>
                      <p
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: THEME.slateGray,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                        }}
                      >
                        Live Intelligence Engine
                      </p>
                      <p
                        style={{
                          fontFamily: "'Sofia Sans', sans-serif",
                          fontSize: "20px",
                          fontWeight: 700,
                          color: THEME.ink,
                          margin: "2px 0 0",
                        }}
                      >
                        Rahul Sharma · 782 CIBIL
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      backgroundColor: "rgba(34, 197, 94, 0.12)",
                      color: "#16A34A",
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: "999px",
                    }}
                  >
                    Tier 1 (Prime)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Trust Bar */}
      <div
        style={{
          marginTop: "70px",
          borderTop: `1px solid ${THEME.borderLight}`,
          borderBottom: `1px solid ${THEME.borderLight}`,
          backgroundColor: THEME.lifted,
          padding: "24px 0",
        }}
      >
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: THEME.slateGray,
            }}
          >
            Trusted by modern banking networks
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "36px",
              flexWrap: "wrap",
            }}
          >
            {[
              "National Bank",
              "Pacific Finance Corp",
              "Metro Credit Union",
              "Global Trust",
              "First Banking Group",
            ].map((name) => (
              <span
                key={name}
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: THEME.ink,
                  opacity: 0.7,
                  letterSpacing: "-0.01em",
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
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

  return (
    <section
      id="services"
      style={{
        padding: "110px 0",
        background: THEME.canvas,
        position: "relative",
      }}
    >
      {/* Background Ghost Watermark */}
      <div
        className="ghost-watermark hidden md:block"
        style={{
          position: "absolute",
          top: "60px",
          left: "20px",
          zIndex: 0,
        }}
      >
        CONSTELLATION
      </div>

      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Section Header */}
        <div
          style={{
            maxWidth: "680px",
            marginBottom: "72px",
          }}
        >
          <div className="eyebrow" style={{ marginBottom: "14px" }}>
            <span className="eyebrow-dot" />
            <span>SOLUTIONS & CAPABILITIES</span>
          </div>
          <h2
            style={{
              fontSize: "clamp(30px, 4vw, 42px)",
              fontWeight: 500,
              color: THEME.ink,
              lineHeight: 1.15,
            }}
          >
            A constellation of intelligent lending services.
          </h2>
          <p
            style={{
              fontSize: "17px",
              color: THEME.charcoal,
              marginTop: "16px",
              fontWeight: 450,
            }}
          >
            Each module functions autonomously or connects as a unified pipeline — giving financial
            institutions total precision from ingestion to decision.
          </p>
        </div>

        {/* Circular Cards Grid with Orbital Connection Line */}
        <div style={{ position: "relative" }}>
          {/* Orbital SVG Line across cards */}
          <svg
            className="hidden lg:block"
            style={{
              position: "absolute",
              top: "140px",
              left: "8%",
              width: "84%",
              height: "120px",
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            <path
              d="M 50 40 Q 380 -20 720 70 T 1100 20"
              fill="none"
              stroke={THEME.lightSignalOrange}
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          </svg>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative z-10">
            {serviceCards.map((card, idx) => (
              <div
                key={card.title}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {/* Circular Portrait with Docked Satellite CTA */}
                <div
                  style={{
                    position: "relative",
                    width: "260px",
                    height: "260px",
                    marginBottom: "28px",
                  }}
                >
                  <img
                    src={card.img}
                    alt={card.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                      boxShadow: "0px 16px 36px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Link
                    to={card.link}
                    className="satellite-cta"
                    style={{
                      position: "absolute",
                      bottom: "-6px",
                      right: "-6px",
                    }}
                    title={`Explore ${card.title}`}
                  >
                    <ArrowRight size={20} color={THEME.ink} strokeWidth={2.2} />
                  </Link>
                </div>

                {/* Eyebrow Label with Signal Orange Dot */}
                <div className="eyebrow" style={{ marginBottom: "10px" }}>
                  <span className="eyebrow-dot" />
                  <span>{card.eyebrow}</span>
                </div>

                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: 500,
                    color: THEME.ink,
                    marginBottom: "10px",
                    lineHeight: 1.25,
                  }}
                >
                  {card.title}
                </h3>

                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.5,
                    color: THEME.slateGray,
                    maxWidth: "320px",
                  }}
                >
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
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

  return (
    <section
      style={{
        padding: "100px 0",
        background: THEME.lifted,
        borderTop: `1px solid ${THEME.borderLight}`,
        borderBottom: `1px solid ${THEME.borderLight}`,
      }}
    >
      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 24px" }}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="eyebrow" style={{ marginBottom: "12px" }}>
              <span className="eyebrow-dot" />
              <span>IMPACT & EVIDENCE</span>
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 3.5vw, 38px)",
                fontWeight: 500,
                color: THEME.ink,
              }}
            >
              Proven outcomes in production banking.
            </h2>
          </div>
          <Link to="/judge" className="btn-secondary">
            <span>Explore Technical Dashboard</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map((story) => (
            <div
              key={story.headline}
              className="stadium-frame"
              style={{
                background: THEME.canvas,
                border: `1px solid ${THEME.borderLight}`,
                padding: "44px 38px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "360px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "20px",
                  }}
                >
                  <span className="pill-chip">{story.category}</span>
                  <span
                    style={{
                      fontSize: "13px",
                      color: THEME.slateGray,
                      fontWeight: 500,
                    }}
                  >
                    {story.badge}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: 500,
                    color: THEME.ink,
                    lineHeight: 1.25,
                    marginBottom: "14px",
                  }}
                >
                  {story.headline}
                </h3>
                <p
                  style={{
                    fontSize: "15.5px",
                    lineHeight: 1.55,
                    color: THEME.charcoal,
                  }}
                >
                  {story.body}
                </p>
              </div>

              <div style={{ marginTop: "32px" }}>
                <Link
                  to={story.link}
                  className="btn-primary"
                  style={{ padding: "10px 24px" }}
                >
                  <span>{story.cta}</span>
                  <ArrowRight size={16} strokeWidth={2.2} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
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

  return (
    <section
      id="how-it-works"
      style={{
        padding: "110px 0",
        background: THEME.canvas,
      }}
    >
      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 24px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column */}
          <div className="lg:col-span-4">
            <div className="eyebrow" style={{ marginBottom: "14px" }}>
              <span className="eyebrow-dot" />
              <span>THE PIPELINE</span>
            </div>
            <h2
              style={{
                fontSize: "clamp(30px, 3.8vw, 42px)",
                fontWeight: 500,
                color: THEME.ink,
                lineHeight: 1.15,
                marginBottom: "20px",
              }}
            >
              From data to decision in three seconds.
            </h2>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.55,
                color: THEME.charcoal,
                marginBottom: "32px",
              }}
            >
              A deterministic five-stage intelligence pipeline ensuring absolute mathematical rigor,
              regulatory compliance, and real-time processing.
            </p>

            <Link to="/assessment" className="btn-primary" style={{ padding: "12px 28px" }}>
              <span>Launch Live Flow</span>
              <ArrowRight size={16} strokeWidth={2.2} />
            </Link>
          </div>

          {/* Right Column: Step Cards */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.num}
                  style={{
                    backgroundColor: THEME.lifted,
                    borderRadius: "24px",
                    padding: "24px 30px",
                    border: `1px solid ${THEME.borderLight}`,
                    display: "flex",
                    alignItems: "center",
                    gap: "24px",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
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
                    }}
                  >
                    {step.num}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <IconComponent size={17} color={THEME.signalOrange} />
                      <h3
                        style={{
                          fontSize: "19px",
                          fontWeight: 500,
                          color: THEME.ink,
                          margin: 0,
                        }}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <p
                      style={{
                        fontSize: "14.5px",
                        lineHeight: 1.5,
                        color: THEME.slateGray,
                        margin: 0,
                      }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
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

  const getTier = (s: number) => {
    if (s >= 750) return { label: "Prime (Tier 1)", color: "#16A34A" };
    if (s >= 650) return { label: "Standard (Tier 2)", color: THEME.lightSignalOrange };
    return { label: "High Risk (Tier 3)", color: THEME.signalOrange };
  };

  const tier = getTier(score);

  return (
    <section
      style={{
        padding: "100px 0",
        background: THEME.lifted,
        borderTop: `1px solid ${THEME.borderLight}`,
        borderBottom: `1px solid ${THEME.borderLight}`,
      }}
    >
      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 24px" }}>
        <div
          className="stadium-frame"
          style={{
            background: THEME.canvas,
            border: `1px solid ${THEME.borderLight}`,
            padding: "52px 44px",
            boxShadow: "0px 24px 48px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Form Sliders */}
            <div className="lg:col-span-7">
              <div className="eyebrow" style={{ marginBottom: "14px" }}>
                <span className="eyebrow-dot" />
                <span>INTERACTIVE SIMULATOR</span>
              </div>
              <h2
                style={{
                  fontSize: "clamp(28px, 3.5vw, 38px)",
                  fontWeight: 500,
                  color: THEME.ink,
                  marginBottom: "14px",
                }}
              >
                Experience the multi-signal scoring model.
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: THEME.charcoal,
                  marginBottom: "36px",
                }}
              >
                Adjust the applicant's variables below to see real-time impact on credit score, risk
                tier, and loan approval likelihood.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                {/* Slider 1: Monthly Income */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label style={{ fontSize: "14px", fontWeight: 600, color: THEME.ink }}>
                      Monthly Verified Income
                    </label>
                    <span
                      style={{
                        fontFamily: "'Sofia Sans', sans-serif",
                        fontSize: "17px",
                        fontWeight: 700,
                        color: THEME.ink,
                      }}
                    >
                      INR {income.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={15000}
                    max={250000}
                    step={5000}
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </div>

                {/* Slider 2: Utility & Bill Payment Punctuality */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label style={{ fontSize: "14px", fontWeight: 600, color: THEME.ink }}>
                      Utility & Digital Bill Punctuality
                    </label>
                    <span
                      style={{
                        fontFamily: "'Sofia Sans', sans-serif",
                        fontSize: "17px",
                        fontWeight: 700,
                        color: THEME.ink,
                      }}
                    >
                      {billsPaid}% on-time
                    </span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={100}
                    step={1}
                    value={billsPaid}
                    onChange={(e) => setBillsPaid(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </div>

                {/* Slider 3: Monthly Debt Obligations */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label style={{ fontSize: "14px", fontWeight: 600, color: THEME.ink }}>
                      Monthly Debt Obligations (EMIs)
                    </label>
                    <span
                      style={{
                        fontFamily: "'Sofia Sans', sans-serif",
                        fontSize: "17px",
                        fontWeight: 700,
                        color: THEME.ink,
                      }}
                    >
                      INR {existingDebt.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100000}
                    step={2000}
                    value={existingDebt}
                    onChange={(e) => setExistingDebt(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Score Outcome Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                style={{
                  backgroundColor: THEME.white,
                  borderRadius: "36px",
                  padding: "40px",
                  width: "100%",
                  maxWidth: "360px",
                  boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.08)",
                  border: `1px solid ${THEME.borderLight}`,
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: THEME.slateGray,
                    marginBottom: "12px",
                  }}
                >
                  Estimated Credit Score
                </p>

                {/* Score Number Display */}
                <div
                  style={{
                    fontFamily: "'Sofia Sans', sans-serif",
                    fontSize: "68px",
                    fontWeight: 700,
                    color: THEME.ink,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    marginBottom: "8px",
                  }}
                >
                  {score}
                </div>

                <div
                  style={{
                    display: "inline-block",
                    padding: "6px 18px",
                    borderRadius: "999px",
                    backgroundColor: `${tier.color}18`,
                    color: tier.color,
                    fontSize: "13px",
                    fontWeight: 700,
                    marginBottom: "24px",
                  }}
                >
                  {tier.label}
                </div>

                <div
                  style={{
                    padding: "16px 0",
                    borderTop: `1px solid ${THEME.borderLight}`,
                    borderBottom: `1px solid ${THEME.borderLight}`,
                    marginBottom: "24px",
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <div>
                    <p style={{ fontSize: "11px", color: THEME.slateGray, fontWeight: 600 }}>DTI RATIO</p>
                    <p style={{ fontSize: "16px", fontWeight: 700, color: THEME.ink, marginTop: "2px" }}>
                      {dti.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: "11px", color: THEME.slateGray, fontWeight: 600 }}>APPROVAL</p>
                    <p style={{ fontSize: "16px", fontWeight: 700, color: THEME.ink, marginTop: "2px" }}>
                      {score > 700 ? "94%" : score > 600 ? "76%" : "38%"}
                    </p>
                  </div>
                </div>

                <Link
                  to="/assessment"
                  className="btn-primary"
                  style={{ width: "100%", padding: "10px 20px" }}
                >
                  <span>Full Assessment Flow</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Stadium Banner ──────────────────────────────────────────────────────
function CTAStadium() {
  return (
    <section style={{ padding: "110px 0", background: THEME.canvas }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 24px" }}>
        <div
          className="stadium-frame"
          style={{
            backgroundColor: THEME.ink,
            color: THEME.canvas,
            padding: "72px 56px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0px 30px 60px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Orbital Decorative Curve inside Dark Stadium */}
          <svg
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "50%",
              height: "100%",
              pointerEvents: "none",
              opacity: 0.3,
            }}
          >
            <circle
              cx="400"
              cy="200"
              r="280"
              fill="none"
              stroke={THEME.lightSignalOrange}
              strokeWidth="2"
            />
          </svg>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-8">
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: THEME.lightSignalOrange,
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: THEME.lightSignalOrange,
                  }}
                />
                TRANSFORM CREDIT UNDERWRITING
              </div>
              <h2
                style={{
                  fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: 500,
                  color: "#FFFFFF",
                  lineHeight: 1.1,
                  marginBottom: "20px",
                }}
              >
                Ready to deploy next-generation credit intelligence?
              </h2>
              <p
                style={{
                  fontSize: "17px",
                  lineHeight: 1.55,
                  color: "rgba(243, 240, 238, 0.8)",
                  maxWidth: "600px",
                }}
              >
                Join forward-thinking banks and non-bank lenders using CrediNove AI to approve more
                qualified borrowers while systematically mitigating portfolio default risk.
              </p>
            </div>

            <div
              className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center"
            >
              <Link
                to="/assessment"
                className="btn-secondary"
                style={{
                  padding: "14px 32px",
                  justifyContent: "center",
                  fontSize: "16px",
                }}
              >
                <span>Start Assessment</span>
                <ArrowRight size={18} strokeWidth={2.2} />
              </Link>
              <Link
                to="/judge"
                className="btn-ghost"
                style={{
                  color: "#FFFFFF",
                  borderColor: "rgba(255, 255, 255, 0.25)",
                  padding: "14px 28px",
                  justifyContent: "center",
                  fontSize: "16px",
                }}
              >
                <Scale size={18} />
                <span>Open Judge Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
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

  return (
    <footer
      id="contact"
      style={{
        backgroundColor: THEME.ink,
        color: "#FFFFFF",
        padding: "100px 0 148px",
      }}
    >
      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 24px" }}>
        {/* Large Conversational Headline */}
        <div style={{ marginBottom: "64px" }}>
          <h2
            style={{
              fontFamily: "'Sofia Sans', sans-serif",
              fontSize: "clamp(32px, 4.5vw, 52px)",
              fontWeight: 500,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
              maxWidth: "680px",
              lineHeight: 1.1,
            }}
          >
            We're always here when you need us.
          </h2>
        </div>

        {/* 4-Column Link Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12"
          style={{ marginBottom: "80px" }}
        >
          {/* Column 1: Solutions */}
          <div>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: THEME.dustTaupe,
                marginBottom: "20px",
              }}
            >
              SOLUTIONS
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { name: "Credit Scoring Engine", link: "/assessment" },
                { name: "Alternative Data Ingestion", link: "/assessment" },
                { name: "Explainable AI (SHAP)", link: "/judge" },
                { name: "Demographic Fair Lending", link: "/judge" },
                { name: "API Documentation", link: "/judge", ext: true },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.link}
                    style={{
                      color: "#FFFFFF",
                      fontSize: "14.5px",
                      fontWeight: 450,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      opacity: 0.9,
                    }}
                  >
                    {item.name}
                    {item.ext && <ArrowUpRight size={13} opacity={0.7} />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Institutions */}
          <div>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: THEME.dustTaupe,
                marginBottom: "20px",
              }}
            >
              FOR INSTITUTIONS
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { name: "Commercial Banks", link: "/assessment" },
                { name: "Microfinance & NBFCs", link: "/assessment" },
                { name: "Fintech Underwriters", link: "/assessment" },
                { name: "Model Governance Audits", link: "/judge" },
                { name: "Enterprise Security SLA", link: "/judge" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.link}
                    style={{
                      color: "#FFFFFF",
                      fontSize: "14.5px",
                      fontWeight: 450,
                      textDecoration: "none",
                      opacity: 0.9,
                    }}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Need Help (with Lucide icons) */}
          <div>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: THEME.dustTaupe,
                marginBottom: "20px",
              }}
            >
              NEED HELP?
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { name: "Customer Support Desk", icon: HelpCircle, link: "/assessment" },
                { name: "Report Lost Card / Security", icon: CreditCard, link: "/assessment" },
                { name: "Global Branch Locator", icon: MapPin, link: "/" },
                { name: "Compliance & RBI Inquiries", icon: Mail, link: "/judge" },
              ].map((item) => {
                const IconComp = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.link}
                      style={{
                        color: "#FFFFFF",
                        fontSize: "14.5px",
                        fontWeight: 450,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        opacity: 0.9,
                      }}
                    >
                      <IconComp size={15} color={THEME.lightSignalOrange} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 4: Brand & Socials */}
          <div>
            <div style={{ marginBottom: "20px" }}>
              <Logo inverted />
            </div>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: "24px",
              }}
            >
              CrediNove AI is an enterprise financial intelligence platform pioneering fair,
              transparent, and high-accuracy credit assessment.
            </p>

            {/* Social Icons (Lucide) */}
            <div style={{ display: "flex", gap: "12px" }}>
              {[
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Twitter, label: "X" },
                { icon: Facebook, label: "Facebook" },
                { icon: Youtube, label: "YouTube" },
              ].map((s) => {
                const SocialIcon = s.icon;
                return (
                  <a
                    key={s.label}
                    href="#contact"
                    style={{
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
                    }}
                    aria-label={s.label}
                  >
                    <SocialIcon size={17} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* 1px White-at-opacity Divider */}
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            marginBottom: "36px",
          }}
        />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-wrap items-center gap-6 text-sm" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
            <span>© 2026 CrediNove AI, Inc. All rights reserved.</span>
            <a href="#contact" style={{ color: "inherit", textDecoration: "none" }}>
              Privacy Policy
            </a>
            <a href="#contact" style={{ color: "inherit", textDecoration: "none" }}>
              Terms of Use
            </a>
            <a href="#contact" style={{ color: "inherit", textDecoration: "none" }}>
              Regulatory Disclosures
            </a>
          </div>

          {/* Country / Language Pill Selector */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setCountryOpen(!countryOpen)}
              style={{
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
              }}
            >
              <Globe size={15} color={THEME.lightSignalOrange} />
              <span>{selectedCountry}</span>
              <ChevronDown size={14} />
            </button>

            {countryOpen && (
              <div
                style={{
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
                }}
              >
                {countries.map((c) => (
                  <div
                    key={c}
                    onClick={() => {
                      setSelectedCountry(c);
                      setCountryOpen(false);
                    }}
                    style={{
                      padding: "8px 16px",
                      fontSize: "13px",
                      color: "#FFFFFF",
                      cursor: "pointer",
                      backgroundColor: c === selectedCountry ? "rgba(255,255,255,0.1)" : "transparent",
                    }}
                  >
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ───────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ minHeight: "100%", backgroundColor: THEME.canvas }}>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <ConstellationServices />
        <PillCarouselSection />
        <HowItWorks />
        <ScorePreviewCalculator />
        <CTAStadium />
      </main>
      <Footer />
    </div>
  );
}
