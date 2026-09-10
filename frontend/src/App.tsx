import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AssessmentProvider } from "./context/AssessmentContext";
import LandingPage from "./pages/LandingPage";
import AssessmentPage from "./pages/AssessmentPage";
import ResultsPage from "./pages/ResultsPage";
import JudgeDashboard from "./pages/JudgeDashboard";
import CredinovaIntro from "./components/CredinovaIntro";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  if (showIntro) {
    return <CredinovaIntro />;
  }

  return (
    <AssessmentProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/assessment/results" element={<ResultsPage />} />
          <Route path="/judge" element={<JudgeDashboard />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </AssessmentProvider>
  );
}

