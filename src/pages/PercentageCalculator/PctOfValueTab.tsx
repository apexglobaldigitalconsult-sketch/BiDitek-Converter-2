import React, { useState } from 'react';
import ResultDisplay from './ResultDisplay';

export default function PctOfValueTab() {
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [resData, setResData] = useState<{ result: string | number, interpretation: string, steps: React.ReactNode, visual: React.ReactNode, table: React.ReactNode } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError(''); setResData(null);
    if (!x || !y) return setError('Please fill in all fields.');
    const valX = parseFloat(x); const valY = parseFloat(y);
    if (isNaN(valX) || isNaN(valY)) return setError('Please enter valid numbers.');

    const res = (valX / 100) * valY;
    
    const steps = (
      <>
        <p><strong>Formula:</strong> Result = (X ÷ 100) × Y</p>
        <p><strong>Substitute:</strong> ({valX} ÷ 100) × {valY}</p>
        <p><strong>Step 1:</strong> {valX} ÷ 100 = {valX/100}</p>
        <p><strong>Step 2:</strong> {valX/100} × {valY} = {res}</p>
        <p><strong>Answer:</strong> {valX}% of {valY} = {res}</p>
      </>
    );

    const visual = (
      <div className="space-y-2">
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-8 relative overflow-hidden flex items-center">
          <div className="bg-indigo-500 h-full flex items-center justify-end px-2 text-white text-xs font-bold transition-all min-w-[2rem]" style={{ width: `${Math.min(100, Math.max(0, (res/valY)*100 || 0))}%` }}>
            {valX}%
          </div>
        </div>
        <div className="flex justify-between text-xs font-bold text-slate-500">
          <span>0</span>
          <span>{valY} (100%)</span>
        </div>
      </div>
    );

    const table = (
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500">
          <tr><th className="p-3 rounded-l-lg">Percentage</th><th className="p-3 rounded-r-lg">Value</th></tr>
        </thead>
        <tbody>
          {[5, 10, 15, 20, 25, 50, 75, 100].map(p => (
            <tr key={p} className={p === valX ? 'bg-primary/10 font-bold text-primary' : 'border-b border-outline-variant/30'}>
              <td className="p-3">{p}%</td>
              <td className="p-3">{((p / 100) * valY).toFixed(2).replace(/\.00$/, '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );

    setResData({
      result: Number.isInteger(res) ? res : res.toFixed(4).replace(/0+$/, '').replace(/\.$/, ''),
      interpretation: `${res} is ${valX}% of ${valY}`,
      steps, visual, table
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-4 text-xl md:text-2xl font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-outline-variant/50 dark:border-slate-700">
        <span>What is</span>
        <div className="relative">
          <input type="number" value={x} onChange={e=>setX(e.target.value)} className="w-28 p-3 text-center rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-sm" />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">%</span>
        </div>
        <span>of</span>
        <input type="number" value={y} onChange={e=>setY(e.target.value)} className="w-36 p-3 text-center rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-sm" />
        <span>?</span>
      </div>
      <div className="flex justify-center">
        <button onClick={calculate} className="px-8 py-3 bg-indigo-600 dark:bg-secondary text-white font-medium rounded-xl hover:bg-indigo-700 dark:hover:bg-[#ff7a1a] transition-colors shadow-sm">Calculate</button>
      </div>
      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center">{error}</div>}
      {resData && <ResultDisplay {...resData} />}
    </div>
  );
}
