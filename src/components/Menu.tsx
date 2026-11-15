import { useRef } from "react";
import { burgers, drinks, extras, meals, sides, type MenuItem } from "../data/menu";
import { Icon } from "./Icons";
import { SplitTitle } from "./SplitTitle";
import { Edge } from "./Edge";

function Panel({ item, variant }: { item: MenuItem; variant?: "hero" | "meal" | "drink" }) {
  const cls = ["panel", "reveal", variant && `panel--${variant}`, item.tone && `panel--${item.tone}`].filter(Boolean).join(" ");
  const body = (
    <>
      <h4>{item.name}</h4>
      {item.blurb && <p>{item.blurb}</p>}
    </>
  );
  return (
    <article className={cls}>
      {item.badge && <span className={`badge ${item.badge.tone === "red" ? "badge--red" : ""}`}>{item.badge.text}</span>}
      <Icon id={item.icon} className="panel__art" />
      {variant === "meal" ? <div>{body}</div> : body}
      {item.sfx && <span className="sfx-mini">{item.sfx}</span>}
    </article>
  );
}

export function Menu() {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <section className="menu-wrap" id="menu">
      <Edge color="var(--orange)" />
      <div className="section menu">
      <header className="section__head">
        <p className="caption-box reveal">Chapter 03</p>
        <SplitTitle text="The Menu" />
      </header>

      <h3 className="cat reveal">Burgers</h3>
      <div className="grid grid--2">
        {burgers.map((b) => <Panel key={b.name} item={b} variant="hero" />)}
      </div>

      <div className="extras reveal">
        <span className="extras__label">Power-ups</span>
        {extras.map((x) => <span className="chip" key={x}>+ {x}</span>)}
      </div>

      <h3 className="cat reveal">Sides</h3>
      <div className="grid grid--4">
        {sides.map((s) => <Panel key={s.name} item={s} />)}
      </div>

      <h3 className="cat reveal">Make it a Meal</h3>
      <div className="grid grid--2">
        {meals.map((m) => <Panel key={m.name} item={m} variant="meal" />)}
      </div>

      <h3 className="cat reveal">Drinks</h3>
      <div className="grid grid--2 grid--drinks">
        {drinks.map((d) => <Panel key={d.name} item={d} variant="drink" />)}
      </div>

      <div className="menu__board reveal">
        <button className="btn btn--ghost" onClick={() => dialog.current?.showModal()}>
          View the original menu board
        </button>
      </div>

      <dialog className="lightbox" ref={dialog} onClick={(e) => e.target === dialog.current && dialog.current?.close()}>
        <button className="lightbox__close" aria-label="Close" onClick={() => dialog.current?.close()}>✕</button>
        <img src="/menu-board.webp" loading="lazy" decoding="async" alt="Flip & Grill menu board: burgers, extras, sides, meals and drinks" />
      </dialog>
      </div>
    </section>
  );
}
