import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, ArrowRight, Scale, Check } from "lucide-react";

export function Logo({ inverted }: { inverted?: boolean }) {
  const textColor = inverted ? "#F3F0EE" : "#141413";
  return (
    <Link
      to="/"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        textDecoration: "none",
      }}
    >
      {/* Brand Icon: Interlocking Circles Motif */}
      <div
        style={{
          position: "relative",
          width: "38px",
          height: "26px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "#EB001B",
            opacity: 0.95,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "14px",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "#F79E1B",
            opacity: 0.95,
            mixBlendMode: "multiply",
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontFamily: "'Sofia Sans', 'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "20px",
            color: textColor,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          CrediNova
        </span>
      </div>
    </Link>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    setSearchOpen(false);
    if (q.includes("judge") || q.includes("metric") || q.includes("model")) {
      navigate("/judge");
    } else if (q.includes("assess") || q.includes("score") || q.includes("apply")) {
      navigate("/assessment");
    } else if (q.includes("service") || q.includes("feature")) {
      handleNavAnchor("services");
    } else if (q.includes("how") || q.includes("work")) {
      handleNavAnchor("how-it-works");
    } else {
      navigate("/assessment");
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "18px",
          left: 0,
          right: 0,
          zIndex: 90,
          padding: "0 16px",
          pointerEvents: "none",
        }}
      >
        <header
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            backgroundColor: "#FFFFFF",
            borderRadius: "999px",
            boxShadow: "0px 4px 24px 0px rgba(0, 0, 0, 0.06)",
            border: "1px solid rgba(20, 20, 19, 0.06)",
            padding: "10px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pointerEvents: "auto",
            transition: "all 0.3s ease",
          }}
        >
          {/* Logo & Sub-tag */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Logo />
            {isJudge && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(243, 115, 56, 0.12)",
                  color: "#CF4500",
                }}
                className="hidden sm:inline-flex"
              >
                <Scale size={13} strokeWidth={2.2} />
                JUDGE MODE
              </span>
            )}
          </div>

          {/* Center Links (Desktop) */}
          <nav className="hidden lg:flex items-center" style={{ gap: "36px" }}>
            <Link
              to="/"
              style={{
                fontSize: "15px",
                fontWeight: isLanding ? 600 : 450,
                color: "#141413",
                textDecoration: "none",
                letterSpacing: "-0.02em",
                borderBottom: isLanding ? "2px solid #141413" : "2px solid transparent",
                paddingBottom: "2px",
                transition: "border-color 0.2s ease",
              }}
            >
              Overview
            </Link>
            <button
              onClick={() => handleNavAnchor("services")}
              style={{
                background: "none",
                border: "none",
                padding: "0 0 2px 0",
                fontSize: "15px",
                fontWeight: 450,
                color: "#141413",
                cursor: "pointer",
                letterSpacing: "-0.02em",
              }}
            >
              Services
            </button>
            <button
              onClick={() => handleNavAnchor("how-it-works")}
              style={{
                background: "none",
                border: "none",
                padding: "0 0 2px 0",
                fontSize: "15px",
                fontWeight: 450,
                color: "#141413",
                cursor: "pointer",
                letterSpacing: "-0.02em",
              }}
            >
              How It Works
            </button>
            <Link
              to="/assessment"
              style={{
                fontSize: "15px",
                fontWeight: isAssessment ? 600 : 450,
                color: "#141413",
                textDecoration: "none",
                letterSpacing: "-0.02em",
                borderBottom: isAssessment ? "2px solid #141413" : "2px solid transparent",
                paddingBottom: "2px",
              }}
            >
              Assessment
            </Link>
            <Link
              to="/judge"
              style={{
                fontSize: "15px",
                fontWeight: isJudge ? 600 : 450,
                color: "#141413",
                textDecoration: "none",
                letterSpacing: "-0.02em",
                borderBottom: isJudge ? "2px solid #141413" : "2px solid transparent",
                paddingBottom: "2px",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <Scale size={14} strokeWidth={2} />
              Judge Analytics
            </Link>
          </nav>

          {/* Right Action Tools */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Search circular toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "1.5px solid rgba(20, 20, 19, 0.12)",
                background: searchOpen ? "#141413" : "#FFFFFF",
                color: searchOpen ? "#F3F0EE" : "#141413",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              title="Search CrediNova platform"
              aria-label="Toggle search"
            >
              <Search size={17} strokeWidth={2} />
            </button>

            {/* Main Action Pill */}
            {!isAssessment ? (
              <Link
                to="/assessment"
                className="btn-primary hidden sm:inline-flex"
                style={{
                  fontSize: "14px",
                  padding: "7px 20px",
                  borderRadius: "20px",
                }}
              >
                <span>Start Assessment</span>
                <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
            ) : (
              <Link
                to="/"
                className="btn-secondary hidden sm:inline-flex"
                style={{
                  fontSize: "14px",
                  padding: "7px 20px",
                  borderRadius: "20px",
                }}
              >
                <span>Back to Overview</span>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "transparent",
                border: "1.5px solid rgba(20, 20, 19, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#141413",
                cursor: "pointer",
              }}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div
            style={{
              maxWidth: "600px",
              margin: "12px auto 0",
              pointerEvents: "auto",
              backgroundColor: "#FFFFFF",
              borderRadius: "999px",
              boxShadow: "0px 16px 36px 0px rgba(0, 0, 0, 0.12)",
              border: "1.5px solid #141413",
              padding: "6px 14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
            className="animate-fade-in"
          >
            <Search size={18} color="#696969" strokeWidth={2} />
            <form onSubmit={handleSearchSubmit} style={{ flex: 1, display: "flex" }}>
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models, assessment, services, explainability..."
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "14px",
                  color: "#141413",
                  padding: "6px 0",
                }}
              />
            </form>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "#696969",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(20, 20, 19, 0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 80,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            padding: "90px 16px 24px",
          }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#FCFBFA",
              borderRadius: "32px",
              padding: "24px",
              boxShadow: "0px 24px 48px rgba(0, 0, 0, 0.15)",
              border: "1px solid rgba(20, 20, 19, 0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
            onClick={(e) => e.stopPropagation()}
            className="animate-fade-in"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "16px",
                  color: "#141413",
                  fontWeight: 600,
                  fontSize: "17px",
                  textDecoration: "none",
                  backgroundColor: isLanding ? "rgba(20,20,19,0.05)" : "transparent",
                }}
              >
                Overview
              </Link>
              <button
                onClick={() => handleNavAnchor("services")}
                style={{
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  padding: "10px 14px",
                  color: "#141413",
                  fontSize: "17px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Services
              </button>
              <button
                onClick={() => handleNavAnchor("how-it-works")}
                style={{
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  padding: "10px 14px",
                  color: "#141413",
                  fontSize: "17px",
                  fontWeight: 450,
                  cursor: "pointer",
                }}
              >
                How It Works
              </button>
              <Link
                to="/assessment"
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "16px",
                  color: "#141413",
                  fontWeight: isAssessment ? 600 : 450,
                  fontSize: "17px",
                  textDecoration: "none",
                  backgroundColor: isAssessment ? "rgba(20,20,19,0.05)" : "transparent",
                }}
              >
                Start Assessment
              </Link>
              <Link
                to="/judge"
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "16px",
                  color: "#141413",
                  fontWeight: isJudge ? 600 : 450,
                  fontSize: "17px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: isJudge ? "rgba(20,20,19,0.05)" : "transparent",
                }}
              >
                <Scale size={18} />
                Judge Analytics
              </Link>
            </div>

            <div style={{ paddingTop: "12px", borderTop: "1px solid rgba(20, 20, 19, 0.08)" }}>
              <Link
                to="/assessment"
                onClick={() => setMobileOpen(false)}
                className="btn-primary"
                style={{ width: "100%", textAlign: "center" }}
              >
                Launch Credit Assessment <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
