import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import axios from "axios";

interface BlogFormProps {
  setBlogs: any;
  setOpen: any;
}

const BlogForm: React.FC<BlogFormProps> = ({ setBlogs, setOpen }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("userId", userId ? userId : "0");
    if (image) {
      formData.append("image", image); // Thêm ảnh vào FormData
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/blogs/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Đặt header cho multipart
          },
        }
      );
      if (response.data) {
        setBlogs((prev: any) => [...prev, response.data]);
        setOpen(false);
      }
      console.log("Bài viết đã được tạo:", response.data);
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <div className="text-blue-600 text-xl font-bold py-[10px]">
        Tạo Bài Viết Mới
      </div>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tiêu đề"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nội dung"
              variant="outlined"
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <input
              accept="image/*"
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0]);
                  //   setPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
              style={{ display: "none" }} // Ẩn input file
              id="upload-image"
            />
            <label htmlFor="upload-image">
              <Button variant="contained" component="span">
                Tải lên Ảnh
              </Button>
            </label>
          </Grid>
          <Grid item xs={12}>
            <Box mt={2}>
              <Button type="submit" variant="contained" color="primary">
                Tạo bài viết
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default BlogForm;
