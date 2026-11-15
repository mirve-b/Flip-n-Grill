import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Ink } from "./Ink";
import { useMeltingCheese } from "./Cheese";

/* ------------------------------------------------------------------ *
 * A cel-shaded smash burger that assembles itself from a single
 * progress value (0 → 1). The hero tweens it, the build section scrubs
 * it with scroll. Everything is derived from `progress` each frame, so
 * it plays perfectly forwards AND backwards.
 * ------------------------------------------------------------------ */

export const INK = "#000000";
export const COL = {
  bun: "#FF9400",
  bunTop: "#FF9400",
  raw: "#D44000",
  patty: "#6E2A08",
  cheese: "#FFB833", // golden tint between the brand orange & cream so it reads as cheese
  seed: "#F1D7B3",
  steel: "#006267",
  box: "#006267",
  band: "#F1D7B3",
};

/** Timeline beats, in progress units */
export const BEATS = {
  bun: [0.0, 0.12],
  ball: [0.12, 0.22],
  smash: [0.22, 0.3],
  sizzle: [0.3, 0.4],
  cheese: [0.38, 0.46],
  melt: [0.44, 0.54],
  top: [0.52, 0.62],
  sides: [0.62, 0.74],
  boxIn: [0.76, 0.86],
  lid: [0.86, 0.96],
} as const;

/* patty: a thick smashed puck */
export const PATTY_R = 1.28;
export const PATTY_H = 0.24; // half-height: thick enough to read as a patty under the cheese
export const PATTY_Y = 0.07; // centre, so its bottom sits on the bun top (-0.17)
const PUCK_N = 3; // superellipse exponent: flat top/bottom, near-vertical sides, rounded edge
const TOP_Y = 0.5; // top bun rest height, clear of the cheese

/** Unit sphere pushed out into a rounded puck (|r|^n + |y|^n = 1). */
function puckGeometry() {
  const g = new THREE.SphereGeometry(1, 40, 24);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const r = Math.hypot(x, z);
    const d = Math.pow(Math.pow(r, PUCK_N) + Math.pow(Math.abs(y), PUCK_N), 1 / PUCK_N) || 1;
    p.setXYZ(i, x / d, y / d, z / d);
  }
  g.computeVertexNormals();
  return g;
}

/* box: tall enough that the crowned burger (top ≈ 1.2) clears the lid */
const BOX_FLOOR = -0.65;
const BOX_H = 2.3;
const BOX_W = 3.5;
const LID_W = 3.62;
const WALLS: [number, number, number][] = [
  [0, BOX_W / 2, 0],
  [0, -BOX_W / 2, 0],
  [BOX_W / 2, 0, Math.PI / 2],
  [-BOX_W / 2, 0, Math.PI / 2],
];

export const seg = (p: number, [a, b]: readonly [number, number]) => THREE.MathUtils.clamp((p - a) / (b - a), 0, 1);
export const easeOutBack = (t: number, s = 1.9) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
export function easeOutBounce(t: number) {
  const n = 7.5625, d = 2.75;
  if (t < 1 / d) return n * t * t;
  if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
  if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
  return n * (t -= 2.625 / d) * t + 0.984375;
}
const drop = (t: number, height = 6) => (1 - easeOutBounce(t)) * height;

export function useToonGradient() {
  return useMemo(() => {
    const tex = new THREE.DataTexture(new Uint8Array([90, 170, 255]), 3, 1, THREE.RedFormat);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    tex.needsUpdate = true;
    return tex;
  }, []);
}

export function Toon({ color, gradient }: { color: string; gradient: THREE.Texture }) {
  return <meshToonMaterial color={color} gradientMap={gradient} />;
}

/** The round, transparent brand logo as a texture (for the box stickers). */
function useLogoTexture() {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    new THREE.TextureLoader().load("/logo-round.png", (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      setTex(t);
    });
  }, []);
  return tex;
}

type Props = {
  progress: MutableRefObject<number>;
  gradient: THREE.Texture;
  withBox?: boolean;
};

