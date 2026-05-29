'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Modal from '@/components/Modal';
import PostCard from '@/components/PostCard';
import toast from 'react-hot-toast';
import type { ListPostsParams, PaginatedPosts, Post } from '@/features/posts/domain/post';
import {
  createPost,
  listPostRecommendations,
  listPosts,
} from '@/features/posts/infrastructure/postRepository';
import { listSkills } from '@/features/skills/infrastructure/skillRepository';
import { getCurrentUser } from '@/features/users/infrastructure/profileRepository';
import { Search, Plus, Bookmark, Globe, Sparkles, Loader2, ChevronDown, Lock } from 'lucide-react';

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message ?? fallback;
  }
  return fallback;
}

export default function DashboardPage() {
  const { data: user, error: userError, isLoading: isLoadingUser } = useSWR('currentUser', getCurrentUser);
  const { data: skills = [] } = useSWR('skills', listSkills);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  type PostsKey = [string, ListPostsParams];

  const getKey = (pageIndex: number, previousPageData: PaginatedPosts | null): PostsKey | null => {
    if (!user?.is_verified) return null;
    if (previousPageData && !previousPageData.hasMore) return null;
    return ['posts', { search: searchQuery, page: pageIndex + 1, skillId: selectedSkill, sortBy, bookmarkedOnly: showBookmarksOnly }];
  };

  const { data: postsData, error: postsError, size, setSize, isValidating, mutate: mutatePosts } = useSWRInfinite<PaginatedPosts>(
    getKey,
    (key: PostsKey) => listPosts(key[1])
  );

  const posts: Post[] = postsData ? postsData.flatMap((page) => page.data) : [];
  const isLoadingInitialData = !postsData && !postsError;
  const isLoadingMore = isLoadingInitialData || (size > 0 && postsData && typeof postsData[size - 1] === 'undefined');
  const hasMore = postsData?.[postsData.length - 1]?.hasMore ?? false;

  const { data: recommendations = [] } = useSWR(
    user?.is_verified ? 'recommendations' : null,
    listPostRecommendations
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPost, setNewPost] = useState({
    needed_skill: '',
    offered_skill: '',
    description: '',
  });

  useEffect(() => {
    if (userError) {
      localStorage.removeItem('token');
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = '/login';
    }
  }, [userError]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createPost(newPost);
      setIsModalOpen(false);
      setNewPost({ needed_skill: '', offered_skill: '', description: '' });
      mutatePosts();
      toast.success('Tawaran bartermu sudah diposting! 🚀');
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Gagal membuat postingan'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background bg-mesh pt-24 md:pt-28 px-4">
          <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
            <div className="h-20 glass rounded-2xl" />
            <div className="h-14 glass rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-52 glass rounded-2xl" />
              <div className="h-52 glass rounded-2xl" />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background bg-mesh text-foreground pb-20 pt-24 md:pt-28 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* VERIFICATION BANNER */}
          {user && !user.is_verified && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                <Lock size={18} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-amber-400 font-bold text-sm mb-1">Akun Sedang Diverifikasi</h3>
                <p className="text-amber-400/60 text-xs leading-relaxed">
                  Admin sedang mengecek data KTM kamu. Skill Board akan terbuka setelah akunmu disetujui.
                </p>
              </div>
            </motion.div>
          )}

          {user?.is_verified ? (
            <>
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">Skill Board</h1>
                  <p className="text-slate-400 text-sm">Temukan partner barter skill yang cocok untukmu</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-500/20 btn-shine transition-all"
                >
                  <Plus size={16} />
                  Buat Tawaran
                </button>
              </div>

              {/* SEARCH & FILTER */}
              <div className="glass rounded-2xl p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari keahlian..."
                      className="w-full bg-slate-900/50 border border-slate-700/30 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    />
                  </div>
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="bg-slate-900/50 border border-slate-700/30 text-slate-300 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500/50 transition-colors md:w-44"
                  >
                    <option value="">Semua Skill</option>
                    {skills.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex mt-3 gap-2 pt-3 border-t border-white/5">
                  <button
                    onClick={() => setShowBookmarksOnly(false)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
                      !showBookmarksOnly
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <Globe size={12} /> Semua
                  </button>
                  <button
                    onClick={() => setShowBookmarksOnly(true)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
                      showBookmarksOnly
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <Bookmark size={12} /> Disimpan
                  </button>
                </div>
              </div>

              {/* RECOMMENDATIONS */}
              {recommendations.length > 0 && searchQuery === '' && !showBookmarksOnly && (
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={18} className="text-amber-400" />
                    <h2 className="text-lg font-bold text-white">Rekomendasi Untukmu</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((p) => (
                      <PostCard key={p.id} post={p} currentUser={user ?? undefined} />
                    ))}
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent my-8" />
                </div>
              )}

              {/* POSTS */}
              <div className="space-y-4">
                {isLoadingInitialData && (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                        <div className="flex gap-3 items-center mb-4">
                          <div className="w-10 h-10 rounded-full bg-slate-700/50" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-700/50 rounded w-1/3" />
                            <div className="h-3 bg-slate-700/50 rounded w-1/4" />
                          </div>
                        </div>
                        <div className="flex gap-2 mb-4">
                          <div className="flex-1 h-16 bg-slate-700/50 rounded-xl" />
                          <div className="flex-1 h-16 bg-slate-700/50 rounded-xl" />
                        </div>
                        <div className="h-12 bg-slate-700/50 rounded-xl" />
                      </div>
                    ))}
                  </div>
                )}

                <AnimatePresence>
                  {posts.map((p) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <PostCard post={p} currentUser={user ?? undefined} />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {posts.length === 0 && !isLoadingInitialData && (
                  <div className="glass rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Search size={24} className="text-blue-400" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">Belum Ada Tawaran</h3>
                    <p className="text-slate-400 text-sm">Coba ubah filter atau buat tawaran pertamamu!</p>
                  </div>
                )}

                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={() => setSize(size + 1)}
                      disabled={isValidating}
                      className="flex items-center gap-2 px-6 py-2.5 glass rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-all disabled:opacity-50"
                    >
                      {isValidating ? (
                        <><Loader2 size={14} className="animate-spin" /> Memuat...</>
                      ) : (
                        <><ChevronDown size={14} /> Muat Lebih Banyak</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 glass rounded-3xl text-center">
              <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
                <Lock size={32} className="text-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Akses Terbatas</h2>
              <p className="text-slate-400 text-sm max-w-sm">
                Skill Board akan terbuka setelah verifikasi KTM kamu selesai.
              </p>
            </div>
          )}

          {/* CREATE POST MODAL */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Buat Tawaran Baru">
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Saya butuh bantuan</label>
                <input
                  list="skills-list"
                  required
                  placeholder="Cari skill..."
                  className="w-full p-3 bg-slate-900/50 border border-slate-700/30 rounded-xl text-white text-sm outline-none focus:border-blue-500/50 placeholder:text-slate-600"
                  value={newPost.needed_skill}
                  onChange={(e) => setNewPost({ ...newPost, needed_skill: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 flex justify-between uppercase tracking-wider">
                  <span>Sebagai gantinya</span>
                  {user?.skills && user.skills.length > 0 && <span className="text-emerald-500 font-bold lowercase">⭐ dari portfolio</span>}
                </label>
                <input
                  list={user?.skills && user.skills.length > 0 ? "my-skills-list" : "skills-list"}
                  required
                  placeholder="Keahlian saya..."
                  className="w-full p-3 bg-slate-900/50 border border-slate-700/30 rounded-xl text-white text-sm outline-none focus:border-emerald-500/50 placeholder:text-slate-600"
                  value={newPost.offered_skill}
                  onChange={(e) => setNewPost({ ...newPost, offered_skill: e.target.value })}
                />
              </div>
              <datalist id="skills-list">
                {skills.map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
              <datalist id="my-skills-list">
                {user?.skills?.map((s: any) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Deskripsi</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Jelaskan kebutuhanmu..."
                  className="w-full p-3 bg-slate-900/50 border border-slate-700/30 rounded-xl text-white text-sm outline-none focus:border-blue-500/50 resize-none placeholder:text-slate-600"
                  value={newPost.description}
                  onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all btn-shine"
              >
                {isSubmitting ? 'Memposting...' : 'Posting Sekarang'}
              </button>
            </form>
          </Modal>
        </motion.div>
      </div>
    </>
  );
}
