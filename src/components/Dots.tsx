import type { CSSProperties } from "react";

/** A small grid of black dots (decoration). */
export function Dots({ cols = 4, rows = 4, className = "" }: { cols?: number; rows?: number; className?: string }) {
  return <span className={`dots ${className}`} style={{ "--cols": cols, "--rows": rows } as CSSProperties} aria-hidden="true" />;
}
