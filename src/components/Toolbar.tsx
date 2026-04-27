import { useRef } from 'react';
import type { AppData } from '../utils/types';
import { exportJSON, parseImportedJSON } from '../utils/storage';

interface ToolbarProps {
  data: AppData;
  onImport: (data: AppData) => void;
  onOpenSettings: () => void;
}

export default function Toolbar({ data, onImport, onOpenSettings }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const result = parseImportedJSON(ev.target?.result as string);
      if (result) {
        onImport(result);
      } else {
        alert('Fichier invalide — format JSON Focus Flow attendu.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed top-6 left-6 right-6 flex justify-between items-center pointer-events-none">
      <button
        onClick={onOpenSettings}
        className="pointer-events-auto bg-white/80 backdrop-blur p-3 rounded-full border shadow-sm hover:rotate-90 transition-transform duration-500"
        aria-label="Ouvrir les réglages"
      >
        ⚙️
      </button>

      <div className="flex gap-2 pointer-events-auto">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-white/80 backdrop-blur px-4 py-2 rounded-full border text-xs font-bold hover:bg-white transition-colors"
        >
          IMPORT
        </button>
        <button
          onClick={() => exportJSON(data)}
          className="bg-white/80 backdrop-blur px-4 py-2 rounded-full border text-xs font-bold hover:bg-white transition-colors"
        >
          EXPORT
        </button>
      </div>
    </div>
  );
}
