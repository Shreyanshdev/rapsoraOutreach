"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[300] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className="pointer-events-auto"
            >
              <div className={`
                flex items-center gap-4 px-6 py-4 rounded-2xl glass-morphism border shadow-2xl min-w-[300px]
                ${t.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' : ''}
                ${t.type === 'error' ? 'border-red-500/20 bg-red-500/5 text-red-400' : ''}
                ${t.type === 'info' ? 'border-blue-500/20 bg-blue-500/5 text-blue-400' : ''}
              `}>
                <div className="shrink-0">
                  {t.type === 'success' && <CheckCircle2 size={20} />}
                  {t.type === 'error' && <AlertCircle size={20} />}
                  {t.type === 'info' && <Info size={20} />}
                </div>
                <p className="text-[10px] font-black tracking-widest uppercase italic flex-1">
                  {t.message}
                </p>
                <button 
                  onClick={() => removeToast(t.id)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={14} className="opacity-50" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
