import "../../app/globals.css";

import React, { useEffect, useState } from "react";
import BlogForm from "./blog-form";
import axiosInstance from "@/lib/axios";
import BlogList from "./blog-list";
import Header from "@/layout/header";
import { Box, Modal } from "@mui/material";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
  // border: "2px solid #000",
  // boxShadow: 24,
  p: 4,
};
export interface Blog {
  id: number;
  title: string;
  content: string;
  imageUrl?: string; // optional
  userId: number; // ID của người dùng đã tạo bài viết
  createdAt: Date; // Ngày tạo bài viết
  updatedAt: Date; // Ngày cập nhật bài viết
}
const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({
    id: null,
    avatar: "",
    username: "",
    email: "",
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        try {
          const response = await axiosInstance.get(
            `http://localhost:4000/blogs/`
          );
          setBlogs(response.data);
        } catch (err) {}
      } catch (error) {
        console.error("Lỗi khi tải danh sách blog:", error);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      // Gọi API để lấy thông tin người dùng
      const fetchUserData = async () => {
        try {
          const response = await axiosInstance.get(
            `http://localhost:4000/users/${userId}`
          );
          setUser(response.data.user);
        } catch (err) {}
      };

      fetchUserData();
    } else {
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#fff] text-[black]">
      <Header />
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <BlogForm setOpen={setOpen} setBlogs={setBlogs} />
        </Box>
      </Modal>
      <div className="w-full flex items-center justify-center py-[10px]">
        <button
          onClick={() => {
            setOpen(true);
          }}
          className="hover:bg-[#f0f0f3] duration-150 border w-[400px] h-[60px] rounded-[10px]"
        >
          Bạn đang nghĩ gì vậy ??
        </button>
      </div>

      {blogs && <BlogList user={user} setBlogs={setBlogs} blogs={blogs} />}
    </div>
  );
};

export default Blogs;
