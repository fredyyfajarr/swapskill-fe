import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Cek apakah ada token di Cookies
  const token = request.cookies.get('token')?.value;

  const path = request.nextUrl.pathname;

  // 2. Daftar halaman yang WAJIB LOGIN (Terproteksi)
  const isProtectedPath =
    path.startsWith('/dashboard') ||
    path.startsWith('/profile') ||
    path.startsWith('/users');

  // 3. Daftar halaman yang HARUS DIHINDARI kalau sudah login (Publik)
  const isPublicPath =
    path === '/login' || path === '/register' || path === '/';

  // LOGIKA PEMBLOKIRAN:

  // Jika belum login tapi maksa masuk halaman terproteksi -> Lempar ke Login
  if (!token && isProtectedPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika SUDAH login tapi mau buka halaman Landing/Login/Register -> Lempar ke Dashboard
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Jika aman, silakan lewat!
  return NextResponse.next();
}

// Tentukan rute mana saja yang mau dijaga oleh satpam ini
export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard/:path*',
    '/profile/:path*',
    '/users/:path*',
  ],
};
