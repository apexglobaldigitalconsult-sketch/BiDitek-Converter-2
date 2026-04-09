import React, { useState } from 'react';
import ResultDisplay from './ResultDisplay';

export default function ValueAsPctTab() {
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [resData, setResData] = useState<any>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError(''); setResData(null);
    if (!x || !y) return setError('Please fill in all fields.');
    const valX = parseFloat(x); const valY = parseFloat(y);
    if (isNaN(valX) || isNaN(valY)) return setError('Please enter valid numbers.');
    if (valY === 0) return setError('Total value cannot be zero.');

    const res = (valX / valY) * 100;
    
    const steps = (
      <>
        <p><strong>Formula:</strong> Result = (X ÷ Y) × 100</p>
        <p><strong>Substitute:</strong> ({valX} ÷ {valY}) × 100</p>
        <p><strong>Step 1:</strong> {valX} ÷ {valY} = {valX/valY}</p>
        <p><strong>Step 2:</strong> {valX/valY} × 100 = {res}</p>
        <p><strong>Answer:</strong> {valX} is {res}% of {valY}</p>
      </>
    );

    const visual = (
      <div className="space-y-2">
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-8 relative overflow-hidden flex items-center">
          <div className="bg-indigo-500 h-full flex items-center justify-end px-2 text-white text-xs font-bold transition-all min-w-[2rem]" style={{ width: `${Math.min(100, Math.max(0, (valX/valY)*100 || 0))}%` }}>
            {res.toFixed(1)}%
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
          <tr><th className="p-3 rounded-l-lg">Value</th><th className="p-3 rounded-r-lg">Percentage of {valY}</th></tr>
        </thead>
        <tbody>
          {[valY*0.05, valY*0.1, valY*0.25, valY*0.5, valY*0.75, valY].map(v => (
            <tr key={v} className={v === valX ? 'bg-indigo-50 dark:bg-indigo-900/20 font-bold text-indigo-700 dark:text-indigo-300' : 'border-b border-slate-100 dark:border-slate-800'}>
              <td className="p-3">{Number.isInteger(v) ? v : v.toFixed(2)}</td>
              <td className="p-3">{((v / valY) * 100).toFixed(2).replace(/\.00$/, '')}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    );

    setResData({
      result: `${Number.isInteger(res) ? res : res.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}%`,
      interpretation: `${valX} is ${Number.isInteger(res) ? res : res.toFixed(2)}% of ${valY}`,
      steps, visual, table
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-4 text-xl md:text-2xl font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
        <input type="number" value={x} onChange={e=>setX(e.target.value)} className="w-36 p-3 text-center rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-sm" />
        <span>is what % of</span>
        <input type="number" value={y} onChange={e=>setY(e.target.value)} className="w-36 p-3 text-center rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-sm" />
        <span>?</span>
      </div>
      <div className="flex justify-center">
        <button onClick={calculate} className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">Calculate</button>
      </div>
      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center">{error}</div>}
      {resData && <ResultDisplay {...resData} />}
    </div>
  );
}
