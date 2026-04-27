# 🎯 Focus Flow

A minimal, distraction-free Pomodoro timer built with React + TypeScript + Tailwind CSS.

![Focus Flow](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)

---

## Features

- **Pomodoro auto-flow** — Work → Break → Long Break transitions happen automatically
- **Configurable durations** — Work, break, long break durations and cycle count, all adjustable
- **Session tracking** — Dot indicators show progress within the current cycle
- **Full reset** — Reset just the current segment, or wipe everything back to session 1
- **Task list** — Add, complete, and delete tasks inline; persisted across sessions
- **Sound notifications** — Two-note Web Audio API chime on every transition (no audio files required)
- **System notifications** — Browser notification support with graceful permission fallback
- **Import / Export** — Backup and restore your tasks and settings as JSON
- **Embedded focus music** — YouTube player built in
- **Fully persistent** — All state saved to `localStorage` automatically

---

## Tech Stack

| Layer     | Choice                          |
| --------- | ------------------------------- |
| Framework | React 19                        |
| Language  | TypeScript 5                    |
| Styling   | Tailwind CSS 3                  |
| Bundler   | Vite 5                          |
| Audio     | Web Audio API (no dependencies) |
| Storage   | localStorage                    |

---

## Project Structure

```
src/
├── App.tsx                     # Root — orchestrates, persists, routes props
│
├── components/
│   ├── TimerDisplay.tsx        # Timer card — countdown, mode label, controls
│   ├── SessionDots.tsx         # Cycle progress indicator
│   ├── TaskList.tsx            # Task input + list container
│   ├── TaskItem.tsx            # Individual task row (checkbox + delete)
│   ├── Settings.tsx            # Modal — durations and cycle config
│   ├── Toolbar.tsx             # Top bar — settings, import, export
│   └── YoutubePlayer.tsx       # Embedded YouTube iframe (16:9 responsive)
│
├── hooks/
│   ├── useTimer.ts             # Core countdown — stable reset, no stale closures
│   ├── usePomodoroFlow.ts      # Orchestrator — mode transitions, dots, full reset
│   ├── useTasks.ts             # Task CRUD mutations
│   └── useNotification.ts      # Web Audio chime + browser Notification API
│
└── utils/
    ├── types.ts                # Shared interfaces (TimerMode, Task, AppSettings…)
    ├── constants.ts            # DEFAULT_DATA, MODE_LABELS, MODE_NOTIF, ChimeType
    └── storage.ts              # loadData / saveData / exportJSON / formatTime
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm or pnpm

### Installation

```bash
git clone https://github.com/your-username/focus-flow.git
cd focus-flow
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Build

```bash
npm run build
```

Output in `dist/`.

---

## Usage

### Timer controls

| Button            | Action                                                 |
| ----------------- | ------------------------------------------------------ |
| **START / PAUSE** | Toggle the countdown                                   |
| 🔄                | Restart the current segment (same mode, same duration) |
| ⏮️                | Full reset — back to WORK, session count to 0          |

### Settings

Click ⚙️ to open the settings modal. Changes apply immediately and reset the current timer.

| Setting                  | Default |
| ------------------------ | ------- |
| Work duration            | 25 min  |
| Break duration           | 5 min   |
| Long break duration      | 15 min  |
| Cycles before long break | 4       |

### Import / Export

Click **EXPORT** to download a `focus-flow-backup-YYYY-MM-DD.json` file containing your current settings and task list. Click **IMPORT** to restore from a previously exported file.

---

## Architecture Notes

**No stale closures** — `useTimer` stores `onFinished` in a ref updated on every render, so the callback always sees the latest state without being listed as an effect dependency.

**Circular declaration fix** — `usePomodoroFlow` needs to call `reset` inside `handleFinished`, but `reset` is only available after `useTimer` is called. This is solved with a `resetRef` forward-ref: the ref is initialized with a no-op, `handleFinished` calls `resetRef.current(...)`, and `resetRef.current = reset` is assigned synchronously right after `useTimer` returns.

**Ref mirrors for hot state** — `modeRef`, `completedRef`, and `settingsRef` are kept in sync with their state counterparts via `useEffect`. This lets `handleFinished` (a stable `useCallback`) read the latest values without capturing stale closures or triggering re-runs of the timer effect.

**Web Audio chime** — Two slightly detuned sine oscillators (`× 1.007`) share a gain node with an exponential decay. No audio files, no external dependencies. Ascending (C5 → E5) signals end of work; descending (E5 → C5) signals end of break.

---

## License

MIT
