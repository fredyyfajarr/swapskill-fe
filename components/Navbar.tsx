'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ConfirmModal from './ConfirmModal';
import NotificationBell from './NotificationBell';
import api from '@/lib/axios';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const router = useRouter();

  const executeLogout = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    toast.success('Berhasil keluar. Sampai jumpa lagi!');
    setIsLogoutModalOpen(false);
    router.push('/');
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    setIsLogoutModalOpen(true);
  };

  return (
    <>
      <nav className="fixed top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <div className="relative w-full max-w-5xl bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 sm:px-6 py-3 flex justify-between items-center shadow-[0_8px_30px_rgb(0,0,0,0.4)] pointer-events-auto transition-all">
          {' '}
          {/* --- 1. LOGO TYPOGRAPHY AWAL --- */}
          <Link
            href="/dashboard"
            className="text-2xl font-black tracking-tighter text-white z-50 relative"
          >
            Swap<span className="text-blue-500">Skill</span>
            <span className="absolute -top-1 -right-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          </Link>
          {/* --- 2. KELOMPOK KANAN (LONCENG & MENU) --- */}
          <div className="flex items-center gap-3 sm:gap-5 z-50 relative">
            {/* Komponen Lonceng Notifikasi */}
            <NotificationBell />

            {/* Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative w-10 h-10 flex flex-col justify-center items-center group outline-none"
            >
              <span
                className={`block w-6 h-[2px] bg-white rounded-full transition-transform duration-300 ease-in-out origin-center ${isOpen ? 'translate-y-[7px] rotate-45' : '-translate-y-1'}`}
              ></span>
              <span
                className={`block w-6 h-[2px] bg-white rounded-full transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-0' : 'opacity-100'}`}
              ></span>
              <span
                className={`block w-6 h-[2px] bg-white rounded-full transition-transform duration-300 ease-in-out origin-center ${isOpen ? '-translate-y-[7px] -rotate-45' : 'translate-y-1'}`}
              ></span>
            </button>
          </div>
          {/* Dropdown Menu (Profil & Logout) */}
          <div
            className={`absolute top-full right-0 mt-4 w-56 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-2 transition-all duration-300 origin-top-right ${isOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}
          >
            <div className="flex flex-col gap-1">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-left"
              >
                🧑‍💻 Lihat Profil Saya
              </Link>
              <div className="h-px w-full bg-slate-700/50 my-1"></div>
              <button
                onClick={handleLogoutClick}
                className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 font-bold rounded-xl transition-colors"
              >
                Keluar / Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={executeLogout}
        title="Keluar dari SwapSkill?"
        message="Apakah kamu yakin ingin keluar? Kamu harus login kembali nanti untuk melihat tawaran barter."
        confirmText="Ya, Keluar"
        type="danger"
      />
    </>
  );
}
