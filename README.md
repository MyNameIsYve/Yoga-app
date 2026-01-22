# Yoga Session App

A web application for yoga trainers and practitioners to run guided yoga sessions with pose images, instructional cues, per-pose countdown timers, and automatic progression.

## Features

- **Quick Start**: Jump right into a pre-curated 10-minute beginner flow without setup
- **Pose Library**: Browse 30 curated yoga poses with detailed instructions, cues, and benefits
- **Custom Routines**: Create and manage personalized yoga routines
- **Session Player**: Full-screen player with:
  - Large pose images and names
  - 1-3 instructional cues per pose
  - Visual countdown timer with circular progress
  - Automatic progression to next pose
  - **Human-sounding voice guidance** that reads pose names, instructions, and time reminders
  - Audio chimes at transitions
  - Optional 10-second warning chime
  - Side-specific pose support (left/right)
  - Session state restoration after page refresh
- **Mobile-First Design**: Fully responsive for phones, tablets, and desktops
- **Offline Storage**: All data persists in browser localStorage (no backend required)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks + localStorage
- **Audio**: Web Audio API

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Clone or navigate to the project directory**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## How to Use

### 1. Quick Start (Fastest Way)

- Click **Quick Start** from the home page
- Immediately begins a pre-curated 10-minute beginner flow
- 16 poses including:
  - Warm-up poses (Mountain, Cat-Cow, Downward Dog)
  - Standing poses (Warriors, Triangle)
  - Floor work (Child's Pose, Cobra, Bridge)
  - Cool-down (Twists, Savasana)
- Perfect for first-time users to experience all features

### 2. Browse Poses

- Navigate to **Browse Poses** from the home page
- Search and filter by category (standing, seated, balance, etc.)
- Filter by difficulty level (beginner, intermediate, advanced)
- View pose details including:
  - English and Sanskrit names
  - Category and difficulty
  - Default duration
  - Instructional cues
  - Benefits

### 3. Create a Routine

- Click **My Routines** from the home page
- Click **Create New Routine**
- Enter a name and optional description
- Add poses by clicking **+ Add Pose**
- For each pose:
  - Set custom duration (in seconds)
  - Choose side: Both, Left, or Right
  - Reorder using ↑ ↓ buttons
  - Remove with ✕ button
- Click **Save Routine**

### 4. Start a Session

- From the Routines page, click **▶️ Start** on any routine
- The player will open in full-screen mode

**Player Controls:**
- **▶️/⏸️ Play/Pause**: Start or pause the timer
- **⏮️ Previous**: Go to previous pose
- **⏭️ Next**: Skip to next pose
- **🔄 Restart**: Restart the entire session
- **✕ Exit**: Exit the session (progress is saved)

**Timer Behavior:**
- Countdown starts when you press Play
- Auto-advances to next pose when timer hits 0:00
- Audio chime plays at transitions
- Optional warning chime at 10 seconds (configurable)
- Orange color indicates final 10 seconds

**Voice Guidance:**
- Human-sounding voice announces:
  - Session start: "Starting [routine name]. [X] poses. Let's begin."
  - Pose name and side (if applicable)
  - First 2 instructional cues for each pose
  - Time reminders at 30s, 10s, 5s, and countdown 3-2-1
  - Completion message: "Practice complete. Well done."
- Uses Web Speech API with intelligent voice selection
- Automatically selects the most natural-sounding voice available
- Can be disabled in settings (stored in localStorage)

**Session Restoration:**
- If you refresh the page or close the browser, your session state is saved
- Return to the same routine to resume from where you left off
- Session is cleared when you complete or exit

### 5. Edit or Delete Routines

- From the Routines page, click **Edit** to modify a routine
- Click **Delete** to remove a routine (with confirmation)

## Project Structure

```
/app                    # Next.js app directory
  /page.tsx            # Landing page
  /poses/page.tsx      # Pose library
  /routines/           # Routine management
    /page.tsx          # Routines list
    /create/page.tsx   # Create routine
    /edit/[id]/page.tsx # Edit routine
  /player/[id]/page.tsx # Session player
  /quick-start/page.tsx # Quick start demo launcher
  /layout.tsx          # Root layout
  /globals.css         # Global styles

/components            # Reusable React components
  /PoseCard.tsx        # Pose display card

/lib                   # Utilities and helpers
  /types.ts           # TypeScript interfaces
  /storage.ts         # localStorage utilities
  /utils.ts           # Helper functions
  /voice.ts           # Voice guidance (TTS)

/data                  # Seed data
  /poses.ts           # 30 preset poses
  /demo-routine.ts    # Pre-curated quick start routine

/public               # Static assets
  /images/            # Pose images (placeholders)
  /sounds/            # Audio files (chimes)
```

## Data Model

All data is stored in browser localStorage:

- **Poses**: 30 read-only seed poses
- **Routines**: User-created routines with pose sequences
- **Session State**: Current session progress (cleared on completion)
- **Settings**: User preferences (chimes, volume, etc.)

## Customization

### Adding Your Own Poses

Edit `/data/poses.ts` to add or modify poses. Each pose should follow this structure:

```typescript
{
  id: 'unique-id',
  name: 'Pose Name',
  sanskritName: 'Sanskrit Name',
  category: 'standing', // or seated, balance, etc.
  imageUrl: '/images/pose.png',
  cues: [
    'First instruction',
    'Second instruction',
    'Third instruction'
  ],
  defaultDuration: 30,
  difficulty: 'beginner',
  benefits: ['Benefit 1', 'Benefit 2']
}
```

### Changing Audio Chimes

The app uses the Web Audio API to generate simple sine wave tones. To customize:

1. Edit the `playTransitionChime()` and `playWarningChime()` functions in `/app/player/[id]/page.tsx`
2. Adjust `frequency`, `duration`, and `gain` values
3. Or replace with actual audio files by uncommenting the audio refs and adding MP3/OGG files to `/public/sounds/`

### Adjusting Settings

Default settings are in `/lib/storage.ts`:

```typescript
const DEFAULT_SETTINGS = {
  playChimeOnTransition: true,
  playWarningChimeAt10Sec: false,
  warningChimeSeconds: 10,
  chimeVolume: 0.7,
};
```

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 14+)
- Mobile browsers: ✅ Optimized for touch

