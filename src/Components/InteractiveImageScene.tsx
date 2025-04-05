import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Paper,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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

const InteractiveImageScene: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: string }>({});
  const [customAnswer, setCustomAnswer] = useState<string>("");

  // Mock data for questions
  // ![TODO] Replace with actual data fetching logic (questions from API)
  const questions: Question[] = [
    {
      id: 1,
      text: "Vous vivez dans une maison près d'une rivière, une zone connue pour être inondable. La météo annonce de fortes pluies depuis plusieurs jours. Vous recevez une alerte officielle (Vigicrues / Météo-France / FR-Alert) : risque imminent de crue et d'inondation.",
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
    // {
    //   id: 4,
    //   text: "What should you do if you are trapped under debris?",
    //   choices: [
    //     { id: 1, text: "Stay quiet and wait for help" },
    //     { id: 2, text: "Try to move as much as possible" },
    //     { id: 3, text: "Make noise to attract attention" },
    //     { id: 4, text: "", isTextField: true },
    //   ],
    // },
    // {
    //   id: 5,
    //   text: "What is the best way to stay informed during a disaster?",
    //   choices: [
    //     { id: 1, text: "Social media" },
    //     { id: 2, text: "Local news channels" },
    //     { id: 3, text: "Emergency alert systems" },
    //     { id: 4, text: "", isTextField: true },
    //   ],
    // },
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
    // Navigate to a results page with both answers and questions in the state
    navigate("/results", {
      state: {
        answers,
        questions: questions.map((q) => ({ id: q.id, text: q.text })), // Only send necessary data
      },
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, borderRadius: 2, maxWidth: 800, mx: "auto" }}
    >
      {/* Question Stepper/Timeline */}
      <Stepper
        activeStep={currentQuestionIndex}
        alternativeLabel
        sx={{ mb: 4 }}
      >
        {questions.map((question, index) => (
          <Step key={question.id}>
            <StepLabel>Question {index + 1}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Current Question */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          {currentQuestion.text}
        </Typography>
      </Box>

      {/* Answer Choices */}
      <Grid container spacing={2} justifyContent="center">
        {currentQuestion.choices.map((choice) => (
          <Grid key={choice.id}>
            {choice.isTextField ? (
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Your own answer:
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    placeholder="Type your answer here..."
                    value={customAnswer}
                    onChange={(e) => setCustomAnswer(e.target.value)}
                  />
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleCustomAnswerSubmit}
                    disabled={!customAnswer.trim()}
                  >
                    Submit
                  </Button>
                </Box>
              </Card>
            ) : (
              <Card
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": { transform: "scale(1.02)", boxShadow: 3 },
                  bgcolor:
                    answers[currentQuestion.id] === choice.text
                      ? "primary.light"
                      : "background.paper",
                }}
                onClick={() =>
                  handleAnswerSelect(currentQuestion.id, choice.text)
                }
              >
                <CardContent>
                  <Typography variant="body1" align="center" sx={{ p: 2 }}>
                    {choice.text}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        ))}
      </Grid>

      {/* Navigation */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button
          variant="outlined"
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <Typography variant="body2" sx={{ alignSelf: "center" }}>
          Question {currentQuestionIndex + 1} of {questions.length}
        </Typography>

        {currentQuestionIndex === questions.length - 1 && (
          <Button variant="contained" color="success" onClick={handleFinish}>
            Finish
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default InteractiveImageScene;
