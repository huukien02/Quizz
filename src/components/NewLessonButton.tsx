import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import LessonFormDialog from "./LessonFormDialog";
import { Lesson, createLesson, nextLessonNumber } from "../lib/lessons";

interface Props {
  lessons: Lesson[];
  onCreated: (name: string) => void;
}

// Ô "+ Bài mới" ở cuối lưới chọn bài, mở popup nhập tên và mô tả bài
export default function NewLessonButton({ lessons, onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={btnRef}
        className="k-lesson-tile k-lesson-tile--add"
        onClick={() => setOpen(true)}
      >
        <span className="k-lesson-tile__emoji">＋</span>
        <span className="k-lesson-tile__title">Bài mới</span>
      </button>

      <LessonFormDialog
        open={open}
        onClose={() => setOpen(false)}
        heading="새 수업 만들기 📚"
        submitLabel="Tạo bài"
        placeholder={`Bài ${nextLessonNumber(lessons)}`}
        container={() => btnRef.current?.closest(".k-root") ?? document.body}
        onSubmit={async (title, description) => {
          try {
            const name = await createLesson(lessons, title, description);
            toast.success("Đã tạo bài mới");
            setOpen(false);
            onCreated(name);
          } catch (error) {
            console.log(error);
            toast.error("Không tạo được bài mới, thử lại nhé");
          }
        }}
      />
    </>
  );
}
