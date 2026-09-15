import type { ReactNode } from 'react';

interface ModalProps {
  title: string;
  emoji?: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, emoji, onClose, children }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md max-h-[92vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
            {emoji && <span>{emoji}</span>}
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#fff1f6] text-[#c23764] hover:bg-[#ffd6e3] transition-colors text-lg font-bold"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
