/** Tiny event bus: the loader announces when it has cleared the screen. */
let done = false;
const listeners = new Set<() => void>();

export function markIntroDone() {
  done = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

export function onIntroDone(fn: () => void) {
  if (done) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => listeners.delete(fn);
}
