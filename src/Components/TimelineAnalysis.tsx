import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import ReactMarkdown from "react-markdown";
import axios from "axios";

interface AnswerChoice {
  id: number;
  text: string;
  isTextField?: boolean;
}

interface Question {
  id: number;
  text: string;
  choices: AnswerChoice[];
}

interface TimelineAnalysisProps {
  questions: Question[];
  answers: { [questionId: number]: string };
}

const TimelineAnalysis: React.FC<TimelineAnalysisProps> = ({
  questions,
  answers,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);

        // Format the questions and answers into a timeline JSON format
        const timeline = formatTimelineData(questions, answers);

        // Encode the timeline as a URI component
        const encodedTimeline = encodeURIComponent(JSON.stringify(timeline));

        // Make the API request
        const response = await axios.post(
          `/api/timeline/analyze/`,
          encodedTimeline
        );

        // Extract the data directly from axios response
        const data = response.data;

        // if (!response.ok) {
        //   throw new Error(`API request failed with status ${response.status}`);
        // }

        // const data = await response.json();

        if (data.status === 200) {
          setAnalysis(data.data);
        } else {
          setError(`Server responded with status: ${data.message}`);
        }
      } catch (err: any) {
        setError(err.message || "An unknown error occurred");
        console.error("Error fetching analysis:", err);
      } finally {
        setLoading(false);
      }
    };

    if (questions.length > 0 && Object.keys(answers).length > 0) {
      fetchAnalysis();
    }
  }, [questions, answers]);

  // Define interfaces for timeline structure
  interface SessionData {
    situation?: string;
    event: string;
    actions: string[];
    chosen_action: string;
  }

  interface TimelineData {
    timeline: {
      [key: string]: SessionData;
    };
  }

  // Function to format the questions and answers into the expected timeline format
  const formatTimelineData = (
    questions: Question[],
    answers: { [questionId: number]: string }
  ): TimelineData => {
    // Create a timeline object based on questions and answers
    const timeline: TimelineData = {
      timeline: {
        session_0: {
          situation: "Situation d'inondation",
          event: questions[0]?.text || "Événement inconnu",
          actions:
            questions[0]?.choices
              .filter((c) => !c.isTextField)
              .map((c) => c.text) || [],
          chosen_action: answers[questions[0]?.id] || "",
        },
      },
    };

    // Add sessions 1-3 based on available questions
    questions.slice(1).forEach((question, index) => {
      const sessionNumber = index + 1;
      if (sessionNumber <= 3) {
        timeline.timeline[`session_${sessionNumber}`] = {
          event: question.text || `Événement ${sessionNumber}`,
          actions:
            question.choices.filter((c) => !c.isTextField).map((c) => c.text) ||
            [],
          chosen_action: answers[question.id] || "",
        };
      }
    });

    return timeline;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom align="center">
        Analyse de vos choix
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          Erreur lors de l'analyse: {error}
        </Alert>
      )}

      {!loading && !error && analysis && (
        <Box sx={{ mt: 2 }}>
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </Box>
      )}

      {!loading && !error && !analysis && (
        <Alert severity="info" sx={{ my: 2 }}>
          Pas d'analyse disponible pour le moment.
        </Alert>
      )}
    </Paper>
  );
};

export default TimelineAnalysis;
