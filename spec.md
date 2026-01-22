# Yoga Session App - Product Specification

## Overview

A web application for yoga trainers and practitioners to run guided yoga sessions with pose images, short cues, per-pose countdown timers, and auto-advance functionality.

---

## Requirements

### Core Features (MVP)

#### 1. Pose Library (`/poses`)
- Display a collection of 20-40 seed poses
- Each pose includes:
  - Name (English + Sanskrit)
  - Category (standing, seated, balance, etc.)
  - Image (placeholder or local asset)
  - 1-3 instructional cues
  - Default duration in seconds
  - Difficulty level
  - Benefits
- Search and filter functionality (optional for MVP)
- No pose editing in MVP (read-only)

#### 2. Routine Management (`/routines`)
- **List View**: Show all saved routines
- **Create Routine**:
  - Name and description
  - Add poses from library
  - Set duration per pose
  - Specify side (both/left/right) for asymmetric poses
  - Optional notes per pose
- **Edit Routine**: Modify existing routines
- **Delete Routine**: Remove routines
- Display total routine duration

#### 3. Session Player (`/player/[routineId]`)
- **Display Elements**:
  - Current pose image (large, prominent)
  - Pose name (English + Sanskrit)
  - 1-3 instructional cues
  - Countdown timer (visual + numeric)
  - Current/total pose indicator (e.g., "5 / 12")
  - Side label if applicable ("Left Side" / "Right Side")

- **Timer Behavior**:
  - Per-pose countdown from specified duration
  - Auto-advance to next pose when timer hits 0
  - Audio chime at pose transitions
  - Optional 10-second warning chime (configurable)

- **Controls**:
  - Play/Pause button
  - Next pose button
  - Previous pose button
  - Restart session button
  - Exit/End session button

- **Session State**:
  - Persist to localStorage during session
  - Restore session if page refreshes
  - Clear state on session end

#### 4. Landing Page (`/`)
- Welcome message
- CTA buttons to:
  - Browse Poses
  - Create/View Routines
  - Quick start (if routines exist)
- Brief app description

---

## Tech Stack

### Core Technologies
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks + localStorage
- **Audio**: HTML5 Audio API for chimes

### Data Persistence
- **MVP**: localStorage only (no database)
- **Data Structure**:
  - Poses: Read-only seed data
  - Routines: User-created, stored in localStorage
  - Session state: Temporary, cleared on completion
  - App settings: User preferences

### Project Structure
```
/app                    # Next.js app directory
  /page.tsx            # Landing page
  /poses               # Pose library
  /routines            # Routine management
  /player/[id]         # Session player
  /layout.tsx          # Root layout
  /globals.css         # Global styles

/components            # Reusable React components
  /PoseCard.tsx
  /RoutineEditor.tsx
  /PlayerControls.tsx
  /CountdownTimer.tsx
  /PoseSearch.tsx

/lib                   # Utilities and helpers
  /types.ts           # TypeScript interfaces
  /storage.ts         # localStorage utilities
  /utils.ts           # Helper functions

/data                  # Seed data
  /poses.ts           # 30 preset poses

/public               # Static assets
  /images            # Pose placeholder images
  /sounds            # Chime audio files
```

---

## Data Models

### TypeScript Interfaces

```typescript
interface Pose {
  id: string;
  name: string;
  sanskritName?: string;
  category: 'standing' | 'seated' | 'supine' | 'prone' | 'balance' | 'inversion' | 'twist' | 'backbend' | 'forward-fold' | 'other';
  imageUrl: string;
  cues: string[];
  defaultDuration: number;
  benefits?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface RoutineItem {
  id: string;
  poseId: string;
  duration: number;
  side: 'both' | 'left' | 'right';
  notes?: string;
}

interface Routine {
  id: string;
  name: string;
  description?: string;
  items: RoutineItem[];
  totalDuration: number;
  createdAt: string;
  updatedAt: string;
}

interface SessionState {
  routineId: string;
  currentItemIndex: number;
  currentPoseId: string;
  currentSide: 'both' | 'left' | 'right';
  remainingTime: number;
  isPaused: boolean;
  startedAt: string;
  completedItems: number;
  totalItems: number;
}

interface AppSettings {
  playChimeOnTransition: boolean;
  playWarningChimeAt10Sec: boolean;
  warningChimeSeconds: number;
  chimeVolume: number;
}
```

---

## Design Guidelines

### Visual Design

