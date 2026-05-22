'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'danger',
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'success';
}) {
  if (!isOpen) return null;

  const config = {
    danger: { icon: <XCircle size={24} />, color: 'text-red-400', bg: 'bg-red-500/10', btn: 'from-red-600 to-red-500', shadow: 'shadow-red-500/20' },
    warning: { icon: <AlertTriangle size={24} />, color: 'text-amber-400', bg: 'bg-amber-500/10', btn: 'from-amber-600 to-amber-500', shadow: 'shadow-amber-500/20' },
    success: { icon: <CheckCircle size={24} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10', btn: 'from-emerald-600 to-emerald-500', shadow: 'shadow-emerald-500/20' },
  }[type];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center"
        onClick={e => e.stopPropagation()}
      >
        <div className={`w-14 h-14 rounded-full ${config.bg} flex items-center justify-center ${config.color} mx-auto mb-4`}>
          {config.icon}
        </div>
        <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
        <p className="text-slate-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 font-semibold rounded-xl transition-colors text-sm"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 bg-gradient-to-r ${config.btn} text-white font-semibold rounded-xl shadow-lg ${config.shadow} transition-all text-sm`}
          >
            Ya, Lanjutkan
          </button>
        </div>
      </motion.div>
    </div>
  );
}
