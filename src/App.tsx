import React, { useState, useEffect } from "react";
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Scene components
import MapScene from "./Components/MapScene";
import RiskAssessmentScene from "./Components/RiskAssessmentScene";
import InteractiveImageScene from "./Components/InteractiveImageScene";
import ResultsScene from "./Components/ResultsScene";

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#c62828", // Darker red color for Croix-Rouge theme
    },
    secondary: {
      main: "#212121", // Darker secondary color
    },
    background: {
      default: "#e0e0e0", // Slightly darker background
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent white
          backdropFilter: "blur(5px)",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          margin: "8px",
          "&:hover": {
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
          },
        },
      },
    },
  },
});

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
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;
