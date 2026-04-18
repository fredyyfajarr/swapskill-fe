'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    whatsapp_number: '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const res = await api.get('/profile');
      setProfile({
        name: res.data.data.name,
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
      await api.put('/profile/update', profile);
      toast.success('Profil berhasil diperbarui!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui profil.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      return toast.error('Konfirmasi password baru tidak cocok.');
    }
    setIsSubmitting(true);
    try {
      await api.put('/profile/password', passwordData);
      toast.success('Password berhasil diganti!');
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
      <div className="text-center mt-20 text-slate-400 animate-pulse">
        Memuat pengaturan...
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 pb-20">
      <h1 className="text-3xl font-black text-white mb-8 tracking-tighter">
        ⚙️ Pengaturan Akun
      </h1>

      <div className="space-y-8">
        {/* Form Profil */}
        <section className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-6">Informasi Dasar</h2>
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
                Nomor WhatsApp (Aktif)
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: 08123456789"
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
            <input
              type="password"
              placeholder="Konfirmasi Password Baru"
              required
              className="w-full p-4 bg-slate-900/60 border border-slate-700 rounded-2xl text-white outline-none focus:border-blue-500 transition-all"
              value={passwordData.new_password_confirmation}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  new_password_confirmation: e.target.value,
                })
              }
            />
            <button
              disabled={isSubmitting}
              className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-2xl transition-all disabled:opacity-50"
            >
              Ganti Password
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
