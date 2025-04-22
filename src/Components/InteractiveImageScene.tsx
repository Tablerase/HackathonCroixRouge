import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import "./ImageScene.css";
import { DraggableCards } from "./DraggableCards";

const SceneContainer = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  minHeight: "100vh",
  height: "auto",
  margin: 0,
  padding: 0,
  // backgroundImage: "url(/house_with_flooding.png)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed", // Keep background fixed while scrolling
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 40, 0.4)",
    zIndex: 1,
  },
});

const ContentWrapper = styled("div")({
  position: "relative",
  width: "100%",
  minHeight: "100vh",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  boxSizing: "border-box",
  // Add these for iOS Safari
  "@supports (-webkit-touch-callout: none)": {
    minHeight: "-webkit-fill-available",
  },
});

const ColorLibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.main})`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

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

interface DraggableCardsWrapperProps {
  choices: AnswerChoice[];
  questionId: number;
  onAnswerSelect: (questionId: number, answerText: string) => void;
  selectedAnswer?: { answerId: number; answerText: string };
  customAnswer: string;
  setCustomAnswer: (text: string) => void;
  onCustomAnswerSubmit: () => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

const DraggableCardsWrapper: React.FC<DraggableCardsWrapperProps> = ({
  choices,
  questionId,
  onAnswerSelect,
  selectedAnswer,
  customAnswer,
  setCustomAnswer,
  onCustomAnswerSubmit,
  containerRef,
}) => {
  // Convert choices to cards format
  const cards = choices
    .filter((choice) => !choice.isTextField)
    .map((choice) => ({
      id: choice.id,
      text: choice.text,
    }));

  // Handle card drop
  const handleCardDrop = (card: { id: number; text: string }) => {
    onAnswerSelect(questionId, card.text);
  };

  // Check if custom text field is needed
  const hasTextField = choices.some((choice) => choice.isTextField);

  return (
    <div style={{ width: "100%" }}>
      <DraggableCards
        key={questionId}
        initialCards={cards}
        onCardDrop={handleCardDrop}
        customText={hasTextField}
        customTextValue={customAnswer}
        onCustomTextChange={setCustomAnswer}
        onCustomTextSubmit={onCustomAnswerSubmit}
        selectedAnswer={selectedAnswer}
        containerRef={containerRef}
      />
    </div>
  );
};

const InteractiveImageScene: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{
    [questionId: number]: { id: number; text: string };
  }>({});
  const [customAnswer, setCustomAnswer] = useState<string>("");
  const [questionTransition, setQuestionTransition] = useState(false);
  const [pendingFinish, setPendingFinish] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the top of the content when the question changes
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    setQuestionTransition(true);
    const timeout = setTimeout(() => setQuestionTransition(false), 400); // duration matches CSS
    return () => clearTimeout(timeout);
  }, [currentQuestionIndex]);

  // Mock data for questions
  // ![TODO] Replace with actual data fetching logic (questions from API) with appropriate error handling and language support
  const questions: Question[] = [
    {
      id: 1,
      text: "You live in an area known to be prone to flooding. Weather forecasts have been predicting heavy rain for several days. You receive an official alert (Flood Warning/Weather Service/Emergency Alert): imminent risk of flooding.",
      choices: [
        {
          id: 1,
          text: "Begin moving valuable items and essential belongings to the upper floor.",
        },
        {
          id: 2,
          text: "Ignore the alert, thinking it won't be that serious this time.",
        },
        {
          id: 3,
          text: "Go down to the basement to try to protect items stored there.",
        },
        { id: 4, text: "", isTextField: true },
      ],
    },
    {
      id: 2,
      text: "Water begins to seep into the ground floor. The water level is rising quickly.",
      choices: [
        {
          id: 1,
          text: "Quickly prepare an emergency kit (water, food, radio, flashlight, documents, medications).",
        },
        {
          id: 2,
          text: "Try to leave by car to reach relatives who live on higher ground.",
        },
        {
          id: 3,
          text: "Try to block the water by sealing doors with towels and sandbags from the garage.",
        },
        { id: 4, text: "", isTextField: true },
      ],
    },
    {
      id: 3,
      text: "The ground floor is now flooded (more than three feet of water). You are taking refuge upstairs with your family.",
      choices: [
        {
          id: 1,
          text: "Position yourself near an upstairs window and use a flashlight to signal your presence to rescue services.",
        },
        {
          id: 2,
          text: "Carefully go downstairs to assess the damage and see if anything can still be saved.",
        },
        {
          id: 3,
          text: "Try to call emergency services using the landline phone, even if it doesn't seem to be working.",
        },
        { id: 4, text: "", isTextField: true },
      ],
    },
    {
      id: 4,
      text: "The flood has caused structural damage to your home. What should you do if you are trapped under debris?",
      choices: [
        { id: 1, text: "Stay calm, conserve energy, and wait for help" },
        { id: 2, text: "Try to move and free yourself as much as possible" },
        {
          id: 3,
          text: "Make noise periodically to attract attention from rescuers",
        },
        { id: 4, text: "", isTextField: true },
      ],
    },
    // {
    //   id: 5,
    //   text: "During the flooding event, what is the most reliable way to stay informed about the situation?",
    //   choices: [
    //     {
    //       id: 1,
    //       text: "Check official social media accounts of emergency services",
    //     },
    //     {
    //       id: 2,
    //       text: "Listen to a battery-powered radio for local news updates",
    //     },
    //     {
    //       id: 3,
    //       text: "Monitor emergency alert systems on your mobile device",
    //     },
    //     { id: 4, text: "", isTextField: true },
    //   ],
    // },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (questionId: number, answerText: string) => {
    // Find the answerId that matches this text
    const answerChoice = currentQuestion.choices.find(
      (choice) => choice.text === answerText
    );
    const answerId = answerChoice?.id || -1; // Use -1 as fallback for custom text

    setAnswers((prev) => {
      const updated = {
        ...prev,
        [questionId]: { id: answerId, text: answerText },
      };
      if (currentQuestionIndex === questions.length - 1) {
        setPendingFinish(true);
      }
      return updated;
    });

    // Move to next question if not at the end
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        // Let the useEffect handle clearing/restoring
      }, 10);
    }
  };

  useEffect(() => {
    if (
      pendingFinish &&
      Object.keys(answers).length === questions.length // All questions answered
    ) {
      handleFinish();
      setPendingFinish(false);
    }
  }, [answers, pendingFinish, questions.length]);

  const handleCustomAnswerSubmit = () => {
    if (customAnswer.trim()) {
      handleAnswerSelect(currentQuestion.id, customAnswer);
    }
  };

  const handleFinish = () => {
    // Store full questions in sessionStorage
    window.sessionStorage.setItem("questions", JSON.stringify(questions));

    // Navigate to a results page with both answers and questions in the state
    navigate("/results", {
      state: {
        answers,
        questions: questions.map((q) => ({ id: q.id, text: q.text })), // Only send necessary data
      },
    });
  };

  return (
    <SceneContainer>
      {/* <RainEffect /> */}
      <ContentWrapper ref={contentRef}>
        <Paper
          elevation={3}
          className={questionTransition ? "question-transition" : ""}
          sx={{
            p: 3,
            borderRadius: 2,
            maxWidth: 800,
            mx: "auto",
            background: "rgba(255, 255, 255, 0.9)", // Make paper slightly transparent
          }}
        >
          {/* Question Stepper/Timeline */}
          <Stepper
            activeStep={currentQuestionIndex}
            connector={<ColorLibConnector />}
            sx={{ mb: 4 }}
          >
            {questions.map((question, index) => (
              <Step key={question.id} completed={index < currentQuestionIndex}>
                <StepLabel
                  // Make completed steps clickable
                  onClick={() => {
                    if (index < currentQuestionIndex) {
                      setCurrentQuestionIndex(index);
                    }
                  }}
                  style={{
                    cursor:
                      index < currentQuestionIndex ? "pointer" : "default",
                    pointerEvents:
                      index < currentQuestionIndex ? "auto" : "none",
                  }}
                ></StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Current Question */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              {currentQuestion.text}
            </Typography>
          </Box>

          {/* Answer Choices */}
          <Box sx={{ width: "100%", mb: 2 }}>
            <DraggableCardsWrapper
              choices={currentQuestion.choices}
              questionId={currentQuestion.id}
              onAnswerSelect={handleAnswerSelect}
              selectedAnswer={
                answers[currentQuestion.id]
                  ? {
                      answerId: answers[currentQuestion.id].id,
                      answerText: answers[currentQuestion.id].text,
                    }
                  : undefined
              }
              customAnswer={
                answers[currentQuestion.id]?.id === -1
                  ? answers[currentQuestion.id].text
                  : ""
              }
              setCustomAnswer={setCustomAnswer}
              onCustomAnswerSubmit={handleCustomAnswerSubmit}
              containerRef={contentRef}
            />
          </Box>

          {/* Navigation */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Typography variant="body2" sx={{ alignSelf: "center" }}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>
          </Box>
        </Paper>
      </ContentWrapper>
    </SceneContainer>
  );
};

export default InteractiveImageScene;
