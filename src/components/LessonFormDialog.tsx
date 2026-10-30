import React, { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import Mascot from "./Mascot";

interface Props {
  open: boolean;
  onClose: () => void;
  heading: string;
  submitLabel: string;
  placeholder: string; // Tên bài dùng khi bỏ trống
  initialTitle?: string;
  initialDescription?: string;
  onSubmit: (title: string, description: string) => Promise<void>;
  container?: () => Element;
}

// Popup nhập tên và mô tả bài, dùng cho cả tạo mới và chỉnh sửa
export default function LessonFormDialog({
  open,
  onClose,
  heading,
  submitLabel,
  placeholder,
  initialTitle = "",
  initialDescription = "",
  onSubmit,
  container,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setDescription(initialDescription);
    }
  }, [open, initialTitle, initialDescription]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onSubmit(title, description);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !saving && onClose()}
      container={container}
      PaperProps={{
        sx: {
          borderRadius: "28px",
          width: 380,
          maxWidth: "calc(100vw - 32px)",
          p: 3,
          bgcolor: "var(--k-bg)",
          color: "var(--k-ink)",
          border: "2px solid var(--k-line)",
          boxShadow: "0 8px 0 var(--k-line)",
        },
      }}
    >
      <form
        className="flex flex-col items-center gap-[12px] text-center"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Mascot size={72} mood="excited" />
        <h2 className="k-ko text-[24px]">{heading}</h2>
        <label className="k-field">
          <span>Tên bài</span>
          <input
            autoFocus
            className="k-input"
            value={title}
            maxLength={40}
            placeholder={placeholder}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="k-field">
          <span>Mô tả (không bắt buộc)</span>
          <textarea
            className="k-input"
            rows={3}
            value={description}
            maxLength={200}
            placeholder="VD: Từ vựng về các thành viên trong gia đình"
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <div className="flex gap-[10px] w-full mt-[6px]">
          <button
            type="button"
            className="k-btn k-btn--ghost flex-1"
            disabled={saving}
            onClick={onClose}
          >
            Huỷ
          </button>
          <button type="submit" className="k-btn flex-1" disabled={saving}>
            {saving ? "Đang lưu..." : submitLabel}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
