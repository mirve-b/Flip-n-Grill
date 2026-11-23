import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import "./brand.css";

/**
 * The brand book (#brand) as a slide deck: one full-screen slide at a time. Move with the arrow keys / space /
 * page keys, a wheel or trackpad flick, a swipe, or the dots on the right edge. Each slide glides in, then its
 * pieces play their own entrance (".in" items, staggered by --d; see brand.css). Deliberately few words.
 */

// the logo files in public/brand/; while WORDMARK is empty its slot shows a placeholder
const LOGO = "/brand/logo.svg";
const WORDMARK = "";

const COLOURS = [
  { name: "Primary", hex: "#006267", ink: "#f1d7b3" },
  { name: "Secondary", hex: "#FF9400", ink: "#1d130e" },
  { name: "Accent 01", hex: "#D54000", ink: "#f1d7b3" },
  { name: "Accent 02", hex: "#FFD23F", ink: "#1d130e" },
  { name: "Light", hex: "#F1D7B3", ink: "#1d130e" },
  { name: "Dark", hex: "#1D130E", ink: "#f1d7b3" },
];

const BOYS = [
  { who: 1, tag: "I flip", say: "OUCH!", bg: "var(--orange)" },
  { who: 2, tag: "I grill", say: "Careful!", bg: "var(--cream)" },
] as const;

type InProps = {
  d?: number; as?: "div" | "p" | "h1" | "span" | "figure" | "ul" | "a"; className?: string; style?: CSSProperties; children?: ReactNode;
  href?: string; target?: string; rel?: string; "aria-label"?: string;
};
/** an item that plays its entrance when its slide comes in; d = its place in the stagger */
const In = ({ d = 0, as: Tag = "div", className = "", style, children, ...rest }: InProps) => (
  <Tag className={`in ${className}`} style={{ ...style, "--d": d } as CSSProperties} {...rest}>{children}</Tag>
);

const Head = ({ n, title }: { n: string; title: string }) => (
  <h2 className="bb-h in in--drop" style={{ "--d": 0 } as CSSProperties}><span>{n}</span> {title}</h2>
);

