import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Direction,
  Position,
  GameProgression,
  StudentInfo,
  NPC,
  InteractiveObject
} from './types';
import { INITIAL_DEX_ENTRIES, ZONES } from './gameData';
import { drawGameCanvas, CANVAS_WIDTH, CANVAS_HEIGHT, TILE_SIZE } from './canvas/renderer';
import { sounds } from './audio';
import { DexModal } from './components/DexModal';
import { StudentReportModal } from './components/StudentReportModal';
import { VirtualControls } from './components/VirtualControls';
import { DialogBox } from './components/DialogBox';
import { Zone1Hypothesis } from './components/minigames/Zone1Hypothesis';
import { Zone2AssemblyWorkshop } from './components/minigames/Zone2AssemblyWorkshop';
import { Zone2KeyboardLab } from './components/minigames/Zone2KeyboardLab';
import { Zone3Hospital } from './components/minigames/Zone3Hospital';
import { Zone4Obsolescence } from './components/minigames/Zone4Obsolescence';
import { Zone5PaecTree } from './components/minigames/Zone5PaecTree';
import { Zone6UnamExam } from './components/minigames/Zone6UnamExam';
import { StartScreenModal } from './components/StartScreenModal';
import { BookOpen, ClipboardList, Sparkles, UserPlus, User } from 'lucide-react';

const STORAGE_KEY_PROGRESS = 'cetis2_rpg_progression';
const STORAGE_KEY_STUDENT = 'cetis2_rpg_student';

