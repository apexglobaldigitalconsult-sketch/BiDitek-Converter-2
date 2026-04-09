// Math parsing and evaluation logic
export function evaluateExpression(expr: string, useRadians: boolean = true): number {
  if (!expr) return 0;
  
  // Replace constants
  let parsed = expr
    .replace(/π/g, 'Math.PI')
    .replace(/e/g, 'Math.E')
    .replace(/Ans/g, '0'); // Ans handling needs context, handled externally if possible

  // Replace functions
  const functions = [
    'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh',
    'log10', 'log2', 'log', 'ln', 'sqrt', 'cbrt', 'abs'
  ];
  
  // Custom math functions
  const mathContext: any = {
    Math,
    sin: (x: number) => useRadians ? Math.sin(x) : Math.sin(x * Math.PI / 180),
    cos: (x: number) => useRadians ? Math.cos(x) : Math.cos(x * Math.PI / 180),
    tan: (x: number) => useRadians ? Math.tan(x) : Math.tan(x * Math.PI / 180),
    asin: (x: number) => useRadians ? Math.asin(x) : Math.asin(x) * 180 / Math.PI,
    acos: (x: number) => useRadians ? Math.acos(x) : Math.acos(x) * 180 / Math.PI,
    atan: (x: number) => useRadians ? Math.atan(x) : Math.atan(x) * 180 / Math.PI,
    sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
    log: Math.log10, ln: Math.log, log2: Math.log2,
    sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs,
    fact: (n: number) => {
      if (n < 0 || !Number.isInteger(n)) return NaN;
      let res = 1;
      for (let i = 2; i <= n; i++) res *= i;
      return res;
    }
  };

  parsed = parsed
    .replace(/sin⁻¹/g, 'asin')
    .replace(/cos⁻¹/g, 'acos')
    .replace(/tan⁻¹/g, 'atan')
    .replace(/ln/g, 'ln')
    .replace(/log₂/g, 'log2')
    .replace(/log/g, 'log')
    .replace(/√/g, 'sqrt')
    .replace(/∛/g, 'cbrt')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/\^/g, '**')
    .replace(/(\d+)!/g, 'fact($1)');

  try {
    // Basic safety check
    if (/[^0-9a-zA-Z.()+\-*/%_ ]/.test(parsed.replace(/Math\./g, ''))) {
      throw new Error("Invalid characters");
    }
    
    // Create a safe evaluation function
    const keys = Object.keys(mathContext);
    const values = keys.map(k => mathContext[k]);
    const func = new Function(...keys, `return ${parsed}`);
    const result = func(...values);
    
    if (!isFinite(result) || isNaN(result)) {
      throw new Error("undefined");
    }
    return result;
  } catch (e) {
    throw new Error("undefined");
  }
}

export function parseDataset(input: string): number[] {
  const values = input.split(/[\s,]+/).filter(v => v.trim() !== '');
  const parsed = values.map(v => Number(v));
  if (parsed.some(isNaN)) {
    throw new Error("Invalid dataset");
  }
  return parsed;
}

export function calculateStats(data: number[]) {
  if (data.length === 0) return null;
  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;
  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  
  const median = n % 2 === 0 
    ? (sorted[n/2 - 1] + sorted[n/2]) / 2 
    : sorted[Math.floor(n/2)];
    
  const modes: Record<number, number> = {};
  let maxFreq = 0;
  sorted.forEach(v => {
    modes[v] = (modes[v] || 0) + 1;
    if (modes[v] > maxFreq) maxFreq = modes[v];
  });
  const modeValues = Object.keys(modes).filter(k => modes[Number(k)] === maxFreq).map(Number);
  const modeStr = modeValues.length === n ? "No mode" : modeValues.join(", ");

  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;

  const sqDiffs = sorted.map(v => Math.pow(v - mean, 2));
  const varPop = sqDiffs.reduce((a, b) => a + b, 0) / n;
  const varSamp = n > 1 ? sqDiffs.reduce((a, b) => a + b, 0) / (n - 1) : 0;
  
  const stdPop = Math.sqrt(varPop);
  const stdSamp = Math.sqrt(varSamp);

  const q1 = sorted[Math.floor(n * 0.25)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const iqr = q3 - q1;

  // Skewness and Kurtosis
  let skewness = 0;
  let kurtosis = 0;
  if (stdPop > 0) {
    skewness = sorted.reduce((a, b) => a + Math.pow((b - mean) / stdPop, 3), 0) / n;
    kurtosis = sorted.reduce((a, b) => a + Math.pow((b - mean) / stdPop, 4), 0) / n - 3;
  }

  return {
    n, sum, mean, median, modeStr, range, min, max,
    varPop, varSamp, stdPop, stdSamp, q1, q3, iqr, skewness, kurtosis, sorted
  };
}
