import { useState } from 'react';
import type { AppSettings } from '../utils/types';

interface SettingsProps {
  settings: AppSettings;
  onUpdate: (newSettings: AppSettings) => void;
  onClose: () => void;
}

interface FieldConfig {
  label: string;
  key: keyof AppSettings;
  isMinutes: boolean;
}

const FIELDS: FieldConfig[] = [
  { label: 'Travail (min)', key: 'workDuration', isMinutes: true },
  { label: 'Pause (min)', key: 'breakDuration', isMinutes: true },
  { label: 'Pause longue (min)', key: 'longBreakDuration', isMinutes: true },
  { label: 'Cycles avant longue', key: 'sessionsBeforeLongBreak', isMinutes: false },
];

type LocalState = {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
};

export default function Settings({ settings, onUpdate, onClose }: SettingsProps) {
  // Work in display-friendly units (minutes) locally.
  const [local, setLocal] = useState<LocalState>({
    workDuration: settings.workDuration / 60,
    breakDuration: settings.breakDuration / 60,
    longBreakDuration: settings.longBreakDuration / 60,
    sessionsBeforeLongBreak: settings.sessionsBeforeLongBreak,
  });

  const handleChange = (key: keyof LocalState, raw: string) => {
    const value = parseInt(raw, 10);
    if (isNaN(value)) return;
    setLocal(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onUpdate({
      workDuration: Math.max(1, local.workDuration) * 60,
      breakDuration: Math.max(1, local.breakDuration) * 60,
      longBreakDuration: Math.max(1, local.longBreakDuration) * 60,
      sessionsBeforeLongBreak: Math.max(1, local.sessionsBeforeLongBreak),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Réglages</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {FIELDS.map(({ label, key, isMinutes }) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-gray-600 font-medium">{label}</label>
              <input
                step={isMinutes ? 1 : 5}
                type="number"
                min={1}
                value={local[key]}
                onChange={e => handleChange(key, e.target.value)}
                className="w-20 p-2 border rounded-xl text-center font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="w-full mt-8 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-colors"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}
