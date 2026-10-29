import { useState, useEffect, useCallback, useRef } from 'react';
import type { AngleMode, CalculatorKeyDef, HistoryItem } from '../types/calculator';
import { evaluateExpression } from '../utils/mathEngine';
import { CALCULATOR_KEYS, BASIC_KEYS } from '../utils/calculatorKeys';

const STORAGE_KEYS = {
  HISTORY: 'scicalc_history_v1',
  MEMORY: 'scicalc_memory_v1',
  ANGLE_MODE: 'scicalc_angle_mode_v1',
  THEME: 'scicalc_theme_v1',
};

function safeStorageGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch {
    return defaultValue;
  }
}

function safeStorageSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore quota or disabled storage
  }
}

export function useCalculator() {
  // Angle mode (DEG or RAD)
  const [angleMode, setAngleMode] = useState<AngleMode>(() =>
    safeStorageGet<AngleMode>(STORAGE_KEYS.ANGLE_MODE, 'DEG')
  );

  // Theme (light or dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = safeStorageGet<'light' | 'dark' | null>(STORAGE_KEYS.THEME, null);
    if (saved) return saved;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'dark'; // High contrast modern dark aesthetic by default
  });

  // Memory value
  const [memory, setMemory] = useState<number>(() =>
    safeStorageGet<number>(STORAGE_KEYS.MEMORY, 0)
  );

  // History list
  const [history, setHistory] = useState<HistoryItem[]>(() =>
    safeStorageGet<HistoryItem[]>(STORAGE_KEYS.HISTORY, [])
  );

  // Calculator expression & preview
  const [expression, setExpression] = useState<string>('');
  const [resultPreview, setResultPreview] = useState<string>('');
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [ansValue, setAnsValue] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [isSecond, setIsSecond] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [activeKeyId, setActiveKeyId] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Flag to know if the current expression is fresh off an evaluation "="
  const isEvaluatedRef = useRef<boolean>(false);
  const activeKeyTimeoutRef = useRef<number | null>(null);

  // Synchronize theme to document root
  useEffect(() => {
    safeStorageSet(STORAGE_KEYS.THEME, theme);
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  // Synchronize angle mode to storage
  useEffect(() => {
    safeStorageSet(STORAGE_KEYS.ANGLE_MODE, angleMode);
  }, [angleMode]);

  // Synchronize memory to storage
  useEffect(() => {
    safeStorageSet(STORAGE_KEYS.MEMORY, memory);
  }, [memory]);

  // Synchronize history to storage
  useEffect(() => {
    safeStorageSet(STORAGE_KEYS.HISTORY, history);
  }, [history]);

  // Live preview evaluation on expression or angle mode change
  useEffect(() => {
    if (!expression || expression.trim() === '' || isEvaluatedRef.current) {
      setResultPreview('');
      return;
    }

    // Try evaluating
    const res = evaluateExpression(expression, angleMode, ansValue);
    if (res.success && res.result) {
      setResultPreview(res.result);
    } else {
      setResultPreview('');
    }
  }, [expression, angleMode, ansValue]);

  // Flash key press animation
  const triggerKeyFeedback = useCallback((keyId: string) => {
    if (activeKeyTimeoutRef.current) {
      window.clearTimeout(activeKeyTimeoutRef.current);
    }
    setActiveKeyId(keyId);
    activeKeyTimeoutRef.current = window.setTimeout(() => {
      setActiveKeyId(null);
    }, 150);
  }, []);

  // Clear All
  const clearAll = useCallback(() => {
    setExpression('');
    setResultPreview('');
    setError(null);
    isEvaluatedRef.current = false;
  }, []);

  // Clear Entry (CE)
  const clearEntry = useCallback(() => {
    if (error) {
      setError(null);
      return;
    }
    if (isEvaluatedRef.current) {
      clearAll();
      return;
    }
    // Remove the trailing token/number
    setExpression((prev) => {
      if (!prev) return '';
      // Match trailing number or trailing function or trailing operator
      const trimmed = prev.trimEnd();
      const match = trimmed.match(/(\d+\.?\d*|\w+\(|\s*[+\−×÷^]\s*|\S+)$/);
      if (match) {
        return trimmed.slice(0, match.index).trimEnd();
      }
      return '';
    });
  }, [error, clearAll]);

  // Backspace
  const backspace = useCallback(() => {
    if (error) {
      setError(null);
      return;
    }
    if (isEvaluatedRef.current) {
      clearAll();
      return;
    }
    setExpression((prev) => {
      if (!prev || prev.length === 0) return '';
      // Remove trailing multi-character operators or functions if present
      const tokens = [
        'asin(', 'acos(', 'atan(', 'asinh(', 'acosh(', 'atanh(',
        'sinh(', 'cosh(', 'tanh(', 'sin(', 'cos(', 'tan(',
        'sqrt(', 'cbrt(', 'root(', 'log(', 'ln(', 'exp(', 'abs(',
        '10^(', 'e^(', '1/(', ' nPr ', ' nCr ', ' mod ', ' + ', ' − ', ' × ', ' ÷ ',
        'Ans', '(-'
      ];
      for (const token of tokens) {
        if (prev.endsWith(token)) {
          return prev.slice(0, -token.length);
        }
      }
      return prev.slice(0, -1);
    });
  }, [error, clearAll]);

  // Evaluate Expression
  const evaluate = useCallback(() => {
    if (error) {
      setError(null);
      return;
    }
    if (!expression || expression.trim() === '') return;

    const res = evaluateExpression(expression, angleMode, ansValue);
    if (!res.success) {
      setError(res.error || 'Syntax Error');
      setResultPreview('');
      isEvaluatedRef.current = false;
    } else if (res.result) {
      const finalResult = res.result;
      const numVal = res.numericResult ?? parseFloat(finalResult);
      if (Number.isFinite(numVal)) {
        setAnsValue(numVal);
      }

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        expression: expression.trim(),
        result: finalResult,
        timestamp: Date.now(),
        angleMode,
      };

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 49)]);
      setLastResult(finalResult);
      setExpression(finalResult);
      setResultPreview('');
      isEvaluatedRef.current = true;
    }
  }, [expression, angleMode, ansValue, error]);

  // Sign toggle ±
  const toggleSign = useCallback(() => {
    if (error) {
      setError(null);
    }
    setExpression((prev) => {
      if (!prev || prev.trim() === '') {
        return '(-';
      }
      if (isEvaluatedRef.current) {
        isEvaluatedRef.current = false;
        if (prev.startsWith('-')) {
          return prev.slice(1);
        }
        return `(-${prev})`;
      }

      // If expression ends with (-num)
      const negParenMatch = prev.match(/\(-([0-9.]+|pi|e|Ans)\)$/);
      if (negParenMatch) {
        return prev.slice(0, -negParenMatch[0].length) + negParenMatch[1];
      }

      // If expression ends with plain number or constant
      const plainNumMatch = prev.match(/([0-9.]+|pi|e|Ans)$/);
      if (plainNumMatch) {
        return prev.slice(0, -plainNumMatch[0].length) + `(-${plainNumMatch[1]})`;
      }

      // If ends with an operator or open paren
      if (/[+\−×÷^(]\s*$/.test(prev)) {
        return prev + '(-';
      }

      return prev + '(-';
    });
  }, [error]);

  // Memory operations
  const handleMemory = useCallback((actionId: string) => {
    if (error) setError(null);

    if (actionId === 'mc') {
      setMemory(0);
    } else if (actionId === 'mr') {
      // Memory recall: insert memory into expression
      const memStr = memory.toString();
      setExpression((prev) => {
        if (isEvaluatedRef.current) {
          isEvaluatedRef.current = false;
          return memStr;
        }
        return prev + memStr;
      });
    } else if (actionId === 'm-plus' || actionId === 'm-minus') {
      // Determine what value to add/subtract
      let valToApply: number | null = null;
      if (resultPreview && Number.isFinite(parseFloat(resultPreview))) {
        valToApply = parseFloat(resultPreview);
      } else if (expression) {
        const evalRes = evaluateExpression(expression, angleMode, ansValue);
        if (evalRes.success && evalRes.numericResult !== undefined) {
          valToApply = evalRes.numericResult;
        }
      }

      if (valToApply !== null) {
        setMemory((prev) => {
          const updated = actionId === 'm-plus' ? prev + valToApply : prev - valToApply;
          return Math.round(updated * 1e12) / 1e12;
        });
      }
    }
  }, [error, memory, resultPreview, expression, angleMode, ansValue]);

  // Insert key text
  const insertToken = useCallback((val: string) => {
    if (error) {
      setError(null);
    }

    setExpression((prev) => {
      // If previous action was '=', check if starting new expression or continuing
      if (isEvaluatedRef.current) {
        isEvaluatedRef.current = false;
        // If user typed an operator or power: continue with prev result
        if (/^\s*[+\−×÷^%²³]|^\s*mod\s*|^\s*nPr\s*|^\s*nCr\s*/.test(val)) {
          return prev + val;
        }
        // If user typed a number, function, constant: start fresh
        return val;
      }
      return prev + val;
    });
  }, [error]);

  // Main key press handler
  const handleKeyAction = useCallback((keyDef: CalculatorKeyDef) => {
    triggerKeyFeedback(keyDef.id);

    // If 2nd is active and secondary function is available
    const isUsingSecond = isSecond && (keyDef.secondLabel || keyDef.secondInsertValue);
    const action = keyDef.actionType;
    const insertVal = isUsingSecond && keyDef.secondInsertValue ? keyDef.secondInsertValue : keyDef.insertValue;

    switch (action) {
      case 'clear':
        clearAll();
        break;
      case 'clear-entry':
        clearEntry();
        break;
      case 'backspace':
        backspace();
        break;
      case 'eval':
        evaluate();
        break;
      case 'toggle-sign':
        toggleSign();
        break;
      case 'toggle-angle':
        setAngleMode((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'));
        break;
      case 'toggle-second':
        setIsSecond((prev) => !prev);
        break;
      case 'memory':
        handleMemory(keyDef.id);
        break;
      case 'function':
      case 'insert':
        if (insertVal) {
          insertToken(insertVal);
        }
        break;
    }
  }, [
    isSecond,
    triggerKeyFeedback,
    clearAll,
    clearEntry,
    backspace,
    evaluate,
    toggleSign,
    handleMemory,
    insertToken,
  ]);

  // Global Keyboard event handler
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't capture keyboard if user is typing in an input/textarea (e.g. if we add a search or dialog)
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key;

      // Handle Shift toggle
      if (key === 'Shift') {
        setIsSecond((prev) => !prev);
        triggerKeyFeedback('second');
        return;
      }

      // Handle Enter / =
      if (key === 'Enter' || key === '=') {
        e.preventDefault();
        evaluate();
        triggerKeyFeedback('equals');
        return;
      }

      // Handle Backspace
      if (key === 'Backspace') {
        e.preventDefault();
        backspace();
        triggerKeyFeedback('backspace');
        return;
      }

      // Handle Escape
      if (key === 'Escape') {
        e.preventDefault();
        clearAll();
        triggerKeyFeedback('ac');
        return;
      }

      // Find matching key definition from ALL keys
      const allKeys = [...CALCULATOR_KEYS, ...BASIC_KEYS];
      const match = allKeys.find((k) => k.shortcut?.includes(key));

      if (match) {
        e.preventDefault();
        handleKeyAction(match);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [evaluate, backspace, clearAll, handleKeyAction, triggerKeyFeedback]);

  // Copy result to clipboard
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    } catch {
      // Ignore failure
    }
  }, []);

  // History operations
  const recallHistoryExpression = useCallback((item: HistoryItem) => {
    setError(null);
    setExpression(item.expression);
    setAngleMode(item.angleMode);
    isEvaluatedRef.current = false;
    setIsHistoryOpen(false);
  }, []);

  const recallHistoryResult = useCallback((item: HistoryItem) => {
    setError(null);
    setExpression((prev) => {
      if (isEvaluatedRef.current) {
        isEvaluatedRef.current = false;
        return item.result;
      }
      return prev + item.result;
    });
    setIsHistoryOpen(false);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    safeStorageSet(STORAGE_KEYS.HISTORY, []);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return {
    expression,
    setExpression,
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
    clearAll,
    clearEntry,
    backspace,
    evaluate,
    toggleSign,
    copyToClipboard,
    recallHistoryExpression,
    recallHistoryResult,
    clearHistory,
    setAngleMode,
    setIsSecond,
  };
}
