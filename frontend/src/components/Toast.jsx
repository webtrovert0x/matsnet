import { useState, useCallback } from "react";

let toastId = 0;
let addToastExternal = null;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

const typeStyles = {
  success: {
    border: "1px solid rgba(74, 222, 128, 0.4)",
    background: "rgba(16, 185, 129, 0.12)",
    dot: "#4ade80",
    shadow: "0 0 20px rgba(74, 222, 128, 0.15)",
  },
  error: {
    border: "1px solid rgba(248, 113, 113, 0.4)",
    background: "rgba(239, 68, 68, 0.12)",
    dot: "#f87171",
    shadow: "0 0 20px rgba(248, 113, 113, 0.15)",
  },
  info: {
    border: "1px solid rgba(255, 20, 80, 0.3)",
    background: "rgba(255, 20, 80, 0.08)",
    dot: "#FF1450",
    shadow: "0 0 20px rgba(255, 20, 80, 0.1)",
  },
};

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        maxWidth: "360px",
        width: "calc(100vw - 48px)",
      }}
    >
      {toasts.map((toast) => {
        const s = typeStyles[toast.type] || typeStyles.info;
        return (
          <div
            key={toast.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              padding: "14px 16px",
              borderRadius: "14px",
              border: s.border,
              background: s.background,
              backdropFilter: "blur(16px)",
              boxShadow: s.shadow,
              animation: "toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              cursor: "pointer",
            }}
            onClick={() => removeToast(toast.id)}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: s.dot,
                boxShadow: `0 0 8px ${s.dot}`,
                marginTop: "5px",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                lineHeight: "1.5",
                color: "#fff",
              }}
            >
              {toast.message}
            </span>
          </div>
        );
      })}
    </div>
  );
}
