import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const ITEMS = ["SMASH BURGERS", "CURLY FRIES", "ANIMAL FRIES", "MOZZY STICKS", "ONLY AT IBA KARACHI"];

export function Ticker() {
  const track = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const loop = gsap.to(track.current, { xPercent: -50, duration: 22, ease: "none", repeat: -1 });
      // scroll velocity boosts (and flips) the loop; eased back on GSAP's own ticker,
      // so we never create new tweens while scrolling
      let boost = 1;
      let dir = 1;
      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          dir = self.direction;
          boost = Math.max(boost, gsap.utils.clamp(1, 6, Math.abs(self.getVelocity()) / 250));
        },
      });
      const tick = () => {
        boost += (1 - boost) * 0.06;
        const target = boost * dir;
        const ts = loop.timeScale();
        if (Math.abs(target - ts) > 0.001) loop.timeScale(ts + (target - ts) * 0.2);
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        st.kill();
      };
    });
  });

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track" ref={track}>
        {[...ITEMS, ...ITEMS].map((t, i) => (
          <span key={i}>★ {t}</span>
        ))}
      </div>
    </div>
  );
}
