import { useMemo } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------ *
 * Melting cheese, built as ONE continuous sheet.
 *
 * Every radial line of the sheet runs: across the top of the patty,
 * hugging its dome → over the edge → straight down as a drip. How far it
 * runs down depends on the angle (drip bumps) and on `melt` (0 → 1), so
 * the slice visibly sags and stretches into rounded drips.
 *
 * The last few millimetres of each line are coloured black via vertex
 * colours, which draws a clean ink line along the wavy drip edge with
 * zero extra draw calls.
 * ------------------------------------------------------------------ */

const SEG = 120; // around
const RINGS = 22; // along each radial line
const R = 1.34; // reach: just clear of the patty (radius 1.28) and its outline
const DOME = 0.3; // sits clearly above the puck top (half-height 0.24)
const N = 3; // same superellipse profile as the puck, so the slice hugs its flat top
const HALF = 0.94; // half-width of the square slice (corners reach ~1.33, just over the edge)
const SPIN = 0.35; // slice rotation so corners don't line up with the camera
const BAND = 0.03; // ink line width along the cheese surface (world units)

// drips: corners droop the most, plus a couple of runs off the flat sides
const C = Math.PI / 4 + SPIN;
const DRIPS = [
  { a: C, len: 0.46, w: 0.2 },
  { a: C + Math.PI / 2, len: 0.3, w: 0.17 },
  { a: C + Math.PI, len: 0.52, w: 0.21 },
  { a: C + Math.PI * 1.5, len: 0.36, w: 0.18 },
  { a: SPIN + 0.15, len: 0.2, w: 0.1 },
  { a: SPIN + Math.PI + 0.3, len: 0.24, w: 0.1 },
  { a: SPIN + Math.PI * 0.5 - 0.2, len: 0.16, w: 0.09 },
];

function angDist(a: number, b: number) {
  const d = Math.abs(a - b) % (Math.PI * 2);
  return d > Math.PI ? Math.PI * 2 - d : d;
}

/** distance from the centre to the edge of a (rotated) square slice */
function squareReach(theta: number) {
  const a = theta - SPIN;
  return HALF / Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a)));
}

/** total length of the sheet along angle θ: square slice that softens and runs into drips as it melts */
function reachAt(theta: number, melt: number) {
  // melting rounds the hard square off a little and spreads it
  // melting turns the square slice into an even skirt that folds just over the rim,
  // leaving a clean brown band of patty underneath
  const sq = squareReach(theta);
  const skirt = R - 0.05; // ends at the top edge of the patty, so its whole side shows
  const base = THREE.MathUtils.lerp(sq, skirt, THREE.MathUtils.smoothstep(melt, 0, 0.7));
  let total = base;
  DRIPS.forEach((dr, i) => {
    const k = THREE.MathUtils.clamp(melt * 1.35 - i * 0.05, 0, 1);
    if (k <= 0) return;
    // flat-topped bump → drips with a rounded, bulbous tip
    const g = Math.exp(-Math.pow(angDist(theta, dr.a) / dr.w, 4));
    const target = skirt + dr.len * k; // past the skirt, then down
    total = Math.max(total, base + (target - base) * g * Math.min(1, k * 2));
  });
  return total;
}

export function useMeltingCheese(color: string) {
  return useMemo(() => {
    const cols = SEG + 1;
    const rows = RINGS + 1 + 2; // main rings + 2 duplicated ink rings
    const count = cols * rows;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const idx: number[] = [];

    for (let r = 0; r < rows; r++) {
      const ink = r > RINGS;
      for (let c = 0; c < cols; c++) {
        const v = (r * cols + c) * 3;
        const k = ink ? 0 : 1;
        col[v] = col[v + 1] = col[v + 2] = k;
      }
    }
    const quad = (r: number) => {
      for (let c = 0; c < SEG; c++) {
        const a = r * cols + c;
        const b = a + 1;
        const d = a + cols;
        const e = d + 1;
        idx.push(a, d, b, b, d, e);
      }
    };
    for (let r = 0; r < RINGS; r++) quad(r);
    quad(RINGS + 1); // the ink band (between the two duplicated rings)

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    geo.setIndex(idx);

    const place = (s: number, theta: number, out: Float32Array, v: number) => {
      const cx = Math.cos(theta), cz = Math.sin(theta);
      if (s <= R) {
        const y = DOME * Math.pow(Math.max(0, 1 - Math.pow(s / R, N)), 1 / N);
        out[v] = cx * s; out[v + 1] = y; out[v + 2] = cz * s;
      } else {
        const d = s - R;
        out[v] = cx * R; out[v + 1] = -d; out[v + 2] = cz * R;
      }
    };

    // Arc-length table for the dome profile, so the ink band is measured ALONG the
    // surface. (Measured horizontally, it stretched into a tall black strip where the
    // dome curves steeply down at the rim.)
    const K = 96;
    const arcS: number[] = [0]; // horizontal s at each sample
    const arcA: number[] = [0]; // cumulative arc length at each sample
    {
      let py = DOME;
      for (let k = 1; k <= K; k++) {
        const s = (k / K) * R;
        const y = DOME * Math.pow(Math.max(0, 1 - Math.pow(s / R, N)), 1 / N);
        arcS.push(s);
        arcA.push(arcA[k - 1] + Math.hypot(R / K, y - py));
        py = y;
      }
    }
    const DOME_ARC = arcA[K];
    const sToArc = (s: number) => {
      if (s >= R) return DOME_ARC + (s - R);
      const f = (s / R) * K, i = Math.floor(f);
      return arcA[i] + (arcA[Math.min(K, i + 1)] - arcA[i]) * (f - i);
    };
    const arcToS = (a: number) => {
      if (a >= DOME_ARC) return R + (a - DOME_ARC);
      let lo = 0, hi = K;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (arcA[mid] <= a) lo = mid; else hi = mid;
      }
      const span = arcA[hi] - arcA[lo] || 1;
      return arcS[lo] + (arcS[hi] - arcS[lo]) * ((a - arcA[lo]) / span);
    };

    let last = -1;
    const update = (melt: number) => {
      if (Math.abs(melt - last) < 1e-4) return;
      last = melt;
      for (let c = 0; c < cols; c++) {
        const theta = (c / SEG) * Math.PI * 2;
        const endArc = sToArc(reachAt(theta, melt));
        const inkArc = Math.max(0, endArc - BAND);
        for (let r = 0; r <= RINGS; r++) {
          // pack rings densely near the rim so the bend over the edge stays round
          const t = r / RINGS;
          place(arcToS(inkArc * (1 - Math.pow(1 - t, 1.6))), theta, pos, (r * cols + c) * 3);
        }
        place(arcToS(inkArc), theta, pos, ((RINGS + 1) * cols + c) * 3);
        place(arcToS(endArc), theta, pos, ((RINGS + 2) * cols + c) * 3);
      }
      geo.attributes.position.needsUpdate = true;
      geo.computeVertexNormals();
      geo.computeBoundingSphere();
    };
    update(0);

    const material = new THREE.MeshToonMaterial({
      color,
      vertexColors: true,
      side: THREE.DoubleSide,
      // nudge toward the camera so the patty's outline never z-fights through the cheese
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -4,
    });
    return { geo, material, update };
  }, [color]);
}
