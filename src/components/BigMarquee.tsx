import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/** Two huge rows of type that slide in opposite directions as you scroll. */
export function BigMarquee({ top, bottom }: { top: string; bottom: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 0.5 };
        gsap.fromTo(".bigmq__row--a", { xPercent: 0 }, { xPercent: -30, ease: "none", scrollTrigger: st });
        gsap.fromTo(".bigmq__row--b", { xPercent: -30 }, { xPercent: 0, ease: "none", scrollTrigger: st });
      });
    },
    { scope: ref },
  );

  const rep = (t: string) => Array.from({ length: 4 }, () => t).join(" ★ ");

  return (
    <div className="bigmq" ref={ref} aria-hidden="true">
      <div className="bigmq__row bigmq__row--a">{rep(top)}</div>
      <div className="bigmq__row bigmq__row--b">{rep(bottom)}</div>
    </div>
  );
}
