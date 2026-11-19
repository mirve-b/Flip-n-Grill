/** Thin dark-teal band with the name repeated, drifting slowly sideways. */
export function Strip() {
  return (
    <div className="strip" aria-hidden="true">
      <div className="strip__track">
        {Array.from({ length: 16 }, (_, i) => (
          <span key={i}>Flip &amp; Grill</span>
        ))}
      </div>
    </div>
  );
}
