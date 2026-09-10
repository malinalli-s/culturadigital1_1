import React, { useState } from 'react';
import { ShoppingBag, Laptop, CheckCircle2, ArrowRight } from 'lucide-react';
import { sounds } from '../../audio';

interface Zone4Props {
  onComplete: (isCorrect: boolean, explanation: string) => void;
  onClose: () => void;
}

export const Zone4Obsolescence: React.FC<Zone4Props> = ({ onComplete, onClose }) => {
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [classification, setClassification] = useState<string | null>(null);
  const [convinceOption, setConvinceOption] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const handleClassify = (type: string) => {
    sounds.playSelect();
    setClassification(type);
    if (type === 'obsolescencia') {
      sounds.playSuccess();
      setStage(2);
    } else {
      sounds.playError();
    }
  };

  const handleConvince = (index: number) => {
    sounds.playSelect();
    setConvinceOption(index);
    if (index === 0) {
      sounds.playSuccess();
      setStage(3);
      setFinished(true);
    } else {
      sounds.playError();
    }
  };

  const handleFinalize = () => {
    onComplete(
      true,
      'Zona 4 (Obsolescencia Percibida): Se identificó que la laptop estaba en óptimas condiciones mecánicas y de software para ofimática. Se evitó la generación de residuo electrónico orientando al usuario hacia la extensión de vida útil y donación social.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-4 border-amber-600 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-800 via-orange-900 to-slate-900 p-4 border-b-4 border-amber-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-400/40 text-amber-300">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-pixel text-amber-300">ZONA 4 • CALLEJÓN DEL TIEMPO</span>
              <h2 className="text-lg font-bold text-white">El Dilema del Consumidor Impulsivo</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs bg-amber-950 hover:bg-amber-800 text-amber-200 px-3 py-1.5 rounded-lg border border-amber-700"
          >
            Volver al mapa
          </button>
        </div>

        {/* Narrative dialogue */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex gap-3.5 items-start">
            <div className="w-12 h-12 rounded-full bg-purple-700 border-2 border-purple-400 flex items-center justify-center font-bold text-white shrink-0">
              USER
            </div>
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              <strong className="text-purple-300 font-pixel text-xs block mb-1">
                NPC Consumidor Ansioso:
              </strong>
              "¡Oye, estudiante de Cultura Digital! Voy a tirar esta laptop de inmediato al bote de basura de la esquina. Mi prima ya tiene la <em>Ultra-Book Versión 15</em> con luces RGB y bisel dorado. Esta máquina sirve para abrir mis tareas de Word, navegar en YouTube y leer PDFs al 100%, ¡pero me da pena sacarla porque se ve 'viejita'!"
            </div>
          </div>

          {/* STAGE 1: Classification Challenge */}
          {stage === 1 && (
            <div className="space-y-3 animate-in fade-in">
              <label className="text-xs font-bold text-amber-300 uppercase tracking-wide block">
                Paso 1: ¿Bajo qué fenómeno tecnológico/social clasificarías este caso?
              </label>

              <div className="space-y-2">
                {[
                  {
                    id: 'falla_fisica',
                    title: 'A) Falla Física Crítica de Hardware',
                    desc: 'La laptop está quemada y ya no enciende ningún circuito.'
                  },
                  {
                    id: 'incompatibilidad',
                    title: 'B) Incompatibilidad Técnica Total',
                    desc: 'El procesador no permite ejecutar ningún programa básico para la escuela.'
                  },
                  {
                    id: 'obsolescencia',
                    title: 'C) Obsolescencia Percibida',
                    desc: 'El dispositivo funciona perfectamente para sus necesidades, pero la mercadotecnia y la presión social le hacen creer erróneamente que ya no sirve.'
                  }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleClassify(opt.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      classification === opt.id
                        ? opt.id === 'obsolescencia'
                          ? 'bg-emerald-950/70 border-emerald-400 text-emerald-100'
                          : 'bg-rose-950/70 border-rose-500 text-rose-100'
                        : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-xs sm:text-sm mb-0.5">{opt.title}</div>
                    <p className="text-xs text-slate-400">{opt.desc}</p>
                  </button>
                ))}
              </div>

              {classification && classification !== 'obsolescencia' && (
                <div className="p-3 bg-rose-950/60 border border-rose-500 rounded-lg text-xs text-rose-200">
                  ¡Incorrecto! El personaje mismo dijo que la laptop enciende y hace todas sus tareas al 100%. Relee con atención.
                </div>
              )}
            </div>
          )}

          {/* STAGE 2: Convince the Consumer with PAEC */}
          {stage === 2 && (
            <div className="space-y-3 animate-in fade-in">
              <div className="p-3 bg-emerald-950/50 border border-emerald-500 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>¡Clasificación exacta! Ahora aplica la estrategia PAEC para convencer al personaje:</span>
              </div>

              <label className="text-xs font-bold text-amber-300 uppercase tracking-wide block">
                Paso 2: ¿Cuál es el mejor argumento técnico y ambiental para responderle?
              </label>

              <div className="space-y-2">
                {[
                  {
                    id: 0,
                    title: 'Opción A: Extensión del ciclo de vida útil o donación',
                    text: '"¡Espera! No generes basura electrónica. Tu equipo tiene excelente hardware para estudiar. Si realmente vas a comprar la versión 15, no la tires a la basura común: dónala a un compañero del CETis que no tenga computadora o reutilízala como servidor de archivos."'
                  },
                  {
                    id: 1,
                    title: 'Opción B: Desecho inmediato y compra de nuevo modelo',
                    text: '"Tienes razón, tírala al camión de basura común para que la compacten con los restos de comida, y compra a crédito la versión 15 hoy mismo."'
                  }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleConvince(item.id)}
                    className="w-full text-left p-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl transition-all cursor-pointer"
                  >
                    <div className="font-bold text-xs sm:text-sm text-slate-200 mb-1">
                      {item.title}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.text}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 3: Success Resolution */}
          {stage === 3 && (
            <div className="space-y-4 animate-in zoom-in-95">
              <div className="bg-slate-800/90 border border-emerald-500/60 rounded-xl p-4 flex gap-3.5 items-start">
                <Laptop className="w-8 h-8 text-emerald-400 shrink-0 mt-1" />
                <div className="text-xs sm:text-sm text-slate-200 space-y-2">
                  <strong className="text-emerald-300 block font-pixel text-xs">
                    Consumidor convencido:
                  </strong>
                  <p>
                    "¡Tienes toda la razón, compañero! No me había dado cuenta de lo contaminante que es tirar litio y circuitos al basurero, ni del valor que tiene este equipo para estudiar. Se la regalaré a mi hermano menor para sus clases de bachillerato."
                  </p>
                  <p className="text-xs text-cyan-300 font-pixel">
                    ¡Residuo prevenido con éxito! +20 Puntos ambientales.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          {finished && (
            <button
              onClick={handleFinalize}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <span>Avanzar a Estación Cero Basura (PAEC)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
