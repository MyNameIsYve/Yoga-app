import { Routine, RoutineItem } from './types';

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Format seconds to MM:SS
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Format duration in seconds to human-readable string
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (secs === 0) {
    return `${mins}m`;
  }

  return `${mins}m ${secs}s`;
}

// Calculate total duration of a routine
export function calculateRoutineDuration(items: RoutineItem[]): number {
  return items.reduce((total, item) => total + item.duration, 0);
}

// Validate routine
export function validateRoutine(routine: Partial<Routine>): string | null {
  if (!routine.name || routine.name.trim() === '') {
    return 'Routine name is required';
  }

  if (!routine.items || routine.items.length === 0) {
    return 'Routine must have at least one pose';
  }

  for (const item of routine.items) {
    if (item.duration <= 0) {
      return 'All poses must have a duration greater than 0';
    }
  }

  return null;
}

// Combine class names (simple version)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