export function BuildBurger({ progress, gradient, withBox = false }: Props) {
  const bottom = useRef<THREE.Group>(null!);
  const ball = useRef<THREE.Mesh>(null!);
  const puck = useRef<THREE.Mesh>(null!);
  const pattyMat = useMemo(() => new THREE.MeshToonMaterial({ color: COL.raw, gradientMap: gradient }), [gradient]);
  const puckGeo = useMemo(() => puckGeometry(), []);
  const press = useRef<THREE.Group>(null!);
  const steam = useRef<THREE.Group>(null!);
  const cheese = useRef<THREE.Group>(null!);
  const seedMesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const top = useRef<THREE.Group>(null!);
  const box = useRef<THREE.Group>(null!);
  const contents = useRef<THREE.Group>(null!);
  const lid = useRef<THREE.Group>(null!);
  const raw = useMemo(() => new THREE.Color(COL.raw), []);
  const cooked = useMemo(() => new THREE.Color(COL.patty), []);
  const logo = useLogoTexture();

  const seeds = useMemo(() => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    return Array.from({ length: 26 }, (_, i) => {
      const t = 0.1 + (i / 26) * 0.88; // stop short of the dome edge so seeds never hang off the silhouette
      const p = i * golden;
      const R = 1.26;
      return {
        pos: [Math.sin(t) * Math.cos(p) * R, Math.cos(t) * R * 0.68, Math.sin(t) * Math.sin(p) * R] as [number, number, number],
        rot: p,
      };
    });
  }, []);

  const cheeseSheet = useMeltingCheese(COL.cheese);
  cheeseSheet.material.gradientMap = gradient;

  // sesame seeds: one instanced draw call instead of 26 meshes
  useLayoutEffect(() => {
    seeds.forEach((s, i) => {
      dummy.position.set(...s.pos);
      dummy.rotation.set(0, s.rot, 0);
      dummy.scale.set(0.075, 0.03, 0.045);
      dummy.updateMatrix();
      seedMesh.current.setMatrixAt(i, dummy.matrix);
    });
    seedMesh.current.instanceMatrix.needsUpdate = true;
  }, [seeds, dummy]);

  useFrame((state) => {
    const p = progress.current;
    const time = state.clock.elapsedTime;

    // 1. bottom bun drops
    const tb = seg(p, BEATS.bun);
    bottom.current.visible = tb > 0;
    bottom.current.position.y = -0.38 + drop(tb);

    // 2. beef ball drops onto the bun, 3. gets SMASHED
    const tBall = seg(p, BEATS.ball);
    const tSmash = seg(p, BEATS.smash);
    const smashE = easeOutBack(tSmash, 1.2);
    // round ball while it drops; swaps to the puck shape the instant the press hits
    ball.current.visible = tBall > 0 && tSmash <= 0;
    puck.current.visible = tSmash > 0;
    const ballY = 0.53 + drop(tBall, 5);
    const pattyY = THREE.MathUtils.lerp(ballY, PATTY_Y, smashE);
    const sx = THREE.MathUtils.lerp(0.72, PATTY_R, smashE);
    const sy = THREE.MathUtils.lerp(0.7, PATTY_H, smashE);
    ball.current.position.y = puck.current.position.y = pattyY;
    ball.current.scale.set(0.72, 0.7, 0.72);
    puck.current.scale.set(sx, sy, sx);
    // sizzle: raw → crusty brown
    pattyMat.color.copy(raw).lerp(cooked, seg(p, BEATS.sizzle));

    // the press comes down during the smash, then lifts away
    const pIn = seg(p, [BEATS.smash[0] - 0.05, BEATS.smash[0] + 0.02]);
    const pOut = seg(p, [BEATS.smash[1] + 0.01, BEATS.smash[1] + 0.07]);
    press.current.visible = pIn > 0 && pOut < 1;
    const pressRest = THREE.MathUtils.lerp(1.3, PATTY_Y + PATTY_H + 0.06, smashE);
    press.current.position.y = pressRest + (1 - pIn) * 4 + pOut * 5;
    press.current.rotation.z = pOut * 0.6;

    // steam wisps while it sizzles
    const sz = seg(p, BEATS.sizzle);
    steam.current.visible = sz > 0 && sz < 1;
    steam.current.children.forEach((c, i) => {
      const k = (time * 0.6 + i / 5) % 1;
      c.position.y = 0.3 + k * 1.6;
      c.scale.setScalar(0.12 + k * 0.18);
      ((c as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = Math.sin(k * Math.PI) * 0.85 * Math.sin(sz * Math.PI);
    });

    // 4. cheese drops + melts
    const tc = seg(p, BEATS.cheese);
    cheese.current.visible = tc > 0;
    cheese.current.position.y = PATTY_Y + drop(tc, 4);
    cheeseSheet.update(seg(p, BEATS.melt));

    // 5. crown it
    const tt = seg(p, BEATS.top);
    top.current.visible = tt > 0;
    top.current.position.y = TOP_Y + drop(tt, 6);
    top.current.rotation.y = (1 - tt) * 2;

    // box rises around the burger, lid snaps shut
    if (withBox) {
      const bi = seg(p, BEATS.boxIn);
      box.current.visible = bi > 0;
      box.current.position.y = BOX_FLOOR - (1 - easeOutBack(bi, 1.4)) * 5;
      const li = seg(p, BEATS.lid);
      lid.current.rotation.x = THREE.MathUtils.lerp(-2.1, 0, easeOutBounce(li));
      // once it's shut, nothing inside needs drawing (and nothing can poke through)
      contents.current.visible = li < 0.98;
    }
  });

  const ink = (px = 3) => <Ink px={px} />;

  return (
    <group>
      <group ref={contents}>
      {/* bottom bun */}
      <group ref={bottom}>
        <mesh>
          <cylinderGeometry args={[1.2, 1.1, 0.42, 32]} />
          <Toon color={COL.bun} gradient={gradient} />
          {ink()}
        </mesh>
      </group>

      {/* beef: a round ball that gets smashed into a thick puck */}
      <mesh ref={ball} material={pattyMat}>
        <sphereGeometry args={[1, 28, 18]} />
        {ink(3.5)}
      </mesh>
      <mesh ref={puck} geometry={puckGeo} material={pattyMat} visible={false}>
        {ink(3.5)}
      </mesh>

      {/* the smasher */}
      <group ref={press}>
        <mesh>
          <boxGeometry args={[2.1, 0.12, 1.5]} />
          <Toon color={COL.steel} gradient={gradient} />
          {ink(2.5)}
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1, 12]} />
          <Toon color={INK} gradient={gradient} />
        </mesh>
        <mesh position={[0, 1.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.16, 0.7, 4, 12]} />
          <Toon color="#D44000" gradient={gradient} />
          {ink(2.5)}
        </mesh>
      </group>

      {/* steam */}
      <group ref={steam}>
        {[-0.7, -0.25, 0.2, 0.6, 0.95].map((x, i) => (
          <mesh key={i} position={[x, 0.4, (i % 2 ? 0.4 : -0.3)]}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
          </mesh>
        ))}
      </group>

      {/* cheese: one melting sheet with an inked drip edge */}
      <group ref={cheese}>
        <mesh geometry={cheeseSheet.geo} material={cheeseSheet.material} />
      </group>

      {/* top bun */}
      <group ref={top}>
        <mesh scale={[1, 0.68, 1]}>
          <sphereGeometry args={[1.25, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <Toon color={COL.bunTop} gradient={gradient} />
          {ink()}
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <cylinderGeometry args={[1.25, 1.22, 0.1, 32]} />
          <Toon color={COL.bun} gradient={gradient} />
          {ink()}
        </mesh>
        <instancedMesh ref={seedMesh} args={[undefined, undefined, seeds.length]} frustumCulled={false}>
          <sphereGeometry args={[1, 8, 6]} />
          {/* always win depth ties against the bun's outline so the line never slices a seed */}
          <meshToonMaterial color={COL.seed} gradientMap={gradient} polygonOffset polygonOffsetFactor={-4} polygonOffsetUnits={-8} />
        </instancedMesh>
      </group>

      </group>

      {/* takeaway box */}
      {withBox && (
        <group ref={box} visible={false}>
          {/* floor */}
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[BOX_W, 0.1, BOX_W]} />
            <Toon color={COL.box} gradient={gradient} />
            {ink(2.5)}
          </mesh>

          {/* walls */}
          {WALLS.map(([x, z, r], i) => (
            <mesh key={i} position={[x, BOX_H / 2, z]} rotation={[0, r, 0]}>
              <boxGeometry args={[BOX_W, BOX_H, 0.08]} />
              <Toon color={COL.box} gradient={gradient} />
              {ink(2.5)}
            </mesh>
          ))}

          {/* cream band wrapped around the bottom */}
          {WALLS.map(([x, z, r], i) => (
            <mesh key={`b${i}`} position={[x * 1.03, 0.38, z * 1.03]} rotation={[0, r, 0]}>
              <boxGeometry args={[BOX_W + 0.1, 0.3, 0.04]} />
              <Toon color={COL.band} gradient={gradient} />
              {ink(2)}
            </mesh>
          ))}

          {/* front sticker */}
          <group position={[0, BOX_H * 0.545, BOX_W / 2 + 0.06]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.58, 0.58, 0.04, 40]} />
              <Toon color={COL.band} gradient={gradient} />
              {ink(2.5)}
            </mesh>
            {logo && (
              <mesh position={[0, 0, 0.025]}>
                <planeGeometry args={[1.06, 1.06]} />
                <meshBasicMaterial map={logo} transparent alphaTest={0.4} toneMapped={false} />
              </mesh>
            )}
          </group>

          {/* clamshell lid, hinged at the back */}
          <group ref={lid} position={[0, BOX_H, -BOX_W / 2]}>
            <mesh position={[0, 0.06, LID_W / 2]}>
              <boxGeometry args={[LID_W, 0.12, LID_W]} />
              <Toon color={COL.box} gradient={gradient} />
              {ink(2.5)}
            </mesh>
            {/* front lip that folds over the wall */}
            <mesh position={[0, -0.12, LID_W - 0.02]}>
              <boxGeometry args={[LID_W, 0.36, 0.08]} />
              <Toon color={COL.box} gradient={gradient} />
              {ink(2.5)}
            </mesh>
            {/* little cream pull-tab */}
            <mesh position={[0, -0.27, LID_W + 0.03]}>
              <boxGeometry args={[0.56, 0.13, 0.06]} />
              <Toon color={COL.band} gradient={gradient} />
              {ink(2)}
            </mesh>
            {/* lid sticker */}
            <group position={[0, 0.14, LID_W / 2]}>
              <mesh>
                <cylinderGeometry args={[1.15, 1.15, 0.04, 48]} />
                <Toon color={COL.band} gradient={gradient} />
                {ink(2.5)}
              </mesh>
              {logo && (
                <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[2.1, 2.1]} />
                  <meshBasicMaterial map={logo} transparent alphaTest={0.4} toneMapped={false} />
                </mesh>
              )}
            </group>
          </group>
        </group>
      )}
    </group>
  );
}