## Adding Pose Images

The app is configured to display pose images from `/public/images/`. Currently, placeholder emojis (🧘) are shown because the image files don't exist yet.

To add your pose images:

1. Place image files in `/public/images/` directory
2. Use these exact filenames (or update `/data/poses.ts` to match your filenames):
   - `mountain-pose.jpg`
   - `tree-pose.jpg`
   - `standing-forward-fold.jpg`
   - `crescent-moon.jpg`
   - `garland-pose.jpg`
   - And so on for all 57 poses...
3. Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`
4. Recommended size: 800x800px or larger (square aspect ratio works best)
5. The app will automatically load images when available, falling back to emoji if not found

## Troubleshooting Voice Guidance

If voice guidance isn't working:

1. **Test Voice Button**: Click the "🎙️ Test Voice" button on the Begin Session screen
2. **Check Console**: Open browser console (F12) and look for voice-related messages
3. **Browser Support**: Ensure you're using a modern browser (Chrome, Safari, Edge, Firefox)
4. **Volume**: Check system volume and browser volume settings
5. **Permissions**: Some browsers require microphone permission for speech synthesis
6. **Settings**: Voice guidance can be disabled in settings - check localStorage settings

## Limitations & Future Enhancements

### Current Limitations (MVP)

- No user authentication
- No database (localStorage only)
- No user-uploaded images (manual file placement required)
- No video/animated poses
- Single-language support (English only)

### Planned Features

- [ ] User authentication & cloud sync
- [ ] User-uploaded pose images via UI
- [ ] Enhanced voice guidance with breathing cues
- [ ] Session history and analytics
- [ ] Social features (share routines)
- [ ] Music integration
- [ ] Progressive Web App (offline mode)
- [ ] Multi-language support

## Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload the .next folder to Netlify
```

### Deploy to Other Platforms

The app is a standard Next.js app and can be deployed to any platform that supports Node.js.

## Troubleshooting

### Audio not playing
- Ensure browser allows autoplay (some browsers block audio until user interaction)
- Check browser console for audio errors
- Try adjusting volume in settings

### Session not restoring
- Check if localStorage is enabled in your browser
- Clear browser cache and try again
- Ensure you're using the same browser and device

### Poses not appearing
- Check browser console for errors
- Ensure `/data/poses.ts` is correctly formatted
- Try refreshing the page

## Contributing

This is an MVP. Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile and desktop
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Credits

- Built with Next.js, TypeScript, and Tailwind CSS
- Pose information sourced from public yoga resources
- No copyrighted images or content used

## Support

For issues or questions, please open an issue on GitHub or contact the maintainers.

---

**Enjoy your practice! 🧘**
