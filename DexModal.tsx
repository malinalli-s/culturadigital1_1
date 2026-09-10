import React, { useState } from 'react';
import { DexEntry } from '../types';
import { BookOpen, Smartphone, Cpu, CheckCircle2, Lock, X, Search, Sparkles } from 'lucide-react';
import { sounds } from '../audio';

interface DexModalProps {
  entries: DexEntry[];
  unlockedIds: string[];
  onClose: () => void;
}

export const DexModal: React.FC<DexModalProps> = ({ entries, unlockedIds, onClose }) => {
  const [filter, setFilter] = useState<'all' | 'hardware' | 'software' | 'ambiente' | 'sistema'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<DexEntry | null>(
    entries.find(e => unlockedIds.includes(e.id)) || entries[0]
  );

  const unlockedCount = entries.filter(e => unlockedIds.includes(e.id)).length;

  const filteredEntries = entries.filter(entry => {
    const matchesCategory = filter === 'all' || entry.category === filter;
    const matchesSearch = entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.simpleDefinition.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-4 border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Retro Header styled like a high-tech Game Boy Pokédex */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 p-4 border-b-4 border-red-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_12px_rgba(34,211,238,0.8)] flex items-center justify-center text-slate-950 font-bold">
              <BookOpen className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-wide flex items-center gap-2">
                DEX-GLOSARIO TÉCNICO
                <span className="text-xs font-pixel bg-slate-900/80 px-2 py-0.5 rounded text-cyan-300">
                  CETis 2
                </span>
              </h2>
              <p className="text-xs text-red-100/90">
                Enciclopedia de Cultura Digital I • Analogías de Computadora vs. Celular
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs font-semibold bg-red-950/70 border border-red-400/40 px-3 py-1 rounded-full text-red-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Desbloqueados: </span>
              <strong className="text-white font-bold">{unlockedCount} / {entries.length}</strong>
            </div>
            <button
              onClick={() => {
                sounds.playSelect();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-red-900 hover:bg-red-800 text-white transition-colors"
              title="Cerrar Glosario"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-3 sm:p-4 bg-slate-800/80 border-b border-slate-700 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'hardware', label: 'Hardware' },
              { id: 'software', label: 'Software' },
              { id: 'sistema', label: 'Sistemas' },
              { id: 'ambiente', label: 'Ambiente / PAEC' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playSelect();
                  setFilter(tab.id as typeof filter);
                }}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  filter === tab.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64 mt-2 sm:mt-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Buscar concepto..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Content Body: List on left, Details on right */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
          {/* Entries Sidebar */}
          <div className="md:col-span-5 p-3 overflow-y-auto border-b md:border-b-0 md:border-r border-slate-700 space-y-2 max-h-60 md:max-h-none">
            {filteredEntries.map(entry => {
              const isUnlocked = unlockedIds.includes(entry.id);
              const isSelected = selectedEntry?.id === entry.id;

              return (
                <button
                  key={entry.id}
                  onClick={() => {
                    sounds.playSelect();
                    setSelectedEntry(entry);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                      : isUnlocked
                      ? 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-200'
                      : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <div className="truncate">
                      <p className="font-semibold text-xs sm:text-sm truncate">
                        {entry.name}
                      </p>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {entry.category}
                      </span>
                    </div>
                  </div>
                  {isUnlocked && (
                    <span className="text-[10px] font-pixel text-cyan-400 shrink-0">
                      LEER
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Detailed View */}
          <div className="md:col-span-7 p-4 sm:p-6 overflow-y-auto bg-slate-950/70 flex flex-col justify-between">
            {selectedEntry ? (
              unlockedIds.includes(selectedEntry.id) ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xs uppercase font-pixel tracking-wider text-cyan-400">
                        ENTRADA #{entries.indexOf(selectedEntry) + 1} • {selectedEntry.category}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                        {selectedEntry.name}
                      </h3>
                    </div>
                    <span className="text-xs bg-emerald-950 border border-emerald-500/50 text-emerald-300 px-2.5 py-1 rounded-full">
                      Desbloqueado
                    </span>
                  </div>

                  {/* Card 1: Definición sencilla */}
                  <div className="bg-slate-900 border border-cyan-900/60 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wide mb-1.5">
                      <Cpu className="w-4 h-4" />
                      Definición Rápida (En pocas palabras)
                    </div>
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                      "{selectedEntry.simpleDefinition}"
                    </p>
                  </div>

                  {/* Card 2: Analogía con el Celular */}
                  <div className="bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-700/40 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wide mb-1.5">
                      <Smartphone className="w-4 h-4 text-indigo-400" />
                      ¿Cómo se ve esto en tu Teléfono Celular?
                    </div>
                    <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                      {selectedEntry.phoneAnalogy}
                    </p>
                  </div>

                  {/* Card 3: Nota Técnica Bachillerato */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300">
                    <span className="font-bold text-slate-400 block mb-1">
                      Concepto Formal de Cultura Digital I:
                    </span>
                    <p className="italic text-slate-400">
                      {selectedEntry.technicalNote}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-slate-600">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-300">
                    Concepto Bloqueado: {selectedEntry.name}
                  </h4>
                  <p className="text-xs sm:text-sm max-w-sm text-slate-400">
                    Explora el Distrito Tecnológico CETis y resuelve los casos de diagnóstico para desbloquear esta definición.
                  </p>
                  <span className="text-xs bg-slate-800 text-cyan-400 px-3 py-1 rounded-full font-mono">
                    Lugar: {selectedEntry.zone}
                  </span>
                </div>
              )
            ) : null}

            <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>CETis 2 • Propósito Formativo 1</span>
              <span>Usa ESC o el botón para cerrar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
