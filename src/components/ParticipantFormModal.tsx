import { useRef, useState } from 'react';
import { Modal } from './Modal';
import { AVATAR_COLOR_KEYS, AVATAR_COLORS, AVATAR_EMOJIS } from '../lib/constants';
import { readAndCompressImage } from '../lib/image';
import type { Participant } from '../types';

interface ParticipantFormModalProps {
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    emoji: string;
    color: string;
    photo?: string;
    heightCm?: number;
    goalWeightKg?: number;
  }) => void;
  initial?: Participant;
}

export function ParticipantFormModal({ onClose, onSubmit, initial }: ParticipantFormModalProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [emoji, setEmoji] = useState(initial?.emoji ?? AVATAR_EMOJIS[0]);
  const [color, setColor] = useState(initial?.color ?? AVATAR_COLOR_KEYS[0]);
  const [photo, setPhoto] = useState<string | undefined>(initial?.photo);
  const [heightCm, setHeightCm] = useState(initial?.heightCm?.toString() ?? '');
  const [goalWeightKg, setGoalWeightKg] = useState(initial?.goalWeightKg?.toString() ?? '');
  const [error, setError] = useState('');
  const [photoError, setPhotoError] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);

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
      photo,
      heightCm: heightCm ? Number(heightCm) : undefined,
      goalWeightKg: goalWeightKg ? Number(goalWeightKg) : undefined,
    });
  }

  async function handlePhotoChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const compressed = await readAndCompressImage(file);
      setPhoto(compressed);
      setPhotoError('');
    } catch {
      setPhotoError('Não foi possível usar essa imagem.');
    }
  }

  const palette = AVATAR_COLORS[color];

  return (
    <Modal title={initial ? 'Editar participante' : 'Novo participante'} emoji="✨" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="relative w-20 h-20 rounded-full text-4xl border-4 overflow-hidden group"
            style={{ backgroundColor: palette.bg, borderColor: palette.ring }}
            aria-label="Escolher foto"
          >
            {photo ? (
              <img src={photo} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="w-full h-full flex items-center justify-center">{emoji}</span>
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xl">
              📷
            </span>
          </button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChosen}
            className="hidden"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="text-xs font-semibold text-[var(--color-primary-dark)] hover:underline"
            >
              {photo ? 'Trocar foto' : 'Adicionar foto'}
            </button>
            {photo && (
              <button
                type="button"
                onClick={() => setPhoto(undefined)}
                className="text-xs font-semibold text-[var(--color-text-soft)] hover:underline"
              >
                Remover
              </button>
            )}
          </div>
          {photoError && <p className="text-xs text-[#e6486a]">{photoError}</p>}
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
            className="mt-1 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text)] px-4 py-2.5 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[#ffd6e3] dark:focus:ring-[#ff8fab]/30 transition"
          />
          {error && <p className="text-xs text-[#e6486a] mt-1">{error}</p>}
        </div>

        <div>
          <label className="text-sm font-semibold text-[var(--color-text-soft)]">
            Avatar {photo && <span className="font-normal">· aparece se você tirar a foto</span>}
          </label>
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
              className="mt-1 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text)] px-3 py-2.5 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[#ffd6e3] dark:focus:ring-[#ff8fab]/30 transition"
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
              className="mt-1 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text)] px-3 py-2.5 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[#ffd6e3] dark:focus:ring-[#ff8fab]/30 transition"
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
