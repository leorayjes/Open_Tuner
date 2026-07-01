# Open Tuner

A cross-platform chromatic instrument tuner built with Expo (React Native + Web). Detects pitch in real time from the microphone, compares it against preset or custom tunings, and displays the result with an animated needle and cents-deviation meter.

## Features

- **Real-time pitch detection** using the YIN algorithm with parabolic interpolation (sub-cent precision)
- **10 guitar presets** — Standard, Drop D, DADGAD, Open G, Open D, Open E, ½ Step Down, Whole Step Down, Drop C, Baroque (A=415 Hz)
- **Custom tuning creator** — choose any note and octave for every string, name it, and save it
- **Persistent storage** — custom tunings and last-used tuning survive app restarts (AsyncStorage / localStorage)
- **Animated UI** — spring-animated needle, cents meter with pip indicator, green flash + haptic on in-tune
- **Web + Android** from one codebase via Expo

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Install

```bash
git clone <repo-url>
cd open_tuner
npm install --legacy-peer-deps
```

### Run on Web

```bash
npx expo start --web
```

Open [http://localhost:8081](http://localhost:8081) in Chrome. Grant microphone permission when prompted, then tap **Tap to Listen**.

### Run on Android

A development build is required (Expo Go does not include all native modules used by this project):

```bash
npx expo run:android
```

Or build with EAS:

```bash
npx eas build --platform android --profile development
```

### Export static web build

```bash
npx expo export --platform web --output-dir ./web-build
```

The `web-build/` directory can be served by any static host (Netlify, Vercel, GitHub Pages, etc.).

---

## Project Structure

```
open_tuner/
├── app/                          # Expo Router screens (tab navigation)
│   ├── _layout.tsx               # Tab bar configuration
│   ├── index.tsx                 # Tuner screen (main)
│   ├── tunings.tsx               # Preset + custom tuning browser
│   └── custom-tuning.tsx         # Custom tuning creator
│
└── src/
    ├── models/
    │   └── types.ts              # All TypeScript interfaces (single source of truth)
    │
    ├── audio/
    │   ├── AudioCapture.web.ts   # Web: getUserMedia + Web Audio API ScriptProcessorNode
    │   ├── AudioCapture.ts       # Android: stub — see "Android Audio" below
    │   └── useAudioCapture.ts    # Unified hook; Metro resolves the correct file per platform
    │
    ├── pitch/
    │   ├── yin.ts                # YIN pitch detection algorithm (pure TypeScript)
    │   ├── noteUtils.ts          # Hz ↔ note name conversion, cents formatting
    │   └── usePitchDetector.ts   # Hook: audio capture → YIN → throttled PitchResult
    │
    ├── tunings/
    │   ├── presets.ts            # All preset Tuning objects (guitar + stubs for other instruments)
    │   ├── instruments.ts        # Instrument definitions
    │   └── useTunings.ts         # Hook: load/save custom tunings via AsyncStorage
    │
    ├── storage/
    │   └── storage.ts            # Typed AsyncStorage / localStorage wrapper
    │
    └── components/
        ├── TunerNeedle.tsx       # Animated SVG arc + View-based needle
        ├── CentsMeter.tsx        # Horizontal cents deviation bar with animated pip
        ├── NoteDisplay.tsx       # Large note name, octave, Hz, cents readout
        ├── StringSelector.tsx    # Horizontal scrollable string buttons
        ├── InTuneFlash.tsx       # Full-screen green flash when in tune
        └── NoteSelector.tsx      # Note + octave picker (used in custom tuning creator)
```

---

## How It Works

### Pitch Detection

Audio is captured at 44 100 Hz in 2 048-sample frames. Each frame is processed by `src/pitch/yin.ts`, which implements the YIN algorithm:

1. **Difference function** — computes the squared difference between the signal and a delayed copy of itself for every possible period τ
2. **CMNDF** — normalises the difference function by its cumulative mean so that the threshold is amplitude-independent
3. **Threshold search** — finds the first τ below 0.15 where the CMNDF has a local minimum (pitch period candidate)
4. **Parabolic interpolation** — refines the period estimate to sub-sample precision, giving cent-level frequency accuracy

The detected frequency is then converted to the nearest MIDI note and cents deviation in `src/pitch/noteUtils.ts` using equal temperament at A4 = 440 Hz.

### Platform Audio Split

Metro's file-extension resolution automatically selects the correct audio capture implementation per build target:

| File | Used when bundling for |
|---|---|
| `src/audio/AudioCapture.web.ts` | Web (browser) |
| `src/audio/AudioCapture.ts` | Android / iOS |

`useAudioCapture.ts` imports from `./AudioCapture` with no platform checks — Metro resolves the right file. This keeps zero dead code in either bundle.

### Baroque Tuning

The Baroque (A=415) preset multiplies every string's target frequency by `415/440 ≈ 0.9432`. This shifts all strings down approximately one semitone from modern concert pitch, matching the historical standard used in baroque music.

---

## Android Audio

The web version uses the **Web Audio API** (`ScriptProcessorNode`) for real-time PCM streaming and is fully functional.

The Android implementation in `src/audio/AudioCapture.ts` is currently a **stub**. To enable real-time pitch detection on Android, install [`@siteed/expo-audio-stream`](https://github.com/siteed/expo-audio-stream) and replace the stub with its `onAudioStream` callback:

```bash
npx expo install @siteed/expo-audio-stream
```

```ts
// src/audio/AudioCapture.ts
import { ExpoAudioStream } from '@siteed/expo-audio-stream';

export function useAudioCaptureImpl(onBuffer, active) {
  useEffect(() => {
    if (!active) return;
    ExpoAudioStream.startRecording({
      sampleRate: 44100,
      channels: 1,
      encoding: 'pcm_32bit',
      onAudioStream: (data) => onBuffer(data.buffer, 44100),
    });
    return () => ExpoAudioStream.stopRecording();
  }, [active, onBuffer]);
}
```

No other files need to change.

---

## Adding a New Instrument

1. Add the instrument ID to the `InstrumentId` union in `src/models/types.ts`
2. Add an `Instrument` entry to `src/tunings/instruments.ts`
3. Add preset `Tuning` objects to `src/tunings/presets.ts` and include them in `ALL_PRESETS`

The tuning browser, custom tuning creator, and string selector all derive their data from these files automatically.

---

## Key Dependencies

| Package | Purpose |
|---|---|
| `expo` ~56 | Managed workflow, build tooling |
| `expo-router` | File-based tab navigation |
| `expo-audio` | Microphone permission on Android |
| `expo-haptics` | Haptic feedback on in-tune |
| `react-native-reanimated` | Spring-animated needle and meter pip |
| `react-native-svg` | Arc and tick marks in TunerNeedle |
| `@react-native-async-storage/async-storage` | Custom tuning persistence |
| `react-native-web` | React Native renderer for the browser |
