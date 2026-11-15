import { memo, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BEATS, BuildBurger, useToonGradient } from "./BuildBurger";
import { CurlyFry, MozzyStick } from "./Sides";
import { burst } from "../lib/burst";
import { onIntroDone } from "../lib/intro";
import { maxDpr } from "../lib/device";
import { InkResolution } from "./Ink";
import { AdaptiveDpr, Float, Precompile } from "./Quality";

function Rig({ gradient }: { gradient: THREE.Texture }) {
  const progress = useRef(0);
  const root = useRef<THREE.Group>(null!);
  const squash = useRef<THREE.Group>(null!);
  const pointer = useRef({ x: 0, y: 0 });
  const scrollSpin = useRef(0);

  // Assemble the burger once the loader clears: bun → ball → SMASH → cheese → crown
  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      progress.current = BEATS.top[1];
      return;
    }
    const tween = gsap.to(progress, { current: BEATS.top[1], duration: 3.4, ease: "none", paused: true });
    const off = onIntroDone(() => tween.play());
    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => (scrollSpin.current = self.progress * Math.PI * 2),
    });
    return off;
  });

  useFrame((state, dt) => {
    pointer.current.x = THREE.MathUtils.lerp(pointer.current.x, state.pointer.x, 4 * dt);
    pointer.current.y = THREE.MathUtils.lerp(pointer.current.y, state.pointer.y, 4 * dt);
    const built = progress.current >= BEATS.top[1] - 0.001;
    root.current.rotation.y = (built ? state.clock.elapsedTime * 0.35 : 0.4) + pointer.current.x * 0.6 + scrollSpin.current;
    root.current.rotation.x = 0.32 - pointer.current.y * 0.25;
  });

  const onSmash = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    burst(e.nativeEvent.clientX, e.nativeEvent.clientY, "SMASH!!");
    gsap
      .timeline()
      .to(squash.current.scale, { x: 1.3, y: 0.55, z: 1.3, duration: 0.12, ease: "power3.in" })
      .to(squash.current.scale, { x: 1, y: 1, z: 1, duration: 0.9, ease: "elastic.out(1.2, 0.3)" });
  };

  return (
    <group ref={root} position={[0, -0.1, 0]}>
      <group
        ref={squash}
        onClick={onSmash}
        onPointerOver={() => document.body.classList.add("cursor-smash")}
        onPointerOut={() => document.body.classList.remove("cursor-smash")}
      >
        <BuildBurger progress={progress} gradient={gradient} />
      </group>
    </group>
  );
}

/** On tall phone screens, step the camera back so the burger sits inside the title instead of covering it. */
function FitCamera() {
  const size = useThree((s) => s.size);
  const z = 10 / THREE.MathUtils.clamp(size.width / size.height / 0.95, 0.62, 1);
  // set every frame: R3F re-applies the Canvas `camera` prop on re-renders, which would undo a one-off set
  useFrame(({ camera }) => {
    camera.position.z = z;
  });
  return null;
}

function HeroScene() {
  const gradient = useToonGradient();
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // stop rendering when the hero is off screen
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="hero__canvas">
      <Canvas
        flat
        camera={{ position: [0, 0.6, 10], fov: 35 }}
        dpr={maxDpr}
        gl={{ antialias: true, alpha: true, stencil: false, powerPreference: "high-performance" }}
        frameloop={visible ? "always" : "never"}
      >
        <AdaptiveDpr />
        <InkResolution />
        <FitCamera />
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 5, 4]} intensity={2.4} />
        <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#F1D7B3" />

        <Float offset={1.3} speed={2} rotationIntensity={0.2} floatIntensity={0.7}>
          <Rig gradient={gradient} />
        </Float>

        <Float offset={2.6} speed={3} rotationIntensity={1.4} floatIntensity={1.4}>
          <CurlyFry gradient={gradient} position={[-3.6, 1.4, -0.6]} rotation={[0.5, 0, 0.6]} />
        </Float>
        <Float offset={3.9} speed={2.4} rotationIntensity={1.6} floatIntensity={1.2}>
          <CurlyFry gradient={gradient} position={[3.7, -1.2, -0.3]} rotation={[-0.4, 0, -0.7]} scale={0.85} />
        </Float>
        <Float offset={5.2} speed={2.6} rotationIntensity={2} floatIntensity={1.5}>
          <MozzyStick gradient={gradient} position={[3.4, 1.8, -1.2]} rotation={[0.3, 0.4, 0.5]} scale={0.8} />
        </Float>
        <Float offset={6.5} speed={2.2} rotationIntensity={2} floatIntensity={1.3}>
          <MozzyStick gradient={gradient} position={[-3.6, -1.6, -0.8]} rotation={[-0.3, -0.4, -0.7]} scale={0.7} />
        </Float>
        <Precompile />
      </Canvas>
    </div>
  );
}

export default memo(HeroScene);
