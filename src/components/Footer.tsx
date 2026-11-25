import { CONTACT } from "../data/contact";

/**
 * Orange call-to-action band (home page only), then the footer as a last comic panel on dark paper: a big speech
 * bubble, the links, and a quiet base line.
 */
export function Footer({ cta = true }: { cta?: boolean }) {
  const links = [
    CONTACT.instagram && { href: `https://instagram.com/${CONTACT.instagram}`, label: "Instagram" },
    CONTACT.whatsapp && { href: `https://wa.me/${CONTACT.whatsapp}`, label: "WhatsApp" },
    CONTACT.email && { href: `mailto:${CONTACT.email}`, label: "Email" },
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

      <div className="footer__main" data-reveal>
        <div className="wrap footer__panel">
          <p className="footer__bubble">See you at the grill!</p>

          <nav className="footer__links" aria-label="Footer">
            <a href="#story">About</a>
            <a href="#menu">Menu</a>
            <a href="#stall">Pop up</a>
            <a href="#contact">Booking</a>
          </nav>
          {links.length > 0 && (
            <p className="footer__social">
              {links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener">{l.label}</a>
              ))}
            </p>
          )}
        </div>

        <div className="wrap footer__base">
          <p>© {new Date().getFullYear()} Flip &amp; Grill · Karachi</p>
          <a href="https://mable.cc" target="_blank" rel="noopener">Designed &amp; engineered by MABLE STD ↗</a>
        </div>
      </div>
    </footer>
  );
}
