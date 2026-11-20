/**
 * Everything here uses IntersectionObserver, so nothing runs on scroll frames: the browser calls back only
 * when something crosses a boundary. (Animations: "motion" in styles.css.)
 * - Sections well off screen get .is-off, which pauses their endless loops (sparkles, floating Omars...).
 * - If a browser still rubber-bands past the ends, the gap is coloured like the edge being pulled:
 *   black while the footer is in view, the top colour otherwise.
 */
export function watchSections(edgeTop: string): () => void {
  const root = document.documentElement;
  const sections = document.querySelectorAll<HTMLElement>("main > *, footer.footer > *");
  const footer = document.querySelector("footer.footer");

  const off = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.target.classList.toggle("is-off", !e.isIntersecting)),
    { rootMargin: "200px 0px" },
  );
  sections.forEach((s) => off.observe(s));

  root.style.backgroundColor = edgeTop;
  const edge = new IntersectionObserver(([e]) => (root.style.backgroundColor = e.isIntersecting ? "#000" : edgeTop));
  if (footer) edge.observe(footer);

  return () => {
    off.disconnect();
    edge.disconnect();
    sections.forEach((s) => s.classList.remove("is-off"));
  };
}
