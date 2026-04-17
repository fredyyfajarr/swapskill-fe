import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// 1. IMPORT TOASTER DARI REACT-HOT-TOAST
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SwapSkill - Barter Keahlian Mahasiswa',
  description: 'Platform barter skill antar mahasiswa',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. PASANG TOASTER DI SINI (DENGAN TEMA DARK) */}
        <Toaster
          position="top-center"
          toastOptions={{
            // Desain bawaan untuk semua toast
            style: {
              background: '#1e293b', // Warna slate-800
              color: '#fff',
              border: '1px solid #334155', // Warna slate-700
              borderRadius: '16px',
            },
            // Desain khusus jika sukses
            success: {
              iconTheme: {
                primary: '#10b981', // Emerald 500
                secondary: '#fff',
              },
            },
            // Desain khusus jika error
            error: {
              iconTheme: {
                primary: '#ef4444', // Red 500
                secondary: '#fff',
              },
            },
          }}
        />

        {children}
      </body>
    </html>
  );
}
