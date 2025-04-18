import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
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
  backgroundImage: "url(/house_with_flooding.png)",
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
  const [answers, setAnswers] = useState<{ [questionId: number]: string }>({});
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
  // ![TODO] Replace with actual data fetching logic (questions from API) and Translate to English
  const questions: Question[] = [
    {
      id: 1,
      text: "Vous vivez dans une zone connue pour être inondable. La météo annonce de fortes pluies depuis plusieurs jours. Vous recevez une alerte officielle (Vigicrues / Météo-France / FR-Alert) : risque imminent de crue et d'inondation.",
      choices: [
        {
          id: 1,
          text: "Commencer à monter les objets de valeur et les biens essentiels à l'étage.",
        },
        {
          id: 2,
          text: "Ignorer l'alerte, pensant que ce ne sera pas si grave cette fois-ci.",
        },
        {
          id: 3,
          text: "Descendre à la cave pour essayer de protéger les affaires qui y sont stockées.",
        },
        { id: 4, text: "", isTextField: true },
      ],
    },
    {
      id: 2,
      text: "L'eau commence à s'infiltrer au rez-de-chaussée. Le niveau monte rapidement.",
      choices: [
        {
          id: 1,
          text: "Préparer rapidement le kit d'urgence (eau, nourriture, radio, lampe, papiers, médicaments...).",
        },
        {
          id: 2,
          text: "Tenter de partir en voiture pour rejoindre des proches sur les hauteurs.",
        },
        {
          id: 3,
          text: "Essayer de bloquer l'eau en calfeutrant les portes avec des serviettes et des sacs de sable du garage.",
        },
        { id: 4, text: "", isTextField: true },
      ],
    },
    {
      id: 3,
      text: "Le rez-de-chaussée est maintenant inondé (plus d'un mètre d'eau). Vous êtes réfugiés à l'étage avec votre famille.",
      choices: [
        {
          id: 1,
          text: "Vous poster près d'une fenêtre à l'étage et utiliser une lampe de poche pour signaler votre présence aux secours.",
        },
        {
          id: 2,
          text: "Descendre prudemment pour évaluer les dégâts et voir si quelque chose peut encore être sauvé.",
        },
        {
          id: 3,
          text: "Essayer d'appeler les secours avec le téléphone fixe, même s'il ne semble plus fonctionner.",
        },
        { id: 4, text: "", isTextField: true },
      ],
    },
    {
      id: 4,
      text: "What should you do if you are trapped under debris?",
      choices: [
        { id: 1, text: "Stay quiet and wait for help" },
        { id: 2, text: "Try to move as much as possible" },
        { id: 3, text: "Make noise to attract attention" },
        { id: 4, text: "", isTextField: true },
      ],
    },
    {
      id: 5,
      text: "What is the best way to stay informed during a disaster?",
      choices: [
        { id: 1, text: "Social media" },
        { id: 2, text: "Local news channels" },
        { id: 3, text: "Emergency alert systems" },
        { id: 4, text: "", isTextField: true },
      ],
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (questionId: number, answerText: string) => {
    setAnswers((prev) => {
      const updated = { ...prev, [questionId]: answerText };
      // If last question, set pendingFinish to true
      if (currentQuestionIndex === questions.length - 1) {
        setPendingFinish(true);
      }
      return updated;
    });

    // Move to next question if not at the end
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCustomAnswer("");
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
                      answerId: currentQuestion.id,
                      answerText: answers[currentQuestion.id],
                    }
                  : undefined
              }
              customAnswer={customAnswer}
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
