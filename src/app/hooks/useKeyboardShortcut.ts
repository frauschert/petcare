import { useEffect } from 'react';

type KeyCombo = {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
};

type ShortcutMap = {
  [key: string]: {
    combo: KeyCombo;
    callback: () => void;
    description: string;
  };
};

export const useKeyboardShortcut = (shortcuts: ShortcutMap) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of Object.values(shortcuts)) {
        const { combo, callback } = shortcut;
        const { key, ctrl = false, alt = false, shift = false } = combo;

        if (
          event.key.toLowerCase() === key.toLowerCase() &&
          event.ctrlKey === ctrl &&
          event.altKey === alt &&
          event.shiftKey === shift
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

  return Object.entries(shortcuts).map(([id, { combo, description }]) => ({
    id,
    description,
    keys: [
      combo.ctrl && 'Ctrl',
      combo.alt && 'Alt',
      combo.shift && 'Shift',
      combo.key.toUpperCase(),
    ]
      .filter(Boolean)
      .join(' + '),
  }));
};
