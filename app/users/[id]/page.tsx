'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import PostCard from '@/components/PostCard';

export default function PublicProfilePage() {
  const { id } = useParams();
  const [userData, setUserData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserAndPosts();
  }, [id]);

  const fetchUserAndPosts = async () => {
    try {
      // Mengambil data user dan postingan mereka sekaligus
      const [userRes, postsRes] = await Promise.all([
        api.get(`/users/${id}`),
        api.get(`/posts?user_id=${id}`),
      ]);
      setUserData(userRes.data.data);
      setPosts(postsRes.data.data);
    } catch (error) {
      console.error('Gagal memuat profil user');
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-20 animate-pulse text-slate-500">
        Menelusuri profil...
      </div>
    );
  if (!userData)
    return (
      <div className="text-center mt-20 text-white">
        User tidak ditemukan. 🏜️
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 pb-20">
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

            {/* Badge Reputasi */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-widest">
                Sepuh Barter ⭐
              </span>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold uppercase tracking-widest">
                {posts.length} Postingan
              </span>
              <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold uppercase tracking-widest">
                NIM: {userData.nim}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Daftar Postingan User */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-slate-800"></div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Postingan Aktif
          </h2>
          <div className="h-px flex-1 bg-slate-800"></div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/10 rounded-3xl border border-dashed border-slate-700">
            <p className="text-slate-500 italic">
              User ini belum membuat tawaran barter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
