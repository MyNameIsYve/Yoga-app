'use client';

import { Pose } from '@/lib/types';
import { formatDuration } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

interface PoseCardProps {
  pose: Pose;
  onClick?: () => void;
  selectable?: boolean;
  selected?: boolean;
}

export default function PoseCard({ pose, onClick, selectable, selected }: PoseCardProps) {
  const [imageError, setImageError] = useState(false);

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const categoryColors = {
    standing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    seated: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    supine: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    prone: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    balance: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    inversion: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    twist: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    backbend: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
    'forward-fold': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  };

  return (
    <div
      className={`bg-gray-800/50 backdrop-blur-sm border border-purple-700/30 rounded-lg overflow-hidden transition-all duration-300 hover:border-purple-500/50 ${
        selectable ? 'cursor-pointer hover:bg-gray-800/70' : ''
      } ${selected ? 'ring-2 ring-purple-500' : ''}`}
      onClick={onClick}
    >
      {/* Pose Image with Fallback */}
      <div className="h-48 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center relative overflow-hidden">
        {!imageError && pose.imageUrl ? (
          <Image
            src={pose.imageUrl}
            alt={pose.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <span className="text-6xl">🧘</span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-white">
              {pose.name}
            </h3>
            {pose.sanskritName && (
              <p className="text-sm text-purple-300 italic">
                {pose.sanskritName}
              </p>
            )}
          </div>
          {selected && (
            <div className="text-purple-400 text-xl">✓</div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[pose.category]}`}>
            {pose.category}
          </span>
          {pose.difficulty && (
            <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[pose.difficulty]}`}>
              {pose.difficulty}
            </span>
          )}
          <span className="text-xs px-2 py-1 rounded-full bg-purple-900/50 text-purple-200">
            {formatDuration(pose.defaultDuration)}
          </span>
        </div>

        {/* Cues */}
        <ul className="space-y-1 mb-3">
          {pose.cues.slice(0, 2).map((cue, index) => (
            <li key={index} className="text-sm text-purple-200 flex items-start gap-2">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>{cue}</span>
            </li>
          ))}
          {pose.cues.length > 2 && (
            <li className="text-sm text-purple-300 italic">
              +{pose.cues.length - 2} more cue{pose.cues.length - 2 > 1 ? 's' : ''}
            </li>
          )}
        </ul>

        {/* Benefits (collapsed by default) */}
        {pose.benefits && pose.benefits.length > 0 && (
          <details className="text-sm">
            <summary className="cursor-pointer text-purple-300 hover:text-purple-200">
              Benefits
            </summary>
            <ul className="mt-2 space-y-1 pl-4">
              {pose.benefits.map((benefit, index) => (
                <li key={index} className="text-purple-200 list-disc">
                  {benefit}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}
