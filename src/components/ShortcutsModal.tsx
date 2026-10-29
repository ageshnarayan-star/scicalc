import React from 'react';
import { X, Keyboard, CheckCircle2 } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '0 - 9', desc: 'Numbers & digits' },
    { key: '+  −  *  /', desc: 'Basic arithmetic (+, −, ×, ÷)' },
    { key: '^', desc: 'Power xʸ' },
    { key: '%', desc: 'Percentage' },
    { key: '(  )', desc: 'Parentheses' },
    { key: 'Enter or =', desc: 'Evaluate expression' },
    { key: 'Backspace', desc: 'Delete last character' },
    { key: 'Esc or Del', desc: 'Clear all (AC)' },
    { key: 'Shift', desc: 'Toggle 2nd function' },
    { key: 's / c / t', desc: 'sin( / cos( / tan(' },
    { key: 'l / n', desc: 'log( / ln(' },
    { key: 'p / e', desc: 'π (pi) / e' },
    { key: '!', desc: 'Factorial n!' },
  ];

  const examples = [
    { expr: 'sin(30)', desc: '0.5 in DEG mode' },
    { expr: 'cos(π)', desc: '-1 in RAD mode' },
    { expr: '2π', desc: 'Implicit multiplication (6.283...)' },
    { expr: '√(16)+3²', desc: 'Roots and powers (13)' },
    { expr: '5!', desc: 'Factorial (120)' },
    { expr: '0.1 + 0.2', desc: 'Exact precision handling (0.3)' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
    >
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <h2 id="shortcuts-title" className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
              Keyboard Shortcuts & Guide
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shortcuts modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 custom-scrollbar text-sm">
          {/* Shortcuts Grid */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
              Keyboard Bindings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {shortcuts.map((sc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800/60"
                >
                  <kbd className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400 shadow-xs">
                    {sc.key}
                  </kbd>
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {sc.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Verified Examples */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
              Verified Formula Examples
            </h3>
            <div className="space-y-1.5">
              {examples.map((ex, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/40 text-xs"
                >
                  <span className="font-calc font-semibold text-indigo-700 dark:text-indigo-300">
                    {ex.expr}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    {ex.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-slate-800/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer shadow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
