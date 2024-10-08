import "../app/globals.css";
import React, { useState } from "react";
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

const cx = classNames.bind(styles);

const cards = [
  {
    koreanText: "태양",
    vietnameseText: "Mặt trời",
    explanation:
      "Chữ 태양 có các nét dọc và ngang, tạo nên hình ảnh của mặt trời chiếu sáng.",
    example: [
      "태양빛 (ánh sáng mặt trời)",
      "태양계 (hệ mặt trời)",
      "태양광 (năng lượng mặt trời)",
    ],
  },
  {
    koreanText: "달",
    vietnameseText: "Mặt trăng",
    explanation: "Chữ 달 thể hiện hình ảnh của mặt trăng sáng trên bầu trời.",
    example: ["달빛 (ánh sáng mặt trăng)", "달력 (lịch)", "달팽이 (ốc sên)"],
  },
  {
    koreanText: "별",
    vietnameseText: "Ngôi sao",
    explanation: "Chữ 별 tượng trưng cho những ngôi sao sáng trên bầu trời.",
    example: [
      "별빛 (ánh sáng ngôi sao)",
      "별자리 (chòm sao)",
      "별명 (biệt danh)",
    ],
  },
  {
    koreanText: "구름",
    vietnameseText: "Đám mây",
    explanation: "Chữ 구름 biểu thị các đám mây trôi trên bầu trời.",
    example: [
      "구름이 많다 (có nhiều mây)",
      "흰 구름 (mây trắng)",
      "구름 속에 (trong đám mây)",
    ],
  },
  {
    koreanText: "비",
    vietnameseText: "Mưa",
    explanation: "Chữ 비 biểu thị hiện tượng thời tiết mưa.",
    example: [
      "비가 오다 (mưa rơi)",
      "비오는 날 (ngày mưa)",
      "비를 맞다 (bị mưa)",
    ],
  },
  {
    koreanText: "눈",
    vietnameseText: "Tuyết",
    explanation: "Chữ 눈 mô tả hiện tượng tuyết rơi.",
    example: [
      "눈이 오다 (tuyết rơi)",
      "눈사람 (người tuyết)",
      "눈보라 (bão tuyết)",
    ],
  },
  {
    koreanText: "바람",
    vietnameseText: "Gió",
    explanation: "Chữ 바람 mô tả luồng gió tự nhiên.",
    example: [
      "바람이 불다 (gió thổi)",
      "시원한 바람 (gió mát)",
      "바람이 세다 (gió mạnh)",
    ],
  },
  {
    koreanText: "불",
    vietnameseText: "Lửa",
    explanation: "Chữ 불 tượng trưng cho lửa và sức nóng.",
    example: [
      "불을 지피다 (nhóm lửa)",
      "불꽃 (ngọn lửa)",
      "불이 나다 (bị cháy)",
    ],
  },
  {
    koreanText: "물",
    vietnameseText: "Nước",
    explanation: "Chữ 물 thể hiện sự sống và sự cần thiết của nước.",
    example: ["물을 마시다 (uống nước)", "물고기 (cá)", "물줄기 (dòng nước)"],
  },
  {
    koreanText: "땅",
    vietnameseText: "Đất",
    explanation: "Chữ 땅 chỉ đến mặt đất mà con người sống.",
    example: [
      "땅에 서다 (đứng trên đất)",
      "농작물 (cây trồng trên đất)",
      "땅을 파다 (đào đất)",
    ],
  },
  {
    koreanText: "사람",
    vietnameseText: "Người",
    explanation: "Chữ 사람 thể hiện con người.",
    example: [
      "사람이 많다 (nhiều người)",
      "사람의 마음 (tâm hồn con người)",
      "사람들과 이야기하다 (nói chuyện với mọi người)",
    ],
  },
  {
    koreanText: "사랑",
    vietnameseText: "Tình yêu",
    explanation: "Chữ 사랑 thể hiện tình cảm sâu sắc giữa con người.",
    example: [
      "사랑의 힘 (sức mạnh của tình yêu)",
      "사랑스럽다 (đáng yêu)",
      "사랑하는 사람 (người yêu)",
    ],
  },
  {
    koreanText: "행복",
    vietnameseText: "Hạnh phúc",
    explanation: "Chữ 행복 diễn tả trạng thái cảm xúc tích cực.",
    example: [
      "행복한 순간 (khoảnh khắc hạnh phúc)",
      "행복을 느끼다 (cảm nhận hạnh phúc)",
      "행복한 가족 (gia đình hạnh phúc)",
    ],
  },
  {
    koreanText: "슬픔",
    vietnameseText: "Nỗi buồn",
    explanation: "Chữ 슬픔 thể hiện trạng thái cảm xúc buồn bã.",
    example: [
      "슬픈 노래 (bài hát buồn)",
      "슬픔을 느끼다 (cảm thấy buồn)",
      "슬픔을 잊다 (quên đi nỗi buồn)",
    ],
  },
  {
    koreanText: "꿈",
    vietnameseText: "Giấc mơ",
    explanation: "Chữ 꿈 thể hiện những ước mơ và khát vọng.",
    example: [
      "꿈을 이루다 (thực hiện giấc mơ)",
      "꿈꾸다 (mơ ước)",
      "꿈속에 (trong giấc mơ)",
    ],
  },
  {
    koreanText: "기억",
    vietnameseText: "Ký ức",
    explanation: "Chữ 기억 mô tả những gì đã trải qua và ghi nhớ.",
    example: [
      "좋은 기억 (kỷ niệm đẹp)",
      "기억이 나다 (nhớ lại)",
      "기억력을 높이다 (nâng cao trí nhớ)",
    ],
  },
  {
    koreanText: "가족",
    vietnameseText: "Gia đình",
    explanation: "Chữ 가족 thể hiện mối quan hệ gia đình.",
    example: [
      "가족과 함께 (cùng với gia đình)",
      "가족사진 (ảnh gia đình)",
      "가족의 사랑 (tình yêu gia đình)",
    ],
  },
  {
    koreanText: "친구",
    vietnameseText: "Bạn bè",
    explanation: "Chữ 친구 thể hiện mối quan hệ bạn bè.",
    example: [
      "친구와 함께 (cùng bạn bè)",
      "친구의 도움 (sự giúp đỡ của bạn)",
      "친구처럼 (như bạn bè)",
    ],
  },
  {
    koreanText: "학교",
    vietnameseText: "Trường học",
    explanation: "Chữ 학교 chỉ nơi học tập và giáo dục.",
    example: [
      "학교에 가다 (đi đến trường)",
      "학교 친구 (bạn học)",
      "학교 생활 (cuộc sống học đường)",
    ],
  },
  {
    koreanText: "교실",
    vietnameseText: "Lớp học",
    explanation: "Chữ 교실 mô tả không gian học tập trong trường.",
    example: [
      "교실에서 공부하다 (học trong lớp học)",
      "교실 꾸미기 (trang trí lớp học)",
      "교실 안 (trong lớp học)",
    ],
  },
  {
    koreanText: "선생님",
    vietnameseText: "Giáo viên",
    explanation: "Chữ 선생님 thể hiện người dạy học.",
    example: [
      "선생님께 배우다 (học từ giáo viên)",
      "선생님의 조언 (lời khuyên của giáo viên)",
      "선생님과 이야기하다 (nói chuyện với giáo viên)",
    ],
  },
  {
    koreanText: "학생",
    vietnameseText: "Học sinh",
    explanation: "Chữ 학생 chỉ những người đang học.",
    example: [
      "학생들이 공부하다 (học sinh đang học)",
      "학생회 (hội học sinh)",
      "학생의 꿈 (giấc mơ của học sinh)",
    ],
  },
  {
    koreanText: "공부",
    vietnameseText: "Học tập",
    explanation: "Chữ 공부 mô tả quá trình học hỏi và nghiên cứu.",
    example: [
      "공부하다 (học tập)",
      "공부 시간 (thời gian học)",
      "공부 방법 (phương pháp học)",
    ],
  },
  {
    koreanText: "책",
    vietnameseText: "Sách",
    explanation: "Chữ 책 biểu thị nguồn kiến thức và thông tin.",
    example: [
      "책을 읽다 (đọc sách)",
      "좋은 책 (cuốn sách hay)",
      "책방 (tiệm sách)",
    ],
  },
  {
    koreanText: "도서관",
    vietnameseText: "Thư viện",
    explanation: "Chữ 도서관 chỉ nơi lưu trữ sách và tài liệu.",
    example: [
      "도서관에 가다 (đi đến thư viện)",
      "도서관에서 공부하다 (học tại thư viện)",
      "도서관 이용 (sử dụng thư viện)",
    ],
  },
  {
    koreanText: "시험",
    vietnameseText: "Kỳ thi",
    explanation: "Chữ 시험 mô tả bài kiểm tra kiến thức.",
    example: [
      "시험 준비 (chuẩn bị cho kỳ thi)",
      "시험 결과 (kết quả thi)",
      "시험에 합격하다 (đậu kỳ thi)",
    ],
  },
  {
    koreanText: "여행",
    vietnameseText: "Du lịch",
    explanation: "Chữ 여행 thể hiện việc đi đến những nơi mới.",
    example: [
      "여행을 가다 (đi du lịch)",
      "여행 준비 (chuẩn bị cho chuyến đi)",
      "여행 사진 (hình ảnh du lịch)",
    ],
  },
  {
    koreanText: "음식",
    vietnameseText: "Thức ăn",
    explanation: "Chữ 음식 mô tả các loại đồ ăn và thức uống.",
    example: [
      "맛있는 음식 (thức ăn ngon)",
      "음식을 만들다 (nấu thức ăn)",
      "음식점 (nhà hàng)",
    ],
  },
  {
    koreanText: "사람들",
    vietnameseText: "Con người",
    explanation: "Chữ 사람들 thể hiện nhiều người.",
    example: [
      "사람들이 모이다 (mọi người tụ tập)",
      "사람들의 생각 (suy nghĩ của mọi người)",
      "사람들 속에서 (giữa đám đông)",
    ],
  },
  {
    koreanText: "시간",
    vietnameseText: "Thời gian",
    explanation: "Chữ 시간 mô tả khái niệm thời gian.",
    example: [
      "시간이 지나가다 (thời gian trôi qua)",
      "좋은 시간 (thời gian tốt đẹp)",
      "시간 관리 (quản lý thời gian)",
    ],
  },
  {
    koreanText: "날짜",
    vietnameseText: "Ngày tháng",
    explanation: "Chữ 날짜 biểu thị ngày tháng trong lịch.",
    example: [
      "오늘 날짜 (ngày hôm nay)",
      "날짜를 확인하다 (kiểm tra ngày tháng)",
      "특별한 날짜 (ngày đặc biệt)",
    ],
  },
  {
    koreanText: "계절",
    vietnameseText: "Mùa",
    explanation: "Chữ 계절 mô tả bốn mùa trong năm.",
    example: [
      "봄, 여름, 가을, 겨울 (xuân, hạ, thu, đông)",
      "계절 변화 (thay đổi mùa)",
      "계절이 바뀌다 (mùa thay đổi)",
    ],
  },
  {
    koreanText: "친절",
    vietnameseText: "Sự tử tế",
    explanation: "Chữ 친절 thể hiện hành động tốt bụng và tôn trọng.",
    example: [
      "친절한 사람 (người tử tế)",
      "친절을 베풀다 (làm điều tốt)",
      "친절한 마음 (tấm lòng tử tế)",
    ],
  },
  {
    koreanText: "운동",
    vietnameseText: "Thể thao",
    explanation: "Chữ 운동 mô tả hoạt động thể chất.",
    example: [
      "운동을 하다 (tập thể thao)",
      "운동장 (sân thể thao)",
      "운동 선수 (vận động viên)",
    ],
  },
  {
    koreanText: "가다",
    vietnameseText: "Đi",
    explanation: "Chữ 가다 thể hiện hành động di chuyển.",
    example: [
      "어디에 가다 (đi đâu)",
      "학교에 가다 (đi đến trường)",
      "여행을 가다 (đi du lịch)",
    ],
  },
  {
    koreanText: "오다",
    vietnameseText: "Đến",
    explanation: "Chữ 오다 mô tả hành động di chuyển tới một nơi.",
    example: [
      "여기에 오다 (đến đây)",
      "집에 오다 (đến nhà)",
      "친구가 오다 (bạn đến)",
    ],
  },
  {
    koreanText: "보다",
    vietnameseText: "Nhìn",
    explanation: "Chữ 보다 thể hiện hành động nhìn thấy.",
    example: [
      "영화를 보다 (xem phim)",
      "풍경을 보다 (nhìn cảnh)",
      "사진을 보다 (xem ảnh)",
    ],
  },
  {
    koreanText: "듣다",
    vietnameseText: "Nghe",
    explanation: "Chữ 듣다 mô tả hành động lắng nghe.",
    example: [
      "노래를 듣다 (nghe bài hát)",
      "라디오를 듣다 (nghe đài)",
      "친구의 이야기를 듣다 (nghe câu chuyện của bạn)",
    ],
  },
  {
    koreanText: "말하다",
    vietnameseText: "Nói",
    explanation: "Chữ 말하다 thể hiện hành động giao tiếp bằng lời nói.",
    example: [
      "이야기를 말하다 (nói chuyện)",
      "친구에게 말하다 (nói với bạn)",
      "생각을 말하다 (nói ra suy nghĩ)",
    ],
  },
  {
    koreanText: "읽다",
    vietnameseText: "Đọc",
    explanation: "Chữ 읽다 mô tả hành động đọc sách hoặc tài liệu.",
    example: [
      "책을 읽다 (đọc sách)",
      "신문을 읽다 (đọc báo)",
      "편지를 읽다 (đọc thư)",
    ],
  },
  {
    koreanText: "쓰다",
    vietnameseText: "Viết",
    explanation: "Chữ 쓰다 thể hiện hành động viết chữ.",
    example: [
      "편지를 쓰다 (viết thư)",
      "일기를 쓰다 (viết nhật ký)",
      "메모를 쓰다 (viết ghi chú)",
    ],
  },
  {
    koreanText: "사다",
    vietnameseText: "Mua",
    explanation: "Chữ 사다 mô tả hành động mua sắm.",
    example: [
      "물건을 사다 (mua đồ)",
      "책을 사다 (mua sách)",
      "음식을 사다 (mua thức ăn)",
    ],
  },
  {
    koreanText: "팔다",
    vietnameseText: "Bán",
    explanation: "Chữ 팔다 thể hiện hành động bán hàng.",
    example: [
      "물건을 팔다 (bán đồ)",
      "음식을 팔다 (bán thức ăn)",
      "책을 팔다 (bán sách)",
    ],
  },
  {
    koreanText: "배우다",
    vietnameseText: "Học",
    explanation: "Chữ 배우다 mô tả hành động học hỏi kiến thức.",
    example: [
      "한국어를 배우다 (học tiếng Hàn)",
      "기술을 배우다 (học kỹ năng)",
      "새로운 것을 배우다 (học điều mới)",
    ],
  },
  {
    koreanText: "가르치다",
    vietnameseText: "Dạy",
    explanation: "Chữ 가르치다 thể hiện hành động truyền đạt kiến thức.",
    example: [
      "한국어를 가르치다 (dạy tiếng Hàn)",
      "아이들을 가르치다 (dạy trẻ em)",
      "기술을 가르치다 (dạy kỹ năng)",
    ],
  },
  {
    koreanText: "사라지다",
    vietnameseText: "Biến mất",
    explanation: "Chữ 사라지다 thể hiện sự biến mất hoặc không còn tồn tại.",
    example: [
      "빛이 사라지다 (ánh sáng biến mất)",
      "기억이 사라지다 (ký ức biến mất)",
      "사람들이 사라지다 (mọi người biến mất)",
    ],
  },
  {
    koreanText: "일어나다",
    vietnameseText: "Thức dậy",
    explanation: "Chữ 일어나다 thể hiện hành động đứng dậy hoặc thức tỉnh.",
    example: [
      "아침에 일어나다 (thức dậy vào buổi sáng)",
      "문제에서 일어나다 (đứng dậy từ vấn đề)",
      "일어난 후 (sau khi thức dậy)",
    ],
  },
  {
    koreanText: "앉다",
    vietnameseText: "Ngồi",
    explanation: "Chữ 앉다 mô tả hành động ngồi xuống.",
    example: [
      "의자에 앉다 (ngồi trên ghế)",
      "바닥에 앉다 (ngồi trên sàn)",
      "앉아서 대화하다 (ngồi trò chuyện)",
    ],
  },
  {
    koreanText: "서다",
    vietnameseText: "Đứng",
    explanation: "Chữ 서다 thể hiện hành động đứng lên.",
    example: [
      "앞에 서다 (đứng ở phía trước)",
      "문앞에 서다 (đứng trước cửa)",
      "서서 기다리다 (đứng chờ)",
    ],
  },
  {
    koreanText: "자다",
    vietnameseText: "Ngủ",
    explanation: "Chữ 자다 mô tả hành động ngủ nghỉ.",
    example: [
      "잠을 자다 (ngủ)",
      "편안하게 자다 (ngủ ngon)",
      "자다가 깨다 (tỉnh dậy giữa giấc ngủ)",
    ],
  },
  {
    koreanText: "놀다",
    vietnameseText: "Chơi",
    explanation: "Chữ 놀다 thể hiện hành động giải trí.",
    example: [
      "친구와 놀다 (chơi với bạn)",
      "게임을 놀다 (chơi trò chơi)",
      "밖에서 놀다 (chơi ở bên ngoài)",
    ],
  },
  {
    koreanText: "시작하다",
    vietnameseText: "Bắt đầu",
    explanation: "Chữ 시작하다 mô tả hành động khởi đầu.",
    example: [
      "공부를 시작하다 (bắt đầu học)",
      "새로운 프로젝트를 시작하다 (bắt đầu dự án mới)",
      "일을 시작하다 (bắt đầu công việc)",
    ],
  },
  {
    koreanText: "끝나다",
    vietnameseText: "Kết thúc",
    explanation: "Chữ 끝나다 thể hiện hành động hoàn thành.",
    example: [
      "수업이 끝나다 (lớp học kết thúc)",
      "일이 끝나다 (công việc kết thúc)",
      "영화가 끝나다 (phim kết thúc)",
    ],
  },
  {
    koreanText: "만나다",
    vietnameseText: "Gặp",
    explanation: "Chữ 만나다 mô tả hành động gặp gỡ.",
    example: [
      "친구를 만나다 (gặp bạn)",
      "사람들을 만나다 (gặp gỡ mọi người)",
      "오늘 만나다 (gặp hôm nay)",
    ],
  },
  {
    koreanText: "헤어지다",
    vietnameseText: "Chia tay",
    explanation: "Chữ 헤어지다 thể hiện sự chia tay.",
    example: [
      "친구와 헤어지다 (chia tay với bạn)",
      "연인과 헤어지다 (chia tay với người yêu)",
      "오랜 친구와 헤어지다 (chia tay với bạn cũ)",
    ],
  },
  {
    koreanText: "기다리다",
    vietnameseText: "Chờ",
    explanation: "Chữ 기다리다 mô tả hành động chờ đợi.",
    example: [
      "버스를 기다리다 (chờ xe buýt)",
      "친구를 기다리다 (chờ bạn)",
      "기다리고 있다 (đang chờ)",
    ],
  },
  {
    koreanText: "사라다",
    vietnameseText: "Bỏ đi",
    explanation: "Chữ 사라다 thể hiện hành động từ bỏ.",
    example: [
      "생각을 사라다 (bỏ đi suy nghĩ)",
      "계획을 사라다 (bỏ kế hoạch)",
      "일을 사라다 (bỏ công việc)",
    ],
  },
  {
    koreanText: "이해하다",
    vietnameseText: "Hiểu",
    explanation: "Chữ 이해하다 mô tả hành động hiểu biết.",
    example: [
      "문제를 이해하다 (hiểu vấn đề)",
      "상황을 이해하다 (hiểu tình huống)",
      "뜻을 이해하다 (hiểu ý nghĩa)",
    ],
  },
  {
    koreanText: "생각하다",
    vietnameseText: "Suy nghĩ",
    explanation: "Chữ 생각하다 thể hiện hành động suy nghĩ.",
    example: [
      "문제를 생각하다 (suy nghĩ về vấn đề)",
      "미래를 생각하다 (suy nghĩ về tương lai)",
      "생각이 나다 (xuất hiện suy nghĩ)",
    ],
  },
  {
    koreanText: "기억하다",
    vietnameseText: "Nhớ",
    explanation: "Chữ 기억하다 mô tả hành động nhớ lại.",
    example: [
      "이름을 기억하다 (nhớ tên)",
      "과거를 기억하다 (nhớ quá khứ)",
      "일을 기억하다 (nhớ việc)",
    ],
  },
  {
    koreanText: "느끼다",
    vietnameseText: "Cảm nhận",
    explanation: "Chữ 느끼다 thể hiện hành động cảm nhận.",
    example: [
      "감정을 느끼다 (cảm nhận cảm xúc)",
      "행복을 느끼다 (cảm nhận hạnh phúc)",
      "따뜻함을 느끼다 (cảm nhận sự ấm áp)",
    ],
  },
  {
    koreanText: "대화하다",
    vietnameseText: "Nói chuyện",
    explanation: "Chữ 대화하다 mô tả hành động trò chuyện.",
    example: [
      "친구와 대화하다 (nói chuyện với bạn)",
      "상대방과 대화하다 (nói chuyện với đối phương)",
      "주제에 대해 대화하다 (nói chuyện về chủ đề)",
    ],
  },
  {
    koreanText: "선택하다",
    vietnameseText: "Chọn",
    explanation: "Chữ 선택하다 thể hiện hành động chọn lựa.",
    example: [
      "과목을 선택하다 (chọn môn học)",
      "장소를 선택하다 (chọn địa điểm)",
      "선택의 기회 (cơ hội chọn lựa)",
    ],
  },
  {
    koreanText: "결정하다",
    vietnameseText: "Quyết định",
    explanation: "Chữ 결정하다 mô tả hành động quyết định.",
    example: [
      "결정을 하다 (đưa ra quyết định)",
      "중요한 결정을 하다 (đưa ra quyết định quan trọng)",
      "결정이 나다 (quyết định được đưa ra)",
    ],
  },
  {
    koreanText: "도와주다",
    vietnameseText: "Giúp đỡ",
    explanation: "Chữ 도와주다 thể hiện hành động giúp đỡ.",
    example: [
      "친구를 도와주다 (giúp đỡ bạn)",
      "가족을 도와주다 (giúp đỡ gia đình)",
      "일을 도와주다 (giúp đỡ công việc)",
    ],
  },
  {
    koreanText: "연습하다",
    vietnameseText: "Luyện tập",
    explanation: "Chữ 연습하다 mô tả hành động luyện tập.",
    example: [
      "운동을 연습하다 (luyện tập thể thao)",
      "노래를 연습하다 (luyện tập hát)",
      "언어를 연습하다 (luyện tập ngôn ngữ)",
    ],
  },
  {
    koreanText: "기억나다",
    vietnameseText: "Nhớ lại",
    explanation: "Chữ 기억나다 thể hiện hành động nhớ lại.",
    example: [
      "이름이 기억나다 (nhớ lại tên)",
      "이야기가 기억나다 (nhớ lại câu chuyện)",
      "기억이 나다 (có ký ức)",
    ],
  },
  {
    koreanText: "상상하다",
    vietnameseText: "Tưởng tượng",
    explanation: "Chữ 상상하다 mô tả hành động tưởng tượng.",
    example: [
      "미래를 상상하다 (tưởng tượng tương lai)",
      "새로운 세계를 상상하다 (tưởng tượng thế giới mới)",
      "상상력이 풍부하다 (có sức tưởng tượng phong phú)",
    ],
  },
  {
    koreanText: "받다",
    vietnameseText: "Nhận",
    explanation: "Chữ 받다 thể hiện hành động nhận.",
    example: [
      "선물을 받다 (nhận quà)",
      "편지를 받다 (nhận thư)",
      "칭찬을 받다 (nhận lời khen)",
    ],
  },
  {
    koreanText: "주다",
    vietnameseText: "Cho",
    explanation: "Chữ 주다 mô tả hành động cho đi.",
    example: [
      "선물을 주다 (cho quà)",
      "도움을 주다 (cho sự giúp đỡ)",
      "정보를 주다 (cho thông tin)",
    ],
  },
  {
    koreanText: "만들다",
    vietnameseText: "Tạo ra",
    explanation: "Chữ 만들다 thể hiện hành động tạo ra cái gì đó.",
    example: [
      "음식을 만들다 (tạo ra thức ăn)",
      "작품을 만들다 (tạo ra tác phẩm)",
      "계획을 만들다 (tạo ra kế hoạch)",
    ],
  },
  {
    koreanText: "변화하다",
    vietnameseText: "Thay đổi",
    explanation: "Chữ 변화하다 mô tả hành động thay đổi.",
    example: [
      "상황이 변화하다 (tình huống thay đổi)",
      "계획이 변화하다 (kế hoạch thay đổi)",
      "기후가 변화하다 (khí hậu thay đổi)",
    ],
  },
  {
    koreanText: "이루어지다",
    vietnameseText: "Thực hiện",
    explanation: "Chữ 이루어지다 thể hiện hành động thực hiện.",
    example: [
      "계획이 이루어지다 (kế hoạch được thực hiện)",
      "꿈이 이루어지다 (giấc mơ được thực hiện)",
      "목표가 이루어지다 (mục tiêu được thực hiện)",
    ],
  },
  {
    koreanText: "돌아가다",
    vietnameseText: "Quay lại",
    explanation: "Chữ 돌아가다 mô tả hành động quay lại.",
    example: [
      "집으로 돌아가다 (quay lại nhà)",
      "학교로 돌아가다 (quay lại trường)",
      "출발한 곳으로 돌아가다 (quay lại nơi xuất phát)",
    ],
  },
  {
    koreanText: "사라지다",
    vietnameseText: "Biến mất",
    explanation: "Chữ 사라지다 thể hiện hành động biến mất.",
    example: [
      "구름이 사라지다 (mây biến mất)",
      "기억이 사라지다 (ký ức biến mất)",
      "빛이 사라지다 (ánh sáng biến mất)",
    ],
  },
  {
    koreanText: "필요하다",
    vietnameseText: "Cần",
    explanation: "Chữ 필요하다 mô tả hành động cần thiết.",
    example: [
      "도움이 필요하다 (cần giúp đỡ)",
      "시간이 필요하다 (cần thời gian)",
      "정보가 필요하다 (cần thông tin)",
    ],
  },
  {
    koreanText: "대답하다",
    vietnameseText: "Trả lời",
    explanation: "Chữ 대답하다 thể hiện hành động trả lời.",
    example: [
      "질문에 대답하다 (trả lời câu hỏi)",
      "이메일에 대답하다 (trả lời email)",
      "전화를 대답하다 (trả lời cuộc gọi)",
    ],
  },
  {
    koreanText: "연결하다",
    vietnameseText: "Kết nối",
    explanation: "Chữ 연결하다 mô tả hành động kết nối.",
    example: [
      "인터넷에 연결하다 (kết nối internet)",
      "사람들과 연결하다 (kết nối với mọi người)",
      "계정을 연결하다 (kết nối tài khoản)",
    ],
  },
  {
    koreanText: "신뢰하다",
    vietnameseText: "Tin tưởng",
    explanation: "Chữ 신뢰하다 thể hiện sự tin tưởng.",
    example: [
      "사람을 신뢰하다 (tin tưởng vào người)",
      "전문가를 신뢰하다 (tin tưởng vào chuyên gia)",
      "의견을 신뢰하다 (tin tưởng vào ý kiến)",
    ],
  },
  {
    koreanText: "노력하다",
    vietnameseText: "Nỗ lực",
    explanation: "Chữ 노력하다 mô tả hành động nỗ lực.",
    example: [
      "열심히 노력하다 (nỗ lực hết mình)",
      "목표를 위해 노력하다 (nỗ lực vì mục tiêu)",
      "성공을 위해 노력하다 (nỗ lực để thành công)",
    ],
  },
  {
    koreanText: "이해받다",
    vietnameseText: "Được hiểu",
    explanation: "Chữ 이해받다 thể hiện hành động được hiểu.",
    example: [
      "감정을 이해받다 (được hiểu cảm xúc)",
      "상황을 이해받다 (được hiểu tình huống)",
      "의견을 이해받다 (được hiểu ý kiến)",
    ],
  },
  {
    koreanText: "지키다",
    vietnameseText: "Bảo vệ",
    explanation: "Chữ 지키다 mô tả hành động bảo vệ.",
    example: [
      "자신을 지키다 (bảo vệ bản thân)",
      "법을 지키다 (bảo vệ luật pháp)",
      "환경을 지키다 (bảo vệ môi trường)",
    ],
  },
  {
    koreanText: "공부하다",
    vietnameseText: "Học",
    explanation: "Chữ 공부하다 thể hiện hành động học tập.",
    example: [
      "학교에서 공부하다 (học ở trường)",
      "자습을 공부하다 (học tự học)",
      "공부하는 것이 중요하다 (học là điều quan trọng)",
    ],
  },
  {
    koreanText: "상상하다",
    vietnameseText: "Tưởng tượng",
    explanation: "Chữ 상상하다 mô tả hành động tưởng tượng.",
    example: [
      "미래를 상상하다 (tưởng tượng tương lai)",
      "새로운 아이디어를 상상하다 (tưởng tượng ý tưởng mới)",
      "꿈을 상상하다 (tưởng tượng giấc mơ)",
    ],
  },
  {
    koreanText: "행동하다",
    vietnameseText: "Hành động",
    explanation: "Chữ 행동하다 thể hiện hành động hành động.",
    example: [
      "올바르게 행동하다 (hành động đúng đắn)",
      "신중하게 행동하다 (hành động cẩn thận)",
      "상황에 맞게 행동하다 (hành động phù hợp với tình huống)",
    ],
  },
  {
    koreanText: "사랑하다",
    vietnameseText: "Yêu",
    explanation: "Chữ 사랑하다 mô tả hành động yêu thương.",
    example: [
      "가족을 사랑하다 (yêu gia đình)",
      "자연을 사랑하다 (yêu thiên nhiên)",
      "사람을 사랑하다 (yêu một người)",
    ],
  },
  {
    koreanText: "믿다",
    vietnameseText: "Tin tưởng",
    explanation: "Chữ 믿다 thể hiện hành động tin tưởng.",
    example: [
      "친구를 믿다 (tin tưởng bạn)",
      "본능을 믿다 (tin tưởng vào bản năng)",
      "결정을 믿다 (tin tưởng vào quyết định)",
    ],
  },
  {
    koreanText: "기대하다",
    vietnameseText: "Mong đợi",
    explanation: "Chữ 기대하다 mô tả hành động mong đợi.",
    example: [
      "결과를 기대하다 (mong đợi kết quả)",
      "답장을 기대하다 (mong đợi phản hồi)",
      "이벤트를 기대하다 (mong đợi sự kiện)",
    ],
  },
  {
    koreanText: "지금",
    vietnameseText: "Bây giờ",
    explanation: "Chữ 지금 mô tả thời gian hiện tại.",
    example: [
      "지금 일어나다 (dậy bây giờ)",
      "지금 공부하다 (học bây giờ)",
      "지금 가다 (đi bây giờ)",
    ],
  },
  {
    koreanText: "더하다",
    vietnameseText: "Thêm vào",
    explanation: "Chữ 더하다 thể hiện hành động thêm vào.",
    example: [
      "조금 더하다 (thêm một chút)",
      "정보를 더하다 (thêm thông tin)",
      "수량을 더하다 (thêm số lượng)",
    ],
  },
  {
    koreanText: "이해시키다",
    vietnameseText: "Giải thích",
    explanation: "Chữ 이해시키다 mô tả hành động giải thích.",
    example: [
      "상황을 이해시키다 (giải thích tình huống)",
      "문제를 이해시키다 (giải thích vấn đề)",
      "의견을 이해시키다 (giải thích ý kiến)",
    ],
  },
  {
    koreanText: "의미하다",
    vietnameseText: "Có nghĩa là",
    explanation: "Chữ 의미하다 thể hiện ý nghĩa.",
    example: [
      "이 말은 무엇을 의미하다? (câu này có nghĩa gì?)",
      "사랑은 무엇을 의미하다? (tình yêu có nghĩa là gì?)",
      "일은 무엇을 의미하다? (công việc có nghĩa là gì?)",
    ],
  },
  {
    koreanText: "부탁하다",
    vietnameseText: "Nhờ vả",
    explanation: "Chữ 부탁하다 mô tả hành động nhờ vả.",
    example: [
      "도움을 부탁하다 (nhờ vả giúp đỡ)",
      "일을 부탁하다 (nhờ vả công việc)",
      "정보를 부탁하다 (nhờ vả thông tin)",
    ],
  },
  {
    koreanText: "고민하다",
    vietnameseText: "Trăn trở",
    explanation: "Chữ 고민하다 thể hiện sự trăn trở.",
    example: [
      "문제에 대해 고민하다 (trăn trở về vấn đề)",
      "미래에 대해 고민하다 (trăn trở về tương lai)",
      "선택에 대해 고민하다 (trăn trở về lựa chọn)",
    ],
  },
  {
    koreanText: "도전하다",
    vietnameseText: "Thử thách",
    explanation: "Chữ 도전하다 mô tả hành động thử thách.",
    example: [
      "새로운 것을 도전하다 (thử thách cái mới)",
      "자신에게 도전하다 (thử thách bản thân)",
      "과제를 도전하다 (thử thách nhiệm vụ)",
    ],
  },
  {
    koreanText: "시작하다",
    vietnameseText: "Bắt đầu",
    explanation: "Chữ 시작하다 thể hiện hành động bắt đầu.",
    example: [
      "일을 시작하다 (bắt đầu công việc)",
      "공부를 시작하다 (bắt đầu học)",
      "새로운 프로젝트를 시작하다 (bắt đầu dự án mới)",
    ],
  },
  {
    koreanText: "결정하다",
    vietnameseText: "Quyết định",
    explanation: "Chữ 결정하다 mô tả hành động quyết định.",
    example: [
      "결정을 내리다 (đưa ra quyết định)",
      "상황을 결정하다 (quyết định tình huống)",
      "문제를 결정하다 (quyết định vấn đề)",
    ],
  },
  {
    koreanText: "시도하다",
    vietnameseText: "Thử",
    explanation: "Chữ 시도하다 thể hiện hành động thử.",
    example: [
      "새로운 요리를 시도하다 (thử món ăn mới)",
      "문제를 시도하다 (thử giải quyết vấn đề)",
      "아이디어를 시도하다 (thử ý tưởng)",
    ],
  },
];
// const cards = [
//   {
//     koreanText: "태양",
//     vietnameseText: "Mặt trời",
//     explanation:
//       "Chữ 태양 là tượng thanh, mô phỏng âm thanh của từ 'mặt trời' trong tiếng Hàn.",
//     example: [
//       "태양빛 (ánh sáng mặt trời)",
//       "태양계 (hệ mặt trời)",
//       "태양광 (năng lượng mặt trời)",
//     ],
//   },
//   {
//     koreanText: "달",
//     vietnameseText: "Mặt trăng",
//     explanation:
//       "Chữ 달 là tượng thanh, mô phỏng âm thanh của từ 'mặt trăng' trong tiếng Hàn.",
//     example: [
//       "달빛 (ánh sáng mặt trăng)",
//       "달력 (lịch âm)",
//       "달밤 (đêm trăng)",
//     ],
//   },
//   {
//     koreanText: "산",
//     vietnameseText: "Ngọn núi",
//     explanation:
//       "Chữ 산 là tượng thanh, mô phỏng âm thanh của từ 'ngọn núi' trong tiếng Hàn.",
//     example: [
//       "산맥 (dãy núi)",
//       "산책 (đi dạo trong công viên)",
//       "산토 (ngọn núi xanh)",
//     ],
//   },
//   {
//     koreanText: "사람",
//     vietnameseText: "Người",
//     explanation:
//       "Chữ 사람 là tượng thanh, mô phỏng âm thanh của từ 'người' trong tiếng Hàn.",
//     example: [
//       "사람들 (mọi người)",
//       "사람친구 (bạn bè)",
//       "사람사랑 (tình yêu con người)",
//     ],
//   },
// ];

