import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MeasurementEntry } from '../types';
import { formatDateShort } from '../lib/utils';
import { AVATAR_COLORS } from '../lib/constants';

interface MeasurementChartProps {
  entries: MeasurementEntry[];
  color: string;
}

interface MetricOption {
  key: keyof MeasurementEntry;
  label: string;
  unit: string;
}

const METRICS: MetricOption[] = [
  { key: 'weightKg', label: 'Peso', unit: 'kg' },
  { key: 'waistCm', label: 'Cintura', unit: 'cm' },
  { key: 'hipCm', label: 'Quadril', unit: 'cm' },
  { key: 'chestCm', label: 'Busto/Peito', unit: 'cm' },
  { key: 'armCm', label: 'Braço', unit: 'cm' },
  { key: 'thighCm', label: 'Coxa', unit: 'cm' },
];

interface TooltipPayloadItem {
  value: number;
  payload: { fullDate: string };
}

function makeTooltip(unit: string) {
  return function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
    if (!active || !payload?.length) return null;
    const { value, payload: point } = payload[0];
    return (
      <div className="bg-[var(--color-surface)] rounded-xl shadow-lg px-3 py-2 border border-[#ffe1eb] dark:border-[var(--color-border)] text-sm">
        <p className="font-bold text-[var(--color-text)]">
          {value.toLocaleString('pt-BR')} {unit}
        </p>
        <p className="text-xs text-[var(--color-text-soft)]">{point.fullDate}</p>
      </div>
    );
  };
}

export function MeasurementChart({ entries, color }: MeasurementChartProps) {
  const palette = AVATAR_COLORS[color] ?? AVATAR_COLORS.rosa;
  const availableMetrics = useMemo(
    () => METRICS.filter((m) => entries.some((e) => e[m.key] != null)),
    [entries],
  );
  const [metricKey, setMetricKey] = useState<keyof MeasurementEntry>(availableMetrics[0]?.key ?? 'weightKg');
  const metric = METRICS.find((m) => m.key === metricKey) ?? METRICS[0];

  const data = entries
    .filter((e) => e[metricKey] != null)
    .map((e) => ({
      date: formatDateShort(e.date),
      fullDate: new Date(`${e.date}T00:00:00`).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      valor: e[metricKey] as number,
    }));

  if (availableMetrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center text-[var(--color-text-soft)]">
        <span className="text-3xl mb-2">📈</span>
        <p className="text-sm">Adicione pelo menos 2 registros de peso ou medidas para ver o gráfico de evolução.</p>
      </div>
    );
  }

  const gradientId = `measurementGradient-${color}-${metricKey}`;
  const CustomTooltip = makeTooltip(metric.unit);

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {availableMetrics.map((m) => (
          <button
            key={m.key}
            onClick={() => setMetricKey(m.key)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
              m.key === metricKey
                ? 'text-white'
                : 'bg-[var(--color-surface-soft)] text-[var(--color-text-soft)] hover:text-[var(--color-text)]'
            }`}
            style={m.key === metricKey ? { backgroundColor: palette.chart } : undefined}
          >
            {m.label}
          </button>
        ))}
      </div>

      {data.length < 2 ? (
        <div className="flex flex-col items-center justify-center h-48 text-center text-[var(--color-text-soft)]">
          <span className="text-3xl mb-2">📈</span>
          <p className="text-sm">Adicione pelo menos 2 registros de {metric.label.toLowerCase()} para ver o gráfico.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={palette.chart} stopOpacity={0.35} />
                <stop offset="100%" stopColor={palette.chart} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--color-text-soft)' }} tickLine={false} axisLine={false} />
            <YAxis
              domain={['dataMin - 2', 'dataMax + 2']}
              tick={{ fontSize: 12, fill: 'var(--color-text-soft)' }}
              tickLine={false}
              axisLine={false}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="valor"
              stroke={palette.chart}
              strokeWidth={3}
              fill={`url(#${gradientId})`}
              dot={{ r: 4, fill: palette.chart, strokeWidth: 2, stroke: 'var(--color-surface)' }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
