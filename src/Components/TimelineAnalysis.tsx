import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Alert } from "@mui/material";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { Thinking } from "./Loader/Thinking";

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
  const timeline: TimelineData = {
    timeline: {}, // Start with an empty timeline object
  };

  // Define the situation for the first session
  const initialSituation = "Flooding";

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i]; // Get the question at the current index

    // Only proceed if the question exists
    if (question) {
      const sessionKey = `situation_${i + 1}`;

      // Base session data structure
      const sessionData: Partial<SessionData> = {
        event: question.text || `Event ${i + 1}`, // Use question text or a default
        actions:
          question.choices
            ?.filter((c) => !c.isTextField) // Filter out text field choices
            .map((c) => c.text) || [], // Map to choice text, default to empty array
        chosen_action: answers[question.id] || "", // Get the chosen answer or default to empty string
      };

      // Add the 'situation' field only for the first session (session_1)
      if (i === 0) {
        sessionData.situation = initialSituation;
      }

      // Add the constructed session data to the timeline object
      timeline.timeline[sessionKey] = sessionData as SessionData; // Assert type as SessionData
    } else {
      // Optional: If you want to stop processing if a question is missing
      // console.warn(`Question at index ${i} (for ${sessionKey}) not found.`);
      // break;
    }
  }

  return timeline;
};

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
        console.log("Formatted timeline data:", timeline);

        // Encode the timeline as a URI component
        // const encodedTimeline = encodeURIComponent(JSON.stringify(timeline));

        // Make the API request
        const response = await axios.post(
          `/api/timeline/analyze/`,
          JSON.stringify(timeline)
        );

        // Extract the data directly from axios response
        const data = response.data;

        // if (!response.ok) {
        //   throw new Error(`API request failed with status ${response.status}`);
        // }

        // const data = await response.json();
        console.log("API response data:", data);

        if (
          data.status === 200 ||
          data.message === "OK" ||
          data.status === 201
        ) {
          setAnalysis(data.data);
        } else {
          setError(`Server responded with status: ${data}`);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Error fetching analysis:", err);
      } finally {
        setLoading(false);
      }
    };

    if (questions.length > 0 && Object.keys(answers).length > 0) {
      fetchAnalysis();
    }
  }, [questions, answers]);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom align="center">
        Choice Analysis
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          {/* <CircularProgress /> */}
          <Thinking />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          Error during analysis: {error}
        </Alert>
      )}

      {!loading && !error && analysis && (
        <Box sx={{ mt: 2 }}>
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </Box>
      )}

      {!loading && !error && !analysis && (
        <Alert severity="info" sx={{ my: 2 }}>
          No analysis available at the moment.
        </Alert>
      )}
    </Paper>
  );
};

export default TimelineAnalysis;
