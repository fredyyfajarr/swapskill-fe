'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function PostCard({
  post,
  currentUser,
}: {
  post: any;
  currentUser?: any;
}) {
  const [isBookmarked, setIsBookmarked] = useState(post.is_bookmarked || false);

  const toggleBookmark = async () => {
    try {
      await api.post(`/posts/${post.id}/bookmark`);
      setIsBookmarked(!isBookmarked);
      toast.success(
        !isBookmarked ? 'Disimpan ke Bookmark 🔖' : 'Dihapus dari Bookmark 🗑️',
      );
    } catch (error) {
      toast.error('Gagal menyimpan bookmark.');
    }
  };

  const handleChatWA = () => {
    let phone = post.user?.whatsapp_number || '';
    if (phone.startsWith('0')) phone = '62' + phone.substring(1);

    const message = `Halo ${post.user?.name}, saya lihat tawaran barter kamu di SwapSkill. Saya bisa bantu ${post.needed_skill?.name} dan butuh bantuan ${post.offered_skill?.name} kamu. Boleh diskusi?`;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      '_blank',
    );
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 transition-colors relative group h-full flex flex-col">
      {/* TOMBOL BOOKMARK */}
      <button
        onClick={toggleBookmark}
        className="absolute top-5 right-5 text-xl opacity-70 hover:opacity-100 hover:scale-110 transition-all focus:outline-none"
        title="Simpan Tawaran"
      >
        {isBookmarked ? '🔖' : '🤍'}
      </button>

      {/* HEADER CARD */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20 shrink-0">
          {post.user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h4 className="text-white font-bold text-sm">{post.user?.name}</h4>
          <p className="text-slate-400 text-xs">
            {new Date(post.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* SKILL BARTER DENGAN ICON PANAH (⇄) */}
      <div className="flex items-center gap-2 mb-5">
        <div className="flex-1 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 text-center">
          <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">
            Butuh Bantuan
          </p>
          <p
            className="text-emerald-400 font-bold text-sm truncate"
            title={post.needed_skill?.name}
          >
            {post.needed_skill?.name}
          </p>
        </div>

        {/* Icon Tukar / Swap */}
        <div className="shrink-0 text-slate-500 bg-slate-800 p-2 rounded-full border border-slate-700">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            ></path>
          </svg>
        </div>

        <div className="flex-1 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 text-center">
          <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">
            Tawarkan Skill
          </p>
          <p
            className="text-blue-400 font-bold text-sm truncate"
            title={post.offered_skill?.name}
          >
            {post.offered_skill?.name}
          </p>
        </div>
      </div>

      {/* DESKRIPSI (flex-grow agar mengisi ruang kosong dan meratakan tombol bawah) */}
      <div className="flex-grow flex flex-col">
        <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/30 p-4 rounded-xl border border-slate-700/30 h-full">
          "{post.description}"
        </p>
      </div>

      {/* FOOTER (TOMBOL AKSI) */}
      <div className="flex justify-end border-t border-slate-700/50 pt-4 mt-5">
        {currentUser?.id !== post.user?.id ? (
          <button
            onClick={handleChatWA}
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#25D366]/20 w-full justify-center md:w-auto"
          >
            💬 Chat via WhatsApp
          </button>
        ) : (
          <div className="px-4 py-2 bg-slate-700/50 text-slate-400 rounded-xl text-sm font-semibold border border-slate-600/50 w-full text-center md:w-auto">
            📝 Postingan Kamu Sendiri
          </div>
        )}
      </div>
    </div>
  );
}
