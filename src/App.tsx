import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { IconSprite } from "./components/Icons";
import { Loader } from "./components/Loader";
import { Cursor } from "./components/Cursor";
import { Hero } from "./components/Hero";
import { Ticker } from "./components/Ticker";
import { Story } from "./components/Story";
import { BuildSection } from "./components/BuildSection";
import { BigMarquee } from "./components/BigMarquee";
import { Menu } from "./components/Menu";
import { FindUs, Footer, Nav } from "./components/FindUs";
import { Paths } from "./components/Paths";
import { Catering } from "./components/Catering";
import { burst } from "./lib/burst";

export default function App() {
  const main = useRef<HTMLElement>(null);

  // Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ anchors: { offset: -70 } });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  // Click anywhere → comic SFX
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, dialog, canvas")) return;
      burst(e.clientX, e.clientY);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Page-wide reveals + gentle mouse-tilt on menu panels
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".reveal", { opacity: 0 });
        ScrollTrigger.batch(".reveal", {
          start: "top 88%",
          once: true,
          onEnter: (els) =>
            gsap.fromTo(
              els,
              { opacity: 0, y: 48, scale: 0.97 },
              { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out", stagger: 0.08, clearProps: "transform" },
            ),
        });

        gsap.utils.toArray<HTMLElement>(".split").forEach((title) => {
          gsap.from(title.querySelectorAll(".char"), {
            yPercent: 110,
            rotation: () => gsap.utils.random(-8, 8),
            opacity: 0,
            duration: 0.75,
            ease: "back.out(1.6)",
            stagger: 0.03,
            scrollTrigger: { trigger: title, start: "top 85%" },
          });
        });
      });

      // 3D tilt toward the pointer on cards (desktop only)
      mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".panel");
        gsap.set(cards, { transformPerspective: 800 });
        const handlers = cards.map((card) => {
          const rx = gsap.quickTo(card, "rotationX", { duration: 0.4, ease: "power3.out" });
          const ry = gsap.quickTo(card, "rotationY", { duration: 0.4, ease: "power3.out" });
          const move = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 7);
            rx(-((e.clientY - r.top) / r.height - 0.5) * 7);
          };
          const leave = () => {
            rx(0);
            ry(0);
          };
          card.addEventListener("pointermove", move);
          card.addEventListener("pointerleave", leave);
          return () => {
            card.removeEventListener("pointermove", move);
            card.removeEventListener("pointerleave", leave);
          };
        });
        return () => handlers.forEach((h) => h());
      });

    },
    { scope: main },
  );

  return (
    <>
      <IconSprite />
      <Loader />
      <Cursor />
      <Nav />
      <main ref={main}>
        <Hero />
        <Ticker />
        <Paths />
        <Story />
        <BuildSection />
        <BigMarquee top="SMASHED ★ FLIPPED ★ DEVOURED" bottom="スマッシュ ★ CRISPY EDGES ★ MELTY CHEESE" />
        <Menu />
        <FindUs />
        <Catering />
      </main>
      <Footer />
    </>
  );
}
