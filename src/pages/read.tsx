"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Paper,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { DarkMode, LightMode, Mic, Shuffle } from "@mui/icons-material";
import { getDatabase, ref, get } from "firebase/database";
import app from "../firebaseConfig";
import PopupMenu from "../components/PopupMenu";
import Head from "next/head";

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

export default function SpeakingPractice() {
  const [word, setWord] = useState<string>("증상");
  const [userSpeech, setUserSpeech] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(true); // mặc định tối
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef<any>(null);

  // ✅ Khởi tạo SpeechRecognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 👇 Khai báo mở rộng kiểu cho window
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = "ko-KR";
      }
    }
  }, []);

  // 🎨 Theme MUI
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: { main: darkMode ? "#90caf9" : "#1976d2" },
          background: {
            default: darkMode ? "#121212" : "#f5f5f5",
            paper: darkMode ? "#1e1e1e" : "#ffffff",
          },
        },
      }),
    [darkMode]
  );

  // 🔄 Lấy ngẫu nhiên 1 từ tiếng Hàn từ Firebase
  const fetchRandomWord = async () => {
    try {
      setLoading(true);

      const randomLesson = list[Math.floor(Math.random() * list.length)];
      const db = getDatabase(app);
      const snapshot = await get(ref(db, randomLesson.name));

      if (!snapshot.exists()) {
        alert(`${randomLesson.title} chưa có dữ liệu`);
        setLoading(false);
        return;
      }

      const data = Object.values(snapshot.val()) as any[];
      const randomWord = data[Math.floor(Math.random() * data.length)];

      setWord(randomWord.koreanText);
      setUserSpeech("");
      setScore(null);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Không thể tải từ ngẫu nhiên");
      setLoading(false);
    }
  };

  // 🎤 Ghi âm & nhận dạng
  const handleRecord = () => {
    if (!recognitionRef.current) {
      alert("Trình duyệt không hỗ trợ SpeechRecognition!");
      return;
    }

    const recognition = recognitionRef.current;
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      setUserSpeech(transcript);
      calculateScore(transcript);
    };

    recognition.onerror = (err: any) => {
      console.error(err);
      alert(
        "Không thể nhận giọng nói. Hãy kiểm tra micro hoặc quyền truy cập!"
      );
    };
  };

  // 🧮 Tính điểm chính xác
  const calculateScore = (transcript: string) => {
    const target = word.trim();
    const similarity = compareStrings(target, transcript);
    setScore(similarity);
  };

  // 🔢 So sánh 2 chuỗi (đơn giản)
  const compareStrings = (a: string, b: string) => {
    const len = Math.max(a.length, b.length);
    let same = 0;
    for (let i = 0; i < len; i++) if (a[i] === b[i]) same++;
    return Math.round((same / len) * 100);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>Dưa Hấu</title>
        <link rel="icon" href="/duahau.png" />
      </Head>

      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <PopupMenu />
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          {/* Nút chuyển sáng/tối */}
          <div style={{ textAlign: "right" }}>
            <IconButton onClick={() => setDarkMode((p) => !p)}>
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </div>

          <Typography variant="h5" align="center" gutterBottom>
            🗣️ Luyện phát âm tiếng Hàn
          </Typography>

          <Typography
            variant="h3"
            align="center"
            sx={{ my: 3, fontWeight: "bold" }}
          >
            {loading ? "Đang tải..." : word}
          </Typography>

          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <Button
              variant="outlined"
              startIcon={<Shuffle />}
              onClick={fetchRandomWord}
              sx={{ mr: 2 }}
            >
              Lấy từ ngẫu nhiên
            </Button>

            <Button
              variant="contained"
              color="primary"
              startIcon={<Mic />}
              onClick={handleRecord}
              disabled={loading}
            >
              Nói thử
            </Button>
          </div>

          {userSpeech && (
            <>
              <Typography align="center">
                <strong>Bạn nói:</strong> {userSpeech}
              </Typography>
              <Typography align="center" sx={{ mt: 1 }}>
                <strong>Điểm chính xác:</strong>{" "}
                {score !== null &&
                  (score >= 80 ? (
                    <span style={{ color: "lightgreen" }}>{score}% ✅</span>
                  ) : (
                    <span style={{ color: "salmon" }}>{score}% ❌</span>
                  ))}
              </Typography>
            </>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
