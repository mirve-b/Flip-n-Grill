import type { IconId } from "../data/menu";

const ink = { stroke: "#000000", strokeWidth: 5, strokeLinejoin: "round", strokeLinecap: "round" } as const;
const seed = { fill: "#F1D7B3", stroke: "#000000", strokeWidth: 2.5 } as const;

const viewBoxes: Record<IconId, string> = {
  burger: "0 0 200 160",
  double: "0 0 200 190",
  curly: "0 0 200 160",
  animal: "0 0 200 160",
  mozzy: "0 0 200 160",
  water: "0 0 200 160",
  soda: "0 0 200 160",
};

export function Icon({ id, className }: { id: IconId; className?: string }) {
  return (
    <svg className={className} viewBox={viewBoxes[id]} aria-hidden="true">
      <use href={`#i-${id}`} />
    </svg>
  );
}

const curl1 = "M60 120 C20 120 20 60 60 60 C90 60 90 100 64 100 C48 100 48 80 62 80";
const curl2 = "M130 130 C90 130 92 66 134 66 C168 66 166 112 136 112 C118 112 118 88 134 88";
const curl3 = "M100 70 C70 70 70 22 102 22 C128 22 126 56 104 56 C92 56 92 40 102 40";
const fries = "M44 70 L40 30 M64 70 L66 22 M86 70 L80 26 M106 70 L110 18 M128 70 L124 28 M148 70 L154 24 M164 70 L160 36";

