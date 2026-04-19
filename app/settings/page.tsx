'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar'; // Import Navbar

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    nim: '',
    whatsapp_number: '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '', // Nama field disesuaikan untuk Laravel 'confirmed'
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const res = await api.get('/profile');
      setProfile({
        name: res.data.data.name,
        nim: res.data.data.nim,
        whatsapp_number: res.data.data.whatsapp_number,
      });
    } catch (error) {
      toast.error('Gagal memuat data profil.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put('/profile', profile); // Endpoint sesuai routes/api.php
      toast.success('Profil berhasil diperbarui!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui profil.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Pastikan payload sesuai dengan aturan 'confirmed' di Laravel
      await api.put('/profile/password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation,
      });

      toast.success('Password berhasil diganti!');
      // Reset form
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal mengganti password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <>
        <Navbar />
        <div className="text-center mt-30 text-slate-400 animate-pulse">
          Memuat pengaturan...
        </div>
      </>
    );

  const isConfirming = passwordData.new_password_confirmation.length > 0;
  const passwordsMatch =
    passwordData.new_password === passwordData.new_password_confirmation;

  return (
    <>
      <Navbar /> {/* Tambahkan Navbar di sini */}
      <div className="max-w-2xl mx-auto mt-10 px-4 pb-20">
        <h1 className="text-3xl font-black text-white mb-8 tracking-tighter">
          ⚙️ Pengaturan Akun
        </h1>

        <div className="space-y-8">
          {/* Form Profil */}
          <section className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-6">
              Informasi Dasar
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-400 ml-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-4 bg-slate-900/60 border border-slate-700 rounded-2xl text-white outline-none focus:border-blue-500 transition-all"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-400 ml-1">
                  NIM
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-4 bg-slate-900/60 border border-slate-700 rounded-2xl text-white outline-none focus:border-blue-500 transition-all"
                  value={profile.nim}
                  onChange={(e) =>
                    setProfile({ ...profile, nim: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-400 ml-1">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-4 bg-slate-900/60 border border-slate-700 rounded-2xl text-white outline-none focus:border-blue-500 transition-all"
                  value={profile.whatsapp_number}
                  onChange={(e) =>
                    setProfile({ ...profile, whatsapp_number: e.target.value })
                  }
                />
              </div>
              <button
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
              >
                Simpan Perubahan
              </button>
            </form>
          </section>

          {/* Form Password */}
          <section className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-6">
              Keamanan Password
            </h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <input
                type="password"
                placeholder="Password Saat Ini"
                required
                className="w-full p-4 bg-slate-900/60 border border-slate-700 rounded-2xl text-white outline-none focus:border-blue-500 transition-all"
                value={passwordData.current_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    current_password: e.target.value,
                  })
                }
              />
              <input
                type="password"
                placeholder="Password Baru"
                required
                className="w-full p-4 bg-slate-900/60 border border-slate-700 rounded-2xl text-white outline-none focus:border-blue-500 transition-all"
                value={passwordData.new_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    new_password: e.target.value,
                  })
                }
              />
              <div className="space-y-1">
                <input
                  type="password"
                  placeholder="Konfirmasi Password Baru"
                  required
                  // Class border dinamis berdasarkan state kecocokan
                  className={`w-full p-4 bg-slate-900/60 border rounded-2xl text-white outline-none transition-all ${
                    isConfirming
                      ? passwordsMatch
                        ? 'border-emerald-500 focus:border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'border-red-500 focus:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                      : 'border-slate-700 focus:border-blue-500'
                  }`}
                  value={passwordData.new_password_confirmation}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      new_password_confirmation: e.target.value,
                    })
                  }
                />

                {/* Pesan Validasi di bawah input */}
                {isConfirming && !passwordsMatch && (
                  <p className="text-red-400 text-xs font-medium ml-2 animate-pulse">
                    ⚠️ Konfirmasi password tidak cocok.
                  </p>
                )}
                {isConfirming && passwordsMatch && (
                  <p className="text-emerald-400 text-xs font-medium ml-2">
                    ✅ Password sudah cocok!
                  </p>
                )}
              </div>

              {/* Tombol otomatis disable jika password belum cocok */}
              <button
                disabled={isSubmitting || (isConfirming && !passwordsMatch)}
                className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ganti Password
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
