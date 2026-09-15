import { useNavigate } from 'react-router-dom';
import type { Participant } from '../types';
import { Avatar } from './Avatar';
import { formatDate, formatWeight, latestEntry, weightDelta } from '../lib/utils';
import { AVATAR_COLORS } from '../lib/constants';

export function ParticipantCard({ participant }: { participant: Participant }) {
  const navigate = useNavigate();
  const last = latestEntry(participant);
  const delta = weightDelta(participant);
  const palette = AVATAR_COLORS[participant.color] ?? AVATAR_COLORS.rosa;

  return (
    <button
      onClick={() => navigate(`/participante/${participant.id}`)}
      className="group text-left w-full bg-[var(--color-surface)]/80 backdrop-blur rounded-3xl p-5 shadow-[0_6px_20px_-8px_rgba(200,120,150,0.35)] border border-[var(--color-border)] hover:shadow-[0_10px_28px_-8px_rgba(200,120,150,0.5)] hover:-translate-y-1 transition-all duration-200 animate-pop-in cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3">
          <Avatar emoji={participant.emoji} color={participant.color} size="md" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-lg font-bold truncate" style={{ color: palette.text }}>
            {participant.name}
          </h3>
          {last ? (
            <p className="text-xs text-[var(--color-text-soft)]">Atualizado em {formatDate(last.date)}</p>
          ) : (
            <p className="text-xs text-[var(--color-text-soft)]">Nenhum registro ainda</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-2xl font-heading font-extrabold" style={{ color: palette.text }}>
            {formatWeight(last?.weightKg)}
          </p>
          <p className="text-xs text-[var(--color-text-soft)]">peso atual</p>
        </div>
        {delta != null && (
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              delta < 0
                ? 'bg-[#d9f5e6] text-[#1d7a5f] dark:bg-[#1d7a5f]/25 dark:text-[#7fe0b8]'
                : delta > 0
                  ? 'bg-[#ffe1e1] text-[#c23764] dark:bg-[#c23764]/25 dark:text-[#ff9dbb]'
                  : 'bg-[#f1f1f1] text-[#777] dark:bg-white/10 dark:text-[#cbbfc7]'
            }`}
          >
            {delta === 0 ? 'estável' : `${delta > 0 ? '+' : ''}${delta.toLocaleString('pt-BR')} kg`}
          </span>
        )}
      </div>
    </button>
  );
}
