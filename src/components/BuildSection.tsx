import { lazy, Suspense, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { BEATS } from "../three/BuildBurger";
import { Icon } from "./Icons";
import { hasWebGL } from "../lib/device";

const BuildScene = lazy(() => import("../three/BuildScene"));

const STEPS = [
  { at: BEATS.bun[0], title: "Bun drop", sfx: "PLOP!", line: "A soft, toasted bottom bun lands first.", bg: "#F1D7B3" },
  { at: BEATS.ball[0], title: "SMASH", sfx: "SMASH!!", line: "A fresh ball of beef, pressed flat. Hard. No mercy.", bg: "#D44000" },
  { at: BEATS.sizzle[0], title: "Sizzle", sfx: "TSSSS…", line: "The edges go lacy, crispy and dark.", bg: "#FF9400" },
  { at: BEATS.cheese[0], title: "Melt", sfx: "DRIP…", line: "Cheese goes down and gives up immediately.", bg: "#F1D7B3" },
  { at: BEATS.top[0], title: "Crown it", sfx: "FLIP!", line: "Sesame crown on. Legend assembled.", bg: "#006267" },
  { at: BEATS.sides[0], title: "Sides", sfx: "CRUNCH!", line: "Curly fries & mozzy sticks join the party.", bg: "#D44000" },
  { at: BEATS.boxIn[0], title: "Box it", sfx: "SNAP!", line: "Boxed and handed over at IBA Karachi.", bg: "#FF9400" },
];

export function BuildSection() {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [step, setStep] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let current = -1;
        const bgTo = (c: string) => gsap.to(ref.current, { backgroundColor: c, duration: 0.5, ease: "power2.out", overwrite: true });
        gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 5}`,
            pin: true,
            anticipatePin: 1,
            scrub: 1, // a touch more smoothing: finger flicks glide instead of jumping
            onUpdate: (self) => {
              progress.current = self.progress;
              let s = 0;
              STEPS.forEach((st, i) => self.progress >= st.at && (s = i));
              if (s !== current) {
                current = s;
                setStep(s);
                bgTo(STEPS[s].bg);
              }
            },
          },
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        progress.current = BEATS.sides[1];
        setStep(5);
      });
    },
    { scope: ref },
  );

  // pop the HUD when the step changes
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(".build__sfx", { scale: 0, rotation: -30 }, { scale: 1, rotation: -8, duration: 0.5, ease: "back.out(3)" });
      gsap.fromTo(".build__title, .build__line", { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: "power3.out" });
    },
    { scope: ref, dependencies: [step] },
  );

  const s = STEPS[step];
  return (
    <section className="build" id="build" ref={ref} style={{ backgroundColor: STEPS[0].bg }}>
      <div className="build__halftone" aria-hidden="true" />
      {hasWebGL() ? (
        <Suspense fallback={<div className="build__canvas" />}>
          <BuildScene progress={progress} />
        </Suspense>
      ) : (
        <div className="build__canvas hero__fallback"><Icon id={step >= 4 ? "double" : "burger"} /></div>
      )}

      <div className="build__hud">
        <p className="caption-box">Chapter 02: How a Smash is Born</p>
        <h2 className="build__title">
          <span className="build__num">{String(step + 1).padStart(2, "0")}</span> {s.title}
        </h2>
        <p className="build__line">{s.line}</p>
      </div>

      <div className="build__sfx" key={step} aria-hidden="true">
        {s.sfx}
      </div>

      <ol className="build__steps" aria-label="Steps">
        {STEPS.map((st, i) => (
          <li key={st.title} className={i === step ? "is-active" : i < step ? "is-done" : ""}>
            <span>{i + 1}</span>
            <em>{st.title}</em>
          </li>
        ))}
      </ol>
      <p className="build__hint">keep scrolling ↓</p>
    </section>
  );
}
