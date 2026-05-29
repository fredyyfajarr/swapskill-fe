'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Users, Shield, MessageCircle, Zap, ChevronRight, Star } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <ArrowRightLeft size={24} />,
      title: 'Barter Skill',
      desc: 'Tukar keahlianmu dengan mahasiswa lain. Tidak perlu biaya — cukup saling berbagi ilmu.',
      color: 'from-blue-500 to-blue-600',
      glow: 'shadow-blue-500/20',
    },
    {
      icon: <Shield size={24} />,
      title: 'Terverifikasi KTM',
      desc: 'Semua pengguna diverifikasi melalui KTM. Hanya mahasiswa asli yang bisa bertransaksi.',
      color: 'from-emerald-500 to-emerald-600',
      glow: 'shadow-emerald-500/20',
    },
    {
      icon: <MessageCircle size={24} />,
      title: 'Chat In-App',
      desc: 'Komunikasi langsung di dalam aplikasi. Diskusi kebutuhan barter tanpa pindah platform.',
      color: 'from-purple-500 to-purple-600',
      glow: 'shadow-purple-500/20',
    },
    {
      icon: <Star size={24} />,
      title: 'Sistem Reputasi',
      desc: 'Beri dan terima ulasan setelah selesai barter. Reputasi tinggi = kepercayaan lebih.',
      color: 'from-amber-500 to-amber-600',
      glow: 'shadow-amber-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-background bg-mesh text-foreground overflow-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Swap<span className="gradient-text">Skill</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white font-medium transition-colors px-4 py-2">
              Masuk
            </Link>
            <Link href="/register" className="text-sm bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-5 py-2 rounded-xl shadow-lg shadow-blue-500/20 btn-shine transition-all hover:shadow-blue-500/30">
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-4">
        {/* UNPAM Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/foto-unpam.png"
            alt="UNPAM Background"
            className="w-full h-full object-cover opacity-[0.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>

        {/* Background orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/8 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px]" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-8">
              <Zap size={12} /> Platform Barter Skill #1 untuk Mahasiswa
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 tracking-tight">
              Tukar Skill,{' '}
              <span className="gradient-text">Tumbuh Bersama</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Platform eksklusif mahasiswa untuk bertukar keahlian. Kamu jago ngoding? Tukar dengan desain. Jago statistik? Tukar dengan bahasa Inggris.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/25 btn-shine transition-all text-lg"
              >
                Mulai Barter
                <ChevronRight size={20} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 glass text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all text-lg"
              >
                Sudah Punya Akun
              </Link>
            </div>
          </motion.div>

          {/* STATS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center gap-8 md:gap-16 mt-16"
          >
            {[
              { value: '100+', label: 'Mahasiswa' },
              { value: '7', label: 'Kategori Skill' },
              { value: '24/7', label: 'Akses Platform' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-slate-500 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Kenapa SwapSkill?</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Platform yang dirancang khusus untuk kebutuhan mahasiswa</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 hover-glow transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white shadow-lg ${f.glow} mb-4 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Cara Kerja</h2>
            <p className="text-slate-400 text-lg">3 langkah mudah untuk mulai barter</p>
          </motion.div>

          <div className="space-y-6">
            {[
              { step: '01', title: 'Buat Tawaran', desc: 'Posting skill yang kamu butuhkan dan yang bisa kamu tawarkan.' },
              { step: '02', title: 'Ajukan Barter', desc: 'Temukan tawaran yang cocok dan kirim pengajuan barter.' },
              { step: '03', title: 'Mulai Belajar', desc: 'Setelah diterima, chat dan mulai bertukar ilmu bersama!' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass rounded-2xl p-6 flex items-start gap-5 hover-glow transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-lg shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-strong rounded-3xl p-10 md:p-16 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-emerald-500/5" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Siap Mulai <span className="gradient-text">Barter?</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                Bergabung dengan komunitas mahasiswa yang saling berbagi ilmu
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold px-10 py-4 rounded-2xl shadow-xl shadow-blue-500/25 btn-shine transition-all text-lg hover:shadow-blue-500/40"
              >
                Daftar Sekarang — Gratis
                <ChevronRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="text-sm font-bold text-slate-500">SwapSkill</span>
          </div>
          <p className="text-xs text-slate-600">© 2026 SwapSkill. Platform Barter Skill Mahasiswa.</p>
        </div>
      </footer>
    </div>
  );
}
