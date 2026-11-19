import { useEffect, useState } from "react";

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

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav ${open ? "is-open" : ""} ${solid || open ? "nav--solid" : ""}`} aria-label="Main">
      <a className="nav__brand" href="#top">Flip &amp; Grill</a>
      <button className="nav__toggle" aria-expanded={open} aria-controls="nav-links" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
        <i /><i /><i />
      </button>
      <ul className="nav__links" id="nav-links">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
