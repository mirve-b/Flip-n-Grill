import { useMemo, type ComponentProps } from "react";
import * as THREE from "three";
import { Ink } from "./Ink";
import { Toon } from "./BuildBurger";

type GroupProps = ComponentProps<"group">;

/** A tapering helix: the curly-fry spine */
function helixCurve(turns = 2.5, radius = 0.28, height = 0.9) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 80; i++) {
    const t = i / 80;
    const a = t * Math.PI * 2 * turns;
    const r = radius * (1 - t * 0.25);
    pts.push(new THREE.Vector3(Math.cos(a) * r, t * height - height / 2, Math.sin(a) * r));
  }
  return new THREE.CatmullRomCurve3(pts);
}

/** Tube along the helix whose radius rounds off to zero at both ends, so the tips are closed and smooth. */
function fryGeometry() {
  const curve = helixCurve();
  const TS = 110, RS = 10, TIP = 0.045; // TIP = fraction of the length used to round each end
  const geo = new THREE.TubeGeometry(curve, TS, 0.075, RS, false);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const c = new THREE.Vector3(), v = new THREE.Vector3();
  for (let i = 0; i <= TS; i++) {
    const t = i / TS;
    const e = Math.min(t, 1 - t) / TIP; // 0 at the very tip → 1 once past the rounding zone
    const k = e >= 1 ? 1 : Math.sqrt(1 - (1 - e) * (1 - e)); // quarter-circle profile = round cap
    curve.getPointAt(t, c);
    for (let j = 0; j <= RS; j++) {
      const idx = i * (RS + 1) + j;
      v.fromBufferAttribute(pos, idx).sub(c).multiplyScalar(Math.max(k, 0.001)).add(c);
      pos.setXYZ(idx, v.x, v.y, v.z);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

let fryGeo: THREE.TubeGeometry | null = null;
const getFryGeo = () => (fryGeo ??= fryGeometry());

export function CurlyFry({ gradient, color = "#FF9400", ...props }: { gradient: THREE.Texture; color?: string } & GroupProps) {
  const geo = getFryGeo();
  return (
    <group {...props}>
      <mesh geometry={geo}>
        <Toon color={color} gradient={gradient} />
        <Ink px={2.5} />
      </mesh>
    </group>
  );
}

/* ---------- mozzarella stick: snapped in half, cheese pulling between ---------- */

const BREAD = "#E88600";
const CHEESE = "#FFB833";

/** A tube that's thick where it leaves the stick and thins out in the middle, like a real cheese pull. */
function cheeseString(a: THREE.Vector3, b: THREE.Vector3, sag: number, radius: number) {
  const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, -sag, 0));
  const curve = new THREE.CatmullRomCurve3([a, a.clone().lerp(mid, 0.45), mid, b.clone().lerp(mid, 0.45), b]);
  const TS = 32, RS = 8;
  const geo = new THREE.TubeGeometry(curve, TS, radius, RS, false);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const c = new THREE.Vector3(), v = new THREE.Vector3();
  for (let i = 0; i <= TS; i++) {
    const t = i / TS;
    curve.getPointAt(t, c);
    const taper = 0.35 + 0.65 * Math.pow(Math.abs(t * 2 - 1), 1.6); // thin in the middle
    for (let j = 0; j <= RS; j++) {
      const k = i * (RS + 1) + j;
      v.fromBufferAttribute(pos, k).sub(c).multiplyScalar(taper).add(c);
      pos.setXYZ(k, v.x, v.y, v.z);
    }
  }
  geo.computeVertexNormals();
  return geo;
}

/**
 * One breaded half as a SINGLE lathed surface: flat broken end → straight body →
 * rounded tip. One mesh means one smooth shading pass and one unbroken outline
 * (no seam where a cylinder would meet a sphere).
 */
let halfGeo: THREE.LatheGeometry | null = null;
function getHalfGeo() {
  if (halfGeo) return halfGeo;
  const R = 0.17, BODY = 0.25;
  const pts: THREE.Vector2[] = [new THREE.Vector2(0, -BODY), new THREE.Vector2(R * 0.92, -BODY), new THREE.Vector2(R, -BODY + 0.02)];
  pts.push(new THREE.Vector2(R, BODY));
  for (let i = 1; i <= 10; i++) {
    const a = (i / 10) * (Math.PI / 2);
    pts.push(new THREE.Vector2(Math.cos(a) * R, BODY + Math.sin(a) * R));
  }
  pts[pts.length - 1].x = 0;
  // lathe spins around Y; turn it so the stick lies along X (rounded tip at +x)
  halfGeo = new THREE.LatheGeometry(pts, 20).rotateZ(-Math.PI / 2);
  return halfGeo;
}

/** Local +x is the rounded outer end, -x is the broken, cheesy end. */
function StickHalf({ gradient, ...props }: { gradient: THREE.Texture } & GroupProps) {
  return (
    <group {...props}>
      <mesh geometry={getHalfGeo()}>
        <Toon color={BREAD} gradient={gradient} />
        <Ink px={2.5} />
      </mesh>
      {/* exposed melty cheese at the break, bulging out a little */}
      <mesh position={[-0.26, 0, 0]} scale={[0.07, 0.14, 0.14]}>
        <sphereGeometry args={[1, 14, 10]} />
        <Toon color={CHEESE} gradient={gradient} />
        <Ink px={2} />
      </mesh>
    </group>
  );
}

const L_POS = new THREE.Vector3(-0.53, 0.02, 0);
const R_POS = new THREE.Vector3(0.53, -0.06, 0);
const R_TILT = 0.28;

export function MozzyStick({ gradient, ...props }: { gradient: THREE.Texture } & GroupProps) {
  const strings = useMemo(() => {
    // broken faces: left half's inner end points +x, right half's points -x (and is tilted)
    const lFace = L_POS.clone().add(new THREE.Vector3(0.3, 0, 0));
    const rFace = R_POS.clone().add(new THREE.Vector3(-0.3 * Math.cos(R_TILT), -0.3 * Math.sin(R_TILT), 0));
    const offs: [number, number, number, number][] = [
      // dy, dz, sag, radius
      [0.05, 0.04, 0.18, 0.065],
      [-0.06, -0.03, 0.11, 0.058],
      [0.0, -0.07, 0.26, 0.048],
    ];
    return offs.map(([dy, dz, sag, r]) =>
      cheeseString(lFace.clone().add(new THREE.Vector3(0, dy, dz)), rFace.clone().add(new THREE.Vector3(0, dy, dz)), sag, r),
    );
  }, []);

  return (
    <group {...props}>
      <StickHalf gradient={gradient} position={L_POS.toArray()} rotation={[0, Math.PI, 0]} />
      <StickHalf gradient={gradient} position={R_POS.toArray()} rotation={[0, 0, R_TILT]} />
      {strings.map((g, i) => (
        <mesh key={i} geometry={g}>
          <Toon color={CHEESE} gradient={gradient} />
          <Ink px={2} />
        </mesh>
      ))}
    </group>
  );
}

export function Sparkle({ color = "#F1D7B3", ...props }: { color?: string } & GroupProps) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const n = 4, R = 0.5, r = 0.12;
    for (let i = 0; i < n * 2; i++) {
      const a = (i / (n * 2)) * Math.PI * 2 + Math.PI / 2;
      const rad = i % 2 ? r : R;
      const x = Math.cos(a) * rad, y = Math.sin(a) * rad;
      i ? s.lineTo(x, y) : s.moveTo(x, y);
    }
    return s;
  }, []);
  return (
    <group {...props}>
      <mesh>
        <shapeGeometry args={[shape]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
