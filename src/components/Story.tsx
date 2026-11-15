import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Edge } from "./Edge";

const LINES = [
  "For too long, Karachi settled for thick, grey, sad burgers.",
  "Then someone grabbed a spatula…",
  "…and pressed. HARD.",
];

/** Full-screen red manga page: words ink in as you scroll (scrubbed). */
export function Story() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".story__word",
          { opacity: 0.12, y: 14 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: { trigger: ".story__text", start: "top 75%", end: "bottom 45%", scrub: 0.6 },
          },
        );
        gsap.from(".story__bam", {
          scale: 0,
          rotation: -30,
          ease: "back.out(3)",
          duration: 0.7,
          scrollTrigger: { trigger: ".story__bam", start: "top 80%" },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section className="story" ref={ref}>
      <Edge color="var(--red)" />
      <div className="story__inner">
        <p className="caption-box">Chapter 01: The Problem</p>
        <p className="story__text">
          {LINES.map((line, li) => (
            <span className={`story__line ${li === 2 ? "story__line--hit" : ""}`} key={li}>
              {line.split(" ").map((w, i) => (
                <span className="story__word" key={i}>
                  {w}{" "}
                </span>
              ))}
            </span>
          ))}
        </p>
        <div className="story__bam" aria-hidden="true">SMASH!!</div>
      </div>
    </section>
  );
}
