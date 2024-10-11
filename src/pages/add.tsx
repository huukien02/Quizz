import React, { useState } from "react";
import { Modal, Box, Button, Typography, TextField } from "@mui/material";

import { getDatabase, ref, set, push } from "firebase/database";
import app from "../firebaseConfig";
import { toast } from "react-toastify";

interface Props {
  open: any;
  setOpen: any;
}
const Add: React.FC<Props> = ({ open, setOpen }) => {
  const [koreanText, setKoreanText] = useState("");
  const [vietnameseText, setVietnameseText] = useState("");
  const [error, setError] = useState(false);

  const handleAddText = async () => {
    const db = getDatabase(app);
    const newDocRef = push(ref(db, "texts"));
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
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
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
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
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
        <Button
          disabled={!koreanText || !vietnameseText}
          onClick={handleAddText}
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Thêm
        </Button>
      </Box>
    </Modal>
  );
};

export default Add;
