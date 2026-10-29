import { create, all } from 'mathjs';
import type { AngleMode } from '../types/calculator';

// Initialize a mathjs instance
const math = create(all, {});

/**
 * Cleanly handle floating point imprecision for trig degrees
 */
function cleanDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Configure trigonometry functions respecting DEG or RAD
 */
function getTrigScope(angleMode: AngleMode) {
  if (angleMode === 'DEG') {
    return {
      sin: (x: number) => {
        const d = cleanDeg(x);
        if (d === 0 || d === 180) return 0;
        if (d === 30 || d === 150) return 0.5;
        if (d === 90) return 1;
        if (d === 210 || d === 330) return -0.5;
        if (d === 270) return -1;
        const rad = (x * Math.PI) / 180;
        const res = Math.sin(rad);
        return Math.abs(res) < 1e-15 ? 0 : res;
      },
      cos: (x: number) => {
        const d = cleanDeg(x);
        if (d === 90 || d === 270) return 0;
        if (d === 60 || d === 300) return 0.5;
        if (d === 120 || d === 240) return -0.5;
        if (d === 0) return 1;
        if (d === 180) return -1;
        const rad = (x * Math.PI) / 180;
        const res = Math.cos(rad);
        return Math.abs(res) < 1e-15 ? 0 : res;
      },
      tan: (x: number) => {
        const d = cleanDeg(x);
        if (d === 90 || d === 270) {
          throw new Error('Math Error: Tan undefined at 90/270 deg');
        }
        if (d === 0 || d === 180) return 0;
        if (d === 45 || d === 225) return 1;
        if (d === 135 || d === 315) return -1;
        const rad = (x * Math.PI) / 180;
        const res = Math.tan(rad);
        return Math.abs(res) < 1e-15 ? 0 : res;
      },
      asin: (x: number) => {
        if (x < -1 || x > 1) throw new Error('Math Error: asin domain [-1, 1]');
        if (x === 0.5) return 30;
        if (x === -0.5) return -30;
        if (x === 1) return 90;
        if (x === -1) return -90;
        if (x === 0) return 0;
        return (Math.asin(x) * 180) / Math.PI;
      },
      acos: (x: number) => {
        if (x < -1 || x > 1) throw new Error('Math Error: acos domain [-1, 1]');
        if (x === 0.5) return 60;
        if (x === -0.5) return 120;
        if (x === 1) return 0;
        if (x === -1) return 180;
        if (x === 0) return 90;
        return (Math.acos(x) * 180) / Math.PI;
      },
      atan: (x: number) => {
        if (x === 1) return 45;
        if (x === -1) return -45;
        if (x === 0) return 0;
        return (Math.atan(x) * 180) / Math.PI;
      },
      sinh: (x: number) => Math.sinh(x),
      cosh: (x: number) => Math.cosh(x),
      tanh: (x: number) => Math.tanh(x),
      asinh: (x: number) => Math.asinh(x),
      acosh: (x: number) => {
        if (x < 1) throw new Error('Math Error');
        return Math.acosh(x);
      },
      atanh: (x: number) => {
        if (x <= -1 || x >= 1) throw new Error('Math Error');
        return Math.atanh(x);
      },
    };
  }

  // RAD mode
  return {
    sin: (x: number) => {
      const res = Math.sin(x);
      return Math.abs(res) < 1e-15 ? 0 : res;
    },
    cos: (x: number) => {
      // In RAD, cos(pi) must be exact -1
      if (Math.abs(x - Math.PI) < 1e-15) return -1;
      if (Math.abs(x - 2 * Math.PI) < 1e-15 || Math.abs(x) < 1e-15) return 1;
      const res = Math.cos(x);
      return Math.abs(res) < 1e-15 ? 0 : res;
    },
    tan: (x: number) => {
      const res = Math.tan(x);
      return Math.abs(res) < 1e-15 ? 0 : res;
    },
    asin: (x: number) => {
      if (x < -1 || x > 1) throw new Error('Math Error');
      return Math.asin(x);
    },
    acos: (x: number) => {
      if (x < -1 || x > 1) throw new Error('Math Error');
      return Math.acos(x);
    },
    atan: (x: number) => Math.atan(x),
    sinh: (x: number) => Math.sinh(x),
    cosh: (x: number) => Math.cosh(x),
    tanh: (x: number) => Math.tanh(x),
    asinh: (x: number) => Math.asinh(x),
    acosh: (x: number) => {
      if (x < 1) throw new Error('Math Error');
      return Math.acosh(x);
    },
    atanh: (x: number) => {
      if (x <= -1 || x >= 1) throw new Error('Math Error');
      return Math.atanh(x);
    },
  };
}

/**
 * Preprocess user display expression into mathjs parseable syntax
 */
