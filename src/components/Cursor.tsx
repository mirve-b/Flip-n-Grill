import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Sparkle cursor that trails the pointer and puffs up over anything clickable. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (!fine || reduce || !el) return;
    document.documentElement.classList.add("has-cursor");

    // Put the cursor in the browser's top layer (as a popover) so it can sit above
    // modal dialogs like the menu board, which otherwise cover everything.
    const canPop = typeof el.showPopover === "function";
    if (canPop) el.showPopover();
    let dialogOpen = false;
    const raise = () => {
      if (!canPop) return;
      el.hidePopover();
      el.showPopover(); // re-showing moves it to the top of the top layer
    };

    // follow the pointer exactly: no easing lag
    const setX = gsap.quickSetter(el, "x", "px");
    const setY = gsap.quickSetter(el, "y", "px");
    const move = (e: PointerEvent) => {
      setX(e.clientX);
      setY(e.clientY);
      const open = !!document.querySelector("dialog[open]");
      if (open !== dialogOpen) {
        dialogOpen = open;
        if (open) raise();
      }
      const t = e.target instanceof Element ? e.target : null;
      const hot = t?.closest("a, button, .panel, .chip") || document.body.classList.contains("cursor-smash");
      el.classList.toggle("is-hot", !!hot);
    };
    const down = () => gsap.fromTo(el, { scale: 0.6 }, { scale: 1, duration: 0.4, ease: "back.out(3)" });
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    const spin = gsap.to(el.querySelector("svg"), { rotation: 360, duration: 6, repeat: -1, ease: "none" });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      spin.kill();
      if (canPop && el.matches(":popover-open")) el.hidePopover();
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div className="cursor" ref={ref} aria-hidden="true" popover="manual">
      <svg viewBox="0 0 20 20">
        <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="#F1D7B3" stroke="#000000" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
      <span className="cursor__label">SMASH!</span>
    </div>
  );
}
