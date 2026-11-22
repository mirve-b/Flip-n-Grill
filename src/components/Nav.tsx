import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "#top", label: "Home" },
  { href: "#story", label: "About" },
  { href: "#menu", label: "Menu" },
  { href: "#stall", label: "Pop up" },
  { href: "#contact", label: "Booking" },
];

/**
 * The top bar, fixed over both pages. It sits clear over the hero, and its teal bar fades in once
 * you scroll down. On phones the links fold into a burger menu.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const links = useRef<HTMLUListElement>(null);

  // while the phone menu is open, a tap or click anywhere else closes it (so does Esc). The burger button toggles
  // it itself, and the links close it when they're followed, so those two are left alone here.
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!toggle.current?.contains(t) && !links.current?.contains(t)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  // the bar turns solid once you're 40px down. An invisible 40px marker at the top of the page tells us
  // (IntersectionObserver), so nothing runs while you scroll and React only re-renders when it flips.
  useEffect(() => {
    const marker = document.createElement("div");
    marker.setAttribute("aria-hidden", "true");
    marker.style.cssText = "position:absolute;top:0;left:0;width:1px;height:40px;pointer-events:none;visibility:hidden";
    document.body.prepend(marker);
    const io = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting));
    io.observe(marker);
    return () => { io.disconnect(); marker.remove(); };
  }, []);

  return (
    <nav className={`nav ${open ? "is-open" : ""} ${solid || open ? "nav--solid" : ""}`} aria-label="Main">
      <a className="nav__brand" href="#top">Flip &amp; Grill</a>
      <button ref={toggle} className="nav__toggle" aria-expanded={open} aria-controls="nav-links" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
        <i /><i /><i />
      </button>
      <ul ref={links} className="nav__links" id="nav-links">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
