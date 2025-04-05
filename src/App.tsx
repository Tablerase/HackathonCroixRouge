import React, { useState } from "react";
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
          backgroundColor: "#f0f0f0",
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}> */}
        <Container>
          {/* <Typography variant="h4" component="h1" gutterBottom align="center">
            TousConcernés - POC
          </Typography> */}

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
