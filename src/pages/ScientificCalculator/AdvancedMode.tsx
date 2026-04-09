import React, { useState } from 'react';

export default function AdvancedMode() {
  const [activeTab, setActiveTab] = useState<'matrix'|'complex'|'calculus'>('matrix');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
        {['matrix', 'complex', 'calculus'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
              activeTab === tab 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'matrix' && <MatrixSection />}
      {activeTab === 'complex' && <ComplexSection />}
      {activeTab === 'calculus' && <CalculusSection />}
    </div>
  );
}

function MatrixSection() {
  const [size, setSize] = useState<2|3>(3);
  const [matA, setMatA] = useState<string[][]>(Array(3).fill(Array(3).fill('0')));
  const [matB, setMatB] = useState<string[][]>(Array(3).fill(Array(3).fill('0')));
  const [result, setResult] = useState<number[][] | null>(null);
  const [error, setError] = useState('');

  const updateMat = (mat: 'A'|'B', r: number, c: number, val: string) => {
    const setFn = mat === 'A' ? setMatA : setMatB;
    setFn(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = val;
      return next;
    });
  };

  const parseMat = (mat: string[][]) => {
    const parsed = mat.slice(0, size).map(row => row.slice(0, size).map(Number));
    if (parsed.flat().some(isNaN)) throw new Error("Invalid matrix entries");
    return parsed;
  };

  const handleOp = (op: string) => {
    try {
      setError('');
      const A = parseMat(matA);
      const B = parseMat(matB);
      let res: number[][] = [];

      if (op === 'A+B') res = A.map((r, i) => r.map((v, j) => v + B[i][j]));
      else if (op === 'A-B') res = A.map((r, i) => r.map((v, j) => v - B[i][j]));
      else if (op === 'A*B') {
        res = Array(size).fill(0).map(() => Array(size).fill(0));
        for (let i=0; i<size; i++)
          for (let j=0; j<size; j++)
            for (let k=0; k<size; k++)
              res[i][j] += A[i][k] * B[k][j];
      } else if (op === 'detA' || op === 'detB') {
        const M = op === 'detA' ? A : B;
        let det = 0;
        if (size === 2) det = M[0][0]*M[1][1] - M[0][1]*M[1][0];
        else det = M[0][0]*(M[1][1]*M[2][2] - M[1][2]*M[2][1]) - M[0][1]*(M[1][0]*M[2][2] - M[1][2]*M[2][0]) + M[0][2]*(M[1][0]*M[2][1] - M[1][1]*M[2][0]);
        res = [[det]];
      } else if (op === 'transA' || op === 'transB') {
        const M = op === 'transA' ? A : B;
        res = M[0].map((_, colIndex) => M.map(row => row[colIndex]));
      }
      setResult(res);
    } catch (e: any) {
      setError(e.message);
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Matrices</h3>
        <select value={size} onChange={(e) => setSize(Number(e.target.value) as any)} className="p-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
          <option value={2}>2 × 2</option>
          <option value={3}>3 × 3</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['A', 'B'].map(name => (
          <div key={name}>
            <div className="text-sm font-medium text-slate-500 mb-2">Matrix {name}</div>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
              {Array(size).fill(0).map((_, r) => 
                Array(size).fill(0).map((_, c) => (
                  <input key={`${r}-${c}`} type="number" value={(name === 'A' ? matA : matB)[r][c]} onChange={(e) => updateMat(name as 'A'|'B', r, c, e.target.value)} className="w-full p-2 text-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {['A+B', 'A-B', 'A*B', 'detA', 'detB', 'transA', 'transB'].map(op => (
          <button key={op} onClick={() => handleOp(op)} className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 text-sm font-medium">{op}</button>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      {result && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="text-sm font-medium text-slate-500 mb-2">Result</div>
          <div className="inline-grid gap-2" style={{ gridTemplateColumns: `repeat(${result[0].length}, minmax(0, 1fr))` }}>
            {result.map((row, r) => row.map((val, c) => (
              <div key={`${r}-${c}`} className="px-4 py-2 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-center font-mono text-slate-900 dark:text-white">
                {Number.isInteger(val) ? val : val.toFixed(4)}
              </div>
            )))}
          </div>
        </div>
      )}
    </div>
  );
}

function ComplexSection() {
  const [a1, setA1] = useState('0'); const [b1, setB1] = useState('0');
  const [a2, setA2] = useState('0'); const [b2, setB2] = useState('0');
  const [res, setRes] = useState<{r:number, i:number} | null>(null);

  const handleOp = (op: string) => {
    const r1 = Number(a1), i1 = Number(b1), r2 = Number(a2), i2 = Number(b2);
    if (op === '+') setRes({ r: r1+r2, i: i1+i2 });
    if (op === '-') setRes({ r: r1-r2, i: i1-i2 });
    if (op === '*') setRes({ r: r1*r2 - i1*i2, i: r1*i2 + i1*r2 });
    if (op === '/') {
      const den = r2*r2 + i2*i2;
      if (den === 0) return;
      setRes({ r: (r1*r2 + i1*i2)/den, i: (i1*r2 - r1*i2)/den });
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Complex Numbers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map(n => (
          <div key={n} className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Z{n} =</span>
            <input type="number" value={n===1?a1:a2} onChange={e => n===1?setA1(e.target.value):setA2(e.target.value)} className="w-20 p-2 text-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
            <span className="text-slate-500">+</span>
            <input type="number" value={n===1?b1:b2} onChange={e => n===1?setB1(e.target.value):setB2(e.target.value)} className="w-20 p-2 text-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
            <span className="text-slate-500 italic font-serif">i</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {['+', '-', '*', '/'].map(op => (
          <button key={op} onClick={() => handleOp(op)} className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 font-medium text-lg">{op}</button>
        ))}
      </div>
      {res && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="text-sm font-medium text-slate-500 mb-2">Result</div>
          <div className="text-xl font-mono text-slate-900 dark:text-white mb-2">
            {res.r.toFixed(4)} {res.i >= 0 ? '+' : '-'} {Math.abs(res.i).toFixed(4)}i
          </div>
          <div className="text-sm text-slate-500">
            Polar: {Math.sqrt(res.r*res.r + res.i*res.i).toFixed(4)} ∠ {(Math.atan2(res.i, res.r) * 180 / Math.PI).toFixed(2)}°
          </div>
        </div>
      )}
    </div>
  );
}

function CalculusSection() {
  const [func, setFunc] = useState('x^2');
  const [valX, setValX] = useState('2');
  const [boundA, setBoundA] = useState('0');
  const [boundB, setBoundB] = useState('1');
  const [resDeriv, setResDeriv] = useState<string|null>(null);
  const [resInteg, setResInteg] = useState<string|null>(null);

  const evalF = (expr: string, x: number) => {
    let parsed = expr.replace(/x/g, `(${x})`).replace(/\^/g, '**');
    try { return new Function(`return ${parsed}`)(); } catch { return NaN; }
  };

  const calcDeriv = () => {
    const x = Number(valX);
    const h = 0.0001;
    const f1 = evalF(func, x + h);
    const f2 = evalF(func, x - h);
    if (isNaN(f1) || isNaN(f2)) setResDeriv('Error');
    else setResDeriv(((f1 - f2) / (2 * h)).toFixed(6));
  };

  const calcInteg = () => {
    const a = Number(boundA), b = Number(boundB);
    const n = 1000;
    const h = (b - a) / n;
    let sum = evalF(func, a) + evalF(func, b);
    for (let i = 1; i < n; i += 2) sum += 4 * evalF(func, a + i * h);
    for (let i = 2; i < n - 1; i += 2) sum += 2 * evalF(func, a + i * h);
    const res = (h / 3) * sum;
    if (isNaN(res)) setResInteg('Error');
    else setResInteg(res.toFixed(6));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Basic Calculus</h3>
      <div>
        <label className="block text-sm text-slate-500 mb-1">Function f(x)</label>
        <input type="text" value={func} onChange={e => setFunc(e.target.value)} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <h4 className="font-medium text-slate-900 dark:text-white mb-3">Derivative at x</h4>
          <div className="flex gap-2 mb-3">
            <input type="number" value={valX} onChange={e => setValX(e.target.value)} className="w-24 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" placeholder="x =" />
            <button onClick={calcDeriv} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">f'(x)</button>
          </div>
          {resDeriv && <div className="text-lg font-mono text-slate-900 dark:text-white">≈ {resDeriv}</div>}
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <h4 className="font-medium text-slate-900 dark:text-white mb-3">Definite Integral</h4>
          <div className="flex gap-2 mb-3 items-center">
            <span className="text-2xl font-serif">∫</span>
            <div className="flex flex-col gap-1">
              <input type="number" value={boundB} onChange={e => setBoundB(e.target.value)} className="w-16 p-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" placeholder="b" />
              <input type="number" value={boundA} onChange={e => setBoundA(e.target.value)} className="w-16 p-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" placeholder="a" />
            </div>
            <button onClick={calcInteg} className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Compute</button>
          </div>
          {resInteg && <div className="text-lg font-mono text-slate-900 dark:text-white">≈ {resInteg}</div>}
        </div>
      </div>
    </div>
  );
}
