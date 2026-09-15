import { useState } from 'react';
import { Modal } from './Modal';
import type { MeasurementEntry } from '../types';
import { todayIso } from '../lib/utils';

interface EntryFormModalProps {
  onClose: () => void;
  onSubmit: (data: Omit<MeasurementEntry, 'id'>) => void;
  initial?: MeasurementEntry;
}

const fields: { key: keyof MeasurementEntry; label: string; unit: string }[] = [
  { key: 'weightKg', label: 'Peso', unit: 'kg' },
  { key: 'waistCm', label: 'Cintura', unit: 'cm' },
  { key: 'hipCm', label: 'Quadril', unit: 'cm' },
  { key: 'chestCm', label: 'Busto/Peito', unit: 'cm' },
  { key: 'armCm', label: 'Braço', unit: 'cm' },
  { key: 'thighCm', label: 'Coxa', unit: 'cm' },
];

export function EntryFormModal({ onClose, onSubmit, initial }: EntryFormModalProps) {
  const [date, setDate] = useState(initial?.date ?? todayIso());
  const [values, setValues] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {};
    for (const f of fields) {
      const val = initial?.[f.key];
      v[f.key] = val != null ? String(val) : '';
    }
    return v;
  });
  const [note, setNote] = useState(initial?.note ?? '');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const hasAnyValue = fields.some((f) => values[f.key].trim() !== '');
    if (!hasAnyValue) {
      setError('Preencha ao menos uma medida :)');
      return;
    }
    const data: Omit<MeasurementEntry, 'id'> = { date, note: note.trim() || undefined };
    for (const f of fields) {
      const raw = values[f.key];
      if (raw.trim() !== '') {
        (data as Record<string, unknown>)[f.key] = Number(raw);
      }
    }
    onSubmit(data);
  }

  return (
    <Modal title={initial ? 'Editar registro' : 'Nova medição'} emoji="📏" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-[var(--color-text-soft)]">Data</label>
          <input
            type="date"
            value={date}
            max={todayIso()}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text)] px-4 py-2.5 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[#ffd6e3] dark:focus:ring-[#ff8fab]/30 transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-sm font-semibold text-[var(--color-text-soft)]">
                {f.label} <span className="text-[var(--color-text-soft)] font-normal">({f.unit})</span>
              </label>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={values[f.key]}
                onChange={(e) => {
                  setValues((prev) => ({ ...prev, [f.key]: e.target.value }));
                  setError('');
                }}
                placeholder="—"
                className="mt-1 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text)] px-3 py-2.5 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[#ffd6e3] dark:focus:ring-[#ff8fab]/30 transition"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="text-sm font-semibold text-[var(--color-text-soft)]">Observação</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Opcional"
            className="mt-1 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text)] px-4 py-2.5 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[#ffd6e3] dark:focus:ring-[#ff8fab]/30 transition"
          />
        </div>

        {error && <p className="text-xs text-[#e6486a]">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-heading font-bold py-3 shadow-lg shadow-pink-200 transition-colors"
        >
          {initial ? 'Salvar alterações' : 'Adicionar registro'}
        </button>
      </form>
    </Modal>
  );
}
