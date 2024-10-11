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
import { MdOutlineDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { LiaRandomSolid } from "react-icons/lia";
import KoreanMatchingGame from "./game";
import Head from "next/head";
import Add from "./add";
import { getDatabase, ref, get, push } from "firebase/database";
import app from "../firebaseConfig";
import { FaPlus } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const cx = classNames.bind(styles);

export default function Index() {
  const [open, setOpen] = useState(false);

  const [currentMenu, setCurrentMenu] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [suggest, setSuggest] = useState(false);
  const [theme, setTheme] = useState(false);

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
      const dbRef = ref(db, "texts");
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        setDataTexts(Object.values(snapshot.val()));
      } else {
        alert("error");
      }
    };
    fetchData();
  }, [open]);

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

      <div
        className={cx(
          "ctn",
          theme ? "bg-[#fff] text-[black]" : "bg-[black] text-[#fff]"
        )}
      >
        <div className={cx("w")}>
          <h1 className={cx("title")}>
            <span className="flex items-center gap-[10px]">
              Từ vựng tiếng Hàn{" "}
              <FaPlus
                onClick={() => setOpen(true)}
                className="text-[blue] cursor-pointer"
                size={25}
              />
            </span>
            <button
              onClick={() => {
                setTheme(!theme);
              }}
            >
              {theme ? <MdOutlineDarkMode /> : <CiLight />}
            </button>
          </h1>
          <div className={cx("menu")}>
            <div
              onClick={() => setCurrentMenu(0)}
              className={cx(
                "item",
                theme ? "bg-[#eaeaf5]" : "border border-[#161616] "
              )}
            >
              <BiSolidCopy className="text-[blue]" size={25} />
              <span>Lật Thẻ</span>
            </div>

            <div
              onClick={() => setCurrentMenu(1)}
              className={cx(
                "item",
                theme ? "bg-[#eaeaf5]" : "border border-[#161616] "
              )}
            >
              <IoLogoGameControllerB className="text-[blue]" size={25} />
              <span>Chơi game</span>
            </div>
          </div>
          {currentMenu == 0 && (
            <>
              <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
                <div
                  className={cx(
                    "card",
                    theme
                      ? "border border-[#e7e7e7]"
                      : "border border-[#161616]"
                  )}
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <div className={cx("header")}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSuggest(!suggest);
                      }}
                      className={cx("btn")}
                    >
                      <FcIdea size={20} />
                      {/* {!suggest
                        ? "Hiển thị gợi ý"
                        : currentCard.vietnameseText
                        ? currentCard.vietnameseText[0] +
                          "*".repeat(currentCard.vietnameseText.length - 1)
                        : ""} */}
                    </button>
                    <button
                      onClick={(e) =>
                        handleSpeak(e, currentItems[0].koreanText)
                      }
                      className={cx("btn")}
                    >
                      <GiSpeaker size={20} />
                    </button>
                  </div>
                  <div className={cx("body")}>
                    <span className={cx("korean-text")}>
                      {currentItems[0] && currentItems[0].koreanText}
                    </span>
                  </div>
                </div>
                <div
                  className={cx(
                    "card",
                    theme
                      ? "border border-[#e7e7e7]"
                      : "border border-[#161616]"
                  )}
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  <div className={cx("header")}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSuggest(!suggest);
                      }}
                      className={cx("btn")}
                    >
                      <FcIdea size={20} />
                      {!suggest
                        ? "Hiển thị gợi ý"
                        : currentItems[0].vietnameseText
                        ? currentItems[0].vietnameseText[0] +
                          "*".repeat(currentItems[0].vietnameseText.length - 1)
                        : ""}
                    </button>
                    <button
                      onClick={(e) =>
                        handleSpeak(e, currentItems[0].vietnameseText)
                      }
                      className={cx("btn")}
                    >
                      <GiSpeaker size={20} />
                    </button>
                  </div>
                  <div className={cx("body")}>
                    <span className={cx("korean-text")}>
                      {currentItems[0] && currentItems[0].vietnameseText}
                    </span>
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
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: theme ? "black" : "white", // Thay đổi màu chữ tại đây
                    },
                  }}
                />
                <button onClick={handleShuffle}>
                  <LiaRandomSolid size={25} />
                </button>
              </div>
            </>
          )}
          {currentMenu == 1 && <KoreanMatchingGame />}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