export function preprocessExpression(rawExpr: string, ansValue: number = 0): string {
  let expr = rawExpr.trim();
  if (!expr) return '';

  // Replace Ans with numeric representation
  expr = expr.replace(/\bAns\b/g, `(${ansValue})`);

  // Replace superscripts
  expr = expr.replace(/²/g, '^2').replace(/³/g, '^3');

  // Replace display symbols
  expr = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'pi')
    .replace(/√\(/g, 'sqrt(')
    .replace(/∛\(/g, 'cbrt(');

  // If lone √ or ∛ followed by number or constant without parenthesis
  expr = expr.replace(/√([0-9.]+|pi|\be\b)/g, 'sqrt($1)');
  expr = expr.replace(/∛([0-9.]+|pi|\be\b)/g, 'cbrt($1)');

  // Convert infix nPr: e.g. 5 nPr 2 -> nPr(5, 2)
  expr = expr.replace(/([0-9.]+|\([^\)]+\))\s*nPr\s*([0-9.]+|\([^\)]+\))/g, 'nPr($1, $2)');

  // Convert infix nCr: e.g. 5 nCr 2 -> nCr(5, 2)
  expr = expr.replace(/([0-9.]+|\([^\)]+\))\s*nCr\s*([0-9.]+|\([^\)]+\))/g, 'nCr($1, $2)');

  // Convert infix mod: e.g. 10 mod 3 -> mod(10, 3)
  expr = expr.replace(/([0-9.]+|\([^\)]+\))\s*mod\s*([0-9.]+|\([^\)]+\))/g, 'mod($1, $2)');

  // Handle percentage sign: e.g. 50% = (50 * 0.01)
  expr = expr.replace(/(\d+(?:\.\d+)?)%/g, '($1 * 0.01)');

  // Insert implicit multiplication:
  // 1) number/pi/e immediately preceding '('
  expr = expr.replace(/(\d+|pi|\be\b)\s*\(/g, '$1 * (');

  // 2) ')' immediately preceding '(' or number or pi or e
  expr = expr.replace(/\)\s*\(/g, ') * (');
  expr = expr.replace(/\)\s*(\d+|pi|\be\b)/g, ') * $1');

  // 3) number/pi/e immediately preceding named functions
  const funcList = 'sin|cos|tan|asin|acos|atan|sinh|cosh|tanh|asinh|acosh|atanh|sqrt|cbrt|log|ln|exp|abs|fact|root|nPr|nCr|mod';
  const funcRegex = new RegExp(`(\\d+|pi|\\be\\b)\\s*(${funcList})\\(`, 'g');
  expr = expr.replace(funcRegex, '$1 * $2(');

  // 4) ')' immediately preceding named function
  const funcRegex2 = new RegExp(`\\)\\s*(${funcList})\\(`, 'g');
  expr = expr.replace(funcRegex2, ') * $1(');

  // 5) number followed by pi or e: 2pi -> 2 * pi, 2e -> 2 * e
  expr = expr.replace(/(\d+)\s*(pi|\be\b)/g, '$1 * $2');

  // Auto-close open parentheses
  let openCount = 0;
  for (const ch of expr) {
    if (ch === '(') openCount++;
    if (ch === ')') openCount--;
  }
  if (openCount > 0) {
    expr += ')'.repeat(openCount);
  }

  return expr;
}

/**
 * Format calculation result
 */
export function formatResult(value: unknown): string {
  if (value === null || value === undefined) return '';

  if (typeof value === 'boolean') return value ? '1' : '0';

  if (typeof value === 'object' && value !== null && 'entries' in value) {
    const entries = (value as { entries: unknown[] }).entries;
    return entries.map(formatResult).join(', ');
  }

  // Check for complex numbers
  if (typeof value === 'object' && value !== null && 're' in value && 'im' in value) {
    const complex = value as { re: number; im: number };
    if (Math.abs(complex.im) < 1e-14) {
      return formatNumeric(complex.re);
    }
    const reStr = formatNumeric(complex.re);
    const imStr = formatNumeric(Math.abs(complex.im));
    const sign = complex.im >= 0 ? '+' : '−';
    return `${reStr} ${sign} ${imStr}i`;
  }

  const num = Number(value);
  if (!Number.isFinite(num)) {
    return 'Math Error';
  }

  return formatNumeric(num);
}

