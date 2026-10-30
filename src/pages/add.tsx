import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { getDatabase, ref, set, push } from "firebase/database";
import app from "../firebaseConfig";
import { toast } from "react-toastify";
import { list } from ".";
import Mascot from "../components/Mascot";

interface Props {
  open: any;
  setOpen: any;
}


const Add: React.FC<Props> = ({ open, setOpen }) => {
  const [koreanText, setKoreanText] = useState("");
  const [vietnameseText, setVietnameseText] = useState("");
  const [selectedValue, setSelectedValue] = useState(list[0].name);

  const [error, setError] = useState(false);

  const handleAddText = async () => {
    const db = getDatabase(app);
    const newDocRef = push(ref(db, selectedValue));
    set(newDocRef, {
      koreanText,
      vietnameseText,
    })
      .then(() => {
        toast.success("Thêm từ khóa thành công");
        setOpen(false);
        setKoreanText("");
        setVietnameseText("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (event: any) => {
    setSelectedValue(event.target.value);
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      container={() => document.querySelector(".k-root") ?? document.body}
      aria-labelledby="add-modal-title"
      aria-describedby="add-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          maxWidth: "calc(100vw - 32px)",
          bgcolor: "var(--k-bg)",
          color: "var(--k-ink)",
          border: "2px solid var(--k-line)",
          boxShadow: "0 8px 0 var(--k-line), 0 30px 60px -20px rgba(122,96,140,.5)",
          p: 4,
          borderRadius: "28px",
          outline: "none",
          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            bgcolor: "var(--k-surface)",
            color: "var(--k-ink)",
            fontFamily: "Nunito, Jua, sans-serif",
            fontWeight: 700,
          },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--k-line)", borderWidth: 2 },
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--k-mint-strong)",
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            { borderColor: "var(--k-mint-strong)" },
          "& .MuiSelect-icon": { color: "var(--k-muted)" },
          "& .MuiInputLabel-root": {
            fontFamily: "Nunito, sans-serif",
            fontWeight: 700,
            color: "var(--k-muted)",
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "var(--k-mint-deep)" },
          "& .MuiInputLabel-root.Mui-error, & .MuiFormHelperText-root.Mui-error": {
            color: "var(--k-pink-deep)",
          },
        }}
      >
        <div className="flex flex-col items-center gap-[4px] mb-[20px] text-center">
          <Mascot size={72} mood="excited" />
          <Typography
            id="add-modal-title"
            sx={{ fontFamily: "Jua, Nunito, sans-serif", fontSize: 24, color: "var(--k-ink)" }}
          >
            새 단어 추가 ✨
          </Typography>
          <Typography sx={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "var(--k-muted)" }}>
            Thêm từ mới vào bài học
          </Typography>
        </div>
        <FormControl fullWidth>
          <InputLabel>Chọn bài</InputLabel>
          <Select
            value={selectedValue}
            label="Chọn bài"
            onChange={handleChange}
            MenuProps={{
              container: () => document.querySelector(".k-root") ?? document.body,
              PaperProps: {
                sx: {
                  bgcolor: "var(--k-surface)",
                  color: "var(--k-ink)",
                  borderRadius: "16px",
                  border: "2px solid var(--k-line)",
                  fontFamily: "Nunito, sans-serif",
                  "& .MuiMenuItem-root": { fontFamily: "Nunito, sans-serif", fontWeight: 700 },
                  "& .MuiMenuItem-root:hover": { bgcolor: "var(--k-mint)" },
                  "& .MuiMenuItem-root.Mui-selected": { bgcolor: "var(--k-mint)" },
                },
              },
            }}
          >
            {list.map((item) => (
              <MenuItem key={item.name} value={item.name}>
                {item.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Korean Text Input */}
        <TextField
          label="Nhập tiếng Hàn"
          variant="outlined"
          fullWidth
          margin="normal"
          value={koreanText}
          onChange={(e) => {
            setKoreanText(e.target.value);
            const koreanRegex = /[\uAC00-\uD7AF]+/;
            setError(!koreanRegex.test(e.target.value)); // Set lỗi nếu không phải tiếng Hàn
          }}
          error={error} // Hiển thị lỗi nếu không phải tiếng Hàn
          helperText={error ? "Có vẻ bạn nhập chưa đúng tiếng Hàn" : ""} // Thông báo lỗi
        />

        {/* Vietnamese Text Input */}
        <TextField
          label="Nhập tiếng Việt"
          variant="outlined"
          fullWidth
          margin="normal"
          value={vietnameseText}
          onChange={(e) => setVietnameseText(e.target.value)}
        />
        <button
          disabled={!koreanText || !vietnameseText}
          onClick={handleAddText}
          className="k-btn w-full mt-[16px]"
        >
          Thêm
        </button>
      </Box>
    </Modal>
  );
};

export default Add;
