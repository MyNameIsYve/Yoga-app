'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Routine, RoutineItem, Pose, PoseSide } from '@/lib/types';
import { seedPoses } from '@/data/poses';
import { addRoutine } from '@/lib/storage';
import { generateId, calculateRoutineDuration, formatDuration, validateRoutine } from '@/lib/utils';
import PoseCard from '@/components/PoseCard';

export default function CreateRoutinePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<RoutineItem[]>([]);
  const [showPoseSelector, setShowPoseSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Filter poses for selector
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
    const totalDuration = calculateRoutineDuration(items);
    const routine: Routine = {
      id: generateId(),
      name: name.trim(),
      description: description.trim() || undefined,
      items,
      totalDuration,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const validationError = validateRoutine(routine);
    if (validationError) {
      setError(validationError);
      return;
    }

    addRoutine(routine);
    router.push('/routines');
  }

  const totalDuration = calculateRoutineDuration(items);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-purple-800/30 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/routines" className="text-purple-300 hover:text-purple-200 text-sm font-medium">
              ← Back
            </Link>
            <h1 className="text-2xl font-bold text-white">
              Create Routine
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Basic Info */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-800/30 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Basic Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Routine Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Morning Flow, Evening Stretch"
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-purple-700/30 text-white placeholder-purple-300/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this routine..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-purple-700/30 text-white placeholder-purple-300/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Poses */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-800/30 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              Poses ({items.length})
            </h2>
            <div className="text-sm text-purple-200">
              Total: {formatDuration(totalDuration)}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-purple-300 mb-4">
                No poses added yet
              </p>
            </div>
          ) : (
            <div className="space-y-4 mb-4">
              {items.map((item, index) => {
                const pose = seedPoses.find(p => p.id === item.poseId);
                if (!pose) return null;

                return (
                  <div key={item.id} className="border border-purple-700/30 rounded-lg p-4 bg-gray-900/30">
                    <div className="flex items-start gap-4">
                      {/* Pose Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <h3 className="font-semibold text-white">
                              {index + 1}. {pose.name}
                            </h3>
                            {pose.sanskritName && (
                              <p className="text-sm text-purple-300 italic">
                                {pose.sanskritName}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-purple-200 mb-1">
                              Duration (seconds)
                            </label>
                            <input
                              type="number"
                              min="5"
                              max="600"
                              value={item.duration}
                              onChange={(e) => handleUpdateItem(item.id, { duration: parseInt(e.target.value) || 30 })}
                              className="w-full px-3 py-2 rounded bg-gray-900/50 border border-purple-700/30 text-white text-sm focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-purple-200 mb-1">
                              Side
                            </label>
                            <select
                              value={item.side}
                              onChange={(e) => handleUpdateItem(item.id, { side: e.target.value as PoseSide })}
                              className="w-full px-3 py-2 rounded bg-gray-900/50 border border-purple-700/30 text-white text-sm focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="both">Both</option>
                              <option value="left">Left</option>
                              <option value="right">Right</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-2 text-purple-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === items.length - 1}
                          className="p-2 text-purple-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-400 hover:text-red-300"
                          title="Remove"
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
            className="w-full px-4 py-3 border-2 border-dashed border-purple-600/50 rounded-lg text-purple-300 hover:border-purple-500 hover:text-purple-200 transition-colors font-medium"
          >
            + Add Pose
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-300 font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg transition-all"
          >
            Save Routine
          </button>
          <Link href="/routines" className="flex-1">
            <button className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors">
              Cancel
            </button>
          </Link>
        </div>
      </div>

      {/* Pose Selector Modal */}
      {showPoseSelector && (
        <div className="fixed inset-0 bg-black/70 z-30 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-gray-800 border border-purple-700/30 rounded-2xl shadow-xl w-full max-w-4xl my-8">
            <div className="sticky top-0 bg-gray-800 border-b border-purple-700/30 p-4 rounded-t-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  Select a Pose
                </h3>
                <button
                  onClick={() => {
                    setShowPoseSelector(false);
                    setSearchQuery('');
                  }}
                  className="text-purple-300 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
              <input
                type="text"
                placeholder="Search poses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-purple-700/30 text-white placeholder-purple-300/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
