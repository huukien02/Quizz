import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Container,
} from "@mui/material";
import { Blog } from "..";
import ItemBlog from "./ItemBlog";

interface BlogListProps {
  blogs: Blog[]; // Định nghĩa props blogs là một mảng các Blog
  user: any;
  setBlogs: any;
}

const BlogList: React.FC<BlogListProps> = ({ setBlogs, user, blogs }) => {
  return (
    <div className=" flex flex-col gap-[10px] items-center justify-center">
      {blogs.map((blog: any) => (
        <ItemBlog setBlogs={setBlogs} user={user} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
