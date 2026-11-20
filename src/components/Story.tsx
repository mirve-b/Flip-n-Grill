import { Dots } from "./Dots";

/** 01 / The problem: the story on a red band, with the case file and folder pinned beside it. */
export function Story() {
  return (
    <section className="story" id="story" aria-labelledby="story-title">
      <div className="story__band">
        <div className="wrap story__inner">
          <div className="story__text" data-reveal>
            <p className="label">01 / The problem</p>
            <h2 className="sr-only" id="story-title">Our story</h2>
            <p>For too long, Karachi settled for thick, grey, sad burgers.</p>
            <p>Then two guys named Omar grabbed a spatula…</p>
            <p className="story__hard">…and pressed. HARD.</p>
            <p className="story__smash" aria-hidden="true">SMASH!</p>
          </div>

          <div className="story__docs" data-reveal="docs">
            <Dots cols={4} rows={3} className="story__dots story__dots--a" />
            <Dots cols={4} rows={4} className="story__dots story__dots--b" />
            <Dots cols={2} rows={4} className="story__dots story__dots--c" />
            <img decoding="async" className="story__file" src="/art/case-file.webp" alt="Case file: The case of the sad burger. Thick, lifeless patties. Two guys, both named Omar. One spatula, one grill, one very hard smash. Case closed." />
            <span className="story__tape" aria-hidden="true" />
            <img decoding="async" className="story__folder" src="/art/case-folder.webp" alt="" />
            <span className="story__stamp" aria-hidden="true">Confidential!</span>
          </div>
        </div>
      </div>
    </section>
  );
}
