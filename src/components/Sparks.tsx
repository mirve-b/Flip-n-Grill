import { useId, type CSSProperties } from "react";

/** One sparkle: [left %, top %, size %, colour, delay in s, shape], measured against the parent box. */
export type Spark = readonly [number, number, number, string, number, "star" | "plus" | "dot"];

// the shapes, drawn as SVG (not CSS clip-path: Chrome turns every animated clip-path into its own masked
// graphics layer, which made phones like the Pixel stutter)
const SHAPES = {
  star: <polygon points="50,0 60,40 100,50 60,60 50,100 40,60 0,50 40,40" />,
  plus: <polygon points="40,0 60,0 60,40 100,40 100,60 60,60 60,100 40,100 40,60 0,60 0,40 40,40" />,
  dot: <circle cx="50" cy="50" r="50" />,
};

/**
 * Twinkling, glitching sparkles (styles: .sparks / .spark in styles.css). Drop it inside any
 * position: relative box and the sparkles are placed around it by their percentages.
 * Each one is its shape plus a pink/cyan copy behind it that flashes when it glitches.
 */
export function Sparks({ items }: { items: readonly Spark[] }) {
  const split = `spark-split-${useId().replace(/:/g, "")}`;
  return (
    <span className="sparks" aria-hidden="true">
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <linearGradient id={split}>
          <stop offset=".5" stopColor="#ff2fd0" />
          <stop offset=".5" stopColor="#00e5ff" />
        </linearGradient>
      </svg>
      {items.map(([x, y, z, c, d, shape], i) => (
        <i key={i} className="spark" style={{ left: `${x}%`, top: `${y}%`, "--z": `${z}%`, "--c": c, "--d": `${d}s` } as CSSProperties}>
          <svg className="spark__split" viewBox="0 0 100 100" fill={`url(#${split})`}>{SHAPES[shape]}</svg>
          <svg className="spark__shape" viewBox="0 0 100 100">{SHAPES[shape]}</svg>
        </i>
      ))}
    </span>
  );
}
