import React from 'react';
import { X, Trash2, Clock, CornerDownLeft, Sparkles } from 'lucide-react';
import type { HistoryItem } from '../types/calculator';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectExpression: (item: HistoryItem) => void;
  onSelectResult: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isOpen,
  onClose,
  history,
  onSelectExpression,
  onSelectResult,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-label="Calculation history"
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-84 md:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-all duration-300 ease-out"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Calculation History
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
            {history.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {history.length > 0 && (
            <button
              type="button"
              onClick={onClearHistory}
              aria-label="Clear all calculation history"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Clear History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close history panel"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* History Items List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 custom-scrollbar">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-slate-400 dark:text-slate-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                No past calculations
              </p>
              <p className="text-xs mt-1 text-slate-500 max-w-[200px]">
                Calculate expressions with = to see them recorded here.
              </p>
            </div>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="group p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 dark:bg-slate-800/50 dark:hover:bg-indigo-950/30 border border-slate-200/60 dark:border-slate-800/60 hover:border-indigo-300 dark:hover:border-indigo-800/60 transition-all flex flex-col gap-1.5"
            >
              {/* Top row: Angle mode & timestamp */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                <span className="font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-200/60 dark:bg-slate-800 text-[10px]">
                  {item.angleMode}
                </span>
                <span>
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {/* Expression button */}
              <button
                type="button"
                onClick={() => onSelectExpression(item)}
                className="w-full text-left font-calc text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium truncate cursor-pointer"
                title="Click to load full expression into calculator"
              >
                {item.expression}
              </button>

              {/* Result row with direct insert action */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 dark:border-slate-800/40">
                <button
                  type="button"
                  onClick={() => onSelectResult(item)}
                  className="font-calc font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 truncate flex items-center gap-1.5 cursor-pointer"
                  title="Click to insert result"
                >
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-normal">=</span>
                  <span>{item.result}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectExpression(item)}
                  aria-label="Reuse expression"
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 transition-opacity"
                  title="Recall expression"
                >
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Instructions */}
      {history.length > 0 && (
        <div className="p-3 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-200/60 dark:border-slate-800/60 text-center">
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Tap expression to reuse • Tap result to insert
          </p>
        </div>
      )}
    </aside>
  );
};
