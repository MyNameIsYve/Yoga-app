'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import PoseCard from '@/components/PoseCard';
import { seedPoses } from '@/data/poses';
import { Pose } from '@/lib/types';

export default function PosesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Get unique categories and difficulties
  const categories = useMemo(() => {
    const cats = new Set(seedPoses.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, []);

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  // Filter poses
  const filteredPoses = useMemo(() => {
    return seedPoses.filter((pose) => {
      // Search filter - search in name (English & Sanskrit), difficulty, category, and cues
      const matchesSearch =
        searchQuery === '' ||
        pose.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pose.sanskritName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pose.difficulty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pose.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pose.cues.some(cue => cue.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategory === 'all' || pose.category === selectedCategory;

      // Difficulty filter
      const matchesDifficulty = selectedDifficulty === 'all' || pose.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-purple-800/30 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-purple-300 hover:text-purple-200 text-sm font-medium">
              ← Home
            </Link>
            <h1 className="text-2xl font-bold text-white">
              Pose Library
            </h1>
            <div className="w-20"></div> {/* Spacer for alignment */}
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search poses, difficulty, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-purple-700/30 text-white placeholder-purple-300/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
          />
        </div>
      </header>

      {/* Filters - Horizontal scroll on mobile */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-purple-800/30 sticky top-[88px] md:top-[96px] z-10">
        <div className="container mx-auto px-4 py-3">
          {/* Category Filter */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Category
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                      : 'bg-gray-800/50 text-purple-200 hover:bg-gray-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Difficulty
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'bg-gray-800/50 text-purple-200 hover:bg-gray-800'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="container mx-auto px-4 py-4">
        <p className="text-sm text-purple-200">
          Showing {filteredPoses.length} of {seedPoses.length} poses
        </p>
      </div>

      {/* Poses Grid - Responsive: 1 column on mobile, 2 on tablet, 3 on desktop */}
      <div className="container mx-auto px-4 pb-8">
        {filteredPoses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPoses.map((pose) => (
              <PoseCard key={pose.id} pose={pose} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-purple-200 text-lg">
              No poses found matching your filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg transition-all shadow-lg"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Hide scrollbar on filter buttons */}
      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
