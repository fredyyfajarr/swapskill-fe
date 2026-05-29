'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Zap, Eye, EyeOff, LogIn, ArrowRightLeft, Shield, Star } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
      const msg = error.response?.data?.message || 'Email atau password salah';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background overflow-hidden">
      {/* LEFT SIDE: Branding (Hidden on Mobile) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-center px-16 xl:px-20"
      >
        {/* UNPAM Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/foto-unpam.png"
            alt="UNPAM Background"
            className="w-full h-full object-cover opacity-[0.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              Swap<span className="gradient-text">Skill</span>
            </span>
          </Link>

          <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-6">
            Tukar Skill,<br />
            <span className="gradient-text">Tumbuh Bersama.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed mb-12">
            Platform eksklusif mahasiswa untuk bertukar keahlian tanpa biaya. Saling bantu, saling berkembang.
          </p>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <ArrowRightLeft size={18} className="text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Barter Adil</h4>
                <p className="text-xs text-slate-500">Saling bantu tanpa melibatkan uang.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Shield size={18} className="text-emerald-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Terverifikasi KTM</h4>
                <p className="text-xs text-slate-500">Komunitas aman & terpercaya.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Star size={18} className="text-amber-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Bangun Reputasi</h4>
                <p className="text-xs text-slate-500">Kumpulkan ulasan positif untuk karirmu.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-500/8 rounded-full blur-[100px] pointer-events-none lg:hidden" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="text-center mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Zap size={20} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Swap<span className="gradient-text">Skill</span></span>
            </Link>
          </div>

          <div className="glass-strong rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">Selamat Datang</h2>
              <p className="text-slate-500 text-sm">Masuk ke akun SwapSkill kamu</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="nama@email.com"
                  className="w-full bg-slate-900/50 border border-slate-700/30 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-900/50 border border-slate-700/30 text-white rounded-xl px-4 py-3 pr-12 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all btn-shine flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><LogIn size={16} /> Masuk</>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/5 text-center">
              <p className="text-slate-500 text-sm">
                Belum punya akun?{' '}
                <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Daftar Sekarang
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
