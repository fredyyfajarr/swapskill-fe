'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  revieweeId: number | null;
  revieweeName: string;
  onSuccess?: () => void; // Fungsi untuk me-refresh data setelah sukses
}

export default function ReviewModal({
  isOpen,
  onClose,
  revieweeId,
  revieweeName,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Pilih jumlah bintang terlebih dahulu!');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/reviews', {
        reviewee_id: revieweeId,
        rating: rating,
        comment: comment,
      });
      toast.success(`Ulasan untuk ${revieweeName} berhasil dikirim! ⭐`);
      setRating(0);
      setComment('');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mengirim ulasan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Background Blur */}
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Box */}
      <div className="relative bg-slate-800 border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-yellow-500 to-orange-400 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 rotate-12 shadow-lg shadow-yellow-500/20">
            ⭐
          </div>
          <h3 className="text-xl font-bold text-white">Beri Ulasan</h3>
          <p className="text-slate-400 text-sm mt-1">
            Bagaimana pengalamanmu barter dengan{' '}
            <span className="text-blue-400 font-bold">{revieweeName}</span>?
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Bintang Interaktif */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`text-4xl transition-all transform hover:scale-110 ${
                  (hoveredRating || rating) >= star
                    ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                    : 'text-slate-600 grayscale'
                }`}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Komentar / Feedback
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ceritakan pengalamanmu belajar bersamanya..."
              className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
            ></textarea>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
