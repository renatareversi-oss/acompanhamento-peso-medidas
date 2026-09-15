import { useState } from 'react';
import { useParticipants } from '../store/ParticipantsContext';
import { ParticipantCard } from '../components/ParticipantCard';
import { ParticipantFormModal } from '../components/ParticipantFormModal';

export function Home() {
  const { participants, addParticipant } = useParticipants();
  const [showAdd, setShowAdd] = useState(false);

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
      </header>

      {participants.length === 0 ? (
        <div className="text-center bg-white/70 backdrop-blur rounded-3xl p-10 border border-white shadow-sm animate-pop-in">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {participants.map((p) => (
            <ParticipantCard key={p.id} participant={p} />
          ))}
          <button
            onClick={() => setShowAdd(true)}
            className="flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-[#ffb6c9] text-[var(--color-primary-dark)] hover:bg-white/60 transition-colors min-h-[132px] font-heading font-bold animate-pop-in"
          >
            <span className="text-3xl">+</span>
            Adicionar participante
          </button>
        </div>
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
    </div>
  );
}
