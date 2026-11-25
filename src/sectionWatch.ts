/**
 * Everything here uses IntersectionObserver, so nothing runs on scroll frames: the browser calls back only
 * when something crosses a boundary. (Animations: "motion" in styles.css.)
 * - Sections well off screen get .is-off, which pauses their endless loops (sparkles, floating Omars...).
 * - The page background follows the section at the bottom edge of the screen. iPhone Safari paints the strip around
 *   its own bars (above the page at the very top, under the page at the very end) with the page background, so this
 *   way that strip is always the colour of the section next to it: teal at the hero, dark at the footer, never white.
 *   A section's colour is its --edge (set for the paper textures: their average colour) or else its background.
 */
export function watchSections(): () => void {
  const sections = document.querySelectorAll<HTMLElement>("main > *, footer.footer > *");

  const off = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.target.classList.toggle("is-off", !e.isIntersecting)),
    { rootMargin: "200px 0px" },
  );
  sections.forEach((s) => off.observe(s));

  const root = document.documentElement;
  const colourOf = (el: Element) => {
    const cs = getComputedStyle(el);
    const edge = cs.getPropertyValue("--edge").trim();
    if (edge) return edge;
    return cs.backgroundColor !== "rgba(0, 0, 0, 0)" ? cs.backgroundColor : "";
  };
  // the observed area is just the bottom 1% of the screen
  const edge = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { const c = colourOf(e.target); if (c) root.style.backgroundColor = c; }
  }, { rootMargin: "-99% 0px 0px 0px" });
  sections.forEach((s) => edge.observe(s));

  return () => {
    off.disconnect();
    edge.disconnect();
    root.style.backgroundColor = "";
    sections.forEach((s) => s.classList.remove("is-off"));
  };
}
