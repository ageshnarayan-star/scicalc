/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useCalculator } from './hooks/useCalculator';
import { Display } from './components/Display';
import { Keypad } from './components/Keypad';
import { ModeBar } from './components/ModeBar';
import { HistoryPanel } from './components/HistoryPanel';
import { ShortcutsModal } from './components/ShortcutsModal';

export default function App() {
  const {
    expression,
    resultPreview,
    lastResult,
    error,
    angleMode,
    isSecond,
    memory,
    history,
    isHistoryOpen,
    setIsHistoryOpen,
    theme,
    toggleTheme,
    activeKeyId,
    copiedNotification,
    handleKeyAction,
    copyToClipboard,
    recallHistoryExpression,
    recallHistoryResult,
    clearHistory,
    setAngleMode,
    setIsSecond,
  } = useCalculator();

  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isMobileScientific, setIsMobileScientific] = useState<boolean>(false);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors select-none font-sans">
      {/* Background Ambience / Subtle Lighting Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-sky-500/10 dark:bg-sky-600/10 blur-[100px] rounded-full" />
      </div>

      {/* Main Calculator Chassis Container */}
      <main className="relative z-10 w-full max-w-4xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-4 sm:p-6 md:p-7 shadow-2xl border border-slate-200/90 dark:border-slate-800/90 flex flex-col gap-4">
        {/* Top ModeBar Header */}
        <ModeBar
          theme={theme}
          onToggleTheme={toggleTheme}
          angleMode={angleMode}
          onToggleAngle={() => setAngleMode((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'))}
          isSecond={isSecond}
          onToggleSecond={() => setIsSecond((prev) => !prev)}
          historyCount={history.length}
          onToggleHistory={() => setIsHistoryOpen((prev) => !prev)}
          isHistoryOpen={isHistoryOpen}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          memory={memory}
          onMemoryClear={() => handleKeyAction({ id: 'mc', label: 'MC', ariaLabel: 'Memory clear', category: 'memory', actionType: 'memory' })}
          isMobileScientific={isMobileScientific}
          onToggleMobileScientific={() => setIsMobileScientific((prev) => !prev)}
        />

        {/* Display Screen */}
        <Display
          expression={expression}
          resultPreview={resultPreview}
          lastResult={lastResult}
          error={error}
          angleMode={angleMode}
          isSecond={isSecond}
          memory={memory}
          copied={copiedNotification}
          onToggleAngle={() => setAngleMode((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'))}
          onCopy={copyToClipboard}
        />

        {/* Keypad */}
        <Keypad
          isSecond={isSecond}
          activeKeyId={activeKeyId}
          onPress={handleKeyAction}
          isMobileScientific={isMobileScientific}
        />

        {/* Bottom subtle indicator bar */}
        <footer className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 px-1 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
          <span className="font-mono">
            {angleMode === 'DEG' ? 'Degrees (360°)' : 'Radians (2π)'}
          </span>
          <span className="hidden sm:inline">
            Type with physical keyboard or on-screen keys
          </span>
          <span className="font-mono">
            v1.0 • math.js
          </span>
        </footer>
      </main>

      {/* History Slide-out Drawer */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectExpression={recallHistoryExpression}
        onSelectResult={recallHistoryResult}
        onClearHistory={clearHistory}
      />

      {/* Shortcuts & Guide Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
