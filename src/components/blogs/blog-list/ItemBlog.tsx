import axiosInstance from "@/lib/axios";
import { Button, TextField, Tooltip } from "@mui/material";
import React, { useState } from "react";

interface Blog {
  blog: any;
  user: any;
  setBlogs: any;
}
const ItemBlog: React.FC<Blog> = ({ setBlogs, user, blog }) => {
  const [showCmt, setShowCmt] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");

  const handleComment = async () => {
    try {
      const response = await axiosInstance.post(
        "http://localhost:4000/comments/create",
        {
          content: comment,
          blogId: blog.id,
          userId: user.id,
        }
      );

      if (response.data) {
        const newComment = response.data;
        const { password, updatedAt, createdAt, ...userWithoutPassword } = user;
        const data = {
          author: userWithoutPassword,
          content: newComment.content,
          createdAt: newComment.createdAt,
          id: newComment.id,
        };

        setBlogs((prevBlogs: any) => {
          return prevBlogs.map((blog: any) => {
            if (blog.id === newComment.blogId) {
              return {
                ...blog,
                comments: [...blog.comments, data],
              };
            }
            return blog; // Giữ nguyên các blog khác
          });
        });

        setComment("");
        // setShowCmt(false);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className="border flex flex-col gap-[10px] w-[600px] rounded-[10px] py-[20px] px-[20px]">
      <div className="flex gap-3 items-center">
        <img
          className="w-[40px] h-[40px] rounded-full"
          src={`http://localhost:4000/uploads/${blog.author.avatar}`}
        />
        {blog.author.username}
      </div>
      <div className="flex flex-col gap-[5px]">
        <span className="text-[15px] font-bold">{blog.title}</span>
        <span>{blog.content}</span>
      </div>
      <div className="w-full h-[300px] flex items-center justify-center py-[10px] rounded-[5px] border">
        <img
          className="w-auto h-full"
          src={`http://localhost:4000/uploads/${blog.imageUrl}`}
        />
      </div>
      <button
        onClick={() => {
          setShowCmt(!showCmt);
        }}
      >
        Comment
      </button>
      {showCmt && (
        <div className="w-full flex flex-col justify-start gap-[20px]">
          <div className="flex items-center justify-start gap-[10px] w-full">
            <img
              className="rounded-full h-[25px] w-[25px] border border-[#dbd2d2] shadow-lg cursor-pointer"
              src={`http://localhost:4000/uploads/${user.avatar}`}
              alt="Avatar"
            />
            <input
              className="border border-[#cfcfcf] outline-0 h-[35px] w-[250px] px-[10px] rounded-[5px]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Bạn nghĩ gì ??"
            />
          </div>
          <div className="flex flex-col gap-[5px]">
            {blog.comments.map((item: any) => {
              return (
                <div className="flex gap-3 ">
                  <Tooltip placement="top-start" title={item.author.username}>
                    <img
                      className="rounded-full h-[25px] w-[25px] border border-[#dbd2d2] shadow-lg cursor-pointer"
                      src={`http://localhost:4000/uploads/${item.author.avatar}`}
                      alt="Avatar"
                    />
                  </Tooltip>

                  <span>{item.content}</span>
                </div>
              );
            })}
          </div>
          <button
            className="w-[150px] h-[30px] rounded-[5px] bg-[#7070ec] text-[#fff]"
            onClick={handleComment}
          >
            Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemBlog;
