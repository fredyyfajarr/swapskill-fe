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
}

export default function DashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendations, setRecommendations] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({
    needed_skill: '',
    offered_skill: '',
    description: '',
  });

  // State untuk filter
  const [selectedSkill, setSelectedSkill] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchPosts();
    fetchSkills();
    fetchRecommendations();
  }, [router]);

  // Panggil ulang API saat filter Dropdown berubah
  useEffect(() => {
    fetchPosts('', 1, false);
  }, [selectedSkill, sortBy]);

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
        },
      });

      if (isLoadMore) {
        setPosts((prev) => [...prev, ...res.data.data]);
      } else {
        setPosts(res.data.data);
      }

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
      console.error('Gagal mengambil skill', error);
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchPosts('', page + 1, true);
    }
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

  // --- LOGIKA LIVE SEARCH FRONTEND ---
  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.needed_skill?.name.toLowerCase().includes(query) ||
      post.offered_skill?.name.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.user?.name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4 pb-20">
      {/* ================================================= */}
      {/* BARIS PENCARIAN & FILTER (TATA LETAK DIPERBAIKI)  */}
      {/* ================================================= */}
      <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Input Live Search (Fleksibel memanjang) */}
          <div className="relative group flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari keahlian atau nama mahasiswa..."
              className="w-full bg-slate-900/50 border border-slate-700/50 text-white text-sm rounded-xl pl-12 pr-10 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Dropdown Kategori Skill */}
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="bg-slate-900/50 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors md:w-44 appearance-none outline-none"
          >
            <option value="">Semua Kategori</option>
            {skills.map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.name}
              </option>
            ))}
          </select>

          {/* Dropdown Urutan */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900/50 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors md:w-36 appearance-none outline-none"
          >
            <option value="latest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
        </div>
      </div>
      {/* ================================================= */}

      {/* Tombol Buat Tawaran */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <span className="text-xl leading-none">+</span> Buat Tawaran
        </button>
      </div>

      {/* MODAL BUAT TAWARAN */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Tawaran Barter"
      >
        <form onSubmit={handleCreatePost} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">
              Saya butuh diajari/dibantu:
            </label>
            <input
              list="skills-list"
              required
              placeholder="Ketik skill (mis: Laravel, UI/UX, dll)..."
              className="w-full p-3.5 bg-slate-900/80 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              value={newPost.needed_skill}
              onChange={(e) =>
                setNewPost({ ...newPost, needed_skill: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">
              Sebagai gantinya, saya bisa:
            </label>
            <input
              list="skills-list"
              required
              placeholder="Ketik skill keahlianmu..."
              className="w-full p-3.5 bg-slate-900/80 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
              value={newPost.offered_skill}
              onChange={(e) =>
                setNewPost({ ...newPost, offered_skill: e.target.value })
              }
            />
          </div>
          <datalist id="skills-list">
            {skills.map((skill) => (
              <option key={skill.id} value={skill.name} />
            ))}
          </datalist>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">
              Deskripsi Detail:
            </label>
            <textarea
              required
              rows={4}
              placeholder="Contoh: Saya butuh bantuan setup server..."
              className="w-full p-4 bg-slate-900/80 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition-all resize-none outline-none"
              value={newPost.description}
              onChange={(e) =>
                setNewPost({ ...newPost, description: e.target.value })
              }
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all disabled:bg-slate-600 disabled:cursor-not-allowed mt-2 shadow-lg"
          >
            {isSubmitting ? 'Memposting...' : 'Posting ke Skill Board'}
          </button>
        </form>
      </Modal>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center text-slate-500 py-10 animate-pulse">
            Menarik data dari server...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/20 border border-slate-700/30 rounded-3xl border-dashed">
            <span className="text-4xl mb-4 block">🏜️</span>
            <p className="text-slate-400">Belum ada tawaran tersedia.</p>
          </div>
        ) : (
          <>
            {/* SECTION REKOMENDASI PINTAR (Hanya muncul jika tidak sedang mencari) */}
            {recommendations.length > 0 && searchQuery === '' && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl">✨</span>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Rekomendasi Jodoh Barter
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.map((post) => (
                    <div key={post.id} className="relative group">
                      <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-[10px] font-black text-slate-900 px-2 py-1 rounded-lg shadow-lg rotate-3 uppercase">
                        Perfect Match!
                      </div>
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
                <div className="h-[1px] w-full bg-slate-800 my-10"></div>
              </div>
            )}

            {/* ================================================= */}
            {/* LOOPING KARTU POSTINGAN (MENGGUNAKAN FILTERED)    */}
            {/* ================================================= */}
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="text-center py-12 bg-slate-800/10 border border-slate-700/30 rounded-2xl border-dashed mt-4">
                <p className="text-slate-400">
                  Tidak ada tawaran yang cocok dengan pencarian "{searchQuery}"
                </p>
              </div>
            )}

            {/* TOMBOL LOAD MORE (Hanya muncul jika tidak sedang mencari) */}
            {hasMore && searchQuery === '' && (
              <div className="flex justify-center pt-8 pb-12">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-8 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl border border-slate-700 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoadingMore ? (
                    <span className="animate-spin text-xl">⏳</span>
                  ) : (
                    '👇 Muat Lebih Banyak'
                  )}
                </button>
              </div>
            )}

            {!hasMore && posts.length > 0 && searchQuery === '' && (
              <p className="text-center text-slate-600 text-sm py-8 italic">
                Kamu sudah melihat semua tawaran yang ada.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
