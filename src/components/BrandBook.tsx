import type { CSSProperties } from "react";
import { Dots } from "./Dots";
import { Sparks, type Spark } from "./Sparks";
import "./brand.css";

/**
 * The brand book (#brand): one long poster of the Flip & Grill identity. Logo, colour, type, the boys,
 * the kit of shapes and stickers, and the voice. Deliberately few words: the page shows rather than explains.
 */
const COLOURS = [
  { name: "Grill", hex: "#006267", ink: "#f1d7b3", note: "the base" },
  { name: "Flip", hex: "#FF9400", ink: "#1d130e", note: "the shout" },
  { name: "Heat", hex: "#D54000", ink: "#f1d7b3", note: "the story" },
  { name: "Bun", hex: "#F1D7B3", ink: "#1d130e", note: "the paper" },
  { name: "Spark", hex: "#FFD23F", ink: "#1d130e", note: "the bursts" },
  { name: "Char", hex: "#1D130E", ink: "#f1d7b3", note: "the outline" },
];

const COVER_SPARKS: readonly Spark[] = [
  [8, 22, 3.2, "#fff4dc", 0, "star"],
  [90, 18, 2.6, "#ff9400", 0.8, "plus"],
  [84, 74, 3.4, "#fff4dc", 1.6, "star"],
  [14, 78, 2.4, "#ffd23f", 0.4, "plus"],
  [50, 10, 2, "#fff4dc", 2.2, "star"],
];

const KIT_SPARKS: readonly Spark[] = [
  [22, 40, 34, "#ffd23f", 0, "star"],
  [62, 58, 26, "#ff9400", 0.7, "plus"],
  [86, 32, 18, "#fff4dc", 1.3, "dot"],
];

const BOYS = [
  { who: 1, tag: "I flip", say: "OUCH!", bg: "var(--orange)" },
  { who: 2, tag: "I grill", say: "Careful!", bg: "var(--cream)" },
] as const;

