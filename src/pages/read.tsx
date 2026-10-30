"use client";

import "../app/globals.css";
import React, { useState, useEffect, useRef } from "react";
import { DarkMode, LightMode, Mic, Shuffle } from "@mui/icons-material";
import { getDatabase, ref, get } from "firebase/database";
import app from "../firebaseConfig";
import PopupMenu from "../components/PopupMenu";
import Mascot from "../components/Mascot";
import Decor from "../components/Decor";
import useThemeMode from "../lib/useThemeMode";
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
  const [themeMode, setThemeMode] = useThemeMode(); // mặc định tối
  const darkMode = themeMode === "dark";
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
    <>
      <Head>
        <title>Dưa Hấu</title>
        <link rel="icon" href="/duahau.png" />
      </Head>

      <div className="k-root k-page" data-theme={darkMode ? "dark" : "light"}>
        <Decor />
        <div className="k-shell k-page__shell">
          <header className="k-header">
            <div className="k-brand">
              <Mascot
                size={60}
                mood={score === null ? "happy" : score >= 80 ? "excited" : "sad"}
              />
              <div>
                <p className="k-eyebrow k-ko">따라 말해 보세요! 🎙️</p>
                <h1 className="k-h1">Luyện phát âm tiếng Hàn</h1>
              </div>
            </div>
            <div className="k-actions">
              {/* Nút chuyển sáng/tối */}
              <button
                onClick={() => setThemeMode(darkMode ? "light" : "dark")}
                className="k-btn k-btn--icon k-btn--butter"
                aria-label="Đổi giao diện sáng/tối"
              >
                {darkMode ? <LightMode /> : <DarkMode />}
              </button>
              <PopupMenu />
            </div>
          </header>

          <div className="k-panel">
            <p className="text-[14px] font-bold" style={{ color: "var(--k-muted)" }}>
              🔊 Hãy đọc to từ này
            </p>
            <p
              key={word}
              className="k-ko k-anim-pop my-[14px] leading-tight"
              style={{ fontSize: "clamp(44px, 10vw, 72px)" }}
            >
              {loading ? "Đang tải..." : word}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-[12px]">
            <button onClick={fetchRandomWord} className="k-btn k-btn--lav">
              <Shuffle /> Lấy từ ngẫu nhiên
            </button>

            <button
              onClick={handleRecord}
              disabled={loading}
              className="k-btn k-btn--pink"
            >
              <Mic /> Nói thử
            </button>
          </div>

          {userSpeech && (
            <div className="k-panel k-anim-rise flex flex-col items-center gap-[10px]">
              <span className="k-bubble">
                <strong>Bạn nói:</strong> <span className="k-ko">{userSpeech}</span>
              </span>
              {score !== null && (
                <>
                  <div className="w-full flex items-center gap-[12px]">
                    <strong className="text-[15px] whitespace-nowrap">Điểm chính xác:</strong>
                    <div className="k-progress flex-1">
                      <span
                        style={{
                          width: `${score}%`,
                          background:
                            score >= 80 ? "var(--k-mint-strong)" : "var(--k-pink-strong)",
                        }}
                      />
                    </div>
                  </div>
                  <p
                    className="k-anim-pop font-black text-[36px]"
                    style={{
                      color: score >= 80 ? "var(--k-mint-deep)" : "var(--k-pink-deep)",
                    }}
                  >
                    {score >= 80 ? `${score}% ✅` : `${score}% ❌`}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
