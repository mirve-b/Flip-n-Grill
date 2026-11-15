import gsap from "gsap";

const WORDS = ["SMASH!", "POW!", "SIZZLE!", "FLIP!", "CRUNCH!", "BAM!", "YUM!", "TSSS!"];
const COLORS = ["#F1D7B3", "#FF9400", "#D44000"];
const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Spawn a comic SFX starburst at a screen point. */
export function burst(x: number, y: number, text?: string) {
  if (reduce()) return;
  const el = document.createElement("span");
  el.className = "burst";
  el.textContent = text ?? gsap.utils.random(WORDS);
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.background = gsap.utils.random(COLORS);
  document.body.appendChild(el);

  const rot = gsap.utils.random(-14, 14);
  gsap
    .timeline({ onComplete: () => el.remove() })
    .fromTo(el, { scale: 0, rotation: rot - 25 }, { scale: 1, rotation: rot, duration: 0.35, ease: "back.out(3)" })
    .to(el, { y: -30, opacity: 0, scale: 1.15, duration: 0.35, ease: "power2.in" }, "+=0.15");
}
