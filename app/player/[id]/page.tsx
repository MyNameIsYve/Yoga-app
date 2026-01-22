'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Routine, RoutineItem, SessionState, Pose } from '@/lib/types';
import { seedPoses } from '@/data/poses';
import { getRoutineById, getSessionState, saveSessionState, clearSessionState, getSettings } from '@/lib/storage';
import { formatTime } from '@/lib/utils';
import { VoiceGuide } from '@/lib/voice';

export default function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [warningPlayed, setWarningPlayed] = useState(false);
  const [showBeginOverlay, setShowBeginOverlay] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [voiceTestStatus, setVoiceTestStatus] = useState<string>('');
  const [routineId, setRoutineId] = useState<string | null>(null);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(10);

  const transitionAudioRef = useRef<HTMLAudioElement | null>(null);
  const warningAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const restMusicRef = useRef<HTMLAudioElement | null>(null);
  const voiceGuideRef = useRef<VoiceGuide | null>(null);
  const hasAnnouncedPoseRef = useRef(false);
  const sessionStartedRef = useRef(false);

  // Unwrap params
  useEffect(() => {
    params.then((p) => setRoutineId(p.id));
  }, [params]);

  // Load routine and restore session state if exists
  useEffect(() => {
    if (!routineId) return;

    const loadedRoutine = getRoutineById(routineId);
    if (!loadedRoutine) {
      router.push('/routines');
      return;
    }

    setRoutine(loadedRoutine);

    // Initialize voice guide
    const settings = getSettings();
    voiceGuideRef.current = new VoiceGuide(settings);

    // Check for existing session
    const savedSession = getSessionState();
    if (savedSession && savedSession.routineId === routineId) {
      // Restore session
      setCurrentItemIndex(savedSession.currentItemIndex);
      setRemainingTime(savedSession.remainingTime);
      setIsPaused(savedSession.isPaused);
    } else {
      // Start new session
      setRemainingTime(loadedRoutine.items[0]?.duration || 30);
    }

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (voiceGuideRef.current) {
        voiceGuideRef.current.cancel();
      }
    };
  }, [routineId, router]);

  // Reset image error when pose changes
  useEffect(() => {
    setImageError(false);
  }, [currentItemIndex]);

  // Announce pose when it changes or when unpausing
  useEffect(() => {
    if (!routine || !voiceGuideRef.current || isPaused) return;

    const currentItem = routine.items[currentItemIndex];
    const currentPose = seedPoses.find(p => p.id === currentItem?.poseId);

    if (!currentItem || !currentPose) return;

    // Announce session start on first play
    if (!sessionStartedRef.current && currentItemIndex === 0) {
      sessionStartedRef.current = true;
      voiceGuideRef.current.announceStart(routine.name, routine.items.length);
      // Wait a bit before announcing first pose
      setTimeout(() => {
        if (voiceGuideRef.current) {
          voiceGuideRef.current.announcePose(
            currentPose.name,
            currentPose.cues,
            currentItem.side
          );
        }
      }, 2000);
      hasAnnouncedPoseRef.current = true;
    } else if (!hasAnnouncedPoseRef.current) {
      // Announce pose change
      voiceGuideRef.current.announcePose(
        currentPose.name,
        currentPose.cues,
        currentItem.side
      );
      hasAnnouncedPoseRef.current = true;
    }
  }, [routine, currentItemIndex, isPaused]);

  // Timer logic
  useEffect(() => {
    if (!routine || isPaused || isComplete) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    timerRef.current = setInterval(() => {
      if (isResting) {
        // Rest period timer
        setRestTimeRemaining((prev) => {
          if (prev <= 1) {
            // Rest period complete, move to next pose
            setIsResting(false);
            stopRestMusic();
            const nextIndex = currentItemIndex + 1;

            if (nextIndex >= routine.items.length) {
              // Session complete
              setIsComplete(true);
              clearSessionState();
              if (timerRef.current) {
                clearInterval(timerRef.current);
              }
              if (voiceGuideRef.current) {
                voiceGuideRef.current.announceComplete();
              }
              return 10;
            }

            setCurrentItemIndex(nextIndex);
            setRemainingTime(routine.items[nextIndex].duration);
            setWarningPlayed(false);
            hasAnnouncedPoseRef.current = false;

            if (voiceGuideRef.current) {
              voiceGuideRef.current.resetAnnouncementTracker();
            }

            return 10;
          }
          return prev - 1;
        });
      } else {
        // Pose timer
        setRemainingTime((prev) => {
          if (prev <= 1) {
            // Pose complete, enter rest period
            playTransitionChime();
            setIsResting(true);
            setRestTimeRemaining(10);
            playRestMusic();
            return 0;
          }

          // Voice announcements at key times
          if (voiceGuideRef.current) {
            voiceGuideRef.current.announceTimeRemaining(prev);
          }

          // Check for warning chime
          const settings = getSettings();
          if (
            settings.playWarningChimeAt10Sec &&
            prev === settings.warningChimeSeconds + 1 &&
            !warningPlayed
          ) {
            playWarningChime();
            setWarningPlayed(true);
          }

          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [routine, isPaused, isComplete, warningPlayed, isResting, currentItemIndex]);

  // Save session state
  useEffect(() => {
    if (!routine || isComplete || !routineId) return;

    const currentItem = routine.items[currentItemIndex];
    if (!currentItem) return;

    const sessionState: SessionState = {
      routineId: routineId,
      currentItemIndex,
      currentPoseId: currentItem.poseId,
      currentSide: currentItem.side,
      remainingTime,
      isPaused,
      startedAt: new Date().toISOString(),
      completedItems: currentItemIndex,
      totalItems: routine.items.length,
    };

    saveSessionState(sessionState);
  }, [routine, currentItemIndex, remainingTime, isPaused, routineId, isComplete]);

  const playTransitionChime = useCallback(() => {
    const settings = getSettings();
    if (!settings.playChimeOnTransition) return;

    // Use Web Audio API for reliable playback
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = settings.chimeVolume;

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);

    // Cleanup
    setTimeout(() => {
      audioContext.close();
    }, 500);
  }, []);

  const playWarningChime = useCallback(() => {
    const settings = getSettings();
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 600;
    oscillator.type = 'sine';
    gainNode.gain.value = settings.chimeVolume * 0.5; // Softer than transition

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);

    setTimeout(() => {
      audioContext.close();
    }, 300);
  }, []);

  const playRestMusic = useCallback(() => {
    // Create beautiful meditation music using Web Audio API
    const audioContext = new AudioContext();
    const startTime = audioContext.currentTime;

    // Create a gentle reverb-like effect using delay
    const delay = audioContext.createDelay();
    const delayGain = audioContext.createGain();
    delay.delayTime.value = 0.15;
    delayGain.gain.value = 0.3;
    delay.connect(delayGain);
    delayGain.connect(delay);
    delay.connect(audioContext.destination);

    // Master gain for overall volume control
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.connect(delay);

    // Pentatonic scale notes (C major pentatonic - peaceful and meditation-friendly)
    // C4, D4, E4, G4, A4, C5
    const melody = [
      { freq: 523.25, time: 0.0, duration: 1.2 },   // C5 - start high and gentle
      { freq: 440.00, time: 1.0, duration: 1.0 },   // A4
      { freq: 392.00, time: 1.8, duration: 1.2 },   // G4
      { freq: 329.63, time: 2.8, duration: 1.0 },   // E4
      { freq: 293.66, time: 3.6, duration: 1.5 },   // D4
      { freq: 261.63, time: 5.0, duration: 2.0 },   // C4 - resolve to root
      { freq: 392.00, time: 6.5, duration: 1.2 },   // G4 - gentle rise
      { freq: 523.25, time: 7.5, duration: 2.5 },   // C5 - end on peaceful high note
    ];

    // Background harmony (soft sustained chords)
    const harmonyNotes = [
      { freq: 130.81, time: 0, duration: 5.0 },  // C3 - root
      { freq: 164.81, time: 0, duration: 5.0 },  // E3 - third
      { freq: 196.00, time: 5, duration: 5.0 },  // G3 - fifth
      { freq: 130.81, time: 5, duration: 5.0 },  // C3 - root
    ];

    // Play melody notes
    melody.forEach(note => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(masterGain);

      osc.type = 'sine';
      osc.frequency.value = note.freq;

      // Envelope for each note (gentle attack and release)
      const noteStart = startTime + note.time;
      const noteEnd = noteStart + note.duration;

      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(0.15, noteStart + 0.05); // Quick fade in
      gain.gain.setValueAtTime(0.15, noteEnd - 0.3); // Sustain
      gain.gain.linearRampToValueAtTime(0, noteEnd); // Gentle fade out

      osc.start(noteStart);
      osc.stop(noteEnd);
    });

    // Play harmony notes (softer, more sustained)
    harmonyNotes.forEach(note => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(masterGain);

      osc.type = 'sine';
      osc.frequency.value = note.freq;

      const noteStart = startTime + note.time;
      const noteEnd = noteStart + note.duration;

      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(0.06, noteStart + 0.5); // Slow fade in
      gain.gain.setValueAtTime(0.06, noteEnd - 0.5);
      gain.gain.linearRampToValueAtTime(0, noteEnd);

      osc.start(noteStart);
      osc.stop(noteEnd);
    });

    // Master fade in and out
    masterGain.gain.setValueAtTime(0, startTime);
    masterGain.gain.linearRampToValueAtTime(0.5, startTime + 0.3);
    masterGain.gain.setValueAtTime(0.5, startTime + 9.0);
    masterGain.gain.linearRampToValueAtTime(0, startTime + 10.0);

    // Store context for cleanup
    if (restMusicRef.current) {
      try {
        (restMusicRef.current as any).close();
      } catch (e) {
        // Ignore if already closed
      }
    }
    restMusicRef.current = audioContext as any;
  }, []);

  const stopRestMusic = useCallback(() => {
    if (restMusicRef.current) {
      try {
        const audioContext = restMusicRef.current as any;
        if (audioContext.state !== 'closed') {
          audioContext.close();
        }
      } catch (e) {
        console.error('Error stopping rest music:', e);
      }
      restMusicRef.current = null;
    }
  }, []);

  const handleNextPose = useCallback((autoAdvance = false) => {
    if (!routine) return;

    if (autoAdvance) {
      playTransitionChime();
    }

    const nextIndex = currentItemIndex + 1;

    if (nextIndex >= routine.items.length) {
      // Session complete
      setIsComplete(true);
      clearSessionState();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (voiceGuideRef.current) {
        voiceGuideRef.current.announceComplete();
      }
      return;
    }

    setCurrentItemIndex(nextIndex);
    setRemainingTime(routine.items[nextIndex].duration);
    setWarningPlayed(false);
    hasAnnouncedPoseRef.current = false; // Reset for next pose announcement

    // Reset voice announcement tracker for new pose
    if (voiceGuideRef.current) {
      voiceGuideRef.current.resetAnnouncementTracker();
    }
  }, [routine, currentItemIndex, playTransitionChime]);

  const handleRestart = useCallback(() => {
    if (!routine) return;

    stopRestMusic();
    setCurrentItemIndex(0);
    setRemainingTime(routine.items[0].duration);
    setIsPaused(true);
    setIsComplete(false);
    setWarningPlayed(false);
    setIsResting(false);
    setRestTimeRemaining(10);
    setShowBeginOverlay(true);
    hasAnnouncedPoseRef.current = false;
    sessionStartedRef.current = false;
    if (voiceGuideRef.current) {
      voiceGuideRef.current.cancel();
      voiceGuideRef.current.resetAnnouncementTracker();
    }
  }, [routine, stopRestMusic]);

  const handleExit = useCallback(() => {
    stopRestMusic();
    clearSessionState();
    if (voiceGuideRef.current) {
      voiceGuideRef.current.cancel();
    }
    router.push('/routines');
  }, [router, stopRestMusic]);

  const handleBegin = useCallback(() => {
    console.log('=== BEGIN SESSION CLICKED ===');
    console.log('Voice guide ref exists:', !!voiceGuideRef.current);

    if (voiceGuideRef.current) {
      console.log('Calling speak method...');
      voiceGuideRef.current.speak('Welcome. Let us begin your practice.', 'high');
    } else {
      console.error('Voice guide not initialized!');
    }

    // Close overlay and auto-start the timer
    setTimeout(() => {
      setShowBeginOverlay(false);
      setIsPaused(false); // Auto-start the timer
    }, 2000);
  }, []);

  const handleDirectVoiceTest = useCallback(() => {
    console.log('=== DIRECT VOICE TEST CLICKED ===');
    setVoiceTestStatus('Testing voice...');

    if (!('speechSynthesis' in window)) {
      console.error('❌ Speech synthesis NOT supported in this browser');
      setVoiceTestStatus('❌ Voice not supported in this browser');
      setTimeout(() => setVoiceTestStatus(''), 3000);
      return;
    }

    const synth = window.speechSynthesis;

    // Cancel any existing speech
    synth.cancel();

    // Force reload voices
    let voices = synth.getVoices();
    console.log(`Initial voices loaded: ${voices.length}`);

    const doTest = () => {
      voices = synth.getVoices();
      console.log(`Voices available for test: ${voices.length}`);

      if (voices.length === 0) {
        setVoiceTestStatus('⏳ Loading voices... (try again in a moment)');
        console.warn('No voices loaded yet');
        setTimeout(() => setVoiceTestStatus(''), 3000);
        return;
      }

      if (voices.length > 0) {
        console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`).slice(0, 5).join(', '));
      }

      const text = 'Hello. Can you hear my voice? This is a test.';
      console.log(`Creating utterance: "${text}"`);
      setVoiceTestStatus('🎙️ Speaking now...');

      const utterance = new SpeechSynthesisUtterance(text);

      // Try to find a good English voice
      const englishVoice = voices.find(v =>
        v.lang.startsWith('en') && v.localService
      ) || voices.find(v => v.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
        console.log(`Selected voice: ${englishVoice.name} (${englishVoice.lang})`);
      } else {
        console.log('Using default system voice');
      }

      utterance.rate = 0.85;
      utterance.volume = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      utterance.onstart = () => {
        console.log('✅ VOICE STARTED SPEAKING');
        setVoiceTestStatus('✅ Voice is working!');
      };

      utterance.onend = () => {
        console.log('✅ VOICE FINISHED SPEAKING');
        setTimeout(() => setVoiceTestStatus(''), 2000);
      };

      utterance.onerror = (event) => {
        console.error('❌ VOICE ERROR:', event.error);
        console.error('Error details:', event);
        setVoiceTestStatus(`❌ Voice error: ${event.error}`);
        setTimeout(() => setVoiceTestStatus(''), 4000);
      };

      console.log('Calling synth.speak()...');
      synth.speak(utterance);
      console.log('✓ synth.speak() called');
    };

    // Try immediately and also after delay (for voice loading)
    doTest();
    setTimeout(doTest, 100);

    // Also register handler for when voices change
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = () => {
        console.log('Voices changed event fired');
        voices = synth.getVoices();
        console.log(`Voices now available: ${voices.length}`);
      };
    }
  }, []);

  if (!routine) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const currentItem = routine.items[currentItemIndex];
  const currentPose = seedPoses.find(p => p.id === currentItem?.poseId);

  if (!currentItem || !currentPose) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Pose not found</div>
      </div>
    );
  }

  const progress = ((currentItemIndex + 1) / routine.items.length) * 100;
  const timeProgress = currentItem.duration > 0
    ? ((currentItem.duration - remainingTime) / currentItem.duration) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white flex flex-col">
      {/* Top Bar - Progress */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-purple-800/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-purple-300 hover:text-purple-200 text-sm font-medium">
            🏠 Home
          </Link>
          <button
            onClick={() => setShowExitConfirm(true)}
            className="text-purple-300 hover:text-white text-sm"
          >
            ✕ Exit
          </button>
        </div>
        <div className="text-sm font-medium text-purple-200">
          Pose {currentItemIndex + 1} / {routine.items.length}
        </div>
        <div className="w-24"></div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-900/50">
        <div
          className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        {/* Pose Image */}
        <div className="w-full max-w-md mb-6">
          <div className="aspect-square bg-gradient-to-br from-blue-600 via-teal-600 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden">
            {!imageError && currentPose.imageUrl ? (
              <Image
                src={currentPose.imageUrl}
                alt={currentPose.name}
                fill
                className="object-cover rounded-2xl"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <span className="text-9xl">🧘</span>
            )}
          </div>
        </div>

        {/* Pose Name */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
          {currentPose.name}
        </h1>
        {currentPose.sanskritName && (
          <p className="text-xl text-gray-400 italic mb-4">
            {currentPose.sanskritName}
          </p>
        )}

        {/* Side Indicator */}
        {currentItem.side !== 'both' && (
          <div className="mb-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full">
            <span className="font-semibold uppercase">
              {currentItem.side} Side
            </span>
          </div>
        )}

        {/* Timer */}
        <div className="mb-6">
          <div className="relative w-32 h-32 mb-4">
            {/* Circular Progress */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-purple-900/30"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className={`transition-all duration-1000 ${
                  remainingTime <= 10 ? 'text-orange-400' : 'text-purple-400'
                }`}
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - timeProgress / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-4xl font-bold ${
                remainingTime <= 10 ? 'text-orange-400' : ''
              }`}>
                {formatTime(remainingTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Cues */}
        <div className="max-w-lg mb-8">
          <ul className="space-y-2">
            {currentPose.cues.map((cue, index) => (
              <li key={index} className="flex items-start gap-3 text-purple-100">
                <span className="text-purple-400 mt-1">•</span>
                <span className="text-lg">{cue}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Controls - Removed play/pause and navigation controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleRestart}
            className="p-4 bg-gray-800/50 backdrop-blur-sm border border-purple-700/30 hover:border-purple-600/50 rounded-full transition-all"
            title="Restart session"
          >
            <span className="text-2xl">🔄</span>
          </button>
        </div>

        {/* Voice Status & Test */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="text-xs text-purple-300">
            Voice: {voiceGuideRef.current?.isAvailable() ? '✓ Ready' : '⚠️ Loading...'}
          </div>
          <button
            onClick={() => {
              console.log('Test button clicked');
              if (voiceGuideRef.current) {
                voiceGuideRef.current.test();
              } else {
                console.error('Voice guide not initialized');
              }
            }}
            className="px-4 py-2 bg-purple-600/50 backdrop-blur-sm border border-purple-500/30 hover:bg-purple-600 rounded-lg text-sm transition-all"
            title="Test voice guidance - Check browser console for logs"
          >
            🎙️ Test Voice
          </button>
        </div>

        {/* Session Complete */}
        {isComplete && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800/90 backdrop-blur-sm border border-purple-700/30 rounded-2xl p-8 max-w-md w-full text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold mb-4">Session Complete!</h2>
              <p className="text-purple-200 mb-6">
                Great job completing your yoga session.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleRestart}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all"
                >
                  Do Again
                </button>
                <button
                  onClick={handleExit}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exit Confirmation */}
        {showExitConfirm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800/90 backdrop-blur-sm border border-purple-700/30 rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4">Exit Session?</h3>
              <p className="text-purple-200 mb-6">
                Your progress will be saved and you can resume later.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleExit}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors"
                >
                  Yes, Exit
                </button>
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rest Period Overlay */}
        {isResting && (
          <div className="fixed inset-0 bg-gradient-to-br from-purple-900/95 to-indigo-900/95 flex items-center justify-center p-4 z-40">
            <div className="text-center">
              <div className="text-6xl mb-6">🧘</div>
              <h2 className="text-4xl font-bold mb-4">Rest Period</h2>
              <p className="text-gray-200 mb-6 text-xl">Take a breath and relax</p>
              <div className="text-7xl font-bold text-blue-300 mb-4">
                {restTimeRemaining}
              </div>
              <p className="text-gray-300 text-sm">Next pose coming up...</p>
            </div>
          </div>
        )}

        {/* Begin Session Overlay */}
        {showBeginOverlay && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 border border-purple-700/30 rounded-2xl p-8 max-w-md w-full text-center">
              <div className="text-6xl mb-4">🧘</div>
              <h2 className="text-3xl font-bold mb-4">Ready to Begin?</h2>
              <p className="text-purple-100 mb-2">
                {routine.name}
              </p>
              <p className="text-purple-200 mb-6">
                {routine.items.length} poses • {Math.ceil(routine.totalDuration / 60)} minutes
              </p>
              <div className="bg-purple-800/30 rounded-lg p-4 mb-6 text-sm text-left">
                <p className="flex items-start gap-2 mb-2">
                  <span className="text-purple-300">🎙️</span>
                  <span>Voice guidance will read pose instructions</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-purple-300">🔔</span>
                  <span>Chimes will play at transitions</span>
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={handleBegin}
                  className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-lg font-semibold rounded-lg transition-all shadow-lg"
                >
                  Begin Session
                </button>
                <button
                  onClick={handleDirectVoiceTest}
                  className="w-full px-6 py-3 bg-purple-700/50 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  🎙️ Test Voice
                </button>
                {voiceTestStatus && (
                  <div className="text-center p-3 bg-gray-800 rounded-lg text-sm">
                    {voiceTestStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
