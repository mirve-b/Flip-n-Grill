import type { CSSProperties } from "react";
import { CONTACT } from "../data/contact";

// the giant sign-off at the very bottom: each letter rises in turn when the footer comes into view (styles.css)
const WORD = ["F", "L", "I", "P", "&", "G", "R", "I", "L", "L"];

/** Orange call-to-action band (home page only), then the black footer, signed off by a giant FLIP & GRILL. */
export function Footer({ cta = true }: { cta?: boolean }) {
  const links = [
    CONTACT.instagram && { href: `https://instagram.com/${CONTACT.instagram}`, label: `Instagram @${CONTACT.instagram}` },
    CONTACT.whatsapp && { href: `https://wa.me/${CONTACT.whatsapp}`, label: `WhatsApp +${CONTACT.whatsapp}` },
    CONTACT.email && { href: `mailto:${CONTACT.email}`, label: CONTACT.email },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <footer className="footer">
      {cta && (
      <div className="footer__cta">
        <div className="wrap footer__ctain" data-reveal>
          <p className="footer__big">Hungry yet?</p>
          <div className="footer__btns">
            <a className="btn btn--cream" href="#stall">Find the stall</a>
            <a className="btn btn--teal" href="#contact">Book for an event</a>
          </div>
        </div>
      </div>
      )}

      <div className="footer__main">
        <div className="wrap footer__grid">
          <p className="footer__tag">Smash burgers, flipped fresh at <em>IBA&nbsp;Karachi.</em></p>
          <nav className="footer__nav" aria-label="Footer">
            <p className="footer__head">Explore</p>
            <ul>
              <li><a href="#story">About</a></li>
              <li><a href="#menu">Menu</a></li>
              <li><a href="#stall">Pop up</a></li>
              <li><a href="#contact">Booking</a></li>
              <li><a className="footer__bb" href="#brand">Brand book ✦</a></li>
            </ul>
          </nav>
          {links.length > 0 && (
            <div className="footer__hi">
              <p className="footer__head">Say hi</p>
              <ul>
                {links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noopener">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="wrap footer__base">
          <p className="footer__small">© {new Date().getFullYear()} Flip &amp; Grill · Karachi</p>
          <a className="footer__made" href="https://mable.cc" target="_blank" rel="noopener">
            Designed &amp; engineered by <b>MABLE STD</b> <span aria-hidden="true">↗</span>
          </a>
        </div>

        {/* the sign-off: edge to edge, cut off by the bottom of the page */}
        <div className="footer__sign" data-reveal aria-hidden="true">
          <span className="footer__word">
            {WORD.map((ch, i) => (
              <span key={i} className={ch === "&" ? "footer__amp" : undefined} style={{ "--i": i } as CSSProperties}>{ch}</span>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