#### Color Palette
- Primary: Calming blues/teals (#2563eb, #0891b2)
- Secondary: Earthy greens (#059669, #10b981)
- Neutral: Grays for text and backgrounds
- Accent: Warm orange for active/warning states (#f97316)

#### Typography
- Headings: Large, clear, sans-serif
- Body text: Readable, minimum 16px
- Pose names: Bold, prominent
- Cues: Clear list format, adequate spacing

#### Layout Principles
- **Mobile-first**: Responsive design, works on phones/tablets
- **Clean and minimal**: Avoid clutter, focus on current pose
- **High contrast**: Ensure text is readable in various lighting
- **Touch-friendly**: Large tap targets (min 44x44px)

### Player UI/UX

#### Full-Screen Mode
- Player takes full viewport (or near-full)
- Minimal chrome/navigation during session
- Large, centered pose image
- Timer prominently displayed

#### Timer Display
- Circular progress ring (or simple countdown)
- Large, readable numbers
- Color changes at warning threshold
- Visual indication when paused

#### Responsive Behavior
- Portrait mobile: Stack elements vertically
- Landscape/tablet: Optimal layout for viewing
- Desktop: Centered content, max-width container

### Accessibility
- Keyboard navigation support
- ARIA labels for controls
- Color contrast compliance (WCAG AA)
- Alt text for pose images
- Screen reader friendly

---

## Audio Design

### Chime Sounds
- **Transition chime**: Pleasant, non-jarring tone (1-2 sec)
- **Warning chime**: Subtle, softer than transition (0.5-1 sec)
- **Volume control**: User-adjustable in settings
- **Fallback**: Graceful degradation if audio blocked

### Audio Files
- Format: MP3 or OGG for browser compatibility
- Location: `/public/sounds/`
- Preload on player mount for smooth playback

---

## Constraints & Scope

### What's In Scope (MVP)
✅ Browse seed pose library
✅ Create/edit/delete routines
✅ Session player with timer and auto-advance
✅ Audio chimes
✅ localStorage persistence
✅ Mobile-responsive UI
✅ Session state restoration

### What's Out of Scope (Future)
❌ User authentication
❌ Database/backend
❌ User-uploaded pose images
❌ Pose library editing
❌ Social features (sharing, comments)
❌ Advanced analytics/tracking
❌ Multi-language support
❌ Video/animated poses
❌ Voice guidance

### Content Constraints
- **No scraping**: Don't rehost copyrighted content
- **Placeholder images**: Use generic/custom images only
- **Original cues**: Write simple, original instructions

---

## Implementation Milestones

### Phase 1: Foundation ✅
- [x] Project scaffold (Next.js + TypeScript + Tailwind)
- [x] Define TypeScript types
- [x] Create seed pose data (30 poses)
- [ ] localStorage utilities
- [ ] Basic navigation/routing

### Phase 2: Pose Library & Routines
- [ ] Build `/poses` page with pose cards
- [ ] Implement search/filter (optional)
- [ ] Build `/routines` list page
- [ ] Routine editor component
- [ ] CRUD operations with localStorage
- [ ] Compute total duration

### Phase 3: Session Player
- [ ] Build `/player/[id]` page
- [ ] Display pose info and image
- [ ] Countdown timer with auto-advance
- [ ] Player controls (pause/play/next/prev/restart)
- [ ] Audio chime integration
- [ ] Session state persistence

### Phase 4: Polish & Testing
- [ ] Landing page with CTAs
- [ ] Mobile responsiveness review
- [ ] Settings panel for chime preferences
- [ ] Error states and loading states
- [ ] Session restoration after refresh
- [ ] Cross-browser testing

### Phase 5: Documentation
- [ ] README with setup instructions
- [ ] Usage guide
- [ ] Deployment notes (Vercel/Netlify)
- [ ] Known limitations and future enhancements

---

## Success Criteria

### Functional Requirements
- User can browse 30 poses with details
- User can create a routine with 5+ poses
- User can start a session and see timer countdown
- Timer auto-advances to next pose at 0:00
- Chime plays on transitions
- Session persists through page refresh
- UI works on mobile and desktop

### Non-Functional Requirements
- Load time < 3 seconds on 3G
- No errors in browser console
- Accessible keyboard navigation
- Works in Chrome, Firefox, Safari
- Clean, maintainable code structure

---

## Future Enhancements (Post-MVP)

1. **User Authentication**
   - Sign up / Login
   - Cloud-synced routines across devices

2. **Advanced Pose Library**
   - User-uploaded poses
   - Community-contributed content
   - Pose variations

3. **Session Features**
   - Spotify/music integration
   - Voice guidance
   - Breathing prompts
   - Rest intervals between poses

4. **Analytics & Tracking**
   - Session history
   - Streak tracking
   - Favorites and frequently used poses

5. **Social Features**
   - Share routines
   - Follow instructors
   - Community routines library

6. **Monetization**
   - Premium pose packs
   - Instructor subscriptions
   - Custom branding for studios

---

## Technical Debt & Considerations

### Performance
- Optimize images (use Next.js Image component)
- Code splitting for faster initial load
- Service worker for offline support (future)

### Security
- Sanitize user inputs (routine names, notes)
- Validate localStorage data structure
- Rate limiting for future API calls

### Scalability
- Plan migration path to database (future)
- Design API endpoints for backend (future)
- Consider state management library if complexity grows

---

## Open Questions & Decisions

### Resolved
- ✅ Use Next.js App Router (modern approach)
- ✅ localStorage only for MVP (no backend)
- ✅ 30 seed poses sufficient for demo
- ✅ Placeholder images acceptable for launch

### Pending
- ⏳ Exact chime sound selection (to be tested)
- ⏳ Warning chime default time (10 sec or configurable?)
- ⏳ Max routine length limit (if any)
- ⏳ Session timeout handling (abandon after X minutes?)

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
