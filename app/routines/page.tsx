'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Routine } from '@/lib/types';
import { getRoutines, deleteRoutine } from '@/lib/storage';
import { formatDuration } from '@/lib/utils';

export default function RoutinesPage() {
  const router = useRouter();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadRoutines();
  }, []);

  function loadRoutines() {
    const loaded = getRoutines();
    setRoutines(loaded);
  }

  function handleDelete(id: string) {
    deleteRoutine(id);
    loadRoutines();
    setDeleteConfirm(null);
  }

  function handleStartSession(id: string) {
    router.push(`/player/${id}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-purple-800/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-purple-300 hover:text-purple-200 text-sm font-medium">
              ← Home
            </Link>
            <h1 className="text-2xl font-bold text-white">
              My Routines
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Create New Button */}
        <div className="mb-6">
          <Link href="/routines/create">
            <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2">
              <span className="text-xl">+</span>
              <span>Create New Routine</span>
            </button>
          </Link>
        </div>

        {/* Routines List */}
        {routines.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-800/30 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🧘</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Routines Yet
            </h3>
            <p className="text-purple-200 mb-6">
              Create your first yoga routine to get started
            </p>
            <Link href="/routines/create">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all shadow-lg">
                Create Your First Routine
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {routines.map((routine) => (
              <div
                key={routine.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-purple-800/30 rounded-2xl p-6 hover:border-purple-600/50 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* Routine Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {routine.name}
                    </h3>
                    {routine.description && (
                      <p className="text-purple-200 mb-3">
                        {routine.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3 text-sm text-purple-300">
                      <span className="flex items-center gap-1">
                        <span>📊</span>
                        <span>{routine.items.length} poses</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>⏱️</span>
                        <span>{formatDuration(routine.totalDuration)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>📅</span>
                        <span>Created {new Date(routine.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2">
                    <button
                      onClick={() => handleStartSession(routine.id)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all text-center min-w-[120px]"
                    >
                      ▶️ Start
                    </button>
                    <Link href={`/routines/edit/${routine.id}`} className="flex-1 sm:flex-none">
                      <button className="w-full px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold rounded-lg transition-colors min-w-[120px]">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(routine.id)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors min-w-[120px]"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === routine.id && (
                  <div className="mt-4 p-4 bg-red-900/30 border-2 border-red-500 rounded-lg">
                    <p className="text-white font-semibold mb-3">
                      Are you sure you want to delete "{routine.name}"?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(routine.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
