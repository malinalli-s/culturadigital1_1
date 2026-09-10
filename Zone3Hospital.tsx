import React, { useState } from 'react';
import { Stethoscope, Mouse, Monitor, Printer, CheckCircle2, ArrowRight, Wrench, Download } from 'lucide-react';
import { sounds } from '../../audio';

interface Zone3Props {
  initialPatient?: 'mouse' | 'monitor' | 'printer';
  completedCases: { mouse: boolean; monitor: boolean; printer: boolean };
  onCompleteCase: (patientId: 'mouse' | 'monitor' | 'printer', explanation: string) => void;
  onAllCompleted: () => void;
  onClose: () => void;
}

export const Zone3Hospital: React.FC<Zone3Props> = ({
  initialPatient = 'mouse',
  completedCases,
  onCompleteCase,
  onAllCompleted,
  onClose
}) => {
  const [selectedPatient, setSelectedPatient] = useState<'mouse' | 'monitor' | 'printer'>(initialPatient);

  // Patient 1 State
  const [mouseClickCount, setMouseClickCount] = useState(0);
  const [mouseDiagnosed, setMouseDiagnosed] = useState<string | null>(null);

  // Patient 2 State
  const [cablePlugged, setCablePlugged] = useState(false);
  const [monitorDiagnosed, setMonitorDiagnosed] = useState(false);

  // Patient 3 State
  const [driverInstalled, setDriverInstalled] = useState(false);
  const [printTestDone, setPrintTestDone] = useState(false);

  // Patient 1 Handler
  const handleTestMouseClick = () => {
    sounds.playTextBlip();
    // Simulates ghost bounce: one physical tap registers as 2 clicks
    setMouseClickCount(prev => prev + 2);
  };

  const handleResolveMouse = (type: 'hardware' | 'software') => {
    setMouseDiagnosed(type);
    if (type === 'hardware') {
      sounds.playSuccess();
      onCompleteCase(
        'mouse',
        'Paciente 1 (Mouse fantasma): Se identificó desgaste mecánico en la lámina del microswitch (Hardware). Se soluciona cambiando el microswitch o limpiando con alcohol isopropílico, sin desechar todo el cuerpo del mouse.'
      );
    } else {
      sounds.playError();
    }
  };

  // Patient 2 Handler
  const handleFixCable = () => {
    sounds.playSelect();
    setCablePlugged(true);
  };

  const handleResolveMonitor = () => {
    sounds.playSuccess();
    setMonitorDiagnosed(true);
    onCompleteCase(
      'monitor',
      'Paciente 2 (Monitor sin señal): El panel LCD estaba en óptimas condiciones. La falla era un cable de video (HDMI/VGA) flojo en el puerto. Revisar puertos evita desechar pantallas útiles.'
    );
  };

  // Patient 3 Handler
  const handleInstallDriver = () => {
    sounds.playSelect();
    setDriverInstalled(true);
  };

  const handleResolvePrinter = () => {
    sounds.playSuccess();
    setPrintTestDone(true);
    onCompleteCase(
      'printer',
      'Paciente 3 (No puedo mandar a imprimir): La mecánica estaba perfecta, pero el Sistema Operativo no sabía comunicarse con ella por falta del Controlador (Driver - Software traductor). Al instalarlo, funcionó al 100%.'
    );
  };

  const allDone = (completedCases.mouse || mouseDiagnosed === 'hardware') &&
                  (completedCases.monitor || monitorDiagnosed) &&
                  (completedCases.printer || printTestDone);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-4 border-indigo-600 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-800 via-indigo-900 to-slate-900 p-4 border-b-4 border-indigo-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-400/40 text-indigo-300">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-pixel text-indigo-300">ZONA 3 • HOSPITAL DE DISPOSITIVOS</span>
              <h2 className="text-lg font-bold text-white">Tríada de Casos Clínicos CETis 2</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs bg-indigo-950 hover:bg-indigo-800 text-indigo-200 px-3 py-1.5 rounded-lg border border-indigo-700"
          >
            Volver al mapa
          </button>
        </div>

        {/* Patient Tabs */}
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'mouse', label: 'Paciente 1: Mouse Fantasma', icon: Mouse, done: completedCases.mouse || mouseDiagnosed === 'hardware' },
            { id: 'monitor', label: 'Paciente 2: Pantalla Sin Señal', icon: Monitor, done: completedCases.monitor || monitorDiagnosed },
            { id: 'printer', label: 'Paciente 3: Impresora Muda', icon: Printer, done: completedCases.printer || printTestDone }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = selectedPatient === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playSelect();
                  setSelectedPatient(tab.id as typeof selectedPatient);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Patient Case Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* PACIENTE 1: MOUSE */}
          {selectedPatient === 'mouse' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-xs sm:text-sm text-slate-300">
                <strong className="text-indigo-400 font-pixel text-xs block mb-1">
                  Motivo de Ingreso: "El Clic Fantasma"
                </strong>
                El alumno reporta: "Al hacer un solo clic para seleccionar un archivo, se abre inmediatamente o selecciona todo como si hiciera doble clic. El maestro iba a tirarlo a la basura."
              </div>

              {/* Interactive test */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-center space-y-3">
                <p className="text-xs text-slate-400">
                  Haz un único clic sobre el botón de prueba para medir cuántos pulsos registra el microswitch:
                </p>
                <button
                  onClick={handleTestMouseClick}
                  className="px-6 py-4 bg-indigo-950 hover:bg-indigo-900 border-2 border-indigo-500 rounded-2xl font-bold text-sm text-indigo-100 flex items-center justify-center gap-2 mx-auto active:scale-95 shadow-lg"
                >
                  <Mouse className="w-5 h-5 text-indigo-400" />
                  <span>Probar 1 Clic Aquí</span>
                </button>
                <div className="text-xs font-mono text-slate-300">
                  Pulsos eléctricos registrados: <strong className="text-amber-400 text-base">{mouseClickCount} clics</strong>
                </div>
                {mouseClickCount > 0 && (
                  <p className="text-xs text-amber-300">
                    ¡Síntoma detectado! Un solo toque físico generó un rebote de dos señales.
                  </p>
                )}
              </div>

              {/* Diagnostic Question */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                <p className="text-xs font-bold text-slate-300">
                  ¿Cuál es el verdadero origen del fallo y la acción técnica ecológica adecuada?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => handleResolveMouse('hardware')}
                    className="p-3.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 rounded-xl text-left text-xs text-slate-200 transition-all cursor-pointer"
                  >
                    <strong className="text-slate-200 block mb-1 font-semibold">
                      A) Desgaste de Hardware (Microswitch mecánico)
                    </strong>
                    La lámina metálica interna perdió elasticidad. Se limpia con limpiador de contactos o se desuelda el switch por uno de $15 pesos, conservando el 95% del mouse.
                  </button>
                  <button
                    onClick={() => handleResolveMouse('software')}
                    className="p-3.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 rounded-xl text-left text-xs text-slate-200 transition-all cursor-pointer"
                  >
                    <strong className="text-slate-200 block mb-1 font-semibold">
                      B) Falla irrecuperable de Windows
                    </strong>
                    Reinstalar todo el sistema operativo o comprar un mouse nuevo porque los mouses no tienen piezas físicas.
                  </button>
                </div>
              </div>

              {mouseDiagnosed === 'hardware' && (
                <div className="p-3.5 bg-emerald-950/60 border border-emerald-500 rounded-xl text-xs text-emerald-200 animate-in zoom-in-95">
                  ¡Excelente diagnóstico! Identificaste una falla física de hardware de bajo costo, salvando el periférico.
                </div>
              )}
            </div>
          )}

          {/* PACIENTE 2: MONITOR */}
          {selectedPatient === 'monitor' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-xs sm:text-sm text-slate-300">
                <strong className="text-indigo-400 font-pixel text-xs block mb-1">
                  Motivo de Ingreso: "La Pantalla Sin Señal"
                </strong>
                El monitor tiene encendido el botón de encendido con luz azul (recibe energía), pero en la pantalla aparece un recuadro flotante que dice: <span className="text-amber-400 font-mono">"Sin Señal / No Signal"</span>.
              </div>

              {/* Monitor screen sim */}
              <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-6 text-center max-w-md mx-auto shadow-inner">
                <div className="w-full h-44 bg-slate-900 rounded-xl border border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
                  {!cablePlugged ? (
                    <div className="p-3 bg-amber-500 text-slate-950 font-bold font-mono text-xs rounded animate-bounce shadow">
                      SIN SEÑAL (CABLE DE VIDEO NO DETECTADO)
                    </div>
                  ) : (
                    <div className="w-full h-full bg-cyan-950/80 p-4 flex flex-col items-center justify-center text-cyan-200">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
                      <span className="font-bold text-sm">Escritorio de Windows CETis 2</span>
                      <span className="text-xs text-cyan-400 mt-1">¡Imagen 1080p nítida transmitida!</span>
                    </div>
                  )}
                  {/* Stand */}
                  <div className="absolute bottom-2 left-4 text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> LED Encendido
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {!cablePlugged ? (
                    <button
                      onClick={handleFixCable}
                      className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>Revisar y Apretar Cable HDMI / VGA en Puerto</span>
                    </button>
                  ) : (
                    <button
                      disabled={completedCases.monitor || monitorDiagnosed}
                      onClick={handleResolveMonitor}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Firmar Alta del Paciente 2</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PACIENTE 3: IMPRESORA */}
          {selectedPatient === 'printer' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-xs sm:text-sm text-slate-300">
                <strong className="text-indigo-400 font-pixel text-xs block mb-1">
                  Motivo de Ingreso: "La Impresora Muda"
                </strong>
                La impresora prende, sus motores mueven el rodillo y jala papel, pero cuando se envía un documento a imprimir desde la computadora, no pasa nada y Windows arroja: <span className="text-rose-400 font-mono">"Dispositivo no reconocido: Falta Controlador"</span>.
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">Estado del Software de Comunicación</h4>
                    <p className="text-xs text-slate-400">
                      Un periférico complejo necesita que el sistema operativo sepa su "dialecto".
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    driverInstalled ? 'bg-emerald-950 text-emerald-300 border border-emerald-500' : 'bg-rose-950 text-rose-300 border border-rose-500'
                  }`}>
                    {driverInstalled ? 'Controlador Instalado' : 'Sin Controlador (Driver)'}
                  </span>
                </div>

                {!driverInstalled ? (
                  <div className="text-center py-4 space-y-3">
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      Instala el paquete de software controlador oficial para que el Sistema Operativo pueda traducir los bytes del documento en impulsos para los inyectores de tinta:
                    </p>
                    <button
                      onClick={handleInstallDriver}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 shadow"
                    >
                      <Download className="w-4 h-4" />
                      <span>Instalar Driver Oficial (Software Puente)</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-3 animate-in fade-in">
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 max-w-md mx-auto">
                      ¡Controlador enlazado correctamente! La computadora y la impresora ahora "hablan el mismo idioma".
                    </div>
                    <button
                      disabled={completedCases.printer || printTestDone}
                      onClick={handleResolvePrinter}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl inline-flex items-center gap-2 shadow"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Imprimir Hoja de Prueba y Dar de Alta</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer with overall progress */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Casos resueltos:{' '}
            <strong className="text-cyan-400">
              {[completedCases.mouse || mouseDiagnosed === 'hardware', completedCases.monitor || monitorDiagnosed, completedCases.printer || printTestDone].filter(Boolean).length} de 3
            </strong>
          </div>

          {allDone && (
            <button
              onClick={() => {
                sounds.playSuccess();
                onAllCompleted();
              }}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer animate-pulse"
            >
              <span>Completar Hospital y Viajar a Zona 4</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
