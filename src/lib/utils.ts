import type { MeasurementEntry, Participant } from '../types';

export function sortedEntries(participant: Participant): MeasurementEntry[] {
  return [...participant.entries].sort((a, b) => a.date.localeCompare(b.date));
}

export function latestEntry(participant: Participant): MeasurementEntry | undefined {
  const entries = sortedEntries(participant);
  return entries[entries.length - 1];
}

export function previousEntry(participant: Participant): MeasurementEntry | undefined {
  const entries = sortedEntries(participant);
  return entries[entries.length - 2];
}

export function weightDelta(participant: Participant): number | undefined {
  const last = latestEntry(participant);
  const prev = previousEntry(participant);
  if (last?.weightKg == null || prev?.weightKg == null) return undefined;
  return round1(last.weightKg - prev.weightKg);
}

export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function formatWeight(value: number | undefined): string {
  if (value == null) return '—';
  return `${round1(value).toLocaleString('pt-BR')} kg`;
}

export function formatCm(value: number | undefined): string {
  if (value == null) return '—';
  return `${round1(value).toLocaleString('pt-BR')} cm`;
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateShort(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export function todayIso(): string {
  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 10);
}

export function bmi(weightKg: number | undefined, heightCm: number | undefined): number | undefined {
  if (!weightKg || !heightCm) return undefined;
  const heightM = heightCm / 100;
  return round1(weightKg / (heightM * heightM));
}

export function bmiLabel(value: number | undefined): string {
  if (value == null) return '';
  if (value < 18.5) return 'Abaixo do peso';
  if (value < 25) return 'Peso saudável';
  if (value < 30) return 'Sobrepeso';
  return 'Obesidade';
}
