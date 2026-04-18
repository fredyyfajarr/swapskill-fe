import React from 'react';

interface PostCardProps {
  post: {
    id: number;
    description: string;
    user: { name: string; id: number; whatsapp_number: string };
    needed_skill: { name: string };
    offered_skill: { name: string };
    created_at: string;
  };
}

export default function PostCard({ post }: PostCardProps) {
  // 1. Fungsi merapikan nomor WA (mengubah 08... menjadi 628...)
  const formatWhatsAppNumber = (number: string) => {
    if (!number) return '';
    let formatted = number.replace(/\D/g, ''); // Hapus semua karakter non-angka
    if (formatted.startsWith('0')) {
      formatted = '62' + formatted.substring(1);
    }
    return formatted;
  };

  const waNumber = formatWhatsAppNumber(post.user?.whatsapp_number);

  // 2. Membuat pesan otomatis (URL Encoded agar spasi menjadi format link)
  const waMessage = encodeURIComponent(
    `Halo ${post.user?.name}, salam kenal! 👋\n\nSaya lihat tawaranmu di *SwapSkill*.\nSaya tertarik untuk dibantu *${post.offered_skill?.name}*, dan sebagai gantinya saya bisa bantu kamu soal *${post.needed_skill?.name}*.\n\nBoleh kita diskusi lebih lanjut?`,
  );

  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

  // Mengubah format tanggal sederhana
  const formattedDate = new Date(post.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    // TAMBAHAN: flex flex-col h-full agar tinggi kartu seragam
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 transition-all hover:border-slate-600 hover:shadow-xl hover:shadow-black/20 group flex flex-col h-full">
      {/* Header Info User & Tanggal */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
            {post.user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-white font-semibold">{post.user?.name}</h3>
            <p className="text-slate-400 text-xs">{formattedDate}</p>
          </div>
        </div>
      </div>

      {/* Bagian Pertukaran Skill */}
      <div className="bg-slate-900/50 rounded-xl p-4 mb-4 border border-slate-800 flex flex-col md:flex-row items-center gap-4 text-sm">
        <div className="flex-1 w-full text-center md:text-left">
          <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">
            Butuh Bantuan
          </p>
          <span className="inline-block bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-lg font-medium">
            {post.needed_skill?.name}
          </span>
        </div>

        <div className="hidden md:flex text-slate-500">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            ></path>
          </svg>
        </div>

        <div className="flex-1 w-full text-center md:text-right">
          <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">
            Menawarkan
          </p>
          <span className="inline-block bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg font-medium">
            {post.offered_skill?.name}
          </span>
        </div>
      </div>

      {/* Deskripsi */}
      {/* TAMBAHAN: flex-grow agar sisa ruang kosong mendorong tombol ke bawah */}
      <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-grow">
        "{post.description}"
      </p>

      {/* Tombol Aksi WhatsApp */}
      {/* TAMBAHAN: mt-auto untuk nempel di bawah, dan w-full & justify-center agar melebar penuh */}
      <div className="mt-auto pt-4 border-t border-slate-700/50">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-3 rounded-xl font-medium transition-transform transform hover:-translate-y-0.5 shadow-lg shadow-green-900/20"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
          Chat via WhatsApp
        </a>
      </div>
    </div>
  );
}
