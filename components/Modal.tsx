'use client';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!isOpen) return null; // Jika state false, jangan render apa-apa

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Background Blur Overlay */}
      <div
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      ></div>

      {/* Modal Box */}
      <div className="relative bg-slate-800 border border-slate-700 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl leading-none transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Isi Modal (Form, teks, dll akan masuk ke sini) */}
        {children}
      </div>
    </div>
  );
}
