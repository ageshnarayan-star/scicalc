import React from 'react';
import type { CalculatorKeyDef } from '../types/calculator';
import { CALCULATOR_KEYS, BASIC_KEYS } from '../utils/calculatorKeys';
import { Key } from './Key';

interface KeypadProps {
  isSecond: boolean;
  activeKeyId: string | null;
  onPress: (keyDef: CalculatorKeyDef) => void;
  isMobileScientific: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  isSecond,
  activeKeyId,
  onPress,
  isMobileScientific,
}) => {
  return (
    <div className="w-full flex flex-col gap-3">
      {/* Desktop / Large Screen Layout: Two Columns Side-by-Side */}
      <div className="hidden sm:grid sm:grid-cols-10 gap-2 sm:gap-2.5">
        {/* Scientific Section (6 columns on desktop) */}
        <div className="col-span-6 grid grid-cols-6 gap-1.5 sm:gap-2 p-2 rounded-2xl bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
          {CALCULATOR_KEYS.map((keyDef) => (
            <Key
              key={keyDef.id}
              keyDef={keyDef}
              isSecond={isSecond}
              isActive={activeKeyId === keyDef.id}
              onPress={onPress}
            />
          ))}
        </div>

        {/* Basic Arithmetic & Numbers Section (4 columns on desktop) */}
        <div className="col-span-4 grid grid-cols-4 gap-1.5 sm:gap-2 p-2 rounded-2xl bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
          {BASIC_KEYS.map((keyDef) => (
            <Key
              key={keyDef.id}
              keyDef={keyDef}
              isSecond={isSecond}
              isActive={activeKeyId === keyDef.id}
              onPress={onPress}
            />
          ))}
        </div>
      </div>

      {/* Mobile Layout (< 640px): Dynamic Tabbed Keypad */}
      <div className="sm:hidden flex flex-col gap-2">
        {isMobileScientific ? (
          /* Mobile Scientific View */
          <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
            {CALCULATOR_KEYS.map((keyDef) => (
              <Key
                key={keyDef.id}
                keyDef={keyDef}
                isSecond={isSecond}
                isActive={activeKeyId === keyDef.id}
                onPress={onPress}
              />
            ))}
          </div>
        ) : (
          /* Mobile Basic View */
          <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
            {BASIC_KEYS.map((keyDef) => (
              <Key
                key={keyDef.id}
                keyDef={keyDef}
                isSecond={isSecond}
                isActive={activeKeyId === keyDef.id}
                onPress={onPress}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
