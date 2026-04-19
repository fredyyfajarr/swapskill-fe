'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      localStorage.setItem('token', response.data.token);
      document.cookie = `token=${response.data.token}; path=/; max-age=86400`;
      toast.success('Selamat datang kembali!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error('Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0f172a] overflow-hidden">
      {/* SISI KIRI: Visual & Branding (Hidden on Mobile) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-center px-20 bg-gradient-to-br from-blue-900 via-slate-900 to-[#0f172a]"
      >
        {/* Background Foto UNPAM dengan Opacity Tipis */}
        <div className="absolute inset-0 z-0">
          <img
            src="/foto-unpam.jpg"
            alt="UNPAM Background"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10">
          <div className="text-3xl font-black text-white mb-6">
            Swap<span className="text-blue-500">Skill</span>
          </div>
          <h1 className="text-5xl font-black text-white leading-tight mb-6">
            Lanjutkan Perjalanan <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Barter Keahlianmu.
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Masuk untuk terhubung kembali dengan ratusan mahasiswa lainnya dan
            mulai kolaborasi tanpa biaya.
          </p>

          <div className="mt-12 flex items-center gap-4 text-sm text-slate-500 font-medium">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#0f172a] bg-slate-700 flex items-center justify-center text-[10px] text-white"
                >
                  U{i}
                </div>
              ))}
            </div>
            <span>Bergabung dengan 500+ mahasiswa aktif</span>
          </div>
        </div>
      </motion.div>

      {/* SISI KANAN: Form Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        {/* Glowing Ornaments for Mobile Background */}
        <div className="lg:hidden absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-slate-800/40 backdrop-blur-2xl border border-slate-700/50 p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-black/50"
        >
          <div className="mb-10 lg:hidden text-center">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Swap<span className="text-blue-500">Skill</span>
            </h2>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
              Selamat Datang
            </h2>
            <p className="text-slate-400">Silakan masukkan detail akunmu.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 ml-1">
                Email Mahasiswa
              </label>
              <input
                type="email"
                placeholder="nama@student.unpam.ac.id"
                required
                className="w-full p-4 bg-slate-900/60 border border-slate-700 rounded-2xl text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-slate-400">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs text-blue-500 hover:underline"
                >
                  Lupa Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  className="w-full p-4 bg-slate-900/60 border border-slate-700 rounded-2xl text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold p-4 rounded-2xl transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50 mt-4 relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? 'Sedang Masuk...' : 'Masuk Sekarang'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="text-white font-bold hover:text-blue-400 transition-colors underline underline-offset-4 decoration-blue-500/30"
            >
              Daftar Gratis
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