function formatNumeric(num: number): string {
  if (Object.is(num, -0)) num = 0;
  if (Math.abs(num) < 1e-14 && Math.abs(num) > 0) return '0';

  // Fix float precision issues (e.g. 0.1 + 0.2 = 0.30000000000000004)
  const roundedInt = Math.round(num);
  if (Math.abs(num - roundedInt) < 1e-12) {
    num = roundedInt;
  }

  const abs = Math.abs(num);
  if (abs === 0) return '0';

  // Exponential notation for very large or very small numbers
  if (abs >= 1e12 || abs < 1e-6) {
    const expStr = num.toExponential(8);
    const [mantissa, exponent] = expStr.split('e');
    const cleanMantissa = parseFloat(mantissa).toString();
    const formattedExp = exponent.replace('+', '');
    return `${cleanMantissa}e${formattedExp}`;
  }

  // Normal decimal with up to 12 significant digits precision
  let formatted = parseFloat(num.toPrecision(12)).toString();

  if (formatted.includes('e')) {
    return formatted;
  }

  if (formatted.includes('.')) {
    formatted = formatted.replace(/\.?0+$/, '');
  }

  return formatted;
}

/**
 * Custom math scope functions
 */
function createScope(angleMode: AngleMode, ansValue: number) {
  const trig = getTrigScope(angleMode);

  return {
    ...trig,
    Ans: ansValue,
    pi: Math.PI,
    e: Math.E,
    log: (x: number) => {
      if (x <= 0) throw new Error('Math Error: log domain > 0');
      return Math.log10(x);
    },
    log10: (x: number) => {
      if (x <= 0) throw new Error('Math Error: log domain > 0');
      return Math.log10(x);
    },
    ln: (x: number) => {
      if (x <= 0) throw new Error('Math Error: ln domain > 0');
      return Math.log(x);
    },
    exp: (x: number) => Math.exp(x),
    abs: (x: number) => Math.abs(x),
    sqrt: (x: number) => {
      if (x < 0) throw new Error('Math Error: Square root of negative number');
      return Math.sqrt(x);
    },
    cbrt: (x: number) => Math.cbrt(x),
    fact: (n: number) => {
      if (n < 0 || !Number.isInteger(n)) throw new Error('Math Error: Factorial requires non-negative integer');
      if (n > 170) throw new Error('Math Error: Overflow');
      let r = 1;
      for (let i = 2; i <= n; i++) r *= i;
      return r;
    },
    nPr: (n: number, r: number) => {
      if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) {
        throw new Error('Math Error: Invalid nPr arguments');
      }
      let result = 1;
      for (let i = n - r + 1; i <= n; i++) {
        result *= i;
      }
      return result;
    },
    nCr: (n: number, r: number) => {
      if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) {
        throw new Error('Math Error: Invalid nCr arguments');
      }
      const k = Math.min(r, n - r);
      let result = 1;
      for (let i = 1; i <= k; i++) {
        result = (result * (n - i + 1)) / i;
      }
      return Math.round(result);
    },
    mod: (a: number, b: number) => {
      if (b === 0) throw new Error('Math Error: Modulo by zero');
      return a % b;
    },
    root: (x: number, y: number) => {
      if (y === 0) throw new Error('Math Error: 0th root undefined');
      if (x < 0 && y % 2 === 0) throw new Error('Math Error: Even root of negative');
      return Math.sign(x) * Math.pow(Math.abs(x), 1 / y);
    },
  };
}

export interface EvalResult {
  success: boolean;
  result?: string;
  numericResult?: number;
  error?: string;
}

/**
 * Evaluate a mathematical expression string
 */
export function evaluateExpression(
  expression: string,
  angleMode: AngleMode = 'DEG',
  ansValue: number = 0
): EvalResult {
  const preprocessed = preprocessExpression(expression, ansValue);
  if (!preprocessed) {
    return { success: true, result: '', numericResult: 0 };
  }

  try {
    const scope = createScope(angleMode, ansValue);
    // math.evaluate accepts scope directly and evaluates with customized trig and log
    const evaluated = math.evaluate(preprocessed, scope);

    // Check for division by zero or NaN / Infinity
    if (typeof evaluated === 'number') {
      if (!Number.isFinite(evaluated)) {
        return { success: false, error: 'Math Error' };
      }
    }

    const formatted = formatResult(evaluated);
    if (formatted === 'Math Error') {
      return { success: false, error: 'Math Error' };
    }

    const numericVal = typeof evaluated === 'number' ? evaluated : parseFloat(formatted);

    return {
      success: true,
      result: formatted,
      numericResult: Number.isFinite(numericVal) ? numericVal : undefined,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (
      errorMsg.includes('Math Error') ||
      errorMsg.includes('divide by zero') ||
      errorMsg.includes('Infinity') ||
      errorMsg.includes('Overflow')
    ) {
      return { success: false, error: 'Math Error' };
    }
    if (
      errorMsg.includes('SyntaxError') ||
      errorMsg.includes('Unexpected') ||
      errorMsg.includes('Parenthesis') ||
      errorMsg.includes('Value expected')
    ) {
      return { success: false, error: 'Syntax Error' };
    }
    return { success: false, error: 'Syntax Error' };
  }
}
