'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/Modal';
import PostCard from '@/components/PostCard';
import toast from 'react-hot-toast';
import type { Post } from '@/features/posts/domain/post';
import {
  createPost,
  listPostRecommendations,
  listPosts,
} from '@/features/posts/infrastructure/postRepository';
import { listSkills } from '@/features/skills/infrastructure/skillRepository';
import { createReview } from '@/features/reviews/infrastructure/reviewRepository';
import { getCurrentUser } from '@/features/users/infrastructure/profileRepository';

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;

    return response?.data?.message ?? fallback;
  }

  return fallback;
}

export default function DashboardPage() {
  const router = useRouter();

  const { data: user, error: userError, isLoading: isLoadingUser } = useSWR('currentUser', getCurrentUser);
  const { data: skills = [], isLoading: isLoadingSkills } = useSWR('skills', listSkills);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // useSWRInfinite for pagination
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (!user?.is_verified) return null;
    if (previousPageData && !previousPageData.hasMore) return null; // reached the end
    return ['posts', { search: searchQuery, page: pageIndex + 1, skillId: selectedSkill, sortBy, bookmarkedOnly: showBookmarksOnly }];
  };

  const { data: postsData, error: postsError, size, setSize, isValidating, mutate: mutatePosts } = useSWRInfinite(
    getKey,
    ([_, params]) => listPosts(params)
  );

  const posts: Post[] = postsData ? postsData.flatMap((page) => page.data) : [];
  const isLoadingInitialData = !postsData && !postsError;
  const isLoadingMore = isLoadingInitialData || (size > 0 && postsData && typeof postsData[size - 1] === 'undefined');
  const hasMore = postsData?.[postsData.length - 1]?.hasMore ?? false;

  const { data: recommendations = [], mutate: mutateRecommendations } = useSWR(
    user?.is_verified ? 'recommendations' : null,
    listPostRecommendations
  );

  // State Modal Buat Tawaran
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPost, setNewPost] = useState({
    needed_skill: '',
    offered_skill: '',
    description: '',
  });

  // State Modal Review / Ulasan (Dikembalikan)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewData, setReviewData] = useState({
    user_id: '',
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    if (userError) {
      localStorage.removeItem('token');
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = '/login';
    }
  }, [userError]);

  const handleLoadMore = () => {
    setSize(size + 1);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createPost(newPost);
      setIsModalOpen(false);
      setNewPost({ needed_skill: '', offered_skill: '', description: '' });
      mutatePosts();
      toast.success('Mantap! Tawaran bartermu sudah diposting.');
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Gagal membuat postingan'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler Submit Ulasan (Dikembalikan)
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      await createReview({
        reviewee_id: reviewData.user_id,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      toast.success('Ulasan berhasil dikirim!');
      setIsReviewModalOpen(false);
      setReviewData({ user_id: '', rating: 5, comment: '' });
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Gagal mengirim ulasan'));
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="max-w-3xl mx-auto mt-8 px-4 pb-20 space-y-6">
        <div className="h-24 bg-card/40 rounded-2xl animate-pulse"></div>
        <div className="h-16 bg-card/40 rounded-2xl animate-pulse"></div>
        <div className="space-y-4">
          <div className="h-48 bg-card/40 rounded-3xl animate-pulse"></div>
          <div className="h-48 bg-card/40 rounded-3xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto mt-8 px-4 pb-20 text-foreground"
    >
      {/* BANNER NOTIFIKASI VERIFIKASI */}
      {user && !user.is_verified && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-lg shadow-amber-900/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>
            <div className="text-4xl text-amber-500">⏳</div>
            <div className="flex-1">
              <h3 className="text-amber-500 font-bold text-lg mb-1 tracking-tight">
                Halo {user?.name || 'Mahasiswa'}, Akunmu Sedang Diverifikasi
              </h3>
              <p className="text-amber-500/70 text-sm leading-relaxed">
                Admin sedang mengecek data KTM kamu.{' '}
                <strong className="text-amber-500">
                  Feeds tawaran barter akan terbuka otomatis setelah akunmu
                  disetujui via WhatsApp.
                </strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {user?.is_verified ? (
        <>
          {/* SEARCH & FILTER AREA */}
          <div className="bg-card/40 backdrop-blur-xl border border-border rounded-2xl p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative group flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari keahlian mahasiswa..."
                  className="w-full bg-background border border-border text-foreground text-sm rounded-xl pl-4 pr-10 py-3 outline-none focus:border-primary transition-all"
                />
              </div>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="bg-background border border-border text-foreground text-sm rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors md:w-44"
              >
                <option value="">Semua Skill</option>
                {skills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex mt-3 gap-2 border-t border-border pt-3">
              <button
                onClick={() => setShowBookmarksOnly(false)}
                className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${!showBookmarksOnly ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
              >
                🌐 Semua Post
              </button>
              <button
                onClick={() => setShowBookmarksOnly(true)}
                className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${showBookmarksOnly ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
              >
                🔖 Disimpan
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-5 py-3.5 bg-secondary hover:bg-secondary/80 text-foreground font-bold rounded-2xl border border-border transition-all flex items-center gap-2"
            >
              <span>⭐</span> Beri Ulasan
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              + Buat Tawaran
            </button>
          </div>

          <div className="space-y-6">
            {recommendations.length > 0 &&
              searchQuery === '' &&
              !showBookmarksOnly && (
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-6 text-foreground font-bold text-xl">
                    ✨ Rekomendasi Jodoh Barter
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((p) => (
                      <PostCard key={p.id} post={p} currentUser={user ?? undefined} />
                    ))}
                  </div>
                  <div className="h-px bg-border my-10"></div>
                </div>
              )}

            <AnimatePresence>
              {isLoadingInitialData && (
                <div className="space-y-4">
                  <div className="h-48 bg-card/40 rounded-3xl animate-pulse"></div>
                  <div className="h-48 bg-card/40 rounded-3xl animate-pulse"></div>
                </div>
              )}
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

            {hasMore && searchQuery === '' && (
              <div className="flex justify-center pt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isValidating}
                  className="px-8 py-3 bg-secondary text-foreground font-bold rounded-2xl border border-border transition-all disabled:opacity-50"
                >
                  {isValidating ? '⏳ Memuat...' : '👇 Muat Lebih Banyak'}
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        /* PLACEHOLDER MODE TERKUNCI */
        <div className="flex flex-col items-center justify-center py-24 bg-secondary/20 border border-border rounded-[3rem] mt-4">
          <div className="text-7xl mb-6 filter drop-shadow-[0_0_15px_rgba(251,191,36,0.2)] grayscale opacity-50">
            🔒
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2 tracking-tight uppercase">
            Akses Terbatas
          </h2>
          <p className="text-muted-foreground text-center max-w-sm px-6">
            Konten feeds khusus mahasiswa akan terbuka setelah verifikasi KTM
            selesai.
          </p>
        </div>
      )}

      {/* MODAL BUAT TAWARAN */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Tawaran Baru"
      >
        <form onSubmit={handleCreatePost} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground ml-1">
              Saya butuh bantuan:
            </label>
            <input
              list="skills-list"
              required
              placeholder="Cari skill..."
              className="w-full p-4 bg-background border border-border rounded-2xl text-foreground outline-none focus:border-primary"
              value={newPost.needed_skill}
              onChange={(e) =>
                setNewPost({ ...newPost, needed_skill: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground ml-1">
              Sebagai gantinya:
            </label>
            <input
              list="skills-list"
              required
              placeholder="Keahlian saya..."
              className="w-full p-4 bg-background border border-border rounded-2xl text-foreground outline-none focus:border-emerald-500"
              value={newPost.offered_skill}
              onChange={(e) =>
                setNewPost({ ...newPost, offered_skill: e.target.value })
              }
            />
          </div>
          <datalist id="skills-list">
            {skills.map((s) => (
              <option key={s.id} value={s.name} />
            ))}
          </datalist>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground ml-1">
              Deskripsi:
            </label>
            <textarea
              required
              rows={4}
              placeholder="Jelaskan kebutuhanmu..."
              className="w-full p-4 bg-background border border-border rounded-2xl text-foreground outline-none focus:border-primary"
              value={newPost.description}
              onChange={(e) =>
                setNewPost({ ...newPost, description: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg disabled:bg-secondary"
          >
            {isSubmitting ? 'Memposting...' : 'Posting Sekarang'}
          </button>
        </form>
      </Modal>

      {/* MODAL BERI ULASAN */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Beri Ulasan Partner"
      >
        <form onSubmit={handleReviewSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground ml-1">
              ID User Partner:
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan ID User yang dibarter..."
              className="w-full p-4 bg-background border border-border rounded-2xl text-foreground outline-none focus:border-amber-500"
              value={reviewData.user_id}
              onChange={(e) =>
                setReviewData({ ...reviewData, user_id: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground ml-1">
              Rating (1-5):
            </label>
            <input
              type="number"
              min="1"
              max="5"
              required
              className="w-full p-4 bg-background border border-border rounded-2xl text-foreground outline-none focus:border-amber-500"
              value={reviewData.rating}
              onChange={(e) =>
                setReviewData({ ...reviewData, rating: Number(e.target.value) })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground ml-1">
              Komentar:
            </label>
            <textarea
              required
              rows={3}
              placeholder="Bagaimana pengalamanmu berkolaborasi dengan dia?"
              className="w-full p-4 bg-background border border-border rounded-2xl text-foreground outline-none focus:border-amber-500"
              value={reviewData.comment}
              onChange={(e) =>
                setReviewData({ ...reviewData, comment: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            disabled={isSubmittingReview}
            className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl shadow-lg disabled:bg-secondary"
          >
            {isSubmittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
          </button>
        </form>
      </Modal>
    </motion.div>
  );
}
