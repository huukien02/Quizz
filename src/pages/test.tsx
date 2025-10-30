"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { getDatabase, ref, get } from "firebase/database";
import app from "../firebaseConfig";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";
import PopupMenu from '../components/PopupMenu'

const list = [
  { name: "bai-1", title: "Bài 1" },
  { name: "bai-2", title: "Bài 2" },
  { name: "bai-3", title: "Bài 3" },
  { name: "bai-4", title: "Bài 4" },
  { name: "bai-5", title: "Bài 5" },
  { name: "bai-6", title: "Bài 6" },
  { name: "bai-7", title: "Bài 7" },
  { name: "bai-8", title: "Bài 8" },
  { name: "bai-9", title: "Bài 9" },
];

const TOTAL_QUESTIONS = 10;
const TIME_PER_QUESTION = 20;

interface Question {
  koreanText: string;
  vietnameseText: string;
  options: string[];
  correctAnswer: string;
}

const TestPage = () => {
  const [selectedLesson, setSelectedLesson] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [finished, setFinished] = useState(false);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLesson = async (lesson: string) => {
    setLoading(true);
    const db = getDatabase(app);
    const snapshot = await get(ref(db, lesson));

    if (!snapshot.exists()) {
      setQuestions([]);
      setLoading(false);
      toast.warn("Bài này chưa có từ khóa nào");
      return;
    }

    const data = Object.values(snapshot.val()) as any[];

    if (data.length < TOTAL_QUESTIONS) {
      setQuestions([]);
      setLoading(false);
      toast.warn(
        `Bài này chỉ có ${data.length} từ, cần ít nhất ${TOTAL_QUESTIONS} để tạo bài test!`
      );
      return;
    }

    const shuffle = (arr: any[]) => arr.sort(() => Math.random() - 0.5);

    const generated: Question[] = [];
    const shuffledData = shuffle([...data]).slice(0, TOTAL_QUESTIONS);

    for (let word of shuffledData) {
      const wrongAnswers = shuffle(
        data
          .filter((x) => x.koreanText !== word.koreanText)
          .map((x) => x.vietnameseText)
      ).slice(0, 3);

      const options = shuffle([...wrongAnswers, word.vietnameseText]);

      generated.push({
        koreanText: word.koreanText,
        vietnameseText: word.vietnameseText,
        options,
        correctAnswer: word.vietnameseText,
      });
    }

    setQuestions(generated);
    setLoading(false);
    setCurrentIndex(0);
    setScore(0);
    setFinished(false);
    setTimeLeft(TIME_PER_QUESTION);
  };

  const handleAnswer = (answer: string) => {
    const current = questions[currentIndex];
    if (answer === current.correctAnswer) {
      setScore((prev) => prev + 1);
    }
    nextQuestion();
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < TOTAL_QUESTIONS) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(TIME_PER_QUESTION);
    } else {
      setFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (!questions.length || finished) return;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          nextQuestion();
          return TIME_PER_QUESTION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, questions, finished]);

  const theme = createTheme({
    palette: {
      mode: themeMode,
      ...(themeMode === "dark"
        ? {
            background: {
              default: "#121212",
              paper: "#1e1e1e",
            },
          }
        : {}),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>Dưa Hấu</title>
        <link rel="icon" href="/duahau.png" />
      </Head>

      <Box sx={{ maxWidth: 600, mx: "auto", mt: 5, textAlign: "center" }}>
        <PopupMenu />
        <Typography variant="h5" gutterBottom>
          🧠 Kiểm tra từ vựng tiếng Hàn
          {/* Nút đổi theme */}
          <IconButton
            onClick={() =>
              setThemeMode(themeMode === "light" ? "dark" : "light")
            }
            // sx={{ position: "absolute", top: 16, right: 16 }}
            color="inherit"
          >
            {themeMode === "light" ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Chọn bài</InputLabel>
          <Select
            value={selectedLesson}
            label="Chọn bài"
            onChange={(e) => {
              const lesson = e.target.value;
              setSelectedLesson(lesson);
              fetchLesson(lesson);
            }}
          >
            {list.map((item) => (
              <MenuItem key={item.name} value={item.name}>
                {item.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {loading && <CircularProgress />}

        {!loading && questions.length > 0 && !finished && (
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6">
                Câu {currentIndex + 1}/{TOTAL_QUESTIONS}
              </Typography>
              <Typography variant="h4" sx={{ my: 2 }}>
                {questions[currentIndex].koreanText}
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Thời gian còn lại: {timeLeft}s
              </Typography>

              {questions[currentIndex].options.map((opt) => (
                <Button
                  key={opt}
                  variant="outlined"
                  fullWidth
                  sx={{ my: 1 }}
                  onClick={() => handleAnswer(opt)}
                >
                  {opt}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {finished && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              🎉 Hoàn thành bài test!
            </Typography>
            <Typography variant="h6">
              Điểm của bạn: {score}/{TOTAL_QUESTIONS}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => fetchLesson(selectedLesson)}
            >
              Làm lại
            </Button>
          </Box>
        )}
      </Box>

      <ToastContainer />
    </ThemeProvider>
  );
};

export default TestPage;
