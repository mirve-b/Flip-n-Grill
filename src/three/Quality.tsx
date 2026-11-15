import { useEffect, useRef, type ReactNode } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { maxDpr, minDpr } from "../lib/device";

/**
 * Watches real frame rates and steps the canvas resolution down ONLY when the
 * device is genuinely struggling, never below `minDpr`, and never back up.
 * Every resolution change reallocates the canvas (a visible hitch), so
 * this stays very conservative:
 *  - it compares against the best frame rate this device has shown, so a phone
 *    capped at 30 fps (iPhone Low Power Mode) isn't mistaken for a slow one;
 *  - it needs two bad readings in a row before acting.
 */
export function AdaptiveDpr() {
  const setDpr = useThree((s) => s.setDpr);
  const dpr = useRef(maxDpr);
  const acc = useRef({ t: 0, frames: 0, best: 0, bad: 0, warm: 0 });

  useFrame((_, delta) => {
    const a = acc.current;
    if (dpr.current <= minDpr || delta > 0.25) return; // done, or tab was hidden / long stall
    a.t += delta;
    a.frames++;
    if (a.t < 1) return;
    const fps = a.frames / a.t;
    a.t = 0;
    a.frames = 0;
    if (a.warm++ < 2) return; // ignore the first seconds (shader warm-up, loading)
    a.best = Math.max(a.best, Math.min(fps, 120));
    a.bad = fps < a.best * 0.75 && fps < 50 ? a.bad + 1 : 0;
    if (a.bad >= 2) {
      a.bad = 0;
      dpr.current = Math.max(minDpr, dpr.current - 0.25);
      setDpr(dpr.current);
    }
  });
  return null;
}

/** Compile every shader up front (including hidden meshes) so nothing hitches mid-scroll. */
export function Precompile() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    const hidden: THREE.Object3D[] = [];
    scene.traverse((o) => {
      if (!o.visible) {
        hidden.push(o);
        o.visible = true;
      }
    });
    gl.compile(scene, camera);
    hidden.forEach((o) => (o.visible = false));
  }, [gl, scene, camera]);
  return null;
}

/** Lightweight replacement for drei's <Float>: gentle bob + sway, no extra library. */
export function Float({
  children,
  speed = 2,
  rotationIntensity = 1,
  floatIntensity = 1,
  offset = 0,
}: {
  children: ReactNode;
  speed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
  offset?: number;
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed * 0.5 + offset;
    ref.current.position.y = Math.sin(t) * 0.12 * floatIntensity;
    ref.current.rotation.x = Math.cos(t * 0.7) * 0.08 * rotationIntensity;
    ref.current.rotation.z = Math.sin(t * 0.6) * 0.08 * rotationIntensity;
  });
  return <group ref={ref}>{children}</group>;
}
