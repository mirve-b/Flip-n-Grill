import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

// a reload always opens at the top: drop any #section a nav click left in the address bar
// (only the #contact page is kept) and stop the browser restoring the old scroll position
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (location.hash && location.hash !== "#contact") history.replaceState(null, "", location.pathname + location.search);

// the mono text uses Apple Symbols, which only Apple devices have. Elsewhere (Android, Windows) it falls back to
// Space Mono, which runs wider, so .no-apple-mono lets the hero labels shrink to the same width (styles.css)
const probe = document.createElement("canvas").getContext("2d");
if (probe) {
  probe.font = '40px "Apple Symbols", serif';
  const withApple = probe.measureText("Stall at IBA Karachi").width;
  probe.font = "40px serif";
  if (Math.abs(withApple - probe.measureText("Stall at IBA Karachi").width) < 0.5) document.documentElement.classList.add("no-apple-mono");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

/*
 * Splash → intro. The splash stays at least 2s (so its animation can finish), waits
 * for the fonts and the hero burger, and never longer than 4s. Adding .is-ready plays
 * the hero's entrance as the splash fades.
 */
// no scrolling while the splash is up: overflow: hidden (styles.css) isn't enough on iPhones, so swallow the gestures too
const splashUp = !!document.getElementById("splash") && !matchMedia("(prefers-reduced-motion: reduce)").matches;
const SCROLL_KEYS = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);
const block = (e: Event) => { if (!(e instanceof KeyboardEvent) || SCROLL_KEYS.has(e.key)) e.preventDefault(); };
const lockEvents = ["wheel", "touchmove", "keydown"] as const;
if (splashUp) lockEvents.forEach((t) => addEventListener(t, block, { passive: false }));

const MIN = 2000;
const MAX = 4000;
const hero = new Image();
hero.src = "/art/burger.webp";
const ready = Promise.all([document.fonts.ready, hero.decode().catch(() => undefined)]);
const elapsed = () => performance.now();
Promise.race([ready, new Promise((r) => setTimeout(r, MAX))]).then(() => {
  setTimeout(() => {
    document.documentElement.classList.add("is-ready");
    // the case files and the burger art are downloaded with the page; unpack them now too, so they're ready the
    // instant you scroll to them instead of the browser decoding them on the way in
    document.querySelectorAll<HTMLImageElement>(".story__docs img, .invest__art img").forEach((img) => img.decode().catch(() => {}));
    const splash = document.getElementById("splash");
    lockEvents.forEach((t) => removeEventListener(t, block));
    scrollTo(0, 0);
    splash?.classList.add("is-done");
    setTimeout(() => splash?.remove(), 700);
  }, Math.max(0, MIN - elapsed()));
});
