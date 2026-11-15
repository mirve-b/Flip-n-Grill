import { useMemo } from "react";
import { lowEnd } from "../lib/device";

/** Twinkling 4-point stars scattered over a section. Deterministic per count. */
export function Sparkles({ count: wanted = 10, color = "var(--cream)" }: { count?: number; color?: string }) {
  const count = lowEnd ? Math.ceil(wanted / 3) : wanted;
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const r = (n: number) => ((Math.sin(i * 127.1 + n * 311.7) * 43758.5453) % 1 + 1) % 1;
        return { left: r(1) * 100, top: r(2) * 100, size: 12 + r(3) * 22, delay: r(4) * 3, dur: 1.6 + r(5) * 2 };
      }),
    [count],
  );
  return (
    <div className="sparkles" aria-hidden="true">
      {stars.map((s, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
            color,
          }}
        >
          <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="currentColor" stroke="#000000" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}
