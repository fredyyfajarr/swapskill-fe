'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import ReviewModal from '@/components/ReviewModal';
import { ArrowRightLeft, Check, X, Clock, CheckCheck, MessageCircle, Star } from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from '@/features/users/infrastructure/profileRepository';

const fetcher = (url: string) => api.get(url).then(res => res.data.data);

type BarterRequest = {
  id: number;
  post_id: number;
  requester_id: number;
  status: string;
  message: string | null;
  requester_confirmed_complete: boolean;
  owner_confirmed_complete: boolean;
  created_at: string;
  post: {
    id: number;
    user_id: number;
    needed_skill: { name: string };
    offered_skill: { name: string };
    user: { id: number; name: string };
  };
  requester: { id: number; name: string };
};

export default function BartersPage() {
  const { data: currentUser } = useSWR('currentUser', getCurrentUser);
  const { data: barters, isLoading, mutate } = useSWR('/barter-requests', fetcher);
  const [filter, setFilter] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [reviewModal, setReviewModal] = useState<{ open: boolean; barterId: number; revieweeId: number; revieweeName: string }>({
    open: false, barterId: 0, revieweeId: 0, revieweeName: '',
  });

  const handleAccept = async (id: number) => {
    setActionLoading(id);
    try {
      await api.patch(`/barter-requests/${id}/accept`);
      toast.success('Barter diterima! Mulai chat sekarang 🎉');
      mutate();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal menerima');
    } finally { setActionLoading(null); }
  };

  const handleReject = async (id: number) => {
    setActionLoading(id);
    try {
      await api.patch(`/barter-requests/${id}/reject`);
      toast.success('Pengajuan ditolak');
      mutate();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal menolak');
    } finally { setActionLoading(null); }
  };

  const handleComplete = async (id: number) => {
    setActionLoading(id);
    try {
      const res = await api.patch(`/barter-requests/${id}/complete`);
      if (res.data.both_confirmed) {
        toast.success('Barter selesai! Beri ulasan sekarang 🎉');
      } else {
        toast.success('Konfirmasi berhasil! Menunggu pihak lain.');
      }
      mutate();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal konfirmasi');
    } finally { setActionLoading(null); }
  };

  const handleCancel = async (id: number) => {
    setActionLoading(id);
    try {
      await api.delete(`/barter-requests/${id}/cancel`);
      toast.success('Pengajuan dibatalkan');
      mutate();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal membatalkan');
    } finally { setActionLoading(null); }
  };

  const handleReviewSubmit = async (data: { rating: number; comment: string }) => {
    try {
      await api.post('/reviews', {
        reviewee_id: reviewModal.revieweeId,
        barter_request_id: reviewModal.barterId,
        rating: data.rating,
        comment: data.comment,
      });
      toast.success('Ulasan berhasil dikirim!');
      setReviewModal({ open: false, barterId: 0, revieweeId: 0, revieweeName: '' });
      mutate();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal mengirim ulasan');
    }
  };

  const filtered = barters?.filter((b: BarterRequest) => filter === 'all' || b.status === filter) || [];

  const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'Menunggu', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: <Clock size={12} /> },
    accepted: { label: 'Berlangsung', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: <ArrowRightLeft size={12} /> },
    completed: { label: 'Selesai', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: <CheckCheck size={12} /> },
    rejected: { label: 'Ditolak', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: <X size={12} /> },
    cancelled: { label: 'Dibatalkan', color: 'text-slate-400 bg-slate-400/10 border-slate-400/20', icon: <X size={12} /> },
  };

  const filterTabs = [
    { key: 'all', label: 'Semua' },
    { key: 'pending', label: 'Menunggu' },
    { key: 'accepted', label: 'Berlangsung' },
    { key: 'completed', label: 'Selesai' },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background bg-mesh text-foreground pb-20 pt-24 md:pt-28 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ArrowRightLeft size={20} className="text-white" />
              </div>
              Barter Saya
            </h1>
            <p className="text-slate-400 text-sm">Kelola semua pengajuan dan transaksi barter skill kamu</p>
          </div>

          {/* FILTER TABS */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {filterTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === tab.key
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-slate-800/30 text-slate-400 border border-slate-700/30 hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
                {barters && (
                  <span className="ml-1.5 opacity-60">
                    ({tab.key === 'all' ? barters.length : barters.filter((b: BarterRequest) => b.status === tab.key).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* BARTER LIST */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                  <div className="flex gap-4 items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-slate-700/50" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-700/50 rounded w-1/3" />
                      <div className="h-3 bg-slate-700/50 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-12 bg-slate-700/50 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-12 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                <ArrowRightLeft size={28} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Belum Ada Barter</h3>
              <p className="text-slate-400 text-sm mb-6">Mulai ajukan barter dari halaman Skill Board!</p>
              <Link href="/dashboard" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/20 btn-shine">
                Jelajahi Skill Board
              </Link>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className="space-y-4">
                {filtered.map((barter: BarterRequest) => {
                  const isOwner = currentUser?.id === barter.post?.user?.id;
                  const isRequester = currentUser?.id === barter.requester_id;
                  const partner = isOwner ? barter.requester : barter.post?.user;
                  const status = statusConfig[barter.status] || statusConfig.pending;
                  const myConfirmed = isOwner ? barter.owner_confirmed_complete : barter.requester_confirmed_complete;
                  const partnerConfirmed = isOwner ? barter.requester_confirmed_complete : barter.owner_confirmed_complete;

                  return (
                    <motion.div
                      key={barter.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="glass rounded-2xl p-5 md:p-6 hover-glow transition-all"
                    >
                      {/* TOP ROW */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                            {partner?.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm">{partner?.name}</p>
                            <p className="text-slate-500 text-xs">
                              {isOwner ? 'Mengajukan ke kamu' : 'Kamu ajukan'}
                              {' · '}
                              {new Date(barter.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full border text-xs font-semibold flex items-center gap-1.5 ${status.color}`}>
                          {status.icon} {status.label}
                        </span>
                      </div>

                      {/* SKILL CARDS */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-center">
                          <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Butuh</p>
                          <p className="text-emerald-400 font-bold text-xs">{barter.post?.needed_skill?.name}</p>
                        </div>
                        <ArrowRightLeft size={12} className="text-slate-600 shrink-0" />
                        <div className="flex-1 p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10 text-center">
                          <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Tawarkan</p>
                          <p className="text-blue-400 font-bold text-xs">{barter.post?.offered_skill?.name}</p>
                        </div>
                      </div>

                      {barter.message && (
                        <p className="text-slate-400 text-xs italic mb-4 px-1">&quot;{barter.message}&quot;</p>
                      )}

                      {/* ACTION BUTTONS */}
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
                        {/* PENDING - Owner can accept/reject, Requester can cancel */}
                        {barter.status === 'pending' && isOwner && (
                          <>
                            <button
                              onClick={() => handleAccept(barter.id)}
                              disabled={actionLoading === barter.id}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
                            >
                              <Check size={14} /> Terima
                            </button>
                            <button
                              onClick={() => handleReject(barter.id)}
                              disabled={actionLoading === barter.id}
                              className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
                            >
                              <X size={14} /> Tolak
                            </button>
                          </>
                        )}
                        {barter.status === 'pending' && isRequester && (
                          <button
                            onClick={() => handleCancel(barter.id)}
                            disabled={actionLoading === barter.id}
                            className="flex items-center gap-1.5 bg-slate-700/30 hover:bg-slate-700/50 text-slate-400 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
                          >
                            <X size={14} /> Batalkan
                          </button>
                        )}

                        {/* ACCEPTED - Show chat + complete buttons */}
                        {barter.status === 'accepted' && (
                          <>
                            <Link
                              href={`/messages?userId=${partner?.id}`}
                              className="flex items-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
                            >
                              <MessageCircle size={14} /> Chat Partner
                            </Link>
                            {!myConfirmed ? (
                              <button
                                onClick={() => handleComplete(barter.id)}
                                disabled={actionLoading === barter.id}
                                className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
                              >
                                <CheckCheck size={14} /> Konfirmasi Selesai
                              </button>
                            ) : (
                              <span className="flex items-center gap-1.5 text-emerald-400/60 text-xs font-medium px-3">
                                <Check size={12} /> Kamu sudah konfirmasi {!partnerConfirmed && '· Menunggu partner'}
                              </span>
                            )}
                          </>
                        )}

                        {/* COMPLETED - Show review button */}
                        {barter.status === 'completed' && partner && (
                          <>
                            <button
                              onClick={() => setReviewModal({
                                open: true,
                                barterId: barter.id,
                                revieweeId: partner.id,
                                revieweeName: partner.name,
                              })}
                              className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
                            >
                              <Star size={14} /> Beri Ulasan
                            </button>
                            <Link
                              href={`/users/${partner.id}`}
                              className="flex items-center gap-1.5 bg-slate-700/30 hover:bg-slate-700/50 text-slate-400 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
                            >
                              Lihat Profil
                            </Link>
                          </>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      {/* REVIEW MODAL */}
      {reviewModal.open && (
        <ReviewModal
          isOpen={reviewModal.open}
          onClose={() => setReviewModal({ open: false, barterId: 0, revieweeId: 0, revieweeName: '' })}
          onSubmit={handleReviewSubmit}
          revieweeName={reviewModal.revieweeName}
        />
      )}
    </>
  );
}
