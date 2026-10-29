import { useRef, useEffect } from 'react';
import { Copy, Check, Info } from 'lucide-react';
import type { AngleMode } from '../types/calculator';

interface DisplayProps {
  expression: string;
  resultPreview: string;
  lastResult: string | null;
  error: string | null;
  angleMode: AngleMode;
  isSecond: boolean;
  memory: number;
  copied: boolean;
  onToggleAngle: () => void;
  onCopy: (text: string) => void;
}

export const Display = ({
  expression,
  resultPreview,
  error,
  angleMode,
  isSecond,
  memory,
  copied,
  onToggleAngle,
  onCopy,
}: DisplayProps) => {
  const exprScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll expression line to right as user types
  useEffect(() => {
    if (exprScrollRef.current) {
      exprScrollRef.current.scrollLeft = exprScrollRef.current.scrollWidth;
    }
  }, [expression]);

  const activeResult = error ? error : (resultPreview || expression || '0');
  const isError = Boolean(error);

  return (
    <div className="relative rounded-2xl bg-white/80 dark:bg-slate-900/90 backdrop-blur-md p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-inner flex flex-col justify-between transition-colors">
      {/* Top Status Indicators Row */}
      <div className="flex items-center justify-between gap-2 mb-2 select-none">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Angle Mode Badge (Clickable) */}
          <button
            type="button"
            onClick={onToggleAngle}
            aria-label={`Angle mode is currently ${angleMode}. Click to switch.`}
            className={`px-2 py-0.5 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
              angleMode === 'DEG'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
            }`}
          >
            {angleMode}
          </button>

          {/* 2nd Function Indicator */}
          {isSecond && (
            <span
              className="px-2 py-0.5 text-xs font-semibold rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 animate-pulse"
              title="2nd function active"
            >
              2nd
            </span>
          )}

          {/* Memory Indicator */}
          {memory !== 0 && (
            <span
              className="px-2 py-0.5 text-xs font-semibold rounded-md bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-400 border border-sky-300 dark:border-sky-800 flex items-center gap-1"
              title={`Memory active: ${memory}`}
            >
              M <span className="opacity-70 font-mono text-[10px]">({memory})</span>
            </span>
          )}
        </div>

        {/* Copy Result Button */}
        <button
          type="button"
          onClick={() => onCopy(isError ? '' : activeResult)}
          disabled={!activeResult || isError}
          aria-label="Copy result to clipboard"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          title="Copy result"
        >
          {copied ? (
            <span className="flex items-center text-xs text-emerald-600 dark:text-emerald-400 gap-1 font-medium">
              <Check className="w-3.5 h-3.5" /> Copied
            </span>
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Expression Display Line (Top Line) */}
      <div
        ref={exprScrollRef}
        className="custom-scrollbar overflow-x-auto whitespace-nowrap scroll-smooth text-right text-slate-500 dark:text-slate-400 text-base sm:text-lg font-calc tracking-wide py-1 min-h-[30px]"
        aria-label="Current expression"
      >
        {expression || <span className="opacity-0">0</span>}
      </div>

      {/* Main Result Display Line (Bottom Line) */}
      <div
        aria-live="polite"
        className="flex items-baseline justify-end gap-2 overflow-hidden select-all mt-1"
      >
        {isError ? (
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-calc font-semibold text-2xl sm:text-3xl py-1 animate-shake">
            <Info className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <div
            className={`font-calc font-bold tracking-tight text-right transition-all truncate ${
              resultPreview
                ? 'text-slate-400 dark:text-slate-500 text-2xl sm:text-3xl'
                : 'text-slate-900 dark:text-slate-50 text-3xl sm:text-4xl'
            }`}
          >
            {activeResult}
          </div>
        )}
      </div>
    </div>
  );
};
