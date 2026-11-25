import { useEffect, useRef, useState } from "react";
import { burgers, meals, sides, type MenuItem } from "../data/menu";
import { Dots } from "./Dots";

/**
 * 03 / The takeout: the menu printed as a till receipt on orange. As you scroll, it unrolls out of a paper roll top
 * to bottom, and rolls back up when you scroll back (scroll-driven, styles.css). Hovering, focusing or tapping a line
 * shows that item's drawing big on the left, like it just landed on the counter.
 */
const SECTIONS = [
  { title: "Burgers", items: burgers },
  { title: "Sides", items: sides },
  { title: "Make it a meal", items: meals },
];
const COUNT = SECTIONS.reduce((n, s) => n + s.items.length, 0);

export function Menu() {
  const [active, setActive] = useState<MenuItem>(burgers[0]);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const paper = el?.querySelector<HTMLElement>(".receipt");
    if (!el || !paper) return;
    // the roll needs the receipt's real height (--rh) so it stops exactly where the paper ends
    const ro = new ResizeObserver(() => el.style.setProperty("--rh", `${paper.offsetHeight}px`));
    ro.observe(paper);
    // browsers without scroll-driven animations: the unroll plays once, when the receipt is a quarter way up the screen
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("is-unrolled"); io.disconnect(); }
    }, { rootMargin: "0px 0px -25% 0px" });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  return (
    <section className="menu" id="menu" aria-labelledby="menu-title">
      <div className="wrap menu__layout">
        <div className="menu__intro">
          <p className="label">03 / The takeout</p>
          <h2 className="menu__title" id="menu-title">Menu</h2>
          <p className="menu__sub">Enough talking!! Here's the good stuff.</p>

          <div className="menu__counter" aria-hidden="true">
            <Dots cols={4} rows={3} className="menu__dots" />
            <div className="menu__pick" key={active.name}>
              <img decoding="async" src={active.img} alt="" />
            </div>
            <p className="menu__pickname">{active.name}</p>
            {active.blurb && <p className="menu__pickblurb">{active.blurb}</p>}
          </div>
        </div>

        <div className="receipt-wrap" ref={wrap}>
          <div className="receipt">
            <header className="receipt__head">
              <p className="receipt__brand">Flip &amp; Grill</p>
              <p>Smash burgers · IBA Karachi</p>
              <p className="receipt__row"><span>Order #0001</span><span>Cashier: Omar</span></p>
            </header>

            {SECTIONS.map((s) => (
              <div className="receipt__group" key={s.title}>
                <h3>** {s.title} **</h3>
                <ul>
                  {s.items.map((it) => (
                    <li key={it.name}>
                      <button
                        className={`receipt__item ${active === it ? "is-on" : ""}`}
                        onMouseEnter={() => setActive(it)}
                        onFocus={() => setActive(it)}
                        onClick={() => setActive(it)}
                      >
                        <span className="receipt__qty">1x</span>
                        <span className="receipt__name">
                          {it.name}
                          {it.blurb && <small>{it.blurb}</small>}
                        </span>
                        {it.price != null && <span className="receipt__price">Rs {it.price}</span>}
                        <img decoding="async" src={it.img} alt="" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <footer className="receipt__foot">
              <p className="receipt__row"><span>Items</span><span>{COUNT}</span></p>
              <p className="receipt__row receipt__total"><span>Total</span><span>1 happy tummy</span></p>
              <span className="receipt__barcode" />
              <p>Thank you! Come hungry again.</p>
            </footer>
          </div>
          {/* the roll-open cover: an orange sheet with a paper roll on its top edge slides down as you scroll */}
          <span className="receipt-cover" aria-hidden="true">
            <span className="receipt-curtain"><i className="receipt-roll" /></span>
          </span>
        </div>
      </div>
    </section>
  );
}
