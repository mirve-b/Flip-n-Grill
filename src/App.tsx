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
import { BrandBook } from "./components/BrandBook";
import { watchSections } from "./sectionWatch";

/** Three pages: the home page, the booking page at #contact and the brand book at #brand. */
type Page = "home" | "contact" | "brand";
const pageFromHash = (): Page => (location.hash === "#contact" ? "contact" : location.hash === "#brand" ? "brand" : "home");

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
    // any sign the person has moved on cancels the second jump: scrolling, a key, a click, or another link
    // (without the last two, clicking Menu right after landing on Pop up got dragged back to Pop up)
    let cancelled = false;
    const userScrolled = () => (cancelled = true);
    const CANCEL = ["wheel", "touchstart", "keydown", "pointerdown", "hashchange"] as const;
    CANCEL.forEach((t) => window.addEventListener(t, userScrolled, { once: true, passive: true }));
    Promise.race([
      Promise.all(pending.map((img) => new Promise((r) => { img.addEventListener("load", r, { once: true }); img.addEventListener("error", r, { once: true }); }))),
      new Promise((r) => setTimeout(r, 2500)),
    ]).then(() => !cancelled && jump());
    return () => {
      cancelled = true;
      CANCEL.forEach((t) => window.removeEventListener(t, userScrolled));
    };
  }, [page]);

  // pauses off-screen loops and colours any rubber-band gap at the page's ends (src/sectionWatch.ts);
  // (nothing animates with the scroll position itself: see "motion" in styles.css)
  useEffect(() => watchSections(page === "contact" ? "var(--red)" : "var(--hero-edge)"), [page]);

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
      { rootMargin: "0px 0px 8% 0px" }, // start just before a block reaches the screen
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
      ) : page === "brand" ? (
        <main>
          <BrandBook />
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
