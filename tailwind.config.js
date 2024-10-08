/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
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
    },
  },
  plugins: [],
}