import { useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CONTACT, EVENT_TYPES, KARACHI_AREAS } from "../data/contact";
import { SplitTitle } from "./SplitTitle";
import { Edge } from "./Edge";
import { burst } from "../lib/burst";

type Status = { kind: "idle" } | { kind: "sent"; via: "whatsapp" | "email" | "instagram" | "copied" } | { kind: "error"; msg: string };

const STEPS = [
  { n: 1, title: "Tell us", text: "Fill the form: date, area, headcount, vibe." },
  { n: 2, title: "We plan it", text: "We confirm the menu and send you a quote." },
  { n: 3, title: "We smash on site", text: "We roll up with the grill and feed the crowd." },
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

export function Catering() {
  const ref = useRef<HTMLElement>(null);
  const [type, setType] = useState<string>("bazaar");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".cater__stamp", {
          scale: 3,
          rotation: 40,
          opacity: 0,
          duration: 0.5,
          ease: "power4.in",
          scrollTrigger: { trigger: ".cater__stamp", start: "top 85%" },
        });
      });
    },
    { scope: ref },
  );

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const msg = buildMessage(new FormData(form));
    const btn = form.querySelector<HTMLButtonElement>("button[type=submit]");
    const r = btn?.getBoundingClientRect();
    if (r) burst(r.left + r.width / 2, r.top, "BOOKED!");

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

  const type_ = EVENT_TYPES.find((t) => t.id === type);

  return (
    <section className="cater" id="catering" ref={ref}>
      <Edge color="var(--teal)" />
      <div className="section">
        <header className="section__head">
          <p className="caption-box reveal">Chapter 05: Catering</p>
          <SplitTitle text="We Bring the Grill" />
          <p className="cater__lede reveal">
            Bazaars, weddings, office days, campus events, birthdays. Wherever the crowd is,
            we'll be smashing burgers on site.
          </p>
          <div className="cater__stamp" aria-label="Karachi only">
            <span>Karachi</span>
            <b>ONLY</b>
          </div>
        </header>

        <ol className="cater__steps">
          {STEPS.map((s) => (
            <li className="cater__step reveal" key={s.n}>
              <span className="cater__num">{s.n}</span>
              <h4>{s.title}</h4>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="cater__card reveal">
          <div className="cater__formhead">
            <h3>Book us for your event</h3>
            <p className="cater__sfx" key={type} aria-hidden="true">{type_?.sfx}</p>
          </div>

          {status.kind === "sent" ? (
            <div className="cater__done" role="status">
              <p className="cater__done-big">BOOKED… almost!</p>
              {status.via === "whatsapp" && <p>WhatsApp just opened with your details filled in. Hit <b>send</b> and we'll get back to you.</p>}
              {status.via === "email" && <p>Your email app just opened with your details. Hit <b>send</b> and we'll get back to you.</p>}
              {status.via === "instagram" && (
                <p>
                  Your booking details are <b>copied</b> and Instagram DMs just opened. Paste the message to{" "}
                  <a href={`https://ig.me/m/${CONTACT.instagram}`} target="_blank" rel="noopener">@{CONTACT.instagram}</a> and hit send.
                </p>
              )}
              {status.via === "copied" && <p>Your booking details are copied. Paste them to us on WhatsApp or Instagram.</p>}
              <button className="btn btn--ghost" onClick={() => setStatus({ kind: "idle" })}>Book another event</button>
            </div>
          ) : (
            <form className="cater__form" onSubmit={onSubmit}>
              <fieldset className="cater__types">
                <legend>What's the occasion?</legend>
                {EVENT_TYPES.map((t) => (
                  <label key={t.id} className={`chip chip--radio ${type === t.id ? "is-on" : ""}`}>
                    <input type="radio" name="type" value={t.id} checked={type === t.id} onChange={() => setType(t.id)} />
                    {t.label}
                  </label>
                ))}
              </fieldset>

              <div className="cater__grid">
                <label className="field">
                  <span>Your name</span>
                  <input name="name" required autoComplete="name" placeholder="Ayesha Khan" />
                </label>
                <label className="field">
                  <span>WhatsApp / phone</span>
                  <input
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="03xx xxxxxxx"
                    pattern="^[+0-9][0-9\s\-]{9,15}$"
                    title="A Pakistani mobile number, e.g. 0300 1234567"
                  />
                </label>
                <label className="field">
                  <span>Event date</span>
                  <input name="date" type="date" required min={today()} />
                </label>
                <label className="field">
                  <span>Roughly how many guests?</span>
                  <input name="guests" type="number" required min={1} inputMode="numeric" placeholder="150" />
                </label>
                <label className="field field--wide">
                  <span>Area in Karachi</span>
                  <select name="area" required defaultValue="">
                    <option value="" disabled>Pick an area…</option>
                    {KARACHI_AREAS.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </label>
                <label className="field field--wide">
                  <span>Anything else? (venue, timings, menu ideas)</span>
                  <textarea name="notes" rows={3} placeholder="Mehndi at a farmhouse, food from 9pm, mostly smash burgers + curly fries…" />
                </label>
              </div>

              {status.kind === "error" && <p className="cater__error" role="alert">{status.msg}</p>}

              <div className="cater__submit">
                <button type="submit" className="btn btn--big">
                  {CONTACT.whatsapp ? "Send on WhatsApp" : CONTACT.email ? "Send by email" : CONTACT.instagram ? "Send via Instagram DM" : "Send booking"} →
                </button>
                <p className="cater__note">We cater anywhere in Karachi. Outside Karachi? Sorry, not yet!</p>
              </div>
            </form>
          )}
        </div>

        <ContactStrip />
      </div>
    </section>
  );
}

export function ContactStrip({ compact = false }: { compact?: boolean }) {
  const items = [
    CONTACT.whatsapp && { href: `https://wa.me/${CONTACT.whatsapp}`, label: "WhatsApp", value: `+${CONTACT.whatsapp}` },
    CONTACT.instagram && { href: `https://instagram.com/${CONTACT.instagram}`, label: "Instagram", value: `@${CONTACT.instagram}` },
    CONTACT.email && { href: `mailto:${CONTACT.email}`, label: "Email", value: CONTACT.email },
  ].filter(Boolean) as { href: string; label: string; value: string }[];
  if (!items.length) return null;
  return (
    <ul className={`contacts ${compact ? "contacts--compact" : ""}`}>
      {items.map((c) => (
        <li key={c.label}>
          <a href={c.href} target="_blank" rel="noopener">
            <b>{c.label}</b> {c.value}
          </a>
        </li>
      ))}
    </ul>
  );
}
