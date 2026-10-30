import React, { useRef, useState } from "react";
import { Dialog } from "@mui/material";
import { MdKeyboardArrowDown, MdDeleteOutline, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import Mascot from "./Mascot";
import NewLessonButton from "./NewLessonButton";
import LessonFormDialog from "./LessonFormDialog";
import {
  Lesson,
  LessonNotEmptyError,
  deleteLesson,
  updateLesson,
  useWordCounts,
} from "../lib/lessons";

interface Props {
  lessons: Lesson[];
  value: string;
  onChange: (name: string) => void;
  // Có prop này thì cho tạo / sửa / xoá bài
  onCreated?: (name: string) => void;
  onDeleted?: (name: string) => void;
}

const paperSx = {
  borderRadius: "28px",
  maxWidth: "calc(100vw - 32px)",
  p: 3,
  bgcolor: "var(--k-bg)",
  color: "var(--k-ink)",
  border: "2px solid var(--k-line)",
  boxShadow: "0 8px 0 var(--k-line)",
};

// Nút hiện bài đang chọn, bấm vào mở popup lưới để chọn bài
export default function LessonPicker({ lessons, value, onChange, onCreated, onDeleted }: Props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [deleting, setDeleting] = useState<Lesson | null>(null);
  const [busy, setBusy] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const manage = !!onCreated;
  const counts = useWordCounts(lessons, open);
  const current = lessons.find((l) => l.name === value);
  const container = () => btnRef.current?.closest(".k-root") ?? document.body;

  const choose = (name: string) => {
    setOpen(false);
    onChange(name);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await deleteLesson(deleting.name);
      toast.success(`Đã xoá "${deleting.title}"`);
      onDeleted?.(deleting.name);
      setDeleting(null);
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof LessonNotEmptyError
          ? "Bài này vừa có từ vựng nên không xoá được"
          : "Không xoá được bài, thử lại nhé"
      );
      setDeleting(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        ref={btnRef}
        className="k-btn k-btn--ghost k-picker"
        onClick={() => setOpen(true)}
      >
        <span className="k-picker__icon">📘</span>
        <span className="k-picker__text">
          <small>Bài đang học</small>
          <span>{current ? current.title : "Chọn bài"}</span>
          {current?.description && <em>{current.description}</em>}
        </span>
        <MdKeyboardArrowDown size={24} />
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        container={container}
        PaperProps={{ sx: { ...paperSx, width: 560 } }}
      >
        <div className="flex flex-col items-center gap-[4px] mb-[16px] text-center">
          <Mascot size={64} mood="excited" />
          <h2 className="k-ko text-[24px]">어떤 수업을 할까요?</h2>
          <p className="font-bold" style={{ color: "var(--k-muted)" }}>
            Chọn bài bạn muốn học
          </p>
        </div>

        <div className="k-lesson-grid">
          {lessons.map((item, i) => {
            const count = counts[item.name];
            const canDelete = manage && item.custom && count === 0;
            return (
              <div
                key={item.name}
                role="button"
                tabIndex={0}
                className={`k-lesson-tile ${value === item.name ? "is-active" : ""}`}
                style={{ animationDelay: `${i * 0.03}s` }}
                onClick={() => choose(item.name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    choose(item.name);
                  }
                }}
              >
                {manage && (
                  <div className="k-lesson-tile__actions">
                    <button
                      aria-label={`Sửa ${item.title}`}
                      title="Sửa tên, mô tả"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditing(item);
                      }}
                    >
                      <MdEdit size={16} />
                    </button>
                    {canDelete && (
                      <button
                        className="is-danger"
                        aria-label={`Xoá ${item.title}`}
                        title="Xoá bài trống"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleting(item);
                        }}
                      >
                        <MdDeleteOutline size={16} />
                      </button>
                    )}
                  </div>
                )}
                <span className="k-lesson-tile__emoji">📘</span>
                <span className="k-lesson-tile__title">{item.title}</span>
                {item.description && (
                  <span className="k-lesson-tile__desc" title={item.description}>
                    {item.description}
                  </span>
                )}
                <span className="k-lesson-tile__count">
                  {count === undefined ? "…" : `${count} từ`}
                </span>
              </div>
            );
          })}
          {onCreated && (
            <NewLessonButton
              lessons={lessons}
              onCreated={(name) => {
                setOpen(false);
                onCreated(name);
              }}
            />
          )}
        </div>
      </Dialog>

      {/* Sửa tên, mô tả */}
      <LessonFormDialog
        open={!!editing}
        onClose={() => setEditing(null)}
        heading="수업 수정 ✏️"
        submitLabel="Lưu"
        placeholder={editing?.title ?? ""}
        initialTitle={editing?.title}
        initialDescription={editing?.description}
        container={container}
        onSubmit={async (title, description) => {
          if (!editing) return;
          try {
            await updateLesson(editing.name, title, description);
            toast.success("Đã lưu thay đổi");
            setEditing(null);
          } catch (error) {
            console.log(error);
            toast.error("Không lưu được, thử lại nhé");
          }
        }}
      />

      {/* Xác nhận xoá */}
      <Dialog
        open={!!deleting}
        onClose={() => !busy && setDeleting(null)}
        container={container}
        PaperProps={{ sx: { ...paperSx, width: 360 } }}
      >
        <div className="flex flex-col items-center gap-[12px] text-center">
          <Mascot size={80} mood="sad" />
          <h2 className="k-ko text-[22px]">삭제할까요?</h2>
          <p className="font-bold">
            Xoá bài <strong>“{deleting?.title}”</strong>? Bài này chưa có từ nào.
          </p>
          <div className="flex gap-[10px] w-full mt-[6px]">
            <button
              className="k-btn k-btn--ghost flex-1"
              disabled={busy}
              onClick={() => setDeleting(null)}
            >
              Huỷ
            </button>
            <button className="k-btn k-btn--pink flex-1" disabled={busy} onClick={handleDelete}>
              {busy ? "Đang xoá..." : "Xoá"}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
