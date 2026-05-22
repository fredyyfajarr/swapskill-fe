'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import { Send, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const fetcher = (url: string) => api.get(url).then(res => res.data.data);

export default function MessagesPage() {
  const { data: currentUser } = useSWR('/profile', fetcher);
  const { data: usersData, isLoading: isLoadingUsers } = useSWR('/messages', fetcher);
  
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  
  // Polling or revalidating the selected user's messages
  const { data: messages, isLoading: isLoadingMessages, mutate: mutateMessages } = useSWR(
    selectedUserId ? `/messages/${selectedUserId}` : null,
    fetcher,
    { refreshInterval: 5000 } // simple polling for chat
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedUserId) return;
    
    const text = messageText;
    setMessageText('');

    try {
      await api.post(`/messages/${selectedUserId}`, { content: text });
      mutateMessages();
      // Also mutate users list to update last message etc.
    } catch (error) {
      toast.error('Gagal mengirim pesan');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background text-foreground pt-24 md:pt-28 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-6xl mx-auto h-[80vh] bg-card/40 backdrop-blur-xl border border-border rounded-3xl overflow-hidden flex shadow-2xl">
          
          {/* LEFT SIDEBAR - Users List */}
          <div className="w-full md:w-1/3 border-r border-border flex flex-col bg-background/50">
            <div className="p-4 border-b border-border">
              <h2 className="text-xl font-bold">Pesan</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {isLoadingUsers ? (
                <div className="p-4 space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3 items-center animate-pulse">
                      <div className="w-12 h-12 bg-card/60 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-card/60 rounded w-1/2"></div>
                        <div className="h-3 bg-card/60 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : usersData?.length > 0 ? (
                usersData.map((user: any) => (
                  <div 
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className={cn(
                      "flex items-center gap-3 p-4 cursor-pointer hover:bg-secondary/50 transition-colors border-b border-border/50",
                      selectedUserId === user.id ? "bg-secondary/80 border-l-4 border-l-primary" : ""
                    )}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 flex items-center justify-center text-white font-bold text-xl shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{user.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">Klik untuk melihat obrolan</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  Belum ada percakapan. Mulai obrolan dari profil pengguna lain.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL - Chat Area */}
          <div className={cn(
            "flex-1 flex flex-col bg-background/30 hidden md:flex",
            selectedUserId ? "flex" : "hidden md:flex"
          )}>
            {selectedUserId ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center gap-3 bg-background/80 backdrop-blur-sm z-10">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-bold">
                     <UserCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold">Percakapan</h3>
                    <p className="text-xs text-muted-foreground">Barter skill</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col-reverse">
                  {isLoadingMessages ? (
                    <div className="flex justify-center"><div className="animate-pulse text-muted-foreground">Memuat...</div></div>
                  ) : (
                    <AnimatePresence initial={false}>
                      {messages?.map((msg: any) => {
                        const isMe = msg.sender_id === currentUser?.id;
                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                              "flex max-w-[75%] w-fit",
                              isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}
                          >
                            <div className={cn(
                              "p-3 rounded-2xl text-sm shadow-sm",
                              isMe ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-secondary text-foreground rounded-tl-sm"
                            )}>
                              <p className="break-words whitespace-pre-wrap">{msg.content}</p>
                              <p className={cn(
                                "text-[10px] mt-1 text-right",
                                isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                              )}>
                                {format(new Date(msg.created_at), 'HH:mm')}
                              </p>
                            </div>
                          </motion.div>
                        );
                      }).reverse()}
                    </AnimatePresence>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-4 bg-background/80 backdrop-blur-sm border-t border-border">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Ketik pesan..."
                      className="flex-1 bg-secondary border border-border text-foreground rounded-full px-4 py-2 outline-none focus:border-primary transition-colors"
                    />
                    <button 
                      type="submit"
                      disabled={!messageText.trim()}
                      className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 transition-transform hover:scale-105 active:scale-95"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                  <Send size={32} className="opacity-50" />
                </div>
                <p>Pilih percakapan untuk mulai mengirim pesan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
