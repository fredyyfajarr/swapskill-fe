# SwapSkill Frontend

Frontend web untuk SwapSkill, aplikasi barter keahlian mahasiswa. Aplikasi ini menyediakan landing page, autentikasi, dashboard skill board, profil, bookmark, review, notifikasi, dan pengaturan akun.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Axios
- Framer Motion
- React Hot Toast
- ESLint 9

## Fitur Utama

- Landing page SwapSkill.
- Register dan login mahasiswa.
- Token-based auth menggunakan backend Laravel Sanctum.
- Dashboard skill board dengan search, filter skill, bookmark, rekomendasi barter, dan load more.
- Buat tawaran barter berdasarkan skill yang dibutuhkan dan skill yang ditawarkan.
- Review partner barter.
- Profil sendiri dengan portofolio skill dan riwayat tawaran.
- Profil publik user lain.
- Notification bell untuk aktivitas seperti bookmark dan review.
- Settings untuk update profil dan password.

## Struktur Project

Project mulai diarahkan ke arsitektur feature-based yang sejalan dengan Clean Architecture pragmatis di frontend:

```text
app/                         # Route dan page Next.js
components/                  # Komponen UI reusable
features/
├── bookmarks/               # Infrastruktur bookmark
├── posts/                   # Domain type dan repository post
├── reviews/                 # Infrastruktur review
├── shared/                  # Shared infrastructure, seperti API client
├── skills/                  # Domain type dan repository skill
└── users/                   # Domain type dan repository user/profile
lib/                         # Compatibility export untuk API client lama
public/                      # Asset statis
```

Pedoman singkat:

- Page dan component fokus ke UI dan state interaksi.
- API call diletakkan di `features/*/infrastructure`.
- Type/domain model diletakkan di `features/*/domain`.
- Axios client bersama ada di `features/shared/infrastructure/http/apiClient.ts`.
- `lib/axios.ts` tetap ada sebagai compatibility layer untuk kode lama.

## Instalasi Lokal

Clone repo:

```bash
git clone https://github.com/fredyyfajarr/swapskill-fe.git
cd swapskill-fe
```

Install dependency:

```bash
npm install
```

Buat file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Jalankan development server:

```bash
npm run dev
```

Frontend default berjalan di:

```text
http://localhost:3000
```

## Backend yang Dibutuhkan

Frontend ini membutuhkan backend SwapSkill:

```text
https://github.com/fredyyfajarr/swapskill-be
```

Backend lokal biasanya berjalan di:

```text
http://127.0.0.1:8000
```

Pastikan `.env.local` frontend mengarah ke endpoint API backend:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

## Akun Test Lokal

Jika backend dijalankan dengan seeder terbaru, gunakan akun:

```text
email: test@swapskill.test
password: password
```

Akun ini sudah verified sehingga bisa langsung mengakses dashboard.

## Script

```bash
npm run dev      # menjalankan development server
npm run build    # build production
npm run start    # menjalankan hasil build
npm run lint     # menjalankan ESLint
```

Di Windows PowerShell, jika `npm` terkena execution policy, gunakan:

```powershell
npm.cmd run dev
npm.cmd run build
npm.cmd run lint
```

## Alur Development Lokal

1. Jalankan backend Laravel di `http://127.0.0.1:8000`.
2. Pastikan frontend punya `.env.local` dengan `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api`.
3. Jalankan frontend dengan `npm run dev`.
4. Buka `http://localhost:3000`.
5. Login menggunakan akun test atau akun hasil register.

## Catatan Next.js 16

Project menggunakan Next.js 16. Perhatikan perubahan konvensi terbaru, termasuk warning bahwa `middleware.ts` mulai diarahkan ke konvensi `proxy`. Saat ini file `middleware.ts` masih dipakai untuk proteksi route sesuai kondisi project.

## Deploy

Untuk deploy frontend, set environment variable berikut di platform hosting:

```env
NEXT_PUBLIC_API_URL=https://domain-backend-kamu.com/api
```

Lalu jalankan build production:

```bash
npm run build
```

Pastikan backend mengizinkan origin frontend melalui konfigurasi CORS Laravel.