'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { seedPoses } from '@/data/poses';
import { Routine, RoutineItem } from '@/lib/types';
import { addRoutine } from '@/lib/storage';
import { generateId } from '@/lib/utils';

export default function QuickStartPage() {
  const router = useRouter();
  const [step, setStep] = useState<'preference' | 'generating'>('preference');
  const [preference, setPreference] = useState({ x: 0, y: 0 }); // x: beginner(-1) to advanced(1), y: intense(-1) to relaxing(1)
  const [isDragging, setIsDragging] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !gridRef.current) return;

    const rect = gridRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1

    setPreference({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y))
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;

    const touch = e.touches[0];
    const rect = gridRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((touch.clientY - rect.top) / rect.height) * 2 - 1;

    setPreference({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y))
    });
  };

  const getTrainingStyle = () => {
    if (preference.y < -0.4) return 'intense';
    if (preference.y > 0.4) return 'relaxing';
    return 'balanced';
  };

  const getDifficultyLabel = () => {
    if (preference.x < -0.6) return 'Beginner';
    if (preference.x < -0.2) return 'Beginner-Intermediate';
    if (preference.x < 0.2) return 'Intermediate';
    if (preference.x < 0.6) return 'Intermediate-Advanced';
    return 'Advanced';
  };

  const generateRoutine = () => {
    setStep('generating');

    // Score poses based on difficulty and training style
    const scoredPoses = seedPoses.map(pose => {
      let score = 0;

      // X axis: difficulty level (beginner -1 to advanced 1)
      if (preference.x < -0.4) {
        // User wants beginner
        if (pose.difficulty === 'beginner') score += 3;
        if (pose.difficulty === 'intermediate') score += 1;
      } else if (preference.x > 0.4) {
        // User wants advanced
        if (pose.difficulty === 'advanced') score += 3;
        if (pose.difficulty === 'intermediate') score += 2;
      } else {
        // User wants intermediate (or in-between)
        if (pose.difficulty === 'intermediate') score += 3;
        // Slightly favor beginner or advanced based on which side they're leaning
        if (preference.x < 0 && pose.difficulty === 'beginner') score += 2;
        if (preference.x > 0 && pose.difficulty === 'advanced') score += 2;
      }

      // Y axis: training style (intense -1 to relaxing 1)
      if (preference.y < 0) {
        // User wants intense/energizing
        if (pose.category === 'balance' || pose.category === 'inversion') score += 2;
        if (pose.category === 'standing' || pose.category === 'backbend') score += 1.5;
      } else {
        // User wants relaxing/calming
        if (pose.category === 'seated' || pose.category === 'supine') score += 2;
        if (pose.category === 'forward-fold' || pose.category === 'twist') score += 1.5;
      }

      return { pose, score };
    });

    // Sort by score and take top poses
    scoredPoses.sort((a, b) => b.score - a.score);
    const selectedPoses = scoredPoses.slice(0, 10).map(sp => sp.pose);

    // Create routine items
    const items: RoutineItem[] = selectedPoses.map(pose => ({
      id: generateId(),
      poseId: pose.id,
      duration: pose.defaultDuration,
      side: 'both',
      notes: ''
    }));

    // Calculate total duration
    const totalDuration = items.reduce((sum, item) => sum + item.duration, 0);

    // Create routine
    const routine: Routine = {
      id: `quick-start-${Date.now()}`,
      name: `Quick Start: ${getDifficultyLabel()}`,
      description: getRoutineDescription(),
      items,
      totalDuration,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save and navigate
    addRoutine(routine);

    setTimeout(() => {
      router.push(`/player/${routine.id}`);
    }, 1500);
  };

  const getRoutineDescription = () => {
    const style = getTrainingStyle();
    const level = getDifficultyLabel();
    return `A ${style} practice at ${level.toLowerCase()} level`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 flex items-center justify-center p-4">
      <div className="container max-w-2xl">
        {/* Preference Grid */}
        {step === 'preference' && (
          <div className="text-center">
            <Link href="/" className="inline-block text-purple-300 hover:text-purple-200 text-sm font-medium mb-8">
              ← Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Quick Start</h1>
            <p className="text-xl text-purple-200 mb-12">Drag the dot to customize your practice</p>

            <div className="relative w-full aspect-square max-w-md mx-auto mb-8">
              <div
                ref={gridRef}
                className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm border-2 border-purple-700/30 rounded-2xl cursor-crosshair overflow-hidden"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseUp}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                onTouchMove={handleTouchMove}
              >
                {/* Grid lines */}
                <div className="absolute inset-0">
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-purple-600/30" />
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-purple-600/30" />
                </div>

                {/* Corner Labels */}
                <div className="absolute top-4 left-4 text-xs text-purple-300 font-medium text-center">
                  <div>Beginner</div>
                  <div className="mt-1">Intense</div>
                </div>
                <div className="absolute top-4 right-4 text-xs text-purple-300 font-medium text-center">
                  <div>Advanced</div>
                  <div className="mt-1">Intense</div>
                </div>
                <div className="absolute bottom-4 left-4 text-xs text-purple-300 font-medium text-center">
                  <div className="mb-1">Relaxing</div>
                  <div>Beginner</div>
                </div>
                <div className="absolute bottom-4 right-4 text-xs text-purple-300 font-medium text-center">
                  <div className="mb-1">Relaxing</div>
                  <div>Advanced</div>
                </div>

                {/* Axis Labels */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 text-sm text-purple-200 font-semibold">
                  Difficulty Level
                </div>
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-20 -rotate-90 text-sm text-purple-200 font-semibold whitespace-nowrap">
                  Training Style
                </div>

                {/* Draggable dot */}
                <div
                  className="absolute w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 border-2 border-white"
                  style={{
                    left: `${(preference.x + 1) * 50}%`,
                    top: `${(preference.y + 1) * 50}%`,
                  }}
                />
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="text-purple-200 text-lg mb-2 font-semibold">
                {getDifficultyLabel()}
              </div>
              <div className="text-purple-300 text-base">
                {getTrainingStyle().charAt(0).toUpperCase() + getTrainingStyle().slice(1)} Practice
              </div>
            </div>

            <button
              onClick={generateRoutine}
              className="px-12 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-lg font-semibold rounded-lg transition-all shadow-lg"
            >
              Generate My Practice
            </button>
          </div>
        )}

        {/* Generating */}
        {step === 'generating' && (
          <div className="text-center">
            <div className="text-6xl mb-6 animate-pulse">🧘</div>
            <h2 className="text-3xl font-bold text-white mb-4">Creating Your Practice...</h2>
            <p className="text-purple-200 text-lg">
              Selecting poses for {getDifficultyLabel().toLowerCase()} • {getTrainingStyle()} style
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
