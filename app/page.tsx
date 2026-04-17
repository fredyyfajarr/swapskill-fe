import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 overflow-hidden relative">
      {/* Background Ornamen (Glowing Blur) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Navbar Simple untuk Landing Page */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto">
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
            className="text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full transition-all shadow-lg shadow-blue-900/50"
          >
            Daftar Gratis
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-20 pb-32 px-4 text-center max-w-5xl mx-auto">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-slate-800/50 border border-slate-700/50 text-sm font-medium text-emerald-400 backdrop-blur-sm">
          🚀 Solusi Kolaborasi Mahasiswa #1
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 leading-tight">
          Tukar Keahlian, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Bukan Uang.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Platform revolusioner bagi mahasiswa untuk saling barter *skill*.
          Butuh bantuan *coding*? Tawarkan keahlian desainmu sebagai gantinya.
          Bangun portofolio dan relasi tanpa keluar biaya.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/register"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-lg font-bold rounded-2xl shadow-xl hover:shadow-blue-500/25 transition-all transform hover:-translate-y-1"
          >
            Mulai Barter Sekarang
          </Link>
          <Link
            href="#cara-kerja"
            className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/50 text-lg font-bold rounded-2xl transition-all backdrop-blur-sm"
          >
            Lihat Cara Kerja
          </Link>
        </div>
      </main>

      {/* Cara Kerja Section */}
      <section
        id="cara-kerja"
        className="relative z-10 bg-slate-900/50 border-t border-slate-800 py-24"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Bagaimana SwapSkill Bekerja?
            </h2>
            <p className="text-slate-400">
              Tiga langkah mudah untuk mendapatkan bantuan tanpa dompet tipis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-sm hover:bg-slate-800/60 transition-colors">
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-blue-500/30">
                👤
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                1. Buat Profil
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Daftar dan cantumkan keahlian (portfolio) yang kamu kuasai saat
                ini. Jadikan profilmu menarik.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-sm hover:bg-slate-800/60 transition-colors relative">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-emerald-500/30">
                📢
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                2. Buat Tawaran
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Posting apa yang sedang kamu butuhkan, dan beritahu apa yang
                bisa kamu berikan sebagai imbalannya.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-sm hover:bg-slate-800/60 transition-colors">
              <div className="w-14 h-14 bg-yellow-500/20 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-yellow-500/30">
                🤝
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                3. Deal & Rating
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Chat via WhatsApp, kerjakan bareng, dan saling berikan ulasan
                bintang 5 untuk membangun reputasi!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 py-8 text-center bg-[#0f172a]">
        <p className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} SwapSkill. Dibuat dengan 💻 untuk
          Mahasiswa.
        </p>
      </footer>
    </div>
  );
}
