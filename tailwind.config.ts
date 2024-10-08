import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "640px", // kích thước nhỏ
        md: "768px", // kích thước trung bình
        lg: "1024px", // kích thước lớn
        xl: "1280px", // kích thước rất lớn
        "2xl": "1536px", // kích thước cực lớn
        // Thêm điểm ngắt tùy chỉnh
        "3xl": "1920px", // ví dụ cho điểm ngắt 3xl
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
