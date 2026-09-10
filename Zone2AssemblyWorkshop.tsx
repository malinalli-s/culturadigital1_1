import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Monitor,
  Volume2,
  Zap,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Play,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { sounds } from '../../audio';

interface Zone2WorkshopProps {
  initialStation?: 'A' | 'B' | 'C';
  completedStations?: {
    stationA: boolean;
    stationB: boolean;
    stationC: boolean;
  };
  onCompleteStation?: (stationId: 'A' | 'B' | 'C') => void;
  onComplete: (isCorrect: boolean, explanation: string) => void;
  onClose: () => void;
}

export const Zone2AssemblyWorkshop: React.FC<Zone2WorkshopProps> = ({
  initialStation = 'A',
  completedStations,
  onCompleteStation,
  onComplete,
  onClose
}) => {
  const [currentStation, setCurrentStation] = useState<'A' | 'B' | 'C'>(initialStation);

  useEffect(() => {
    if (initialStation) {
      setCurrentStation(initialStation);
    }
  }, [initialStation]);

  // -------------------------------------------------------------
  // STATION A STATE: Panel de Puertos
  // -------------------------------------------------------------
  type CableId = 'hdmi' | 'usb' | 'jack' | 'power';
  interface CableItem {
    id: CableId;
    name: string;
    description: string;
    iconColor: string;
    targetPort: CableId;
  }

  const cables: CableItem[] = [
    {
      id: 'hdmi',
      name: 'Cable HDMI (Conector trapezoidal dorado)',
      description: 'Lleva señal de video y audio digital hacia la pantalla.',
      iconColor: 'text-sky-400',
      targetPort: 'hdmi'
    },
    {
      id: 'usb',
      name: 'Cable USB-A (Conector rectangular plano)',
      description: 'Transmite datos de teclas o clics desde teclado/mouse.',
      iconColor: 'text-indigo-400',
      targetPort: 'usb'
    },
    {
      id: 'jack',
      name: 'Cable Jack 3.5mm (Clavija cilíndrica verde)',
      description: 'Conduce audio analógico estéreo hacia las bocinas.',
      iconColor: 'text-emerald-400',
      targetPort: 'jack'
    },
    {
      id: 'power',
      name: 'Cable de Poder IEC (Conector 3 clavijas)',
      description: 'Suministra energía eléctrica de 127V a la fuente de poder.',
      iconColor: 'text-amber-400',
      targetPort: 'power'
    }
  ];

  const [connectedPorts, setConnectedPorts] = useState<Record<CableId, boolean>>(() => {
    if (completedStations?.stationA) {
      return { hdmi: true, usb: true, jack: true, power: true };
    }
    return { hdmi: false, usb: false, jack: false, power: false };
  });

  const [selectedCable, setSelectedCable] = useState<CableId | null>(() => {
    if (completedStations?.stationA) return null;
    return 'hdmi';
  });

  const [portFeedback, setPortFeedback] = useState<string | null>(null);

  const handlePortClick = (portId: CableId) => {
    if (!selectedCable) {
      setPortFeedback('Selecciona primero un cable del inventario izquierdo para intentar conectarlo.');
      return;
    }

    if (selectedCable === portId) {
      sounds.playSuccess();
      const updated = { ...connectedPorts, [portId]: true };
      setConnectedPorts(updated);
      setPortFeedback(`¡Conexión exitosa! El ${cables.find(c => c.id === portId)?.name} encaja perfectamente.`);

      if (updated.hdmi && updated.usb && updated.jack && updated.power) {
        onCompleteStation?.('A');
      }

      // Auto-select next unconnected cable
      const remaining = cables.find(c => c.id !== portId && !updated[c.id]);
      setSelectedCable(remaining ? remaining.id : null);
    } else {
      sounds.playError();
      const currentCableObj = cables.find(c => c.id === selectedCable);
      setPortFeedback(
        `¡Error físico! El conector de ${currentCableObj?.name} no es compatible geométricamente con ese puerto. Revisa la forma del conector.`
      );
    }
  };

  const handleResetStationA = () => {
    sounds.playSelect();
    setConnectedPorts({ hdmi: false, usb: false, jack: false, power: false });
    setSelectedCable('hdmi');
    setPortFeedback('Panel desconectado. Selecciona un cable del inventario para iniciar la conexión.');
  };

  const isStationACompleted =
    Boolean(completedStations?.stationA) ||
    (connectedPorts.hdmi && connectedPorts.usb && connectedPorts.jack && connectedPorts.power);

  // -------------------------------------------------------------
  // STATION B STATE: Cinta Clasificadora de Periféricos
  // -------------------------------------------------------------
  interface PeripheralItem {
    id: string;
    name: string;
    type: 'entrada' | 'salida';
    iconName: string;
    hint: string;
    explanation: string;
  }

  const peripheralList: PeripheralItem[] = [
    {
      id: 'teclado',
      name: 'Teclado Mecánico',
      type: 'entrada',
      iconName: '⌨️',
      hint: 'El usuario presiona teclas físicas para mandar letras y órdenes.',
      explanation: 'ENTRADA: Comunica al sistema lo que el usuario escribe.'
    },
    {
      id: 'monitor',
      name: 'Monitor LED 24"',
      type: 'salida',
      iconName: '🖥️',
      hint: 'Muestra ventanas, colores y el puntero del mouse al usuario.',
      explanation: 'SALIDA: Transforma la información de la memoria gráfica en luz visible.'
    },
    {
      id: 'mouse',
      name: 'Ratón Óptico USB',
      type: 'entrada',
      iconName: '🖱️',
      hint: 'Capta el movimiento de la mano sobre el escritorio.',
      explanation: 'ENTRADA: Envía coordenadas X/Y y clics a la CPU.'
    },
    {
      id: 'bocinas',
      name: 'Bocinas Estéreo',
      type: 'salida',
      iconName: '🔊',
      hint: 'Convierte ondas eléctricas en sonido y música para tus oídos.',
      explanation: 'SALIDA: Emite sonido desde la computadora hacia el exterior.'
    },
    {
      id: 'microfono',
      name: 'Micrófono de Solapa',
      type: 'entrada',
      iconName: '🎙️',
      hint: 'Capta las ondas sonoras de tu voz para grabarlas o llamadas.',
      explanation: 'ENTRADA: Introduce audio del mundo real al sistema digital.'
    },
    {
      id: 'impresora',
      name: 'Impresora Láser',
      type: 'salida',
      iconName: '🖨️',
      hint: 'Pasa archivos de la memoria digital a papel con tinta sólida.',
      explanation: 'SALIDA: Produce copias físicas de los documentos creados en la computadora.'
    }
  ];

  const [currentPeripheralIndex, setCurrentPeripheralIndex] = useState(0);
  const [sortedPeripherals, setSortedPeripherals] = useState<
    { item: PeripheralItem; userChoice: 'entrada' | 'salida'; isCorrect: boolean }[]
  >([]);
  const [sorterFeedback, setSorterFeedback] = useState<string | null>(null);

  const handleClassify = (choice: 'entrada' | 'salida') => {
    const item = peripheralList[currentPeripheralIndex];
    const isCorrect = choice === item.type;

    if (isCorrect) {
      sounds.playSuccess();
      setSorterFeedback(`¡Correcto! ${item.explanation}`);
    } else {
      sounds.playError();
      setSorterFeedback(
        `Incorrecto. Recuerda la regla mnemotécnica: ¿Le dice cosas a la compu (Entrada) o la compu le dice cosas al usuario (Salida)? ${item.explanation}`
      );
    }

    const updatedSorted = [...sortedPeripherals, { item, userChoice: choice, isCorrect }];
    setSortedPeripherals(updatedSorted);

    if (currentPeripheralIndex + 1 < peripheralList.length) {
      setCurrentPeripheralIndex(prev => prev + 1);
    } else {
      onCompleteStation?.('B');
    }
  };

  const handleResetStationB = () => {
    sounds.playSelect();
    setCurrentPeripheralIndex(0);
    setSortedPeripherals([]);
    setSorterFeedback(null);
  };

  const isStationBCompleted =
    Boolean(completedStations?.stationB) || sortedPeripherals.length === peripheralList.length;

  // -------------------------------------------------------------
  // STATION C STATE: El Experimento del Monitor Mudo
  // -------------------------------------------------------------
  const [monitorExperimentState, setMonitorExperimentState] = useState<
    'idle' | 'failed_hypothesis' | 'booting' | 'active_os'
  >(() => (completedStations?.stationC ? 'active_os' : 'idle'));
  const [stationCNotes, setStationCNotes] = useState<string | null>(null);

  const handleBootSystem = () => {
    sounds.playSelect();
    setMonitorExperimentState('booting');
    setStationCNotes('Iniciando POST (Power-On Self-Test)... Cargando núcleo del Sistema Operativo en memoria...');

    setTimeout(() => {
      sounds.playSuccess();
      setMonitorExperimentState('active_os');
      onCompleteStation?.('C');
      setStationCNotes(
        '¡La pantalla cobró vida! Comprobación empírica: Los cables y la pantalla (Hardware) son el cuerpo físico, pero sin el Sistema Operativo (Software) enviando instrucciones por el puerto, el monitor no tiene nada que pintar.'
      );
    }, 1200);
  };

  const handleWrongHypothesis = () => {
    sounds.playError();
    setMonitorExperimentState('failed_hypothesis');
    setStationCNotes(
      '¡Cuidado con la trampa de la obsolescencia! El monitor tiene luz de encendido y el cable HDMI está firme. Concluir que "está quemado y hay que botarlo" es el error que llena los vertederos. Lo que falta es la señal lógica del software.'
    );
  };

  const handleResetStationC = () => {
    sounds.playSelect();
    setMonitorExperimentState('idle');
    setStationCNotes(null);
  };

  const isStationCCompleted =
    Boolean(completedStations?.stationC) || monitorExperimentState === 'active_os';

  const handleCompleteAll = () => {
    sounds.playSuccess();
    onComplete(
      true,
      'Inducción de ensamblaje superada: Puertos identificados (HDMI, USB, Jack, Poder), clasificación de periféricos de Entrada y Salida, y comprobación empírica del monitor mudo (frontera Hardware vs. Software).'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border-4 border-amber-500 rounded-2xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 p-4 border-b-4 border-amber-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-950 border border-amber-500/50 text-amber-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-pixel text-amber-400">ZONA 2 • EL TALLER DE ENSAMBLAJE</span>
              <h2 className="text-lg font-bold text-white">Puertos, Periféricos y la Frontera HW / SW</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
          >
            Volver al mapa
          </button>
        </div>

        {/* Station Navigation Tabs */}
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex gap-2">
            <button
              onClick={() => {
                sounds.playSelect();
                setCurrentStation('A');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                currentStation === 'A'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-pixel'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>A: Panel de Puertos</span>
              {isStationACompleted && <CheckCircle2 className="w-4 h-4 text-emerald-950 fill-emerald-400" />}
            </button>

            <button
              onClick={() => {
                sounds.playSelect();
                setCurrentStation('B');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                currentStation === 'B'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-pixel'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>B: Cinta Clasificadora</span>
              {isStationBCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-950 fill-emerald-400" />}
            </button>

            <button
              onClick={() => {
                sounds.playSelect();
                setCurrentStation('C');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                currentStation === 'C'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-pixel'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>C: Experimento Monitor Mudo</span>
              {isStationCCompleted && (
                <CheckCircle2 className="w-4 h-4 text-emerald-950 fill-emerald-400" />
              )}
            </button>
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Inducción previa al diagnóstico
          </span>
        </div>

        {/* Station Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* =========================================================
              STATION A: PANEL DE PUERTOS
             ========================================================= */}
          {currentStation === 'A' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 text-xs text-slate-200">
                <strong className="text-amber-400 font-pixel text-xs block mb-1">
                  Misión A: Ensamblaje del Panel Trasero de la Computadora
                </strong>
                <p>
                  Cada cable tiene una forma física (ranura, pines o cilindro) diseñada para no equivocarse. Selecciona
                  un cable a la izquierda y haz clic en el puerto correspondiente de la tarjeta madre.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Left: Cables Inventory */}
                <div className="md:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-pixel text-slate-400">
                      CABLES DISPONIBLES ({Object.values(connectedPorts).filter(Boolean).length}/4)
                    </span>
                    {Object.values(connectedPorts).some(Boolean) && (
                      <button
                        onClick={handleResetStationA}
                        className="text-[10px] text-amber-400/80 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" /> Reiniciar
                      </button>
                    )}
                  </div>
                  {cables.map(cable => {
                    const isConnected = connectedPorts[cable.id];
                    const isSelected = selectedCable === cable.id;

                    return (
                      <button
                        key={cable.id}
                        disabled={isConnected}
                        onClick={() => {
                          sounds.playSelect();
                          setSelectedCable(cable.id);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs cursor-pointer ${
                          isConnected
                            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400 opacity-70'
                            : isSelected
                            ? 'bg-amber-950/80 border-amber-400 text-white shadow-md'
                            : 'bg-slate-900 border-slate-700 hover:bg-slate-850 text-slate-300'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold flex items-center gap-1.5">
                            <span className={cable.iconColor}>●</span>
                            <span>{cable.name}</span>
                          </div>
                          <p className="text-[10px] text-slate-400">{cable.description}</p>
                        </div>
                        {isConnected ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <span className="text-[9px] font-pixel text-slate-500 uppercase">
                            {isSelected ? 'Elegido' : 'Conectar'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right: Realistic Motherboard I/O Shield */}
                <div className="md:col-span-7 bg-slate-950 p-4 rounded-xl border-2 border-slate-700 flex flex-col items-center">
                  <div className="w-full text-center border-b border-slate-800 pb-2 mb-3">
                    <span className="text-xs font-pixel text-slate-300">
                      GABINETE TRASERO (PLACA I/O SHIELD)
                    </span>
                  </div>

                  {/* Ports Grid representing the back of a desktop PC */}
                  <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-850 border-2 border-slate-600 rounded-xl p-4 shadow-2xl space-y-4">
                    {/* Power Port */}
                    <div
                      onClick={() => handlePortClick('power')}
                      className={`p-3 rounded-lg border-2 flex items-center justify-between cursor-pointer transition-all ${
                        connectedPorts.power
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                          : 'bg-slate-950 border-slate-700 hover:border-amber-400 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 bg-slate-800 rounded border border-slate-600 flex items-center justify-center gap-1">
                          <span className="w-1 h-2 bg-black rounded-full"></span>
                          <span className="w-1 h-2 bg-black rounded-full"></span>
                          <span className="w-1 h-2 bg-black rounded-full"></span>
                        </div>
                        <div>
                          <strong className="text-xs block">Puerto Fuente de Poder (IEC AC 127V)</strong>
                          <span className="text-[10px] text-slate-400">Entrada trifásica de energía</span>
                        </div>
                      </div>
                      {connectedPorts.power ? (
                        <span className="text-[10px] font-pixel text-emerald-400">ENERGIZADO</span>
                      ) : (
                        <span className="text-[10px] font-pixel text-slate-500">LIBRE</span>
                      )}
                    </div>

                    {/* HDMI Port */}
                    <div
                      onClick={() => handlePortClick('hdmi')}
                      className={`p-3 rounded-lg border-2 flex items-center justify-between cursor-pointer transition-all ${
                        connectedPorts.hdmi
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                          : 'bg-slate-950 border-slate-700 hover:border-sky-400 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-5 bg-amber-900/40 rounded-sm border border-amber-600 flex items-center justify-center text-[9px] font-bold text-amber-300">
                          HDMI
                        </div>
                        <div>
                          <strong className="text-xs block">Puerto HDMI OUT</strong>
                          <span className="text-[10px] text-slate-400">Salida de video digital a monitor</span>
                        </div>
                      </div>
                      {connectedPorts.hdmi ? (
                        <span className="text-[10px] font-pixel text-emerald-400">SEÑAL LISTA</span>
                      ) : (
                        <span className="text-[10px] font-pixel text-slate-500">LIBRE</span>
                      )}
                    </div>

                    {/* USB Port */}
                    <div
                      onClick={() => handlePortClick('usb')}
                      className={`p-3 rounded-lg border-2 flex items-center justify-between cursor-pointer transition-all ${
                        connectedPorts.usb
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                          : 'bg-slate-950 border-slate-700 hover:border-indigo-400 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-5 bg-blue-900/50 rounded-sm border border-blue-500 flex items-center justify-center text-[9px] font-bold text-blue-300">
                          USB 3.0
                        </div>
                        <div>
                          <strong className="text-xs block">Puerto USB (Bus Universal)</strong>
                          <span className="text-[10px] text-slate-400">Teclado, Mouse o Memorias</span>
                        </div>
                      </div>
                      {connectedPorts.usb ? (
                        <span className="text-[10px] font-pixel text-emerald-400">CONECTADO</span>
                      ) : (
                        <span className="text-[10px] font-pixel text-slate-500">LIBRE</span>
                      )}
                    </div>

                    {/* Jack 3.5mm Port */}
                    <div
                      onClick={() => handlePortClick('jack')}
                      className={`p-3 rounded-lg border-2 flex items-center justify-between cursor-pointer transition-all ${
                        connectedPorts.jack
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                          : 'bg-slate-950 border-slate-700 hover:border-emerald-400 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-900/60 border-2 border-emerald-400 flex items-center justify-center text-[8px] font-bold text-emerald-300">
                          AUDIO
                        </div>
                        <div>
                          <strong className="text-xs block">Salida de Audio (Jack 3.5mm Verde)</strong>
                          <span className="text-[10px] text-slate-400">Bocinas analógicas o audífonos</span>
                        </div>
                      </div>
                      {connectedPorts.jack ? (
                        <span className="text-[10px] font-pixel text-emerald-400">AUDIO OUT</span>
                      ) : (
                        <span className="text-[10px] font-pixel text-slate-500">LIBRE</span>
                      )}
                    </div>
                  </div>

                  {/* Feedback line */}
                  {portFeedback && (
                    <div className="mt-3 w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-center text-amber-300 animate-in fade-in">
                      {portFeedback}
                    </div>
                  )}
                </div>
              </div>

              {isStationACompleted && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500 rounded-xl flex items-center justify-between animate-in zoom-in-95">
                  <div className="text-xs text-emerald-200">
                    <strong>¡Panel de puertos 100% ensamblado!</strong> Los cables transmiten energía y pulsos de datos a través de los conectores adecuados.
                  </div>
                  <button
                    onClick={() => {
                      sounds.playSelect();
                      setCurrentStation('B');
                    }}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <span>Ir a Mini-Estación B</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              STATION B: CINTA CLASIFICADORA DE PERIFÉRICOS
             ========================================================= */}
          {currentStation === 'B' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 text-xs text-slate-200">
                <strong className="text-amber-400 font-pixel text-xs block mb-1">
                  Misión B: Cinta Clasificadora de Periféricos (Entrada vs. Salida)
                </strong>
                <div className="mb-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200 font-medium flex items-center gap-2">
                  <span className="text-sm">📋</span>
                  <span><strong>Instrucciones:</strong> Clasifica los elementos en puertos de entrada o de salida.</span>
                </div>
                <p>
                  Un periférico es un aparato auxiliar. La regla de oro es simple:
                  <br />• <strong>ENTRADA (Input):</strong> El usuario le mete datos u órdenes a la computadora.
                  <br />• <strong>SALIDA (Output):</strong> La computadora le muestra o emite resultados al usuario.
                </p>
              </div>

              {!isStationBCompleted ? (
                <div className="bg-slate-950 p-6 rounded-2xl border-2 border-slate-800 flex flex-col items-center text-center space-y-4">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-pixel text-slate-400">
                      DISPOSITIVO EN LA CINTA ({currentPeripheralIndex + 1} de {peripheralList.length})
                    </span>
                    <span className="text-xs text-amber-300 font-bold bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
                      Clasifica los elementos en puertos de entrada o de salida
                    </span>
                  </div>

                  {/* Conveyor Belt Item Card */}
                  <div className="p-6 bg-slate-900 border-2 border-amber-500/60 rounded-2xl max-w-md w-full shadow-2xl space-y-2">
                    <div className="text-4xl mb-1">
                      {peripheralList[currentPeripheralIndex].iconName}
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {peripheralList[currentPeripheralIndex].name}
                    </h3>
                    <p className="text-xs text-slate-300">
                      {peripheralList[currentPeripheralIndex].hint}
                    </p>
                  </div>

                  {/* Two Decision Boxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md pt-2">
                    <button
                      onClick={() => handleClassify('entrada')}
                      className="p-4 bg-sky-950 hover:bg-sky-900 border-2 border-sky-500 rounded-xl text-center transition-all active:scale-95 cursor-pointer shadow-lg group"
                    >
                      <span className="text-xs font-pixel text-sky-300 block mb-1 group-hover:scale-105 transition-transform">
                        📥 PUERTOS DE ENTRADA
                      </span>
                      <span className="text-[11px] text-slate-300">
                        "Le dice cosas a la computadora"
                      </span>
                    </button>

                    <button
                      onClick={() => handleClassify('salida')}
                      className="p-4 bg-purple-950 hover:bg-purple-900 border-2 border-purple-500 rounded-xl text-center transition-all active:scale-95 cursor-pointer shadow-lg group"
                    >
                      <span className="text-xs font-pixel text-purple-300 block mb-1 group-hover:scale-105 transition-transform">
                        📤 PUERTOS DE SALIDA
                      </span>
                      <span className="text-[11px] text-slate-300">
                        "La computadora le dice cosas al usuario"
                      </span>
                    </button>
                  </div>

                  {sorterFeedback && (
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 max-w-md">
                      {sorterFeedback}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-700/60 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>¡Todos los periféricos han sido clasificados en la cinta!</span>
                  </div>

                  {/* Summary Grid of Sorted Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-sky-950/40 border border-sky-800 rounded-xl space-y-1">
                      <strong className="text-sky-300 font-pixel text-[10px] block">
                        PERIFÉRICOS DE ENTRADA CLASIFICADOS:
                      </strong>
                      <p>• Teclado (digita letras y comandos)</p>
                      <p>• Ratón / Mouse (coordenadas y clics)</p>
                      <p>• Micrófono (captura ondas sonoras)</p>
                    </div>

                    <div className="p-3 bg-purple-950/40 border border-purple-800 rounded-xl space-y-1">
                      <strong className="text-purple-300 font-pixel text-[10px] block">
                        PERIFÉRICOS DE SALIDA CLASIFICADOS:
                      </strong>
                      <p>• Monitor (proyección de interfaz gráfica)</p>
                      <p>• Bocinas (reproducción acústica de audio)</p>
                      <p>• Impresora (salida física en papel)</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={handleResetStationB}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Volver a Clasificar</span>
                    </button>
                    <button
                      onClick={() => {
                        sounds.playSelect();
                        setCurrentStation('C');
                      }}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <span>Ir a Mini-Estación C</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              STATION C: EL EXPERIMENTO DEL MONITOR MUDO
             ========================================================= */}
          {currentStation === 'C' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 text-xs text-slate-200">
                <strong className="text-amber-400 font-pixel text-xs block mb-1">
                  Misión C: El Experimento del Monitor Mudo (La Frontera Hardware vs. Software)
                </strong>
                <p>
                  Tienes un monitor en la mesa: su cable de corriente está enchufado y el cable HDMI está conectado
                  firmemente a la computadora. La luz del monitor parpadea en naranja (Standby). Sin embargo, la
                  pantalla permanece completamente negra y muda.
                </p>
              </div>

              {/* Interactive Virtual Test Bench */}
              <div className="bg-slate-950 p-5 rounded-2xl border-2 border-slate-800 flex flex-col items-center space-y-4">
                {/* Visual Monitor Screen Graphic */}
                <div className="w-full max-w-md bg-slate-900 border-4 border-slate-700 rounded-xl p-3 shadow-2xl flex flex-col items-center">
                  <div
                    className={`w-full aspect-[16/10] rounded-lg border-2 flex flex-col items-center justify-center p-4 transition-all duration-500 ${
                      monitorExperimentState === 'active_os'
                        ? 'bg-gradient-to-br from-cyan-950 via-blue-900 to-indigo-950 border-cyan-400 text-cyan-200 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                        : monitorExperimentState === 'booting'
                        ? 'bg-black border-slate-800 text-emerald-400 font-mono text-[10px]'
                        : 'bg-black border-slate-900 text-slate-600'
                    }`}
                  >
                    {monitorExperimentState === 'active_os' ? (
                      <div className="w-full h-full flex flex-col justify-between text-left animate-in fade-in">
                        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-1">
                          <span className="text-[10px] font-pixel text-cyan-300">CETis OS v2.0</span>
                          <span className="text-[9px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded">60 FPS</span>
                        </div>
                        <div className="text-center my-auto space-y-1">
                          <span className="text-2xl block">🖥️ ✨</span>
                          <span className="text-xs font-bold text-white block">¡SEÑAL DE VIDEO ACTIVA!</span>
                          <p className="text-[10px] text-cyan-200">
                            El Sistema Operativo envía el flujo de imágenes al monitor a través del cable HDMI.
                          </p>
                        </div>
                        <div className="text-[9px] text-cyan-400/80">Barra de tareas / Escritorio cargado</div>
                      </div>
                    ) : monitorExperimentState === 'booting' ? (
                      <div className="text-left w-full space-y-1">
                        <p className="animate-pulse">&gt; UEFI BIOS Iniciado...</p>
                        <p>&gt; Verificando GPU y puertos de salida...</p>
                        <p>&gt; Cargando controlador gráfico (Driver HDMI)...</p>
                        <p className="text-cyan-300">&gt; Desplegando interfaz de usuario...</p>
                      </div>
                    ) : (
                      <div className="text-center space-y-1">
                        <span className="text-xs font-mono text-slate-500 block">
                          [ PANTALLA NEGRA / SIN SEÑAL LÓGICA ]
                        </span>
                        <span className="text-[9px] text-amber-500 block">
                          Hardware conectado físicamente • Software ausente
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Monitor Bezel & Stand */}
                  <div className="w-full flex items-center justify-between px-2 pt-2 text-[10px] text-slate-400">
                    <span className="font-pixel text-[8px] text-slate-500">CETIS-DISPLAY 1080p</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px]">Luz LED:</span>
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          monitorExperimentState === 'active_os'
                            ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                            : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'
                        }`}
                      ></span>
                    </div>
                  </div>
                </div>

                {/* Question & Actions */}
                <div className="w-full max-w-lg space-y-3">
                  <p className="text-xs text-slate-300 text-center">
                    ¿Cuál será la solución?
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={handleWrongHypothesis}
                      disabled={monitorExperimentState === 'active_os'}
                      className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        monitorExperimentState === 'failed_hypothesis'
                          ? 'bg-rose-950/40 border-rose-600 text-rose-200'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-200'
                      }`}
                    >
                      <strong className="block text-slate-300 mb-1 font-semibold">Opción A:</strong>
                      <span>"El monitor no sirve. Hay que tirarlo a la basura y comprar otro."</span>
                      {monitorExperimentState === 'failed_hypothesis' && (
                        <span className="text-[10px] text-rose-400 font-mono block mt-1.5">
                          ✗ Hipótesis descartada (Obsolescencia percibida)
                        </span>
                      )}
                    </button>

                    <button
                      onClick={handleBootSystem}
                      disabled={monitorExperimentState === 'active_os' || monitorExperimentState === 'booting'}
                      className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        monitorExperimentState === 'booting'
                          ? 'bg-amber-950/40 border-amber-500 text-amber-200 animate-pulse'
                          : monitorExperimentState === 'active_os'
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-slate-600 text-slate-200'
                      }`}
                    >
                      <strong className="block text-slate-300 mb-1 font-semibold">Opción B:</strong>
                      <span>"Encender la CPU y arrancar el Sistema Operativo para enviar la señal lógica."</span>
                      {monitorExperimentState === 'booting' && (
                        <span className="text-[10px] text-amber-300 font-mono flex items-center gap-1.5 mt-1.5">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Encendiendo CPU y cargando SO...</span>
                        </span>
                      )}
                      {monitorExperimentState === 'active_os' && (
                        <span className="text-[10px] text-emerald-400 font-mono block mt-1.5">
                          ✓ ¡Comprobado! Señal lógica activa en monitor
                        </span>
                      )}
                    </button>
                  </div>

                  {stationCNotes && (
                    <div
                      className={`p-3 rounded-xl border text-xs leading-relaxed ${
                        monitorExperimentState === 'active_os'
                          ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                          : 'bg-rose-950/70 border-rose-500 text-rose-200'
                      }`}
                    >
                      {stationCNotes}
                    </div>
                  )}

                  {monitorExperimentState !== 'idle' && (
                    <div className="flex justify-center pt-1">
                      <button
                        onClick={handleResetStationC}
                        className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reiniciar Experimento</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="font-pixel text-amber-400">ESTADO DEL TALLER:</span>
            <span>
              {isStationACompleted && isStationBCompleted && isStationCCompleted
                ? '¡3 de 3 Mini-Estaciones Completadas!'
                : `${(isStationACompleted ? 1 : 0) + (isStationBCompleted ? 1 : 0) + (isStationCCompleted ? 1 : 0)} de 3 Mini-Estaciones Completadas`}
            </span>
          </div>

          {isStationACompleted && isStationBCompleted && isStationCCompleted ? (
            <button
              onClick={handleCompleteAll}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <span>Acreditar Taller de Ensamblaje e Ir a Zona 3</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              disabled
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-800 text-slate-500 flex items-center gap-2 cursor-not-allowed"
            >
              <span>Acreditar Taller (Completa A, B y C)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
