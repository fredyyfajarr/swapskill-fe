'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import Navbar from '@/components/Navbar';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import PostCard from '@/components/PostCard';

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');

  const [activeTab, setActiveTab] = useState<'posts' | 'bookmarks'>('posts');
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    nim: '',
    whatsapp_number: '',
  });

  useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name,
        nim: profile.nim,
        whatsapp_number: profile.whatsapp_number,
      });
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/profile', editForm);
      toast.success('Profil berhasil diperbarui!');
      setIsEditModalOpen(false);
      fetchProfile(); // Refresh data di layar
    } catch (error) {
      toast.error('Gagal memperbarui profil');
    }
  };

  const getBadge = (count: number, rating: number) => {
    if (count === 0)
      return {
        label: '🌱 Mahasiswa Baru',
        style: 'bg-slate-700/50 text-slate-400 border-slate-600',
      };
    if (count <= 2)
      return {
        label: '🌟 Pemula Barter',
        style: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      };
    if (count <= 9)
      return {
        label: '🔥 Tutor Aktif',
        style: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      };
    if (rating >= 4.5)
      return {
        label: '👑 Master Sepuh',
        style:
          'bg-yellow-500/20 text-yellow-500 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]',
      };
    return {
      label: '🏅 Senior Barter',
      style: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    };
  };

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'danger' as 'danger' | 'warning' | 'success',
    action: () => {},
  });

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setProfile(res.data.data);
    } catch (error) {
      toast.error('Gagal memuat profil');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    setLoadingBookmarks(true);
    try {
      const res = await api.get('/bookmarks');
      setBookmarks(res.data.data);
    } catch (error) {
      toast.error('Gagal memuat simpanan');
    } finally {
      setLoadingBookmarks(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/profile/stats');
      setStats(res.data.data);
    } catch (error) {
      console.error('Gagal memuat statistik', error);
    }
  };

  const handleBookmarkUpdate = (postId: number, isBookmarked: boolean) => {
    if (!isBookmarked) {
      setBookmarks((prevBookmarks) =>
        prevBookmarks.filter((item) => item.post.id !== postId),
      );
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchProfile();
    fetchBookmarks();
    fetchStats();
  }, [router]);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    try {
      await api.post('/profile/skills', { skill: newSkill });
      toast.success('Skill berhasil ditambahkan!');
      setNewSkill('');
      fetchProfile();
    } catch (error) {
      toast.error('Gagal menambahkan skill');
    }
  };

  const openRemoveSkillConfirm = (skillId: number) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Hapus Skill?',
      message: 'Yakin ingin menghapus keahlian ini dari portofoliomu?',
      type: 'danger',
      action: () => executeRemoveSkill(skillId),
    });
  };

  const executeRemoveSkill = async (skillId: number) => {
    setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
    try {
      await api.delete(`/profile/skills/${skillId}`);
      toast.success('Skill berhasil dihapus!');
      fetchProfile();
    } catch (error) {
      toast.error('Gagal menghapus skill');
    }
  };

  const openDeleteConfirm = (id: number) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Hapus Tawaran?',
      message: 'Tawaran ini akan dihapus permanen. Lanjutkan?',
      type: 'danger',
      action: () => executeDelete(id),
    });
  };

  const executeDelete = async (id: number) => {
    setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
    try {
      await api.delete(`/posts/${id}`);
      toast.success('Tawaran berhasil dihapus');
      fetchProfile();
      fetchStats();
    } catch (error) {
      toast.error('Gagal menghapus tawaran');
    }
  };

  const openCompleteConfirm = (id: number) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Tandai Selesai?',
      message:
        'Pastikan kamu sudah menyelesaikan barter ini. Reputasimu akan meningkat!',
      type: 'success',
      action: () => executeComplete(id),
    });
  };

  const executeComplete = async (id: number) => {
    setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
    try {
      await api.patch(`/posts/${id}/status`, { status: 'completed' });
      toast.success('Barter selesai! Reputasi meningkat.');
      fetchProfile();
      fetchStats();
    } catch (error) {
      toast.error('Gagal update status');
    }
  };

  // ==========================================
  // 1. SKELETON LOADING (UX Upgrade)
  // ==========================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] pt-28 px-4 pb-20">
        <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
          {/* Header Skeleton */}
          <div className="bg-slate-800/40 rounded-3xl p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 rounded-full bg-slate-700/50 shrink-0"></div>
            <div className="flex-1 w-full space-y-4 flex flex-col items-center md:items-start">
              <div className="h-8 bg-slate-700/50 rounded-lg w-1/2 md:w-1/3"></div>
              <div className="h-4 bg-slate-700/50 rounded-lg w-3/4 md:w-1/4"></div>
              <div className="h-4 bg-slate-700/50 rounded-lg w-2/4 md:w-1/4"></div>
              <div className="flex gap-4 pt-4">
                <div className="h-20 w-28 bg-slate-700/50 rounded-2xl"></div>
                <div className="h-20 w-28 bg-slate-700/50 rounded-2xl"></div>
              </div>
            </div>
          </div>
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="h-24 bg-slate-800/60 rounded-2xl"></div>
            <div className="h-24 bg-slate-800/60 rounded-2xl"></div>
            <div className="h-24 bg-slate-800/60 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-20 pt-24 md:pt-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* HEADER PROFIL */}
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-8 mb-6 md:mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>

            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 flex items-center justify-center text-white font-black text-4xl md:text-5xl shadow-[0_0_40px_rgba(59,130,246,0.3)] shrink-0 z-10">
              {profile?.name?.charAt(0)}
            </div>

            <div className="flex-1 text-center md:text-left z-10">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-black text-white">
                  {profile?.name}
                </h1>
                {profile && (
                  <span
                    className={`px-3 py-1 rounded-full border text-xs font-bold tracking-wide ${getBadge(profile.received_reviews_count || 0, profile.received_reviews_avg_rating || 0).style}`}
                  >
                    {
                      getBadge(
                        profile.received_reviews_count || 0,
                        profile.received_reviews_avg_rating || 0,
                      ).label
                    }
                  </span>
                )}
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="md:ml-auto px-4 py-1.5 bg-slate-700/30 hover:bg-slate-700 border border-slate-600/50 text-slate-300 text-[10px] font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  ✏️ Edit Profil
                </button>
              </div>

              <div className="space-y-1 mb-6 text-sm text-slate-400">
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <span className="opacity-70">NIM:</span> {profile?.nim}
                </p>
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <span className="opacity-70">WA:</span>{' '}
                  {profile?.whatsapp_number}
                </p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl px-4 py-2 md:px-5 md:py-3 text-center min-w-[100px] md:min-w-[120px]">
                  <div className="text-[10px] md:text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">
                    Reputasi
                  </div>
                  <div className="text-xl md:text-2xl font-black text-yellow-500 flex items-center justify-center gap-1">
                    ⭐{' '}
                    {profile?.received_reviews_avg_rating
                      ? Number(profile.received_reviews_avg_rating).toFixed(1)
                      : '0'}
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl px-4 py-2 md:px-5 md:py-3 text-center min-w-[100px] md:min-w-[120px]">
                  <div className="text-[10px] md:text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">
                    Ulasan
                  </div>
                  <div className="text-xl md:text-2xl font-black text-white">
                    {profile?.received_reviews_count || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GRID STATISTIK PERSONAL */}
          {stats && (
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8 relative z-10">
              <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 p-3 md:p-4 rounded-xl md:rounded-2xl flex flex-col items-center justify-center text-center shadow-lg hover:-translate-y-1 transition-transform duration-300">
                <span className="text-xl md:text-2xl mb-1">📢</span>
                <span className="text-lg md:text-2xl font-black text-white">
                  {stats.total_posts}
                </span>
                <span className="text-[9px] md:text-xs text-slate-400 font-bold uppercase tracking-wider mt-1 leading-tight">
                  Tawaran
                  <br className="block sm:hidden" /> Dibuat
                </span>
              </div>
              <div className="bg-blue-900/20 backdrop-blur-md border border-blue-500/30 p-3 md:p-4 rounded-xl md:rounded-2xl flex flex-col items-center justify-center text-center shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:-translate-y-1 transition-transform duration-300">
                <span className="text-xl md:text-2xl mb-1">🔥</span>
                <span className="text-lg md:text-2xl font-black text-blue-400">
                  {stats.active_posts}
                </span>
                <span className="text-[9px] md:text-xs text-blue-300/70 font-bold uppercase tracking-wider mt-1 leading-tight">
                  Tawaran
                  <br className="block sm:hidden" /> Aktif
                </span>
              </div>
              <div className="bg-emerald-900/20 backdrop-blur-md border border-emerald-500/30 p-3 md:p-4 rounded-xl md:rounded-2xl flex flex-col items-center justify-center text-center shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:-translate-y-1 transition-transform duration-300">
                <span className="text-xl md:text-2xl mb-1">📌</span>
                <span className="text-lg md:text-2xl font-black text-emerald-400">
                  {stats.saved_count}
                </span>
                <span className="text-[9px] md:text-xs text-emerald-300/70 font-bold uppercase tracking-wider mt-1 leading-tight">
                  Disimpan
                  <br className="block sm:hidden" /> Orang
                </span>
              </div>
            </div>
          )}

          {/* GRID KONTEN BAWAH */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* KIRI: PORTFOLIO SKILL */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-5 md:p-6 sticky top-28">
                <h2 className="text-lg md:text-xl font-bold text-white mb-4">
                  Portfolio Skill
                </h2>
                <form onSubmit={handleAddSkill} className="mb-6">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Tambah skill baru..."
                    className="w-full bg-slate-900/50 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors mb-3"
                  />
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
                  >
                    + Tambah Skill
                  </button>
                </form>

                <div className="flex flex-wrap gap-2">
                  {profile?.skills?.map((skill: any) => (
                    <span
                      key={skill.id}
                      className="group flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/30 text-slate-300 rounded-lg text-xs border border-slate-600/50 hover:border-red-500/50 transition-colors"
                    >
                      {skill.name}
                      <button
                        onClick={() => openRemoveSkillConfirm(skill.id)}
                        className="text-slate-500 hover:text-red-400 font-bold ml-1 px-1 rounded hover:bg-red-500/10 transition-colors"
                        title="Hapus Skill"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {profile?.skills?.length === 0 && (
                    <p className="text-xs text-slate-500 italic">
                      Belum ada skill yang ditambahkan.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* KANAN: TAB RIWAYAT / TERSIMPAN */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap border-b border-slate-800 mb-6 w-full">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`flex-1 sm:flex-none px-4 py-3 md:px-6 text-sm font-bold transition-all whitespace-nowrap text-center ${activeTab === 'posts' ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Tawaran Saya ({profile?.history_posts?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('bookmarks')}
                  className={`flex-1 sm:flex-none px-4 py-3 md:px-6 text-sm font-bold transition-all whitespace-nowrap text-center ${activeTab === 'bookmarks' ? 'text-yellow-500 border-b-2 border-yellow-500 bg-yellow-500/5' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  📌 Tersimpan ({bookmarks.length})
                </button>
              </div>

              <div className="space-y-4">
                {activeTab === 'posts' ? (
                  <>
                    {profile?.history_posts?.map((post: any) => (
                      <div
                        key={post.id}
                        className={`bg-slate-800/20 border border-slate-700/30 rounded-3xl p-5 md:p-6 transition-all group ${post.status === 'completed' ? 'opacity-60 grayscale-[50%]' : 'hover:bg-slate-800/30'}`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2 sm:gap-0">
                          <div className="flex gap-2 flex-wrap">
                            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold uppercase">
                              Butuh: {post.needed_skill?.name}
                            </span>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">
                              Bisa: {post.offered_skill?.name}
                            </span>
                            {post.status === 'completed' && (
                              <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded border border-yellow-500/20 font-bold uppercase">
                                ✅ SELESAI
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm italic group-hover:text-slate-300 transition-colors mb-4">
                          &quot;{post.description}&quot;
                        </p>
                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700/50">
                          {post.status !== 'completed' && (
                            <button
                              onClick={() => openCompleteConfirm(post.id)}
                              className="flex-1 sm:flex-none text-xs bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 font-bold px-4 py-2.5 rounded-xl transition-colors"
                            >
                              ✓ Selesai
                            </button>
                          )}
                          <button
                            onClick={() => openDeleteConfirm(post.id)}
                            className="flex-1 sm:flex-none text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold px-4 py-2.5 rounded-xl transition-colors"
                          >
                            🗑️ Hapus
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* ========================================== */}
                    {/* 2A. INTERACTIVE EMPTY STATE (TAWARAN) */}
                    {/* ========================================== */}
                    {profile?.history_posts?.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-800/10 border border-dashed border-slate-700 rounded-3xl text-center">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                          <svg
                            className="w-8 h-8 text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            ></path>
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">
                          Belum Ada Tawaran
                        </h3>
                        <p className="text-slate-400 text-sm max-w-sm mb-6">
                          Mulai perjalanan bartermu sekarang. Bagikan keahlian
                          yang kamu punya!
                        </p>
                        <Link
                          href="/dashboard"
                          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2.5 px-5 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                        >
                          Buat Tawaran Pertamamu
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Loading Skeleton Khusus Bookmark */}
                    {loadingBookmarks ? (
                      <div className="space-y-4">
                        <div className="h-40 bg-slate-800/40 rounded-3xl animate-pulse"></div>
                        <div className="h-40 bg-slate-800/40 rounded-3xl animate-pulse"></div>
                      </div>
                    ) : bookmarks.length > 0 ? (
                      <div className="grid grid-cols-1 gap-6">
                        {bookmarks.map((item: any) => (
                          <PostCard
                            key={item.id}
                            post={{ ...item.post, is_bookmarked: true }}
                            onBookmarkChange={handleBookmarkUpdate}
                          />
                        ))}
                      </div>
                    ) : (
                      /* ========================================== */
                      /* 2B. INTERACTIVE EMPTY STATE (TERSIMPAN) */
                      /* ========================================== */
                      <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-800/10 border border-dashed border-slate-700 rounded-3xl text-center">
                        <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
                          <svg
                            className="w-8 h-8 text-yellow-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            ></path>
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">
                          Simpanan Kosong
                        </h3>
                        <p className="text-slate-400 text-sm max-w-sm mb-6">
                          Kamu belum menyimpan tawaran apapun. Jelajahi
                          dashboard untuk menemukan teman belajar!
                        </p>
                        <Link
                          href="/dashboard"
                          className="bg-slate-700 hover:bg-slate-600 text-white text-sm font-bold py-2.5 px-5 rounded-xl transition-colors"
                        >
                          Cari Tawaran Menarik
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.action}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
      />
      {/* --- MODAL EDIT PROFIL (MENGGUNAKAN MODAL BIASA) --- */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profil Mahasiswa"
      >
        <form onSubmit={handleUpdateProfile} className="space-y-5">
          <p className="text-slate-400 text-xs -mt-2 mb-4">
            Perbarui data dirimu agar teman barter lebih mudah mengenalimu.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase mb-1.5 block tracking-wider">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="w-full bg-slate-900/50 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all"
                placeholder="Masukkan nama lengkap..."
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase mb-1.5 block tracking-wider">
                Nomor Induk Mahasiswa (NIM)
              </label>
              <input
                type="text"
                value={editForm.nim}
                onChange={(e) =>
                  setEditForm({ ...editForm, nim: e.target.value })
                }
                className="w-full bg-slate-900/50 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all"
                placeholder="Contoh: 231011400..."
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-bold uppercase mb-1.5 block tracking-wider">
                Nomor WhatsApp
              </label>
              <input
                type="text"
                value={editForm.whatsapp_number}
                onChange={(e) =>
                  setEditForm({ ...editForm, whatsapp_number: e.target.value })
                }
                className="w-full bg-slate-900/50 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all"
                placeholder="628..."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 py-3 rounded-xl font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>
    </> // Penutup fragment utama
  );
}
