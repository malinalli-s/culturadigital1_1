import React, { useState } from 'react';
import { Recycle, CheckCircle2, ArrowRight } from 'lucide-react';
import { sounds } from '../../audio';

interface Zone5Props {
  onComplete: (isCorrect: boolean, explanation: string) => void;
  onClose: () => void;
}

interface DeviceCase {
  id: number;
  name: string;
  description: string;
  condition: string;
  correctSteps: {
    works: boolean;
    repairable?: boolean;
    reusable?: boolean;
    finalOutcome: string;
  };
}

export const Zone5PaecTree: React.FC<Zone5Props> = ({ onComplete, onClose }) => {
  const devices: DeviceCase[] = [
    {
      id: 1,
      name: 'Equipo de Biblioteca (Año 2018)',
      description: 'Gabinete Core i3. Funciona al 100%, solo tiene el disco duro un poco lleno con catálogos de libros.',
      condition: 'Totalmente operativo para navegación y ofimática.',
      correctSteps: {
        works: true,
        finalOutcome: 'Seguir usando (Optimizar almacenamiento / Instalar Linux ligero)'
      }
    },
    {
      id: 2,
      name: 'Fuente de Poder de Taller con Capacitor Dañado',
      description: 'No enciende la computadora. Al abrirla con el técnico, se observa un capacitor electrolítico inflado de $10 pesos.',
      condition: 'No enciende actualmente, pero el 98% del circuito está sano.',
      correctSteps: {
        works: false,
        repairable: true,
        finalOutcome: 'Reparar (Sustituir capacitor defectuoso y devolver al servicio)'
      }
    },
    {
      id: 3,
      name: 'Batería Inflada y Tarjeta Madre Quebrada',
      description: 'Laptop aplastada accidentalmente en almacén. Placa base partida en dos y celda de iones de litio deformada.',
      condition: 'Daño físico estructural irreversible y químico peligroso.',
      correctSteps: {
        works: false,
        repairable: false,
        reusable: false,
        finalOutcome: 'Punto Limpio / Manejo Especializado RAEE (Peligro de metales pesados y litio)'
      }
    }
  ];

  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [stepInTree, setStepInTree] = useState<'works' | 'repair' | 'reuse' | 'outcome'>('works');
  const [userChoices, setUserChoices] = useState<{ works?: boolean; repair?: boolean; reuse?: boolean }>({});
  const [outcomeMessage, setOutcomeMessage] = useState<string | null>(null);
  const [resolvedCases, setResolvedCases] = useState<number[]>([]);

  const currentDevice = devices[currentCaseIndex];

  // Flowchart decision logic
  const handleWorksAnswer = (works: boolean) => {
    sounds.playSelect();
    setUserChoices(prev => ({ ...prev, works }));

    if (works) {
      if (currentDevice.correctSteps.works === true) {
        setOutcomeMessage(`¡Correcto! -> ${currentDevice.correctSteps.finalOutcome}`);
        sounds.playSuccess();
      } else {
        setOutcomeMessage('Incorrecto: Este aparato no funciona, requiere revisión diagnóstica.');
        sounds.playError();
      }
      setStepInTree('outcome');
    } else {
      if (currentDevice.correctSteps.works === false) {
        setStepInTree('repair');
      } else {
        setOutcomeMessage('Incorrecto: Este equipo sí funciona plenamente para sus funciones básicas.');
        sounds.playError();
        setStepInTree('outcome');
      }
    }
  };

  const handleRepairAnswer = (canRepair: boolean) => {
    sounds.playSelect();
    setUserChoices(prev => ({ ...prev, repair: canRepair }));

    if (canRepair) {
      if (currentDevice.correctSteps.repairable === true) {
        setOutcomeMessage(`¡Correcto! -> ${currentDevice.correctSteps.finalOutcome}`);
        sounds.playSuccess();
      } else {
        setOutcomeMessage('Incorrecto: La placa está rota físicamente y no tiene reparación viable.');
        sounds.playError();
      }
      setStepInTree('outcome');
    } else {
      if (currentDevice.correctSteps.repairable === false) {
        setStepInTree('reuse');
      } else {
        setOutcomeMessage('Incorrecto: Cambiar un solo capacitor cuesta $10 y repara el equipo.');
        sounds.playError();
        setStepInTree('outcome');
      }
    }
  };

  const handleReuseAnswer = (canReuse: boolean) => {
    sounds.playSelect();
    setUserChoices(prev => ({ ...prev, reuse: canReuse }));

    if (canReuse) {
      setOutcomeMessage('No es reutilizable porque contiene químicos dañados y placas partidas.');
      sounds.playError();
      setStepInTree('outcome');
    } else {
      setOutcomeMessage(`¡Correcto! -> ${currentDevice.correctSteps.finalOutcome}`);
      sounds.playSuccess();
      setStepInTree('outcome');
    }
  };

  const handleNextDevice = () => {
    if (!resolvedCases.includes(currentDevice.id)) {
      setResolvedCases(prev => [...prev, currentDevice.id]);
    }

    if (currentCaseIndex < devices.length - 1) {
      setCurrentCaseIndex(prev => prev + 1);
      setStepInTree('works');
      setUserChoices({});
      setOutcomeMessage(null);
    }
  };

  const isAllDone = resolvedCases.length === devices.length || (resolvedCases.length === 2 && outcomeMessage?.includes('Correcto'));

  const handleFinalSuccess = () => {
    onComplete(
      true,
      'Zona 5 (Estrategia PAEC Cero Basura): Se clasificaron exitosamente 3 dispositivos con el árbol algorítmico oficial: 1) Mantener en uso, 2) Reparar por bajo costo, y 3) Canalizar a Manejo Especializado de RAEE.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-4 border-teal-600 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 via-emerald-900 to-slate-900 p-4 border-b-4 border-teal-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-950/80 border border-teal-400/40 text-teal-300">
              <Recycle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-pixel text-teal-300">ZONA 5 • ESTRATEGIA PAEC</span>
              <h2 className="text-lg font-bold text-white">Árbol Algorítmico "Cero Basura antes del desecho"</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs bg-teal-950 hover:bg-teal-800 text-teal-200 px-3 py-1.5 rounded-lg border border-teal-700"
          >
            Volver al mapa
          </button>
        </div>

        {/* Current device banner */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-900/60 border border-teal-500/50 text-xs font-pixel text-teal-300">
              Caso {currentCaseIndex + 1} de {devices.length}
            </span>
            <span className="text-sm font-bold text-slate-200">{currentDevice.name}</span>
          </div>
          <span className="text-xs text-slate-400">
            Resueltos: <strong className="text-teal-400">{resolvedCases.length} / 3</strong>
          </span>
        </div>

        {/* Main interactive tree */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-xs sm:text-sm text-slate-300 space-y-2">
            <p><strong>Descripción del equipo:</strong> {currentDevice.description}</p>
            <p className="text-teal-300 italic">Estado: {currentDevice.condition}</p>
          </div>

          {/* Flowchart step questions */}
          <div className="bg-slate-950 border-2 border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-pixel text-teal-400 uppercase tracking-wide">
              Diagrama de Flujo Oficial de Diagnóstico:
            </h4>

            {/* Step 1: Does it work? */}
            <div className={`p-3 rounded-lg border transition-all ${
              stepInTree === 'works' ? 'bg-teal-950/60 border-teal-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <span className="font-bold text-xs block mb-1">Nodo 1: ¿El dispositivo todavía funciona?</span>
              {stepInTree === 'works' && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleWorksAnswer(true)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    SÍ (Funciona)
                  </button>
                  <button
                    onClick={() => handleWorksAnswer(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    NO (Falla o no enciende)
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: Can it be repaired? */}
            {stepInTree === 'repair' && (
              <div className="p-3 rounded-lg border bg-teal-950/60 border-teal-400 text-white animate-in fade-in">
                <span className="font-bold text-xs block mb-1">Nodo 2: ¿Puede repararse por una pieza económica?</span>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleRepairAnswer(true)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    SÍ (Es reparable)
                  </button>
                  <button
                    onClick={() => handleRepairAnswer(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    NO (Daño físico total)
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Can it be reused/repurposed? */}
            {stepInTree === 'reuse' && (
              <div className="p-3 rounded-lg border bg-teal-950/60 border-teal-400 text-white animate-in fade-in">
                <span className="font-bold text-xs block mb-1">Nodo 3: ¿Puede reutilizarse o reasignarse otra función?</span>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleReuseAnswer(true)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    SÍ (Reasignar)
                  </button>
                  <button
                    onClick={() => handleReuseAnswer(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    NO (Peligro o inservible)
                  </button>
                </div>
              </div>
            )}

            {/* Result Outcome */}
            {stepInTree === 'outcome' && outcomeMessage && (
              <div className={`p-4 rounded-xl border animate-in zoom-in-95 ${
                outcomeMessage.includes('Correcto')
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-100'
                  : 'bg-rose-950/70 border-rose-500 text-rose-100'
              }`}>
                <div className="flex items-center gap-2 font-bold text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Dictamen Ambiental PAEC:</span>
                </div>
                <p className="text-xs leading-relaxed">{outcomeMessage}</p>

                {currentCaseIndex < devices.length - 1 && (
                  <button
                    onClick={handleNextDevice}
                    className="mt-3 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-2"
                  >
                    <span>Pasar al siguiente caso</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          {isAllDone && (
            <button
              onClick={handleFinalSuccess}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <span>Acceder al Examen Final de Sala (UNAM)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