/* ---------- the slides ---------- */
const SLIDES: { key: string; label: string; body: ReactNode }[] = [
  {
    key: "intro", label: "MABLE",
    body: (
      <div className="bb-intro">
        <div className="bb-intro__text">
          <In as="p" d={1} className="bb-intro__kicker">A MABLE STD project</In>
          <In as="h1" d={2} className="bb-intro__title">Flip &amp; Grill</In>
          <In as="p" d={3} className="bb-intro__sub">Brand book · Vol. 01</In>
          <In as="a" d={6} className="bb-intro__credit" href="https://mable.cc" target="_blank" rel="noopener">
            Designed &amp; engineered by <b>MABLE STD</b> <span aria-hidden="true">↗</span>
          </In>
        </div>
      </div>
    ),
  },
  {
    key: "lettering", label: "Lettering",
    body: (
      <div className="bb-sec bb-logo">
        <Head n="01" title="Lettering" />
        <div className="bb-logo__grid">
          {[
            ["var(--teal)", "var(--orange)", "On grill"],
            ["var(--orange)", "var(--teal)", "On flip"],
            ["var(--cream)", "var(--ink)", "On bun"],
            ["var(--ink)", "var(--cream)", "On char"],
          ].map(([bg, fg, label], i) => (
            <In as="figure" key={label} d={1 + i} className="bb-logo__tile in--pop" style={{ "--bg": bg, "--fg": fg } as CSSProperties}>
              <span className="bb-mark">FLIP<b>&amp;</b>GRILL</span>
              <figcaption>{label}</figcaption>
            </In>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "colour", label: "Colour",
    body: (
      <div className="bb-sec bb-colour">
        <Head n="02" title="Colour" />
        <div className="bb-colour__row">
          {COLOURS.map((c, i) => (
            <In key={c.name} d={1 + i * 0.6} className="bb-chip in--rise" style={{ "--c": c.hex, "--i": c.ink } as CSSProperties}>
              <strong>{c.name}</strong>
              <span>{c.hex}</span>
            </In>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "type", label: "Type",
    body: (
      <div className="bb-sec bb-type">
        <Head n="03" title="Type" />
        <div className="bb-type__grid">
          {[
            ["head", "Londrina Solid", "Headlines. Big, fat, happy."],
            ["body", "Konkhmer Sleokchher", "Everything you read."],
            ["mono", "Apple Symbols / Space Mono", "Labels, receipts, fine print."],
          ].map(([k, name, use], i) => (
            <In key={k} d={1 + i} className={`bb-font bb-font--${k} in--pop`}>
              <span className="bb-font__aa">Aa</span>
              <strong>{name}</strong>
              <em>{use}</em>
            </In>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "boys", label: "The boys",
    body: (
      <div className="bb-sec bb-boys">
        <Head n="04" title="The boys" />
        <div className="bb-boys__row">
          {BOYS.map((b, i) => (
            <In as="figure" key={b.who} d={1 + i * 1.5} className="bb-boy in--hop" style={{ "--bg": b.bg } as CSSProperties}>
              <span className="bb-boy__say">{b.say}</span>
              <img src={`/mascots/omar-${b.who}.webp`} alt={`Omar ${b.who}`} />
              <figcaption>
                <b>Omar 0{b.who}</b>
                <span className="bb-pill">{b.tag}</span>
              </figcaption>
            </In>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "logo", label: "Logo",
    body: (
      <div className="bb-sec bb-mark-sec">
        <Head n="05" title="Logo" />
        <div className="bb-marks">
          <In as="figure" d={1} className="bb-slot bb-slot--logo in--pop">
            {LOGO ? <img src={LOGO} alt="Flip & Grill logo" /> : <span className="bb-slot__empty">Logo</span>}
            <figcaption>Logo</figcaption>
          </In>
          <In as="figure" d={2} className="bb-slot bb-slot--word in--pop">
            {WORDMARK ? <img src={WORDMARK} alt="Flip & Grill wordmark" /> : <span className="bb-slot__empty">Wordmark · coming soon</span>}
            <figcaption>Wordmark</figcaption>
          </In>
        </div>
      </div>
    ),
  },
  {
    key: "voice", label: "Voice",
    body: (
      <div className="bb-sec bb-voice">
        <Head n="06" title="Voice" />
        <div className="bb-voice__words">
          <In as="span" d={1} className="in--stamp">Comic.</In>
          <In as="span" d={2} className="in--stamp">Whimsical.</In>
          <In as="span" d={3} className="in--stamp">Full of character.</In>
        </div>
        <div className="bb-voice__eg">
          {["“SMASH!”", "“Two guys. Both named Omar.”", "“Come hungry again.”"].map((t, i) => (
            <In as="span" key={t} d={5 + i * 0.7} className="bb-say in--pop">{t}</In>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: "end", label: "Fin",
    body: (
      <div className="bb-end">
        <In d={0} className="in--pop"><img className="bb-end__logo" src={LOGO} alt="Flip & Grill" /></In>
        <In as="a" d={2} className="btn btn--cream" href="#top">Back to the burgers</In>
        <In as="a" d={3} className="bb-end__credit" href="https://mable.cc" target="_blank" rel="noopener">
          Designed &amp; engineered by MABLE STD ↗
        </In>
      </div>
    ),
  },
];

// phones and upright tablets: the slides become one native, snap-assisted scroll instead of a swipe deck
const FLOW_QUERY = "(orientation: portrait) and (max-width: 1024px)";
function useFlow() {
  const [flow, setFlow] = useState(() => matchMedia(FLOW_QUERY).matches);
  useEffect(() => {
    const mq = matchMedia(FLOW_QUERY);
    const on = () => setFlow(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return flow;
}

export function BrandBook() {
  const [index, setIndex] = useState(0);
  const flow = useFlow();
  const [seen, setSeen] = useState<ReadonlySet<number>>(() => new Set([0]));
  const deck = useRef<HTMLDivElement>(null);
  const lock = useRef(0);
  const last = SLIDES.length - 1;

  // jump straight to a slide (dots, buttons, Home/End)
  const go = useCallback((to: number) => setIndex((i) => {
    const n = Math.max(0, Math.min(last, to));
    if (n !== i) lock.current = performance.now() + 850;
    return n;
  }), [last]);
  // one step from a key, wheel or swipe: ignored while a slide is still gliding in, so one gesture = one slide
  const step = useCallback((dir: 1 | -1) => setIndex((i) => {
    if (performance.now() < lock.current) return i;
    const n = Math.max(0, Math.min(last, i + dir));
    if (n !== i) lock.current = performance.now() + 850;
    return n;
  }), [last]);

  // the page behind the deck doesn't scroll while it's open
  useEffect(() => {
    document.documentElement.classList.add("deck-open");
    return () => document.documentElement.classList.remove("deck-open");
  }, []);

  // flow mode: a slide plays its entrance the first time it scrolls into view; the dot follows the slide in view
  useEffect(() => {
    const el = deck.current;
    if (!flow || !el) return;
    const slides = [...el.querySelectorAll<HTMLElement>(".slide")];
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const i = slides.indexOf(e.target as HTMLElement);
        if (e.intersectionRatio >= 0.5 || e.intersectionRect.height >= el.clientHeight * 0.5) setIndex(i);
        setSeen((s) => (s.has(i) ? s : new Set(s).add(i)));
      }
    }, { root: el, threshold: [0.25, 0.5] });
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [flow]);

  // keys, wheel / trackpad and swipes (deck mode only). A slide taller than the screen scrolls first.
  useEffect(() => {
    const el = deck.current;
    if (flow || !el) return;
    const canScroll = (dir: number) => {
      const s = el.querySelector<HTMLElement>(".slide.is-active");
      if (!s || s.scrollHeight <= s.clientHeight + 2) return false;
      return dir > 0 ? s.scrollTop + s.clientHeight < s.scrollHeight - 2 : s.scrollTop > 2;
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); step(1); }
      else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); step(-1); }
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(last);
    };
    let acc = 0;
    let accTimer = 0;
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const dir = Math.sign(delta);
      if (!dir || canScroll(dir)) return;
      e.preventDefault();
      acc += delta;
      clearTimeout(accTimer);
      accTimer = window.setTimeout(() => (acc = 0), 200);
      if (Math.abs(acc) > 40) { step(acc > 0 ? 1 : -1); acc = 0; }
    };
    let sx = 0;
    let sy = 0;
    const onStart = (e: TouchEvent) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      const sideways = Math.abs(dx) > Math.abs(dy);
      const d = sideways ? dx : dy;
      if (Math.abs(d) < 50) return;
      const dir = d < 0 ? 1 : -1;
      if (!sideways && canScroll(dir)) return;
      step(dir);
    };
    window.addEventListener("keydown", onKey);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
      clearTimeout(accTimer);
    };
  }, [go, step, last, flow]);

  return (
    <div className={`deck${flow ? " is-flow" : ""}`} ref={deck} id="brand-book" data-slide={SLIDES[index].key}>
      {SLIDES.map((s, i) => (
        <section
          key={s.key}
          className={`slide slide--${s.key} ${(flow ? seen.has(i) : i === index) ? "is-active" : ""} ${!flow && i < index ? "is-past" : ""}`}
          aria-hidden={!flow && i !== index}
          aria-label={`${i + 1} of ${SLIDES.length}: ${s.label}`}
        >
          {s.body}
        </section>
      ))}

      <a className="deck__back" href="#top">← Back to the burgers</a>
      <nav className="deck__dots" aria-label="Slides">
        {SLIDES.map((s, i) => (
          <button key={s.key} aria-current={i === index} aria-label={`Slide ${i + 1}: ${s.label}`} className={i === index ? "is-on" : ""} onClick={() => (flow ? deck.current?.querySelectorAll(".slide")[i]?.scrollIntoView({ behavior: "smooth" }) : go(i))} />
        ))}
      </nav>
    </div>
  );
}
