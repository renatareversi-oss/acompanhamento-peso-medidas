import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MeasurementEntry } from '../types';
import { formatDateShort } from '../lib/utils';
import { AVATAR_COLORS } from '../lib/constants';

interface WeightChartProps {
  entries: MeasurementEntry[];
  color: string;
}

interface TooltipPayloadItem {
  value: number;
  payload: { fullDate: string };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;
  const { value, payload: point } = payload[0];
  return (
    <div className="bg-white rounded-xl shadow-lg px-3 py-2 border border-[#ffe1eb] text-sm">
      <p className="font-bold text-[var(--color-text)]">{value.toLocaleString('pt-BR')} kg</p>
      <p className="text-xs text-[var(--color-text-soft)]">{point.fullDate}</p>
    </div>
  );
}

export function WeightChart({ entries, color }: WeightChartProps) {
  const palette = AVATAR_COLORS[color] ?? AVATAR_COLORS.rosa;
  const data = entries
    .filter((e) => e.weightKg != null)
    .map((e) => ({
      date: formatDateShort(e.date),
      fullDate: new Date(`${e.date}T00:00:00`).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      peso: e.weightKg,
    }));

  if (data.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center text-[var(--color-text-soft)]">
        <span className="text-3xl mb-2">📈</span>
        <p className="text-sm">Adicione pelo menos 2 registros de peso para ver o gráfico de evolução.</p>
      </div>
    );
  }

  const gradientId = `weightGradient-${color}`;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.chart} stopOpacity={0.35} />
            <stop offset="100%" stopColor={palette.chart} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#f3e4ea" strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#8a7684' }} tickLine={false} axisLine={false} />
        <YAxis
          domain={['dataMin - 2', 'dataMax + 2']}
          tick={{ fontSize: 12, fill: '#8a7684' }}
          tickLine={false}
          axisLine={false}
          width={48}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="peso"
          stroke={palette.chart}
          strokeWidth={3}
          fill={`url(#${gradientId})`}
          dot={{ r: 4, fill: palette.chart, strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
