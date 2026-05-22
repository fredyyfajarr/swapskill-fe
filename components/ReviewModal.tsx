'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, X, Send } from 'lucide-react';

export default function ReviewModal({
  isOpen,
  onClose,
  onSubmit,
  revieweeName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; comment: string }) => void;
  revieweeName: string;
}) {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ rating, comment });
      setRating(5);
      setComment('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-strong rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Beri Ulasan</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-slate-400 mb-5">
          Bagaimana pengalamanmu barter dengan <span className="text-white font-semibold">{revieweeName}</span>?
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Star Rating */}
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-3 block uppercase tracking-wider">Rating</label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-125"
                >
                  <Star
                    size={32}
                    fill={star <= (hoveredRating || rating) ? 'currentColor' : 'none'}
                    className={star <= (hoveredRating || rating) ? 'text-amber-400' : 'text-slate-600'}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-slate-500 mt-2">
              {rating === 1 && 'Kurang Baik'}
              {rating === 2 && 'Cukup'}
              {rating === 3 && 'Baik'}
              {rating === 4 && 'Sangat Baik'}
              {rating === 5 && 'Luar Biasa! ⭐'}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Komentar</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={3}
              placeholder="Ceritakan pengalamanmu..."
              className="w-full bg-slate-900/50 border border-slate-700/30 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-colors resize-none placeholder:text-slate-600"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 font-semibold rounded-xl transition-colors text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send size={14} />
              {loading ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
