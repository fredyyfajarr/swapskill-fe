'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import PostCard from '@/components/PostCard';
import Navbar from '@/components/Navbar'; // <--- IMPORT NAVBAR DI SINI

export default function PublicProfilePage() {
  const { id } = useParams();
  const [userData, setUserData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const [userRes, reviewsRes] = await Promise.all([
        api.get(`/users/${id}/profile`),
        api.get(`/users/${id}/reviews`).catch(() => ({ data: { data: [] } })),
      ]);

      setUserData(userRes.data.data);
      setPosts(userRes.data.data.history_posts || []);
      setReviews(reviewsRes.data.data || []);
    } catch (error) {
      console.error('Gagal memuat data user', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <>
        <Navbar /> {/* Tampilkan Navbar saat loading */}
        <div className="text-center mt-60 animate-pulse text-slate-500">
          Menelusuri profil...
        </div>
      </>
    );

  if (!userData)
    return (
      <>
        <Navbar /> {/* Tampilkan Navbar saat user tidak ditemukan */}
        <div className="text-center mt-20 text-white">
          User tidak ditemukan. 🏜️
        </div>
      </>
    );

  const avgRating = userData.received_reviews_avg_rating
    ? parseFloat(userData.received_reviews_avg_rating).toFixed(1)
    : '0.0';
  const totalReviews = userData.received_reviews_count || 0;

  return (
    <>
      <Navbar /> {/* <--- PASANG NAVBAR DI SINI */}
      <div className="max-w-4xl mx-auto mt-30 px-4 pb-20">
        {/* Header Profil Estetik */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-[2.5rem] p-8 mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -z-10"></div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar Besar */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl border-4 border-slate-800">
              {userData.name.charAt(0).toUpperCase()}
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
                {userData.name}
              </h1>
              <p className="text-slate-400 font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
                🎓 Mahasiswa Informatika •{' '}
                <span className="text-blue-400">
                  Join {new Date(userData.created_at).getFullYear()}
                </span>
              </p>

              {/* Badge Reputasi & Info */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                  ⭐ {avgRating} ({totalReviews} Ulasan)
                </span>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold uppercase tracking-widest">
                  {posts.length} Postingan
                </span>
                <span className="px-3 py-1 bg-slate-500/10 text-slate-400 border border-slate-500/20 rounded-full text-xs font-bold uppercase tracking-widest">
                  NIM: {userData.nim}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri: Postingan Aktif */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Postingan Aktif
              </h2>
              <div className="h-px flex-1 bg-slate-800"></div>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-16 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
                <p className="text-slate-500 italic">
                  Belum ada tawaran barter yang aktif.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={{ ...post, user: userData }} />
                ))}
              </div>
            )}
          </div>

          {/* Kolom Kanan: Ulasan & Reputasi */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Ulasan
              </h2>
              <div className="h-px flex-1 bg-slate-800"></div>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-10 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
                <p className="text-slate-500 italic text-sm">
                  Belum ada ulasan.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-white text-sm">
                        {review.reviewer?.name || 'User'}
                      </div>
                      <div className="flex text-amber-400 text-xs">
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
