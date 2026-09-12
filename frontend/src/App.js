import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
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
        return _jsx(CredinovaIntro, {});
    }
    return (_jsx(AssessmentProvider, { children: _jsxs(BrowserRouter, { children: [_jsx(ScrollToTop, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/assessment", element: _jsx(AssessmentPage, {}) }), _jsx(Route, { path: "/assessment/results", element: _jsx(ResultsPage, {}) }), _jsx(Route, { path: "/judge", element: _jsx(JudgeDashboard, {}) }), _jsx(Route, { path: "*", element: _jsx(LandingPage, {}) })] })] }) }));
}
