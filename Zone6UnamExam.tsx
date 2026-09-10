import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { sounds } from '../../audio';

interface Zone6Props {
  onComplete: (selectedOption: string, isCorrect: boolean, explanation: string) => void;
  onClose: () => void;
}

export const Zone6UnamExam: React.FC<Zone6Props> = ({ onComplete, onClose }) => {
  const [selectedLetter, setSelectedLetter] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const options = [
    {
      letter: 'A' as const,
      text: 'Todos sus componentes de hardware están destruidos.',
      isCorrect: false,
      feedback: 'Distractor incorrecto: El reactivo especifica explícitamente que "conserva sus componentes físicos en buen estado". El hardware no está destruido.'
    },
    {
      letter: 'B' as const,
      text: 'Existe un problema de compatibilidad entre hardware y software.',
      isCorrect: true,
      feedback: '¡RESPUESTA CORRECTA! El hardware físico funciona, pero la arquitectura de procesamiento o la versión del Sistema Operativo ya no cumple los requisitos lógicos (APIs, memoria o instrucciones) que solicitan las nuevas aplicaciones.'
    },
    {
      letter: 'C' as const,
      text: 'El dispositivo carece de unidades de entrada.',
      isCorrect: false,
      feedback: 'Distractor incorrecto: Las unidades de entrada (teclado, mouse) no tienen relación con la capacidad del sistema operativo para ejecutar código o paquetes de software reciente.'
    },
    {
      letter: 'D' as const,
      text: 'Todo dispositivo antiguo debe considerarse residuo.',
      isCorrect: false,
      feedback: 'Distractor incorrecto: Esta postura contradice la Cultura Digital y el PAEC. Un equipo que no soporte software reciente aún puede servir con sistemas ligeros (Linux), como terminal de lectura o donarse antes del desecho.'
    }
  ];

  const handleSubmit = () => {
    if (!selectedLetter) return;
    const opt = options.find(o => o.letter === selectedLetter);
    if (!opt) return;

    if (opt.isCorrect) {
      sounds.playSuccess();
    } else {
      sounds.playError();
    }
    setSubmitted(true);
  };

  const handleFinish = () => {
    if (!selectedLetter) return;
    const opt = options.find(o => o.letter === selectedLetter)!;
    onComplete(
      `${opt.letter}) ${opt.text}`,
      opt.isCorrect,
      opt.feedback
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-4 border-rose-700 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-900 via-red-950 to-slate-950 p-4 border-b-4 border-rose-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-950 border border-rose-500/40 text-rose-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-pixel text-rose-300">ZONA 6 • EXAMEN FINAL DEL MAESTRO DE SALA</span>
              <h2 className="text-lg font-bold text-white">Reactivo Crítico Razonado (Cultura Digital I)</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs bg-rose-950 hover:bg-rose-900 text-rose-200 px-3 py-1.5 rounded-lg border border-rose-800"
          >
            Volver al mapa
          </button>
        </div>

        {/* Narrative & Question */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex gap-3.5 items-start">
            <div className="w-12 h-12 rounded-full bg-rose-900 border-2 border-rose-400 flex items-center justify-center font-bold text-white shrink-0">
              JUEZ
            </div>
            <div className="text-xs sm:text-sm text-slate-200 space-y-1">
              <strong className="text-rose-400 font-pixel text-xs block">
                Maestro de Sala / Guardián del Distrito Tecnológico:
              </strong>
              <p>
                "Has recorrido las 5 estaciones del CETis diagnosticando cables, periféricos, controladores y ciclos ecológicos. Demuestra tu razonamiento crítico frente a este reactivo de evaluación formal:"
              </p>
            </div>
          </div>

          {/* Official Problem Box */}
          <div className="bg-slate-950 border-2 border-rose-600/70 rounded-xl p-5 shadow-lg">
            <span className="text-[10px] font-pixel bg-rose-950 text-rose-300 px-2.5 py-1 rounded border border-rose-800 inline-block mb-3">
              PREGUNTA DE CERTIFICACIÓN
            </span>
            <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
              "Una computadora conserva sus componentes físicos en buen estado, pero su sistema operativo ya no permite instalar aplicaciones recientes. ¿Qué explica mejor la situación?"
            </p>
          </div>

          {/* Multiple choice options */}
          <div className="space-y-2.5">
            {options.map(opt => {
              const isSelected = selectedLetter === opt.letter;
              return (
                <button
                  key={opt.letter}
                  disabled={submitted}
                  onClick={() => {
                    sounds.playSelect();
                    setSelectedLetter(opt.letter);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-rose-950/70 border-rose-400 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                      : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected ? 'bg-rose-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {opt.letter}
                  </span>
                  <p className="text-xs sm:text-sm pt-0.5 leading-relaxed">
                    {opt.text}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Formative Feedback if submitted */}
          {submitted && selectedLetter && (
            <div className="space-y-3 animate-in zoom-in-95">
              {options.find(o => o.letter === selectedLetter)?.isCorrect ? (
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-100">
                  <div className="flex items-center gap-2 font-bold text-sm mb-1 text-emerald-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>¡Respuesta Impecable! (+25 Puntos)</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    {options.find(o => o.letter === selectedLetter)?.feedback}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-100">
                  <div className="flex items-center gap-2 font-bold text-sm mb-1 text-rose-300">
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>Respuesta Incorrecta: Análisis Pedagógico</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    {options.find(o => o.letter === selectedLetter)?.feedback}
                  </p>
                </div>
              )}

              {/* Distractor Breakdown for deeper learning */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1.5">
                <strong className="text-slate-300 block mb-1">
                  Desglose de Reactivos (Rúbrica de Cultura Digital CETis 2):
                </strong>
                <p>• <strong>B</strong> es la única que reconoce la dualidad Hardware (físico intacto) vs. Software (requisitos lógicos).</p>
                <p>• <strong>A</strong> y <strong>C</strong> confunden conceptos de periféricos y estado del silicio.</p>
                <p>• <strong>D</strong> normaliza la obsolescencia prematura que la estrategia PAEC busca erradicar.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          {!submitted ? (
            <button
              disabled={!selectedLetter}
              onClick={handleSubmit}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 ${
                selectedLetter
                  ? 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer shadow-lg shadow-rose-600/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Calificar Reactivo Oficial</span>
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <span>Finalizar Evaluación y Ver Bitácora Oficial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
