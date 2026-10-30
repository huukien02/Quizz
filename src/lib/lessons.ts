import { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  get,
  onValue,
  remove,
  runTransaction,
  update,
} from "firebase/database";
import app from "../firebaseConfig";

export interface Lesson {
  name: string;
  title: string;
  description: string;
  custom: boolean; // Bài do người dùng tạo (mới được xoá)
}

// Các bài có sẵn; thông tin bài (tên, mô tả) và bài người dùng tạo thêm được lưu ở
// nhánh "lessons" trên Firebase dạng lessons/bai-7: { title, description, createdAt }.
// Từ vựng của bài vẫn nằm ở nhánh gốc "bai-7".
const DEFAULT_NAMES = [1, 2, 3, 4, 5, 6].map((n) => `bai-${n}`);

const LESSONS_PATH = "lessons";

const lessonNumber = (name: string) =>
  Number(/^bai-(\d+)$/.exec(name)?.[1] ?? 0);

const defaultTitle = (name: string) => `Bài ${lessonNumber(name)}`;

export const DEFAULT_LESSONS: Lesson[] = DEFAULT_NAMES.map((name) => ({
  name,
  title: defaultTitle(name),
  description: "",
  custom: false,
}));

export const nextLessonNumber = (lessons: Lesson[]) =>
  Math.max(0, ...lessons.map((l) => lessonNumber(l.name))) + 1;

// Danh sách bài (có sẵn + tự tạo), tự cập nhật khi có thay đổi
export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>(DEFAULT_LESSONS);

  useEffect(() => {
    const db = getDatabase(app);
    return onValue(ref(db, LESSONS_PATH), (snapshot) => {
      const meta: Record<string, any> = snapshot.val() ?? {};
      const names = Array.from(new Set([...DEFAULT_NAMES, ...Object.keys(meta)]));
      const merged = names.map((name) => ({
        name,
        title: meta[name]?.title || defaultTitle(name),
        description: meta[name]?.description || "",
        custom: !DEFAULT_NAMES.includes(name),
      }));
      setLessons(merged.sort((a, b) => lessonNumber(a.name) - lessonNumber(b.name)));
    });
  }, []);

  return lessons;
}

// Số từ của từng bài, tải lại mỗi khi `enabled` bật (vd. lúc mở popup chọn bài)
export function useWordCounts(lessons: Lesson[], enabled: boolean) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const db = getDatabase(app);
    Promise.all(
      lessons.map(async (l) => [l.name, (await get(ref(db, l.name))).size] as const)
    )
      .then((entries) => {
        if (!cancelled) setCounts(Object.fromEntries(entries));
      })
      .catch((error) => console.log(error));
    return () => {
      cancelled = true;
    };
  }, [lessons, enabled]);

  return counts;
}

// Tạo bài mới với số kế tiếp; dùng transaction để hai người tạo cùng lúc không ghi đè nhau
export async function createLesson(lessons: Lesson[], title: string, description: string) {
  const db = getDatabase(app);
  let n = nextLessonNumber(lessons);

  for (let attempt = 0; attempt < 5; attempt++, n++) {
    const name = `bai-${n}`;
    const value = {
      title: title.trim() || defaultTitle(name),
      description: description.trim(),
      createdAt: Date.now(),
    };
    const result = await runTransaction(ref(db, `${LESSONS_PATH}/${name}`), (current) =>
      current === null ? value : undefined
    );
    if (result.committed) return name;
  }

  throw new Error("Không tạo được bài mới");
}

export async function updateLesson(name: string, title: string, description: string) {
  const db = getDatabase(app);
  await update(ref(db, `${LESSONS_PATH}/${name}`), {
    title: title.trim() || defaultTitle(name),
    description: description.trim(),
  });
}

export class LessonNotEmptyError extends Error {}

// Chỉ xoá bài tự tạo và chưa có từ nào; kiểm tra lại trên server ngay trước khi xoá
export async function deleteLesson(name: string) {
  if (DEFAULT_NAMES.includes(name)) throw new Error("Không xoá bài có sẵn");
  const db = getDatabase(app);
  const words = await get(ref(db, name));
  if (words.exists()) throw new LessonNotEmptyError();
  await remove(ref(db, `${LESSONS_PATH}/${name}`));
}
