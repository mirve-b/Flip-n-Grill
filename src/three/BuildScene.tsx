import { memo, useEffect, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { BEATS, BuildBurger, easeOutBack, seg, useToonGradient } from "./BuildBurger";
import { CurlyFry, MozzyStick, Sparkle } from "./Sides";
import { maxDpr } from "../lib/device";
import { InkResolution } from "./Ink";
import { AdaptiveDpr, Precompile } from "./Quality";

const SIDES = [
  { kind: "fry", angle: 0.2, r: 2.4, y: 0.6, s: 0.9 },
  { kind: "mozzy", angle: 1.6, r: 2.5, y: -0.2, s: 0.85 },
  { kind: "fry", angle: 2.9, r: 2.3, y: 0.9, s: 0.75 },
  { kind: "mozzy", angle: 4.2, r: 2.4, y: 0.4, s: 0.75 },
  { kind: "fry", angle: 5.3, r: 2.5, y: -0.3, s: 0.8 },
] as const;

function Rig({ progress }: { progress: MutableRefObject<number> }) {
  const gradient = useToonGradient();
  const turntable = useRef<THREE.Group>(null!);
  const sides = useRef<THREE.Group>(null!);
  const stars = useRef<THREE.Group>(null!);
  const { camera, size } = useThree();
  const look = useRef(new THREE.Vector3());
  const narrow = size.width < 700;

  useFrame((state) => {
    const p = progress.current;
    const t = state.clock.elapsedTime;

    // camera: low and close for the smash, lifts up to look into the box at the end
    const lift = seg(p, [BEATS.boxIn[0], BEATS.lid[1]]);
    const dist = (narrow ? 11.5 : 9.5) + lift * 1.5;
    camera.position.set(Math.sin(t * 0.15) * 0.4 * (1 - lift), 1.8 + lift * 4.2, dist);
    look.current.set(0, 0.1 + lift * 0.3, 0);
    camera.lookAt(look.current);

    // turntable: two full turns over the scroll, landing square-on so the lid logo reads
    const spin = Math.min(1, p / BEATS.lid[0]);
    turntable.current.rotation.y = (1 - Math.pow(1 - spin, 2)) * Math.PI * 4;

    // sides fly in on an orbit, then duck out before the box closes
    const tin = easeOutBack(seg(p, BEATS.sides), 1.6);
    const tout = seg(p, [BEATS.boxIn[0], BEATS.boxIn[0] + 0.06]);
    sides.current.visible = tin > 0 && tout < 1;
    sides.current.rotation.y = -t * 0.4 - p * 4;
    sides.current.children.forEach((c, i) => {
      const d = SIDES[i];
      const k = Math.max(0, tin) * (1 - tout);
      const r = d.r * (0.2 + 0.8 * k) + tout * 3;
      c.position.set(Math.cos(d.angle) * r, d.y + Math.sin(t * 2 + i) * 0.15, Math.sin(d.angle) * r);
      c.scale.setScalar(d.s * k + 0.0001);
      c.rotation.set(t * (0.6 + i * 0.1), t * 0.8, i);
    });

    // background sparkles twinkle and drift
    stars.current.children.forEach((c, i) => {
      c.rotation.z = t * (0.5 + i * 0.1);
      c.scale.setScalar(0.35 + Math.abs(Math.sin(t * 1.5 + i * 1.7)) * 0.35);
    });
  });

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 6, 4]} intensity={2.4} />
      <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#F1D7B3" />

      <group ref={turntable}>
        <BuildBurger progress={progress} gradient={gradient} withBox />
      </group>

      <group ref={sides}>
        {SIDES.map((d, i) =>
          d.kind === "fry" ? <CurlyFry key={i} gradient={gradient} /> : <MozzyStick key={i} gradient={gradient} />,
        )}
      </group>

      <group ref={stars}>
        {[
          [-4.5, 2.6, -3],
          [4.8, 2.2, -4],
          [-3.6, -1.8, -2],
          [4.2, -1.4, -2.5],
          [0.5, 3.6, -5],
          [-5.5, 0.4, -5],
        ].map((pos, i) => (
          <Sparkle key={i} position={pos as [number, number, number]} />
        ))}
      </group>
    </>
  );
}

function BuildScene({ progress }: { progress: MutableRefObject<number> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "200px" });
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="build__canvas">
      <Canvas
        flat
        camera={{ position: [0, 1.6, 8], fov: 35 }}
        dpr={maxDpr}
        gl={{ antialias: true, alpha: true, stencil: false, powerPreference: "high-performance" }}
        frameloop={visible ? "always" : "never"}
      >
        <AdaptiveDpr />
        <InkResolution />
        <Rig progress={progress} />
        <Precompile />
      </Canvas>
    </div>
  );
}

export default memo(BuildScene);
