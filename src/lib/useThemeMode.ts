import { useEffect, useState } from "react";

// Chế độ sáng/tối dùng chung cho mọi trang, lưu trong localStorage
const KEY = "k-theme";

export type ThemeMode = "light" | "dark";

export default function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>("dark");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "light" || saved === "dark") setMode(saved);
    } catch {}
  }, []);

  const updateMode = (next: ThemeMode) => {
    setMode(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {}
  };

  return [mode, updateMode] as const;
}
