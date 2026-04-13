import React, { useState } from 'react';
import { GradeScale, getLetterGrade, GPA_POINTS } from './utils';
import { Plus, X, Calculator, AlertTriangle } from 'lucide-react';

export function WeightedMode({ scale }: { scale: GradeScale[] }) {
  const [rows, setRows] = useState([{ id: '1', name: '', score: '', total: '', weight: '' }]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const addRow = () => setRows([...rows, { id: Date.now().toString(), name: '', score: '', total: '', weight: '' }]);
  const removeRow = (id: string) => setRows(rows.filter(r => r.id !== id));
  const updateRow = (id: string, field: string, val: string) => setRows(rows.map(r => r.id === id ? { ...r, [field]: val } : r));
  const clear = () => { setRows([{ id: '1', name: '', score: '', total: '', weight: '' }]); setResult(null); setError(null); };

  const calculate = () => {
    let totalW = 0;
    let earnedW = 0;
    const breakdown: any[] = [];
    for (const r of rows) {
      if (r.score !== '' && r.total !== '' && r.weight !== '') {
        const s = Number(r.score);
        const t = Number(r.total);
        const w = Number(r.weight);
        if (s < 0 || t <= 0 || w < 0) {
          setError('Scores and weights must be positive, and totals must be > 0.');
          return;
        }
        totalW += w;
        const pct = s / t;
        earnedW += pct * w;
        breakdown.push({ name: r.name || 'Unnamed', pct: pct * 100, contribution: pct * w, weight: w });
      }
    }
    if (breakdown.length === 0) {
      setError('Please enter at least one valid category.');
      return;
    }
    setError(null);
    setResult({
      finalPct: totalW > 0 ? (earnedW / totalW) * 100 : 0,
      totalWeight: totalW,
      breakdown
    });
  };

  return (
    <div className="space-y-6">
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <div className="col-span-4">Category Name</div>
        <div className="col-span-2">Score</div>
        <div className="col-span-2">Total</div>
        <div className="col-span-3">Weight (%)</div>
        <div className="col-span-1"></div>
      </div>
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={r.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 md:p-0 bg-slate-50 md:bg-transparent dark:bg-slate-900/50 md:dark:bg-transparent rounded-xl border border-outline-variant/50 md:border-none dark:border-slate-700 items-center">
            <div className="md:col-span-4">
              <label className="md:hidden block text-xs font-bold text-slate-500 uppercase mb-1">Category Name</label>
              <input type="text" value={r.name} onChange={e => updateRow(r.id, 'name', e.target.value)} placeholder={`Category ${i + 1}`} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="md:col-span-2">
              <label className="md:hidden block text-xs font-bold text-slate-500 uppercase mb-1">Score</label>
              <input type="number" min="0" value={r.score} onChange={e => updateRow(r.id, 'score', e.target.value)} placeholder="Score" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="md:col-span-2">
              <label className="md:hidden block text-xs font-bold text-slate-500 uppercase mb-1">Total Possible</label>
              <input type="number" min="1" value={r.total} onChange={e => updateRow(r.id, 'total', e.target.value)} placeholder="Total" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="md:col-span-3">
              <label className="md:hidden block text-xs font-bold text-slate-500 uppercase mb-1">Weight (%)</label>
              <input type="number" min="0" value={r.weight} onChange={e => updateRow(r.id, 'weight', e.target.value)} placeholder="Weight %" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="md:col-span-1 flex justify-end md:justify-center">
              {rows.length > 1 && (
                <button onClick={() => removeRow(r.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white md:bg-transparent dark:bg-slate-800 md:dark:bg-transparent rounded-lg border border-outline-variant/50 md:border-none dark:border-slate-700"><X className="w-5 h-5" /></button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <button onClick={addRow} className="px-4 py-2 text-sm font-bold text-indigo-600 dark:text-secondary bg-indigo-50 dark:bg-secondary/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-colors flex items-center gap-2"><Plus className="w-4 h-4" /> Add Category</button>
        <button onClick={clear} className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">Clear All</button>
      </div>
      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium border border-red-100 dark:border-red-800/50">{error}</div>}
      <button onClick={calculate} className="w-full py-4 bg-indigo-600 dark:bg-secondary text-white font-black text-lg rounded-xl hover:bg-indigo-700 dark:hover:bg-[#ff7a1a] transition-colors shadow-md shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"><Calculator className="w-6 h-6" /> Calculate Grade</button>

      {result && (
        <div className="mt-8 p-6 bg-indigo-50 dark:bg-secondary/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
          <div className="text-center mb-6">
            <p className="text-sm font-bold text-indigo-600 dark:text-secondary uppercase tracking-wider mb-2">Weighted Final Grade</p>
            <div className="text-5xl font-black text-slate-900 dark:text-white mb-2">{result.finalPct.toFixed(2)}%</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-secondary">{getLetterGrade(result.finalPct, scale)}</div>
          </div>
          {result.totalWeight !== 100 && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-xl flex items-start gap-3 border border-amber-200 dark:border-amber-800/50">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm"><strong>Note:</strong> Your total weights sum to {result.totalWeight}%, not 100%. The final grade has been scaled proportionally.</p>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-indigo-200 dark:border-indigo-800">
                  <th className="py-3 font-bold text-indigo-900 dark:text-indigo-300">Category</th>
                  <th className="py-3 font-bold text-indigo-900 dark:text-indigo-300">Grade</th>
                  <th className="py-3 font-bold text-indigo-900 dark:text-indigo-300">Weight</th>
                  <th className="py-3 font-bold text-indigo-900 dark:text-indigo-300 text-right">Contribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100 dark:divide-indigo-800/50">
                {result.breakdown.map((b: any, i: number) => (
                  <tr key={i}>
                    <td className="py-3 font-medium text-slate-900 dark:text-white">{b.name}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{b.pct.toFixed(2)}%</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{b.weight}%</td>
                    <td className="py-3 text-right font-bold text-indigo-600 dark:text-secondary">{b.contribution.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export function GPAMode() {
  const [rows, setRows] = useState([{ id: '1', name: '', grade: '', credits: '' }]);
  const [priorGpa, setPriorGpa] = useState('');
  const [priorCredits, setPriorCredits] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const addRow = () => setRows([...rows, { id: Date.now().toString(), name: '', grade: '', credits: '' }]);
  const removeRow = (id: string) => setRows(rows.filter(r => r.id !== id));
  const updateRow = (id: string, field: string, val: string) => setRows(rows.map(r => r.id === id ? { ...r, [field]: val } : r));
  const clear = () => { setRows([{ id: '1', name: '', grade: '', credits: '' }]); setPriorGpa(''); setPriorCredits(''); setResult(null); setError(null); };

  const calculate = () => {
    let semPts = 0;
    let semCreds = 0;
    const courseRes: any[] = [];
    for (const r of rows) {
      if (r.grade && r.credits !== '') {
        const c = Number(r.credits);
        if (c <= 0) {
          setError('Credits must be positive.');
          return;
        }
        const pts = GPA_POINTS[r.grade] || 0;
        semCreds += c;
        semPts += pts * c;
        courseRes.push({ name: r.name || 'Unnamed', grade: r.grade, credits: c, points: pts * c });
      }
    }
    if (courseRes.length === 0) {
      setError('Please enter at least one valid course.');
      return;
    }
    setError(null);
    const semGpa = semCreds > 0 ? semPts / semCreds : 0;
    let cumGpa = semGpa;
    let totCreds = semCreds;
    if (priorGpa !== '' && priorCredits !== '') {
      const pGpa = Number(priorGpa);
      const pCred = Number(priorCredits);
      totCreds += pCred;
      cumGpa = totCreds > 0 ? ((pGpa * pCred) + semPts) / totCreds : 0;
    }
    setResult({ semGpa, cumGpa, semCreds, totCreds, courseRes, hasPrior: priorGpa !== '' && priorCredits !== '' });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-outline-variant/50 dark:border-slate-700">
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Prior Cumulative GPA (Optional)</label>
          <input type="number" step="0.01" min="0" max="4" value={priorGpa} onChange={e => setPriorGpa(e.target.value)} placeholder="e.g. 3.5" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Prior Total Credits (Optional)</label>
          <input type="number" min="0" value={priorCredits} onChange={e => setPriorCredits(e.target.value)} placeholder="e.g. 60" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      <div className="hidden md:grid grid-cols-12 gap-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <div className="col-span-5">Course Name</div>
        <div className="col-span-3">Letter Grade</div>
        <div className="col-span-3">Credits</div>
        <div className="col-span-1"></div>
      </div>
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={r.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 md:p-0 bg-slate-50 md:bg-transparent dark:bg-slate-900/50 md:dark:bg-transparent rounded-xl border border-outline-variant/50 md:border-none dark:border-slate-700 items-center">
            <div className="md:col-span-5">
              <label className="md:hidden block text-xs font-bold text-slate-500 uppercase mb-1">Course Name</label>
              <input type="text" value={r.name} onChange={e => updateRow(r.id, 'name', e.target.value)} placeholder={`Course ${i + 1}`} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="md:col-span-3">
              <label className="md:hidden block text-xs font-bold text-slate-500 uppercase mb-1">Letter Grade</label>
              <select value={r.grade} onChange={e => updateRow(r.id, 'grade', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-bold">
                <option value="">--</option>
                {Object.keys(GPA_POINTS).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="md:hidden block text-xs font-bold text-slate-500 uppercase mb-1">Credits</label>
              <input type="number" min="0" step="0.5" value={r.credits} onChange={e => updateRow(r.id, 'credits', e.target.value)} placeholder="Credits" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="md:col-span-1 flex justify-end md:justify-center">
              {rows.length > 1 && (
                <button onClick={() => removeRow(r.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white md:bg-transparent dark:bg-slate-800 md:dark:bg-transparent rounded-lg border border-outline-variant/50 md:border-none dark:border-slate-700"><X className="w-5 h-5" /></button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <button onClick={addRow} className="px-4 py-2 text-sm font-bold text-indigo-600 dark:text-secondary bg-indigo-50 dark:bg-secondary/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-colors flex items-center gap-2"><Plus className="w-4 h-4" /> Add Course</button>
        <button onClick={clear} className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">Clear All</button>
      </div>
      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium border border-red-100 dark:border-red-800/50">{error}</div>}
      <button onClick={calculate} className="w-full py-4 bg-indigo-600 dark:bg-secondary text-white font-black text-lg rounded-xl hover:bg-indigo-700 dark:hover:bg-[#ff7a1a] transition-colors shadow-md shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"><Calculator className="w-6 h-6" /> Calculate GPA</button>

      {result && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-indigo-50 dark:bg-secondary/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 text-center">
            <p className="text-sm font-bold text-indigo-600 dark:text-secondary uppercase tracking-wider mb-2">Semester GPA</p>
            <div className="text-5xl font-black text-slate-900 dark:text-white mb-2">{result.semGpa.toFixed(2)}</div>
            <p className="text-slate-600 dark:text-slate-300 text-sm">Based on {result.semCreds} credits</p>
          </div>
          {result.hasPrior && (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 text-center">
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">Cumulative GPA</p>
              <div className="text-5xl font-black text-slate-900 dark:text-white mb-2">{result.cumGpa.toFixed(2)}</div>
              <p className="text-slate-600 dark:text-slate-300 text-sm">Based on {result.totCreds} total credits</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function FinalExamMode({ scale }: { scale: GradeScale[] }) {
  const [current, setCurrent] = useState('');
  const [desired, setDesired] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const clear = () => { setCurrent(''); setDesired(''); setWeight(''); setResult(null); setError(null); };

  const calculate = () => {
    if (current === '' || desired === '' || weight === '') {
      setError('Please fill in all fields.');
      return;
    }
    const c = Number(current);
    const d = Number(desired);
    const w = Number(weight) / 100;
    if (c < 0 || d < 0 || w <= 0 || w >= 1) {
      setError('Invalid inputs. Weight must be between 0 and 100.');
      return;
    }
    setError(null);
    const required = (d - c * (1 - w)) / w;
    const maxPossible = c * (1 - w) + 100 * w;
    setResult({ required, maxPossible, possible: required <= 100 });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Current Grade (%)</label>
            <div className="flex gap-2">
              <input type="number" min="0" value={current} onChange={e => setCurrent(e.target.value)} placeholder="e.g. 85" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
              <select onChange={e => { if(e.target.value) setCurrent(e.target.value); }} className="p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-bold w-24">
                <option value="">Letter</option>
                {[...scale].sort((a, b) => b.min - a.min).map(s => <option key={s.letter} value={s.min}>{s.letter}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Desired Final Grade (%)</label>
            <div className="flex gap-2">
              <input type="number" min="0" value={desired} onChange={e => setDesired(e.target.value)} placeholder="e.g. 90" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
              <select onChange={e => { if(e.target.value) setDesired(e.target.value); }} className="p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-bold w-24">
                <option value="">Letter</option>
                {[...scale].sort((a, b) => b.min - a.min).map(s => <option key={s.letter} value={s.min}>{s.letter}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Final Exam Weight (%)</label>
            <input type="number" min="1" max="99" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 20" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <button onClick={clear} className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">Clear All</button>
      </div>
      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium border border-red-100 dark:border-red-800/50">{error}</div>}
      <button onClick={calculate} className="w-full py-4 bg-indigo-600 dark:bg-secondary text-white font-black text-lg rounded-xl hover:bg-indigo-700 dark:hover:bg-[#ff7a1a] transition-colors shadow-md shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"><Calculator className="w-6 h-6" /> Calculate Required Score</button>

      {result && (
        <div className={`mt-8 p-6 rounded-2xl border ${result.possible ? 'bg-indigo-50 dark:bg-secondary/20 border-indigo-100 dark:border-indigo-800/50' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/50'}`}>
          <div className="text-center">
            <p className={`text-sm font-bold uppercase tracking-wider mb-2 ${result.possible ? 'text-indigo-600 dark:text-secondary' : 'text-red-600 dark:text-red-400'}`}>Required Final Exam Score</p>
            <div className={`text-5xl font-black mb-2 ${result.possible ? 'text-slate-900 dark:text-white' : 'text-red-600 dark:text-red-400'}`}>
              {result.possible ? `${result.required.toFixed(2)}%` : 'Impossible'}
            </div>
            {result.possible ? (
              <p className="text-slate-600 dark:text-slate-300">You need to score at least <strong>{result.required.toFixed(2)}%</strong> on your final exam to achieve your desired grade.</p>
            ) : (
              <p className="text-red-700 dark:text-red-400 mt-2">Even with a 100% on the final, the highest grade you can achieve is <strong>{result.maxPossible.toFixed(2)}%</strong>.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function AverageMode({ scale }: { scale: GradeScale[] }) {
  const [rows, setRows] = useState([{ id: '1', name: '', score: '', total: '', weight: '' }]);
  const [isWeighted, setIsWeighted] = useState(false);
  const [dropN, setDropN] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const addRow = () => setRows([...rows, { id: Date.now().toString(), name: '', score: '', total: '', weight: '' }]);
  const removeRow = (id: string) => setRows(rows.filter(r => r.id !== id));
  const updateRow = (id: string, field: string, val: string) => setRows(rows.map(r => r.id === id ? { ...r, [field]: val } : r));
  const clear = () => { setRows([{ id: '1', name: '', score: '', total: '', weight: '' }]); setDropN(''); setResult(null); setError(null); };

  const calculate = () => {
    const validRows = [];
    for (const r of rows) {
      if (r.score !== '' && r.total !== '') {
        const s = Number(r.score);
        const t = Number(r.total);
        const w = isWeighted && r.weight !== '' ? Number(r.weight) : 1;
        if (s < 0 || t <= 0 || w < 0) {
          setError('Scores and weights must be positive, and totals must be > 0.');
          return;
        }
        validRows.push({ name: r.name || 'Unnamed', score: s, total: t, weight: w, pct: s / t });
      }
    }
    if (validRows.length === 0) {
      setError('Please enter at least one valid assignment.');
      return;
    }
    setError(null);

    validRows.sort((a, b) => b.pct - a.pct);
    const d = dropN !== '' ? Number(dropN) : 0;
    const kept = d > 0 && d < validRows.length ? validRows.slice(0, validRows.length - d) : validRows;

    let sumW = 0;
    let sumWPct = 0;
    let sumS = 0;
    let sumT = 0;
    let high = -Infinity;
    let low = Infinity;

    for (const r of kept) {
      if (r.pct > high) high = r.pct;
      if (r.pct < low) low = r.pct;
      if (isWeighted) {
        sumWPct += r.pct * r.weight;
        sumW += r.weight;
      } else {
        sumS += r.score;
        sumT += r.total;
      }
    }

    const finalPct = isWeighted 
      ? (sumW > 0 ? (sumWPct / sumW) * 100 : 0)
      : (sumT > 0 ? (sumS / sumT) * 100 : 0);

    setResult({
      finalPct,
      highest: high === -Infinity ? 0 : high * 100,
      lowest: low === Infinity ? 0 : low * 100,
      keptCount: kept.length,
      droppedCount: validRows.length - kept.length
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Mode:</span>
        <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-outline-variant/50 dark:border-slate-700">
          <button onClick={() => setIsWeighted(false)} className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${!isWeighted ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Simple Average</button>
          <button onClick={() => setIsWeighted(true)} className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${isWeighted ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Weighted Average</button>
        </div>
      </div>

      <div className="hidden md:grid grid-cols-12 gap-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <div className={isWeighted ? "col-span-4" : "col-span-5"}>Assignment Name</div>
        <div className="col-span-3">Score</div>
        <div className="col-span-3">Total Possible</div>
        {isWeighted && <div className="col-span-1">Weight</div>}
        <div className="col-span-1"></div>
      </div>
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={r.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 md:p-0 bg-slate-50 md:bg-transparent dark:bg-slate-900/50 md:dark:bg-transparent rounded-xl border border-outline-variant/50 md:border-none dark:border-slate-700 items-center">
            <div className={isWeighted ? "md:col-span-4" : "md:col-span-5"}>
              <label className="md:hidden block text-xs font-bold text-slate-500 uppercase mb-1">Assignment Name</label>
              <input type="text" value={r.name} onChange={e => updateRow(r.id, 'name', e.target.value)} placeholder={`Assignment ${i + 1}`} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="md:col-span-3">
              <label className="md:hidden block text-xs font-bold text-slate-500 uppercase mb-1">Score</label>
              <input type="number" min="0" value={r.score} onChange={e => updateRow(r.id, 'score', e.target.value)} placeholder="Score" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="md:col-span-3">
              <label className="md:hidden block text-xs font-bold text-slate-500 uppercase mb-1">Total Possible</label>
              <input type="number" min="1" value={r.total} onChange={e => updateRow(r.id, 'total', e.target.value)} placeholder="Total" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
            {isWeighted && (
              <div className="md:col-span-1">
                <label className="md:hidden block text-xs font-bold text-slate-500 uppercase mb-1">Weight</label>
                <input type="number" min="0" value={r.weight} onChange={e => updateRow(r.id, 'weight', e.target.value)} placeholder="W" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
              </div>
            )}
            <div className="md:col-span-1 flex justify-end md:justify-center">
              {rows.length > 1 && (
                <button onClick={() => removeRow(r.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white md:bg-transparent dark:bg-slate-800 md:dark:bg-transparent rounded-lg border border-outline-variant/50 md:border-none dark:border-slate-700"><X className="w-5 h-5" /></button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3">
          <button onClick={addRow} className="px-4 py-2 text-sm font-bold text-indigo-600 dark:text-secondary bg-indigo-50 dark:bg-secondary/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-colors flex items-center gap-2"><Plus className="w-4 h-4" /> Add Assignment</button>
          <button onClick={clear} className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">Clear All</button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Drop lowest:</label>
          <input type="number" min="0" max={rows.length - 1} value={dropN} onChange={e => setDropN(e.target.value)} placeholder="0" className="w-16 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-center focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium border border-red-100 dark:border-red-800/50">{error}</div>}
      <button onClick={calculate} className="w-full py-4 bg-indigo-600 dark:bg-secondary text-white font-black text-lg rounded-xl hover:bg-indigo-700 dark:hover:bg-[#ff7a1a] transition-colors shadow-md shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"><Calculator className="w-6 h-6" /> Calculate Average</button>

      {result && (
        <div className="mt-8 p-6 bg-indigo-50 dark:bg-secondary/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
          <div className="text-center mb-6">
            <p className="text-sm font-bold text-indigo-600 dark:text-secondary uppercase tracking-wider mb-2">Final Average</p>
            <div className="text-5xl font-black text-slate-900 dark:text-white mb-2">{result.finalPct.toFixed(2)}%</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-secondary">{getLetterGrade(result.finalPct, scale)}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Highest Score</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{result.highest.toFixed(2)}%</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Lowest Score</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{result.lowest.toFixed(2)}%</p>
            </div>
          </div>
          {result.droppedCount > 0 && (
            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
              Dropped the lowest {result.droppedCount} score(s). Average based on {result.keptCount} assignment(s).
            </p>
          )}
        </div>
      )}
    </div>
  );
}
