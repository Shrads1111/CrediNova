import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AssessmentProvider } from "./context/AssessmentContext";
import LandingPage from "./pages/LandingPage";
import AssessmentPage from "./pages/AssessmentPage";
import ResultsPage from "./pages/ResultsPage";
import JudgeDashboard from "./pages/JudgeDashboard";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
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
