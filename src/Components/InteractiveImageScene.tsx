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

const RainContainer = styled("div")({
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  zIndex: 0,
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

// const RainDrop = styled("div")({
//   position: "absolute",
//   width: "2px",
//   background:
//     "linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.6))",
//   borderRadius: "50%",
//   pointerEvents: "none",
// });

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
  selectedAnswer?: string;
  customAnswer: string;
  setCustomAnswer: (text: string) => void;
  onCustomAnswerSubmit: () => void;
}

const DraggableCardsWrapper: React.FC<DraggableCardsWrapperProps> = ({
  choices,
  questionId,
  onAnswerSelect,
  selectedAnswer,
  customAnswer,
  setCustomAnswer,
  onCustomAnswerSubmit,
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
        initialCards={cards}
        onCardDrop={handleCardDrop}
        customText={hasTextField}
        customTextValue={customAnswer}
        onCustomTextChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setCustomAnswer(e.target.value)
        }
        onCustomTextSubmit={onCustomAnswerSubmit}
        selectedAnswer={selectedAnswer}
      />
    </div>
  );
};

const RainEffect = () => {
  useEffect(() => {
    const rainContainer = document.querySelector(".rain-container");
    if (!rainContainer) return;

    const createRainDrop = () => {
      const drop = document.createElement("div");
      drop.className = "rain-drop";

      // Random properties for natural look
      const size = Math.random() * 2 + 3; // Height between 3-5px
      const posX = Math.random() * 100; // Random horizontal position
      const duration = Math.random() * 0.5 + 0.7; // Animation duration
      const delay = Math.random() * 2; // Random start delay

      // Apply styles
      drop.style.cssText = `
        left: ${posX}%;
        height: ${size}px;
        animation: rainfall ${duration}s linear ${delay}s infinite;
      `;

      rainContainer.appendChild(drop);

      // Remove drops after they've fallen to avoid memory issues
      setTimeout(() => {
        if (drop.parentNode === rainContainer) {
          rainContainer.removeChild(drop);
        }
      }, (duration + delay) * 1000);
    };

    // Create initial raindrops
    for (let i = 0; i < 100; i++) {
      createRainDrop();
    }

    // Continue adding raindrops
    const interval = setInterval(() => {
      for (let i = 0; i < 5; i++) {
        createRainDrop();
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return <RainContainer className="rain-container" />;
};

const InteractiveImageScene: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: string }>({});
  const [customAnswer, setCustomAnswer] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the top of the content when the question changes
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth" });
    }
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
    setAnswers({
      ...answers,
      [questionId]: answerText,
    });

    // Move to next question if not at the end
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCustomAnswer("");
      }, 500);
    }
  };

  const handleCustomAnswerSubmit = () => {
    if (customAnswer.trim()) {
      handleAnswerSelect(currentQuestion.id, customAnswer);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
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
      <RainEffect />
      <ContentWrapper ref={contentRef}>
        <Paper
          elevation={3}
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
            // alternativeLabel
            connector={<ColorLibConnector />}
            sx={{ mb: 4 }}
          >
            {/* {questions.map((question, index) => ( */}
            {questions.map((question) => (
              <Step key={question.id}>
                <StepLabel></StepLabel>
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
              selectedAnswer={answers[currentQuestion.id]}
              customAnswer={customAnswer}
              setCustomAnswer={setCustomAnswer}
              onCustomAnswerSubmit={handleCustomAnswerSubmit}
            />
          </Box>

          {/* Navigation */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              variant="outlined"
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Précédent
            </Button>

            <Typography variant="body2" sx={{ alignSelf: "center" }}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Typography>

            {currentQuestionIndex === questions.length - 1 && (
              <Button
                variant="contained"
                color="success"
                onClick={handleFinish}
              >
                Terminer
              </Button>
            )}
          </Box>
        </Paper>
      </ContentWrapper>
    </SceneContainer>
  );
};

export default InteractiveImageScene;
