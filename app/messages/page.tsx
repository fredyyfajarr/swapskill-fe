'use client';

import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import { Send, MessageCircle, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const fetcher = (url: string) => api.get(url).then(res => res.data.data).catch(() => []);

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const initialUserId = searchParams.get('userId');

  const { data: currentUser } = useSWR('/profile', fetcher);
  const { data: usersData, isLoading: isLoadingUsers } = useSWR('/messages', fetcher);

  const [selectedUserId, setSelectedUserId] = useState<number | null>(initialUserId ? Number(initialUserId) : null);
  const [messageText, setMessageText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading: isLoadingMessages, mutate: mutateMessages } = useSWR(
    selectedUserId ? `/messages/${selectedUserId}` : null,
    fetcher,
    { refreshInterval: 5000 }
  );

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUserId) return;

    const text = messageText;
    setMessageText('');

    try {
      await api.post(`/messages/${selectedUserId}`, { content: text });
      mutateMessages();
    } catch {
      toast.error('Gagal mengirim pesan');
      setMessageText(text);
    }
  };

  const selectedUser = usersData?.find((u: any) => u.id === selectedUserId);

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background bg-mesh text-foreground pt-24 md:pt-28 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-5xl mx-auto h-[78vh] glass-strong rounded-2xl overflow-hidden flex shadow-2xl">

          {/* LEFT SIDEBAR - Users List */}
          <div className={`w-full md:w-80 border-r border-white/5 flex flex-col shrink-0 ${selectedUserId ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-white/5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageCircle size={18} className="text-blue-400" />
                Pesan
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoadingUsers ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3 items-center animate-pulse p-2">
                      <div className="w-10 h-10 bg-slate-700/50 rounded-full shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3.5 bg-slate-700/50 rounded w-1/2" />
                        <div className="h-2.5 bg-slate-700/50 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : usersData && usersData.length > 0 ? (
                usersData.map((user: any) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className={`w-full flex items-center gap-3 p-3 transition-all text-left border-b border-white/5 ${
                      selectedUserId === user.id
                        ? 'bg-blue-500/10 border-l-2 border-l-blue-500'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {user.name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-white truncate">{user.name}</h3>
                      <p className="text-xs text-slate-500 truncate">Ketuk untuk chat</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                    <MessageCircle size={24} className="text-blue-400" />
                  </div>
                  <p className="text-slate-500 text-sm">Belum ada percakapan.</p>
                  <p className="text-slate-600 text-xs mt-1">Chat akan muncul setelah barter diterima.</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL - Chat Area */}
          <div className={`flex-1 flex flex-col ${selectedUserId ? 'flex' : 'hidden md:flex'}`}>
            {selectedUserId ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/5 flex items-center gap-3 glass">
                  <button
                    onClick={() => setSelectedUserId(null)}
                    className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                    {selectedUser?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{selectedUser?.name || 'Partner'}</h3>
                    <p className="text-xs text-slate-500">Barter Skill</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {isLoadingMessages ? (
                    <div className="flex justify-center py-8">
                      <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                  ) : messages && messages.length > 0 ? (
                    <>
                      {messages.map((msg: any) => {
                        const isMe = msg.sender_id === currentUser?.id;
                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                              isMe
                                ? 'bg-blue-600 text-white rounded-br-sm'
                                : 'bg-slate-800/60 text-slate-200 rounded-bl-sm border border-white/5'
                            }`}>
                              <p className="break-words whitespace-pre-wrap">{msg.content}</p>
                              <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200/60' : 'text-slate-500'}`}>
                                {formatTime(msg.created_at)}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                      <div ref={chatEndRef} />
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <MessageCircle size={32} className="text-slate-600 mb-3" />
                      <p className="text-slate-500 text-sm">Belum ada pesan</p>
                      <p className="text-slate-600 text-xs mt-1">Kirim pesan pertamamu!</p>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-white/5 glass">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Ketik pesan..."
                      className="flex-1 bg-slate-900/50 border border-slate-700/30 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    />
                    <button
                      type="submit"
                      disabled={!messageText.trim()}
                      className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-center disabled:opacity-30 transition-all hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      <Send size={16} />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <Send size={28} className="text-blue-400" />
                </div>
                <h3 className="text-white font-bold mb-1">Pilih Percakapan</h3>
                <p className="text-slate-500 text-sm">Pilih kontak di sebelah kiri untuk mulai chat</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
