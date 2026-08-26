"use client";
import { createContext, useContext, useState, useCallback } from "react";

const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

let idSeq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (message, kind = "info") => {
      const id = ++idSeq;
      setToasts((t) => [...t, { id, message, kind }]);
      setTimeout(() => dismiss(id), 4200);
    },
    [dismiss]
  );

  const toast = {
    info: (m) => push(m, "info"),
    ok: (m) => push(m, "ok"),
    bad: (m) => push(m, "bad"),
    warn: (m) => push(m, "warn"),
  };

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="toast-host" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.kind}`} onClick={() => dismiss(t.id)}>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
