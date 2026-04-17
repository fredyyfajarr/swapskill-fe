import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: 'application/json',
    // Jangan gunakan withCredentials: true di sini
  },
});

// Interceptor untuk otomatis memasukkan Token jika sudah login
api.interceptors.request.use((config) => {
  // Kita pastikan kode ini hanya berjalan di sisi client (browser)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
