import { useState, useCallback } from "react";
import { ToastContext } from "../context/ToastContext";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg, duration) => addToast(msg, "success", duration),
    error: (msg, duration) => addToast(msg, "error", duration),
    info: (msg, duration) => addToast(msg, "info", duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4">
        {toasts.map((t) => {
          const isSuccess = t.type === "success";
          const isError = t.type === "error";

          let borderClass = "border-[#2A2A2E]";
          let bgClass = "bg-[#141416]";
          let textClass = "text-[#F5F5F5]";
          let icon = "fa-solid fa-circle-info text-sky-400";

          if (isSuccess) {
            borderClass = "border-emerald-500/30";
            icon = "fa-solid fa-circle-check text-emerald-400";
          } else if (isError) {
            borderClass = "border-rose-500/30";
            icon = "fa-solid fa-circle-exclamation text-rose-400";
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border ${borderClass} ${bgClass} shadow-xl shadow-black/50 transition-all duration-300`}
            >
              <i className={`${icon} mt-0.5 text-base shrink-0`} />
              <div className="flex-1 text-xs sm:text-sm leading-snug">
                <p className={textClass}>{t.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-[#7E7E8A] hover:text-[#F5F5F5] transition-colors p-1"
                aria-label="Tutup notifikasi"
              >
                <i className="fa-solid fa-xmark text-xs" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
