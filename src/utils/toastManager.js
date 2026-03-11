/**
 * Global toast manager — module-level singleton.
 * Any component can push toasts via `pushToast()`.
 * `<DynamicToastContainer />` subscribes and renders.
 */

const MAX_TOASTS = 4;
let _id = 0;
let _toasts = [];
let _listeners = new Set();

function _emit() {
  const snapshot = [..._toasts];
  _listeners.forEach((fn) => fn(snapshot));
}

/** Add a toast. Returns its id. */
export function pushToast({ type = "info", title = "", message = "", duration = 4000 }) {
  const id = ++_id;
  const toast = { id, type, title, message, duration, createdAt: Date.now() };

  _toasts = [toast, ..._toasts].slice(0, MAX_TOASTS);
  _emit();

  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => removeToast(id), duration);
  }

  return id;
}

/** Remove a toast by id. */
export function removeToast(id) {
  const prev = _toasts.length;
  _toasts = _toasts.filter((t) => t.id !== id);
  if (_toasts.length !== prev) _emit();
}

/** Subscribe to toast changes. Returns unsubscribe fn. */
export function subscribeToasts(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

/** Get current snapshot. */
export function getToasts() {
  return [..._toasts];
}
