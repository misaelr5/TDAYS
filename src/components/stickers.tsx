import type { CSSProperties, ReactNode } from "react";
import styles from "./stickers.module.css";

// Decorative die-cut stickers. Each kind draws its silhouette twice: once thick and white
// (the paper border) and once in colour on top, so every sticker reads as cut out.
const art = {
  plane: {
    outline: ["M4 30 60 6 44 56 30 40Z"],
    fill: <><path d="M4 30 60 6 44 56 30 40Z" fill="#006cf9" /><path d="M60 6 30 40 29 53 37 45Z" fill="#0053c7" /><path d="M60 6 30 40" stroke="#ffffff8c" strokeWidth="1.5" /></>,
  },
  star: {
    outline: ["M32 4 40 23 61 24 45 37 50 58 32 47 14 58 19 37 3 24 24 23Z"],
    fill: <><path d="M32 4 40 23 61 24 45 37 50 58 32 47 14 58 19 37 3 24 24 23Z" fill="#f58634" /><path d="M24 26 31 13" stroke="#ffffffa6" strokeWidth="3" strokeLinecap="round" /></>,
  },
  heart: {
    outline: ["M32 56C10 42 4 30 8 20 12 10 26 8 32 19 38 8 52 10 56 20 60 30 54 42 32 56Z"],
    fill: <><path d="M32 56C10 42 4 30 8 20 12 10 26 8 32 19 38 8 52 10 56 20 60 30 54 42 32 56Z" fill="#006cf9" /><path d="M15 22c1-4 4-6 8-6" stroke="#ffffffa6" strokeWidth="3" strokeLinecap="round" fill="none" /></>,
  },
  suitcase: {
    outline: ["M8 20h48v34H8z", "M23 21v-8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8"],
    fill: <><path d="M23 21v-8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8" stroke="#142333" strokeWidth="4" fill="none" /><rect x="8" y="20" width="48" height="34" rx="7" fill="#006cf9" /><path d="M20 20v34M44 20v34" stroke="#f58634" strokeWidth="5" /></>,
  },
  camera: {
    outline: ["M6 18h52v36H6z", "M20 11h16v10H20z"],
    fill: <><rect x="20" y="11" width="16" height="10" rx="3" fill="#142333" /><rect x="6" y="18" width="52" height="36" rx="8" fill="#142333" /><circle cx="32" cy="36" r="12" fill="#fff" /><circle cx="32" cy="36" r="8" fill="#006cf9" /><circle cx="49" cy="25" r="3" fill="#f58634" /></>,
  },
  pin: {
    outline: ["M32 60S12 38 12 25a20 20 0 0 1 40 0c0 13-20 35-20 35Z"],
    fill: <><path d="M32 60S12 38 12 25a20 20 0 0 1 40 0c0 13-20 35-20 35Z" fill="#f58634" /><circle cx="32" cy="25" r="8" fill="#fff" /></>,
  },
} satisfies Record<string, { outline: string[]; fill: ReactNode }>;

type Place = { top?: string; right?: string; bottom?: string; left?: string };
type Shared = {
  /** Absolute position inside the nearest positioned ancestor; omit to place it in the flow. */
  at?: Place;
  tilt?: number;
  /** CSS length; clamp() keeps a sticker proportional between phone and desktop. */
  size?: string;
  only?: "mobile" | "desktop";
  className?: string;
};

function placement({ at, tilt = 0, size }: Shared) {
  return { ...at, "--tilt": `${tilt}deg`, ...(size && { "--size": size }) } as CSSProperties;
}

export function Sticker({ kind, ...props }: Shared & { kind: keyof typeof art }) {
  const { outline, fill } = art[kind];
  return <span className={`${styles.sticker} ${props.at ? styles.placed : ""} ${props.className ?? ""}`} style={placement(props)} data-only={props.only} data-sticker={kind} aria-hidden="true">
    <svg viewBox="0 0 64 64">
      <g fill="#fff" stroke="#fff" strokeWidth="9" strokeLinejoin="round">{outline.map(d => <path key={d} d={d} />)}</g>
      {fill}
    </svg>
  </span>;
}

export function TextSticker({ children, tone = "orange", ...props }: Shared & { children: ReactNode; tone?: "orange" | "blue" | "white" }) {
  return <span className={`${styles.label} ${props.at ? styles.placed : ""} ${props.className ?? ""}`} style={placement(props)} data-only={props.only} data-tone={tone} aria-hidden="true">{children}</span>;
}

/** Dashed flight path ending in a paper plane: the hero's single entrance moment. */
export function FlightPath({ className = "" }: { className?: string }) {
  return <svg className={`${styles.flight} ${className}`} viewBox="0 0 300 130" fill="none" aria-hidden="true" data-flight>
    <path d="M6 122C52 40 118 132 168 82S238 18 258 34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 10" />
    <g transform="translate(244 4) rotate(12)">
      <path d="M2 22 46 4 34 42 23 30Z" fill="#fff" stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
      <path d="M2 22 46 4 34 42 23 30Z" fill="#fff" />
      <path d="M46 4 23 30 22 40 28 34Z" fill="#c9d9ef" />
    </g>
  </svg>;
}
