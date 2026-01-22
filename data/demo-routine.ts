import { Routine } from '@/lib/types';
import { generateId } from '@/lib/utils';

// Pre-curated demo routine for Quick Start
// A 10-minute beginner-friendly flow
export const demoRoutine: Routine = {
  id: 'demo-quick-start',
  name: 'Quick Start Flow',
  description: 'A 10-minute beginner-friendly yoga flow to get you started',
  items: [
    {
      id: generateId(),
      poseId: '1', // Mountain Pose
      duration: 30,
      side: 'both',
    },
    {
      id: generateId(),
      poseId: '8', // Cat-Cow
      duration: 60,
      side: 'both',
    },
    {
      id: generateId(),
      poseId: '2', // Downward Dog
      duration: 45,
      side: 'both',
    },
    {
      id: generateId(),
      poseId: '3', // Warrior I
      duration: 30,
      side: 'right',
    },
    {
      id: generateId(),
      poseId: '3', // Warrior I
      duration: 30,
      side: 'left',
    },
    {
      id: generateId(),
      poseId: '4', // Warrior II
      duration: 30,
      side: 'right',
    },
    {
      id: generateId(),
      poseId: '4', // Warrior II
      duration: 30,
      side: 'left',
    },
    {
      id: generateId(),
      poseId: '5', // Triangle
      duration: 30,
      side: 'right',
    },
    {
      id: generateId(),
      poseId: '5', // Triangle
      duration: 30,
      side: 'left',
    },
    {
      id: generateId(),
      poseId: '7', // Child's Pose
      duration: 60,
      side: 'both',
    },
    {
      id: generateId(),
      poseId: '9', // Cobra
      duration: 30,
      side: 'both',
    },
    {
      id: generateId(),
      poseId: '7', // Child's Pose
      duration: 45,
      side: 'both',
    },
    {
      id: generateId(),
      poseId: '11', // Bridge
      duration: 45,
      side: 'both',
    },
    {
      id: generateId(),
      poseId: '30', // Reclining Twist
      duration: 45,
      side: 'right',
    },
    {
      id: generateId(),
      poseId: '30', // Reclining Twist
      duration: 45,
      side: 'left',
    },
    {
      id: generateId(),
      poseId: '14', // Savasana
      duration: 120,
      side: 'both',
    },
  ],
  totalDuration: 675, // 11 minutes 15 seconds
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
