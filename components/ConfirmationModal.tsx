"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Check, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning' | 'info';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  type = 'danger'
}: ConfirmationModalProps) {
  
  const getColors = () => {
    switch (type) {
      case 'danger': return { icon: "text-red-400 bg-red-500/10", button: "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20" };
      case 'warning': return { icon: "text-amber-400 bg-amber-500/10", button: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20" };
      default: return { icon: "text-blue-400 bg-blue-500/10", button: "bg-white text-black hover:bg-zinc-200 shadow-white/20" };
    }
  };

  const colors = getColors();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-sm bg-[#0a0a0c] glass-morphism border border-white/10 rounded-[2.5rem] p-8 relative z-10 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${colors.icon}`}>
                <AlertTriangle size={32} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white tracking-widest uppercase italic">{title}</h3>
                <p className="text-zinc-500 text-xs font-medium tracking-wider uppercase opacity-80 leading-relaxed">
                  {message}
                </p>
              </div>

              <div className="flex gap-4 w-full pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-4 bg-white/5 border border-white/5 text-zinc-400 rounded-2xl font-black hover:bg-white/10 hover:text-white transition-all text-[10px] tracking-widest uppercase italic"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 px-6 py-4 rounded-2xl font-black transition-all shadow-xl text-[10px] tracking-widest uppercase italic transform active:scale-95 ${colors.button}`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
