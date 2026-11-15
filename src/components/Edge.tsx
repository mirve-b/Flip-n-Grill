const TOPS = {
  mounds:
    "M0 50 C 80 50, 90 2, 170 2 C 250 2, 260 50, 340 50 C 400 50, 420 22, 480 22 C 540 22, 560 50, 620 50 C 700 50, 720 6, 800 6 C 880 6, 900 50, 980 50 C 1040 50, 1060 26, 1110 26 C 1160 26, 1180 50, 1200 50",
  zigzag:
    "M0 60 L60 20 L120 60 L180 20 L240 60 L300 20 L360 60 L420 20 L480 60 L540 20 L600 60 L660 20 L720 60 L780 20 L840 60 L900 20 L960 60 L1020 20 L1080 60 L1140 20 L1200 60",
};

/** Wavy comic edge that sits on top of a section and bleeds its colour upward. */
export function Edge({ color, variant = "mounds" }: { color: string; variant?: keyof typeof TOPS }) {
  const top = TOPS[variant];
  return (
    <svg className="edge" viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true">
      <path d={`${top} L1200 82 L0 82 Z`} fill={color} />
      <path d={top} fill="none" stroke="#000000" strokeWidth="5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