export function BrandBook() {
  return (
    <div className="bb" id="brand-book">
      {/* cover */}
      <section className="bb-cover">
        <a className="bb-back" href="#top">← Back to the burgers</a>
        <img className="bb-cover__burst" src="/art/starburst.webp" alt="" />
        <Sparks items={COVER_SPARKS} />
        <p className="bb-tag">Brand book · Vol. 01</p>
        <h1 className="bb-word">
          <span>FLIP<small>&amp;</small></span>
          <span className="bb-word__grill">GRILL</span>
        </h1>
        <p className="bb-cover__line">Smash burgers. Loud on purpose.</p>
        {BOYS.map((b) => (
          <img key={b.who} className={`bb-cover__boy bb-cover__boy--${b.who}`} src={`/mascots/omar-${b.who}.webp`} alt="" />
        ))}
      </section>

      {/* 01 logo */}
      <section className="bb-sec bb-logo">
        <h2 className="bb-h"><span>01</span> Logo</h2>
        <div className="bb-logo__grid" data-reveal>
          {[
            ["var(--teal)", "var(--orange)", "On grill"],
            ["var(--orange)", "var(--teal)", "On flip"],
            ["var(--cream)", "var(--ink)", "On bun"],
            ["var(--ink)", "var(--cream)", "On char"],
          ].map(([bg, fg, label]) => (
            <figure key={label} className="bb-logo__tile" style={{ "--bg": bg, "--fg": fg } as CSSProperties}>
              <span className="bb-mark">FLIP<b>&amp;</b>GRILL</span>
              <figcaption>{label}</figcaption>
            </figure>
          ))}
        </div>
        <p className="bb-rule" data-reveal>Always caps. Always chunky. The <b>&amp;</b> stays small.</p>
      </section>

      {/* 02 colour */}
      <section className="bb-sec bb-colour">
        <h2 className="bb-h"><span>02</span> Colour</h2>
        <div className="bb-colour__row" data-reveal>
          {COLOURS.map((c) => (
            <div key={c.name} className="bb-chip" style={{ "--c": c.hex, "--i": c.ink } as CSSProperties}>
              <strong>{c.name}</strong>
              <span>{c.hex}</span>
              <em>{c.note}</em>
            </div>
          ))}
        </div>
      </section>

      {/* 03 type */}
      <section className="bb-sec bb-type">
        <h2 className="bb-h"><span>03</span> Type</h2>
        <div className="bb-type__grid" data-reveal>
          <div className="bb-font bb-font--head">
            <span className="bb-font__aa">Aa</span>
            <strong>Londrina Solid</strong>
            <em>Headlines. Big, fat, happy.</em>
          </div>
          <div className="bb-font bb-font--body">
            <span className="bb-font__aa">Aa</span>
            <strong>Konkhmer Sleokchher</strong>
            <em>Everything you read.</em>
          </div>
          <div className="bb-font bb-font--mono">
            <span className="bb-font__aa">Aa</span>
            <strong>Apple Symbols / Space Mono</strong>
            <em>Labels, receipts, fine print.</em>
          </div>
        </div>
      </section>

      {/* 04 the boys */}
      <section className="bb-sec bb-boys">
        <h2 className="bb-h"><span>04</span> The boys</h2>
        <div className="bb-boys__row">
          {BOYS.map((b) => (
            <figure key={b.who} className="bb-boy" style={{ "--bg": b.bg } as CSSProperties} data-reveal>
              <span className="bb-boy__say">{b.say}</span>
              <img src={`/mascots/omar-${b.who}.webp`} alt={`Omar ${b.who}`} />
              <figcaption>
                <b>Omar 0{b.who}</b>
                <span className="bb-pill">{b.tag}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="bb-rule" data-reveal>Two guys. Both named Omar. Never apart.</p>
      </section>

      {/* 05 kit */}
      <section className="bb-sec bb-kit">
        <h2 className="bb-h"><span>05</span> The kit</h2>
        <div className="bb-kit__grid" data-reveal>
          <div className="bb-kit__cell bb-kit__cell--burst"><img src="/art/starburst.webp" alt="" /><em>Burst</em></div>
          <div className="bb-kit__cell bb-kit__cell--spark"><Sparks items={KIT_SPARKS} /><em>Sparkles</em></div>
          <div className="bb-kit__cell bb-kit__cell--check"><span className="bb-check" /><em>Checker</em></div>
          <div className="bb-kit__cell bb-kit__cell--dots"><Dots cols={5} rows={4} className="bb-dots" /><em>Dots</em></div>
          <div className="bb-kit__cell bb-kit__cell--tape"><span className="bb-tape" /><em>Tape</em></div>
          <div className="bb-kit__cell bb-kit__cell--labels">
            <span className="bb-label bb-label--teal">Stall at IBA Karachi</span>
            <span className="bb-label bb-label--orange">Catering all over karachi</span>
            <em>Labels</em>
          </div>
          <div className="bb-kit__cell bb-kit__cell--stickers">
            <img src="/art/smash-card.webp" alt="" />
            <img src="/art/sticky-note.webp" alt="" />
            <img src="/art/smiley.webp" alt="" />
            <em>Stickers</em>
          </div>
          <div className="bb-kit__cell bb-kit__cell--buttons">
            <span className="btn btn--cream">I'm at IBA!</span>
            <span className="btn">Book for an event</span>
            <em>Buttons</em>
          </div>
        </div>
      </section>

      {/* 06 voice */}
      <section className="bb-sec bb-voice">
        <h2 className="bb-h"><span>06</span> Voice</h2>
        <div className="bb-voice__words" data-reveal>
          <span>Loud.</span>
          <span>Hungry.</span>
          <span>Playful.</span>
        </div>
        <div className="bb-voice__eg" data-reveal>
          <span className="bb-say bb-say--yes">“SMASH!”</span>
          <span className="bb-say bb-say--yes">“Come hungry again.”</span>
          <span className="bb-say bb-say--no">“Premium artisanal dining experience.”</span>
        </div>
      </section>

      {/* sign-off */}
      <section className="bb-end">
        <img className="bb-end__burger" src="/art/burger.webp" alt="" />
        <p className="bb-word bb-word--small"><span>FLIP<small>&amp;</small></span><span className="bb-word__grill">GRILL</span></p>
        <a className="btn btn--cream" href="#top">Back to the burgers</a>
      </section>
    </div>
  );
}
