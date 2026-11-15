import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitTitle } from "./SplitTitle";
import { Edge } from "./Edge";
import { ContactStrip } from "./Catering";
import { CONTACT } from "../data/contact";

export function FindUs() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".pin", { y: -300, duration: 1, ease: "bounce.out", scrollTrigger: { trigger: ".find__panel", start: "top 75%" } });
      });
    },
    { scope: ref },
  );

  return (
    <section className="find" id="find" ref={ref}>
      <Edge color="var(--red)" />
      <div className="section">
        <header className="section__head">
          <p className="caption-box reveal">Chapter 04: IBA Students</p>
          <SplitTitle text="Where's the Stall?!" />
          <p className="find__lede reveal">
            Right on campus at <b>IBA Karachi</b>. Between classes, after a quiz, before that 8:30.
          </p>
        </header>

        <div className="find__panel reveal">
          <div className="find__map" aria-hidden="true">
            <div className="pin"><span>F&amp;G</span></div>
            <div className="find__zone">IBA<br />KARACHI</div>
          </div>
          <div className="find__copy">
            <div className="bubble bubble--find">
              Our stall lives at <b>IBA Karachi</b>.<br />Follow the sizzle. You'll find us.
            </div>
            <ul className="find__list">
              <li><b>Smash burgers</b> fresh off the grill</li>
              <li><b>Curly fries, animal fries, mozzy sticks</b></li>
              <li><b>Make it a meal</b> when the hunger is serious</li>
            </ul>
            <div className="find__ctas">
              <a className="btn" href="https://www.google.com/maps/search/?api=1&query=IBA+Karachi" target="_blank" rel="noopener">
                Open in Maps
              </a>
              {CONTACT.instagram && (
                <a className="btn btn--ghost" href={`https://instagram.com/${CONTACT.instagram}`} target="_blank" rel="noopener">
                  Stall updates on IG
                </a>
              )}
            </div>
            <p className="find__aside">Not at IBA? We cater events all over Karachi. <a href="#catering">Book us →</a></p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".footer__mega .mega__char", {
          yPercent: 120,
          rotation: () => gsap.utils.random(-20, 20),
          stagger: 0.04,
          ease: "back.out(2)",
          duration: 0.7,
          scrollTrigger: { trigger: ".footer__mega", start: "top 95%" },
        });
      });
    },
    { scope: ref },
  );
  return (
    <footer className="footer" ref={ref}>
      <Edge color="#000000" variant="zigzag" />
      <div className="footer__top">
        <p className="footer__tbc">To be continued…</p>
        <p>Stall at IBA Karachi · Event catering across Karachi</p>
        <div className="footer__ctas">
          <a href="#find" className="btn btn--small btn--ghost">Find the stall</a>
          <a href="#catering" className="btn btn--small">Book catering</a>
        </div>
        <ContactStrip compact />
      </div>
      <div className="footer__mega" aria-label="Flip and Grill">
        {[..."FLIP&GRILL"].map((c, i) => (
          <span className={`mega__char ${c === "&" ? "is-amp" : ""}`} key={i} aria-hidden="true">
            {c}
          </span>
        ))}
      </div>
      <p className="footer__small">© {new Date().getFullYear()} Flip &amp; Grill</p>
    </footer>
  );
}

export function Nav() {
  return (
    <header className="nav" id="top">
      <a href="#top" className="nav__brand" aria-label="Flip & Grill home">
        <img src="/logo-sm.png" alt="" width="44" height="44" />
        <span>FLIP <b>&amp;</b> GRILL</span>
      </a>
      <nav className="nav__links" aria-label="Main">
        <a href="#menu">Menu</a>
        <a href="#find">IBA Stall</a>
        <a href="#catering">Catering</a>
      </nav>
      <a href="#catering" className="btn btn--small">Book Us!</a>
    </header>
  );
}
