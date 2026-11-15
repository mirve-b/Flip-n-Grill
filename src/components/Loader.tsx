import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { markIntroDone } from "../lib/intro";

/** Full-screen yellow splash: logo bounces in, counter runs, then a circle wipe opens the page. */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) {
        markIntroDone();
        setGone(true);
        return;
      }
      document.documentElement.classList.add("is-loading");
      const counter = { v: 0 };
      gsap
        .timeline({
          onComplete: () => {
            document.documentElement.classList.remove("is-loading");
            setGone(true);
          },
        })
        .from(".loader__logo", { scale: 0, rotation: -200, duration: 0.8, ease: "back.out(1.8)" })
        .to(counter, {
          v: 100,
          duration: 1.1,
          ease: "power2.inOut",
          onUpdate: () => {
            const el = ref.current?.querySelector(".loader__count");
            if (el) el.textContent = `${Math.round(counter.v)}%`;
          },
        }, "<0.1")
        .to(".loader__logo", { scale: 1.25, rotation: 20, duration: 0.15, ease: "power2.in" })
        .to(".loader__logo", { scale: 0, rotation: -40, duration: 0.3, ease: "back.in(2)" })
        .add(() => markIntroDone(), "-=0.05")
        .to(ref.current, { clipPath: "circle(0% at 50% 50%)", duration: 0.7, ease: "power4.inOut" }, "-=0.1");
    },
    { scope: ref },
  );

  if (gone) return null;
  return (
    <div className="loader" ref={ref} aria-hidden="true">
      <img src="/logo-round.png" alt="" className="loader__logo" width="400" height="394" />
      <p className="loader__count">0%</p>
      <p className="loader__tag">Heating the grill…</p>
    </div>
  );
}