export const createInitialProgression = (): GameProgression => ({
  currentZone: 1,
  completedZones: [],
  unlockedDexIds: ['hardware', 'software'], // Start with base concept hints
  score: 0,
  hypothesis: '',
  workshopCompleted: false,
  workshopStations: {
    stationA: false,
    stationB: false,
    stationC: false
  },
  keyboardFixed: false,
  hospitalCases: {
    mouse: false,
    monitor: false,
    printer: false
  },
  obsolescenceConvinced: false,
  paecSortedCount: 0,
  examPassed: false,
  examAnswer: null,
  decisions: []
});

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Student State
  const [student, setStudent] = useState<StudentInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENT);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      name: '',
      group: '1º A',
      schoolId: '',
      notes: ''
    };
  });

  // Progression State
  const [progression, setProgression] = useState<GameProgression>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return createInitialProgression();
  });

  // Start Screen Modal State (Prompt user for name & group at launch)
  const [isStartScreenOpen, setIsStartScreenOpen] = useState<boolean>(true);

  // Player Engine State
  const [playerPos, setPlayerPos] = useState<Position>({ x: 4, y: 7 });
  const [playerDirection, setPlayerDirection] = useState<Direction>('down');
  const [isMoving, setIsMoving] = useState(false);
  const [walkFrame, setWalkFrame] = useState(0);

  // Modals & Overlays
  const [isDexOpen, setIsDexOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(sounds.getMuted());
  const [activeMinigame, setActiveMinigame] = useState<
    'zone1' | 'zone2' | 'zone3' | 'zone4' | 'zone5' | 'zone6' | 'zone7' | null
  >(null);
  const [activeHospitalPatient, setActiveHospitalPatient] = useState<'mouse' | 'monitor' | 'printer'>('mouse');
  const [activeWorkshopStation, setActiveWorkshopStation] = useState<'A' | 'B' | 'C'>('A');

  // Dialog System
  const [currentDialog, setCurrentDialog] = useState<{
    speaker: string;
    role: string;
    text: string;
    avatar: string;
    action?: () => void;
  } | null>(null);

  // Notification Toast for Dex Unlocks
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(student));
    } catch {
      // ignore
    }
  }, [student]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progression));
    } catch {
      // ignore
    }
  }, [progression]);

  // Trigger Toast Notification helper
  const showToast = (message: string) => {
    setToastMessage(message);
    sounds.playDexUnlock();
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Helper to unlock Dex concept
  const unlockDex = (conceptId: string, name: string) => {
    setProgression(prev => {
      if (!prev.unlockedDexIds.includes(conceptId)) {
        showToast(`¡Nuevo concepto desbloqueado en el DEX-Glosario: ${name}!`);
        return {
          ...prev,
          unlockedDexIds: [...prev.unlockedDexIds, conceptId]
        };
      }
      return prev;
    });
  };

  // Start new expedition: wipes all previous progress and persists name & group in bitácora
  const handleStartNewGame = (studentData: { name: string; group: string; schoolId: string }) => {
    // 1. Update and persist student data
    const updatedStudent: StudentInfo = {
      name: studentData.name,
      group: studentData.group,
      schoolId: studentData.schoolId,
      notes: ''
    };
    setStudent(updatedStudent);
    try {
      localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(updatedStudent));
    } catch {
      // ignore
    }

    // 2. Wipe all game progress completely as requested
    const freshProgression = createInitialProgression();
    setProgression(freshProgression);
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(freshProgression));
    } catch {
      // ignore
    }

    // 3. Reset player to Zone 1 spawn
    setPlayerPos(ZONES[1].spawn);
    setPlayerDirection('down');
    setIsMoving(false);

    // 4. Close any active modals or minigames
    setActiveMinigame(null);
    setCurrentDialog(null);
    setIsDexOpen(false);
    setIsReportOpen(false);
    setIsStartScreenOpen(false);

    // 5. Sound & notification feedback
    sounds.playSuccess();
    showToast(`¡Bienvenido/a ${studentData.name}! Bitácora registrada en Zona 1.`);
  };

  // World Entities Definitions
  const npcs: NPC[] = [
    // Zone 1
    {
      id: 'prof_zone1',
      name: 'Prof. Mendoza',
      role: 'Profesor de Cultura Digital',
      x: 6,
      y: 7,
      direction: 'left',
      spriteType: 'teacher',
      zoneId: 1,
      interactRadius: 1.5,
      dialogueId: 'prof_intro'
    },
    // Zone 2
    {
      id: 'tech_zone2',
      name: 'Ing. Arcos',
      role: 'Instructor de Taller de Hardware',
      x: 10,
      y: 7,
      direction: 'down',
      spriteType: 'technician',
      zoneId: 2,
      interactRadius: 1.5,
      dialogueId: 'workshop_intro'
    },
    // Zone 3
    {
      id: 'tech_zone3',
      name: 'Ing. Valdés',
      role: 'Jefe de Soporte CETis',
      x: 10,
      y: 5,
      direction: 'down',
      spriteType: 'technician',
      zoneId: 3,
      interactRadius: 1.5,
      dialogueId: 'tech_lab'
    },
    // Zone 4
    {
      id: 'student_zone4',
      name: 'Sofi',
      role: 'Auxiliar de Laboratorio',
      x: 3,
      y: 6,
      direction: 'right',
      spriteType: 'student',
      zoneId: 4,
      interactRadius: 1.5,
      dialogueId: 'student_hospital'
    },
    // Zone 5
    {
      id: 'consumer_zone5',
      name: 'Rodrigo',
      role: 'Estudiante Consumidor',
      x: 8,
      y: 6,
      direction: 'down',
      spriteType: 'consumer',
      zoneId: 5,
      interactRadius: 1.5,
      dialogueId: 'consumer_talk'
    },
    // Zone 6
    {
      id: 'paec_zone6',
      name: 'Bióloga Laura',
      role: 'Coordinadora PAEC',
      x: 5,
      y: 6,
      direction: 'right',
      spriteType: 'teacher',
      zoneId: 6,
      interactRadius: 1.5,
      dialogueId: 'paec_intro'
    },
    // Zone 7
    {
      id: 'guardian_zone7',
      name: 'Dr. Estrada',
      role: 'Maestro Evaluador UNAM',
      x: 8,
      y: 4,
      direction: 'down',
      spriteType: 'guardian',
      zoneId: 7,
      interactRadius: 1.5,
      dialogueId: 'guardian_exam'
    }
  ];

  const objects: InteractiveObject[] = [
    // Zone 1: Plaza Inicial
    {
      id: 'box_z1',
      name: 'Caja del Misterio ("BASURA")',
      label: 'Inspeccionar Caja Misteriosa',
      x: 4,
      y: 5,
      width: 1,
      height: 1,
      zoneId: 1,
      type: 'mystery_box'
    },
    {
      id: 'door_z1_to_z2',
      name: 'Puerta al Taller',
      label: 'Entrar al Taller de Ensamblaje',
      x: 14,
      y: 6,
      width: 1,
      height: 1,
      zoneId: 1,
      type: 'teleport',
      targetZone: 2
    },
    // Zone 2: El Taller de Ensamblaje (Puertos, Periféricos y HW/SW)
    {
      id: 'ports_z2',
      name: 'Panel de Puertos (Mini-Estación A)',
      label: 'Conectar Cables a Puertos (HDMI, USB, Jack, Poder)',
      x: 4,
      y: 5,
      width: 1,
      height: 1,
      zoneId: 2,
      type: 'assembly_ports'
    },
    {
      id: 'sorter_z2',
      name: 'Cinta Clasificadora de Periféricos (Mini-Estación B)',
      label: 'Clasificar Entrada vs Salida',
      x: 8,
      y: 5,
      width: 1,
      height: 1,
      zoneId: 2,
      type: 'assembly_sorter'
    },
    {
      id: 'screen_z2',
      name: 'Experimento Monitor Mudo (Mini-Estación C)',
      label: 'Comprobar Frontera Hardware y Software',
      x: 12,
      y: 5,
      width: 1,
      height: 1,
      zoneId: 2,
      type: 'assembly_screen'
    },
    {
      id: 'door_z2_to_z1',
      name: 'Salida a Plaza',
      label: 'Volver a Plaza Inicial',
      x: 1,
      y: 6,
      width: 1,
      height: 1,
      zoneId: 2,
      type: 'teleport',
      targetZone: 1
    },
    {
      id: 'door_z2_to_z3',
      name: 'Puerta a Laboratorio',
      label: 'Ir a Laboratorio de Diagnóstico',
      x: 15,
      y: 6,
      width: 1,
      height: 1,
      zoneId: 2,
      type: 'teleport',
      targetZone: 3
    },
    // Zone 3: Laboratorio de Diagnóstico
    {
      id: 'bench_z3',
      name: 'Mesa de Diagnóstico de Teclado',
      label: 'Examinar Teclado y Pruebas',
      x: 7,
      y: 5,
      width: 1,
      height: 1,
      zoneId: 3,
      type: 'keyboard_lab'
    },
    {
      id: 'door_z3_to_z2',
      name: 'Puerta a Taller',
      label: 'Volver al Taller de Ensamblaje',
      x: 1,
      y: 6,
      width: 1,
      height: 1,
      zoneId: 3,
      type: 'teleport',
      targetZone: 2
    },
    {
      id: 'door_z3_to_z4',
      name: 'Puerta a Hospital',
      label: 'Ir a Hospital de Dispositivos',
      x: 14,
      y: 6,
      width: 1,
      height: 1,
      zoneId: 3,
      type: 'teleport',
      targetZone: 4
    },
    // Zone 4: Hospital de Dispositivos
    {
      id: 'mouse_z4',
      name: 'Paciente 1: Mouse Clic Fantasma',
      label: 'Examinar Mouse',
      x: 6,
      y: 5,
      width: 1,
      height: 1,
      zoneId: 4,
      type: 'patient_mouse'
    },
    {
      id: 'monitor_z4',
      name: 'Paciente 2: Monitor Sin Señal',
      label: 'Examinar Monitor',
      x: 9,
      y: 5,
      width: 1,
      height: 1,
      zoneId: 4,
      type: 'patient_monitor'
    },
    {
      id: 'printer_z4',
      name: 'Paciente 3: Impresora Muda',
      label: 'Examinar Impresora',
      x: 12,
      y: 5,
      width: 1,
      height: 1,
      zoneId: 4,
      type: 'patient_printer'
    },
    {
      id: 'door_z4_to_z3',
      name: 'Puerta a Laboratorio',
      label: 'Volver a Laboratorio',
      x: 1,
      y: 6,
      width: 1,
      height: 1,
      zoneId: 4,
      type: 'teleport',
      targetZone: 3
    },
    {
      id: 'door_z4_to_z5',
      name: 'Puerta a Callejón',
      label: 'Ir a Callejón del Tiempo',
      x: 15,
      y: 6,
      width: 1,
      height: 1,
      zoneId: 4,
      type: 'teleport',
      targetZone: 5
    },
    // Zone 5: Callejón del Tiempo
    {
      id: 'laptop_z5',
      name: 'Laptop de Rodrigo',
      label: 'Inspeccionar Laptop Funcional',
      x: 7,
      y: 6,
      width: 1,
      height: 1,
      zoneId: 5,
      type: 'consumer_laptop'
    },
    {
      id: 'door_z5_to_z4',
      name: 'Puerta a Hospital',
      label: 'Volver a Hospital',
      x: 1,
      y: 6,
      width: 1,
      height: 1,
      zoneId: 5,
      type: 'teleport',
      targetZone: 4
    },
    {
      id: 'door_z5_to_z6',
      name: 'Puerta a Estación PAEC',
      label: 'Ir a Estación Cero Basura',
      x: 14,
      y: 6,
      width: 1,
      height: 1,
      zoneId: 5,
      type: 'teleport',
      targetZone: 6
    },
    // Zone 6: Estación Cero Basura
    {
      id: 'paec_station_z6',
      name: 'Estación de Clasificación PAEC',
      label: 'Iniciar Árbol de Clasificación Cero Basura',
      x: 8,
      y: 5,
      width: 1,
      height: 1,
      zoneId: 6,
      type: 'paec_station'
    },
    {
      id: 'door_z6_to_z5',
      name: 'Puerta a Callejón',
      label: 'Volver a Callejón',
      x: 1,
      y: 6,
      width: 1,
      height: 1,
      zoneId: 6,
      type: 'teleport',
      targetZone: 5
    },
    {
      id: 'door_z6_to_z7',
      name: 'Entrada a Examen UNAM',
      label: 'Entrar a Sala del Maestro Evaluador',
      x: 14,
      y: 6,
      width: 1,
      height: 1,
      zoneId: 6,
      type: 'teleport',
      targetZone: 7
    },
    // Zone 7: Sala del Maestro UNAM
    {
      id: 'podium_z7',
      name: 'Podio del Examen UNAM',
      label: 'Presentar Reactivo Crítico',
      x: 8,
      y: 5,
      width: 1,
      height: 1,
      zoneId: 7,
      type: 'exam_gate'
    },
    {
      id: 'door_z7_to_z6',
      name: 'Puerta a Estación PAEC',
      label: 'Volver a Estación PAEC',
      x: 8,
      y: 11,
      width: 1,
      height: 1,
      zoneId: 7,
      type: 'teleport',
      targetZone: 6
    }
  ];

  // Proximity Check Helper
  const getNearbyInteractable = useCallback(() => {
    // 1. Check objects
    for (const obj of objects) {
      if (obj.zoneId === progression.currentZone) {
        const dx = Math.abs(playerPos.x - obj.x);
        const dy = Math.abs(playerPos.y - obj.y);
        if (dx <= 1.2 && dy <= 1.2) {
          return { type: 'object' as const, name: obj.name, label: obj.label, entity: obj };
        }
      }
    }

    // 2. Check NPCs
    for (const npc of npcs) {
      if (npc.zoneId === progression.currentZone) {
        const dx = Math.abs(playerPos.x - npc.x);
        const dy = Math.abs(playerPos.y - npc.y);
        if (dx <= npc.interactRadius && dy <= npc.interactRadius) {
          return { type: 'npc' as const, name: npc.name, label: `Hablar con ${npc.name}`, entity: npc };
        }
      }
    }

    return null;
  }, [playerPos, progression.currentZone]);

  // Movement Logic with boundary and collision checks
  const handleMove = useCallback((dir: Direction) => {
    setPlayerDirection(dir);
    setIsMoving(true);
    setWalkFrame(prev => prev + 1);
    sounds.playStep();

    setPlayerPos(prev => {
      let newX = prev.x;
      let newY = prev.y;

      if (dir === 'up') newY -= 1;
      if (dir === 'down') newY += 1;
      if (dir === 'left') newX -= 1;
      if (dir === 'right') newX += 1;

      // Bounds check
      const currentZoneMeta = ZONES[progression.currentZone] || ZONES[1];
      const { xMin, xMax, yMin, yMax } = currentZoneMeta.mapBounds;

      if (newX < xMin + 1 || newX > xMax - 2 || newY < yMin + 1 || newY > yMax - 2) {
        return prev;
      }

      // Solid collision check against NPCs and major objects
      const isCollidingWithNPC = npcs.some(
        npc => npc.zoneId === progression.currentZone && npc.x === newX && npc.y === newY
      );
      if (isCollidingWithNPC) return prev;

      return { x: newX, y: newY };
    });
  }, [progression.currentZone]);

  const handleStopMove = useCallback(() => {
    setIsMoving(false);
  }, []);

  // Primary Action Trigger (A button / Space / Enter)
  const handlePrimaryAction = useCallback(() => {
    sounds.playSelect();

    // If dialog is active, advance it
    if (currentDialog) {
      if (currentDialog.action) {
        currentDialog.action();
      }
      setCurrentDialog(null);
      return;
    }

    const nearby = getNearbyInteractable();
    if (!nearby) return;

    // Handle Object interaction
    if (nearby.type === 'object') {
      const obj = nearby.entity as InteractiveObject;

      if (obj.type === 'teleport' && obj.targetZone) {
        if (
          obj.targetZone === 3 &&
          !progression.workshopCompleted &&
          !progression.completedZones.includes(2)
        ) {
          sounds.playError();
          showToast('⚠️ Completa las 3 estaciones del Taller de Ensamblaje antes de pasar a la Zona 3.');
          return;
        }
        setProgression(prev => ({ ...prev, currentZone: obj.targetZone! }));
        setPlayerPos(ZONES[obj.targetZone!].spawn);
        sounds.playSuccess();
        return;
      }

      if (obj.type === 'mystery_box') {
        setActiveMinigame('zone1');
        return;
      }

      if (obj.type === 'assembly_ports') {
        setActiveWorkshopStation('A');
        setActiveMinigame('zone2');
        return;
      }

      if (obj.type === 'assembly_sorter') {
        setActiveWorkshopStation('B');
        setActiveMinigame('zone2');
        return;
      }

      if (obj.type === 'assembly_screen') {
        setActiveWorkshopStation('C');
        setActiveMinigame('zone2');
        return;
      }

      if (obj.type === 'keyboard_lab') {
        setActiveMinigame('zone3');
        return;
      }

      if (obj.type === 'patient_mouse') {
        setActiveHospitalPatient('mouse');
        setActiveMinigame('zone4');
        return;
      }

      if (obj.type === 'patient_monitor') {
        setActiveHospitalPatient('monitor');
        setActiveMinigame('zone4');
        return;
      }

      if (obj.type === 'patient_printer') {
        setActiveHospitalPatient('printer');
        setActiveMinigame('zone4');
        return;
      }

      if (obj.type === 'consumer_laptop') {
        setActiveMinigame('zone5');
        return;
      }

      if (obj.type === 'paec_station') {
        setActiveMinigame('zone6');
        return;
      }

      if (obj.type === 'exam_gate') {
        setActiveMinigame('zone7');
        return;
      }
    }

    // Handle NPC interaction
    if (nearby.type === 'npc') {
      const npc = nearby.entity as NPC;

      if (npc.id === 'prof_zone1') {
        setCurrentDialog({
          speaker: npc.name,
          role: npc.role,
          avatar: 'PROF',
          text: '¡Bienvenido a Cultura Digital I! Antes de botar cualquier dispositivo al camión de basura, nuestra misión es diagnosticar. Revisa esa caja "BASURA" en la plaza.',
          action: () => setActiveMinigame('zone1')
        });
      } else if (npc.id === 'tech_zone2') {
        const stations = progression.workshopStations || { stationA: false, stationB: false, stationC: false };
        const nextStation = !stations.stationA ? 'A' : !stations.stationB ? 'B' : !stations.stationC ? 'C' : 'A';
        setCurrentDialog({
          speaker: npc.name,
          role: npc.role,
          avatar: 'TECH',
          text: progression.workshopCompleted
            ? '¡Excelente trabajo! Has completado el Taller de Ensamblaje. Puedes repasar las 3 estaciones o cruzar la puerta norte hacia el Laboratorio de Diagnóstico.'
            : '¡Bienvenido al Taller de Ensamblaje! Aquí aprenderás los puertos físicos (Estación A), clasificarás periféricos de Entrada y Salida (Estación B), y comprobarás con el monitor mudo que el hardware sin software no produce imagen (Estación C).',
          action: () => {
            setActiveWorkshopStation(nextStation);
            setActiveMinigame('zone2');
          }
        });
      } else if (npc.id === 'tech_zone3') {
        setCurrentDialog({
          speaker: npc.name,
          role: npc.role,
          avatar: 'TECH',
          text: 'El hardware es lo que puedes tocar con tus manos; el software son las órdenes del sistema. Oprime la mesa de diagnóstico para comprobar qué está fallando en este teclado.',
          action: () => setActiveMinigame('zone3')
        });
      } else if (npc.id === 'student_zone4') {
        setCurrentDialog({
          speaker: npc.name,
          role: npc.role,
          avatar: 'SOFI',
          text: '¡Llegaste al Hospital de Dispositivos! Tenemos tres pacientes en camillas: un mouse que hace clics dobles, un monitor sin señal y una impresora muda. ¿Nos ayudas a salvarlos?',
          action: () => setActiveMinigame('zone4')
        });
      } else if (npc.id === 'consumer_zone5') {
        setCurrentDialog({
          speaker: npc.name,
          role: npc.role,
          avatar: 'ROD',
          text: '¡Quiero tirar mi laptop que funciona al 100% solo porque ya salió la versión 15!',
          action: () => setActiveMinigame('zone5')
        });
      } else if (npc.id === 'paec_zone6') {
        setCurrentDialog({
          speaker: npc.name,
          role: npc.role,
          avatar: 'LAURA',
          text: 'La estrategia PAEC nos enseña el árbol de decisión: ¿Funciona? -> Seguir usando. ¿No funciona pero es reparable? -> Reparar. ¿No reparable? -> Manejo Especializado RAEE. ¡Usa la estación verde!',
          action: () => setActiveMinigame('zone6')
        });
      } else if (npc.id === 'guardian_zone7') {
        setCurrentDialog({
          speaker: npc.name,
          role: npc.role,
          avatar: 'DOC',
          text: 'Has demostrado destreza en el Distrito Tecnológico CETis. Ahora enfrenta el reactivo razonado tipo examen UNAM para certificar tu dominio.',
          action: () => setActiveMinigame('zone7')
        });
      }
    }
  }, [currentDialog, getNearbyInteractable]);

  // Physical Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      // If a modal or minigame is active, prevent background movement
      if (activeMinigame || isDexOpen || isReportOpen || isStartScreenOpen) {
        if (e.key === 'Escape') {
          if (isStartScreenOpen && student.name) {
            setIsStartScreenOpen(false);
          } else {
            setIsDexOpen(false);
            setIsReportOpen(false);
            setActiveMinigame(null);
          }
        }
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          handleMove('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          handleMove('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          handleMove('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          handleMove('right');
          break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          handlePrimaryAction();
          break;
        case 'Escape':
          e.preventDefault();
          setIsDexOpen(false);
          setIsReportOpen(false);
          setActiveMinigame(null);
          setCurrentDialog(null);
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(
          e.key
        )
      ) {
        handleStopMove();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleMove, handleStopMove, handlePrimaryAction]);

  // Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      drawGameCanvas(ctx, {
        zoneId: progression.currentZone,
        playerPos,
        playerDirection,
        isMoving,
        walkFrame,
        npcs,
        objects,
        nearbyInteractable: getNearbyInteractable()
      });
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [playerPos, playerDirection, isMoving, walkFrame, progression.currentZone, getNearbyInteractable]);

  // Direct Teleport function from selector
  const handleSelectZone = (zoneId: number) => {
    setProgression(prev => ({ ...prev, currentZone: zoneId }));
    setPlayerPos(ZONES[zoneId].spawn);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-between font-sans text-slate-100">
      {/* Top Header Navbar */}
      <header className="w-full bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 border border-red-400 flex items-center justify-center font-bold text-white text-xs font-pixel shadow">
            C2
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              Distrito Tecnológico CETis
              <span className="hidden sm:inline-block text-[10px] font-pixel bg-cyan-950 text-cyan-300 border border-cyan-500/50 px-2 py-0.5 rounded">
                Cultura Digital I
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Módulo: Hardware, Software, Obsolescencia y Estrategia PAEC Cero Basura
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Current Student Badge (clickable to view/restart) */}
          {student.name && (
            <button
              onClick={() => {
                sounds.playSelect();
                setIsStartScreenOpen(true);
              }}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-slate-500 rounded-xl text-xs text-slate-200 transition-colors cursor-pointer shadow-sm"
              title="Alumno registrado en Bitácora (clic para reiniciar o cambiar)"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-white max-w-[120px] truncate">{student.name}</span>
              <span className="text-slate-400 text-[10px]">({student.group})</span>
            </button>
          )}

          <button
            onClick={() => {
              sounds.playSelect();
              setIsStartScreenOpen(true);
            }}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition-transform active:scale-95 cursor-pointer"
            title="Registrar nuevo alumno y reiniciar partida"
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Nuevo Alumno</span>
          </button>

          <button
            onClick={() => {
              sounds.playSelect();
              setIsDexOpen(true);
            }}
            className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-cyan-300" />
            <span className="hidden sm:inline">DEX-Glosario</span>
            <span className="bg-red-950 px-1.5 py-0.2 rounded text-[10px] text-red-200">
              {progression.unlockedDexIds.length}/9
            </span>
          </button>

          <button
            onClick={() => {
              sounds.playSelect();
              setIsReportOpen(true);
            }}
            className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            <ClipboardList className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Bitácora</span>
            <span className="bg-indigo-950 px-1.5 py-0.2 rounded text-[10px] text-indigo-200">
              {progression.score} pts
            </span>
          </button>
        </div>
      </header>

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed top-14 z-50 animate-in slide-in-from-top-4 duration-300 px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 border-2 border-white rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold text-white">
          <Sparkles className="w-4 h-4 text-yellow-200 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Game Stage Container */}
      <main className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center p-2 sm:p-4 relative">
        {/* Retro Game Boy Console Frame */}
        <div className="w-full bg-slate-900 border-4 border-slate-700 rounded-3xl p-2 sm:p-4 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col items-center relative overflow-hidden">
          {/* Subtle Speaker grill slots */}
          <div className="hidden sm:flex gap-1.5 absolute top-3 right-6 opacity-30">
            <span className="w-1.5 h-6 bg-slate-500 rounded-full"></span>
            <span className="w-1.5 h-6 bg-slate-500 rounded-full"></span>
            <span className="w-1.5 h-6 bg-slate-500 rounded-full"></span>
          </div>

          {/* Screen Bezel */}
          <div className="w-full bg-slate-950 border-4 border-slate-800 rounded-2xl p-1 relative shadow-inner overflow-hidden flex items-center justify-center">
            {/* 2D Canvas */}
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="w-full h-auto aspect-[4/3] max-h-[58vh] bg-slate-950 rounded-xl pixel-art block cursor-pointer"
              onClick={handlePrimaryAction}
            />

            {/* In-Game RPG Dialog Box */}
            {currentDialog && (
              <DialogBox
                speaker={currentDialog.speaker}
                role={currentDialog.role}
                avatar={currentDialog.avatar}
                text={currentDialog.text}
                onNext={() => {
                  if (currentDialog.action) currentDialog.action();
                  setCurrentDialog(null);
                }}
                onClose={() => setCurrentDialog(null)}
              />
            )}
          </div>

          {/* Virtual Controls (Touch D-Pad + Action Buttons) */}
          <VirtualControls
            onMove={handleMove}
            onStopMove={handleStopMove}
            onAction={handlePrimaryAction}
            onCancel={() => {
              setCurrentDialog(null);
              setActiveMinigame(null);
            }}
            onOpenDex={() => setIsDexOpen(true)}
            onOpenReport={() => setIsReportOpen(true)}
            onToggleAudio={() => {
              const muted = sounds.toggleMute();
              setIsAudioMuted(muted);
            }}
            isMuted={isAudioMuted}
            currentZone={progression.currentZone}
            onSelectZone={handleSelectZone}
          />
        </div>
      </main>

      {/* MINIGAME MODALS FOR ALL 7 ZONES */}
      {/* Zone 1: Mystery Box */}
      {activeMinigame === 'zone1' && (
        <Zone1Hypothesis
          onComplete={(hypothesis, isCorrect, explanation) => {
            setProgression(prev => ({
              ...prev,
              hypothesis,
              score: prev.score + (isCorrect ? 15 : 5),
              completedZones: Array.from(new Set([...prev.completedZones, 1])),
              decisions: [
                ...prev.decisions,
                {
                  zoneId: 1,
                  zoneTitle: 'Zona 1: La Caja del Misterio',
                  question: 'Planteamiento de Hipótesis Diagnóstica',
                  selectedAnswer: hypothesis,
                  isCorrect,
                  explanation,
                  timestamp: new Date().toLocaleTimeString('es-MX')
                }
              ]
            }));
            unlockDex('hardware', 'Hardware');
            unlockDex('software', 'Software');
            setActiveMinigame(null);
            // Move player to Zone 2
            setProgression(prev => ({ ...prev, currentZone: 2 }));
            setPlayerPos(ZONES[2].spawn);
          }}
          onClose={() => setActiveMinigame(null)}
        />
      )}

      {/* Zone 2: Assembly Workshop (Ports, Peripherals & Silent Monitor) */}
      {activeMinigame === 'zone2' && (
        <Zone2AssemblyWorkshop
          initialStation={activeWorkshopStation}
          completedStations={progression.workshopStations}
          onCompleteStation={(stationId) => {
            setProgression(prev => ({
              ...prev,
              workshopStations: {
                ...(prev.workshopStations || { stationA: false, stationB: false, stationC: false }),
                [stationId === 'A' ? 'stationA' : stationId === 'B' ? 'stationB' : 'stationC']: true
              }
            }));
          }}
          onComplete={() => {
            setProgression(prev => ({
              ...prev,
              workshopCompleted: true,
              workshopStations: {
                stationA: true,
                stationB: true,
                stationC: true
              },
              score: prev.score + 20,
              completedZones: Array.from(new Set([...prev.completedZones, 2])),
              decisions: [
                ...prev.decisions,
                {
                  zoneId: 2,
                  zoneTitle: 'Zona 2: El Taller de Ensamblaje',
                  question: 'Conexión de Puertos, Periféricos y Monitor Mudo',
                  selectedAnswer: 'Puertos físicos ensamblados, periféricos clasificados y frontera hardware/software verificada.',
                  isCorrect: true,
                  explanation: 'Se demostró la conexión empírica de cables y que sin software una pantalla conectada queda en espera pasiva (monitor mudo).',
                  timestamp: new Date().toLocaleTimeString('es-MX')
                }
              ]
            }));
            unlockDex('perifericos_io', 'Periféricos (Entrada y Salida)');
            unlockDex('puerto', 'Puerto / Entrada');
            setActiveMinigame(null);
            // Teleport to Zone 3: Laboratorio de Diagnóstico
            setProgression(prev => ({ ...prev, currentZone: 3 }));
            setPlayerPos(ZONES[3].spawn);
          }}
          onClose={() => setActiveMinigame(null)}
        />
      )}

      {/* Zone 3: Keyboard Lab */}
      {activeMinigame === 'zone3' && (
        <Zone2KeyboardLab
          onComplete={(isCorrect, explanation) => {
            setProgression(prev => ({
              ...prev,
              keyboardFixed: true,
              score: prev.score + 20,
              completedZones: Array.from(new Set([...prev.completedZones, 3])),
              decisions: [
                ...prev.decisions,
                {
                  zoneId: 3,
                  zoneTitle: 'Zona 3: Laboratorio de Diagnóstico',
                  question: 'Inspección de Teclado (Falla de Software AZERTY vs Hardware)',
                  selectedAnswer: 'Hardware verificado intacto; software reconfigurado a Español QWERTY.',
                  isCorrect,
                  explanation,
                  timestamp: new Date().toLocaleTimeString('es-MX')
                }
              ]
            }));
            unlockDex('distribucion', 'Distribución de Teclado');
            unlockDex('sistema_operativo', 'Sistema Operativo');
            setActiveMinigame(null);
            // Teleport to Zone 4: Hospital de Dispositivos
            setProgression(prev => ({ ...prev, currentZone: 4 }));
            setPlayerPos(ZONES[4].spawn);
          }}
          onClose={() => setActiveMinigame(null)}
        />
      )}

      {/* Zone 4: Hospital Clinic */}
      {activeMinigame === 'zone4' && (
        <Zone3Hospital
          initialPatient={activeHospitalPatient}
          completedCases={progression.hospitalCases}
          onCompleteCase={(patientId, explanation) => {
            setProgression(prev => {
              const updatedCases = { ...prev.hospitalCases, [patientId]: true };
              return {
                ...prev,
                hospitalCases: updatedCases,
                score: prev.score + 10,
                decisions: [
                  ...prev.decisions,
                  {
                    zoneId: 4,
                    zoneTitle: `Zona 4: Hospital (${patientId})`,
                    question: `Diagnóstico del Paciente ${patientId}`,
                    selectedAnswer: `Alta médica completada para ${patientId}`,
                    isCorrect: true,
                    explanation,
                    timestamp: new Date().toLocaleTimeString('es-MX')
                  }
                ]
              };
            });
            if (patientId === 'printer') unlockDex('driver', 'Controlador (Driver)');
            if (patientId === 'monitor') unlockDex('puerto', 'Puerto / Entrada');
          }}
          onAllCompleted={() => {
            setProgression(prev => ({
              ...prev,
              completedZones: Array.from(new Set([...prev.completedZones, 4])),
              currentZone: 5
            }));
            setPlayerPos(ZONES[5].spawn);
            setActiveMinigame(null);
          }}
          onClose={() => setActiveMinigame(null)}
        />
      )}

      {/* Zone 5: Obsolescence */}
      {activeMinigame === 'zone5' && (
        <Zone4Obsolescence
          onComplete={(isCorrect, explanation) => {
            setProgression(prev => ({
              ...prev,
              obsolescenceConvinced: true,
              score: prev.score + 20,
              completedZones: Array.from(new Set([...prev.completedZones, 5])),
              decisions: [
                ...prev.decisions,
                {
                  zoneId: 5,
                  zoneTitle: 'Zona 5: Callejón del Tiempo',
                  question: 'Clasificación de Obsolescencia Percibida y Prevención de Desecho',
                  selectedAnswer: 'Obsolescencia Percibida detectada; usuario orientado a donación.',
                  isCorrect,
                  explanation,
                  timestamp: new Date().toLocaleTimeString('es-MX')
                }
              ]
            }));
            unlockDex('obsolescencia_percibida', 'Obsolescencia Percibida');
            setActiveMinigame(null);
            setProgression(prev => ({ ...prev, currentZone: 6 }));
            setPlayerPos(ZONES[6].spawn);
          }}
          onClose={() => setActiveMinigame(null)}
        />
      )}

      {/* Zone 6: PAEC Tree */}
      {activeMinigame === 'zone6' && (
        <Zone5PaecTree
          onComplete={(isCorrect, explanation) => {
            setProgression(prev => ({
              ...prev,
              paecSortedCount: 3,
              score: prev.score + 20,
              completedZones: Array.from(new Set([...prev.completedZones, 6])),
              decisions: [
                ...prev.decisions,
                {
                  zoneId: 6,
                  zoneTitle: 'Zona 6: Estación Cero Basura PAEC',
                  question: 'Árbol de Decisión Algorítmico Ambiental',
                  selectedAnswer: '3 dispositivos clasificados bajo la ruta ecológica oficial.',
                  isCorrect,
                  explanation,
                  timestamp: new Date().toLocaleTimeString('es-MX')
                }
              ]
            }));
            unlockDex('manejo_especializado', 'Manejo Especializado (PAEC)');
            setActiveMinigame(null);
            setProgression(prev => ({ ...prev, currentZone: 7 }));
            setPlayerPos(ZONES[7].spawn);
          }}
          onClose={() => setActiveMinigame(null)}
        />
      )}

      {/* Zone 7: UNAM Exam */}
      {activeMinigame === 'zone7' && (
        <Zone6UnamExam
          onComplete={(selectedOption, isCorrect, explanation) => {
            setProgression(prev => ({
              ...prev,
              examPassed: isCorrect,
              examAnswer: selectedOption,
              score: prev.score + (isCorrect ? 25 : 5),
              completedZones: Array.from(new Set([...prev.completedZones, 7])),
              decisions: [
                ...prev.decisions,
                {
                  zoneId: 7,
                  zoneTitle: 'Zona 7: Examen del Maestro de Sala',
                  question: 'Reactivo Crítico: Computadora física intacta con SO que no instala apps recientes',
                  selectedAnswer: selectedOption,
                  isCorrect,
                  explanation,
                  timestamp: new Date().toLocaleTimeString('es-MX')
                }
              ]
            }));
            unlockDex('incompatibilidad', 'Incompatibilidad Técnica');
            setActiveMinigame(null);
            setToastMessage('¡Examen completado! Has terminado todas las zonas del mapa escolar.');
            setTimeout(() => setToastMessage(null), 5000);
            setIsReportOpen(true); // Open final student report upon exam completion!
          }}
          onClose={() => setActiveMinigame(null)}
        />
      )}

      {/* DEX-GLOSARIO MODAL */}
      {isDexOpen && (
        <DexModal
          entries={INITIAL_DEX_ENTRIES}
          unlockedIds={progression.unlockedDexIds}
          onClose={() => setIsDexOpen(false)}
        />
      )}

      {/* STUDENT REPORT (BITÁCORA) MODAL */}
      {isReportOpen && (
        <StudentReportModal
          student={student}
          onUpdateStudent={setStudent}
          progression={progression}
          totalDexCount={INITIAL_DEX_ENTRIES.length}
          onClose={() => setIsReportOpen(false)}
          onOpenStartScreen={() => setIsStartScreenOpen(true)}
        />
      )}

      {/* START SCREEN MODAL (STUDENT REGISTRATION & RESET) */}
      {isStartScreenOpen && (
        <StartScreenModal
          currentStudent={student}
          onStartNewGame={handleStartNewGame}
        />
      )}
    </div>
  );
}
