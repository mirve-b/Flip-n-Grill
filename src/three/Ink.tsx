import { useLayoutEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/* ------------------------------------------------------------------ *
 * Clean anime line art.
 *
 * Inverted-hull outlines, but done properly:
 *  1. The hull uses a *smoothed* copy of the geometry (shared vertices,
 *     averaged normals), so it stays one unbroken shell around hard
 *     edges like bun rims, with no gaps or steps.
 *  2. The push-out happens in *screen space*, so every line is the same
 *     pixel width no matter how near or far the object is. That's the
 *     even, inked look.
 * ------------------------------------------------------------------ */

const shared = {
  uRes: { value: new THREE.Vector2(1, 1) },
  uDpr: { value: 1 },
};

const materials = new Map<number, THREE.ShaderMaterial>();
function inkMaterial(px: number) {
  let m = materials.get(px);
  if (!m) {
    m = new THREE.ShaderMaterial({
      uniforms: { uPx: { value: px }, uRes: shared.uRes, uDpr: shared.uDpr },
      side: THREE.BackSide,
      vertexShader: /* glsl */ `
        uniform float uPx;
        uniform vec2 uRes;
        uniform float uDpr;
        void main() {
          #ifdef USE_INSTANCING
            mat4 im = instanceMatrix;
          #else
            mat4 im = mat4(1.0);
          #endif
          vec4 mv = modelViewMatrix * im * vec4(position, 1.0);
          vec4 clip = projectionMatrix * mv;
          vec3 nView = normalize(normalMatrix * mat3(im) * normal);
          vec2 dir = (projectionMatrix * vec4(nView, 0.0)).xy * uRes;
          float len = length(dir);
          dir = len > 1e-5 ? dir / len : vec2(0.0);
          clip.xy += dir * (uPx * uDpr * 2.0) / uRes * clip.w;
          gl_Position = clip;
        }`,
      fragmentShader: /* glsl */ `void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); }`,
    });
    materials.set(px, m);
  }
  return m;
}

const smoothCache = new WeakMap<THREE.BufferGeometry, THREE.BufferGeometry>();
function smoothed(src: THREE.BufferGeometry) {
  let g = smoothCache.get(src);
  if (!g) {
    let c = src.clone();
    for (const name of Object.keys(c.attributes)) if (name !== "position") c.deleteAttribute(name);
    c = mergeVertices(c, 1e-3);
    c.computeVertexNormals();
    g = c;
    smoothCache.set(src, g);
  }
  return g;
}

const noRaycast = () => {};

/** Keeps the outline shader's idea of screen size in sync. Mount once per <Canvas>. */
export function InkResolution() {
  const gl = useThree((s) => s.gl);
  const v = useRef(new THREE.Vector2());
  useFrame(() => {
    gl.getDrawingBufferSize(v.current);
    shared.uRes.value.copy(v.current);
    shared.uDpr.value = gl.getPixelRatio();
  });
  return null;
}

/** Drop inside any <mesh>/<instancedMesh>. `px` = line width in CSS pixels. */
export function Ink({ px = 3 }: { px?: number }) {
  const anchor = useRef<THREE.Group>(null!);

  useLayoutEffect(() => {
    const parent = anchor.current.parent as THREE.Mesh | THREE.InstancedMesh | null;
    if (!parent?.geometry) return;
    const mat = inkMaterial(px);
    const geo = smoothed(parent.geometry);
    let outline: THREE.Mesh;
    if ((parent as THREE.InstancedMesh).isInstancedMesh) {
      const src = parent as THREE.InstancedMesh;
      const inst = new THREE.InstancedMesh(geo, mat, src.count);
      inst.instanceMatrix = src.instanceMatrix;
      inst.frustumCulled = false;
      outline = inst;
    } else {
      outline = new THREE.Mesh(geo, mat);
    }
    outline.raycast = noRaycast;
    parent.add(outline);
    return () => {
      parent.remove(outline);
    };
  }, [px]);

  return <group ref={anchor} />;
}
