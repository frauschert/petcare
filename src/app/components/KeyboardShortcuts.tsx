'use client';
import React, { useEffect } from 'react';

type ShortcutProps = {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
};

type Shortcut = {
  combo: ShortcutProps;
  callback: () => void;
  description: string;
};

type KeyboardShortcutsProps = {
  shortcuts: Record<string, Shortcut>;
};

export default function KeyboardShortcuts({
  shortcuts,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const [_, shortcut] of Object.entries(shortcuts)) {
        const { combo, callback } = shortcut;
        if (
          event.key.toLowerCase() === combo.key.toLowerCase() &&
          event.ctrlKey === !!combo.ctrl &&
          event.altKey === !!combo.alt &&
          event.shiftKey === !!combo.shift
        ) {
          event.preventDefault();
          callback();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-200">
      <h3 className="text-sm font-semibold mb-2">Keyboard Shortcuts</h3>
      <ul className="space-y-1 text-sm">
        {Object.entries(shortcuts).map(([name, shortcut]) => (
          <li key={name} className="flex justify-between">
            <span>{shortcut.description}</span>
            <span className="ml-4 text-gray-400">
              {[
                shortcut.combo.ctrl && 'Ctrl',
                shortcut.combo.alt && 'Alt',
                shortcut.combo.shift && 'Shift',
                shortcut.combo.key.toUpperCase(),
              ]
                .filter(Boolean)
                .join(' + ')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
