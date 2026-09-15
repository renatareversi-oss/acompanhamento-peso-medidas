import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { MeasurementEntry, Participant } from '../types';
import { STORAGE_KEY } from '../lib/constants';

function loadInitial(): Participant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Participant[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

interface NewParticipantInput {
  name: string;
  emoji: string;
  color: string;
  heightCm?: number;
  goalWeightKg?: number;
}

interface ParticipantsContextValue {
  participants: Participant[];
  getParticipant: (id: string) => Participant | undefined;
  addParticipant: (input: NewParticipantInput) => Participant;
  updateParticipant: (id: string, patch: Partial<Omit<Participant, 'id' | 'entries' | 'createdAt'>>) => void;
  deleteParticipant: (id: string) => void;
  addEntry: (participantId: string, entry: Omit<MeasurementEntry, 'id'>) => void;
  updateEntry: (participantId: string, entryId: string, patch: Partial<Omit<MeasurementEntry, 'id'>>) => void;
  deleteEntry: (participantId: string, entryId: string) => void;
  importAll: (participants: Participant[]) => void;
}

const ParticipantsContext = createContext<ParticipantsContextValue | null>(null);

export function ParticipantsProvider({ children }: { children: ReactNode }) {
  const [participants, setParticipants] = useState<Participant[]>(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
    } catch {
      // ignore write errors (e.g. private browsing quota)
    }
  }, [participants]);

  const value = useMemo<ParticipantsContextValue>(() => ({
    participants,
    getParticipant: (id) => participants.find((p) => p.id === id),
    addParticipant: (input) => {
      const participant: Participant = {
        id: uid(),
        name: input.name.trim(),
        emoji: input.emoji,
        color: input.color,
        heightCm: input.heightCm,
        goalWeightKg: input.goalWeightKg,
        createdAt: new Date().toISOString(),
        entries: [],
      };
      setParticipants((prev) => [...prev, participant]);
      return participant;
    },
    updateParticipant: (id, patch) => {
      setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    },
    deleteParticipant: (id) => {
      setParticipants((prev) => prev.filter((p) => p.id !== id));
    },
    addEntry: (participantId, entry) => {
      setParticipants((prev) =>
        prev.map((p) => {
          if (p.id !== participantId) return p;
          const newEntry: MeasurementEntry = { ...entry, id: uid() };
          const entries = [...p.entries, newEntry].sort((a, b) => a.date.localeCompare(b.date));
          return { ...p, entries };
        }),
      );
    },
    updateEntry: (participantId, entryId, patch) => {
      setParticipants((prev) =>
        prev.map((p) => {
          if (p.id !== participantId) return p;
          const entries = p.entries
            .map((e) => (e.id === entryId ? { ...e, ...patch } : e))
            .sort((a, b) => a.date.localeCompare(b.date));
          return { ...p, entries };
        }),
      );
    },
    deleteEntry: (participantId, entryId) => {
      setParticipants((prev) =>
        prev.map((p) => (p.id === participantId ? { ...p, entries: p.entries.filter((e) => e.id !== entryId) } : p)),
      );
    },
    importAll: (imported) => {
      setParticipants(imported);
    },
  }), [participants]);

  return <ParticipantsContext.Provider value={value}>{children}</ParticipantsContext.Provider>;
}

export function useParticipants(): ParticipantsContextValue {
  const ctx = useContext(ParticipantsContext);
  if (!ctx) throw new Error('useParticipants deve ser usado dentro de ParticipantsProvider');
  return ctx;
}
