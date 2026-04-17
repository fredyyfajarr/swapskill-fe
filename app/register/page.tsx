'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      toast.error(error.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Latar Belakang Navy Gradient
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Card bergaya Glassmorphism */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Swap<span className="text-blue-400">Skill</span>
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Daftar untuk mulai barter keahlian
          </p>
        </div>

        {/* Input Fields - Menggunakan style transparan dengan border tipis */}
        <input
          type="text"
          placeholder="Nama Lengkap"
          required
          className="w-full p-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email Mahasiswa"
          required
          className="w-full p-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="NIM"
            required
            className="w-full p-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
          />
          <input
            type="text"
            placeholder="No. WhatsApp"
            required
            className="w-full p-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            onChange={(e) =>
              setFormData({ ...formData, whatsapp_number: e.target.value })
            }
          />
        </div>

        <input
          type="password"
          placeholder="Password"
          required
          className="w-full p-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Konfirmasi Password"
          required
          className="w-full p-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          onChange={(e) =>
            setFormData({ ...formData, password_confirmation: e.target.value })
          }
        />

        <div className="space-y-2 pt-2">
          <label className="text-sm font-medium text-slate-300">
            Upload KTM (JPG/PNG)
          </label>
          <input
            type="file"
            accept="image/*"
            required
            className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer border border-slate-600 rounded-lg bg-slate-900/50 p-2"
            onChange={(e) => setKtmFile(e.target.files?.[0] || null)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-500 disabled:bg-slate-600 disabled:text-slate-400 transition-all shadow-lg mt-4"
        >
          {loading ? 'Memproses...' : 'Daftar Sekarang'}
        </button>

        <p className="text-center text-sm text-slate-400 mt-4">
          Sudah punya akun?{' '}
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Login di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
