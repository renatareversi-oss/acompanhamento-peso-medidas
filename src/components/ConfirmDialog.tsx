interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ title, message, confirmLabel = 'Excluir', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4" onClick={onCancel}>
      <div
        className="w-full max-w-sm bg-[var(--color-surface)] rounded-3xl shadow-2xl p-6 animate-pop-in text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-4xl mb-2">🥺</div>
        <h2 className="font-heading text-lg font-bold text-[var(--color-text)]">{title}</h2>
        <p className="text-sm text-[var(--color-text-soft)] mt-1">{message}</p>
        <div className="flex gap-3 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 rounded-2xl bg-[#f5f0f2] hover:bg-[#ece4e8] dark:bg-white/10 dark:hover:bg-white/20 text-[var(--color-text)] font-semibold py-2.5 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-2xl bg-[#e6486a] hover:bg-[#d13358] text-white font-semibold py-2.5 transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
