'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import Navbar from '@/components/Navbar';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import PostCard from '@/components/PostCard';
import { Pencil, Plus, Trash2, X, Star, Bookmark, Megaphone, Flame, PinIcon, CheckCircle } from 'lucide-react';

const fetcher = (url: string) => api.get(url).then(res => res.data.data);

export default function ProfilePage() {
  const router = useRouter();

  const { data: profile, error: profileError, isLoading: isLoadingProfile, mutate: mutateProfile } = useSWR('/profile', fetcher);
  const { data: stats, isLoading: isLoadingStats, mutate: mutateStats } = useSWR('/profile/stats', fetcher);
  const { data: bookmarksData, isLoading: isLoadingBookmarks, mutate: mutateBookmarks } = useSWR('/bookmarks', fetcher);

  const [newSkill, setNewSkill] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'bookmarks'>('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', nim: '', whatsapp_number: '' });

  useEffect(() => {
    if (profileError?.response?.status === 401) {
      localStorage.removeItem('token');
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = '/login';
    }
  }, [profileError]);

  useEffect(() => {
    if (profile) setEditForm({ name: profile.name, nim: profile.nim, whatsapp_number: profile.whatsapp_number });
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/profile', editForm);
      toast.success('Profil berhasil diperbarui!');
      setIsEditModalOpen(false);
      mutateProfile();
    } catch { toast.error('Gagal memperbarui profil'); }
  };

  const getBadge = (count: number, rating: number) => {
    if (count === 0) return { label: '🌱 Mahasiswa Baru', style: 'bg-slate-700/50 text-slate-400 border-slate-600' };
    if (count <= 2) return { label: '🌟 Pemula Barter', style: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    if (count <= 9) return { label: '🔥 Tutor Aktif', style: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    if (rating >= 4.5) return { label: '👑 Master Sepuh', style: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]' };
    return { label: '🏅 Senior Barter', style: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  };

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false, title: '', message: '', type: 'danger' as 'danger' | 'warning' | 'success', action: () => {},
  });

  const handleBookmarkUpdate = async (postId: number, isBookmarked: boolean) => {
    if (!isBookmarked) mutateBookmarks((prev: any) => prev?.filter((item: any) => item.post.id !== postId), false);
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    try {
      await api.post('/profile/skills', { skill: newSkill });
      toast.success('Skill ditambahkan!');
      setNewSkill('');
      mutateProfile();
    } catch { toast.error('Gagal menambahkan skill'); }
  };

  const openRemoveSkillConfirm = (skillId: number) => {
    setConfirmConfig({
      isOpen: true, title: 'Hapus Skill?', message: 'Yakin ingin menghapus keahlian ini?',
      type: 'danger', action: () => executeRemoveSkill(skillId),
    });
  };

  const executeRemoveSkill = async (skillId: number) => {
    setConfirmConfig(prev => ({ ...prev, isOpen: false }));
    try { await api.delete(`/profile/skills/${skillId}`); toast.success('Skill dihapus!'); mutateProfile(); }
    catch { toast.error('Gagal menghapus skill'); }
  };

  const openDeleteConfirm = (id: number) => {
    setConfirmConfig({
      isOpen: true, title: 'Hapus Tawaran?', message: 'Tawaran ini akan dihapus permanen.',
      type: 'danger', action: () => executeDelete(id),
    });
  };

  const executeDelete = async (id: number) => {
    setConfirmConfig(prev => ({ ...prev, isOpen: false }));
    try { await api.delete(`/posts/${id}`); toast.success('Tawaran dihapus'); mutateProfile(); mutateStats(); }
    catch { toast.error('Gagal menghapus'); }
  };

  const isLoading = isLoadingProfile || isLoadingStats;

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background bg-mesh pt-28 px-4 pb-20">
          <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
            <div className="glass rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
              <div className="w-28 h-28 rounded-full bg-slate-700/50 shrink-0" />
              <div className="flex-1 w-full space-y-4">
                <div className="h-7 bg-slate-700/50 rounded-lg w-1/3" />
                <div className="h-4 bg-slate-700/50 rounded-lg w-1/4" />
                <div className="flex gap-4 pt-4">
                  <div className="h-20 w-28 bg-slate-700/50 rounded-xl" />
                  <div className="h-20 w-28 bg-slate-700/50 rounded-xl" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-800/40 rounded-xl" />)}
            </div>
          </div>
        </div>
      </>
    );
  }

  const badge = getBadge(profile?.received_reviews_count || 0, profile?.received_reviews_avg_rating || 0);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background bg-mesh text-foreground pb-20 pt-24 md:pt-28 px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">

          {/* HEADER */}
          <div className="glass-strong rounded-2xl p-6 md:p-8 mb-6 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />

            <motion.div whileHover={{ scale: 1.05 }}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-black text-3xl md:text-4xl shadow-lg shadow-blue-500/20 shrink-0 z-10"
            >
              {profile?.name?.charAt(0)}
            </motion.div>

            <div className="flex-1 text-center md:text-left z-10 w-full">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-3">
                <h1 className="text-2xl md:text-3xl font-black text-white">{profile?.name}</h1>
                <span className={`px-3 py-1 rounded-full border text-xs font-bold ${badge.style}`}>{badge.label}</span>
                <button onClick={() => setIsEditModalOpen(true)}
                  className="md:ml-auto px-4 py-1.5 glass hover:bg-white/10 text-slate-300 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Pencil size={12} /> Edit Profil
                </button>
              </div>

              <div className="space-y-1 mb-5 text-sm text-slate-400">
                <p>NIM: {profile?.nim}</p>
                <p>WA: {profile?.whatsapp_number}</p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="glass rounded-xl px-5 py-3 text-center min-w-[110px]">
                  <div className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Reputasi</div>
                  <div className="text-xl font-black text-amber-400 flex items-center justify-center gap-1">
                    <Star size={16} fill="currentColor" />
                    {profile?.received_reviews_avg_rating ? Number(profile.received_reviews_avg_rating).toFixed(1) : '0'}
                  </div>
                </div>
                <div className="glass rounded-xl px-5 py-3 text-center min-w-[110px]">
                  <div className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Ulasan</div>
                  <div className="text-xl font-black text-white">{profile?.received_reviews_count || 0}</div>
                </div>
              </div>
            </div>
          </div>

          {/* STATS */}
          {stats && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="grid grid-cols-3 gap-3 mb-6"
            >
              <div className="glass rounded-xl p-4 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                <Megaphone size={20} className="text-blue-400 mb-1.5" />
                <span className="text-lg font-black text-white">{stats.total_posts}</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase">Tawaran</span>
              </div>
              <div className="glass rounded-xl p-4 flex flex-col items-center text-center hover:-translate-y-1 transition-transform border-blue-500/20">
                <Flame size={20} className="text-orange-400 mb-1.5" />
                <span className="text-lg font-black text-blue-400">{stats.active_posts}</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase">Aktif</span>
              </div>
              <div className="glass rounded-xl p-4 flex flex-col items-center text-center hover:-translate-y-1 transition-transform border-emerald-500/20">
                <PinIcon size={20} className="text-emerald-400 mb-1.5" />
                <span className="text-lg font-black text-emerald-400">{stats.saved_count}</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase">Disimpan</span>
              </div>
            </motion.div>
          )}

          {/* CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT: SKILL PORTFOLIO */}
            <div className="lg:col-span-1">
              <div className="glass-strong rounded-2xl p-5 sticky top-28">
                <h2 className="text-base font-bold text-white mb-4">Portfolio Skill</h2>
                <form onSubmit={handleAddSkill} className="mb-4">
                  <div className="flex gap-2">
                    <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Tambah skill..."
                      className="flex-1 bg-slate-900/50 border border-slate-700/30 text-white text-sm rounded-xl px-3 py-2.5 outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    />
                    <button type="submit" className="px-3 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition-colors">
                      <Plus size={18} />
                    </button>
                  </div>
                </form>
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {profile?.skills?.map((skill: any) => (
                      <motion.span key={skill.id}
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                        className="group flex items-center gap-1.5 px-3 py-1.5 glass text-white text-xs rounded-lg"
                      >
                        {skill.name}
                        <button onClick={() => openRemoveSkillConfirm(skill.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors"><X size={12} /></button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  {profile?.skills?.length === 0 && <p className="text-xs text-slate-500 italic">Belum ada skill.</p>}
                </div>
              </div>
            </div>

            {/* RIGHT: TABS */}
            <div className="lg:col-span-2">
              <div className="flex border-b border-white/5 mb-6">
                <button onClick={() => setActiveTab('posts')}
                  className={`flex-1 sm:flex-none px-5 py-3 text-sm font-bold transition-all ${activeTab === 'posts' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Tawaran Saya ({profile?.history_posts?.length || 0})
                </button>
                <button onClick={() => setActiveTab('bookmarks')}
                  className={`flex-1 sm:flex-none px-5 py-3 text-sm font-bold transition-all flex items-center gap-1.5 ${activeTab === 'bookmarks' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Bookmark size={14} /> Tersimpan ({bookmarksData?.length || 0})
                </button>
              </div>

              <div className="space-y-4">
                {activeTab === 'posts' ? (
                  <AnimatePresence>
                    {profile?.history_posts?.map((post: any) => (
                      <motion.div key={post.id}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                        className={`glass rounded-2xl p-5 transition-all group ${post.status === 'completed' ? 'opacity-60' : 'hover-glow'}`}
                      >
                        <div className="flex flex-wrap justify-between items-start mb-3 gap-2">
                          <div className="flex gap-2 flex-wrap">
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                              Butuh: {post.needed_skill?.name}
                            </span>
                            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-500/20 font-semibold">
                              Bisa: {post.offered_skill?.name}
                            </span>
                            {post.status === 'completed' && (
                              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-semibold flex items-center gap-1">
                                <CheckCircle size={10} /> Selesai
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">{new Date(post.created_at).toLocaleDateString('id-ID')}</span>
                        </div>
                        <p className="text-slate-400 text-sm italic mb-4">&quot;{post.description}&quot;</p>
                        <div className="flex gap-2 pt-3 border-t border-white/5">
                          <button onClick={() => openDeleteConfirm(post.id)}
                            className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                          >
                            <Trash2 size={12} /> Hapus
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    {profile?.history_posts?.length === 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="glass rounded-2xl p-12 text-center border border-dashed border-slate-700/50"
                      >
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Plus size={24} className="text-blue-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Belum Ada Tawaran</h3>
                        <p className="text-slate-400 text-sm mb-6">Mulai perjalanan bartermu!</p>
                        <Link href="/dashboard" className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-blue-500/20 btn-shine">
                          Buat Tawaran
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                ) : (
                  <>
                    {isLoadingBookmarks ? (
                      <div className="space-y-4">
                        {[1,2].map(i => <div key={i} className="h-40 glass rounded-2xl animate-pulse" />)}
                      </div>
                    ) : bookmarksData?.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {bookmarksData.map((item: any) => (
                          <PostCard key={item.id} post={{ ...item.post, is_bookmarked: true }} onBookmarkChange={handleBookmarkUpdate} />
                        ))}
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="glass rounded-2xl p-12 text-center border border-dashed border-slate-700/50"
                      >
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
                          <Bookmark size={24} className="text-amber-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Simpanan Kosong</h3>
                        <p className="text-slate-400 text-sm mb-6">Jelajahi dashboard untuk bookmark tawaran menarik!</p>
                        <Link href="/dashboard" className="glass text-white text-sm font-bold py-2.5 px-6 rounded-xl hover:bg-white/10 transition-colors">
                          Cari Tawaran
                        </Link>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <ConfirmModal isOpen={confirmConfig.isOpen} onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.action} title={confirmConfig.title} message={confirmConfig.message} type={confirmConfig.type}
      />

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Profil">
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <p className="text-slate-500 text-xs -mt-1 mb-3">Perbarui data dirimu.</p>
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Nama Lengkap</label>
            <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700/30 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">NIM</label>
            <input type="text" value={editForm.nim} onChange={(e) => setEditForm({ ...editForm, nim: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700/30 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">WhatsApp</label>
            <input type="text" value={editForm.whatsapp_number} onChange={(e) => setEditForm({ ...editForm, whatsapp_number: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700/30 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
          <div className="flex gap-3 pt-3">
            <button type="button" onClick={() => setIsEditModalOpen(false)}
              className="flex-1 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 font-semibold rounded-xl transition-colors text-sm">Batal</button>
            <button type="submit"
              className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all text-sm">Simpan</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
