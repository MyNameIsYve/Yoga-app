import { AppSettings } from './types';

// Voice guidance utility using Web Speech API
export class VoiceGuide {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private settings: AppSettings;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor(settings: AppSettings) {
    this.settings = settings;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;

      // Load voices with multiple attempts
      this.loadVoices();

      // Load voices when they change (critical for Chrome/Edge)
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          console.log('Voices changed event fired');
          this.loadVoices();
        };
      }

      // Retry loading voices multiple times (some browsers are slow)
      setTimeout(() => this.loadVoices(), 100);
      setTimeout(() => this.loadVoices(), 500);
      setTimeout(() => this.loadVoices(), 1000);
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();

    if (this.voices.length > 0) {
      console.log('Available voices:', this.voices.map(v => v.name));
    }
  }

  private getBestVoice(): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.loadVoices();
    }

    // Priority list - UK English Male voices preferred (deep, steady, soothing)
    const preferredVoiceNames = [
      // UK Male voices - preferred for yoga (deep, steady, soothing)
      'Daniel',                              // UK English - gentle, deep male voice
      'Google UK English Male',              // Deep, steady, soothing
      'Microsoft Ryan Online (Natural)',     // UK Male - Natural and calming
      'Microsoft George Online (Natural)',   // UK Male - Steady and warm
      'Arthur',                              // UK Male
      'Oliver',                              // UK Male
      // Other high-quality male voices
      'Microsoft Guy Online (Natural)',      // US Male but natural
      'Alex',                                // US Male - generally available
      // Fallback to other English male voices
      'Microsoft Mark',
      'Microsoft David Desktop',
      // Female voices as final fallback
      'Serena',                              // UK English Female
      'Google UK English Female',
      'Samantha',
    ];

    // First, try to find a preferred voice (prioritize "Natural" and "Premium")
    for (const name of preferredVoiceNames) {
      const voice = this.voices.find(v =>
        v.name.includes(name) && (
          v.name.includes('Natural') ||
          v.name.includes('Premium') ||
          v.name.includes('Enhanced') ||
          !v.name.includes('Compact')
        )
      );
      if (voice) {
        console.log(`Selected premium voice: ${voice.name}`);
        return voice;
      }
    }

    // Try again without quality filter
    for (const name of preferredVoiceNames) {
      const voice = this.voices.find(v => v.name.includes(name));
      if (voice) {
        console.log(`Selected voice: ${voice.name}`);
        return voice;
      }
    }

    // Fall back to any UK male voice
    const ukMaleVoice = this.voices.find(
      v => v.lang.startsWith('en-GB') && v.name.toLowerCase().includes('male')
    );
    if (ukMaleVoice) {
      console.log(`Selected UK male voice: ${ukMaleVoice.name}`);
      return ukMaleVoice;
    }

    // Fall back to any English male voice
    const englishMaleVoice = this.voices.find(
      v => v.lang.startsWith('en') && (
        v.name.toLowerCase().includes('male') ||
        v.name.toLowerCase().includes('daniel') ||
        v.name.toLowerCase().includes('alex')
      )
    );
    if (englishMaleVoice) {
      console.log(`Selected English male voice: ${englishMaleVoice.name}`);
      return englishMaleVoice;
    }

    // Fall back to any English voice that's marked as local (usually better quality)
    const localEnglishVoice = this.voices.find(
      v => v.lang.startsWith('en') && v.localService && !v.name.includes('Compact')
    );
    if (localEnglishVoice) {
      console.log(`Selected local voice: ${localEnglishVoice.name}`);
      return localEnglishVoice;
    }

    // Fall back to any English voice
    const englishVoice = this.voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) {
      console.log(`Selected fallback voice: ${englishVoice.name}`);
      return englishVoice;
    }

    // Last resort: first available voice
    console.log('Using first available voice');
    return this.voices[0] || null;
  }

  speak(text: string, priority: 'high' | 'normal' = 'normal') {
    if (!this.synth) {
      console.warn('Speech synthesis not available');
      return;
    }

    if (!this.settings.voiceGuidanceEnabled) {
      console.log('Voice guidance disabled in settings');
      return;
    }

    // Reload voices if needed
    if (this.voices.length === 0) {
      this.loadVoices();
    }

    // Cancel current speech if high priority
    if (priority === 'high' && this.currentUtterance) {
      this.cancel();
    }

    console.log(`Speaking: "${text}" (priority: ${priority})`);

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.getBestVoice();

    if (voice) {
      utterance.voice = voice;
      console.log(`Using voice: ${voice.name}`);
    } else {
      console.warn('No voice available, using default');
    }

    // Apply settings for more natural, human-like speech
    utterance.rate = this.settings.voiceRate; // 0.9 is slightly slower, more clear
    utterance.pitch = this.settings.voicePitch; // 1.0 is natural
    utterance.volume = this.settings.voiceVolume;
    utterance.lang = 'en-GB'; // UK English for more soothing, steady voice

    // These properties help make speech more natural
    // @ts-ignore - some browsers support these
    if ('emphasis' in utterance) {
      utterance.emphasis = 'moderate';
    }

    // Add event handlers
    utterance.onstart = () => {
      this.currentUtterance = utterance;
      console.log('Speech started');
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      console.log('Speech ended');
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error, event);
      this.currentUtterance = null;
    };

    try {
      this.synth.speak(utterance);
    } catch (error) {
      console.error('Error calling speak():', error);
    }
  }

  cancel() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  // Speak pose instructions warmly
  announcePose(poseName: string, cues: string[], side?: 'left' | 'right' | 'both') {
    if (!this.settings.readPoseInstructions) return;

    // Build a warm, conversational announcement
    let announcement = '';

    // Add side with warmer phrasing
    if (side && side !== 'both') {
      announcement = `${side.charAt(0).toUpperCase() + side.slice(1)} side. `;
    }

    announcement += poseName;

    // Add longer pause before instructions (multiple periods create natural pause)
    announcement += '. . . ';

    // Add ALL cues with longer pauses between each
    if (cues.length > 0) {
      // Join all cues with triple periods for even longer, more calming pauses
      announcement += cues.join('. . . ');
    }

    console.log('Announcing pose:', announcement);
    this.speak(announcement, 'high');
  }

  // Track last announced time to prevent duplicates
  private lastAnnouncedTime: number = -1;

  // Announce time remaining
  announceTimeRemaining(seconds: number) {
    if (!this.settings.announceTimeRemaining) return;

    // Prevent announcing the same time twice
    if (seconds === this.lastAnnouncedTime) return;

    let message = '';

    if (seconds === 30) {
      message = 'Thirty seconds remaining';
    } else if (seconds === 10) {
      message = 'Ten seconds';
    } else if (seconds === 5) {
      message = 'Five seconds';
    } else if (seconds === 3) {
      message = 'Three';
    } else if (seconds === 2) {
      message = 'Two';
    } else if (seconds === 1) {
      message = 'One';
    }

    if (message) {
      this.lastAnnouncedTime = seconds;
      this.speak(message, 'normal');
    }
  }

  // Reset the announcement tracker (call when starting new pose)
  resetAnnouncementTracker() {
    this.lastAnnouncedTime = -1;
  }

  // Simple countdown for final seconds (DEPRECATED - use announceTimeRemaining instead)
  announceCountdown(seconds: number) {
    // This method is no longer used to prevent duplicate announcements
    // announceTimeRemaining handles all countdown announcements
  }

  // Welcome message
  announceStart(routineName: string, totalPoses: number) {
    if (!this.settings.voiceGuidanceEnabled) return;

    const message = `Starting ${routineName}. ${totalPoses} poses. Let's begin.`;
    this.speak(message, 'high');
  }

  // Completion message
  announceComplete() {
    if (!this.settings.voiceGuidanceEnabled) return;

    const messages = [
      'Practice complete. Well done.',
      'Session finished. Great work.',
      'Practice complete. Namaste.',
    ];

    const message = messages[Math.floor(Math.random() * messages.length)];
    this.speak(message, 'high');
  }

  updateSettings(settings: AppSettings) {
    this.settings = settings;
  }

  // Test voice - useful for debugging
  test() {
    console.log('Testing voice...');
    console.log(`Voices available: ${this.voices.length}`);
    console.log(`Voice guidance enabled: ${this.settings.voiceGuidanceEnabled}`);

    if (this.voices.length === 0) {
      this.loadVoices();
      console.log(`After reload: ${this.voices.length} voices`);
    }

    const testMessage = 'Hello. Voice guidance is working.';
    this.speak(testMessage, 'high');
  }

  // Check if voice is available
  isAvailable(): boolean {
    return this.synth !== null && this.voices.length > 0;
  }
}
