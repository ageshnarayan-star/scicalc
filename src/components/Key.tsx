import React from 'react';
import type { CalculatorKeyDef } from '../types/calculator';

interface KeyProps {
  keyDef: CalculatorKeyDef;
  isSecond: boolean;
  isActive: boolean;
  onPress: (keyDef: CalculatorKeyDef) => void;
}

export const Key: React.FC<KeyProps> = ({
  keyDef,
  isSecond,
  isActive,
  onPress,
}) => {
  const isSecondActive = isSecond && (keyDef.secondLabel || keyDef.secondInsertValue);
  const displayLabel = isSecondActive && keyDef.secondLabel ? keyDef.secondLabel : keyDef.label;
  const secondaryPreview = !isSecond && keyDef.secondLabel ? keyDef.secondLabel : null;

  // Derive color schemes based on key category
  const getCategoryStyles = () => {
    switch (keyDef.category) {
      case 'digit':
        return 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-750 border-slate-200/80 dark:border-slate-700/60 shadow-sm active:bg-slate-100 dark:active:bg-slate-700';

      case 'operator':
        return 'bg-amber-500/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 dark:hover:bg-amber-500/25 border-amber-300/40 dark:border-amber-600/30 active:bg-amber-500/30 font-medium';

      case 'action':
        // AC, CE, ⌫
        return 'bg-rose-500/10 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20 dark:hover:bg-rose-500/25 border-rose-300/40 dark:border-rose-600/30 active:bg-rose-500/30 font-semibold';

      case 'function':
        return 'bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60 border-slate-200 dark:border-slate-700/40 active:bg-slate-300 dark:active:bg-slate-700 text-sm font-medium';

      case 'memory':
        return 'bg-sky-500/10 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 dark:hover:bg-sky-500/25 border-sky-300/40 dark:border-sky-600/30 active:bg-sky-500/30 text-xs font-semibold';

      case 'special':
        if (keyDef.id === 'equals') {
          return 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white border-indigo-700 shadow-md font-bold text-xl sm:text-2xl shadow-indigo-500/25';
        }
        if (keyDef.id === 'second') {
          return isSecond
            ? 'bg-amber-500 text-slate-950 font-bold border-amber-600 shadow-sm'
            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700 font-semibold';
        }
        return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800/40 font-medium';

      default:
        return 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <button
      type="button"
      onClick={() => onPress(keyDef)}
      aria-label={keyDef.ariaLabel}
      className={`relative min-h-[44px] sm:min-h-[48px] h-full flex flex-col items-center justify-center rounded-xl border select-none transition-all duration-75 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${getCategoryStyles()} ${
        isActive ? 'scale-90 ring-2 ring-indigo-500 brightness-110 shadow-inner' : 'active:scale-95'
      }`}
    >
      {/* Secondary preview superscript badge if inactive 2nd mode */}
      {secondaryPreview && (
        <span className="absolute top-1 right-1.5 text-[9px] sm:text-[10px] text-amber-600/80 dark:text-amber-400/80 font-mono font-medium leading-none pointer-events-none">
          {secondaryPreview}
        </span>
      )}

      {/* Main Button Label */}
      <span className="font-calc tracking-tight text-sm sm:text-base pointer-events-none">
        {displayLabel}
      </span>
    </button>
  );
};
