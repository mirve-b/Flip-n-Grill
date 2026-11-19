import { CONTACT } from "../data/contact";

/** Orange call-to-action band (home page only), then the black footer. */
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
          <div>
            <p className="footer__brand">Flip &amp; Grill</p>
            <p className="footer__tag">Smash burgers. Stall at IBA Karachi, catering all over Karachi.</p>
          </div>
          <nav aria-label="Footer">
            <p className="footer__head">Explore</p>
            <ul>
              <li><a href="#story">About</a></li>
              <li><a href="#menu">Menu</a></li>
              <li><a href="#stall">Pop up</a></li>
              <li><a href="#contact">Booking</a></li>
            </ul>
          </nav>
          {links.length > 0 && (
            <div>
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
        <p className="wrap footer__small">© {new Date().getFullYear()} Flip &amp; Grill · Karachi</p>
      </div>
    </footer>
  );
}
