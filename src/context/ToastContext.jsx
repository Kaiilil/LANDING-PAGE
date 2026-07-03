import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import Toast from '../components/ui/Toast';

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts(prev => {
      const next = [...prev, { id, type, title, message, duration }];
      return next.length > 3 ? next.slice(-3) : next;
    });
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastCtx.Provider value={{ addToast, removeToast }}>
      {children}

      {/* Fixed toast portal — top-right, below navbar */}
      <div
        role="status"
        aria-live="polite"
        aria-label="Thông báo hệ thống"
        style={{
          position: 'fixed',
          top: '5.5rem',
          right: '1.5rem',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'none',
        }}
      >
        <div style={{ pointerEvents: 'auto' }}>
          <AnimatePresence mode="sync">
            {toasts.map(toast => (
              <Toast
                key={toast.id}
                {...toast}
                onClose={() => removeToast(toast.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast phải dùng trong <ToastProvider>');
  return ctx;
}
