# FlashChord - Guitar Chord Drilling App

A React Native (Expo) app that helps guitarists practice chord recognition with a built-in metronome. The app displays random chords at specified intervals while providing audible and visual feedback.

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
- **Haptic Feedback**: Vibration feedback on Android devices
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
- **State Persistence**: Settings saved between app sessions

## How to Run on Android

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Android device or emulator with Expo Go app installed

### Installation & Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npx expo start
   ```

3. **Run on Android:**
   - Scan the QR code with Expo Go app on your Android device, OR
   - Press 'a' in the terminal to open on Android emulator

### Development Commands
```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run tests
npm test

# Lint code
npm run lint
```

## Project Structure

```
FlashChord/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Main app screen
├── src/
│   ├── components/        # React components
│   │   ├── BpmSlider.tsx
│   │   ├── ChordDisplay.tsx
│   │   ├── ChordQualitySelector.tsx
│   │   └── MetronomeControls.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useChordDrill.ts
│   │   └── useMetronome.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   └── utils/            # Utility functions
│       ├── chordUtils.ts
│       ├── soundUtils.ts
│       └── storage.ts
├── __tests__/            # Unit tests
├── package.json          # Dependencies and scripts
├── app.json             # Expo configuration
├── tsconfig.json        # TypeScript configuration
└── babel.config.js      # Babel configuration
```

## Technical Implementation

### State Management
- **Local State**: All state managed with React hooks
- **Persistence**: Settings saved using expo-mmkv for fast local storage
- **Real-time Updates**: Metronome timing handled with precise interval management

### Audio System
- **expo-av**: Handles metronome click sounds
- **Haptics**: Provides tactile feedback on Android
- **Drift Correction**: Maintains accurate timing over long periods

### Chord Generation
- **Random Selection**: Uniform distribution across enabled qualities and roots
- **No Repeats**: Avoids showing the same chord twice in a row
- **Quality Filtering**: Only generates chords from selected qualities

## Known Limitations

### Audio
- **Sound Quality**: Uses simple beep sounds due to placeholder implementation
- **Audio Latency**: May have slight delay on some devices
- **Background Audio**: App may pause when backgrounded on some devices

### Platform Specific
- **iOS**: Limited testing on iOS devices
- **Web**: Not optimized for web browsers
- **Android**: Best performance on Android devices

### Features
- **Chord Diagrams**: No visual chord diagrams or fingerings
- **Progress Tracking**: No statistics or progress saving
- **Custom Chord Sets**: Cannot create custom chord collections
- **Export/Import**: No settings backup or sharing

### Performance
- **Battery Usage**: Continuous metronome may drain battery faster
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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is open source and available under the MIT License.
