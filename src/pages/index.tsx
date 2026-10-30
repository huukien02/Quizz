import "../app/globals.css";
import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
import { BiSolidCopy } from "react-icons/bi";
import { IoLogoGameControllerB } from "react-icons/io";
import { FcIdea } from "react-icons/fc";
import { GiSpeaker } from "react-icons/gi";
import ReactCardFlip from "react-card-flip";
import Pagination from "@mui/material/Pagination";
import { DarkMode, LightMode } from "@mui/icons-material";
import { LiaRandomSolid } from "react-icons/lia";
import KoreanMatchingGame from "./game";
import Head from "next/head";
import Add from "./add";
import { getDatabase, ref, get, push } from "firebase/database";
import app from "../firebaseConfig";
import { FaPlus } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PopupMenu from '../components/PopupMenu'
import Mascot from "../components/Mascot";
import Decor from "../components/Decor";
import useThemeMode from "../lib/useThemeMode";
const cx = classNames.bind(styles);

export const list = [
  {
    name: "bai-1",
    title: "Bài 1",
  },
  {
    name: "bai-2",
    title: "Bài 2",
  },
  {
    name: "bai-3",
    title: "Bài 3",
  },
  {
    name: "bai-4",
    title: "Bài 4",
  },
  {
    name: "bai-5",
    title: "Bài 5",
  },
  {
    name: "bai-6",
    title: "Bài 6",
  },
  {
    name: "bai-7",
    title: "Bài 7",
  },
  {
    name: "bai-8",
    title: "Bài 8",
  },
  {
    name: "bai-9",
    title: "Bài 9",
  },
];
export default function Index() {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(list[0].name);

  const [currentMenu, setCurrentMenu] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [suggest, setSuggest] = useState(false);
  const [themeMode, setThemeMode] = useThemeMode();
  const theme = themeMode === "light";
  const setTheme = (light: boolean) => setThemeMode(light ? "light" : "dark");

  const handleSpeak = (e: any, text: string) => {
    e.stopPropagation();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isFlipped ? "vi-VN" : "ko-KR"; // Đặt ngôn ngữ dựa trên giá trị của isFlipped
    window.speechSynthesis.speak(utterance);
  };

  const [dataTexts, setDataTexts] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 1; // Số lượng phần tử mỗi trang

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase(app);
      const dbRef = ref(db, selectedValue);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        setDataTexts(Object.values(snapshot.val()));
      } else {
        toast.warn("Bài này chưa có từ khóa nào");
      }
    };
    fetchData();
  }, [open, selectedValue]);

  // Tính toán chỉ số của phần tử hiện tại dựa vào trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage; // Chỉ số của phần tử cuối cùng
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // Chỉ số của phần tử đầu tiên
  const currentItems = dataTexts.slice(indexOfFirstItem, indexOfLastItem); // Lấy phần tử hiện tại

  // Phân trang

  const shuffleArray = (array: any) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleShuffle = () => {
    const shuffledData = shuffleArray([...dataTexts]); // Tạo một bản sao và xáo trộn
    setDataTexts(shuffledData); // Cập nhật state với mảng xáo trộn
  };

  const handleChange = (event: any) => {
    setSelectedValue(event.target.value);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement).tagName.toLowerCase();
      if (tag === "input" || tag === "textarea") return; // Không hoạt động khi đang nhập

      if (
        event.key === "ArrowRight" &&
        currentPage < Math.ceil(dataTexts.length / itemsPerPage)
      ) {
        setCurrentPage((prev) => prev + 1);
      } else if (event.key === "ArrowLeft" && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else if (event.key === "Enter") {
        setIsFlipped((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentPage, dataTexts.length]);

  return (
    <>
      <Head>
        <title>Dưa Hấu</title>
        <meta
          name="description"
          content="Đây là mô tả cho trang chủ của ứng dụng Next.js"
        />
        <link rel="icon" href="/duahau.png" />
      </Head>
      <Add open={open} setOpen={setOpen} />

      <div className={cx("ctn", "k-root")} data-theme={theme ? "light" : "dark"}>
        <Decor />
        <div className={cx("w", "k-shell")}>
          <header className={cx("title")}>
            <div className={cx("brand")}>
              <Mascot size={64} mood={isFlipped ? "excited" : "happy"} />
              <div>
                <p className={cx("hello", "k-ko")}>안녕하세요! 오늘도 화이팅 💪</p>
                <h1 className={cx("heading")}>Từ vựng tiếng Hàn</h1>
              </div>
            </div>
            <div className={cx("actions")}>
              <button
                onClick={() => setOpen(true)}
                className="k-btn k-btn--icon"
                aria-label="Thêm từ mới"
                title="Thêm từ mới"
              >
                <FaPlus size={18} />
              </button>
              <button
                onClick={() => {
                  setTheme(!theme);
                }}
                className="k-btn k-btn--icon k-btn--butter"
                aria-label="Đổi giao diện sáng/tối"
                title="Đổi giao diện"
              >
                {theme ? <DarkMode /> : <LightMode />}
              </button>
              <PopupMenu />
            </div>
          </header>

          <div className={cx("lessons")}>
            {list.map((item: any) => (
              <button
                key={item.name}
                className={cx("k-chip", { "is-active": selectedValue === item.name })}
                onClick={() => handleChange({ target: { value: item.name } })}
              >
                📘 {item.title}
              </button>
            ))}
          </div>

          <div className={cx("progress-row")}>
            <span>
              Thẻ {dataTexts.length ? currentPage : 0}/
              {Math.ceil(dataTexts.length / itemsPerPage)}
            </span>
            <div className={cx("bar", "k-progress")}>
              <span
                style={{
                  width: `${
                    dataTexts.length
                      ? Math.min(100, (currentPage / Math.ceil(dataTexts.length / itemsPerPage)) * 100)
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
            <div
              className={cx("card", "card--front")}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className={cx("header")}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSuggest(!suggest);
                  }}
                  className={cx("btn", "k-chip")}
                >
                  <FcIdea size={20} />
                  <span>
                    {!suggest
                      ? "Hiển thị gợi ý"
                      : currentItems[0].vietnameseText
                      ? currentItems[0].vietnameseText.replace(
                          /\S/g,
                          (char: any, index: any) => {
                            // Check if the character is the first character of a word
                            return index === 0 ||
                              currentItems[0].vietnameseText[index - 1] === " "
                              ? char // Return the character if it's the first character of a word
                              : "*"; // Replace with '*' otherwise
                          }
                        )
                      : ""}
                  </span>
                </button>
                <button
                  onClick={(e) => handleSpeak(e, currentItems[0].koreanText)}
                  className="k-btn k-btn--icon"
                  aria-label="Nghe phát âm"
                >
                  <GiSpeaker size={24} />
                </button>
              </div>
              <div className={cx("body")}>
                <span className={cx("lang-tag", "k-ko")}>한국어</span>
                <span
                  key={`ko-${currentPage}-${selectedValue}`}
                  className={cx("korean-text", "k-ko", "k-anim-pop")}
                >
                  {currentItems[0] && currentItems[0].koreanText}
                </span>
                <span className={cx("tap-hint")}>Chạm để lật thẻ 👆</span>
              </div>
            </div>
            <div
              className={cx("card", "card--back")}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className={cx("header")}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSuggest(!suggest);
                  }}
                  className={cx("btn", "k-chip")}
                >
                  <FcIdea size={20} />
                  <span>
                    {!suggest
                      ? "Hiển thị gợi ý"
                      : currentItems[0].koreanText
                      ? currentItems[0].koreanText.replace(
                          /\S/g,
                          (char: any, index: any) => {
                            // Check if the character is the first character of a word
                            return index === 0 ||
                              currentItems[0].koreanText[index - 1] === " "
                              ? char // Return the character if it's the first character of a word
                              : "*"; // Replace with '*' otherwise
                          }
                        )
                      : ""}
                  </span>
                </button>
                <button
                  onClick={(e) =>
                    handleSpeak(e, currentItems[0].vietnameseText)
                  }
                  className="k-btn k-btn--icon k-btn--pink"
                  aria-label="Nghe phát âm"
                >
                  <GiSpeaker size={24} />
                </button>
              </div>
              <div className={cx("body")}>
                <span className={cx("lang-tag")}>Tiếng Việt</span>
                <span
                  key={`vi-${currentPage}-${selectedValue}`}
                  className={cx("korean-text", "k-anim-pop")}
                >
                  {currentItems[0] && currentItems[0].vietnameseText}
                </span>
                <span className={cx("tap-hint")}>Chạm để lật lại 👆</span>
              </div>
            </div>
          </ReactCardFlip>

          <div className={cx("page")}>
            <Pagination
              count={Math.ceil(dataTexts.length / itemsPerPage)}
              page={currentPage}
              onChange={(e, value) => {
                setIsFlipped(false);
                setCurrentPage(value);
              }}
              variant="outlined"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "var(--k-ink)",
                  borderColor: "var(--k-line)",
                  borderWidth: 2,
                  borderRadius: "12px",
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 800,
                  backgroundColor: "var(--k-surface-2)",
                  transition: "transform .15s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    backgroundColor: "var(--k-mint)",
                  },
                },
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: "var(--k-mint-strong)",
                  borderColor: "var(--k-mint-strong)",
                  color: "#fff",
                  boxShadow: "0 3px 0 var(--k-mint-deep)",
                  "&:hover": { backgroundColor: "var(--k-mint-strong)" },
                },
                "& .MuiPaginationItem-ellipsis": {
                  border: "none",
                  backgroundColor: "transparent",
                },
                "@media (max-width: 640px)": {
                  "& .MuiPaginationItem-root": {
                    minWidth: 28,
                    height: 28,
                    margin: "0 2px",
                    padding: 0,
                    fontSize: 13,
                  },
                },
              }}
            />
            <button onClick={handleShuffle} className="k-btn k-btn--lav">
              <LiaRandomSolid size={22} /> Trộn thẻ
            </button>
          </div>
          <p className={cx("keys")}>⌨️ ← → chuyển thẻ · Enter lật thẻ</p>
        </div>
      </div>
      <ToastContainer theme={theme ? "light" : "dark"} />
    </>
  );
}

