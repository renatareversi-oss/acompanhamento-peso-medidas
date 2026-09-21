import { useMemo, useRef, useState } from 'react';
import { useParticipants } from '../store/ParticipantsContext';
import { ParticipantCard } from '../components/ParticipantCard';
import { ParticipantFormModal } from '../components/ParticipantFormModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { latestEntry } from '../lib/utils';
import type { Participant } from '../types';

type SortOption = 'recent' | 'name' | 'newest';

const SORT_LABELS: Record<SortOption, string> = {
  recent: 'Atualizado recentemente',
  name: 'Nome (A-Z)',
  newest: 'Adicionado recentemente',
};

function lastActivityDate(participant: Participant): string {
  return latestEntry(participant)?.date ?? participant.createdAt.slice(0, 10);
}

function isValidParticipantList(value: unknown): value is Participant[] {
  return (
    Array.isArray(value) &&
    value.every(
      (p) =>
        p &&
        typeof p === 'object' &&
        typeof (p as Participant).id === 'string' &&
        typeof (p as Participant).name === 'string' &&
        Array.isArray((p as Participant).entries),
    )
  );
}

export function Home() {
  const { participants, addParticipant, importAll } = useParticipants();
  const [showAdd, setShowAdd] = useState(false);
  const [pendingImport, setPendingImport] = useState<Participant[] | null>(null);
  const [importError, setImportError] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const visibleParticipants = useMemo(() => {
    const filtered = search.trim()
      ? participants.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()))
      : participants;
    const sorted = [...filtered];
    if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } else {
      sorted.sort((a, b) => lastActivityDate(b).localeCompare(lastActivityDate(a)));
    }
    return sorted;
  }, [participants, search, sortBy]);

  function handleExport() {
    const blob = new Blob([JSON.stringify(participants, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `peso-medidas-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!isValidParticipantList(parsed)) {
          setImportError('Esse arquivo não parece um backup válido.');
          return;
        }
        setImportError('');
        setPendingImport(parsed);
      } catch {
        setImportError('Não foi possível ler esse arquivo JSON.');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <header className="text-center mb-10">
        <p className="text-sm font-semibold text-[var(--color-primary-dark)] tracking-wide uppercase">
          bem-vinda de volta
        </p>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold mt-1 flex items-center justify-center gap-2">
          <span>💗</span> Acompanhamento de Peso &amp; Medidas
        </h1>
        <p className="text-[var(--color-text-soft)] mt-2 max-w-md mx-auto">
          Acompanhe a evolução de cada participante com carinho, de um jeitinho fofo e simples.
        </p>

        <div className="flex items-center justify-center gap-2 mt-4">
          {participants.length > 0 && (
            <button
              onClick={handleExport}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--color-surface)]/80 text-[var(--color-text-soft)] hover:text-[var(--color-text)] border border-[var(--color-border)] transition-colors"
            >
              ⬇️ Exportar dados
            </button>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--color-surface)]/80 text-[var(--color-text-soft)] hover:text-[var(--color-text)] border border-[var(--color-border)] transition-colors"
          >
            ⬆️ Importar dados
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" onChange={handleFileChosen} className="hidden" />
        </div>
        {importError && <p className="text-xs text-[#e6486a] mt-2">{importError}</p>}
      </header>

      {participants.length === 0 ? (
        <div className="text-center bg-[var(--color-surface)]/70 backdrop-blur rounded-3xl p-10 border border-[var(--color-border)] shadow-sm animate-pop-in">
          <div className="text-5xl mb-3">🌸</div>
          <h2 className="font-heading text-xl font-bold">Nenhum participante ainda</h2>
          <p className="text-[var(--color-text-soft)] mt-1 mb-5">
            Adicione a primeira pessoa para começar a acompanhar o progresso.
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-heading font-bold px-6 py-3 shadow-lg shadow-pink-200 transition-colors"
          >
            + Adicionar participante
          </button>
        </div>
      ) : (
        <>
          {participants.length > 1 && (
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔎 Buscar participante..."
                className="flex-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[#ffd6e3] dark:focus:ring-[#ff8fab]/30 transition"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 px-3 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] transition"
              >
                {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                  <option key={opt} value={opt}>
                    {SORT_LABELS[opt]}
                  </option>
                ))}
              </select>
            </div>
          )}

          {visibleParticipants.length === 0 ? (
            <p className="text-center text-[var(--color-text-soft)] py-10">
              Nenhum participante encontrado para "{search}".
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleParticipants.map((p) => (
                <ParticipantCard key={p.id} participant={p} />
              ))}
              <button
                onClick={() => setShowAdd(true)}
                className="flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-[#ffb6c9] text-[var(--color-primary-dark)] hover:bg-[var(--color-surface)]/60 transition-colors min-h-[132px] font-heading font-bold animate-pop-in"
              >
                <span className="text-3xl">+</span>
                Adicionar participante
              </button>
            </div>
          )}
        </>
      )}

      {showAdd && (
        <ParticipantFormModal
          onClose={() => setShowAdd(false)}
          onSubmit={(data) => {
            addParticipant(data);
            setShowAdd(false);
          }}
        />
      )}

      {pendingImport && (
        <ConfirmDialog
          title="Importar backup?"
          message={`Isso vai substituir os dados atuais por ${pendingImport.length} participante(s) do arquivo importado. Essa ação não pode ser desfeita.`}
          confirmLabel="Importar"
          onCancel={() => setPendingImport(null)}
          onConfirm={() => {
            importAll(pendingImport);
            setPendingImport(null);
          }}
        />
      )}
    </div>
  );
}
