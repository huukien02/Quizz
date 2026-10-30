import React from "react";

// Họa tiết trôi nổi phía sau nền: chữ Hangul, sao, tim, hoa
const items = [
  { char: "한", top: "8%", left: "6%", size: 44, color: "var(--k-mint-strong)", delay: "0s" },
  { char: "★", top: "16%", left: "88%", size: 30, color: "var(--k-butter-strong)", delay: "1.2s" },
  { char: "♥", top: "72%", left: "5%", size: 30, color: "var(--k-pink-strong)", delay: "0.6s" },
  { char: "ㄱ", top: "82%", left: "90%", size: 40, color: "var(--k-lav-strong)", delay: "2s" },
  { char: "✿", top: "44%", left: "94%", size: 32, color: "var(--k-pink-strong)", delay: "1.6s" },
  { char: "글", top: "48%", left: "2%", size: 36, color: "var(--k-lav-strong)", delay: "2.6s" },
  { char: "☁", top: "4%", left: "52%", size: 46, color: "var(--k-mint)", delay: "0.3s" },
  { char: "✦", top: "90%", left: "42%", size: 24, color: "var(--k-butter-strong)", delay: "1s" },
];

export default function Decor() {
  return (
    <div className="k-decor" aria-hidden="true">
      {items.map((item, i) => (
        <span
          key={i}
          className="k-decor__item k-ko"
          style={{
            top: item.top,
            left: item.left,
            fontSize: item.size,
            color: item.color,
            animationDelay: item.delay,
          }}
        >
          {item.char}
        </span>
      ))}
    </div>
  );
}
