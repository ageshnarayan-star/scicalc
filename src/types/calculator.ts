export type AngleMode = 'DEG' | 'RAD';

export type KeyCategory = 
  | 'digit'
  | 'operator'
  | 'function'
  | 'action'
  | 'memory'
  | 'special';

export interface CalculatorKeyDef {
  id: string;
  label: string;
  subLabel?: string;
  secondLabel?: string;
  secondId?: string;
  ariaLabel: string;
  category: KeyCategory;
  shortcut?: string[];
  actionType: 'insert' | 'function' | 'eval' | 'clear' | 'backspace' | 'clear-entry' | 'memory' | 'toggle-sign' | 'toggle-angle' | 'toggle-second';
  insertValue?: string;
  secondInsertValue?: string;
  isWide?: boolean;
  scientificOnly?: boolean;
}

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  angleMode: AngleMode;
}

export interface CalculatorState {
  expression: string;
  displayExpression: string;
  resultPreview: string;
  lastResult: string | null;
  error: string | null;
  angleMode: AngleMode;
  isSecond: boolean;
  memory: number;
  history: HistoryItem[];
  isHistoryOpen: boolean;
  theme: 'light' | 'dark';
}
