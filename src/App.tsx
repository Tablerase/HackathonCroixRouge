import React, { useState, useEffect } from "react";
import { Container, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Scene components
import MapScene from "./Components/MapScene";
import RiskAssessmentScene from "./Components/RiskAssessmentScene";
import InteractiveImageScene from "./Components/InteractiveImageScene";
import ResultsScene from "./Components/ResultsScene";
import { theme } from "./Components/theme";
import { Thinking } from "./Components/Loader/Thinking";

const App: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [riskData, setRiskData] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    // Fix for mobile viewport height issues
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      // Set the CSS variable --vh to the viewport height
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);

    return () => {
      window.removeEventListener("resize", setVH);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Container
          disableGutters
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            "@supports (-webkit-touch-callout: none)": {
              minHeight: "-webkit-fill-available",
            },
          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <MapScene
                  setUserLocation={setUserLocation}
                  setRiskData={setRiskData}
                />
              }
            />
            <Route
              path="/risk-assessment"
              element={
                <RiskAssessmentScene
                  userLocation={userLocation}
                  riskData={riskData || {}}
                />
              }
            />
            <Route
              path="/interactive-guide"
              element={<InteractiveImageScene />}
            />
            <Route path="/results" element={<ResultsScene />} />
            <Route path="/test" element={<Thinking />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;
