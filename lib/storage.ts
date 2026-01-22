import { Routine, SessionState, AppSettings } from './types';

// localStorage keys
const KEYS = {
  ROUTINES: 'yoga-app-routines',
  SESSION: 'yoga-app-session',
  SETTINGS: 'yoga-app-settings',
} as const;

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  playChimeOnTransition: true,
  playWarningChimeAt10Sec: false,
  warningChimeSeconds: 10,
  chimeVolume: 0.7,
  voiceGuidanceEnabled: true,
  voiceRate: 0.65, // Extra slow, very calming pace for yoga
  voicePitch: 0.95, // Slightly lower pitch for soothing quality
  voiceVolume: 1.0,
  readPoseInstructions: true,
  announceTimeRemaining: true,
};

// Generic localStorage helpers
function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
  }
}

function removeItem(key: string): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
  }
}

// Routines
export function getRoutines(): Routine[] {
  return getItem<Routine[]>(KEYS.ROUTINES) || [];
}

export function saveRoutines(routines: Routine[]): void {
  setItem(KEYS.ROUTINES, routines);
}

export function getRoutineById(id: string): Routine | null {
  const routines = getRoutines();
  return routines.find(r => r.id === id) || null;
}

export function addRoutine(routine: Routine): void {
  const routines = getRoutines();
  routines.push(routine);
  saveRoutines(routines);
}

export function updateRoutine(id: string, updates: Partial<Routine>): void {
  const routines = getRoutines();
  const index = routines.findIndex(r => r.id === id);

  if (index !== -1) {
    routines[index] = { ...routines[index], ...updates, updatedAt: new Date().toISOString() };
    saveRoutines(routines);
  }
}

export function deleteRoutine(id: string): void {
  const routines = getRoutines();
  const filtered = routines.filter(r => r.id !== id);
  saveRoutines(filtered);
}

// Session state
export function getSessionState(): SessionState | null {
  return getItem<SessionState>(KEYS.SESSION);
}

export function saveSessionState(state: SessionState): void {
  setItem(KEYS.SESSION, state);
}

export function clearSessionState(): void {
  removeItem(KEYS.SESSION);
}

// Settings
export function getSettings(): AppSettings {
  return getItem<AppSettings>(KEYS.SETTINGS) || DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  setItem(KEYS.SETTINGS, settings);
}

export function updateSettings(updates: Partial<AppSettings>): void {
  const current = getSettings();
  const updated = { ...current, ...updates };
  saveSettings(updated);
}
