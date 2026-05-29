'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import type { Post } from '@/features/posts/domain/post';
import type { CurrentUser } from '@/features/users/domain/user';
import { Bookmark, ArrowRightLeft, Send, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

import Link from 'next/link';

export default function PostCard({
  post,
  currentUser,
  onBookmarkChange,
  onBarterRequested,
}: {
  post: Post;
  currentUser?: CurrentUser;
  onBookmarkChange?: (postId: number, isBookmarked: boolean) => void;
  onBarterRequested?: () => void;
}) {
  const [isBookmarked, setIsBookmarked] = useState(post.is_bookmarked || false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [barterLoading, setBarterLoading] = useState(false);
  const [showBarterModal, setShowBarterModal] = useState(false);
  const [barterMessage, setBarterMessage] = useState('');

  const toggleBookmark = async () => {
    if (bookmarkLoading) return;
    const prev = isBookmarked;
    setIsBookmarked(!prev); // optimistic
    setBookmarkLoading(true);

    try {
      await api.post(`/posts/${post.id}/bookmark`);
      onBookmarkChange?.(post.id, !prev);
      toast.success(!prev ? 'Disimpan ke Bookmark' : 'Dihapus dari Bookmark', { duration: 1500 });
    } catch {
      setIsBookmarked(prev); // rollback
      toast.error('Gagal menyimpan bookmark.');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleBarterRequest = async () => {
    setBarterLoading(true);
    try {
      await api.post('/barter-requests', {
        post_id: post.id,
        message: barterMessage || null,
      });
      toast.success('Pengajuan barter berhasil dikirim! 🎉');
      setShowBarterModal(false);
      setBarterMessage('');
      onBarterRequested?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Gagal mengajukan barter';
      toast.error(msg);
    } finally {
      setBarterLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass rounded-2xl p-5 md:p-6 hover-glow transition-all duration-300 relative group h-full flex flex-col"
      >
        {/* BOOKMARK BUTTON */}
        <button
          onClick={toggleBookmark}
          disabled={bookmarkLoading}
          className={`absolute top-4 right-4 p-2 rounded-xl transition-all duration-200 ${
            isBookmarked
              ? 'text-amber-400 bg-amber-400/10 hover:bg-amber-400/20'
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
          }`}
          title={isBookmarked ? 'Hapus Bookmark' : 'Simpan Tawaran'}
        >
          <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} strokeWidth={2} />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          <Link
            href={`/users/${post.user?.id}`}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20 shrink-0 hover:scale-105 transition-transform"
            title={`Lihat profil ${post.user?.name || 'user'}`}
          >
            {post.user?.name?.charAt(0).toUpperCase() || 'U'}
          </Link>
          <div className="flex-1 min-w-0">
            <Link
              href={`/users/${post.user?.id}`}
              className="block text-white hover:text-blue-400 font-semibold text-sm truncate transition-colors"
              title={`Lihat profil ${post.user?.name || 'user'}`}
            >
              {post.user?.name}
            </Link>
            <p className="text-slate-500 text-xs flex items-center gap-1">
              <Calendar size={10} />
              {new Date(post.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </p>
          </div>
          </div>
        </div>

        {/* SKILL SWAP */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl text-center">
            <p className="text-[9px] text-slate-500 font-bold mb-1 uppercase tracking-[0.15em]">Butuh</p>
            <p className="text-emerald-400 font-bold text-xs truncate" title={post.needed_skill?.name}>
              {post.needed_skill?.name}
            </p>
          </div>

          <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800/80 border border-slate-700/50 text-slate-500">
            <ArrowRightLeft size={14} />
          </div>

          <div className="flex-1 bg-blue-500/5 border border-blue-500/10 p-3 rounded-xl text-center">
            <p className="text-[9px] text-slate-500 font-bold mb-1 uppercase tracking-[0.15em]">Tawarkan</p>
            <p className="text-blue-400 font-bold text-xs truncate" title={post.offered_skill?.name}>
              {post.offered_skill?.name}
            </p>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="flex-grow mb-4">
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
            &quot;{post.description}&quot;
          </p>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-white/5">
          {currentUser?.id !== post.user?.id ? (
            <button
              onClick={() => setShowBarterModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all btn-shine shadow-lg shadow-blue-500/20"
            >
              <ArrowRightLeft size={16} />
              Ajukan Barter
            </button>
          ) : (
            <div className="px-4 py-2.5 bg-slate-800/50 text-slate-500 rounded-xl text-sm font-medium text-center border border-slate-700/30">
              Postingan Kamu
            </div>
          )}
        </div>
      </motion.div>

      {/* BARTER REQUEST MODAL */}
      {showBarterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowBarterModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-strong rounded-2xl p-6 w-full max-w-md shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white mb-1">Ajukan Barter</h3>
            <p className="text-sm text-slate-400 mb-4">
              Kirim pengajuan barter ke <span className="text-white font-medium">{post.user?.name}</span>
            </p>

            <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/30">
              <div className="flex-1 text-center">
                <p className="text-[9px] text-slate-500 font-bold uppercase">Butuh</p>
                <p className="text-emerald-400 text-xs font-bold">{post.needed_skill?.name}</p>
              </div>
              <ArrowRightLeft size={14} className="text-slate-600" />
              <div className="flex-1 text-center">
                <p className="text-[9px] text-slate-500 font-bold uppercase">Tawarkan</p>
                <p className="text-blue-400 text-xs font-bold">{post.offered_skill?.name}</p>
              </div>
            </div>

            <textarea
              value={barterMessage}
              onChange={e => setBarterMessage(e.target.value)}
              placeholder="Tulis pesan untuk pemilik tawaran (opsional)..."
              rows={3}
              className="w-full bg-slate-900/50 border border-slate-700/50 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-colors mb-4 resize-none placeholder:text-slate-600"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowBarterModal(false)}
                className="flex-1 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 font-semibold rounded-xl transition-colors text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleBarterRequest}
                disabled={barterLoading}
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <Send size={14} />
                {barterLoading ? 'Mengirim...' : 'Kirim'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
