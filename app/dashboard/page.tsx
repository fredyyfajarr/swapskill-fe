'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';
import PostCard from '@/components/PostCard';
import toast from 'react-hot-toast';

interface Skill {
  id: number;
  name: string;
}
interface Post {
  id: number;
  description: string;
  user: { name: string; id: number; whatsapp_number: string };
  needed_skill: { name: string };
  offered_skill: { name: string };
  created_at: string;
  is_bookmarked?: boolean; // Dikembalikan
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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

  const [recommendations, setRecommendations] = useState<Post[]>([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  // Filter Bookmark (Dikembalikan)
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchUser();
  }, [router]);

  useEffect(() => {
    if (user?.is_verified) {
      fetchPosts('', 1, false);
      fetchSkills();
      fetchRecommendations();
    } else if (user) {
      setLoading(false);
    }
  }, [user?.is_verified]);

  useEffect(() => {
    if (user?.is_verified) {
      fetchPosts('', 1, false);
    }
  }, [selectedSkill, sortBy, showBookmarksOnly]); // showBookmarksOnly masuk ke trigger

  const fetchUser = async () => {
    try {
      const res = await api.get('/profile');
      setUser(res.data.data);
    } catch (error) {
      console.error('Gagal memuat profil');
    }
  };

  const fetchPosts = async (query = '', pageNum = 1, isLoadMore = false) => {
    if (isLoadMore) setIsLoadingMore(true);
    else setLoading(true);

    try {
      const res = await api.get('/posts', {
        params: {
          search: query,
          page: pageNum,
          skill_id: selectedSkill,
          sort: sortBy,
          bookmarked: showBookmarksOnly ? 1 : 0, // Parameter API Bookmark
        },
      });

      if (isLoadMore) setPosts((prev) => [...prev, ...res.data.data]);
      else setPosts(res.data.data);

      setHasMore(res.data.has_more);
      setPage(pageNum);
    } catch (error) {
      console.error('Gagal mengambil postingan', error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await api.get('/posts/recommendations');
      setRecommendations(res.data.data);
    } catch (error) {
      console.error('Gagal memuat rekomendasi');
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await api.get('/skills');
      setSkills(res.data.data);
    } catch (error) {
      console.error('Gagal mengambil skill');
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) fetchPosts('', page + 1, true);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/posts', newPost);
      setIsModalOpen(false);
      setNewPost({ needed_skill: '', offered_skill: '', description: '' });
      fetchPosts();
      toast.success('Mantap! Tawaran bartermu sudah diposting.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal membuat postingan');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler Submit Ulasan (Dikembalikan)
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      // Pastikan endpoint review di Laravel kamu adalah /reviews
      await api.post('/reviews', {
        reviewed_id: reviewData.user_id,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      toast.success('Ulasan berhasil dikirim!');
      setIsReviewModalOpen(false);
      setReviewData({ user_id: '', rating: 5, comment: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mengirim ulasan');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.needed_skill?.name.toLowerCase().includes(query) ||
      post.offered_skill?.name.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.user?.name.toLowerCase().includes(query)
    );
  });

  if (loading && !user)
    return (
      <div className="text-center mt-20 text-slate-500 animate-pulse">
        Menghubungkan ke server...
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4 pb-20">
      {/* BANNER NOTIFIKASI VERIFIKASI */}
      {user && !user.is_verified && (
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-lg shadow-amber-900/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>
            <div className="text-4xl text-amber-500">⏳</div>
            <div className="flex-1">
              {/* BUG FIX: Nama sekarang dinamis mengambil dari database user */}
              <h3 className="text-amber-400 font-bold text-lg mb-1 tracking-tight">
                Halo {user?.name || 'Mahasiswa'}, Akunmu Sedang Diverifikasi
              </h3>
              <p className="text-amber-200/70 text-sm leading-relaxed">
                Admin sedang mengecek data KTM kamu.{' '}
                <strong className="text-amber-300">
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
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative group flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari keahlian mahasiswa..."
                  className="w-full bg-slate-900/50 border border-slate-700/50 text-white text-sm rounded-xl pl-12 pr-10 py-3 outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="bg-slate-900/50 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors md:w-44"
              >
                <option value="">Semua Skill</option>
                {skills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* BUG FIX: Tombol Toggle Bookmark Dikembalikan */}
            <div className="flex mt-3 gap-2 border-t border-slate-700/50 pt-3">
              <button
                onClick={() => setShowBookmarksOnly(false)}
                className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${!showBookmarksOnly ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              >
                🌐 Semua Post
              </button>
              <button
                onClick={() => setShowBookmarksOnly(true)}
                className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${showBookmarksOnly ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              >
                🔖 Disimpan
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            {/* BUG FIX: Tombol Beri Ulasan Dikembalikan */}
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl border border-slate-700 transition-all flex items-center gap-2"
            >
              <span>⭐</span> Beri Ulasan
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              + Buat Tawaran
            </button>
          </div>

          <div className="space-y-6">
            {recommendations.length > 0 &&
              searchQuery === '' &&
              !showBookmarksOnly && (
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-6 text-white font-bold text-xl">
                    ✨ Rekomendasi Jodoh Barter
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.map((p) => (
                      <PostCard key={p.id} post={p} />
                    ))}
                  </div>
                  <div className="h-px bg-slate-800 my-10"></div>
                </div>
              )}

            {filteredPosts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}

            {hasMore && searchQuery === '' && (
              <div className="flex justify-center pt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-8 py-3 bg-slate-800 text-slate-300 font-bold rounded-2xl border border-slate-700 transition-all disabled:opacity-50"
                >
                  {isLoadingMore ? '⏳ Memuat...' : '👇 Muat Lebih Banyak'}
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        /* PLACEHOLDER MODE TERKUNCI */
        <div className="flex flex-col items-center justify-center py-24 bg-slate-800/20 border border-slate-700/30 rounded-[3rem] mt-4">
          <div className="text-7xl mb-6 filter drop-shadow-[0_0_15px_rgba(251,191,36,0.2)] grayscale opacity-50">
            🔒
          </div>
          <h2 className="text-xl font-bold text-white mb-2 tracking-tight uppercase">
            Akses Terbatas
          </h2>
          <p className="text-slate-500 text-center max-w-sm px-6">
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
            <label className="text-sm font-semibold text-slate-400 ml-1">
              Saya butuh bantuan:
            </label>
            <input
              list="skills-list"
              required
              placeholder="Cari skill..."
              className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl text-white outline-none focus:border-blue-500"
              value={newPost.needed_skill}
              onChange={(e) =>
                setNewPost({ ...newPost, needed_skill: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-400 ml-1">
              Sebagai gantinya:
            </label>
            <input
              list="skills-list"
              required
              placeholder="Keahlian saya..."
              className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl text-white outline-none focus:border-emerald-500"
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
            <label className="text-sm font-semibold text-slate-400 ml-1">
              Deskripsi:
            </label>
            <textarea
              required
              rows={4}
              placeholder="Jelaskan kebutuhanmu..."
              className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl text-white outline-none focus:border-blue-500"
              value={newPost.description}
              onChange={(e) =>
                setNewPost({ ...newPost, description: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg disabled:bg-slate-600"
          >
            {isSubmitting ? 'Memposting...' : 'Posting Sekarang'}
          </button>
        </form>
      </Modal>

      {/* BUG FIX: MODAL BERI ULASAN DIKEMBALIKAN */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Beri Ulasan Partner"
      >
        <form onSubmit={handleReviewSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-400 ml-1">
              ID User Partner:
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan ID User yang dibarter..."
              className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl text-white outline-none focus:border-amber-500"
              value={reviewData.user_id}
              onChange={(e) =>
                setReviewData({ ...reviewData, user_id: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-400 ml-1">
              Rating (1-5):
            </label>
            <input
              type="number"
              min="1"
              max="5"
              required
              className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl text-white outline-none focus:border-amber-500"
              value={reviewData.rating}
              onChange={(e) =>
                setReviewData({ ...reviewData, rating: Number(e.target.value) })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-400 ml-1">
              Komentar:
            </label>
            <textarea
              required
              rows={3}
              placeholder="Bagaimana pengalamanmu berkolaborasi dengan dia?"
              className="w-full p-4 bg-slate-900 border border-slate-700 rounded-2xl text-white outline-none focus:border-amber-500"
              value={reviewData.comment}
              onChange={(e) =>
                setReviewData({ ...reviewData, comment: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            disabled={isSubmittingReview}
            className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl shadow-lg disabled:bg-slate-600"
          >
            {isSubmittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
