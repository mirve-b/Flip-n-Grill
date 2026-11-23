import { useEffect, useRef, useState, type FormEvent } from "react";
import { CONTACT, EVENT_TYPES, KARACHI_AREAS } from "../data/contact";

/** The contact page (#contact): three steps, then the booking form (sends via WhatsApp, email or Instagram). */
type Status = { kind: "idle" } | { kind: "sent"; via: "whatsapp" | "email" | "instagram" | "copied" } | { kind: "error"; msg: string };

const STEPS = [
  { n: "01", title: "Tell us", text: "Fill the form: date, area, headcount, vibe." },
  { n: "02", title: "We plan it", text: "We confirm the menu and send you a quote." },
  { n: "03", title: "We smash on site", text: "We roll up with the grill and feed the crowd." },
];

const today = () => new Date().toISOString().slice(0, 10);

function buildMessage(f: FormData) {
  const type = EVENT_TYPES.find((t) => t.id === f.get("type"))?.label ?? "";
  const lines = [
    "Hi Flip & Grill! Catering enquiry 🍔",
    "",
    `Name: ${f.get("name")}`,
    `Phone: ${f.get("phone")}`,
    `Event: ${type}`,
    `Date: ${f.get("date")}`,
    `Guests: ~${f.get("guests")}`,
    `Area: ${f.get("area")}, Karachi`,
  ];
  const notes = String(f.get("notes") ?? "").trim();
  if (notes) lines.push(`Notes: ${notes}`);
  return lines.join("\n");
}

const sendLabel = CONTACT.whatsapp ? "Send on WhatsApp" : CONTACT.email ? "Send by email" : CONTACT.instagram ? "Send via Instagram DM" : "Send booking";

// the booking, one or two questions at a time
const QUESTIONS = ["What's the occasion?", "Who's booking?", "When, and how many?", "Where in Karachi?", "Anything else?"];

