import { useState, useEffect } from 'react';
import { usePomodoroFlow } from './hooks/usePomodoroFlow';
import { useTasks } from './hooks/useTasks';
import { loadData, saveData } from './utils/storage';
import type { AppData } from './utils/types';

import Toolbar from './components/Toolbar';
import TimerDisplay from './components/TimerDisplay';
import TaskList from './components/TaskList';
import Settings from './components/Settings';
import YoutubePlayer from './components/YoutubePlayer';

const bgClass: Record<string, string> = {
  WORK: 'bg-rose-50',
  BREAK: 'bg-emerald-50',
  LONG_BREAK: 'bg-blue-50',
};

export default function App() {
  const [data, setData] = useState<AppData>(loadData);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const {
    mode,
    secondsLeft,
    isActive,
    completedSessions,
    dotsState,
    toggle,
    manualReset,
    fullReset,
    applySettings,
  } = usePomodoroFlow(data.settings);

  const { addTask, toggleTask, deleteTask } = useTasks(setData);

  const handleSettingsUpdate = (newSettings: AppData['settings']) => {
    setData(prev => ({ ...prev, settings: newSettings }));
    applySettings(newSettings);
  };

  const handleImport = (imported: AppData) => {
    setData(imported);
    applySettings(imported.settings);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center py-12 transition-colors duration-1000 ${bgClass[mode]}`}
    >
      {showSettings && (
        <Settings
          settings={data.settings}
          onUpdate={handleSettingsUpdate}
          onClose={() => setShowSettings(false)}
        />
      )}

      <Toolbar data={data} onImport={handleImport} onOpenSettings={() => setShowSettings(true)} />

      <TimerDisplay
        mode={mode}
        secondsLeft={secondsLeft}
        isActive={isActive}
        completedSessions={completedSessions}
        dotsState={dotsState}
        onToggle={toggle}
        onReset={manualReset}
        onFullReset={fullReset}
      />
      <YoutubePlayer />

      <TaskList tasks={data.tasks} onAdd={addTask} onToggle={toggleTask} onDelete={deleteTask} />
    </div>
  );
}
