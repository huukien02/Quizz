import React, { useState } from "react";

// Linh vật "Dưa Hấu": miếng dưa hấu biết chớp mắt, bay lơ lửng và đổi biểu cảm
type Mood = "happy" | "excited" | "sad";

interface Props {
  size?: number;
  mood?: Mood;
  className?: string;
}

const mouths: Record<Mood, React.ReactNode> = {
  happy: (
    <path
      d="M53 69 Q60 77 67 69"
      fill="none"
      stroke="#5B2A3C"
      strokeWidth="3"
      strokeLinecap="round"
    />
  ),
  excited: <path d="M51 67 Q60 83 69 67 Z" fill="#5B2A3C" />,
  sad: (
    <path
      d="M53 75 Q60 68 67 75"
      fill="none"
      stroke="#5B2A3C"
      strokeWidth="3"
      strokeLinecap="round"
    />
  ),
};

export default function Mascot({ size = 96, mood = "happy", className = "" }: Props) {
  const [wiggle, setWiggle] = useState(false);

  return (
    <div
      className={`k-mascot ${wiggle ? "is-wiggle" : ""} k-mascot--${mood} ${className}`}
      style={{ width: size, height: size }}
      onClick={() => setWiggle(true)}
      onAnimationEnd={(e) => {
        if (e.animationName === "k-wiggle") setWiggle(false);
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 120" width={size} height={size}>
        <ellipse className="k-mascot__shadow" cx="60" cy="112" rx="30" ry="5" fill="#000" opacity="0.12" />
        <g className="k-mascot__body">
          {/* Tay */}
          <ellipse className="k-mascot__arm k-mascot__arm--left" cx="10" cy="58" rx="7" ry="9" fill="#6FCF97" />
          <ellipse className="k-mascot__arm k-mascot__arm--right" cx="110" cy="58" rx="7" ry="9" fill="#6FCF97" />
          {/* Chân */}
          <ellipse cx="47" cy="102" rx="8" ry="5" fill="#4FB57D" />
          <ellipse cx="73" cy="102" rx="8" ry="5" fill="#4FB57D" />
          {/* Vỏ, cùi, ruột */}
          <path d="M8 46 A52 52 0 0 0 112 46 Z" fill="#6FCF97" stroke="#4FB57D" strokeWidth="3" strokeLinejoin="round" />
          <path d="M15 46 A45 45 0 0 0 105 46 Z" fill="#F3FFF6" />
          <path d="M20 46 A40 40 0 0 0 100 46 Z" fill="#FF8FAB" />
          <path d="M24 46 L96 46" stroke="#FFB3C6" strokeWidth="4" strokeLinecap="round" />
          {/* Hạt */}
          <ellipse cx="34" cy="64" rx="2.4" ry="3.6" fill="#5B2A3C" transform="rotate(-25 34 64)" />
          <ellipse cx="86" cy="64" rx="2.4" ry="3.6" fill="#5B2A3C" transform="rotate(25 86 64)" />
          <ellipse cx="48" cy="80" rx="2.4" ry="3.6" fill="#5B2A3C" transform="rotate(-15 48 80)" />
          <ellipse cx="72" cy="80" rx="2.4" ry="3.6" fill="#5B2A3C" transform="rotate(15 72 80)" />
          {/* Má hồng */}
          <ellipse cx="40" cy="66" rx="6" ry="3.5" fill="#FF5C8A" opacity="0.45" />
          <ellipse cx="80" cy="66" rx="6" ry="3.5" fill="#FF5C8A" opacity="0.45" />
          {/* Mắt */}
          <g className="k-mascot__eyes">
            <ellipse cx="47" cy="58" rx="4" ry="5" fill="#2E2333" />
            <ellipse cx="73" cy="58" rx="4" ry="5" fill="#2E2333" />
            <circle cx="48.5" cy="56" r="1.5" fill="#fff" />
            <circle cx="74.5" cy="56" r="1.5" fill="#fff" />
          </g>
          {mouths[mood]}
        </g>
        {/* Lấp lánh */}
        <path
          className="k-mascot__spark"
          d="M104 12 L106.5 19 L113 21 L106.5 23 L104 30 L101.5 23 L95 21 L101.5 19 Z"
          fill="#FFD15C"
        />
      </svg>
    </div>
  );
}
