import type { CSSProperties } from "react";

/** One sparkle: [left %, top %, size %, colour, delay in s, shape], measured against the parent box. */
export type Spark = readonly [number, number, number, string, number, "star" | "plus" | "dot"];

/**
 * Twinkling, glitching sparkles (styles: .sparks / .spark in styles.css). Drop it inside any
 * position: relative box and the sparkles are placed around it by their percentages.
 */
export function Sparks({ items }: { items: readonly Spark[] }) {
  return (
    <span className="sparks" aria-hidden="true">
      {items.map(([x, y, z, c, d, shape], i) => (
        <i
          key={i}
          className={`spark spark--${shape}`}
          style={{ left: `${x}%`, top: `${y}%`, "--z": `${z}%`, "--c": c, animationDelay: `${d}s, ${d * 1.7}s` } as CSSProperties}
        />
      ))}
    </span>
  );
}
