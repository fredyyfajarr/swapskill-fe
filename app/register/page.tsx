'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    nim: '',
    whatsapp_number: '',
  });
  const [ktmFile, setKtmFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
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
      toast.error(
        error.response?.data?.message || 'Terjadi kesalahan saat mendaftar',
      );
    } finally {
      setLoading(false);
    }
  };

  const isConfirming = formData.password_confirmation.length > 0;
  const passwordsMatch = formData.password === formData.password_confirmation;

  return (
    <div className="min-h-screen w-full flex bg-[#0f172a] overflow-hidden">
      {/* SISI KIRI: Visual & Branding (Hidden on Mobile) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-[45%] relative flex-col justify-center px-16 bg-gradient-to-br from-emerald-900/80 via-slate-900 to-[#0f172a]"
      >
        {/* Background Foto UNPAM */}
        <div className="absolute inset-0 z-0">
          <img
            src="/foto-unpam.jpg"
            alt="UNPAM Background"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/80 to-transparent"></div>
        </div>

        <div className="relative z-10">
          <div className="text-3xl font-black text-white mb-6">
            Swap<span className="text-blue-500">Skill</span>
          </div>
          <h1 className="text-5xl font-black text-white leading-tight mb-6">
            Langkah Pertama <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Menuju Portofolio Hebat.
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed mb-12">
            Bergabunglah dengan ekosistem mahasiswa proaktif. Kami memverifikasi
            setiap pendaftar menggunakan KTM untuk menjaga komunitas yang aman
            dan terpercaya.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl border border-blue-500/30">
                🤝
              </div>
              <div>
                <h4 className="text-white font-bold">Barter Adil</h4>
                <p className="text-sm text-slate-500">
                  Saling bantu tanpa melibatkan uang.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-xl border border-emerald-500/30">
                ⭐
              </div>
              <div>
                <h4 className="text-white font-bold">Bangun Reputasi</h4>
                <p className="text-sm text-slate-500">
                  Kumpulkan ulasan positif untuk karirmu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* SISI KANAN: Form Registrasi (Scrollable) */}
      <div className="w-full lg:w-[55%] h-screen overflow-y-auto custom-scrollbar flex items-center justify-center p-6 relative">
        <div className="lg:hidden absolute top-[-10%] right-[-10%] w-64 h-64 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-xl bg-slate-800/40 backdrop-blur-2xl border border-slate-700/50 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-black/50 my-auto"
        >
          <div className="mb-8 lg:hidden text-center">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Swap<span className="text-blue-500">Skill</span>
            </h2>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
              Buat Akun Baru
            </h2>
            <p className="text-slate-400 text-sm">
              Hanya butuh 2 menit untuk mulai berkarya.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  placeholder="Sesuai KTM"
                  className="w-full p-3.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600 text-sm"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">
                  Email Kampus / Aktif
                </label>
                <input
                  type="email"
                  required
                  placeholder="nama@student.unpam.ac.id"
                  className="w-full p-3.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600 text-sm"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* NIM & WhatsApp */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">
                  NIM
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nomor Induk Mahasiswa"
                  className="w-full p-3.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600 text-sm"
                  onChange={(e) =>
                    setFormData({ ...formData, nim: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">
                  WhatsApp Aktif
                </label>
                <input
                  type="text"
                  required
                  placeholder="08123456789"
                  className="w-full p-3.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600 text-sm"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      whatsapp_number: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Password Set */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5 relative">
                <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimal 8 karakter"
                    className="w-full p-3.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600 text-sm"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Ulangi password"
                    className={`w-full p-3.5 bg-slate-900/60 border rounded-xl text-white outline-none transition-all placeholder:text-slate-600 text-sm ${
                      isConfirming
                        ? passwordsMatch
                          ? 'border-emerald-500 focus:border-emerald-500'
                          : 'border-red-500 focus:border-red-500'
                        : 'border-slate-700 focus:border-emerald-500'
                    }`}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password_confirmation: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </div>

            {/* Upload KTM Bergaya Premium */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">
                Verifikasi Mahasiswa (Foto KTM)
              </label>
              <div className="relative border-2 border-dashed border-slate-600 bg-slate-900/30 rounded-2xl p-6 text-center hover:bg-slate-900/60 hover:border-emerald-500/50 transition-colors group cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/jpg"
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => setKtmFile(e.target.files?.[0] || null)}
                />
                <div className="text-slate-400 group-hover:text-emerald-400 transition-colors">
                  {ktmFile ? (
                    <div className="flex flex-col items-center">
                      <span className="text-3xl mb-2">📸</span>
                      <p className="text-sm font-bold text-emerald-400">
                        {ktmFile.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Ketuk untuk mengganti file
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-3xl mb-2">📄</span>
                      <p className="text-sm font-semibold">
                        Ketuk untuk unggah file KTM
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Maksimal 2MB (JPG, PNG)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || (isConfirming && !passwordsMatch)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-4 rounded-xl transition-all shadow-xl shadow-emerald-900/20 disabled:opacity-50 mt-6 relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? 'Memproses Pendaftaran...' : 'Daftar Sekarang'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className="text-white font-bold hover:text-emerald-400 transition-colors underline underline-offset-4 decoration-emerald-500/30"
            >
              Masuk di sini
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
