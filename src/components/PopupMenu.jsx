"use client";
import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { MdMenu } from "react-icons/md"; // icon menu
import Link from "next/link";
import Mascot from "./Mascot";

const items = [
  { href: "/", emoji: "🏠", label: "Trang chủ", desc: "Thẻ từ vựng", bg: "var(--k-mint)" },
  { href: "/test", emoji: "🧠", label: "Test", desc: "Kiểm tra trắc nghiệm", bg: "var(--k-lav)" },
  { href: "/read", emoji: "🗣️", label: "Read", desc: "Luyện phát âm", bg: "var(--k-pink)" },
];

export default function PopupMenu() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);

  return (
    <>
      {/* Nút mở menu */}
      <button
        ref={btnRef}
        onClick={() => setOpen(true)}
        className="k-btn k-btn--icon k-btn--ghost"
        aria-label="Mở menu"
        title="Menu"
      >
        <MdMenu size={24} />
      </button>

      {/* Popup */}
      {/* Render bên trong .k-root để popup ăn theo theme sáng/tối của trang */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        container={() => btnRef.current?.closest(".k-root") ?? document.body}
        PaperProps={{
          sx: {
            borderRadius: "28px",
            minWidth: 280,
            p: 1.5,
            bgcolor: "var(--k-bg)",
            border: "2px solid var(--k-line)",
            boxShadow: "0 8px 0 var(--k-line)",
            fontFamily: "Nunito, sans-serif",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
            pb: 1,
            fontFamily: "Jua, Nunito, sans-serif",
            color: "var(--k-ink)",
          }}
        >
          <Mascot size={64} mood="excited" />
          어디로 갈까요?
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <List sx={{ display: "flex", flexDirection: "column", gap: 1, px: 1 }}>
            {items.map((item, i) => (
              <ListItemButton
                key={item.href}
                component={Link}
                href={item.href}
                onClick={() => setOpen(false)}
                className="k-anim-rise"
                style={{ animationDelay: `${i * 0.08}s` }}
                sx={{
                  gap: 1.5,
                  borderRadius: "18px",
                  bgcolor: "var(--k-surface)",
                  border: "2px solid var(--k-line)",
                  boxShadow: "0 4px 0 var(--k-line)",
                  transition: "transform .15s",
                  "&:hover": { bgcolor: item.bg, transform: "translateY(-2px)" },
                }}
              >
                <span
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 14,
                    background: item.bg,
                    fontSize: 20,
                  }}
                >
                  {item.emoji}
                </span>
                <ListItemText
                  primary={item.label}
                  secondary={item.desc}
                  primaryTypographyProps={{
                    sx: { fontFamily: "Nunito, sans-serif", fontWeight: 800, color: "var(--k-ink)" },
                  }}
                  secondaryTypographyProps={{
                    sx: { fontFamily: "Nunito, sans-serif", fontWeight: 600, color: "var(--k-muted)" },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}
