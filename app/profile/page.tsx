'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/axios';
import Navbar from '@/components/Navbar';
import ConfirmModal from '@/components/ConfirmModal';
import PostCard from '@/components/PostCard';
export default function ProfilePage() {
  const router = useRouter();

  // --- STATES ---
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');

  // States untuk Tab & Bookmark
  const [activeTab, setActiveTab] = useState<'posts' | 'bookmarks'>('posts');
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);

  // --- FUNGSI GAMIFIKASI (GELAR) ---
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

  // State untuk Modal Konfirmasi
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'danger' as 'danger' | 'warning' | 'success',
    action: () => {},
  });

  // --- FETCHING DATA ---
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

  // --- USE EFFECTS ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchProfile();
    fetchBookmarks();
  }, [router]);

  // useEffect(() => {
  //   if (activeTab === 'bookmarks') {
  //     fetchBookmarks();
  //   }
  // }, [activeTab]);

  // --- FUNGSI SKILL ---
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
    setConfirmConfig((prev) => ({ ...prev, isOpen: false })); // Mencegah double-click
    try {
      await api.delete(`/profile/skills/${skillId}`);
      toast.success('Skill berhasil dihapus!');
      fetchProfile();
    } catch (error) {
      toast.error('Gagal menghapus skill');
    }
  };

  // --- FUNGSI TAWARAN (POST) ---
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
    setConfirmConfig((prev) => ({ ...prev, isOpen: false })); // Mencegah double-click
    try {
      await api.delete(`/posts/${id}`);
      toast.success('Tawaran berhasil dihapus');
      fetchProfile();
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
    setConfirmConfig((prev) => ({ ...prev, isOpen: false })); // Mencegah double-click
    try {
      await api.patch(`/posts/${id}/status`, { status: 'completed' });
      toast.success('Barter selesai! Reputasi meningkat.');
      fetchProfile();
    } catch (error) {
      toast.error('Gagal update status');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-20 pt-28 px-4">
        <div className="max-w-5xl mx-auto">
          {/* HEADER PROFIL */}
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>

            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 flex items-center justify-center text-white font-black text-5xl shadow-[0_0_40px_rgba(59,130,246,0.3)] shrink-0 z-10">
              {profile?.name?.charAt(0)}
            </div>

            <div className="flex-1 text-center md:text-left z-10">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-white">
                  {profile?.name}
                </h1>

                {/* INI DIA BADGE-NYA */}
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

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl px-5 py-3 text-center min-w-[120px]">
                  {/* Ubah <p> menjadi <div> */}
                  <div className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">
                    Reputasi
                  </div>
                  {/* Ubah <p> menjadi <div> */}
                  <div className="text-2xl font-black text-yellow-500 flex items-center justify-center gap-1">
                    ⭐{' '}
                    {profile?.received_reviews_avg_rating
                      ? Number(profile.received_reviews_avg_rating).toFixed(1)
                      : '0'}
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl px-5 py-3 text-center min-w-[120px]">
                  {/* Ubah <p> menjadi <div> */}
                  <div className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">
                    Ulasan
                  </div>
                  {/* Ubah <p> menjadi <div> */}
                  <div className="text-2xl font-black text-white">
                    {profile?.received_reviews_count || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GRID KONTEN BAWAH */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* KIRI: PORTFOLIO SKILL */}
            <div className="md:col-span-1">
              <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sticky top-32">
                <h2 className="text-xl font-bold text-white mb-4">
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
            <div className="md:col-span-2">
              {/* --- SISTEM TAB --- */}
              <div className="flex border-b border-slate-800 mb-6">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`px-6 py-3 text-sm font-bold transition-all ${
                    activeTab === 'posts'
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Tawaran Saya ({profile?.history_posts?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('bookmarks')}
                  className={`px-6 py-3 text-sm font-bold transition-all ${
                    activeTab === 'bookmarks'
                      ? 'text-yellow-500 border-b-2 border-yellow-500'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  📌 Tersimpan ({bookmarks.length})
                </button>
              </div>

              <div className="space-y-4">
                {activeTab === 'posts' ? (
                  /* --- TAB 1: TAWARAN SAYA (KARTU MINI) --- */
                  <>
                    {profile?.history_posts?.map((post: any) => (
                      <div
                        key={post.id}
                        className={`bg-slate-800/20 border border-slate-700/30 rounded-3xl p-6 transition-all group ${
                          post.status === 'completed'
                            ? 'opacity-60 grayscale-[50%]'
                            : 'hover:bg-slate-800/30'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
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
                          <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap ml-2">
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
                              className="text-xs bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 font-bold px-4 py-2 rounded-xl transition-colors"
                            >
                              ✓ Tandai Selesai
                            </button>
                          )}
                          <button
                            onClick={() => openDeleteConfirm(post.id)}
                            className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold px-4 py-2 rounded-xl transition-colors"
                          >
                            🗑️ Hapus
                          </button>
                        </div>
                      </div>
                    ))}

                    {profile?.history_posts?.length === 0 && (
                      <div className="text-center py-12 bg-slate-800/10 border border-dashed border-slate-700 rounded-3xl">
                        <p className="text-slate-500">
                          Kamu belum pernah membuat postingan tawaran.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  /* --- TAB 2: TERSIMPAN (POST CARD BESAR) --- */
                  <>
                    {loadingBookmarks ? (
                      <div className="text-center py-12">
                        <p className="text-yellow-500 animate-pulse font-medium">
                          Memuat simpanan...
                        </p>
                      </div>
                    ) : bookmarks.length > 0 ? (
                      <div className="grid grid-cols-1 gap-6">
                        {bookmarks.map((item: any) => (
                          <PostCard
                            key={item.id}
                            post={{ ...item.post, is_bookmarked: true }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-slate-800/10 border border-dashed border-slate-700 rounded-3xl">
                        <span className="text-4xl block mb-3 opacity-50">
                          🔖
                        </span>
                        <p className="text-slate-500">
                          Belum ada tawaran yang disimpan.
                        </p>
                        <Link
                          href="/dashboard"
                          className="text-yellow-500 text-sm hover:underline mt-2 inline-block"
                        >
                          Cari di Dashboard →
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

      {/* MODAL BERADA DI LUAR DIV UTAMA UNTUK MENGHINDARI STACKING CONTEXT */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.action}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
      />
    </>
  );
}
