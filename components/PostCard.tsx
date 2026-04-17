'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

interface PostCardProps {
  post: any;
  showActions?: boolean; // Bisa disembunyikan kalau sedang lihat di profil sendiri
}

export default function PostCard({ post, showActions = true }: PostCardProps) {
  // 1. State untuk warna tombol pita
  const [isBookmarked, setIsBookmarked] = useState(post.is_bookmarked || false);

  // 2. Fungsi Eksekutor Bookmark
  const handleBookmark = async () => {
    // Optimistic UI: Langsung ubah warna sebelum nunggu server balas
    setIsBookmarked(!isBookmarked);

    try {
      const res = await api.post(`/posts/${post.id}/bookmark`);
      // Tampilkan toast hanya jika berhasil disimpan (bukan saat dihapus)
      if (res.data.is_bookmarked) {
        toast.success('Disimpan ke profilmu! 📌');
      }
    } catch (error) {
      // Kalau server error/internet putus, kembalikan warna tombol ke semula
      setIsBookmarked(isBookmarked);
      toast.error('Gagal menyimpan tawaran.');
    }
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 hover:bg-slate-800/60 transition-colors flex flex-col h-full relative group">
      {/* 3. TOMBOL BOOKMARK DI SUDUT KANAN ATAS */}
      <button
        onClick={handleBookmark}
        title={isBookmarked ? 'Hapus Simpanan' : 'Simpan Tawaran'}
        className={`absolute top-6 right-6 p-2 rounded-xl text-xl transition-all z-10 ${
          isBookmarked
            ? 'bg-yellow-500/20 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
            : 'bg-slate-700/30 text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'
        }`}
      >
        {isBookmarked ? '📌' : '🔖'}
      </button>

      {/* HEADER KARTU (Avatar & Nama) */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {post.user.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-slate-200">{post.user.name}</h3>
          <p className="text-xs text-slate-500">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* BADGE SKILL (Dibutuhkan & Ditawarkan) */}
      <div className="flex flex-wrap items-center gap-3 mb-5 p-4 bg-slate-900/50 rounded-2xl">
        <div className="flex-1">
          <p className="text-xs text-slate-500 mb-1">MEMBUTUHKAN</p>
          <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-sm font-medium">
            {post.needed_skill?.name}
          </span>
        </div>
        <div className="text-slate-600 font-bold">⟷</div>
        <div className="flex-1 text-right">
          <p className="text-xs text-slate-500 mb-1">MENAWARKAN</p>
          <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-medium">
            {post.offered_skill?.name}
          </span>
        </div>
      </div>

      {/* DESKRIPSI TUGAS */}
      <p className="text-slate-300 leading-relaxed mb-6 flex-grow pr-4">
        {post.description}
      </p>

      {/* Tombol Aksi (Hanya muncul jika showActions = true) */}
      {showActions && (
        <div className="flex gap-3 mt-auto">
          <a
            href={`https://wa.me/${post.user.whatsapp_number}?text=Halo ${post.user.name}, saya dari SwapSkill. Saya lihat kamu butuh bantuan ${post.needed_skill?.name}. Boleh ngobrol?`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl transition-colors text-center inline-block"
          >
            Ajak Barter (WA)
          </a>
          <Link
            href={`/users/${post.user.id}`}
            className="px-5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-colors flex items-center justify-center"
          >
            Lihat Profil
          </Link>
        </div>
      )}
    </div>
  );
}
