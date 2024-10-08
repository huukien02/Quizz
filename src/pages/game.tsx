import React, { useState } from "react";

// Định nghĩa kiểu dữ liệu cho một thẻ bài
interface Card {
  koreanText: string;
  vietnameseText: string;
}

// Khai báo dữ liệu thẻ bài
const cards: Card[] = [
  {
    koreanText: "태양",
    vietnameseText: "Mặt trời",
  },
  {
    koreanText: "달",
    vietnameseText: "Mặt trăng",
  },
  {
    koreanText: "산",
    vietnameseText: "Ngọn núi",
  },
  {
    koreanText: "사람",
    vietnameseText: "Người",
  },
  {
    koreanText: "물",
    vietnameseText: "Nước",
  },
  {
    koreanText: "나무",
    vietnameseText: "Cây",
  },
//   {
//     koreanText: "꽃",
//     vietnameseText: "Hoa",
//   },
//   {
//     koreanText: "바다",
//     vietnameseText: "Biển",
//   },
  //   {
  //     koreanText: "하늘",
  //     vietnameseText: "Bầu trời",
  //   },
  //   {
  //     koreanText: "집",
  //     vietnameseText: "Nhà",
  //   },
  //   {
  //     koreanText: "자동차",
  //     vietnameseText: "Xe hơi",
  //   },
  //   {
  //     koreanText: "학교",
  //     vietnameseText: "Trường học",
  //   },
  //   {
  //     koreanText: "친구",
  //     vietnameseText: "Bạn bè",
  //   },
  //   {
  //     koreanText: "책",
  //     vietnameseText: "Sách",
  //   },
  //   {
  //     koreanText: "음악",
  //     vietnameseText: "Âm nhạc",
  //   },
  //   {
  //     koreanText: "사랑",
  //     vietnameseText: "Tình yêu",
  //   },
  //   {
  //     koreanText: "행복",
  //     vietnameseText: "Hạnh phúc",
  //   },
  //   {
  //     koreanText: "슬픔",
  //     vietnameseText: "Nỗi buồn",
  //   },
  //   {
  //     koreanText: "지구",
  //     vietnameseText: "Trái đất",
  //   },
  //   {
  //     koreanText: "돈",
  //     vietnameseText: "Tiền",
  //   },
  //   {
  //     koreanText: "음식",
  //     vietnameseText: "Thức ăn",
  //   },
];

// Định nghĩa kiểu dữ liệu cho state
const KoreanMatchingGame: React.FC = () => {
  const [selectedVietnamese, setSelectedVietnamese] = useState<string | null>(
    null
  );
  const [selectedKorean, setSelectedKorean] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Card[]>(cards); // Tất cả thẻ ban đầu

  // Hàm xử lý khi nhấn vào từ tiếng Việt
  const handleVietnameseClick = (vietnameseText: string) => {
    if (selectedKorean) {
      checkMatch(vietnameseText, selectedKorean);
    } else {
      setSelectedVietnamese(vietnameseText);
    }
  };

  // Hàm xử lý khi nhấn vào từ tiếng Hàn
  const handleKoreanClick = (koreanText: string) => {
    if (selectedVietnamese) {
      checkMatch(selectedVietnamese, koreanText);
    } else {
      setSelectedKorean(koreanText);
    }
  };

  // Hàm kiểm tra nếu có cặp khớp
  const checkMatch = (vietnameseText: string, koreanText: string) => {
    const matchedCard = cards.find(
      (card) =>
        card.vietnameseText === vietnameseText && card.koreanText === koreanText
    );

    if (matchedCard) {
      // Nếu có cặp khớp, xóa khỏi mảng matchedPairs
      setMatchedPairs((prevPairs) =>
        prevPairs.filter((card) => card !== matchedCard)
      );
    }

    // Reset lựa chọn
    setSelectedVietnamese(null);
    setSelectedKorean(null);
  };

  return (
    <div className="flex flex-col gap-[10px] h-[500px] items-center justify-center">
      <h2 className="text-2xl mb-4">Ghép từ Tiếng Việt và Tiếng Hàn</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {matchedPairs.map((card, index) => (
          <div
            key={index}
            className={`flex items-center justify-center w-24 h-24 border rounded-lg cursor-pointer 
              ${
                selectedVietnamese === card.vietnameseText
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
            onClick={() => handleVietnameseClick(card.vietnameseText)}
          >
            <p className="text-lg">{card.vietnameseText}</p>
          </div>
        ))}
        {matchedPairs.map((card, index) => (
          <div
            key={index}
            className={`flex items-center justify-center w-24 h-24 border rounded-lg cursor-pointer 
              ${
                selectedKorean === card.koreanText
                  ? "border-blue-500"
                  : "border-gray-300"
              }`}
            onClick={() => handleKoreanClick(card.koreanText)}
          >
            <p className="text-lg">{card.koreanText}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KoreanMatchingGame;
