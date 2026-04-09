import React, { useState } from 'react';
import ResultDisplay from './ResultDisplay';

export default function PctDifferenceTab() {
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [resData, setResData] = useState<any>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError(''); setResData(null);
    if (!x || !y) return setError('Please fill in all fields.');
    const valX = parseFloat(x); const valY = parseFloat(y);
    if (isNaN(valX) || isNaN(valY)) return setError('Please enter valid numbers.');
    if (valX === 0 && valY === 0) return setError('Percentage difference is undefined when both values are 0.');

    const diff = Math.abs(valX - valY);
    const avg = (valX + valY) / 2;
    const res = (diff / Math.abs(avg)) * 100;
    
    const steps = (
      <>
        <p><strong>Formula:</strong> % Difference = (|A − B| ÷ ((A + B) ÷ 2)) × 100</p>
        <p><strong>Substitute:</strong> (|{valX} − {valY}| ÷ (({valX} + {valY}) ÷ 2)) × 100</p>
        <p><strong>Step 1:</strong> |{valX} − {valY}| = {diff}</p>
        <p><strong>Step 2:</strong> ({valX} + {valY}) ÷ 2 = {avg}</p>
        <p><strong>Step 3:</strong> {diff} ÷ {Math.abs(avg)} = {diff/Math.abs(avg)}</p>
        <p><strong>Step 4:</strong> {diff/Math.abs(avg)} × 100 = {res}</p>
        <p><strong>Answer:</strong> The % difference is {res}%</p>
      </>
    );

    const maxVal = Math.max(valX, valY, 0);
    const minVal = Math.min(valX, valY, 0);
    const range = maxVal - minVal || 1;
    const pctX = ((valX - minVal) / range) * 100;
    const pctY = ((valY - minVal) / range) * 100;

    const visual = (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="w-20 text-sm font-medium text-slate-500">Value A</span>
          <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-6 relative">
            <div className="absolute left-0 top-0 bottom-0 bg-indigo-500 rounded-full transition-all" style={{ width: `${pctX}%` }}></div>
          </div>
          <span className="w-16 text-right font-bold">{valX}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-20 text-sm font-medium text-slate-500">Value B</span>
          <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-6 relative">
            <div className="absolute left-0 top-0 bottom-0 bg-indigo-500 rounded-full transition-all" style={{ width: `${pctY}%` }}></div>
          </div>
          <span className="w-16 text-right font-bold">{valY}</span>
        </div>
      </div>
    );

    setResData({
      result: `${res.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}%`,
      interpretation: `The percentage difference between ${valX} and ${valY} is ${res.toFixed(2)}%`,
      steps, visual
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-4 text-xl md:text-2xl font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
        <span>What is the % difference between</span>
        <input type="number" value={x} onChange={e=>setX(e.target.value)} className="w-32 p-3 text-center rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-sm" placeholder="Value A" />
        <span>and</span>
        <input type="number" value={y} onChange={e=>setY(e.target.value)} className="w-32 p-3 text-center rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-sm" placeholder="Value B" />
        <span>?</span>
      </div>
      <p className="text-center text-sm text-slate-500">% difference is always positive and treats both values equally — unlike % change which has a direction.</p>
      <div className="flex justify-center">
        <button onClick={calculate} className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">Calculate</button>
      </div>
      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center">{error}</div>}
      {resData && <ResultDisplay {...resData} />}
    </div>
  );
}
