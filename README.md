# FlashChord - Guitar Chord Drilling Web App

A React web application that helps guitarists practice chord recognition with a built-in metronome. The app displays random chords at specified intervals while providing audible and visual feedback.

## Features

### Core Functionality
- **Random Chord Generation**: Displays random chords from a customizable pool
- **Built-in Metronome**: Audible clicks with visual pulse animation
- **Chord Quality Selection**: Multi-select toggles for Major, Minor, 7th, 5th (power chord), and Diminished
- **Sharps/Flats Toggle**: Switch between sharp (♯) and flat (♭) notation
- **Time Signatures**: Support for 4/4, 3/4, and 6/8 time signatures
- **Count-in Feature**: Optional 4-beat count-in before starting

### Metronome Features
- **BPM Control**: Adjustable tempo from 40-240 BPM with smooth slider
- **Next Chord Every**: Configure how often chords change (1, 2, 3, 4, 6, or 8 beats)
- **Visual Feedback**: Animated pulse on each beat with stronger accent on downbeats
- **Web Audio API**: High-quality audio using modern browser APIs
- **Drift Correction**: Precise timing with automatic drift correction

### Practice Controls
- **Start/Stop**: Control metronome playback
- **Next**: Manually advance to next chord
- **Reset**: Reset all timers and chord state
- **Pause**: Temporarily stop metronome

### UI/UX
- **Dark Theme**: Clean, modern dark interface
- **Large Chord Display**: Easy-to-read chord names
- **Responsive Design**: Works on various screen sizes
- **State Persistence**: Settings saved between app sessions using localStorage

## How to Run

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open in browser:**
   - The app will automatically open at `http://localhost:3000`
   - Or manually navigate to the URL shown in the terminal

### Development Commands
```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## Project Structure

```
FlashChord-Web/
├── public/                 # Static files
│   ├── index.html         # HTML template
│   └── manifest.json      # Web app manifest
├── src/
│   ├── components/        # React components
│   │   ├── BpmSlider.tsx
│   │   ├── ChordDisplay.tsx
│   │   ├── ChordQualitySelector.tsx
│   │   ├── MetronomeControls.tsx
│   │   └── *.css          # Component styles
│   ├── hooks/            # Custom React hooks
│   │   ├── useChordDrill.ts
│   │   └── useMetronome.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   ├── chordUtils.ts
│   │   ├── soundUtils.ts
│   │   └── storage.ts
│   ├── App.tsx           # Main app component
│   ├── App.css           # App styles
│   └── index.tsx         # App entry point
├── package.json          # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Technical Implementation

### State Management
- **Local State**: All state managed with React hooks
- **Persistence**: Settings saved using localStorage for fast local storage
- **Real-time Updates**: Metronome timing handled with precise interval management

### Audio System
- **Web Audio API**: Handles metronome click sounds with high-quality audio
- **Cross-browser Support**: Works on all modern browsers
- **Drift Correction**: Maintains accurate timing over long periods

### Chord Generation
- **Random Selection**: Uniform distribution across enabled qualities and roots
- **No Repeats**: Avoids showing the same chord twice in a row
- **Quality Filtering**: Only generates chords from selected qualities

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile Browsers**: Responsive design works on mobile devices

## Known Limitations

### Audio
- **Browser Autoplay**: Some browsers require user interaction before playing audio
- **Audio Latency**: May have slight delay on some devices
- **Background Audio**: App may pause when browser tab is not active

### Features
- **Chord Diagrams**: No visual chord diagrams or fingerings
- **Progress Tracking**: No statistics or progress saving
- **Custom Chord Sets**: Cannot create custom chord collections
- **Export/Import**: No settings backup or sharing

### Performance
- **Battery Usage**: Continuous metronome may drain battery faster on mobile
- **Memory**: Long sessions may use more memory due to audio caching
- **Jitter**: Timing may have slight variations on lower-end devices

## Future Enhancements

- [ ] Add visual chord diagrams
- [ ] Implement progress tracking and statistics
- [ ] Add custom chord set creation
- [ ] Support for more time signatures (5/4, 7/8, etc.)
- [ ] Export/import settings functionality
- [ ] Better audio samples and customization
- [ ] Practice modes (chord progressions, specific keys)
- [ ] Accessibility improvements
- [ ] PWA (Progressive Web App) features
- [ ] Offline support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is open source and available under the MIT License.
