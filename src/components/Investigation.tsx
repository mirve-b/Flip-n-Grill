import { Sparks, type Spark } from "./Sparks";

// sparkles around the burger: [left %, top %, size %, colour, delay s, shape], relative to the whole artwork
const SPARKS: readonly Spark[] = [
  [13, 20, 5.5, "#f1d7b3", 0, "star"],
  [31, 13, 3.5, "#006267", 0.7, "plus"],
  [56, 11, 4.5, "#f1d7b3", 1.8, "star"],
  [79, 18, 3, "#f1d7b3", 2.4, "dot"],
  [89, 36, 5, "#006267", 1.1, "star"],
  [88, 61, 3.5, "#f1d7b3", 0.4, "plus"],
  [75, 85, 4.5, "#d54000", 1.6, "star"],
  [49, 90, 3, "#f1d7b3", 2.8, "star"],
  [23, 82, 5, "#006267", 0.9, "star"],
  [9, 63, 3.5, "#f1d7b3", 2, "plus"],
  [7, 41, 2, "#f1d7b3", 1.3, "dot"],
  [42, 6, 2, "#d54000", 2.2, "dot"],
  [95, 50, 2.2, "#f1d7b3", 3, "dot"],
  [64, 95, 2, "#006267", 0.2, "dot"],
];

/** 02 / The investigation: the hero burger collage beside a short line about getting it right. */
export function Investigation() {
  return (
    <section className="invest" aria-labelledby="invest-title">
      <div className="wrap invest__inner">
        <div data-reveal="left" className="invest__art">
          <img src="/art/burger-burst.webp" alt="Smash burger with cheese, onions and jalapeños" loading="lazy" />
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