/** Hand-drawn comic-ink sprite, rendered once and referenced via <use>. */
export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <symbol id="i-burger" viewBox="0 0 200 160">
          <g {...ink}>
            <path d="M22 70 Q22 14 100 14 Q178 14 178 70 Z" fill="#FF9400" />
            <path d="M40 40 Q60 26 84 24" fill="none" stroke="#F1D7B3" strokeWidth={6} />
            <path d="M14 82 Q100 66 186 82 L186 98 Q100 112 14 98 Z" fill="#5C1F00" />
            <path d="M14 78 L186 78 L178 92 L168 86 L158 106 L146 88 L120 96 L104 120 L92 94 L64 98 L54 112 L42 90 L22 94 Z" fill="#F1D7B3" />
            <path d="M18 112 Q100 102 182 112 L182 120 Q178 146 100 146 Q22 146 18 120 Z" fill="#FF9400" />
          </g>
          <g {...seed}>
            <ellipse cx="70" cy="36" rx="6" ry="3.5" transform="rotate(-20 70 36)" />
            <ellipse cx="104" cy="28" rx="6" ry="3.5" />
            <ellipse cx="138" cy="38" rx="6" ry="3.5" transform="rotate(20 138 38)" />
            <ellipse cx="90" cy="52" rx="6" ry="3.5" transform="rotate(10 90 52)" />
            <ellipse cx="124" cy="56" rx="6" ry="3.5" transform="rotate(-10 124 56)" />
            <ellipse cx="156" cy="58" rx="5" ry="3" />
            <ellipse cx="54" cy="58" rx="5" ry="3" />
          </g>
        </symbol>

        <symbol id="i-double" viewBox="0 0 200 190">
          <g {...ink}>
            <path d="M22 62 Q22 8 100 8 Q178 8 178 62 Z" fill="#FF9400" />
            <path d="M40 34 Q60 20 84 18" fill="none" stroke="#F1D7B3" strokeWidth={6} />
            <path d="M14 74 Q100 58 186 74 L186 90 Q100 104 14 90 Z" fill="#5C1F00" />
            <path d="M14 70 L186 70 L176 84 L160 80 L148 100 L132 82 L104 88 L94 108 L80 86 L56 90 L44 104 L34 84 L20 86 Z" fill="#F1D7B3" />
            <path d="M14 112 Q100 96 186 112 L186 128 Q100 142 14 128 Z" fill="#5C1F00" />
            <path d="M14 108 L186 108 L178 122 L162 118 L150 140 L134 120 L110 126 L98 148 L84 124 L60 128 L48 142 L36 122 L20 124 Z" fill="#F1D7B3" />
            <path d="M18 142 Q100 132 182 142 L182 150 Q178 178 100 178 Q22 178 18 150 Z" fill="#FF9400" />
          </g>
          <g {...seed}>
            <ellipse cx="70" cy="30" rx="6" ry="3.5" transform="rotate(-20 70 30)" />
            <ellipse cx="104" cy="22" rx="6" ry="3.5" />
            <ellipse cx="138" cy="32" rx="6" ry="3.5" transform="rotate(20 138 32)" />
            <ellipse cx="90" cy="46" rx="6" ry="3.5" transform="rotate(10 90 46)" />
            <ellipse cx="124" cy="48" rx="6" ry="3.5" transform="rotate(-10 124 48)" />
          </g>
        </symbol>

        <symbol id="i-curly" viewBox="0 0 200 160">
          <g fill="none" strokeLinecap="round">
            {[
              [curl1, "#FF9400"],
              [curl2, "#FF9400"],
              [curl3, "#FF9400"],
            ].map(([d, c]) => (
              <g key={d}>
                <path d={d} stroke="#000000" strokeWidth={20} />
                <path d={d} stroke={c} strokeWidth={11} />
              </g>
            ))}
          </g>
        </symbol>

        <symbol id="i-animal" viewBox="0 0 200 160">
          <g {...ink}>
            <path d="M20 70 L180 70 L164 146 L36 146 Z" fill="#D44000" />
            <path d={fries} stroke="#000000" strokeWidth={16} />
            <path d={fries} stroke="#FF9400" strokeWidth={8} />
            <path d="M30 60 Q50 40 70 58 Q90 36 110 56 Q130 36 150 56 Q168 42 176 62 L176 76 L24 76 Z" fill="#F1D7B3" />
            <path d="M40 64 Q60 54 80 64 Q100 52 120 62 Q140 54 160 64" fill="none" stroke="#F1D7B3" strokeWidth={5} />
            <path d="M50 52 l10 -4 M96 46 l12 2 M138 48 l10 4" stroke="#5C1F00" strokeWidth={7} />
          </g>
          <path d="M70 100 L130 100 M80 118 L120 118" stroke="#F1D7B3" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
        </symbol>

        <symbol id="i-mozzy" viewBox="0 0 200 160">
          <g {...ink}>
            <rect x="18" y="74" width="120" height="34" rx="14" fill="#E88600" transform="rotate(-14 78 91)" />
            <rect x="54" y="96" width="130" height="34" rx="14" fill="#FF9400" transform="rotate(8 119 113)" />
            <path d="M128 70 Q140 92 150 96 L150 104 Q138 100 124 80 Z" fill="#F1D7B3" />
            <rect x="70" y="30" width="110" height="34" rx="14" fill="#FF9400" transform="rotate(-24 125 47)" />
          </g>
          <g fill="#5C1F00" opacity={0.55}>
            <circle cx="52" cy="90" r="3" /><circle cx="74" cy="84" r="2.5" /><circle cx="100" cy="114" r="3" />
            <circle cx="140" cy="118" r="2.5" /><circle cx="120" cy="46" r="3" /><circle cx="150" cy="36" r="2.5" />
          </g>
        </symbol>

        <symbol id="i-water" viewBox="0 0 200 160">
          <g stroke="#000000" strokeWidth={5} strokeLinejoin="round">
            <rect x="84" y="8" width="32" height="18" rx="4" fill="#006267" />
            <path d="M88 26 L112 26 L112 40 Q140 52 140 76 L140 140 Q140 152 128 152 L72 152 Q60 152 60 140 L60 76 Q60 52 88 40 Z" fill="#F1D7B3" />
            <rect x="60" y="84" width="80" height="34" fill="#F1D7B3" />
          </g>
          <path d="M72 64 L72 136" stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.8} />
          <text x="100" y="108" textAnchor="middle" fontFamily="Bangers" fontSize="20" fill="#006267">H2O</text>
        </symbol>

        <symbol id="i-soda" viewBox="0 0 200 160">
          <g {...ink}>
            <path d="M112 6 L104 44" fill="none" strokeWidth={10} />
            <path d="M112 6 L104 44" fill="none" stroke="#F1D7B3" strokeWidth={4} />
            <path d="M56 40 L144 40 L132 152 L68 152 Z" fill="#D44000" />
            <rect x="50" y="30" width="100" height="16" rx="5" fill="#F1D7B3" />
            <path d="M62 82 L138 82 L134 116 L66 116 Z" fill="#F1D7B3" />
          </g>
          <text x="100" y="108" textAnchor="middle" fontFamily="Bangers" fontSize="22" fill="#D44000">FIZZ!</text>
        </symbol>
      </defs>
    </svg>
  );
}
