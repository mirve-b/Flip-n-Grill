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
 * Splash → intro. The splash waits for the fonts and the hero burger, but only
 * briefly: at least 200ms, and never longer than 1.5s. Adding .is-ready plays
 * the hero's entrance as the splash fades.
 */
const MIN = 200;
const MAX = 1500;
const hero = new Image();
hero.src = "/art/burger.webp";
const ready = Promise.all([document.fonts.ready, hero.decode().catch(() => undefined)]);
const elapsed = () => performance.now();
Promise.race([ready, new Promise((r) => setTimeout(r, MAX))]).then(() => {
  setTimeout(() => {
    document.documentElement.classList.add("is-ready");
    const splash = document.getElementById("splash");
    splash?.classList.add("is-done");
    setTimeout(() => splash?.remove(), 700);
  }, Math.max(0, MIN - elapsed()));
});