export default function Index() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [suggest, setSuggest] = useState(false);
  const [theme, setTheme] = useState(false);
  const handleSpeak = (e: any, text: string) => {
    e.stopPropagation();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = isFlipped ? "vi-VN" : "ko-KR"; // Đặt ngôn ngữ dựa trên giá trị của isFlipped
    window.speechSynthesis.speak(utterance);
  };

  const [currentMenu, setCurrentMenu] = useState(0);

  // Phân trang

  const [shuffledCards, setShuffledCards] = useState(cards);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1; // Hiển thị 1 thẻ mỗi trang
  const totalPages = Math.ceil(shuffledCards.length / itemsPerPage);

  const shuffleArray = (array: any) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setShuffledCards(shuffleArray([...cards])); // Xáo trộn mảng và cập nhật state
    setCurrentPage(1); // Đặt lại trang hiện tại về 1 sau khi xáo trộn
  };

  const currentCard = shuffledCards[(currentPage - 1) * itemsPerPage];

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

      <div
        className={cx(
          "ctn",
          theme ? "bg-[#fff] text-[black]" : "bg-[black] text-[#fff]"
        )}
      >
        <div className={cx("w")}>
          <h1 className={cx("title")}>
            Từ vựng tiếng Hàn
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
                      {!suggest
                        ? "Hiển thị gợi ý"
                        : currentCard.vietnameseText
                        ? currentCard.vietnameseText[0] +
                          "*".repeat(currentCard.vietnameseText.length - 1)
                        : ""}
                    </button>
                    <button
                      onClick={(e) => handleSpeak(e, currentCard.koreanText)}
                      className={cx("btn")}
                    >
                      <GiSpeaker size={20} />
                    </button>
                  </div>
                  <div className={cx("body")}>
                    <span className={cx("korean-text")}>
                      {currentCard.koreanText}
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
                        : currentCard.vietnameseText
                        ? currentCard.vietnameseText[0] +
                          "*".repeat(currentCard.vietnameseText.length - 1)
                        : ""}
                    </button>
                    <button
                      onClick={(e) =>
                        handleSpeak(e, currentCard.vietnameseText)
                      }
                      className={cx("btn")}
                    >
                      <GiSpeaker size={20} />
                    </button>
                  </div>
                  <div className={cx("body")}>
                    <span className={cx("korean-text")}>
                      {currentCard.vietnameseText}
                    </span>
                    <span> {currentCard.explanation}</span>
                    <ul className="flex flex-col gap-[10px]">
                      {currentCard.example.map((item, index) => {
                        return <li key={index}>{item}</li>;
                      })}
                    </ul>
                  </div>
                </div>
              </ReactCardFlip>
              <div className={cx("page")}>
                <Pagination
                  count={totalPages}
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
    </>
  );
}
