import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Icon } from "./Icons";

/** "Choose your route" manga spread: students → the stall, planners → catering. */
export function Paths() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".path", {
          xPercent: (i) => (i ? 60 : -60),
          rotation: (i) => (i ? 8 : -8),
          opacity: 0,
          duration: 0.9,
          ease: "back.out(1.6)",
          stagger: 0.12,
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
        });
        gsap.from(".paths__vs", { scale: 0, rotation: -180, duration: 0.7, ease: "back.out(3)", delay: 0.3, scrollTrigger: { trigger: ref.current, start: "top 80%" } });
      });
    },
    { scope: ref },
  );

  return (
    <section className="paths" ref={ref} aria-label="Choose your path">
      <a href="#find" className="path path--student">
        <span className="path__tag">IBA student?</span>
        <Icon id="burger" className="path__art" />
        <span className="path__title">Find the stall</span>
        <span className="path__sub">Smash break between classes, right on campus.</span>
        <span className="path__go">→</span>
      </a>
      <div className="paths__vs" aria-hidden="true">OR</div>
      <a href="#catering" className="path path--event">
        <span className="path__tag">Planning an event?</span>
        <Icon id="double" className="path__art" />
        <span className="path__title">Book the grill</span>
        <span className="path__sub">Bazaars, weddings, office days, anywhere in Karachi.</span>
        <span className="path__go">→</span>
      </a>
    </section>
  );
}
