'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Routine, RoutineItem, Pose, PoseSide } from '@/lib/types';
import { seedPoses } from '@/data/poses';
import { getRoutineById, updateRoutine } from '@/lib/storage';
import { generateId, calculateRoutineDuration, formatDuration, validateRoutine } from '@/lib/utils';
import PoseCard from '@/components/PoseCard';

export default function EditRoutinePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<RoutineItem[]>([]);
  const [showPoseSelector, setShowPoseSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [routineId, setRoutineId] = useState<string | null>(null);

  // Unwrap params
  useEffect(() => {
    params.then((p) => setRoutineId(p.id));
  }, [params]);

  useEffect(() => {
    if (!routineId) return;

    const routine = getRoutineById(routineId);
    if (routine) {
      setName(routine.name);
      setDescription(routine.description || '');
      setItems(routine.items);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  }, [routineId]);

  const filteredPoses = seedPoses.filter(pose =>
    pose.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pose.sanskritName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleAddPose(pose: Pose) {
    const newItem: RoutineItem = {
      id: generateId(),
      poseId: pose.id,
      duration: pose.defaultDuration,
      side: 'both',
      notes: '',
    };
    setItems([...items, newItem]);
    setShowPoseSelector(false);
    setSearchQuery('');
  }

  function handleRemoveItem(itemId: string) {
    setItems(items.filter(item => item.id !== itemId));
  }

  function handleUpdateItem(itemId: string, updates: Partial<RoutineItem>) {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    ));
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setItems(newItems);
  }

  function handleMoveDown(index: number) {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setItems(newItems);
  }

  function handleSave() {
    if (!routineId) return;

    const totalDuration = calculateRoutineDuration(items);
    const updates: Partial<Routine> = {
      name: name.trim(),
      description: description.trim() || undefined,
      items,
      totalDuration,
    };

    const validationError = validateRoutine({ ...updates, id: routineId, createdAt: '', updatedAt: '' });
    if (validationError) {
      setError(validationError);
      return;
    }

    updateRoutine(routineId, updates);
    router.push('/routines');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Routine Not Found
          </h2>
          <Link href="/routines" className="text-blue-600 dark:text-blue-400 hover:underline">
            Back to Routines
          </Link>
        </div>
      </div>
    );
  }

  const totalDuration = calculateRoutineDuration(items);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/routines" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
              ← Back to Routines
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Routine
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Basic Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Routine Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Morning Flow, Evening Stretch"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this routine..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Poses ({items.length})
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total: {formatDuration(totalDuration)}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No poses added yet
              </p>
            </div>
          ) : (
            <div className="space-y-4 mb-4">
              {items.map((item, index) => {
                const pose = seedPoses.find(p => p.id === item.poseId);
                if (!pose) return null;

                return (
                  <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {index + 1}. {pose.name}
                            </h3>
                            {pose.sanskritName && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                {pose.sanskritName}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Duration (seconds)
                            </label>
                            <input
                              type="number"
                              min="5"
                              max="600"
                              value={item.duration}
                              onChange={(e) => handleUpdateItem(item.id, { duration: parseInt(e.target.value) || 30 })}
                              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Side
                            </label>
                            <select
                              value={item.side}
                              onChange={(e) => handleUpdateItem(item.id, { side: e.target.value as PoseSide })}
                              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            >
                              <option value="both">Both</option>
                              <option value="left">Left</option>
                              <option value="right">Right</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === items.length - 1}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={() => setShowPoseSelector(true)}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors font-medium"
          >
            + Add Pose
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-700 dark:text-red-300 font-medium">
              {error}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition-colors"
          >
            Save Changes
          </button>
          <Link href="/routines" className="flex-1">
            <button className="w-full px-6 py-3 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors">
              Cancel
            </button>
          </Link>
        </div>
      </div>

      {showPoseSelector && (
        <div className="fixed inset-0 bg-black/50 z-30 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl my-8">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 rounded-t-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Select a Pose
                </h3>
                <button
                  onClick={() => {
                    setShowPoseSelector(false);
                    setSearchQuery('');
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ✕
                </button>
              </div>
              <input
                type="text"
                placeholder="Search poses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPoses.map(pose => (
                  <div key={pose.id} onClick={() => handleAddPose(pose)}>
                    <PoseCard pose={pose} selectable />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
