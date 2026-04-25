"use client";

import { cn } from "@/lib/utils";

const STYLES = `
@keyframes bibleBreath {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}
@keyframes bibleShine {
  0% { transform: translateX(-40px) skewX(-20deg); }
  60% { transform: translateX(140px) skewX(-20deg); }
  100% { transform: translateX(140px) skewX(-20deg); }
}
@keyframes bibleBookmark {
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(3deg); }
}
@keyframes bibleFadeIn {
  0%, 60% { opacity: 0; }
  100% { opacity: 1; }
}
.bible-loader-root {
  animation: bibleFadeIn 350ms ease-out both;
}
.bible-loader-breath {
  animation: bibleBreath 2.4s ease-in-out infinite;
  transform-origin: center;
}
.bible-loader-shine {
  animation: bibleShine 2.6s ease-in-out infinite;
}
.bible-loader-bookmark {
  animation: bibleBookmark 2.8s ease-in-out infinite;
  transform-box: fill-box;
  transform-origin: 50% 0%;
}
`;

export function BibleLoader({
  label = "Carregando",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bible-loader-root flex flex-col items-center gap-4",
        className,
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <ClosedBookSvg />
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function ClosedBookSvg() {
  return (
    <svg
      width="96"
      height="120"
      viewBox="0 0 96 124"
      role="img"
      aria-label="Carregando"
      className="bible-loader-breath"
    >
      <defs>
        <linearGradient id="bl-cover" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary) / 0.95)" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.65)" />
        </linearGradient>
        <linearGradient id="bl-shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="50%" stopColor="white" stopOpacity="0.45" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id="bl-cover-clip">
          <rect x="8" y="8" width="80" height="100" rx="4" />
        </clipPath>
      </defs>

      <rect
        x="11"
        y="11"
        width="78"
        height="100"
        rx="3"
        fill="hsl(var(--card))"
        opacity="0.6"
      />
      <rect
        x="9.5"
        y="9.5"
        width="79"
        height="100"
        rx="3"
        fill="hsl(var(--card))"
        opacity="0.85"
      />

      <rect x="8" y="8" width="80" height="100" rx="4" fill="url(#bl-cover)" />

      <rect
        x="8"
        y="8"
        width="6"
        height="100"
        rx="1"
        fill="hsl(var(--primary) / 0.45)"
      />

      <rect
        x="20"
        y="20"
        width="56"
        height="76"
        rx="2"
        fill="none"
        stroke="hsl(var(--primary-foreground) / 0.3)"
        strokeWidth="0.7"
      />

      <g
        transform="translate(48, 58)"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2.4"
        strokeLinecap="round"
      >
        <line x1="0" y1="-14" x2="0" y2="14" />
        <line x1="-8" y1="-3" x2="8" y2="-3" />
      </g>

      <g clipPath="url(#bl-cover-clip)">
        <rect
          x="-30"
          y="-10"
          width="30"
          height="130"
          fill="url(#bl-shine)"
          className="bible-loader-shine"
        />
      </g>

      <g className="bible-loader-bookmark">
        <path
          d="M 68 8 L 68 122 L 73 116 L 78 122 L 78 8 Z"
          fill="hsl(var(--destructive, 0 80% 55%) / 0.85)"
        />
      </g>
    </svg>
  );
}
