import type { GoalProgress } from '../lib/utils';

interface GoalProgressBarProps {
  progress: GoalProgress;
  chartColor: string;
}

export function GoalProgressBar({ progress, chartColor }: GoalProgressBarProps) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs font-semibold text-[var(--color-text-soft)]">Progresso até a meta</p>
        <p className="text-xs font-bold" style={{ color: chartColor }}>
          {progress.reached ? 'Meta atingida! 🎉' : `${progress.percent.toLocaleString('pt-BR')}%`}
        </p>
      </div>
      <div className="h-3 w-full rounded-full bg-[var(--color-surface-soft)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress.percent}%`,
            background: progress.reached
              ? 'linear-gradient(90deg, #ffd166, #ff8fab)'
              : chartColor,
          }}
        />
      </div>
    </div>
  );
}
