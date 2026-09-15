export interface MeasurementEntry {
  id: string;
  date: string; // ISO date (yyyy-MM-dd)
  weightKg?: number;
  waistCm?: number;
  hipCm?: number;
  chestCm?: number;
  armCm?: number;
  thighCm?: number;
  note?: string;
}

export interface Participant {
  id: string;
  name: string;
  emoji: string;
  color: string; // key into AVATAR_COLORS
  heightCm?: number;
  goalWeightKg?: number;
  createdAt: string; // ISO datetime
  entries: MeasurementEntry[];
}
