import React, { useState } from 'react';
import { StudentInfo } from '../types';
import {
  User,
  Users,
  Play,
  Sparkles,
  AlertTriangle,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { sounds } from '../audio';

interface StartScreenModalProps {
  currentStudent: StudentInfo;
  onStartNewGame: (data: { name: string; group: string; schoolId: string }) => void;
}

export const StartScreenModal: React.FC<StartScreenModalProps> = ({
  currentStudent,
  onStartNewGame
}) => {
  const [name, setName] = useState(currentStudent.name || '');
  const [group, setGroup] = useState(currentStudent.group || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage('Por favor escribe tu nombre para la Bitácora.');
      sounds.playError();
      return;
    }

    const trimmedGroup = group.trim() || '1º Semestre';

    sounds.playSuccess();
    onStartNewGame({
      name: trimmedName,
      group: trimmedGroup,
      schoolId: currentStudent.schoolId || ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-2 border-cyan-500/60 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden text-slate-100 relative">
        
        {/* Decorative Top Glowing Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-cyan-400 to-amber-400"></div>

        {/* Header Section */}
        <div className="p-5 sm:p-6 bg-slate-950/70 border-b border-slate-800 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-pixel mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>CULTURA DIGITAL I • EVALUACIÓN FORMATIVA</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2">
            <span>Distrito Tecnológico CETis</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            Registro del Estudiante y Apertura de Bitácora Técnica
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleStart} className="p-5 sm:p-6 space-y-4">
          
          {/* Instructions Box */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
            <FileText className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              Ingresa tu <strong className="text-cyan-300">Nombre</strong> y <strong className="text-cyan-300">Grupo</strong> para iniciar la expedición. Tus datos quedarán registrados en la Bitácora Técnica y en el reporte final.
            </div>
          </div>

          {/* Student Name Input */}
          <div>
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Nombre Completo <span className="text-red-400">*</span></span>
            </label>
            <input
              type="text"
              autoFocus
              placeholder="Ej. Ana Sofía Morales Hernández"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 font-medium transition-colors outline-none"
            />
          </div>

          {/* Group Input */}
          <div>
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Grupo / Semestre</span>
            </label>
            <input
              type="text"
              placeholder="Ej. 1º A"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 font-medium transition-colors outline-none"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-950/60 border border-red-500 rounded-xl text-xs text-red-200 flex items-center gap-2 animate-shake">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Main Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>INICIAR</span>
            </button>
          </div>

          {/* Footer Security Badge */}
          <div className="pt-1 text-center flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Datos guardados en la Bitácora local</span>
          </div>

        </form>
      </div>
    </div>
  );
};
