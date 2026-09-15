import { useState } from 'react';
import { Modal } from './Modal';
import { AVATAR_COLOR_KEYS, AVATAR_COLORS, AVATAR_EMOJIS } from '../lib/constants';
import type { Participant } from '../types';

interface ParticipantFormModalProps {
  onClose: () => void;
  onSubmit: (data: { name: string; emoji: string; color: string; heightCm?: number; goalWeightKg?: number }) => void;
  initial?: Participant;
}

export function ParticipantFormModal({ onClose, onSubmit, initial }: ParticipantFormModalProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [emoji, setEmoji] = useState(initial?.emoji ?? AVATAR_EMOJIS[0]);
  const [color, setColor] = useState(initial?.color ?? AVATAR_COLOR_KEYS[0]);
  const [heightCm, setHeightCm] = useState(initial?.heightCm?.toString() ?? '');
  const [goalWeightKg, setGoalWeightKg] = useState(initial?.goalWeightKg?.toString() ?? '');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Dá um nome pra esse participante :)');
      return;
    }
    onSubmit({
      name: name.trim(),
      emoji,
      color,
      heightCm: heightCm ? Number(heightCm) : undefined,
      goalWeightKg: goalWeightKg ? Number(goalWeightKg) : undefined,
    });
  }

  const palette = AVATAR_COLORS[color];

  return (
    <Modal title={initial ? 'Editar participante' : 'Novo participante'} emoji="✨" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center">
          <div
            className="w-20 h-20 flex items-center justify-center rounded-full text-4xl border-4"
            style={{ backgroundColor: palette.bg, borderColor: palette.ring }}
          >
            {emoji}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-[var(--color-text-soft)]">Nome</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="Ex: Renata"
            className="mt-1 w-full rounded-2xl border border-[#f0d9e2] bg-[#fffafc] px-4 py-2.5 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[#ffd6e3] transition"
          />
          {error && <p className="text-xs text-[#e6486a] mt-1">{error}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-[var(--color-text-soft)]">Avatar</label>
          <div className="mt-1 grid grid-cols-8 gap-1.5">
            {AVATAR_EMOJIS.map((e) => (
              <button
                type="button"
                key={e}
                onClick={() => setEmoji(e)}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-lg transition ${
                  emoji === e ? 'bg-[#ffd6e3] scale-110' : 'hover:bg-[#fff1f6]'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-[var(--color-text-soft)]">Cor</label>
          <div className="mt-1 flex gap-2">
            {AVATAR_COLOR_KEYS.map((key) => (
              <button
                type="button"
                key={key}
                onClick={() => setColor(key)}
                aria-label={key}
                className="w-8 h-8 rounded-full border-2 transition"
                style={{
                  backgroundColor: AVATAR_COLORS[key].bg,
                  borderColor: color === key ? AVATAR_COLORS[key].ring : 'transparent',
                  boxShadow: color === key ? `0 0 0 2px ${AVATAR_COLORS[key].ring}` : 'none',
                }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold text-[var(--color-text-soft)]">Altura (cm)</label>
            <input
              type="number"
              inputMode="decimal"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="Opcional"
              className="mt-1 w-full rounded-2xl border border-[#f0d9e2] bg-[#fffafc] px-3 py-2.5 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[#ffd6e3] transition"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[var(--color-text-soft)]">Meta (kg)</label>
            <input
              type="number"
              inputMode="decimal"
              value={goalWeightKg}
              onChange={(e) => setGoalWeightKg(e.target.value)}
              placeholder="Opcional"
              className="mt-1 w-full rounded-2xl border border-[#f0d9e2] bg-[#fffafc] px-3 py-2.5 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[#ffd6e3] transition"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-heading font-bold py-3 shadow-lg shadow-pink-200 transition-colors"
        >
          {initial ? 'Salvar alterações' : 'Adicionar participante'}
        </button>
      </form>
    </Modal>
  );
}
