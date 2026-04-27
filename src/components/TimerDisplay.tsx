import { MODE_LABELS } from '../utils/constants';
import { formatTime } from '../utils/storage';
import type { TimerMode } from '../utils/types';
import SessionDots from './SessionDots';

interface TimerDisplayProps {
  mode: TimerMode;
  secondsLeft: number;
  isActive: boolean;
  completedSessions: number;
  dotsState: boolean[];
  onToggle: () => void;
  onReset: () => void;
  onFullReset: () => void;
}

const modeLabelColor: Record<TimerMode, string> = {
  WORK: 'text-rose-400',
  BREAK: 'text-emerald-400',
  LONG_BREAK: 'text-blue-400',
};

export default function TimerDisplay({
  mode,
  secondsLeft,
  isActive,
  completedSessions,
  dotsState,
  onToggle,
  onReset,
  onFullReset,
}: TimerDisplayProps) {
  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 text-center w-full max-w-sm mb-12 mt-10">
      <SessionDots dots={dotsState} />

      <h2 className={`text-xs font-black tracking-[0.2em] uppercase mb-2 ${modeLabelColor[mode]}`}>
        {MODE_LABELS[mode]}
      </h2>

      <div className="text-8xl font-mono font-bold text-gray-800 mb-8 tracking-tighter">
        {formatTime(secondsLeft)}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onToggle}
          className={`flex-[3] py-5 rounded-2xl font-black text-white transition-all transform active:scale-95 ${
            isActive ? 'bg-gray-400 shadow-inner' : 'bg-indigo-600 shadow-xl shadow-indigo-200'
          }`}
        >
          {isActive ? 'PAUSE' : 'START'}
        </button>

        {/* Reset courant (mode actuel) */}
        <button
          onClick={onReset}
          title="Recommencer ce segment"
          className="flex-1 bg-gray-100 rounded-2xl text-xl hover:bg-gray-200 transition-colors"
        >
          🔄
        </button>

        {/* Full reset — remet tout à zéro */}
        <button
          onClick={onFullReset}
          title="Tout remettre à zéro"
          className="flex-1 bg-rose-50 rounded-2xl text-xl hover:bg-rose-100 transition-colors"
        >
          ⏮️
        </button>
      </div>

      <p className="mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
        Total sessions : {completedSessions}
      </p>
    </div>
  );
}
