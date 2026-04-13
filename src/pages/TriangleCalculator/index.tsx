import React, { useState } from 'react';
import { degToRad, radToDeg, TriangleData, DerivedProperties, TriangleClassification, calculateDerivedProperties, classifyTriangle, formatVal } from './utils';
import ResultDisplay from './ResultDisplay';
import TriangleDiagram from './TriangleDiagram';

type Mode = 'SSS' | 'SAS' | 'ASA' | 'AAS' | 'SSA';

export default function TriangleCalculator() {
  const [mode, setMode] = useState<Mode>('SSS');
  const [isDeg, setIsDeg] = useState(true);

  // Inputs
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [A, setAngleA] = useState('');
  const [B, setAngleB] = useState('');
  const [C, setAngleC] = useState('');

  const [results, setResults] = useState<{
    triangles: TriangleData[];
    derived: DerivedProperties[];
    classifications: TriangleClassification[];
    steps: React.ReactNode[];
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [checks, setChecks] = useState<{name: string, pass: boolean}[]>([]);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setResults(null);
    setError(null);
    setChecks([]);
    // Clear inputs
    setA(''); setB(''); setC('');
    setAngleA(''); setAngleB(''); setAngleC('');
  };

  const parseInput = (val: string) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

  const parseAngle = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return 0;
    return isDeg ? degToRad(num) : num;
  };

  const validateAndSolve = () => {
    setError(null);
    setResults(null);
    
    const va = parseInput(a);
    const vb = parseInput(b);
    const vc = parseInput(c);
    const vA = parseAngle(A);
    const vB = parseAngle(B);
    const vC = parseAngle(C);

    let newChecks: {name: string, pass: boolean}[] = [];
    let isValid = true;

    const addCheck = (name: string, pass: boolean) => {
      newChecks.push({ name, pass });
      if (!pass) isValid = false;
    };

    // Basic validation
    if (mode === 'SSS') {
      addCheck('All values positive', va > 0 && vb > 0 && vc > 0);
      addCheck('Triangle Inequality (a + b > c)', va + vb > vc);
      addCheck('Triangle Inequality (a + c > b)', va + vc > vb);
      addCheck('Triangle Inequality (b + c > a)', vb + vc > va);
    } else if (mode === 'SAS') {
      addCheck('All values positive', va > 0 && vb > 0 && vC > 0);
      addCheck('Angle Sum < 180°', vC < Math.PI);
    } else if (mode === 'ASA') {
      addCheck('All values positive', vA > 0 && vB > 0 && vc > 0);
      addCheck('Angle Sum < 180°', vA + vB < Math.PI);
    } else if (mode === 'AAS') {
      addCheck('All values positive', vA > 0 && vB > 0 && va > 0);
      addCheck('Angle Sum < 180°', vA + vB < Math.PI);
    } else if (mode === 'SSA') {
      addCheck('All values positive', va > 0 && vb > 0 && vA > 0);
      addCheck('Angle Sum < 180°', vA < Math.PI);
    }

    setChecks(newChecks);

    if (!isValid) {
      setError('Validation failed. No valid triangle exists with these inputs.');
      return;
    }

    try {
      if (mode === 'SSS') solveSSS(va, vb, vc);
      else if (mode === 'SAS') solveSAS(va, vC, vb);
      else if (mode === 'ASA') solveASA(vA, vc, vB);
      else if (mode === 'AAS') solveAAS(vA, vB, va);
      else if (mode === 'SSA') solveSSA(va, vb, vA);
    } catch (err: any) {
      setError(err.message || 'An error occurred during calculation.');
    }
  };

  const finalizeSolution = (triangles: TriangleData[], steps: React.ReactNode[]) => {
    const derived = triangles.map(calculateDerivedProperties);
    const classifications = triangles.map(classifyTriangle);
    setResults({ triangles, derived, classifications, steps });
  };

  const solveSSS = (a: number, b: number, c: number) => {
    const A = Math.acos((b*b + c*c - a*a) / (2*b*c));
    const B = Math.acos((a*a + c*c - b*b) / (2*a*c));
    const C = Math.PI - A - B;

    const steps = (
      <>
        <p><strong>Known:</strong> a = {a}, b = {b}, c = {c}</p>
        <p><strong>Find angle A (Law of Cosines):</strong> A = arccos((b² + c² − a²) / (2bc))</p>
        <p>A = arccos(({b*b} + {c*c} − {a*a}) / {2*b*c}) = {formatVal(A, true, isDeg)}{isDeg ? '°' : ' rad'}</p>
        <p><strong>Find angle B (Law of Cosines):</strong> B = arccos((a² + c² − b²) / (2ac))</p>
        <p>B = arccos(({a*a} + {c*c} − {b*b}) / {2*a*c}) = {formatVal(B, true, isDeg)}{isDeg ? '°' : ' rad'}</p>
        <p><strong>Find angle C:</strong> C = 180° − A − B = {formatVal(C, true, isDeg)}{isDeg ? '°' : ' rad'}</p>
      </>
    );

    finalizeSolution([{ a, b, c, A, B, C }], [steps]);
  };

  const solveSAS = (a: number, C: number, b: number) => {
    const c = Math.sqrt(a*a + b*b - 2*a*b*Math.cos(C));
    const A = Math.acos((b*b + c*c - a*a) / (2*b*c));
    const B = Math.PI - A - C;

    const steps = (
      <>
        <p><strong>Known:</strong> a = {a}, b = {b}, C = {formatVal(C, true, isDeg)}{isDeg ? '°' : ' rad'}</p>
        <p><strong>Find side c (Law of Cosines):</strong> c = sqrt(a² + b² − 2ab × cos(C))</p>
        <p>c = sqrt({a*a} + {b*b} − {2*a*b} × {Math.cos(C).toFixed(4)}) = {formatVal(c)}</p>
        <p><strong>Find angle A (Law of Cosines):</strong> A = arccos((b² + c² − a²) / (2bc))</p>
        <p>A = {formatVal(A, true, isDeg)}{isDeg ? '°' : ' rad'}</p>
        <p><strong>Find angle B:</strong> B = 180° − A − C = {formatVal(B, true, isDeg)}{isDeg ? '°' : ' rad'}</p>
      </>
    );

    finalizeSolution([{ a, b, c, A, B, C }], [steps]);
  };

  const solveASA = (A: number, c: number, B: number) => {
    const C = Math.PI - A - B;
    const a = c * Math.sin(A) / Math.sin(C);
    const b = c * Math.sin(B) / Math.sin(C);

    const steps = (
      <>
        <p><strong>Known:</strong> A = {formatVal(A, true, isDeg)}{isDeg ? '°' : ' rad'}, c = {c}, B = {formatVal(B, true, isDeg)}{isDeg ? '°' : ' rad'}</p>
        <p><strong>Find angle C:</strong> C = 180° − A − B = {formatVal(C, true, isDeg)}{isDeg ? '°' : ' rad'}</p>
        <p><strong>Find side a (Law of Sines):</strong> a = c × sin(A) / sin(C)</p>
        <p>a = {c} × {Math.sin(A).toFixed(4)} / {Math.sin(C).toFixed(4)} = {formatVal(a)}</p>
        <p><strong>Find side b (Law of Sines):</strong> b = c × sin(B) / sin(C)</p>
        <p>b = {c} × {Math.sin(B).toFixed(4)} / {Math.sin(C).toFixed(4)} = {formatVal(b)}</p>
      </>
    );

    finalizeSolution([{ a, b, c, A, B, C }], [steps]);
  };

  const solveAAS = (A: number, B: number, a: number) => {
    const C = Math.PI - A - B;
    const b = a * Math.sin(B) / Math.sin(A);
    const c = a * Math.sin(C) / Math.sin(A);

    const steps = (
      <>
        <p><strong>Known:</strong> A = {formatVal(A, true, isDeg)}{isDeg ? '°' : ' rad'}, B = {formatVal(B, true, isDeg)}{isDeg ? '°' : ' rad'}, a = {a}</p>
        <p><strong>Find angle C:</strong> C = 180° − A − B = {formatVal(C, true, isDeg)}{isDeg ? '°' : ' rad'}</p>
        <p><strong>Find side b (Law of Sines):</strong> b = a × sin(B) / sin(A)</p>
        <p>b = {a} × {Math.sin(B).toFixed(4)} / {Math.sin(A).toFixed(4)} = {formatVal(b)}</p>
        <p><strong>Find side c (Law of Sines):</strong> c = a × sin(C) / sin(A)</p>
        <p>c = {a} × {Math.sin(C).toFixed(4)} / {Math.sin(A).toFixed(4)} = {formatVal(c)}</p>
      </>
    );

    finalizeSolution([{ a, b, c, A, B, C }], [steps]);
  };

  const solveSSA = (a: number, b: number, A: number) => {
    const sinB = (b * Math.sin(A)) / a;
    
    if (sinB > 1) {
      throw new Error('No valid triangle exists with these measurements (sin(B) > 1).');
    }

    const B1 = Math.asin(sinB);
    const C1 = Math.PI - A - B1;
    const c1 = a * Math.sin(C1) / Math.sin(A);

    const steps1 = (
      <>
        <p><strong>Known:</strong> a = {a}, b = {b}, A = {formatVal(A, true, isDeg)}{isDeg ? '°' : ' rad'}</p>
        <p><strong>Find angle B (Law of Sines):</strong> sin(B) = b × sin(A) / a</p>
        <p>sin(B) = {b} × {Math.sin(A).toFixed(4)} / {a} = {sinB.toFixed(4)}</p>
        <p>B₁ = arcsin({sinB.toFixed(4)}) = {formatVal(B1, true, isDeg)}{isDeg ? '°' : ' rad'}</p>
        <p><strong>Find angle C₁:</strong> C₁ = 180° − A − B₁ = {formatVal(C1, true, isDeg)}{isDeg ? '°' : ' rad'}</p>
        <p><strong>Find side c₁:</strong> c₁ = a × sin(C₁) / sin(A) = {formatVal(c1)}</p>
      </>
    );

    if (Math.abs(sinB - 1) < 0.0001 || a >= b) {
      // One solution
      finalizeSolution([{ a, b, c: c1, A, B: B1, C: C1 }], [steps1]);
    } else {
      // Two solutions
      const B2 = Math.PI - B1;
      const C2 = Math.PI - A - B2;
      
      if (C2 <= 0) {
        // Second solution is invalid (angles sum to > 180)
        finalizeSolution([{ a, b, c: c1, A, B: B1, C: C1 }], [steps1]);
        return;
      }

      const c2 = a * Math.sin(C2) / Math.sin(A);

      const steps2 = (
        <>
          <p><strong>Ambiguous Case (SSA):</strong> Since a &lt; b and sin(B) &lt; 1, a second valid triangle exists.</p>
          <p><strong>Find angle B₂:</strong> B₂ = 180° − B₁ = {formatVal(B2, true, isDeg)}{isDeg ? '°' : ' rad'}</p>
          <p><strong>Find angle C₂:</strong> C₂ = 180° − A − B₂ = {formatVal(C2, true, isDeg)}{isDeg ? '°' : ' rad'}</p>
          <p><strong>Find side c₂:</strong> c₂ = a × sin(C₂) / sin(A) = {formatVal(c2)}</p>
        </>
      );

      finalizeSolution(
        [{ a, b, c: c1, A, B: B1, C: C1 }, { a, b, c: c2, A, B: B2, C: C2 }],
        [steps1, steps2]
      );
    }
  };

  const renderInput = (label: string, value: string, setter: (v: string) => void, isAngle: boolean = false) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label} {isAngle && `(${isDeg ? 'deg' : 'rad'})`}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => setter(e.target.value)}
        className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
        placeholder="0.00"
      />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Triangle Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Solve any triangle given three properties. Includes step-by-step solutions, full property breakdown, and to-scale diagrams.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-outline-variant/50 dark:border-slate-700 overflow-hidden">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-outline-variant/50 dark:border-slate-700">
          {(['SSS', 'SAS', 'ASA', 'AAS', 'SSA'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`flex-1 py-4 px-6 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all rounded-[1px] ${
                mode === m
                  ? 'bg-primary text-background shadow-md'
                  : 'bg-surface-container text-primary/50 hover:text-secondary hover:bg-secondary/10'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* DEG / RAD Toggle */}
          <div className="flex justify-end">
            <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
              <button
                onClick={() => setIsDeg(true)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isDeg ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                DEG
              </button>
              <button
                onClick={() => setIsDeg(false)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  !isDeg ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                RAD
              </button>
            </div>
          </div>

          {mode === 'SSA' && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-xl text-sm font-medium">
              Note: The SSA configuration may produce 0, 1, or 2 valid triangles (the ambiguous case). All valid solutions will be shown.
            </div>
          )}

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mode === 'SSS' && (
              <>
                {renderInput('Side a', a, setA)}
                {renderInput('Side b', b, setB)}
                {renderInput('Side c', c, setC)}
              </>
            )}
            {mode === 'SAS' && (
              <>
                {renderInput('Side a', a, setA)}
                {renderInput('Angle C', C, setAngleC, true)}
                {renderInput('Side b', b, setB)}
              </>
            )}
            {mode === 'ASA' && (
              <>
                {renderInput('Angle A', A, setAngleA, true)}
                {renderInput('Side c', c, setC)}
                {renderInput('Angle B', B, setAngleB, true)}
              </>
            )}
            {mode === 'AAS' && (
              <>
                {renderInput('Angle A', A, setAngleA, true)}
                {renderInput('Angle B', B, setAngleB, true)}
                {renderInput('Side a', a, setA)}
              </>
            )}
            {mode === 'SSA' && (
              <>
                {renderInput('Side a', a, setA)}
                {renderInput('Side b', b, setB)}
                {renderInput('Angle A', A, setAngleA, true)}
              </>
            )}
          </div>

          <button
            onClick={validateAndSolve}
            className="w-full py-4 bg-indigo-600 dark:bg-secondary text-white text-lg font-bold rounded-xl hover:bg-indigo-700 dark:hover:bg-[#ff7a1a] transition-colors shadow-sm"
          >
            Calculate Triangle
          </button>

          {/* Validation Checks */}
          {checks.length > 0 && (
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-outline-variant/50 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">Validation Checks</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {checks.map((check, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {check.pass ? (
                      <span className="text-emerald-500 font-bold">✓</span>
                    ) : (
                      <span className="text-red-500 font-bold">✗</span>
                    )}
                    <span className={check.pass ? 'text-slate-700 dark:text-slate-300' : 'text-red-600 dark:text-red-400 font-medium'}>
                      {check.name}
                    </span>
                  </div>
                ))}
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-8">
          {results.triangles.map((tri, idx) => (
            <ResultDisplay
              key={idx}
              solutionNum={results.triangles.length > 1 ? idx + 1 : undefined}
              triangle={tri}
              derived={results.derived[idx]}
              classification={results.classifications[idx]}
              isDeg={isDeg}
              steps={results.steps[idx]}
              diagram={<TriangleDiagram triangle={tri} />}
            />
          ))}
          <p className="text-center text-xs text-slate-500">
            All calculations use floating point arithmetic. Results are rounded to 4 decimal places for display.
          </p>
        </div>
      )}
    </div>
  );
}
