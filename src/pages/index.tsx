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
import {
  Dialog,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
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
          <FormControl
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme ? "#dfdfdf" : "#74747459",
              },
              "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#586de2",
                },
            }}
          >
            <InputLabel
              sx={{
                color: !theme ? "white !important" : "black !important", // Màu chữ mặc định
              }}
            >
              Chọn bài
            </InputLabel>
            <Select
              value={selectedValue}
              label="Chọn bài"
              onChange={handleChange}
              sx={{
                "& .MuiSelect-select": {
                  color: !theme ? "white !important" : "black !important",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: !theme ? "black" : "white", // Đặt màu nền cho menu là đen
                    border: theme ? "1px solid #dfdfdf" : "1px solid #74747459",
                    borderRadius: "10px",
                    color: "red",
                  },
                },
              }}
            >
              {list.map((item: any) => (
                <MenuItem
                  key={item.name}
                  value={item.name}
                  selected={selectedValue === item.name} // Đánh dấu item là selected
                  sx={{
                    backgroundColor:
                      selectedValue === item.name
                        ? theme
                          ? "black"
                          : "white"
                        : "", // Màu nền nếu item được chọn
                    color: !theme ? "white" : "black", // Màu chữ mặc định
                    "&:hover": {
                      backgroundColor:
                        selectedValue === item.name
                          ? theme
                            ? "black"
                            : "white"
                          : "", // Màu nền khi hover
                      color: "#586de2", // Màu chữ khi hover
                    },
                    "&.Mui-selected": {
                      backgroundColor: !theme
                        ? "black !important"
                        : "white !important ", // Màu nền cho item được chọn
                      color: "#586de2", // Màu chữ cho item được chọn
                    },
                  }}
                >
                  {item.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
            <div
              className={cx(
                "card",
                theme ? "border border-[#e7e7e7]" : "border border-[#161616]"
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
                </button>
                <button
                  onClick={(e) => handleSpeak(e, currentItems[0].koreanText)}
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
                theme ? "border border-[#e7e7e7]" : "border border-[#161616]"
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
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
