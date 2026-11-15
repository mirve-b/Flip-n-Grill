import { lazy, Suspense, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { onIntroDone } from "../lib/intro";
import { Sparkles } from "./Sparkles";
import { Icon } from "./Icons";
import { hasWebGL } from "../lib/device";

const HeroScene = lazy(() => import("../three/HeroScene"));

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap
          .timeline({ paused: true, defaults: { ease: "back.out(2)" } })
          .from(".mega .mega__char", { yPercent: 130, rotation: () => gsap.utils.random(-25, 25), stagger: 0.05, duration: 0.8 })
          .from(".mega__amp", { scale: 0, rotation: -180, duration: 0.8 }, "-=0.5")
          .from(".hero__sticker", { scale: 0, rotation: -60, duration: 0.6 }, "-=0.4")
          .from(".hero__corner", { y: 40, opacity: 0, stagger: 0.1, duration: 0.5, ease: "power3.out" }, "-=0.4")
          .from(".hero__ctas .btn", { scale: 0, rotation: 12, stagger: 0.08, duration: 0.6 }, "-=0.3");
        const off = onIntroDone(() => tl.play());

        // parallax: giant type sinks, corners drift as you scroll away
        gsap.to(".mega", {
          yPercent: 35,
          scale: 0.9,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        });
        return off;
      });
    },
    { scope: ref },
  );

  const word = (w: string) =>
    [...w].map((c, i) => (
      <span className="mega__char" key={i}>
        {c}
      </span>
    ));

  return (
    <section className="hero" ref={ref}>
      <div className="hero__rays" aria-hidden="true" />
      <Sparkles count={6} />

      <h1 className="mega" aria-label="Flip and Grill">
        <span className="mega__row" aria-hidden="true">{word("FLIP")}<span className="mega__amp">&amp;</span></span>
        <span className="mega__row" aria-hidden="true">{word("GRILL")}</span>
      </h1>

      {hasWebGL() ? (
        <Suspense fallback={<div className="hero__canvas hero__canvas--loading">Heating the grill…</div>}>
          <HeroScene />
        </Suspense>
      ) : (
        <div className="hero__canvas hero__fallback"><Icon id="burger" /></div>
      )}

      <div className="hero__sticker" aria-hidden="true">
        <div className="hero__sticker-in">
          <small>スマッシュバーガー</small>
          SMASH
          <br />
          BURGERS
        </div>
      </div>

      <p className="hero__corner hero__corner--l">
        For too long, Karachi
        <br />
        ate sad burgers.
      </p>
      <p className="hero__corner hero__corner--r">
        Stall at <b>IBA Karachi</b>.
        <br />
        Catering all over Karachi.
      </p>

      <div className="hero__ctas">
        <a href="#find" className="btn btn--ghost">I'm at IBA</a>
        <a href="#catering" className="btn">Book for an event</a>
      </div>
    </section>
  );
}
