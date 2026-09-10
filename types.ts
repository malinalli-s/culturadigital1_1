export interface DexEntry {
  id: string;
  name: string;
  category: 'hardware' | 'software' | 'ambiente' | 'sistema';
  simpleDefinition: string;
  phoneAnalogy: string;
  technicalNote: string;
  unlocked: boolean;
  zone: string;
}

export interface StudentInfo {
  name: string;
  group: string;
  schoolId: string;
  notes: string;
}

export interface DiagnosticDecision {
  zoneId: number;
  zoneTitle: string;
  question: string;
  selectedAnswer: string;
  isCorrect: boolean;
  explanation: string;
  timestamp: string;
}

export interface GameProgression {
  currentZone: number;
  completedZones: number[];
  unlockedDexIds: string[];
  score: number;
  hypothesis: string;
  workshopCompleted?: boolean;
  workshopStations?: {
    stationA: boolean;
    stationB: boolean;
    stationC: boolean;
  };
  keyboardFixed: boolean;
  hospitalCases: {
    mouse: boolean;
    monitor: boolean;
    printer: boolean;
  };
  obsolescenceConvinced: boolean;
  paecSortedCount: number;
  examPassed: boolean;
  examAnswer: string | null;
  decisions: DiagnosticDecision[];
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Position {
  x: number;
  y: number;
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  direction: Direction;
  spriteType: 'teacher' | 'technician' | 'consumer' | 'guardian' | 'student';
  zoneId: number;
  interactRadius: number;
  dialogueId: string;
}

export interface InteractiveObject {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zoneId: number;
  type: 'mystery_box' | 'assembly_ports' | 'assembly_sorter' | 'assembly_screen' | 'keyboard_lab' | 'patient_mouse' | 'patient_monitor' | 'patient_printer' | 'consumer_laptop' | 'paec_station' | 'exam_gate' | 'teleport';
  label: string;
  targetZone?: number;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  role: string;
  avatar: string;
  text: string;
  dexUnlock?: string;
  options?: {
    text: string;
    nextId?: string;
    action?: string;
    isCorrect?: boolean;
    scoreDelta?: number;
    explanation?: string;
  }[];
}
