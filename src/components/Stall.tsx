import { CONTACT } from "../data/contact";

const MAPS = "https://maps.google.com/?q=Institute+of+Business+Administration+Karachi";

/** 04 / IBA students: where to find the stall. Just the spot and two buttons. */
export function Stall() {
  const ig = CONTACT.instagram;
  return (
    <section className="stall paper" id="stall" aria-labelledby="stall-title">
      <div className="wrap">
        <p className="label label--center">04 / IBA students</p>
        <h2 data-reveal className="stall__title" id="stall-title">
          Where's The Stall<span>?</span>
        </h2>

        <div className="stall__box" data-reveal>
          <div className="stall__map" aria-hidden="true">
            <span className="stall__road stall__road--h" />
            <span className="stall__road stall__road--v" />
            <span className="stall__pin"><b>F&amp;G</b></span>
          </div>
          <div className="stall__info">
            <p className="stall__where">IBA Karachi</p>
            <p className="stall__line">Right on campus. Follow the smell.</p>
            <div className="stall__ctas">
              <a className="btn" href={MAPS} target="_blank" rel="noopener">Open in Maps</a>
              {ig && (
                <a className="btn btn--cream" href={`https://instagram.com/${ig}`} target="_blank" rel="noopener">
                  Stall updates on IG
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
