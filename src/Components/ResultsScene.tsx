import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import TimelineAnalysis from "./TimelineAnalysis";

const ResultsScene: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, questions = [] } = location.state || {
    answers: {},
    questions: [],
  };

  // Fallback questions if none were passed (for backward compatibility)
  const fallbackQuestions = [
    {
      id: 1,
      text: "What should you include in your emergency kit?",
    },
    {
      id: 2,
      text: "What is the recommended amount of water to store per person per day?",
    },
    {
      id: 3,
      text: "Where is the safest place during an earthquake?",
    },
  ];

  // Use passed questions or fallback if none were passed
  const displayQuestions = questions.length > 0 ? questions : fallbackQuestions;
  console.log("Questions:", displayQuestions);
  console.log("Answers:", answers);

  // Get the full question objects with choices (needed for the analysis)
  const fullQuestions = window.sessionStorage.getItem("questions")
    ? JSON.parse(window.sessionStorage.getItem("questions") || "[]")
    : [];

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Results
        </Typography>

        <List sx={{ mb: 4 }}>
          {displayQuestions.map((question: any) => (
            <ListItem key={question.id} divider>
              <ListItemText
                primary={question.text}
                secondary={answers[question.id].text || "Not answered"}
                primaryTypographyProps={{ fontWeight: "bold" }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Add the TimelineAnalysis component */}
      {fullQuestions.length > 0 && (
        <TimelineAnalysis questions={fullQuestions} answers={answers} />
      )}

      <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/interactive-guide")}
        >
          Return to Questions
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          Return to Home
        </Button>
      </Box>
    </Box>
  );
};

export default ResultsScene;
