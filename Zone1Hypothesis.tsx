import React, { useState } from 'react';
import { Package, HelpCircle, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { sounds } from '../../audio';

interface Zone1Props {
  onComplete: (hypothesisText: string, isCorrect: boolean, explanation: string) => void;
  onClose: () => void;
}

export const Zone1Hypothesis: React.FC<Zone1Props> = ({ onComplete, onClose }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [customNote, setCustomNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const options = [
    {
      id: 0,
      title: 'Hipótesis A: Falla de hardware fatal (Residuo inservible)',
      text: 'Es basura inservible. Si alguien lo puso en la caja, significa que sus circuitos internos están destruidos y debe botarse al basurero municipal.',
      isCorrect: false,
      feedback: '¡Cuidado! Desechar un periférico sin diagnosticarlo primero alimenta la crisis de basura electrónica. Muchas veces el problema no es físico ni fatal.'
    },
    {
      id: 1,
      title: 'Hipótesis B: Falla lógica de software o desconfiguración menor',
      text: 'No necesariamente es basura. Si ayer funcionaba, el hardware físico (teclas, cable) podría estar sano y la falla podría ser de software (distribución de idioma) o un puerto sucio antes de condenarlo.',
      isCorrect: true,
      feedback: '¡Excelente hipótesis tecnológica! El principio fundamental de Cultura Digital y la estrategia PAEC es "Cero Basura antes del desecho": diagnosticar minuciosamente antes de considerar algo como chatarra.'
    },
    {
      id: 2,
      title: 'Hipótesis C: Incompatibilidad por tecnología obsoleta',
      text: 'Todo teclado con cable USB es obsoleto y no vale la pena revisarlo porque ahora todo debe ser inalámbrico o por Bluetooth.',
      isCorrect: false,
      feedback: 'Esta es una falacia de obsolescencia percibida. Los periféricos con cable USB siguen siendo el estándar industrial más estable y de menor latencia.'
    }
  ];

  const handleSubmit = () => {
    if (selectedOption === null) return;
    const choice = options[selectedOption];
    if (choice.isCorrect) {
      sounds.playSuccess();
    } else {
      sounds.playError();
    }
    setSubmitted(true);
  };

  const handleContinue = () => {
    if (selectedOption === null) return;
    const choice = options[selectedOption];
    const fullText = choice.text + (customNote ? ` | Nota personal: "${customNote}"` : '');
    onComplete(fullText, choice.isCorrect, choice.feedback);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-4 border-amber-600/80 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 to-amber-900 p-4 border-b-4 border-amber-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-400/40 text-amber-300">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-pixel text-amber-300">ZONA 1 • PLAZA INICIAL</span>
              <h2 className="text-lg font-bold text-white">La Caja del Misterio ("Ayer todavía funcionaba")</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs bg-amber-950 hover:bg-amber-800 text-amber-200 px-3 py-1.5 rounded-lg border border-amber-700"
          >
            Volver al mapa
          </button>
        </div>

        {/* Narrative Banner */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex gap-3.5 items-start">
            <div className="w-12 h-12 rounded-full bg-emerald-700 border-2 border-emerald-400 flex items-center justify-center font-bold text-white shrink-0">
              PROF
            </div>
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              <strong className="text-emerald-400 block font-pixel text-xs mb-1">
                Profesor de Cultura Digital:
              </strong>
              "¡Hola, futuro técnico! Mira esta caja de cartón abandonada junto al árbol. Dice 'BASURA', pero tiene pegada una nota adhesiva que dice: <em>'Ayer todavía funcionaba'</em>. Dentro hay un teclado completo. ¿Por qué alguien se desharía de él tan rápido? ¿Es realmente basura? Plantea tu hipótesis técnica para iniciar el peritaje."
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              Selecciona tu Hipótesis Inicial de Diagnóstico:
            </label>

            {options.map(opt => (
              <button
                key={opt.id}
                disabled={submitted}
                onClick={() => {
                  sounds.playSelect();
                  setSelectedOption(opt.id);
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  selectedOption === opt.id
                    ? 'bg-amber-950/60 border-amber-400 text-white shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                    : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="font-bold text-xs sm:text-sm text-amber-300 mb-1">
                  {opt.title}
                </div>
                <p className="text-xs leading-relaxed text-slate-300">
                  {opt.text}
                </p>
              </button>
            ))}
          </div>

          {/* Custom reflection */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">
              Tu justificación adicional o notas para la Bitácora (Opcional):
            </label>
            <input
              type="text"
              disabled={submitted}
              placeholder="Ej: Sospecho que presionaron una tecla de idioma sin querer..."
              value={customNote}
              onChange={e => setCustomNote(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Formative Feedback if submitted */}
          {submitted && selectedOption !== null && (
            <div
              className={`p-4 rounded-xl border animate-in zoom-in-95 duration-200 ${
                options[selectedOption].isCorrect
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-100'
                  : 'bg-rose-950/70 border-rose-500 text-rose-100'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm mb-1.5">
                {options[selectedOption].isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>¡Hipótesis Razonada Aprobada! (+15 Puntos)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <span>Retroalimentación Formativa:</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed">
                {options[selectedOption].feedback}
              </p>
              <p className="text-[11px] text-cyan-300 font-pixel mt-2">
                ¡Conceptos 'Hardware' y 'Software' desbloqueados en tu DEX-Glosario!
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-3">
          {!submitted ? (
            <button
              disabled={selectedOption === null}
              onClick={handleSubmit}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                selectedOption !== null
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              Confirmar Hipótesis
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <span>Entrar al Laboratorio de Diagnóstico</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
