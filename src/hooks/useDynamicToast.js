import { useCallback, useRef } from "react";
import { pushToast, removeToast } from "@/utils/toastManager";

export function useDynamicToast() {
  const lastIdRef = useRef(null);

  const showToast = useCallback((payload) => {
    const { type = "info", title = "", message = "", duration = 4000 } = payload;
    lastIdRef.current = pushToast({ type, title, message, duration });
  }, []);

  const closeToast = useCallback(() => {
    if (lastIdRef.current != null) {
      removeToast(lastIdRef.current);
      lastIdRef.current = null;
    }
  }, []);

  // Backward compat: return a toast object (unused by new container)
  const toast = { open: false, type: "info", title: "", message: "", duration: 4000 };

  return { toast, showToast, closeToast };
}
