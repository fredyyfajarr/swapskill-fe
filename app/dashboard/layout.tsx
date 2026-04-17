import Navbar from '@/components/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0f172a] relative">
      {/* Background aksen asimetris biar nggak membosankan */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <Navbar />

      {/* Konten halaman akan di-render di sini, didorong ke bawah agar tidak tertutup navbar */}
      <main className="pt-32 pb-12 relative">{children}</main>
    </div>
  );
}
