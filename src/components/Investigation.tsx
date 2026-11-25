import { Sparks, type Spark } from "./Sparks";

// sparkles around the burger: [left %, top %, size %, colour, delay s, shape], relative to the whole artwork
const SPARKS: readonly Spark[] = [
  [12, 19, 7, "#fff4dc", 0, "star"],
  [57, 10, 5.5, "#006267", 1.4, "star"],
  [80, 26, 6.5, "#fff4dc", 0.7, "star"],
  [76, 86, 5.5, "#d54000", 1.8, "star"],
  [22, 82, 5.5, "#006267", 0.4, "plus"],
  [7, 62, 4.5, "#fff4dc", 1.1, "star"],
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
          <h2 className="invest__title" id="invest-title">But good burgers don't just happen.</h2>
          <p>
            A lot of trial, a little error, countless taste tests. Until the patty, the crust and that signature sauce
            finally came together.
          </p>
        </div>
      </div>
    </section>
  );
}
