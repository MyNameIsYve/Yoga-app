// Core data models for the yoga session app

export interface Pose {
  id: string;
  name: string;
  sanskritName?: string;
  category: 'standing' | 'seated' | 'supine' | 'prone' | 'balance' | 'inversion' | 'twist' | 'backbend' | 'forward-fold' | 'other';
  imageUrl: string;
  cues: string[]; // 1-3 short instructional cues
  defaultDuration: number; // default time in seconds
  benefits?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export type PoseSide = 'both' | 'left' | 'right';

export interface RoutineItem {
  id: string;
  poseId: string;
  duration: number; // seconds
  side: PoseSide;
  notes?: string; // optional notes for this specific item
}

export interface Routine {
  id: string;
  name: string;
  description?: string;
  items: RoutineItem[];
  totalDuration: number; // computed from items
  createdAt: string;
  updatedAt: string;
}

export interface SessionState {
  routineId: string;
  currentItemIndex: number;
  currentPoseId: string;
  currentSide: PoseSide;
  remainingTime: number; // seconds remaining for current pose
  isPaused: boolean;
  startedAt: string;
  completedItems: number;
  totalItems: number;
}

export interface AppSettings {
  playChimeOnTransition: boolean;
  playWarningChimeAt10Sec: boolean;
  warningChimeSeconds: number; // configurable warning time
  chimeVolume: number; // 0-1
  voiceGuidanceEnabled: boolean; // enable voice instructions
  voiceRate: number; // speech rate 0.5-2.0
  voicePitch: number; // speech pitch 0-2
  voiceVolume: number; // speech volume 0-1
  readPoseInstructions: boolean; // read cues when pose starts
  announceTimeRemaining: boolean; // announce when time is almost up
}
