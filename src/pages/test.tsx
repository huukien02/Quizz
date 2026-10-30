"use client";
import "../app/globals.css";
import React, { useState, useEffect, useRef } from "react";
import { getDatabase, ref, get } from "firebase/database";
import app from "../firebaseConfig";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import { DarkMode, LightMode } from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";
import PopupMenu from '../components/PopupMenu'
import Mascot from "../components/Mascot";
import Decor from "../components/Decor";
import useThemeMode from "../lib/useThemeMode";

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

const CONFETTI_COLORS = ["#5CC9A7", "#FF8FAB", "#A58BFF", "#FFD15C", "#8FD3FF"];

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
  const [themeMode, setThemeMode] = useThemeMode();

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

  // Vòng đồng hồ đếm ngược
  const RADIUS = 22;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const isWarn = timeLeft <= 5;

  return (
    <>
      <Head>
        <title>Dưa Hấu</title>
        <link rel="icon" href="/duahau.png" />
      </Head>

      <div className="k-root k-page" data-theme={themeMode}>
        <Decor />
        <div className="k-shell k-page__shell">
          <header className="k-header">
            <div className="k-brand">
              <Mascot
                size={60}
                mood={
                  finished
                    ? score >= TOTAL_QUESTIONS / 2
                      ? "excited"
                      : "sad"
                    : "happy"
                }
              />
              <div>
                <p className="k-eyebrow k-ko">시험 시간! 📝</p>
                <h1 className="k-h1">Kiểm tra từ vựng tiếng Hàn</h1>
              </div>
            </div>
            <div className="k-actions">
              {/* Nút đổi theme */}
              <button
                onClick={() =>
                  setThemeMode(themeMode === "light" ? "dark" : "light")
                }
                className="k-btn k-btn--icon k-btn--butter"
                aria-label="Đổi giao diện sáng/tối"
              >
                {themeMode === "light" ? <DarkMode /> : <LightMode />}
              </button>
              <PopupMenu />
            </div>
          </header>

          <div className="k-lessons">
            {list.map((item) => (
              <button
                key={item.name}
                className={`k-chip ${selectedLesson === item.name ? "is-active" : ""}`}
                onClick={() => {
                  const lesson = item.name;
                  if (lesson === selectedLesson) return;
                  setSelectedLesson(lesson);
                  fetchLesson(lesson);
                }}
              >
                📘 {item.title}
              </button>
            ))}
          </div>

          {loading && (
            <div className="k-empty">
              <Mascot size={90} className="k-anim-bounce" />
              Đang chuẩn bị câu hỏi...
            </div>
          )}

          {!loading && !finished && questions.length === 0 && (
            <div className="k-empty">
              <Mascot size={100} mood={selectedLesson ? "sad" : "happy"} />
              <span className="k-bubble">
                {selectedLesson
                  ? "Bài này chưa đủ từ để làm test 😢"
                  : "Chọn một bài để bắt đầu nhé! 🎯"}
              </span>
            </div>
          )}

          {!loading && questions.length > 0 && !finished && (
            <div className="flex flex-col gap-[18px]">
              <div className="flex items-center gap-[14px]">
                <div className="flex-1 flex flex-col gap-[8px]">
                  <span className="font-extrabold text-[15px]">
                    Câu {currentIndex + 1}/{TOTAL_QUESTIONS}
                  </span>
                  <div className="k-progress">
                    <span
                      style={{
                        width: `${((currentIndex + 1) / TOTAL_QUESTIONS) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div
                  className={`k-timer ${isWarn ? "is-warn" : ""}`}
                  title="Thời gian còn lại"
                >
                  <svg width="54" height="54" viewBox="0 0 54 54">
                    <circle cx="27" cy="27" r={RADIUS} fill="none" stroke="var(--k-line)" strokeWidth="6" />
                    <circle
                      cx="27"
                      cy="27"
                      r={RADIUS}
                      fill="none"
                      stroke={isWarn ? "var(--k-pink-strong)" : "var(--k-mint-strong)"}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={
                        CIRCUMFERENCE * (1 - timeLeft / TIME_PER_QUESTION)
                      }
                    />
                  </svg>
                  <span style={{ color: isWarn ? "var(--k-pink-deep)" : "inherit" }}>
                    {timeLeft}s
                  </span>
                </div>
              </div>

              <div className="k-panel">
                <p className="text-[14px] font-bold" style={{ color: "var(--k-muted)" }}>
                  Từ này nghĩa là gì?
                </p>
                <p
                  key={currentIndex}
                  className="k-ko k-anim-pop my-[10px] leading-tight"
                  style={{ fontSize: "clamp(38px, 8vw, 56px)" }}
                >
                  {questions[currentIndex].koreanText}
                </p>
              </div>

              <div className="k-options" key={`opts-${currentIndex}`}>
                {questions[currentIndex].options.map((opt, i) => (
                  <button
                    key={opt}
                    className="k-option"
                    style={{ animationDelay: `${i * 0.06}s` }}
                    onClick={() => handleAnswer(opt)}
                  >
                    <span className="k-option__key">{"ABCD"[i]}</span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {finished && (
            <div className="k-panel relative overflow-hidden flex flex-col items-center gap-[10px]">
              {score >= TOTAL_QUESTIONS / 2 && (
                <div className="k-confetti" aria-hidden="true">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <i
                      key={i}
                      style={{
                        left: `${(i * 37) % 100}%`,
                        background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                        animationDelay: `${(i % 6) * 0.35}s`,
                      }}
                    />
                  ))}
                </div>
              )}
              <Mascot
                size={110}
                mood={score >= TOTAL_QUESTIONS / 2 ? "excited" : "sad"}
              />
              <h2 className="k-ko text-[26px]">
                {score >= TOTAL_QUESTIONS / 2 ? "잘했어요! 🎉" : "괜찮아요! 💪"}
              </h2>
              <p className="font-extrabold text-[18px]">Hoàn thành bài test!</p>
              <p
                className="k-anim-pop font-black"
                style={{ fontSize: 44, color: "var(--k-mint-deep)" }}
              >
                {score}/{TOTAL_QUESTIONS}
              </p>
              <button
                className="k-btn k-btn--pink relative"
                onClick={() => fetchLesson(selectedLesson)}
              >
                Làm lại
              </button>
            </div>
          )}
        </div>
      </div>

      <ToastContainer theme={themeMode} />
    </>
  );
};

export default TestPage;
