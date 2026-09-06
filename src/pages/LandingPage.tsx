import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Logo } from "../components/common/Navbar";

// ─── Colors & tokens ────────────────────────────────────────────────────────
const C = {
  navy: "#0F1E2E",
  navyMid: "#1A2B3C",
  slate: "#4B5563",
  muted: "#6B7280",
  light: "#9CA3AF",
  border: "#E2E6EA",
  surface: "#F7F9FA",
  white: "#FFFFFF",
  teal: "#0EA5A0",
  tealDk: "#0B8C87",
  green: "#22C55E",
  greenDk: "#16A34A",
  amber: "#F59E0B",
  red: "#EF4444",
};

// ─── Micro icons ─────────────────────────────────────────────────────────────
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ArrowUpRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
);
const XIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// ─── Announcement bar ────────────────────────────────────────────────────────
function AnnouncementBar() {
  return (
    <div
      style={{
        background: C.navy,
        color: "rgba(255,255,255,0.82)",
        fontSize: "12.5px",
        textAlign: "center",
        padding: "8px 16px",
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: "0.01em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        flexWrap: "wrap",
      }}
    >
      <span style={{ color: C.teal, fontWeight: 700 }}>●</span>
      <span>AI-Powered Credit Scoring Trusted by Financial Institutions Nationwide</span>
      <Link to="/judge" style={{ color: C.teal, textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 3 }}>
        Explore Model Performance & Analytics <ArrowUpRight />
      </Link>
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="home" style={{ paddingTop: "64px", background: C.white }}>
      <div style={{ borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "56px 24px 0" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left col */}
            <div style={{ paddingBottom: "48px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: C.teal, marginBottom: "14px" }}>
                AI-Powered Credit Intelligence
              </p>
              <h1
                style={{
                  fontSize: "clamp(32px, 4.5vw, 48px)",
                  fontWeight: 800,
                  color: C.navy,
                  lineHeight: 1.15,
                  letterSpacing: "-0.03em",
                  marginBottom: "20px",
                  maxWidth: "540px",
                }}
              >
                Smarter Credit Decisions,{" "}
                <span style={{ color: C.teal }}>Built on Better Data</span>
              </h1>
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: 1.65,
                  color: C.slate,
                  maxWidth: "480px",
                  marginBottom: "32px",
                }}
              >
                CrediNove AI combines bureau records with alternative signals — utility punctuality, cash flow velocity, and digital transaction behavior — to deliver accurate, fair, and explainable credit assessments for modern banking.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "48px" }}>
                <Link to="/assessment" className="btn-primary" style={{ textDecoration: "none", padding: "12px 24px" }}>
                  Start Assessment <ChevronRight />
                </Link>
                <Link to="/judge" className="btn-secondary" style={{ textDecoration: "none", padding: "11px 20px" }}>
                  Judge Analytics Dashboard
                </Link>
              </div>
              {/* Credibility row */}
              <div style={{ display: "flex", gap: "36px", flexWrap: "wrap" }}>
                {[
                  { val: "98.2%", label: "Assessment accuracy" },
                  { val: "200+", label: "Financial institutions" },
                  { val: "<3s", label: "Average scoring time" },
                ].map((s) => (
                  <div key={s.val}>
                    <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "24px", color: C.navy, letterSpacing: "-0.02em" }}>
                      {s.val}
                    </p>
                    <p style={{ fontSize: "13px", color: C.muted, marginTop: "2px" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right col with illustration card */}
            <div style={{ position: "relative", minHeight: "380px" }}>
              <img
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=760&h=560&fit=crop&auto=format&q=85"
                alt="Financial analysts analyzing real-time data"
                style={{ width: "100%", height: "420px", objectFit: "cover", borderRadius: "12px", display: "block" }}
              />
              {/* Floating live card */}
              <div
                style={{
                  position: "absolute",
                  bottom: "24px",
                  left: "20px",
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  borderRadius: "10px",
                  padding: "16px 22px",
                  minWidth: "220px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: C.green }} />
                  <p style={{ fontSize: "11.5px", fontWeight: 700, color: C.muted, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Live Processing
                  </p>
                </div>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "28px", color: C.navy, letterSpacing: "-0.02em", lineHeight: 1 }}>
                  98.2%
                </p>
                <p style={{ fontSize: "12.5px", color: C.muted, marginTop: "4px" }}>Scoring accuracy · Q3 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", gap: "36px", flexWrap: "wrap" }}>
          <p style={{ fontSize: "11.5px", fontWeight: 700, color: C.light, letterSpacing: "0.07em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            Trusted by
          </p>
          <div style={{ width: "1px", height: "20px", background: C.border }} />
          {[
            ["NB", "National Bank"],
            ["PF", "Pacific Finance"],
            ["MC", "Metro Credit Union"],
            ["GT", "Global Trust"],
            ["FB", "First Banking Corp"],
          ].map(([abbr, name]) => (
            <div key={abbr} style={{ display: "flex", alignItems: "center", gap: "8px", opacity: 0.75 }}>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "6px",
                  background: C.navyMid,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.white,
                  fontSize: "11px",
                  fontWeight: 700,
                  fontFamily: "'Manrope', sans-serif",
                }}
              >
                {abbr}
              </div>
              <span style={{ fontSize: "13.5px", fontWeight: 600, color: C.navyMid }}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features / Why CrediNove ────────────────────────────────────────────────
function Features() {
  const features = [
    {
      num: "01",
      title: "AI-Powered Assessment",
      desc: "Proprietary machine learning models analyse hundreds of variables simultaneously — producing credit scores that outperform bureau-only models by a measurable margin.",
      points: ["Neural credit modelling", "Real-time decisioning", "Adaptive learning from outcomes"],
    },
    {
      num: "02",
      title: "Alternative Data Signals",
      desc: "Overcome thin-file limitations by incorporating utility payments, rent history, e-commerce behaviour, and mobile money flows to build complete borrower profiles.",
      points: ["Utility & rental history", "Cash flow analytics", "Transaction behaviour"],
    },
    {
      num: "03",
      title: "Explainable Decisions",
      desc: "Every score comes with transparent factor attribution — satisfying regulatory requirements and giving borrowers meaningful insight into the decision.",
      points: ["Fair lending compliant", "Auditable factor scores", "Bias detection & monitoring"],
    },
  ];

  return (
    <section id="about" style={{ padding: "88px 0", background: C.white }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        {/* Header row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-14">
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: C.teal, marginBottom: "12px" }}>
              Why CrediNove
            </p>
            <h2 style={{ fontSize: "clamp(26px,3.5vw,36px)", fontWeight: 800, color: C.navy, lineHeight: 1.2 }}>
              Credit intelligence that goes further than a bureau score
            </h2>
          </div>
          <div style={{ paddingTop: "12px" }}>
            <p style={{ fontSize: "15.5px", lineHeight: 1.65, color: C.slate }}>
              Three foundational capabilities that make CrediNove AI the most trusted credit assessment platform for banks, fintechs, and microfinance institutions.
            </p>
            <a
              href="#services"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "16px",
                fontSize: "13.5px",
                fontWeight: 600,
                color: C.teal,
                textDecoration: "none",
              }}
            >
              Explore all capabilities <ArrowUpRight />
            </a>
          </div>
        </div>

        {/* Feature rows */}
        <div style={{ borderTop: `1px solid ${C.border}` }}>
          {features.map((f) => (
            <div
              key={f.num}
              className="grid grid-cols-1 md:grid-cols-[60px_1.2fr_1fr] gap-6 md:gap-10 py-10 items-start border-b border-[#E2E6EA]"
            >
              <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: "14px", fontWeight: 800, color: C.teal, letterSpacing: "0.04em" }}>
                {f.num}
              </p>
              <div>
                <h3 style={{ fontSize: "19px", fontWeight: 700, color: C.navy, marginBottom: "10px" }}>{f.title}</h3>
                <p style={{ fontSize: "15px", lineHeight: 1.6, color: C.slate }}>{f.desc}</p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {f.points.map((p) => (
                  <li key={p} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: C.teal,
                        color: "white",
                        flexShrink: 0,
                      }}
                    >
                      <CheckIcon />
                    </span>
                    <span style={{ fontSize: "14px", color: C.slate }}>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Financial Inclusion ─────────────────────────────────────────────────────
function FinancialInclusion() {
  return (
    <section style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }} className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image panel */}
        <div style={{ position: "relative", minHeight: "440px" }}>
          <img
            src="https://images.unsplash.com/photo-1573167507387-6b4b98cb7c13?w=640&h=520&fit=crop&auto=format&q=85"
            alt="Banking committee reviewing loan applications"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              top: "32px",
              right: "32px",
              background: C.navy,
              borderRadius: "10px",
              padding: "20px 24px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "32px", color: C.white, lineHeight: 1 }}>
              47K+
            </p>
            <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.65)", marginTop: "4px" }}>
              Loans enabled, Q3 2026
            </p>
          </div>
        </div>

        {/* Content panel */}
        <div style={{ padding: "64px 40px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: C.teal, marginBottom: "14px" }}>
            Financial Inclusion
          </p>
          <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, color: C.navy, lineHeight: 1.25 }}>
            Credit access for those who deserve it
          </h2>
          <div style={{ width: "40px", height: "3px", background: C.teal, margin: "20px 0" }} />
          <p style={{ fontSize: "15px", lineHeight: 1.65, color: C.slate, marginBottom: "18px" }}>
            Millions of MSMEs and individuals with thin or absent traditional credit files are excluded from formal lending — not because they are risky, but because traditional scoring cannot see their full financial picture.
          </p>
          <p style={{ fontSize: "15px", lineHeight: 1.65, color: C.slate, marginBottom: "32px" }}>
            CrediNove AI surfaces creditworthiness through alternative data: mobile money flows, utility punctuality, supply chain receipts, and spending patterns — giving lenders the confidence to extend credit responsibly.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              marginBottom: "36px",
              paddingTop: "24px",
              borderTop: `1px solid ${C.border}`,
            }}
          >
            {[
              ["1.7B", "Adults globally unbanked"],
              ["64%", "MSMEs lack credit access"],
              ["3×", "Better approval rate"],
            ].map(([val, lbl]) => (
              <div key={val}>
                <p style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "24px", color: C.navy }}>{val}</p>
                <p style={{ fontSize: "12.5px", color: C.muted, marginTop: "2px" }}>{lbl}</p>
              </div>
            ))}
          </div>
          <Link to="/assessment" className="btn-secondary" style={{ textDecoration: "none" }}>
            Run Live Assessment <ChevronRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num: "1", title: "Data Collection", desc: "Securely ingesting bureau data, utility records, transaction history, and mobile payment signals." },
    { num: "2", title: "AI Analysis", desc: "Models process hundreds of variables simultaneously, surfacing patterns invisible to conventional scoring." },
    { num: "3", title: "Credit Scoring", desc: "A composite credit score calibrated against real-world repayment data is generated in under three seconds." },
    { num: "4", title: "Explainability", desc: "Clear factor attribution is produced alongside every score, satisfying fair lending regulation." },
    { num: "5", title: "Loan Decision", desc: "Lenders receive actionable recommendations with risk tier, confidence interval, and recommended terms." },
  ];

  return (
    <section id="how-it-works" style={{ padding: "88px 0", background: C.white }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-14 items-start">
          {/* Left info */}
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: C.teal, marginBottom: "12px" }}>
              The Process
            </p>
            <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, color: C.navy, lineHeight: 1.25 }}>
              From data to decision in seconds
            </h2>
            <div style={{ width: "36px", height: "3px", background: C.teal, margin: "20px 0" }} />
            <p style={{ fontSize: "15px", lineHeight: 1.65, color: C.slate, marginBottom: "28px" }}>
              A streamlined five-stage pipeline that turns raw financial and behavioral signals into confident lending decisions.
            </p>
            <Link to="/judge" className="btn-primary" style={{ textDecoration: "none" }}>
              See Technical Audit Overview <ChevronRight />
            </Link>
          </div>

          {/* Steps */}
          <div>
            {steps.map((s, i) => (
              <div key={s.num} style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: "20px", position: "relative" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: i === 0 ? C.teal : C.white,
                      border: `2px solid ${i === 0 ? C.teal : C.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      zIndex: 1,
                    }}
                  >
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "13px", color: i === 0 ? C.white : C.muted }}>
                      {s.num}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ width: "1px", flex: 1, background: C.border, margin: "6px 0", minHeight: "44px" }} />
                  )}
                </div>
                <div style={{ paddingBottom: i < steps.length - 1 ? "28px" : "0", paddingTop: "6px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: C.navy, marginBottom: "6px" }}>{s.title}</h3>
                  <p style={{ fontSize: "14px", lineHeight: 1.6, color: C.muted }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Services ────────────────────────────────────────────────────────────────
function Services() {
  const services = [
    { title: "Credit Scoring", desc: "Comprehensive individual and business scores combining 200+ variables from bureau and alternative data.", tag: "Core", tagColor: C.teal },
    { title: "Risk Analysis", desc: "Portfolio-level monitoring with stress testing, real-time alerts, and predictive default modelling.", tag: "Enterprise", tagColor: C.navyMid },
    { title: "Loan Assessment", desc: "Automated end-to-end evaluation: document analysis, income verification, and capacity-to-pay modelling.", tag: "Popular", tagColor: C.green },
    { title: "AI Insights", desc: "Actionable dashboards surfacing market trends, borrower segments, and portfolio optimisation opportunities.", tag: "New", tagColor: C.amber },
  ];

  return (
    <section id="services" style={{ padding: "88px 0", background: C.surface, borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: C.teal, marginBottom: "12px" }}>
              Our Services
            </p>
            <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, color: C.navy }}>
              Full-spectrum credit intelligence
            </h2>
          </div>
          <Link to="/assessment" className="btn-secondary" style={{ textDecoration: "none" }}>
            Launch Assessment Tool <ChevronRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s) => (
            <ServiceCard key={s.title} service={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: { title: string; desc: string; tag: string; tagColor: string } }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.white,
        border: `1px solid ${hov ? "#0EA5A0" : C.border}`,
        borderRadius: "12px",
        padding: "32px 26px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? "0 8px 24px rgba(14,165,160,0.12)" : "0 2px 8px rgba(0,0,0,0.03)",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: service.tagColor, marginTop: "6px" }} />
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: service.tagColor,
            border: `1px solid ${service.tagColor}`,
            borderRadius: "4px",
            padding: "2px 8px",
            letterSpacing: "0.04em",
          }}
        >
          {service.tag}
        </span>
      </div>
      <h3 style={{ fontSize: "18px", fontWeight: 700, color: C.navy, marginBottom: "10px" }}>{service.title}</h3>
      <p style={{ fontSize: "13.5px", lineHeight: 1.6, color: C.muted, marginBottom: "20px" }}>{service.desc}</p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "13px",
          fontWeight: 600,
          color: hov ? C.teal : C.light,
          transition: "color 0.2s",
        }}
      >
        Learn more <ArrowUpRight />
      </div>
    </div>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section style={{ background: C.navy }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
          {/* Left */}
          <div style={{ padding: "72px 40px 72px 0", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: C.teal, letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: "16px" }}>
              Get Started
            </p>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 800, color: C.white, lineHeight: 1.2, marginBottom: "20px" }}>
              Ready to transform credit assessment?
            </h2>
            <p style={{ fontSize: "15.5px", lineHeight: 1.65, color: "rgba(255,255,255,0.65)", maxWidth: "420px" }}>
              Join forward-thinking banks and financial institutions using CrediNove AI to approve more qualified borrowers, minimize default risk, and expand portfolios responsibly.
            </p>
          </div>

          {/* Right */}
          <div style={{ padding: "72px 0 72px 40px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "36px", maxWidth: "320px" }}>
              <Link to="/assessment" className="btn-primary" style={{ textDecoration: "none", padding: "12px 24px" }}>
                Start Assessment <ChevronRight />
              </Link>
              <Link to="/judge" className="btn-secondary" style={{ textDecoration: "none", textAlign: "center" }}>
                Open Judge Analytics
              </Link>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {["SOC 2 Type II Certified", "GDPR & CCPA Compliant", "99.9% Uptime SLA", "Basel III & RBI Explainability Compliant"].map((t) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: C.teal, display: "flex" }}><CheckIcon /></span>
                  <span style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.6)" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  const cols: Record<string, string[]> = {
    Product: ["Credit Scoring", "Risk Analysis", "Loan Assessment", "AI Insights", "API Documentation"],
    Company: ["About Us", "Careers", "Blog", "Partners", "Press"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Compliance"],
  };

  return (
    <footer id="contact" style={{ background: "#0B1724", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 24px 40px" }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
          <div>
            <Logo inverted />
            <p style={{ fontSize: "13.5px", lineHeight: 1.65, color: "rgba(255,255,255,0.45)", margin: "20px 0 24px", maxWidth: "280px" }}>
              AI-powered credit intelligence that expands financial access while reducing lending risk. Trusted by 200+ institutions globally.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
              {[
                ["MailIcon", "contact@credinove.ai"],
                ["PhoneIcon", "+1 (888) 273-4672"],
              ].map(([icon, val]) => (
                <div key={val} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>{icon === "MailIcon" ? <MailIcon /> : <PhoneIcon />}</span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {[<LinkedInIcon key="li" />, <XIcon key="x" />].map((icon, i) => (
                <div
                  key={i}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {Object.entries(cols).map(([section, items]) => (
            <div key={section}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "18px" }}>
                {section}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                {items.map((item) => (
                  <li key={item}>
                    <span style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.45)", cursor: "pointer" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <p style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.3)" }}>
            © 2026 CrediNove AI, Inc. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            {["SOC 2", "ISO 27001", "GDPR", "RBI / Basel III Ready"].map((cert) => (
              <span key={cert} style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", padding: "3px 8px" }}>
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ───────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ minHeight: "100%", background: C.white }}>
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <FinancialInclusion />
        <HowItWorks />
        <Services />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
