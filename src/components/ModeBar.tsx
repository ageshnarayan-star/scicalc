import React from 'react';
import { Sun, Moon, History, HelpCircle, Binary, RotateCcw } from 'lucide-react';
import type { AngleMode } from '../types/calculator';

interface ModeBarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  angleMode: AngleMode;
  onToggleAngle: () => void;
  isSecond: boolean;
  onToggleSecond: () => void;
  historyCount: number;
  onToggleHistory: () => void;
  isHistoryOpen: boolean;
  onOpenShortcuts: () => void;
  memory: number;
  onMemoryClear: () => void;
  isMobileScientific: boolean;
  onToggleMobileScientific: () => void;
}

export const ModeBar: React.FC<ModeBarProps> = ({
  theme,
  onToggleTheme,
  angleMode,
  onToggleAngle,
  isSecond,
  onToggleSecond,
  historyCount,
  onToggleHistory,
  isHistoryOpen,
  onOpenShortcuts,
  memory,
  onMemoryClear,
  isMobileScientific,
  onToggleMobileScientific,
}) => {
  return (
    <header className="flex items-center justify-between gap-2 pb-3 mb-1 border-b border-slate-200/60 dark:border-slate-800/60">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
          <Binary className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-1.5 leading-none">
            SciCalc
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
              PRO
            </span>
          </h1>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Mobile Scientific View Switcher (Visible only on small screens) */}
        <button
          type="button"
          onClick={onToggleMobileScientific}
          className={`sm:hidden px-2 py-1 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1 ${
            isMobileScientific
              ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
          aria-label={isMobileScientific ? 'Show basic keypad' : 'Show scientific keypad'}
        >
          {isMobileScientific ? 'Basic' : 'Sci (fx)'}
        </button>

        {/* DEG / RAD Button */}
        <button
          type="button"
          onClick={onToggleAngle}
          className="hidden sm:inline-flex px-2 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-colors"
          title={`Click to switch to ${angleMode === 'DEG' ? 'Radians (RAD)' : 'Degrees (DEG)'}`}
          aria-label={`Toggle angle mode. Currently ${angleMode}`}
        >
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{angleMode}</span>
        </button>

        {/* 2nd Function Toggle */}
        <button
          type="button"
          onClick={onToggleSecond}
          className={`hidden sm:inline-flex px-2 py-1 text-xs font-semibold rounded-lg border transition-colors ${
            isSecond
              ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60'
          }`}
          aria-label="Toggle second function mode"
          title="Toggle 2nd functions"
        >
          2nd
        </button>

        {/* Reset Memory quick icon if memory active */}
        {memory !== 0 && (
          <button
            type="button"
            onClick={onMemoryClear}
            className="p-1.5 rounded-lg text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/50 transition-colors"
            title={`Clear Memory (${memory})`}
            aria-label={`Clear memory currently holding ${memory}`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {/* Keyboard Shortcuts Dialog Trigger */}
        <button
          type="button"
          onClick={onOpenShortcuts}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Keyboard shortcuts & guide"
          aria-label="View keyboard shortcuts"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* History Toggle Button */}
        <button
          type="button"
          onClick={onToggleHistory}
          className={`relative p-1.5 rounded-lg transition-colors ${
            isHistoryOpen
              ? 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Calculation history"
          aria-label="Toggle calculation history panel"
        >
          <History className="w-4 h-4" />
          {historyCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-600 text-white leading-tight">
              {historyCount > 9 ? '9+' : historyCount}
            </span>
          )}
        </button>

        {/* Theme Toggle (Light / Dark) */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>
      </div>
    </header>
  );
};
