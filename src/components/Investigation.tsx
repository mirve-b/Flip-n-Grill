import { Sparks, type Spark } from "./Sparks";

// sparkles around the burger: [left %, top %, size %, colour, delay s, shape], relative to the whole artwork
const SPARKS: readonly Spark[] = [
  [11, 17, 14, "#fff4dc", 0, "star"],
  [57, 8, 11, "#006267", 1.4, "star"],
  [80, 24, 13, "#fff4dc", 0.7, "star"],
  [77, 87, 11, "#d54000", 1.8, "star"],
  [21, 83, 11, "#006267", 0.4, "plus"],
  [6, 62, 9, "#fff4dc", 1.1, "star"],
  [83, 66, 8.5, "#006267", 2.2, "plus"],
  [40, 5, 8, "#d54000", 0.9, "plus"],
];

/** 02 / The investigation: the hero burger collage beside a short line about getting it right. */
export function Investigation() {
  return (
    <section className="invest" aria-labelledby="invest-title">
      <div className="wrap invest__inner">
        <div data-reveal="left" className="invest__art">
          <img decoding="async" src="/art/burger-burst.webp" width="1400" height="1133" alt="Smash burger with cheese, onions and jalapeños" />
          <Sparks items={SPARKS} />
        </div>
        <div className="invest__text" data-reveal>
          <p className="label">02 / The investigation</p>
          <h2 className="invest__title" id="invest-title">Good burgers don't just happen.</h2>
          <p>
            A lot of trial, a little error, countless taste tests. Until the patty, the crust and that signature sauce
            finally came together.
          </p>
        </div>
      </div>
    </section>
  );
}
