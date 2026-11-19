import { useEffect, useState } from "react";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Strip } from "./components/Strip";
import { Story } from "./components/Story";
import { Investigation } from "./components/Investigation";
import { Menu } from "./components/Menu";
import { Stall } from "./components/Stall";
import { Catering } from "./components/Catering";
import { Footer } from "./components/Footer";

/** Two pages: the home page, and the booking page at #contact. */
type Page = "home" | "contact";
const pageFromHash = (): Page => (location.hash === "#contact" ? "contact" : "home");

export default function App() {
  const [page, setPage] = useState<Page>(pageFromHash);

  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // after switching pages, land at the top (or at the section the link pointed to, e.g. #menu)
  useEffect(() => {
    const target = page === "home" && location.hash.length > 1 ? document.getElementById(location.hash.slice(1)) : null;
    if (!target) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    const jump = () => target.scrollIntoView({ behavior: "instant" });
    jump();
    // images above the section are still loading and push it down, so jump again once they're in
    const pending = [...document.images].filter((img) => !img.complete && img.getBoundingClientRect().top < target.getBoundingClientRect().top);
    let cancelled = false;
    const userScrolled = () => (cancelled = true);
    window.addEventListener("wheel", userScrolled, { once: true, passive: true });
    window.addEventListener("touchstart", userScrolled, { once: true, passive: true });
    Promise.race([
      Promise.all(pending.map((img) => new Promise((r) => { img.addEventListener("load", r, { once: true }); img.addEventListener("error", r, { once: true }); }))),
      new Promise((r) => setTimeout(r, 2500)),
    ]).then(() => !cancelled && jump());
    return () => {
      cancelled = true;
      window.removeEventListener("wheel", userScrolled);
      window.removeEventListener("touchstart", userScrolled);
    };
  }, [page]);

  // scroll-linked motion: every section gets --p (0 entering at the bottom, .5 centred, 1 leaving
  // at the top), which styles.css turns into parallax.
  // Also, if a browser still rubber-bands past the ends, paint the gap the colour of the edge being
  // pulled: the top section's colour near the top, the footer's black near the bottom.
  useEffect(() => {
    const root = document.documentElement;
    const top = page === "home" ? "var(--teal)" : "var(--red)";
    const sections = [...document.querySelectorAll<HTMLElement>("main > *, footer > *")];
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = innerHeight;
      const max = root.scrollHeight - vh;
      root.style.backgroundColor = scrollY > max / 2 ? "#000" : top;
      if (still) return;
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) continue; // far off screen: leave it be
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        el.style.setProperty("--p", p.toFixed(4));
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [page]);

  // gentle scroll reveals: each [data-reveal] fades/lifts in once, the first time it's seen
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("can-reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -12% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [page]);

  return (
    <>
      <Nav key={page} />
      {page === "contact" ? (
        <main>
          <Catering />
        </main>
      ) : (
        <main>
          <Hero />
          <Strip />
          <Story />
          <Investigation />
          <Menu />
          <Strip />
          <Stall />
        </main>
      )}
      <Footer cta={page === "home"} />
    </>
  );
}
