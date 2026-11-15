/**
 * One-time device sniffing so weak phones get a lighter site from the first frame.
 * Runtime FPS monitoring (see three/Quality.tsx) then fine-tunes from there.
 */
type Nav = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

const nav = (typeof navigator !== "undefined" ? navigator : {}) as Nav;
const mq = (q: string) => typeof window !== "undefined" && window.matchMedia(q).matches;

export const reducedMotion = mq("(prefers-reduced-motion: reduce)");
export const touch = mq("(pointer: coarse)");

/** Preview override: add ?lite (force lite mode) or ?full (force full mode) to the URL. */
const params = typeof location !== "undefined" ? new URLSearchParams(location.search) : new URLSearchParams();
export const forcedLite = params.has("lite") ? true : params.has("full") ? false : null;

/**
 * Apple devices (iPhone / iPad / Mac). Safari hides the real core count and RAM for
 * privacy, so the "≤4 cores" test wrongly flagged fast iPhones as weak. Every iPhone
 * that runs a current iOS has a strong GPU, so Apple devices skip the CPU/RAM test.
 */
const ua = nav.userAgent ?? "";
const apple = /iPhone|iPad|iPod|Macintosh/.test(ua);

/* ---------- WebGL probe (also reads the GPU name) ---------- */
let webgl: boolean | null = null;
let gpu = "";
function probe() {
  if (webgl !== null || typeof document === "undefined") return;
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    webgl = !!gl;
    if (gl) {
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      gpu = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "");
      gl.getExtension("WEBGL_lose_context")?.loseContext(); // free the probe context right away
    }
  } catch {
    webgl = false;
  }
}
probe();

export function hasWebGL() {
  probe();
  return !!webgl;
}

/** Old / budget mobile GPUs and software renderers. */
const weakGpu = /Mali-(4\d\d|T\d)|Mali-G(31|51|52|57)\b|Adreno \(TM\) [2-5]\d\d|PowerVR|SGX|GE8\d\d\d|SwiftShader|llvmpipe|Software/i.test(gpu);

/** "low" = weak GPU, Data Saver on, or (non-Apple) ≤4 cores / ≤4 GB RAM. */
export const lowEnd =
  forcedLite ??
  (weakGpu ||
    !!nav.connection?.saveData ||
    (!apple && ((nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4)));

/**
 * Starting / maximum render resolution for the 3D canvases.
 * Phones get 2× (sharp on a 3× screen, ~45% fewer pixels than full 3×);
 * weak devices 1.5×; desktops 2×.
 */
const deviceDpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
export const maxDpr = Math.min(deviceDpr, lowEnd ? 1.5 : 2);
/** The adaptive resolution never drops below this, so the burger can't go blurry. */
export const minDpr = Math.min(deviceDpr, lowEnd ? 1 : 1.5);
