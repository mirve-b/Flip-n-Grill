/** Splits a heading into per-character spans so GSAP can slam them in. */
export function SplitTitle({ text, className = "section__title", children }: { text: string; className?: string; children?: React.ReactNode }) {
  return (
    <h2 className={`${className} split`} aria-label={text}>
      {text.split(" ").map((word, w) => (
        <span className="word" aria-hidden="true" key={w}>
          {[...word].map((ch, i) => (
            <span className="char" key={i}>
              {ch}
            </span>
          ))}
        </span>
      ))}
      {children}
    </h2>
  );
}
