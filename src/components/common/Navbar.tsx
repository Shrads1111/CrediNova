import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function Logo({ inverted }: { inverted?: boolean }) {
  const textColor = inverted ? "#FFFFFF" : "#1A2B3C";
  return (
    <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
      <div
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "7px",
          background: "linear-gradient(135deg, #0EA5A0, #22C55E)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(14,165,160,0.25)",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
        </svg>
      </div>
      <span
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 800,
          fontSize: "17px",
          color: textColor,
          letterSpacing: "-0.025em",
        }}
      >
        CrediNove <span style={{ color: "#0EA5A0", fontWeight: 700 }}>AI</span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isLanding = location.pathname === "/";
  const isAssessment = location.pathname === "/assessment";
  const isResults = location.pathname === "/assessment/results";
  const isJudge = location.pathname === "/judge";

  const handleNavAnchor = (id: string) => {
    setMobileOpen(false);
    if (!isLanding) {
      navigate(`/#${id}`);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #E5E7EB",
        boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Logo />
          {isJudge && (
            <span
              className="badge badge-teal hidden sm:inline-flex"
              style={{ fontSize: 11, letterSpacing: "0.06em", fontWeight: 700 }}
            >
              JUDGE MODE
            </span>
          )}
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            style={{
              fontSize: "14px",
              fontWeight: isLanding ? 700 : 500,
              color: isLanding ? "#0EA5A0" : "#4B5563",
              textDecoration: "none",
            }}
          >
            Home
          </Link>
          <button
            onClick={() => handleNavAnchor("about")}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontSize: "14px",
              fontWeight: 500,
              color: "#4B5563",
              cursor: "pointer",
            }}
          >
            About
          </button>
          <button
            onClick={() => handleNavAnchor("services")}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontSize: "14px",
              fontWeight: 500,
              color: "#4B5563",
              cursor: "pointer",
            }}
          >
            Services
          </button>
          <button
            onClick={() => handleNavAnchor("how-it-works")}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontSize: "14px",
              fontWeight: 500,
              color: "#4B5563",
              cursor: "pointer",
            }}
          >
            How It Works
          </button>
          <Link
            to="/assessment"
            style={{
              fontSize: "14px",
              fontWeight: isAssessment ? 700 : 500,
              color: isAssessment ? "#0EA5A0" : "#4B5563",
              textDecoration: "none",
            }}
          >
            Assessment
          </Link>
          {isResults && (
            <Link
              to="/assessment/results"
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#0EA5A0",
                textDecoration: "none",
              }}
            >
              Results
            </Link>
          )}
          <Link
            to="/judge"
            style={{
              fontSize: "13px",
              fontWeight: isJudge ? 700 : 600,
              color: isJudge ? "#0EA5A0" : "#6B7280",
              textDecoration: "none",
              background: isJudge ? "#E6F7F7" : "#F3F4F6",
              padding: "4px 10px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span>⚖️</span>
            Judge Analytics
          </Link>
        </nav>

        {/* Action buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!isJudge && (
            <Link
              to="/judge"
              className="btn-ghost"
              style={{ fontSize: "13px", padding: "7px 14px", color: "#1A2B3C" }}
            >
              Judge Dashboard
            </Link>
          )}
          {!isAssessment && (
            <Link
              to="/assessment"
              className="btn-primary"
              style={{ fontSize: "13.5px", padding: "8px 18px" }}
            >
              Start Assessment →
            </Link>
          )}
          {isAssessment && (
            <Link
              to="/"
              className="btn-ghost"
              style={{ fontSize: "13px", padding: "7px 14px" }}
            >
              ← Back to Home
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: "none", border: "none", color: "#1A2B3C", cursor: "pointer", padding: "6px" }}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" strokeLinecap="round" />
                <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
                <line x1="4" y1="17" x2="20" y2="17" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          style={{
            background: "white",
            borderTop: "1px solid #E5E7EB",
            padding: "16px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
          className="md:hidden"
        >
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            style={{ padding: "8px 0", color: "#1A2B3C", fontWeight: 600, textDecoration: "none" }}
          >
            Home
          </Link>
          <button
            onClick={() => handleNavAnchor("about")}
            style={{ textAlign: "left", background: "none", border: "none", padding: "8px 0", color: "#4B5563", fontSize: "15px" }}
          >
            About
          </button>
          <button
            onClick={() => handleNavAnchor("services")}
            style={{ textAlign: "left", background: "none", border: "none", padding: "8px 0", color: "#4B5563", fontSize: "15px" }}
          >
            Services
          </button>
          <button
            onClick={() => handleNavAnchor("how-it-works")}
            style={{ textAlign: "left", background: "none", border: "none", padding: "8px 0", color: "#4B5563", fontSize: "15px" }}
          >
            How It Works
          </button>
          <Link
            to="/assessment"
            onClick={() => setMobileOpen(false)}
            style={{ padding: "8px 0", color: "#0EA5A0", fontWeight: 600, textDecoration: "none" }}
          >
            Start Assessment
          </Link>
          <Link
            to="/judge"
            onClick={() => setMobileOpen(false)}
            style={{ padding: "8px 0", color: "#1A2B3C", fontWeight: 600, textDecoration: "none" }}
          >
            ⚖️ Judge Analytics Dashboard
          </Link>
        </div>
      )}
    </header>
  );
}
