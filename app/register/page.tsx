'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Zap, Eye, EyeOff, Upload, FileCheck, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', password_confirmation: '', nim: '', whatsapp_number: '',
  });
  const [ktmFile, setKtmFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) router.push('/dashboard');
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      return toast.error('Konfirmasi password tidak cocok!');
    }
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (ktmFile) data.append('ktm', ktmFile);

    try {
      const response = await api.post('/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      localStorage.setItem('token', response.data.token);
      document.cookie = `token=${response.data.token}; path=/; max-age=86400`;
      toast.success('Registrasi Berhasil! Tunggu verifikasi admin.');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan saat mendaftar');
    } finally {
      setLoading(false);
    }
  };

  const isConfirming = formData.password_confirmation.length > 0;
  const passwordsMatch = formData.password === formData.password_confirmation;

  const inputClass = "w-full bg-slate-900/50 border border-slate-700/30 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600";

  return (
    <div className="min-h-screen bg-background bg-mesh flex items-center justify-center px-4 py-12">
      <div className="fixed top-20 right-20 w-72 h-72 bg-emerald-500/8 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-blue-500/6 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Swap<span className="gradient-text">Skill</span></span>
          </Link>
          <h1 className="text-xl font-bold text-white mb-1">Buat Akun Baru</h1>
          <p className="text-slate-500 text-sm">Hanya butuh 2 menit untuk mulai barter</p>
        </div>

        {/* Form Card */}
        <div className="glass-strong rounded-2xl p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Nama Lengkap</label>
                <input type="text" required placeholder="Sesuai KTM" className={inputClass}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Email</label>
                <input type="email" required placeholder="nama@email.com" className={inputClass}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">NIM</label>
                <input type="text" required placeholder="Nomor Induk Mahasiswa" className={inputClass}
                  onChange={(e) => setFormData({ ...formData, nim: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">WhatsApp</label>
                <input type="text" required placeholder="08123456789" className={inputClass}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} required placeholder="Min. 8 karakter"
                    className={`${inputClass} pr-10`}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Konfirmasi</label>
                <div className="relative">
                  <input type={showConfirmPassword ? 'text' : 'password'} required placeholder="Ulangi password"
                    className={`${inputClass} pr-10 ${isConfirming ? (passwordsMatch ? 'border-emerald-500/50' : 'border-red-500/50') : ''}`}
                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* KTM Upload */}
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block uppercase tracking-wider">Foto KTM (Verifikasi)</label>
              <div className="relative border-2 border-dashed border-slate-700/50 bg-slate-900/30 rounded-xl p-5 text-center hover:border-blue-500/30 hover:bg-slate-900/50 transition-all cursor-pointer group">
                <input
                  type="file" accept="image/jpeg,image/png,image/jpg" required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => setKtmFile(e.target.files?.[0] || null)}
                />
                {ktmFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileCheck size={20} className="text-emerald-400" />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-emerald-400">{ktmFile.name}</p>
                      <p className="text-xs text-slate-500">Ketuk untuk ganti</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-slate-400 transition-colors">
                    <Upload size={24} />
                    <p className="text-sm font-medium">Upload foto KTM</p>
                    <p className="text-xs text-slate-600">Max 2MB (JPG, PNG)</p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || (isConfirming && !passwordsMatch)}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all btn-shine flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><UserPlus size={16} /> Daftar Sekarang</>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="text-slate-500 text-sm">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Masuk</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
