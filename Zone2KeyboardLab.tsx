import React, { useState } from 'react';
import { Cpu, CheckCircle2, RotateCcw, ArrowRight, Globe } from 'lucide-react';
import { sounds } from '../../audio';

interface Zone2Props {
  onComplete: (isCorrect: boolean, explanation: string) => void;
  onClose: () => void;
}

export const Zone2KeyboardLab: React.FC<Zone2Props> = ({ onComplete, onClose }) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [typedOutput, setTypedOutput] = useState<string>('');
  const [hardwareInspected, setHardwareInspected] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<'AZERTY' | 'QWERTY_EN' | 'QWERTY_ES'>('AZERTY');
  const [fixedVerified, setFixedVerified] = useState(false);

  // Key press simulator
  const handleSimulateKey = (key: string) => {
    sounds.playTextBlip();
    if (selectedLayout === 'AZERTY') {
      // Map A to Q, Z to W, etc.
      const map: Record<string, string> = { A: 'Q', Q: 'A', Z: 'W', W: 'Z', M: ',', ',': 'M' };
      const outputKey = map[key.toUpperCase()] || key;
      setTypedOutput(prev => prev + outputKey);
    } else {
      setTypedOutput(prev => prev + key);
    }
  };

  const clearTyped = () => {
    sounds.playSelect();
    setTypedOutput('');
  };

  const handleFinish = () => {
    sounds.playSuccess();
    onComplete(
      true,
      'Se comprobó que el hardware (circuito y cable) estaba intacto. El fallo era puramente de software: la distribución lógica estaba en Francés (AZERTY) en lugar de Español (QWERTY).'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-4 border-cyan-600 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-800 to-sky-900 p-4 border-b-4 border-cyan-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-300">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-pixel text-cyan-300">ZONA 3 • LABORATORIO DE DIAGNÓSTICO</span>
              <h2 className="text-lg font-bold text-white">Inspección Forense: Hardware vs. Software</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs bg-cyan-950 hover:bg-cyan-800 text-cyan-200 px-3 py-1.5 rounded-lg border border-cyan-700"
          >
            Volver al mapa
          </button>
        </div>

        {/* Stepper tracker */}
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-1">
            {[
              { num: 1, label: '1. Prueba de Síntoma' },
              { num: 2, label: '2. Revisión Hardware' },
              { num: 3, label: '3. Ajuste de Software' },
              { num: 4, label: '4. Verificación Final' }
            ].map(step => (
              <span
                key={step.num}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap ${
                  activeStep === step.num
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : activeStep > step.num
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
            ))}
          </div>
        </div>

        {/* Content View based on step */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* STEP 1: Symptom */}
          {activeStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong className="text-cyan-400 font-pixel text-xs block mb-1">
                  Paso 1: Detectar el Comportamiento Anómalo
                </strong>
                Conectamos el teclado rescatado de la caja a nuestra estación de prueba. Oprime los botones de prueba en pantalla para redactar la palabra <strong className="text-amber-300 font-mono">"HOLA"</strong> o prueba la tecla <strong className="text-amber-300 font-mono">"A"</strong>:
              </div>

              {/* Virtual typing test box */}
              <div className="bg-slate-950 border-2 border-cyan-500/60 rounded-xl p-4 text-center">
                <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
                  <span>Pantalla de prueba del teclado:</span>
                  <button
                    onClick={clearTyped}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Limpiar
                  </button>
                </div>
                <div className="min-h-12 bg-slate-900 border border-slate-800 rounded-lg p-3 text-lg font-mono font-bold tracking-widest text-cyan-300 flex items-center justify-center">
                  {typedOutput || <span className="text-slate-600 text-sm">Oprime los botones abajo...</span>}
                </div>

                {/* Test keys */}
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {['A', 'Z', 'H', 'O', 'L', 'Q', 'W', 'ESPACIO'].map(k => (
                    <button
                      key={k}
                      onClick={() => handleSimulateKey(k === 'ESPACIO' ? ' ' : k)}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-cyan-900/60 border border-slate-600 hover:border-cyan-400 rounded-lg font-bold text-sm text-white transition-transform active:scale-95 shadow"
                    >
                      {k}
                    </button>
                  ))}
                </div>

                {typedOutput.includes('Q') && (
                  <div className="mt-4 p-3 bg-amber-950/60 border border-amber-500/50 rounded-lg text-xs text-amber-200 text-left animate-in zoom-in-95">
                    <strong>¡Atención al síntoma!</strong> Al oprimir la tecla marcada físicamente como <span className="font-mono font-bold">"A"</span>, la computadora imprimió la letra <span className="font-mono font-bold">"Q"</span>.
                    ¿Estará rota la tecla física (Hardware) o será una instrucción de software equivocada?
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  disabled={typedOutput.length === 0}
                  onClick={() => {
                    sounds.playSelect();
                    setActiveStep(2);
                  }}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 ${
                    typedOutput.length > 0
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Avanzar a Inspección de Hardware</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Hardware Inspection */}
          {activeStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong className="text-cyan-400 font-pixel text-xs block mb-1">
                  Paso 2: Inspección Física (Hardware)
                </strong>
                Antes de asumir que la pieza está rota, usamos un multímetro y lupa para revisar sus partes tangibles:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cable y Conector USB
                  </div>
                  <p className="text-xs text-slate-400">
                    Continuidad de 5V y líneas de datos D+ y D- intactas. Sin cortes ni pines doblados.
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Interruptores de Tecla
                  </div>
                  <p className="text-xs text-slate-400">
                    Los contactos mecánicos de la tecla 'A' cierran el circuito normalmente. No hay líquidos ni sarro.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-200">
                <strong>Dictamen de Hardware:</strong> El componente físico responde al 100%. No hay ninguna pieza rota que patear ni cambiar. Por lo tanto, ¡el problema no es el hardware!
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    sounds.playSelect();
                    setHardwareInspected(true);
                    setActiveStep(3);
                  }}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer flex items-center gap-2"
                >
                  <span>Abrir Configuración de Software del Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Software Layout Fix */}
          {activeStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong className="text-cyan-400 font-pixel text-xs block mb-1">
                  Paso 3: Panel de Configuración del Sistema Operativo
                </strong>
                Encontramos el menú de "Dispositivos de Entrada e Idioma". Observa la distribución lógica actual asignada por el sistema:
              </div>

              {/* OS Settings Window simulation */}
              <div className="bg-slate-950 border-2 border-slate-700 rounded-xl overflow-hidden shadow-lg">
                <div className="bg-slate-800 px-3 py-2 border-b border-slate-700 flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Configuración de Entrada de Teclado del Sistema</span>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-400">
                    Selecciona la distribución correcta para este teclado latinoamericano:
                  </p>

                  <div className="space-y-2">
                    {[
                      {
                        id: 'AZERTY',
                        name: 'Francés (AZERTY)',
                        note: 'Asigna la tecla "Q" en la primera posición de la fila superior.'
                      },
                      {
                        id: 'QWERTY_EN',
                        name: 'Inglés Estados Unidos (QWERTY - US)',
                        note: 'Distribución en inglés estándar sin tecla "Ñ" física asignada.'
                      },
                      {
                        id: 'QWERTY_ES',
                        name: 'Español (Latinoamérica - QWERTY)',
                        note: 'Distribución hispanoamericana con asignación de tecla "Ñ" y acentos.'
                      }
                    ].map(layout => (
                      <button
                        key={layout.id}
                        onClick={() => {
                          sounds.playSelect();
                          setSelectedLayout(layout.id as typeof selectedLayout);
                        }}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedLayout === layout.id
                            ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                            : 'bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs sm:text-sm">{layout.name}</span>
                          {selectedLayout === layout.id && (
                            <span className="text-[10px] bg-cyan-400 text-slate-950 px-2 py-0.5 rounded font-bold">
                              Activo
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{layout.note}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  disabled={selectedLayout !== 'QWERTY_ES'}
                  onClick={() => {
                    sounds.playSelect();
                    setTypedOutput('');
                    setActiveStep(4);
                  }}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 ${
                    selectedLayout === 'QWERTY_ES'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Aplicar Cambio y Verificar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Verification */}
          {activeStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong className="text-emerald-400 font-pixel text-xs block mb-1">
                  Paso 4: Comprobación Final del Teclado
                </strong>
                Oprime nuevamente la tecla <strong className="text-amber-300 font-mono">"A"</strong> para comprobar que la reconfiguración de software solucionó la falla:
              </div>

              <div className="bg-slate-950 border-2 border-emerald-500/60 rounded-xl p-4 text-center">
                <div className="min-h-12 bg-slate-900 border border-slate-800 rounded-lg p-3 text-lg font-mono font-bold tracking-widest text-emerald-300 flex items-center justify-center">
                  {typedOutput || <span className="text-slate-600 text-sm">Oprime la tecla 'A' abajo...</span>}
                </div>

                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {['A', 'Z', 'H', 'O', 'L', 'Q', 'W'].map(k => (
                    <button
                      key={k}
                      onClick={() => {
                        handleSimulateKey(k);
                        if (k === 'A') setFixedVerified(true);
                      }}
                      className="px-4 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/60 rounded-lg font-bold text-sm text-emerald-100 transition-transform active:scale-95"
                    >
                      {k}
                    </button>
                  ))}
                </div>

                {fixedVerified && (
                  <div className="mt-4 p-3 bg-emerald-950/70 border border-emerald-400 rounded-lg text-xs text-emerald-200 text-left animate-in zoom-in-95">
                    <strong>¡Éxito comprobado!</strong> Al teclear 'A' ahora sale 'A'. El teclado funciona al 100%. ¡Se salvó de ser basura electrónica innecesaria gracias a un diagnóstico certero de software!
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  disabled={!fixedVerified}
                  onClick={handleFinish}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 ${
                    fixedVerified
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Guardar en Bitácora y Desbloquear Zona 4</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
