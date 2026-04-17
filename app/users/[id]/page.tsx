'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/PostCard';
import ReviewModal from '@/components/ReviewModal';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function PublicProfile() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [profileRes, reviewRes] = await Promise.all([
        api.get(`/users/${id}/profile`),
        api.get(`/users/${id}/reviews`),
      ]);
      setUser(profileRes.data.data);
      setReviews(reviewRes.data.data);
    } catch (error) {
      toast.error('Gagal memuat profil.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (isLoading) return <div className="min-h-screen bg-[#0f172a]" />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-20 pt-28 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header Profil (Gunakan desain yang sama dengan profile/page.tsx) */}
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-5xl font-black">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-black text-white">{user?.name}</h1>
              <div className="flex justify-center md:justify-start gap-4 mt-4">
                <div className="text-center">
                  <p className="text-xs text-slate-500 font-bold uppercase">
                    Reputasi
                  </p>
                  <p className="text-xl font-bold text-yellow-500">
                    ⭐{' '}
                    {Number(user?.received_reviews_avg_rating || 0).toFixed(1)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500 font-bold uppercase">
                    Ulasan
                  </p>
                  <p className="text-xl font-bold text-white">
                    {user?.received_reviews_count || 0}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsReviewOpen(true)}
                className="mt-6 px-6 py-2 bg-yellow-500 text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-all"
              >
                ⭐ Beri Ulasan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Daftar Skill */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Keahlian</h2>
              <div className="flex flex-wrap gap-2">
                {user?.skills?.map((s: any) => (
                  <span
                    key={s.id}
                    className="px-3 py-1 bg-slate-800 rounded-lg border border-slate-700 text-sm"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Daftar Ulasan */}
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-white">Apa kata mereka?</h2>
              {reviews.length > 0 ? (
                reviews.map((r: any) => (
                  <div
                    key={r.id}
                    className="bg-slate-800/20 border border-slate-700/30 rounded-2xl p-6"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-blue-400">
                        {r.reviewer.name}
                      </span>
                      <span className="text-yellow-500">
                        {'★'.repeat(r.rating)}
                      </span>
                    </div>
                    <p className="text-slate-400 italic">"{r.comment}"</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 italic">
                  Belum ada ulasan untuk mahasiswa ini.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        revieweeId={user?.id}
        revieweeName={user?.name}
        onSuccess={fetchData}
      />
    </>
  );
}
