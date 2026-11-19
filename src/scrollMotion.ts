/**
 * Scroll-linked motion. Each effect moves one kind of element by its section's scroll progress p
 * (0 = section just entering at the bottom of the screen, .5 = centred, 1 = just left at the top).
 * Only the moving elements are touched (inline translate / rotate / scale / opacity), so the browser
 * restyles a handful of elements per frame, not whole sections. That's what keeps it smooth on iPads.
 * Sections far off screen are marked .is-off, which pauses their looping animations (styles.css).
 */
type Style = Partial<Record<"translate" | "rotate" | "scale" | "opacity", string>>;
type Effect = { sel: string; fx: (p: number) => Style; wide?: true }; // wide: desktop only (phone text is centred)

export const PHONE = "(max-width: 760px), (orientation: portrait) and (max-width: 1024px)";

const heroOut = (p: number) => Math.max(0, (p - 0.5) * 2); // 0 while the hero fills the screen, 1 once it's gone
const u = (n: number) => `calc(${n.toFixed(2)} * var(--u))`;
const q = (p: number) => p - 0.5;

const EFFECTS: Effect[] = [
  // hero: as you scroll away the collage blows apart, the burger grows, the title flies up
  { sel: ".hero__title", fx: (p) => ({ translate: `0 ${u(-22 * heroOut(p))}` }) },
  { sel: ".h--burger", fx: (p) => ({ scale: `${1 + heroOut(p) * 0.3}` }) },
  { sel: ".h--burst-a, .h--burst-b", fx: (p) => ({ scale: `${1 + heroOut(p) * 0.8}` }) },
  { sel: ".hero__label--teal", fx: (p) => ({ translate: `${u(-30 * heroOut(p))} 0` }) },
  { sel: ".hero__label--orange", fx: (p) => ({ translate: `${u(30 * heroOut(p))} 0` }) },
  { sel: ".h--paper", fx: (p) => ({ translate: `${u(-14 * heroOut(p))} ${u(-8 * heroOut(p))}` }) },
  { sel: ".h--plate", fx: (p) => ({ translate: `${u(-16 * heroOut(p))} ${u(6 * heroOut(p))}` }) },
  { sel: ".h--two, .h--card", fx: (p) => ({ translate: `${u(14 * heroOut(p))} ${u(-8 * heroOut(p))}` }) },
  { sel: ".h--note, .h--mozzy", fx: (p) => ({ translate: `${u(16 * heroOut(p))} ${u(6 * heroOut(p))}` }) },
  { sel: ".boy--1", fx: (p) => ({ translate: `${u(-20 * heroOut(p))} ${u(-4 * heroOut(p))}` }) },
  { sel: ".boy--2", fx: (p) => ({ translate: `${u(20 * heroOut(p))} ${u(-4 * heroOut(p))}` }) },
  { sel: ".hero__ctas", fx: (p) => ({ opacity: `${Math.max(0, 1 - heroOut(p) * 1.6)}` }) },
  // the name strips scrub sideways
  { sel: ".strip__track", fx: (p) => ({ translate: `${(-320 * p).toFixed(1)}px 0` }) },
  // 01 story: file and folder float at different speeds, SMASH! slides on
  { sel: ".story__file, .story__tape", fx: (p) => ({ translate: `0 ${(-90 * q(p)).toFixed(1)}px` }) },
  { sel: ".story__folder", fx: (p) => ({ translate: `0 ${(70 * q(p)).toFixed(1)}px` }) },
  { sel: ".story__dots--a", fx: (p) => ({ translate: `0 ${(-160 * q(p)).toFixed(1)}px` }) },
  { sel: ".story__dots--b, .story__dots--c", fx: (p) => ({ translate: `0 ${(120 * q(p)).toFixed(1)}px` }) },
  { sel: ".story__smash", wide: true, fx: (p) => ({ translate: `${(Math.max(0, q(p)) * 120).toFixed(1)}px 0` }) },
  // 02 investigation: the burger art floats and tilts, the title glides
  { sel: ".invest__art", fx: (p) => ({ translate: `0 ${(-110 * q(p)).toFixed(1)}px`, rotate: `${(10 * q(p)).toFixed(2)}deg` }) },
  { sel: ".invest__title", wide: true, fx: (p) => ({ translate: `${(-60 * q(p)).toFixed(1)}px 0` }) },
  // 03 menu
  { sel: ".menu__title", wide: true, fx: (p) => ({ translate: `${(120 * q(p)).toFixed(1)}px 0` }) },
  { sel: ".receipt-wrap", fx: (p) => ({ translate: `0 ${(-60 * q(p)).toFixed(1)}px` }) },
  // 04 stall
  { sel: ".stall__title", wide: true, fx: (p) => ({ translate: `${(-90 * q(p)).toFixed(1)}px 0` }) },
  { sel: ".stall__map", fx: (p) => ({ translate: `0 ${(-40 * q(p)).toFixed(1)}px` }) },
  // footer band + booking page
  { sel: ".footer__big", wide: true, fx: (p) => ({ translate: `${(-140 * q(p)).toFixed(1)}px 0` }) },
  { sel: ".cater__steps li:nth-child(1)", fx: (p) => ({ translate: `0 ${(40 * q(p)).toFixed(1)}px` }) },
  { sel: ".cater__steps li:nth-child(3)", fx: (p) => ({ translate: `0 ${(-40 * q(p)).toFixed(1)}px` }) },
];

type Target = { el: HTMLElement; fx: Effect["fx"]; last: string };
type Section = { el: HTMLElement; targets: Target[]; off: boolean };

/** Starts the scroll motion for the current page; returns a cleanup function. */
export function startScrollMotion(edgeTop: string): () => void {
  const root = document.documentElement;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const phone = matchMedia(PHONE);
  let sections: Section[] = [];

  const collect = () => {
    sections = [...document.querySelectorAll<HTMLElement>("main > *, footer > *")].map((el) => ({
      el,
      off: false,
      targets: still
        ? []
        : EFFECTS.filter((e) => !(e.wide && phone.matches)).flatMap((e) =>
            [...el.querySelectorAll<HTMLElement>(e.sel)].map((t) => ({ el: t, fx: e.fx, last: "" })),
          ),
    }));
  };

  let frame = 0;
  const update = () => {
    frame = 0;
    const vh = innerHeight;
    const max = root.scrollHeight - vh;
    // if a browser still rubber-bands past the ends, colour the gap like the edge being pulled
    root.style.backgroundColor = scrollY > max / 2 ? "#000" : edgeTop;

    // read every position first, then write: never interleave (that forces extra layouts)
    const rects = sections.map((s) => s.el.getBoundingClientRect());
    sections.forEach((s, i) => {
      const r = rects[i];
      const off = r.bottom < -150 || r.top > vh + 150;
      if (off !== s.off) s.el.classList.toggle("is-off", (s.off = off));
      if (off) return;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      for (const t of s.targets) {
        const style = t.fx(p);
        const key = JSON.stringify(style);
        if (key === t.last) continue; // nothing changed: don't touch the element
        t.last = key;
        Object.assign(t.el.style, style);
      }
    });
  };
  const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
  const onLayout = () => {
    // switching between phone and desktop layouts changes which effects apply
    for (const s of sections) for (const t of s.targets) t.el.style.translate = t.el.style.rotate = t.el.style.scale = t.el.style.opacity = "";
    collect();
    onScroll();
  };

  collect();
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  phone.addEventListener("change", onLayout);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    phone.removeEventListener("change", onLayout);
  };
}
