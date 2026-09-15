import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useParticipants } from '../store/ParticipantsContext';
import { Avatar } from '../components/Avatar';
import { MeasurementChart } from '../components/MeasurementChart';
import { GoalProgressBar } from '../components/GoalProgressBar';
import { ParticipantFormModal } from '../components/ParticipantFormModal';
import { EntryFormModal } from '../components/EntryFormModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { AVATAR_COLORS } from '../lib/constants';
import {
  bmi,
  bmiLabel,
  formatCm,
  formatDate,
  formatWeight,
  goalProgress,
  latestEntry,
  sortedEntries,
  weightDelta,
} from '../lib/utils';
import type { MeasurementEntry } from '../types';

const measureFields: { key: keyof MeasurementEntry; label: string; icon: string }[] = [
  { key: 'waistCm', label: 'Cintura', icon: '📐' },
  { key: 'hipCm', label: 'Quadril', icon: '📐' },
  { key: 'chestCm', label: 'Busto/Peito', icon: '📐' },
  { key: 'armCm', label: 'Braço', icon: '📐' },
  { key: 'thighCm', label: 'Coxa', icon: '📐' },
];

export function Profile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getParticipant, updateParticipant, deleteParticipant, addEntry, updateEntry, deleteEntry } = useParticipants();
  const participant = id ? getParticipant(id) : undefined;

  const [showEditParticipant, setShowEditParticipant] = useState(false);
  const [showDeleteParticipant, setShowDeleteParticipant] = useState(false);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MeasurementEntry | null>(null);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);

  const entries = useMemo(() => (participant ? sortedEntries(participant) : []), [participant]);
  const last = participant ? latestEntry(participant) : undefined;
  const delta = participant ? weightDelta(participant) : undefined;

  if (!participant) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-3">🙈</div>
        <h1 className="font-heading text-xl font-bold">Participante não encontrado</h1>
        <button
          onClick={() => navigate('/')}
          className="mt-5 rounded-2xl bg-[var(--color-primary)] text-white font-heading font-bold px-6 py-3"
        >
          Voltar para o início
        </button>
      </div>
    );
  }

  const palette = AVATAR_COLORS[participant.color] ?? AVATAR_COLORS.rosa;
  const currentBmi = bmi(last?.weightKg, participant.heightCm);
  const remainingToGoal =
    participant.goalWeightKg != null && last?.weightKg != null
      ? Math.round((last.weightKg - participant.goalWeightKg) * 10) / 10
      : undefined;
  const progress = goalProgress(participant);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate('/')}
        className="text-sm font-semibold text-[var(--color-text-soft)] hover:text-[var(--color-primary-dark)] transition-colors mb-4 flex items-center gap-1"
      >
        ← Todos os participantes
      </button>

      <div className="bg-[var(--color-surface)]/80 backdrop-blur rounded-3xl p-6 shadow-sm border border-[var(--color-border)] animate-pop-in">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <Avatar emoji={participant.emoji} color={participant.color} size="lg" />
            <div>
              <h1 className="font-heading text-2xl font-extrabold" style={{ color: palette.text }}>
                {participant.name}
              </h1>
              <p className="text-sm text-[var(--color-text-soft)]">
                {participant.heightCm ? `${participant.heightCm} cm` : 'Altura não informada'}
                {participant.goalWeightKg ? ` · meta ${formatWeight(participant.goalWeightKg)}` : ''}
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setShowEditParticipant(true)}
              className="rounded-xl bg-[#fff1f6] text-[#c23764] font-semibold text-sm px-3.5 py-2 hover:bg-[#ffd6e3] dark:bg-white/10 dark:text-[#ff9dbb] dark:hover:bg-white/20 transition-colors"
            >
              ✏️ Editar
            </button>
            <button
              onClick={() => setShowDeleteParticipant(true)}
              className="rounded-xl bg-[#fdeceb] text-[#c23764] font-semibold text-sm px-3.5 py-2 hover:bg-[#fadbd8] dark:bg-white/10 dark:text-[#ff9dbb] dark:hover:bg-white/20 transition-colors"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <StatBox label="Peso atual" value={formatWeight(last?.weightKg)} />
          <StatBox
            label="Variação"
            value={delta == null ? '—' : delta === 0 ? 'estável' : `${delta > 0 ? '+' : ''}${delta} kg`}
            positive={delta != null && delta < 0}
            negative={delta != null && delta > 0}
          />
          <StatBox label="IMC" value={currentBmi != null ? `${currentBmi}` : '—'} sub={bmiLabel(currentBmi)} />
          <StatBox
            label="Para a meta"
            value={remainingToGoal == null ? '—' : remainingToGoal <= 0 ? 'Meta atingida! 🎉' : `${remainingToGoal} kg`}
          />
        </div>

        {progress && <GoalProgressBar progress={progress} chartColor={palette.chart} />}
      </div>

      <div className="bg-[var(--color-surface)]/80 backdrop-blur rounded-3xl p-6 shadow-sm border border-[var(--color-border)] mt-5 animate-pop-in">
        <h2 className="font-heading text-lg font-bold mb-1">Evolução</h2>
        <MeasurementChart entries={entries} color={participant.color} />
      </div>

      <div className="bg-[var(--color-surface)]/80 backdrop-blur rounded-3xl p-6 shadow-sm border border-[var(--color-border)] mt-5 animate-pop-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-bold">Registros</h2>
          <button
            onClick={() => setShowAddEntry(true)}
            className="rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold text-sm px-4 py-2 shadow shadow-pink-200 transition-colors"
          >
            + Nova medição
          </button>
        </div>

        {entries.length === 0 ? (
          <p className="text-center text-[var(--color-text-soft)] py-8">
            Nenhum registro ainda. Adicione a primeira medição de {participant.name}!
          </p>
        ) : (
          <ul className="space-y-2">
            {[...entries].reverse().map((entry) => (
              <li
                key={entry.id}
                className="rounded-2xl border border-[var(--color-border)] p-3.5 hover:border-[#ffc4d6] dark:hover:border-[#ff8fab]/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{formatDate(entry.date)}</p>
                    {entry.note && <p className="text-xs text-[var(--color-text-soft)] mt-0.5">{entry.note}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    {entry.weightKg != null && (
                      <span className="font-heading font-bold" style={{ color: palette.text }}>
                        {formatWeight(entry.weightKg)}
                      </span>
                    )}
                    <button
                      onClick={() => setEditingEntry(entry)}
                      aria-label="Editar registro"
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#fff1f6] dark:hover:bg-white/10 text-sm"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setDeletingEntryId(entry.id)}
                      aria-label="Excluir registro"
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#fdeceb] dark:hover:bg-white/10 text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                {measureFields.some((f) => entry[f.key] != null) && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-[var(--color-text-soft)]">
                    {measureFields.map(
                      (f) =>
                        entry[f.key] != null && (
                          <span key={f.key}>
                            {f.label}: <span className="font-semibold text-[var(--color-text)]">{formatCm(entry[f.key] as number)}</span>
                          </span>
                        ),
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {showEditParticipant && (
        <ParticipantFormModal
          initial={participant}
          onClose={() => setShowEditParticipant(false)}
          onSubmit={(data) => {
            updateParticipant(participant.id, data);
            setShowEditParticipant(false);
          }}
        />
      )}

      {showDeleteParticipant && (
        <ConfirmDialog
          title={`Remover ${participant.name}?`}
          message="Todos os registros desse participante serão apagados. Essa ação não pode ser desfeita."
          onCancel={() => setShowDeleteParticipant(false)}
          onConfirm={() => {
            deleteParticipant(participant.id);
            navigate('/');
          }}
        />
      )}

      {showAddEntry && (
        <EntryFormModal
          onClose={() => setShowAddEntry(false)}
          onSubmit={(data) => {
            addEntry(participant.id, data);
            setShowAddEntry(false);
          }}
        />
      )}

      {editingEntry && (
        <EntryFormModal
          initial={editingEntry}
          onClose={() => setEditingEntry(null)}
          onSubmit={(data) => {
            updateEntry(participant.id, editingEntry.id, data);
            setEditingEntry(null);
          }}
        />
      )}

      {deletingEntryId && (
        <ConfirmDialog
          title="Remover este registro?"
          message="Essa medição será apagada permanentemente."
          onCancel={() => setDeletingEntryId(null)}
          onConfirm={() => {
            deleteEntry(participant.id, deletingEntryId);
            setDeletingEntryId(null);
          }}
        />
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  sub,
  positive,
  negative,
}: {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-[var(--color-surface-soft)] p-3 text-center">
      <p className="text-[11px] uppercase tracking-wide font-semibold text-[var(--color-text-soft)]">{label}</p>
      <p
        className={`font-heading font-bold text-lg mt-0.5 ${
          positive
            ? 'text-[#1d7a5f] dark:text-[#7fe0b8]'
            : negative
              ? 'text-[#c23764] dark:text-[#ff9dbb]'
              : 'text-[var(--color-text)]'
        }`}
      >
        {value}
      </p>
      {sub && <p className="text-[11px] text-[var(--color-text-soft)]">{sub}</p>}
    </div>
  );
}
