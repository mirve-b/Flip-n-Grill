import { useEffect, useRef, useState } from "react";
import { Sparks, type Spark } from "./Sparks";

/**
 * Hero: the paper-collage poster (the nav lives in Nav.tsx). Every piece is placed on a fixed-ratio stage
 * (see .hero__stage in styles.css), so the composition scales as one unit.
 * Little bits of life: smack the burger and it jiggles; the two Omars float,
 * shuffle away from the cursor and complain when it gets too close.
 */
// sparkles around the burger: [left %, top %, size %, colour, delay s, shape], all relative to the burger
const SPARKS: readonly Spark[] = [
  [-7, 12, 11, "#ffd23f", 0, "star"],
  [30, -14, 7, "#ff9400", 1.2, "plus"],
  [95, 2, 12, "#ffd23f", 0.6, "star"],
  [106, 34, 6.5, "#f1d7b3", 1.8, "plus"],
  [100, 74, 9, "#ffd23f", 0.3, "star"],
  [78, 100, 7, "#f1d7b3", 1.4, "star"],
  [2, 86, 8, "#ffd23f", 0.9, "plus"],
  [-12, 54, 8, "#f1d7b3", 2.1, "star"],
] as const;

/* phones and tablets held upright hide the desktop collage (same query as styles.css); sideways they get the desktop layout */
const NARROW = "(orientation: portrait) and (max-width: 1024px)";

function useNarrow() {
  const [narrow, setNarrow] = useState(() => matchMedia(NARROW).matches);
  useEffect(() => {
    const mq = matchMedia(NARROW);
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return narrow;
}

const BOYS = [
  { who: 1, cls: "boy--1", say: "OUCH!", tag: "I flip" },
  { who: 2, cls: "boy--2", say: "Careful!", tag: "I grill" },
] as const;

export function Hero() {
  const stage = useRef<HTMLDivElement>(null);
  const burger = useRef<HTMLButtonElement>(null);
  const narrow = useNarrow();

  // the two boys edge away from a nearby cursor (or a tap) and say something
  useEffect(() => {
    const el = stage.current;
    if (!el || narrow || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const boys = [...el.querySelectorAll<HTMLElement>(".boy")];
    let frame = 0;
    let px = -1e4;
    let py = -1e4;

    const update = () => {
      frame = 0;
      for (const b of boys) {
        const r = b.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = cx - px;
        const dy = cy - py;
        const d = Math.hypot(dx, dy) || 1;
        const reach = r.width * 1.3;
        const k = Math.max(0, 1 - d / reach);
        const push = k * r.width * 0.35;
        const dodge = b.querySelector<HTMLElement>(".boy__dodge")!;
        dodge.style.transform = `translate(${((dx / d) * push).toFixed(1)}px, ${((dy / d) * push * 0.6).toFixed(1)}px) rotate(${((dx / d) * k * 8).toFixed(1)}deg)`;
        b.classList.toggle("is-near", k > 0.35);
      }
    };
    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const leave = () => {
      if (px === -1e4) return; // nothing to reset
      px = py = -1e4;
      if (!frame) frame = requestAnimationFrame(update);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerdown", move);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointercancel", leave); // a touch that turns into a scroll
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerdown", move);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointercancel", leave);
    };
  }, [narrow]);

  // smack the burger: restart the jiggle every click
  const smack = () => {
    const b = burger.current;
    if (!b) return;
    b.classList.remove("is-smacked");
    void b.offsetWidth;
    b.classList.add("is-smacked");
  };

  return (
    <header className="hero" id="top">
      <div className="hero__stage" ref={stage}>

        <img decoding="async" fetchPriority="low" className="h h--burst-a" src="/art/starburst.webp" alt="" />
        <img decoding="async" fetchPriority="low" className="h h--burst-b" src="/art/starburst.webp" alt="" />
        {!narrow && (
          <>
            <img decoding="async" fetchPriority="low" className="h h--paper h--lift" src="/art/iba-paper.webp" width={800} height={1263} alt="" />
            <img decoding="async" fetchPriority="low" className="h h--plate h--lift" src="/art/menu-plate.webp" width={1200} height={773} alt="" />
            <img decoding="async" fetchPriority="low" className="h h--two h--lift" src="/art/two-omars.webp" width={800} height={433} alt="" />
            <img decoding="async" fetchPriority="low" className="h h--card h--lift" src="/art/smash-card.webp" width={540} height={540} alt="" />
            <img decoding="async" fetchPriority="low" className="h h--note h--lift" src="/art/sticky-note.webp" width={353} height={363} alt="" />
            <img decoding="async" fetchPriority="low" className="h h--mozzy h--lift" src="/art/mozzy.webp" width={420} height={394} alt="" />
          </>
        )}

        <h1 className="hero__title">
          <span className="hero__flip">
            FLIP<small>&amp;</small>
          </span>
          <span className="hero__grill">GRILL</span>
        </h1>
        {!narrow && <img decoding="async" fetchPriority="low" className="h h--smiley" src="/art/smiley.webp" alt="" />}

        <p className="hero__label hero__label--teal">Stall at IBA Karachi</p>
        <p className="hero__label hero__label--orange">Catering all over karachi</p>

        <button className="h h--burger" ref={burger} onClick={smack} onAnimationEnd={(e) => e.target === e.currentTarget && burger.current?.classList.remove("is-smacked")} aria-label="Smack the burger">
          <img decoding="async" fetchPriority="high" width={1126} height={959} src="/art/burger.webp" alt="" />
          <Sparks items={narrow ? SPARKS.slice(0, 4) : SPARKS} />
        </button>

        {!narrow && BOYS.map((b) => (
          <div className={`boy ${b.cls}`} key={b.who}>
            <div className="boy__dodge">
              <div className="boy__float">
                <span className="boy__say" aria-hidden="true">{b.say}</span>
                <img decoding="async" src={`/mascots/omar-${b.who}.webp`} alt="" draggable={false} />
              </div>
            </div>
            <span className="hero__tag">{b.tag}</span>
          </div>
        ))}

        <div className="hero__ctas">
          <a className="btn btn--cream" href="#stall">I'm at IBA!</a>
          <a className="btn" href="#contact">Book for an event</a>
        </div>
      </div>
    </header>
  );
}