export function Catering() {
  const [type, setType] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const form = useRef<HTMLFormElement>(null);
  const last = QUESTIONS.length - 1;

  // each new question: focus its first field (not on the very first, so the page doesn't jump on load)
  useEffect(() => {
    if (step === 0) return;
    form.current?.querySelector<HTMLElement>(`[data-step="${step}"] input:not([type=radio]), [data-step="${step}"] textarea`)?.focus({ preventScroll: true });
  }, [step]);

  const pick = (set: (v: string) => void, v: string) => {
    set(v);
    window.setTimeout(() => setStep((s) => Math.min(last, s + 1)), 420);   // a beat to see the pick, then move on
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    if (!f.reportValidity()) return;   // checks this question (later ones are disabled, earlier ones already passed)
    if (step < last) { setStep(step + 1); return; }
    const msg = buildMessage(new FormData(f));

    if (CONTACT.whatsapp) {
      window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
      setStatus({ kind: "sent", via: "whatsapp" });
    } else if (CONTACT.email) {
      window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent("Catering enquiry")}&body=${encodeURIComponent(msg)}`;
      setStatus({ kind: "sent", via: "email" });
    } else if (CONTACT.instagram) {
      // copy first (while the page still has focus), then open their DMs in the same click
      const copied = navigator.clipboard?.writeText(msg).catch(() => undefined);
      window.open(`https://ig.me/m/${CONTACT.instagram}`, "_blank", "noopener");
      await copied;
      setStatus({ kind: "sent", via: "instagram" });
    } else {
      try {
        await navigator.clipboard.writeText(msg);
        setStatus({ kind: "sent", via: "copied" });
      } catch {
        setStatus({ kind: "error", msg: "Booking contact isn't set up yet. Please try again soon!" });
      }
    }
  };

  return (
    <section className="cater" id="contact-page" aria-labelledby="cater-title">
      <div className="wrap">
        <a className="cater__back" href="#top">← Back to the burgers</a>
        <p className="label label--center">Contact / Catering</p>
        <h2 data-reveal className="cater__title" id="cater-title">We Bring The Grill!</h2>
        <p className="cater__sub" data-reveal>
          Bazaars, weddings, office days, campus events, birthdays. Wherever the crowd is, we'll be smashing burgers on
          site. Karachi only.
        </p>

        <ol className="cater__steps">
          {STEPS.map((s) => (
            <li key={s.n} data-reveal style={{ transitionDelay: `${Number(s.n) * 80}ms` }}>
              <span>{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="cater__card" data-reveal>
          <h3 className="cater__formtitle">Book us for your event</h3>

          {status.kind === "sent" ? (
            <div className="cater__done" role="status">
              <p className="cater__donebig">Almost booked!</p>
              {status.via === "whatsapp" && <p>WhatsApp just opened with your details filled in. Hit <b>send</b> and we'll get back to you.</p>}
              {status.via === "email" && <p>Your email app just opened with your details. Hit <b>send</b> and we'll get back to you.</p>}
              {status.via === "instagram" && (
                <p>
                  Your booking details are <b>copied</b> and Instagram DMs just opened. Paste the message to{" "}
                  <a href={`https://ig.me/m/${CONTACT.instagram}`} target="_blank" rel="noopener">@{CONTACT.instagram}</a> and hit send.
                </p>
              )}
              {status.via === "copied" && <p>Your booking details are copied. Paste them to us on WhatsApp or Instagram.</p>}
              <button className="btn btn--cream" onClick={() => { setStatus({ kind: "idle" }); setStep(0); setType(""); setArea(""); }}>Book another event</button>
            </div>
          ) : (
            <form className="form quiz" ref={form} onSubmit={onSubmit} noValidate={false}>
              <div className="quiz__top">
                <span className="quiz__count">{step + 1} / {QUESTIONS.length}</span>
                <span className="quiz__bar" aria-hidden="true"><i style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} /></span>
              </div>

              {/* every question stays in the form (so all answers send), but only the current one shows; later ones are
                  disabled so the browser only checks what's been asked so far */}
              <fieldset data-step={0} hidden={step !== 0} className="quiz__q">
                <legend className="quiz__ask">What's the occasion?</legend>
                <div className="form__types">
                  {EVENT_TYPES.map((t) => (
                    <label key={t.id} className={`chip ${type === t.id ? "is-on" : ""}`}>
                      <input type="radio" name="type" value={t.id} required checked={type === t.id} onChange={() => pick(setType, t.id)} />
                      {t.label}
                    </label>
                  ))}
                </div>
                {type && <p className="quiz__sfx" key={type}>{EVENT_TYPES.find((t) => t.id === type)?.sfx}</p>}
              </fieldset>

              <fieldset data-step={1} hidden={step !== 1} disabled={step < 1} className="quiz__q">
                <legend className="quiz__ask">Who's booking?</legend>
                <div className="form__grid">
                  <label className="field">
                    <span>Your name</span>
                    <input name="name" required autoComplete="name" placeholder="Ayesha Khan" />
                  </label>
                  <label className="field">
                    <span>WhatsApp / phone</span>
                    <input
                      name="phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder="03xx xxxxxxx"
                      pattern="^[+0-9][0-9\s\-]{9,15}$" title="A Pakistani mobile number, e.g. 0300 1234567"
                    />
                  </label>
                </div>
              </fieldset>

              <fieldset data-step={2} hidden={step !== 2} disabled={step < 2} className="quiz__q">
                <legend className="quiz__ask">When, and how many?</legend>
                <div className="form__grid">
                  <label className="field">
                    <span>Event date</span>
                    <input name="date" type="date" required min={today()} />
                  </label>
                  <label className="field">
                    <span>Roughly how many guests?</span>
                    <input name="guests" type="number" required min={1} inputMode="numeric" placeholder="150" />
                  </label>
                </div>
              </fieldset>

              <fieldset data-step={3} hidden={step !== 3} disabled={step < 3} className="quiz__q">
                <legend className="quiz__ask">Where in Karachi?</legend>
                <div className="form__types">
                  {KARACHI_AREAS.map((a) => (
                    <label key={a} className={`chip ${area === a ? "is-on" : ""}`}>
                      <input type="radio" name="area" value={a} required checked={area === a} onChange={() => pick(setArea, a)} />
                      {a}
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset data-step={4} hidden={step !== 4} disabled={step < 4} className="quiz__q">
                <legend className="quiz__ask">Anything else?</legend>
                <label className="field">
                  <span>Venue, timings, menu ideas (optional)</span>
                  <textarea name="notes" rows={3} placeholder="Mehndi at a farmhouse, food from 9pm, mostly smash burgers + curly fries…" />
                </label>
              </fieldset>

              {status.kind === "error" && <p className="form__error" role="alert">{status.msg}</p>}

              <div className="quiz__nav">
                {step > 0 && <button type="button" className="quiz__back" onClick={() => setStep(step - 1)}>← Back</button>}
                {(step === 1 || step === 2 || step === 4 || (step === 0 && type) || (step === 3 && area)) && (
                  <button type="submit" className="btn">{step === last ? `${sendLabel} →` : "Next →"}</button>
                )}
                {step === last && <p>We cater anywhere in Karachi. Outside Karachi? Sorry, not yet!</p>}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
