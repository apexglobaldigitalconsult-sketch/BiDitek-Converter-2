import React, { useState } from 'react';
import { Calculator, LayoutGrid, Minimize2, ArrowRightLeft, Scale, ChevronDown, ChevronUp } from 'lucide-react';
import { Fraction, MixedFraction, gcd, lcm, simplify, add, subtract, multiply, divide, toMixed, fromMixed, decimalToFraction, fractionToDecimal } from './utils';

type Mode = 'arithmetic' | 'mixed' | 'simplify' | 'conversion' | 'compare';

export default function FractionCalculator() {
  const [mode, setMode] = useState<Mode>('arithmetic');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Fraction Calculator</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Comprehensive tool for fraction arithmetic, simplification, and conversion.</p>
      </div>

      <div className="flex overflow-x-auto bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-outline-variant/50 dark:border-slate-700 mb-6 hide-scrollbar">
        {[
          { id: 'arithmetic', label: 'Arithmetic', icon: Calculator },
          { id: 'mixed', label: 'Mixed Numbers', icon: LayoutGrid },
          { id: 'simplify', label: 'Simplify', icon: Minimize2 },
          { id: 'conversion', label: 'Conversion', icon: ArrowRightLeft },
          { id: 'compare', label: 'Compare', icon: Scale },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as Mode)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-wider rounded-[1px] whitespace-nowrap transition-all ${
                mode === tab.id
                  ? 'bg-primary text-background shadow-md'
                  : 'bg-surface-container text-primary/50 hover:text-secondary hover:bg-secondary/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-outline-variant/50 dark:border-slate-700">
        {mode === 'arithmetic' && <ArithmeticTab />}
        {mode === 'mixed' && <MixedNumbersTab />}
        {mode === 'simplify' && <SimplifyTab />}
        {mode === 'conversion' && <ConversionTab />}
        {mode === 'compare' && <CompareTab />}
      </div>
    </div>
  );
}

// --- Shared Components ---

function FractionInput({ num, den, whole, onNumChange, onDenChange, onWholeChange, showWhole = false, label }: any) {
  return (
    <div className="flex flex-col items-center">
      {label && <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{label}</span>}
      <div className="flex items-center gap-2">
        {showWhole && (
          <input
            type="number"
            value={whole}
            onChange={e => onWholeChange(e.target.value)}
            className="w-16 h-16 text-center text-xl font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            placeholder="0"
          />
        )}
        <div className="flex flex-col items-center gap-1">
          <input
            type="number"
            value={num}
            onChange={e => onNumChange(e.target.value)}
            className="w-16 p-2 text-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            placeholder="Num"
          />
          <div className="w-full h-px bg-slate-400 dark:bg-slate-500"></div>
          <input
            type="number"
            value={den}
            onChange={e => onDenChange(e.target.value)}
            className="w-16 p-2 text-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            placeholder="Den"
          />
        </div>
      </div>
    </div>
  );
}

function DisplayFraction({ f, size = 'normal' }: { f: Fraction, size?: 'normal'|'large' }) {
  const isNeg = f.num * f.den < 0;
  const absNum = Math.abs(f.num);
  const absDen = Math.abs(f.den);
  const textClass = size === 'large' ? 'text-2xl' : 'text-lg';
  
  if (absDen === 1) {
    return <span className={`${textClass} font-bold text-slate-900 dark:text-white`}>{isNeg ? '-' : ''}{absNum}</span>;
  }
  
  return (
    <div className={`flex items-center gap-1 ${textClass} font-bold text-slate-900 dark:text-white`}>
      {isNeg && <span>-</span>}
      <div className="flex flex-col items-center">
        <span>{absNum}</span>
        <div className="w-full h-0.5 bg-current my-0.5"></div>
        <span>{absDen}</span>
      </div>
    </div>
  );
}

function DisplayMixed({ m, size = 'normal' }: { m: MixedFraction, size?: 'normal'|'large' }) {
  const textClass = size === 'large' ? 'text-2xl' : 'text-lg';
  if (m.num === 0) return <span className={`${textClass} font-bold text-slate-900 dark:text-white`}>{m.whole}</span>;
  if (m.whole === 0) return <DisplayFraction f={{num: m.whole < 0 || Object.is(m.whole, -0) ? -m.num : m.num, den: m.den}} size={size} />;
  
  return (
    <div className={`flex items-center gap-2 ${textClass} font-bold text-slate-900 dark:text-white`}>
      <span>{m.whole}</span>
      <div className="flex flex-col items-center text-[0.8em]">
        <span>{m.num}</span>
        <div className="w-full h-0.5 bg-current my-0.5"></div>
        <span>{m.den}</span>
      </div>
    </div>
  );
}

function VisualDiagram({ num, den, color }: { num: number, den: number, color: string }) {
  if (den === 0) return null;
  const absNum = Math.abs(num);
  const absDen = Math.abs(den);
  const isNegative = num * den < 0;

  if (absDen <= 12) {
    const circles = Math.max(1, Math.ceil(absNum / absDen));
    return (
      <div className="flex gap-2 flex-wrap items-center">
        {isNegative && <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">-</span>}
        {Array.from({ length: circles }).map((_, cIdx) => {
          const segmentsToFill = Math.min(absDen, absNum - cIdx * absDen);
          return (
            <svg key={cIdx} viewBox="0 0 100 100" className="w-16 h-16">
              <circle cx="50" cy="50" r="48" fill="transparent" stroke="#cbd5e1" strokeWidth="2" />
              {absDen === 1 ? (
                <circle cx="50" cy="50" r="48" fill={segmentsToFill > 0 ? color : "transparent"} />
              ) : (
                Array.from({ length: absDen }).map((_, i) => {
                  const startAngle = (i * 360) / absDen - 90;
                  const endAngle = ((i + 1) * 360) / absDen - 90;
                  const x1 = 50 + 48 * Math.cos((startAngle * Math.PI) / 180);
                  const y1 = 50 + 48 * Math.sin((startAngle * Math.PI) / 180);
                  const x2 = 50 + 48 * Math.cos((endAngle * Math.PI) / 180);
                  const y2 = 50 + 48 * Math.sin((endAngle * Math.PI) / 180);
                  const largeArc = 360 / absDen > 180 ? 1 : 0;
                  const isFilled = i < segmentsToFill;
                  return (
                    <path
                      key={i}
                      d={`M 50 50 L ${x1} ${y1} A 48 48 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={isFilled ? color : "transparent"}
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />
                  );
                })
              )}
            </svg>
          );
        })}
      </div>
    );
  } else {
    const bars = Math.max(1, Math.ceil(absNum / absDen));
    return (
      <div className="flex flex-col gap-2 items-start">
        {isNegative && <span className="text-xl font-bold text-slate-700 dark:text-slate-300">-</span>}
        {Array.from({ length: bars }).map((_, bIdx) => {
          const segmentsToFill = Math.min(absDen, absNum - bIdx * absDen);
          return (
            <div key={bIdx} className="flex h-6 w-full min-w-[120px] max-w-[200px] border border-slate-300 rounded overflow-hidden">
              {Array.from({ length: absDen }).map((_, i) => (
                <div 
                  key={i} 
                  className="flex-1 border-r border-slate-300 last:border-r-0"
                  style={{ backgroundColor: i < segmentsToFill ? color : 'transparent' }}
                />
              ))}
            </div>
          );
        })}
      </div>
    );
  }
}

function SummaryRow({ f }: { f: Fraction }) {
  const simplified = simplify(f);
  const mixed = toMixed(f);
  const dec = fractionToDecimal(f);
  const decVal = f.num / f.den;

  return (
    <div className="mt-6 border-t border-outline-variant/50 dark:border-slate-700 pt-6">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Equivalent Forms</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
          <div className="text-xs text-slate-500 mb-1">Fraction</div>
          <div className="font-medium text-slate-900 dark:text-white">{f.num}/{f.den}</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
          <div className="text-xs text-slate-500 mb-1">Simplified</div>
          <div className="font-medium text-slate-900 dark:text-white">{simplified.num}/{simplified.den}</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
          <div className="text-xs text-slate-500 mb-1">Mixed Number</div>
          <div className="font-medium text-slate-900 dark:text-white">
            {mixed.whole !== 0 ? `${mixed.whole} ` : ''}{mixed.num !== 0 ? `${mixed.num}/${mixed.den}` : (mixed.whole === 0 ? '0' : '')}
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
          <div className="text-xs text-slate-500 mb-1">Decimal</div>
          <div className="font-medium text-slate-900 dark:text-white">{dec.decimal}</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
          <div className="text-xs text-slate-500 mb-1">Percentage</div>
          <div className="font-medium text-slate-900 dark:text-white">{(decVal * 100).toFixed(2)}%</div>
        </div>
      </div>
    </div>
  );
}

// --- Tabs ---

function ArithmeticTab() {
  const [n1, setN1] = useState(''); const [d1, setD1] = useState('');
  const [n2, setN2] = useState(''); const [d2, setD2] = useState('');
  const [op, setOp] = useState<'+'|'-'|'*'|'/'>('+');
  
  const [result, setResult] = useState<{ raw: Fraction, simp: Fraction, steps: React.ReactNode[] } | null>(null);
  const [error, setError] = useState('');
  const [showSteps, setShowSteps] = useState(true);
  const [showDiagram, setShowDiagram] = useState(true);

  const calculate = () => {
    setError(''); setResult(null);
    const num1 = parseInt(n1), den1 = parseInt(d1);
    const num2 = parseInt(n2), den2 = parseInt(d2);

    if (isNaN(num1) || isNaN(den1) || isNaN(num2) || isNaN(den2)) {
      setError("Please enter valid integers for all fields."); return;
    }
    if (den1 === 0 || den2 === 0) {
      setError("Denominator cannot be zero."); return;
    }

    const f1 = { num: num1, den: den1 };
    const f2 = { num: num2, den: den2 };
    let res: Fraction;
    let steps: React.ReactNode[] = [];

    try {
      if (op === '+') {
        const commonDen = lcm(f1.den, f2.den);
        const mult1 = commonDen / f1.den;
        const mult2 = commonDen / f2.den;
        const newNum1 = f1.num * mult1;
        const newNum2 = f2.num * mult2;
        const sumNum = newNum1 + newNum2;
        res = { num: sumNum, den: commonDen };
        
        steps.push(<span>Find the LCM of {f1.den} and {f2.den} → LCM = <strong>{commonDen}</strong></span>);
        steps.push(<span>Convert first fraction: ({f1.num} × {mult1}) / {commonDen} = <strong>{newNum1}/{commonDen}</strong></span>);
        steps.push(<span>Convert second fraction: ({f2.num} × {mult2}) / {commonDen} = <strong>{newNum2}/{commonDen}</strong></span>);
        steps.push(<span>Add numerators: {newNum1} + {newNum2} = <strong>{sumNum}</strong></span>);
        steps.push(<span>Result: <strong>{sumNum}/{commonDen}</strong></span>);
      } else if (op === '-') {
        const commonDen = lcm(f1.den, f2.den);
        const mult1 = commonDen / f1.den;
        const mult2 = commonDen / f2.den;
        const newNum1 = f1.num * mult1;
        const newNum2 = f2.num * mult2;
        const diffNum = newNum1 - newNum2;
        res = { num: diffNum, den: commonDen };
        
        steps.push(<span>Find the LCM of {f1.den} and {f2.den} → LCM = <strong>{commonDen}</strong></span>);
        steps.push(<span>Convert first fraction: ({f1.num} × {mult1}) / {commonDen} = <strong>{newNum1}/{commonDen}</strong></span>);
        steps.push(<span>Convert second fraction: ({f2.num} × {mult2}) / {commonDen} = <strong>{newNum2}/{commonDen}</strong></span>);
        steps.push(<span>Subtract numerators: {newNum1} - {newNum2} = <strong>{diffNum}</strong></span>);
        steps.push(<span>Result: <strong>{diffNum}/{commonDen}</strong></span>);
      } else if (op === '*') {
        res = { num: f1.num * f2.num, den: f1.den * f2.den };
        steps.push(<span>Multiply numerators: {f1.num} × {f2.num} = <strong>{res.num}</strong></span>);
        steps.push(<span>Multiply denominators: {f1.den} × {f2.den} = <strong>{res.den}</strong></span>);
        steps.push(<span>Result: <strong>{res.num}/{res.den}</strong></span>);
      } else {
        if (f2.num === 0) throw new Error("Cannot divide by zero.");
        res = { num: f1.num * f2.den, den: f1.den * f2.num };
        steps.push(<span>To divide, multiply by the reciprocal of the second fraction.</span>);
        steps.push(<span>Reciprocal of {f2.num}/{f2.den} is <strong>{f2.den}/{f2.num}</strong></span>);
        steps.push(<span>Multiply numerators: {f1.num} × {f2.den} = <strong>{res.num}</strong></span>);
        steps.push(<span>Multiply denominators: {f1.den} × {f2.num} = <strong>{res.den}</strong></span>);
        steps.push(<span>Result: <strong>{res.num}/{res.den}</strong></span>);
      }

      const simp = simplify(res);
      const divisor = gcd(res.num, res.den);
      if (divisor !== 1 || res.den < 0) {
        steps.push(<span>Find GCD of {Math.abs(res.num)} and {Math.abs(res.den)} = <strong>{divisor}</strong></span>);
        steps.push(<span>Simplify: ({res.num} ÷ {divisor}) / ({res.den} ÷ {divisor}) = <strong>{simp.num}/{simp.den}</strong></span>);
      } else {
        steps.push(<span>Check if {res.num}/{res.den} is in simplest form: GCD({Math.abs(res.num)}, {Math.abs(res.den)}) = 1 ✓ Already simplified</span>);
      }

      setResult({ raw: res, simp, steps });
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        <FractionInput label="Fraction A" num={n1} den={d1} onNumChange={setN1} onDenChange={setD1} />
        
        <div className="flex flex-row md:flex-col gap-2">
          {['+', '-', '*', '/'].map(o => (
            <button key={o} onClick={() => setOp(o as any)} className={`w-10 h-10 rounded-lg font-bold text-lg transition-colors ${op === o ? 'bg-indigo-600 dark:bg-secondary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
              {o === '*' ? '×' : o === '/' ? '÷' : o}
            </button>
          ))}
        </div>

        <FractionInput label="Fraction B" num={n2} den={d2} onNumChange={setN2} onDenChange={setD2} />
      </div>

      <div className="flex justify-center">
        <button onClick={calculate} className="px-8 py-3 bg-indigo-600 dark:bg-secondary text-white font-medium rounded-xl hover:bg-indigo-700 dark:hover:bg-[#ff7a1a] transition-colors shadow-sm">
          Calculate
        </button>
      </div>

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center">{error}</div>}

      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-outline-variant/50 dark:border-slate-700 flex flex-col items-center">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Result</h2>
            <div className="flex items-center gap-6">
              <DisplayFraction f={result.simp} size="large" />
              {toMixed(result.simp).whole !== 0 && (
                <>
                  <span className="text-slate-400 font-medium">or</span>
                  <DisplayMixed m={toMixed(result.simp)} size="large" />
                </>
              )}
            </div>
          </div>

          <div className="border border-outline-variant/50 dark:border-slate-700 rounded-xl overflow-hidden">
            <button onClick={() => setShowSteps(!showSteps)} className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="font-semibold text-slate-900 dark:text-white">Step-by-Step Solution</span>
              {showSteps ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
            </button>
            {showSteps && (
              <div className="p-6 bg-white dark:bg-slate-900">
                <ol className="list-decimal list-inside space-y-3 text-slate-700 dark:text-slate-300">
                  {result.steps.map((step, i) => <li key={i} className="pl-2">{step}</li>)}
                </ol>
              </div>
            )}
          </div>

          <div className="border border-outline-variant/50 dark:border-slate-700 rounded-xl overflow-hidden">
            <button onClick={() => setShowDiagram(!showDiagram)} className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="font-semibold text-slate-900 dark:text-white">Visual Diagram</span>
              {showDiagram ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
            </button>
            {showDiagram && (
              <div className="p-6 bg-white dark:bg-slate-900 flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="flex flex-col items-center gap-3">
                  <VisualDiagram num={parseInt(n1)} den={parseInt(d1)} color="#3b82f6" />
                  <span className="text-sm font-medium text-slate-500">Fraction A</span>
                </div>
                <div className="text-2xl font-bold text-slate-400">{op === '*' ? '×' : op === '/' ? '÷' : op}</div>
                <div className="flex flex-col items-center gap-3">
                  <VisualDiagram num={parseInt(n2)} den={parseInt(d2)} color="#ef4444" />
                  <span className="text-sm font-medium text-slate-500">Fraction B</span>
                </div>
                <div className="text-2xl font-bold text-slate-400">=</div>
                <div className="flex flex-col items-center gap-3">
                  <VisualDiagram num={result.simp.num} den={result.simp.den} color="#10b981" />
                  <span className="text-sm font-medium text-slate-500">Result</span>
                </div>
              </div>
            )}
          </div>

          <SummaryRow f={result.simp} />
        </div>
      )}
    </div>
  );
}

function MixedNumbersTab() {
  const [w1, setW1] = useState(''); const [n1, setN1] = useState(''); const [d1, setD1] = useState('');
  const [w2, setW2] = useState(''); const [n2, setN2] = useState(''); const [d2, setD2] = useState('');
  const [op, setOp] = useState<'+'|'-'|'*'|'/'>('+');
  
  const [result, setResult] = useState<{ raw: Fraction, simp: Fraction, steps: React.ReactNode[] } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError(''); setResult(null);
    const whole1 = parseInt(w1 || '0'), num1 = parseInt(n1 || '0'), den1 = parseInt(d1);
    const whole2 = parseInt(w2 || '0'), num2 = parseInt(n2 || '0'), den2 = parseInt(d2);

    if (isNaN(den1) || isNaN(den2)) { setError("Denominators are required."); return; }
    if (den1 === 0 || den2 === 0) { setError("Denominator cannot be zero."); return; }

    const m1: MixedFraction = { whole: whole1, num: num1, den: den1 };
    const m2: MixedFraction = { whole: whole2, num: num2, den: den2 };
    const f1 = fromMixed(m1);
    const f2 = fromMixed(m2);
    
    let steps: React.ReactNode[] = [];
    steps.push(<span>Convert Mixed Number A to improper fraction: (|{m1.whole}| × {m1.den} + {m1.num}) / {m1.den} = <strong>{f1.num}/{f1.den}</strong></span>);
    steps.push(<span>Convert Mixed Number B to improper fraction: (|{m2.whole}| × {m2.den} + {m2.num}) / {m2.den} = <strong>{f2.num}/{f2.den}</strong></span>);

    let res: Fraction;
    try {
      if (op === '+') {
        res = add(f1, f2);
        steps.push(<span>Add improper fractions: {f1.num}/{f1.den} + {f2.num}/{f2.den} = <strong>{res.num}/{res.den}</strong></span>);
      } else if (op === '-') {
        res = subtract(f1, f2);
        steps.push(<span>Subtract improper fractions: {f1.num}/{f1.den} - {f2.num}/{f2.den} = <strong>{res.num}/{res.den}</strong></span>);
      } else if (op === '*') {
        res = multiply(f1, f2);
        steps.push(<span>Multiply improper fractions: {f1.num}/{f1.den} × {f2.num}/{f2.den} = <strong>{res.num}/{res.den}</strong></span>);
      } else {
        res = divide(f1, f2);
        steps.push(<span>Divide improper fractions: {f1.num}/{f1.den} ÷ {f2.num}/{f2.den} = <strong>{res.num}/{res.den}</strong></span>);
      }
      
      const simp = simplify(res);
      if (res.num !== simp.num || res.den !== simp.den) {
        steps.push(<span>Simplify result: <strong>{simp.num}/{simp.den}</strong></span>);
      }
      
      const resMixed = toMixed(simp);
      if (resMixed.whole !== 0 && resMixed.num !== 0) {
        steps.push(<span>Convert back to mixed number: <strong>{resMixed.whole} {resMixed.num}/{resMixed.den}</strong></span>);
      }

      setResult({ raw: res, simp, steps });
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        <FractionInput label="Mixed Number A" whole={w1} num={n1} den={d1} onWholeChange={setW1} onNumChange={setN1} onDenChange={setD1} showWhole />
        
        <div className="flex flex-row md:flex-col gap-2">
          {['+', '-', '*', '/'].map(o => (
            <button key={o} onClick={() => setOp(o as any)} className={`w-10 h-10 rounded-lg font-bold text-lg transition-colors ${op === o ? 'bg-indigo-600 dark:bg-secondary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
              {o === '*' ? '×' : o === '/' ? '÷' : o}
            </button>
          ))}
        </div>

        <FractionInput label="Mixed Number B" whole={w2} num={n2} den={d2} onWholeChange={setW2} onNumChange={setN2} onDenChange={setD2} showWhole />
      </div>

      <div className="flex justify-center">
        <button onClick={calculate} className="px-8 py-3 bg-indigo-600 dark:bg-secondary text-white font-medium rounded-xl hover:bg-indigo-700 dark:hover:bg-[#ff7a1a] transition-colors shadow-sm">
          Calculate
        </button>
      </div>

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center">{error}</div>}

      {result && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-outline-variant/50 dark:border-slate-700 flex flex-col items-center">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Result</h2>
            <div className="flex items-center gap-6">
              <DisplayMixed m={toMixed(result.simp)} size="large" />
              {toMixed(result.simp).whole !== 0 && (
                <>
                  <span className="text-slate-400 font-medium">or</span>
                  <DisplayFraction f={result.simp} size="large" />
                </>
              )}
            </div>
          </div>

          <div className="border border-outline-variant/50 dark:border-slate-700 rounded-xl overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 font-semibold text-slate-900 dark:text-white border-b border-outline-variant/50 dark:border-slate-700">Step-by-Step Solution</div>
            <div className="p-6 bg-white dark:bg-slate-900">
              <ol className="list-decimal list-inside space-y-3 text-slate-700 dark:text-slate-300">
                {result.steps.map((step, i) => <li key={i} className="pl-2">{step}</li>)}
              </ol>
            </div>
          </div>
          
          <SummaryRow f={result.simp} />
        </div>
      )}
    </div>
  );
}

function SimplifyTab() {
  const [n, setN] = useState(''); const [d, setD] = useState('');
  const [result, setResult] = useState<{ raw: Fraction, simp: Fraction, divisor: number } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError(''); setResult(null);
    const num = parseInt(n), den = parseInt(d);
    if (isNaN(num) || isNaN(den)) { setError("Please enter valid integers."); return; }
    if (den === 0) { setError("Denominator cannot be zero."); return; }

    const raw = { num, den };
    const simp = simplify(raw);
    const divisor = gcd(num, den);
    setResult({ raw, simp, divisor });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <FractionInput label="Fraction to Simplify" num={n} den={d} onNumChange={setN} onDenChange={setD} />
      </div>
      <div className="flex justify-center">
        <button onClick={calculate} className="px-8 py-3 bg-indigo-600 dark:bg-secondary text-white font-medium rounded-xl hover:bg-indigo-700 dark:hover:bg-[#ff7a1a] transition-colors shadow-sm">Simplify</button>
      </div>
      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center">{error}</div>}
      
      {result && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-outline-variant/50 dark:border-slate-700 flex flex-col items-center">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Result</h2>
            <DisplayFraction f={result.simp} size="large" />
            <div className="mt-4 text-slate-600 dark:text-slate-400">
              {result.divisor === 1 && result.raw.den > 0 ? "Already in simplest form." : `Divided numerator and denominator by GCD: ${result.divisor}`}
            </div>
          </div>
          <SummaryRow f={result.simp} />
        </div>
      )}
    </div>
  );
}

function ConversionTab() {
  const [mode, setMode] = useState<'d2f'|'f2d'>('d2f');
  const [dec, setDec] = useState('');
  const [maxDen, setMaxDen] = useState('1000');
  const [n, setN] = useState(''); const [d, setD] = useState('');
  
  const [resF, setResF] = useState<Fraction | null>(null);
  const [resD, setResD] = useState<{decimal: string, isRepeating: boolean, repeatingBlock?: string} | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError(''); setResF(null); setResD(null);
    try {
      if (mode === 'd2f') {
        if (!dec) throw new Error("Enter a decimal value.");
        setResF(decimalToFraction(dec, parseInt(maxDen) || 1000));
      } else {
        const num = parseInt(n), den = parseInt(d);
        if (isNaN(num) || isNaN(den)) throw new Error("Enter valid integers.");
        setResD(fractionToDecimal({num, den}));
        setResF(simplify({num, den}));
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center mb-6">
        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex">
          <button onClick={() => setMode('d2f')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'd2f' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-secondary shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}>Decimal → Fraction</button>
          <button onClick={() => setMode('f2d')} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${mode === 'f2d' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-secondary shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}>Fraction → Decimal</button>
        </div>
      </div>

      <div className="flex justify-center">
        {mode === 'd2f' ? (
          <div className="flex flex-col gap-4 w-full max-w-xs">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Decimal Value</label>
              <input type="number" step="any" value={dec} onChange={e => setDec(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" placeholder="e.g. 0.75" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Denominator (Optional)</label>
              <input type="number" value={maxDen} onChange={e => setMaxDen(e.target.value)} className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" placeholder="1000" />
            </div>
          </div>
        ) : (
          <FractionInput label="Fraction" num={n} den={d} onNumChange={setN} onDenChange={setD} />
        )}
      </div>

      <div className="flex justify-center">
        <button onClick={calculate} className="px-8 py-3 bg-indigo-600 dark:bg-secondary text-white font-medium rounded-xl hover:bg-indigo-700 dark:hover:bg-[#ff7a1a] transition-colors shadow-sm">Convert</button>
      </div>

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center">{error}</div>}

      {(resF || resD) && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-outline-variant/50 dark:border-slate-700 flex flex-col items-center">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Result</h2>
            {mode === 'd2f' && resF && <DisplayFraction f={resF} size="large" />}
            {mode === 'f2d' && resD && (
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {resD.decimal}
                {resD.isRepeating && <div className="text-sm font-normal text-slate-500 mt-2">Repeating block: {resD.repeatingBlock}</div>}
              </div>
            )}
          </div>
          {resF && <SummaryRow f={resF} />}
        </div>
      )}
    </div>
  );
}

function CompareTab() {
  const [n1, setN1] = useState(''); const [d1, setD1] = useState('');
  const [n2, setN2] = useState(''); const [d2, setD2] = useState('');
  
  const [result, setResult] = useState<{ f1: Fraction, f2: Fraction, comp: '>'|'<'|'=' } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError(''); setResult(null);
    const num1 = parseInt(n1), den1 = parseInt(d1);
    const num2 = parseInt(n2), den2 = parseInt(d2);

    if (isNaN(num1) || isNaN(den1) || isNaN(num2) || isNaN(den2)) { setError("Please enter valid integers."); return; }
    if (den1 === 0 || den2 === 0) { setError("Denominator cannot be zero."); return; }

    const f1 = { num: num1, den: den1 };
    const f2 = { num: num2, den: den2 };
    
    const val1 = num1 * den2;
    const val2 = num2 * den1;
    // Account for negative denominators
    const sign = (den1 * den2) < 0 ? -1 : 1;
    
    let comp: '>'|'<'|'=' = '=';
    if (val1 * sign > val2 * sign) comp = '>';
    else if (val1 * sign < val2 * sign) comp = '<';

    setResult({ f1, f2, comp });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-12">
        <FractionInput label="Fraction A" num={n1} den={d1} onNumChange={setN1} onDenChange={setD1} />
        <div className="text-2xl font-bold text-slate-300 dark:text-slate-600">VS</div>
        <FractionInput label="Fraction B" num={n2} den={d2} onNumChange={setN2} onDenChange={setD2} />
      </div>

      <div className="flex justify-center">
        <button onClick={calculate} className="px-8 py-3 bg-indigo-600 dark:bg-secondary text-white font-medium rounded-xl hover:bg-indigo-700 dark:hover:bg-[#ff7a1a] transition-colors shadow-sm">Compare</button>
      </div>

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center">{error}</div>}

      {result && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-outline-variant/50 dark:border-slate-700 flex flex-col items-center">
            <div className="flex items-center gap-6 text-3xl font-bold">
              <DisplayFraction f={result.f1} />
              <span className={`px-4 py-2 rounded-xl text-white ${result.comp === '>' ? 'bg-green-500' : result.comp === '<' ? 'bg-red-500' : 'bg-blue-500'}`}>
                {result.comp}
              </span>
              <DisplayFraction f={result.f2} />
            </div>
            <div className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Fraction A is {result.comp === '>' ? 'greater than' : result.comp === '<' ? 'less than' : 'equal to'} Fraction B
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-outline-variant/50 dark:border-slate-700 flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="flex flex-col items-center gap-3">
              <VisualDiagram num={result.f1.num} den={result.f1.den} color="#3b82f6" />
              <span className="text-sm font-medium text-slate-500">Fraction A</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <VisualDiagram num={result.f2.num} den={result.f2.den} color="#ef4444" />
              <span className="text-sm font-medium text-slate-500">Fraction B</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
