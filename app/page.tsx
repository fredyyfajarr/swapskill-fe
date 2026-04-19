'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const skills = [
    '🚀 Laravel 13',
    '⚛️ Next.js 16',
    '🎨 UI/UX Design',
    '📱 Flutter',
    '🐍 Python',
    '📸 Photography',
    '✍️ Copywriting',
    '📊 Digital Marketing',
    '🎬 Video Editing',
    '🛠️ Web Development',
    '💡 Business Strategy',
  ];

  const stats = [
    { label: 'Mahasiswa Bergabung', value: '500+' },
    { label: 'Tawaran Barter', value: '1,200+' },
    { label: 'Kepuasan User', value: '4.9/5' },
  ];

  const faqs = [
    {
      q: 'Bagaimana jika saya belum ahli di suatu bidang?',
      a: "Tidak masalah! Barter skill tidak selalu tentang tingkat 'expert'. Kamu bisa menawarkan bantuan dasar seperti input data, transkrip, atau bantuan tugas umum lainnya.",
    },
    {
      q: 'Apakah data nomor WhatsApp saya aman?',
      a: 'Nomor WhatsApp hanya akan ditampilkan kepada pengguna yang sudah login untuk memfasilitasi komunikasi barter. Kami menyarankan untuk tetap berhati-hati saat berinteraksi.',
    },
    {
      q: 'Apakah platform ini benar-benar gratis?',
      a: '100% Gratis. Misi utama SwapSkill adalah membantu mahasiswa berkembang tanpa terkendala biaya.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 overflow-x-hidden relative">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="relative z-30 flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-black text-white tracking-tight">
          Swap<span className="text-blue-500">Skill</span>
        </div>
        <div className="flex gap-4 items-center">
          <Link
            href="/login"
            className="text-sm font-bold text-slate-300 hover:text-white transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full transition-all shadow-lg shadow-blue-900/50"
          >
            Daftar
          </Link>
        </div>
      </nav>

      {/* 1. Hero Section with UNPAM Background */}
      <header className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/unpam.jpg"
            alt="UNPAM Background"
            className="w-full h-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/50 via-transparent to-[#0f172a]"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-semibold text-blue-400 backdrop-blur-md">
            🚀 Platform Kolaborasi Mahasiswa #1 di Kampus
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight mb-8 leading-[1.1]">
            Upgrade Skill <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
              Tanpa Keluar Uang.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Butuh bantuan coding? Tawarkan desainmu. SwapSkill memudahkan
            mahasiswa barter keahlian untuk bangun portofolio dan relasi
            profesional.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href="/register"
              className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold rounded-2xl shadow-2xl shadow-blue-600/20 transition-all transform hover:-translate-y-1"
            >
              Mulai Barter Sekarang
            </Link>
            <Link
              href="#cara-kerja"
              className="px-10 py-5 bg-slate-800/50 hover:bg-slate-800 text-white border border-slate-700/50 text-lg font-bold rounded-2xl transition-all backdrop-blur-sm"
            >
              Lihat Cara Kerja
            </Link>
          </div>
        </motion.div>
      </header>

      {/* 2. Stats Section */}
      <section className="relative z-10 py-12 border-y border-slate-800/50 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {stats.map((stat, idx) => (
            <div key={idx}>
              <h3 className="text-4xl font-black text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Skill Marquee (Scrolling Badges) */}
      <section className="py-16 overflow-hidden">
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
          {[...skills, ...skills].map((skill, i) => (
            <span
              key={i}
              className="px-6 py-3 bg-slate-800/40 border border-slate-700/50 rounded-2xl text-slate-300 font-bold text-sm backdrop-blur-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* 4. Feature Bento Grid */}
      <section id="cara-kerja" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
            Kenapa Harus SwapSkill?
          </h2>
          <p className="text-slate-400">
            Dirancang khusus untuk ekosistem mahasiswa yang haus ilmu tapi minim
            budget.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
          <div className="md:col-span-3 bg-gradient-to-br from-blue-600/20 to-indigo-600/5 border border-slate-700/50 rounded-[2.5rem] p-10 flex flex-col justify-end">
            <div className="text-4xl mb-6">🤝</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Simulasi Barter Adil
            </h3>
            <p className="text-slate-400">
              Tukar jasa desain logo dengan jasa setup database. Adil,
              transparan, dan saling menguntungkan.
            </p>
          </div>
          <div className="md:col-span-3 bg-slate-800/40 border border-slate-700/50 rounded-[2.5rem] p-10 flex flex-col justify-end">
            <div className="text-4xl mb-6">⭐</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Sistem Reputasi
            </h3>
            <p className="text-slate-400">
              Bangun reputasimu melalui ulasan bintang 5 dari teman sejawat
              setelah berhasil membantu mereka.
            </p>
          </div>
          <div className="md:col-span-2 bg-slate-800/40 border border-slate-700/50 rounded-[2.5rem] p-10 flex flex-col justify-end">
            <div className="text-4xl mb-6">🛡️</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Terverifikasi NIM
            </h3>
            <p className="text-slate-400">
              Hanya untuk mahasiswa asli dengan verifikasi NIM yang ketat.
            </p>
          </div>
          <div className="md:col-span-4 bg-gradient-to-r from-emerald-600/20 to-teal-600/5 border border-slate-700/50 rounded-[2.5rem] p-10 flex flex-col justify-center">
            <h3 className="text-3xl font-black text-white mb-4 leading-tight">
              Siap Bangun Portofolio <br /> Bersama Ribuan Mahasiswa?
            </h3>
            <Link
              href="/register"
              className="w-fit px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Join Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-black text-white mb-12 text-center">
          Testimoni Pengguna
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center text-center">
            <img
              src="/images/user1.jpg"
              alt="User 1"
              className="w-20 h-20 mb-2 rounded-full"
            />

            <h3 className="text-lg font-bold text-white">Rina, 20</h3>
            <p className="text-slate-400 text-sm">
              "Dulu saya kesulitan cari bantuan coding, sekarang bisa barter
              dengan teman yang jago desain. Portofolio saya jadi makin keren!"
            </p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center text-center">
            <img
              src="/images/user2.jpg"
              alt="User 2"
              className="w-20 h-20 mb-2 rounded-full"
            />
            <h3 className="text-lg font-bold text-white">Dimas, 22</h3>
            <p className="text-slate-400 text-sm">
              "Awalnya ragu, tapi setelah coba ternyata seru banget! Bisa
              belajar skill baru tanpa keluar uang."
            </p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center text-center">
            <img
              src="/images/user3.jpg"
              alt="User 3"
              className="w-20 h-20 mb-2 rounded-full"
            />
            <h3 className="text-lg font-bold text-white">Eka, 21</h3>
            <p className="text-slate-400 text-sm">
              "Platform yang sangat membantu untuk mahasiswa seperti saya yang
              ingin belajar banyak hal tanpa harus khawatir soal biaya."
            </p>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section className="py-24 max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-black text-white mb-12 text-center">
          Tanya Jawab
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-slate-800 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full p-6 text-left flex justify-between items-center bg-slate-800/20 hover:bg-slate-800/40 transition-colors"
              >
                <span className="font-bold text-white">{faq.q}</span>
                <span
                  className={`text-blue-500 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`}
                >
                  ▼
                </span>
              </button>
              {activeFaq === i && (
                <div className="p-6 bg-slate-900/50 text-slate-400 text-sm leading-relaxed border-t border-slate-800">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 text-center">
        <div className="text-xl font-black text-white mb-4">
          Swap<span className="text-blue-500">Skill</span>
        </div>
        <p className="text-slate-500 text-sm italic mb-4">
          "Dari Mahasiswa, Oleh Mahasiswa, Untuk Mahasiswa."
        </p>
        <p className="text-slate-600 text-xs tracking-widest uppercase font-bold">
          &copy; {new Date().getFullYear()} KELOMPOK KUPU-KUPU UNPAM
        </p>
      </footer>

      {/* Animasi Marquee CSS */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: flex;
          width: fit-content;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
