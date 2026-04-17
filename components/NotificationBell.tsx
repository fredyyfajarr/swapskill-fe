'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/lib/axios';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data);
      setUnreadCount(res.data.unread_count);
    } catch (error) {
      console.error('Gagal memuat notifikasi', error);
    }
  };

  const markAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await api.post('/notifications/read');
      setUnreadCount(0); // Langsung reset badge merahnya
    } catch (error) {
      console.error('Gagal menandai dibaca', error);
    }
  };

  // --- FUNGSI HAPUS SEMUA ---
  const clearAllNotifications = async () => {
    try {
      await api.delete('/notifications/clear');
      setNotifications([]); // Kosongkan tampilan instan
      setUnreadCount(0);
    } catch (error) {
      console.error('Gagal membersihkan notifikasi', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      markAsRead();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Tombol Lonceng */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-slate-300 hover:text-white transition-colors rounded-full hover:bg-white/10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>

        {/* Titik Merah (Badge) */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-slate-900"></span>
          </span>
        )}
      </button>

      {/* Dropdown Notifikasi */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
          {/* --- HEADER NOTIFIKASI YANG RAPI --- */}
          <div className="flex justify-between items-center mb-3 px-2">
            <h3 className="text-white font-bold">Notifikasi</h3>

            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-xs text-slate-400 hover:text-red-400 transition-colors underline decoration-slate-600 hover:decoration-red-400 underline-offset-2"
              >
                Bersihkan Semua
              </button>
            )}
          </div>

          {/* --- AREA SCROLL NOTIFIKASI --- */}
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {notifications.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-4 italic">
                Belum ada notifikasi.
              </p>
            ) : (
              notifications.map((notif) => {
                const data =
                  typeof notif.data === 'string'
                    ? JSON.parse(notif.data)
                    : notif.data;

                return (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-xl border ${notif.is_read ? 'bg-slate-700/20 border-slate-700/30' : 'bg-slate-700/50 border-slate-600/50'}`}
                  >
                    <div className="flex gap-3">
                      <div className="text-xl">
                        {notif.type === 'bookmark' ? '📌' : '⭐'}
                      </div>
                      <div>
                        <p className="text-sm text-slate-300">
                          <span className="font-bold text-white">
                            {data.sender_name}
                          </span>{' '}
                          {data.message || 'berinteraksi denganmu.'}
                        </p>
                        {data.post_title && (
                          <p className="text-xs text-blue-400 font-medium mt-1 truncate max-w-[200px]">
                            {data.post_title}
                          </p>
                        )}
                        <p className="text-[10px] text-slate-500 mt-1 uppercase">
                          {new Date(notif.created_at).toLocaleDateString(
                            'id-ID',
                            {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
