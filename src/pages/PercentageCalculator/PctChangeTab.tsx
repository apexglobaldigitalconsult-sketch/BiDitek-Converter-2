import React, { useState } from 'react';
import ResultDisplay from './ResultDisplay';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function PctChangeTab() {
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [resData, setResData] = useState<any>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError(''); setResData(null);
    if (!x || !y) return setError('Please fill in all fields.');
    const valX = parseFloat(x); const valY = parseFloat(y);
    if (isNaN(valX) || isNaN(valY)) return setError('Please enter valid numbers.');
    if (valX === 0) return setError('Original value cannot be zero for percentage change.');

    const diff = valY - valX;
    const res = (diff / Math.abs(valX)) * 100;
    
    const isInc = res > 0;
    const isDec = res < 0;
    const isNone = res === 0;

    const steps = (
      <>
        <p><strong>Formula:</strong> % Change = ((New − Old) ÷ |Old|) × 100</p>
        <p><strong>Substitute:</strong> (({valY} − {valX}) ÷ |{valX}|) × 100</p>
        <p><strong>Step 1:</strong> {valY} − {valX} = {diff}</p>
        <p><strong>Step 2:</strong> {diff} ÷ {Math.abs(valX)} = {diff/Math.abs(valX)}</p>
        <p><strong>Step 3:</strong> {diff/Math.abs(valX)} × 100 = {res}</p>
        <p><strong>Answer:</strong> An {isInc ? 'increase' : isDec ? 'decrease' : 'change'} of {Math.abs(res)}%</p>
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
          <span className="w-20 text-sm font-medium text-slate-500">Original</span>
          <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-6 relative">
            <div className="absolute left-0 top-0 bottom-0 bg-slate-400 rounded-full transition-all" style={{ width: `${pctX}%` }}></div>
          </div>
          <span className="w-16 text-right font-bold">{valX}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-20 text-sm font-medium text-slate-500">New</span>
          <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-6 relative">
            <div className={`absolute left-0 top-0 bottom-0 rounded-full transition-all ${isInc ? 'bg-green-500' : isDec ? 'bg-red-500' : 'bg-slate-400'}`} style={{ width: `${pctY}%` }}></div>
          </div>
          <span className="w-16 text-right font-bold">{valY}</span>
        </div>
      </div>
    );

    const table = (
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500">
          <tr><th className="p-3 rounded-l-lg">% Change</th><th className="p-3 rounded-r-lg">New Value</th></tr>
        </thead>
        <tbody>
          {[-50, -25, -10, 0, 10, 25, 50, 100].map(p => (
            <tr key={p} className={p === res ? 'bg-indigo-50 dark:bg-secondary/20 font-bold text-indigo-700 dark:text-indigo-300' : 'border-b border-slate-100 dark:border-slate-800'}>
              <td className="p-3">{p > 0 ? '+' : ''}{p}%</td>
              <td className="p-3">{(valX * (1 + p/100)).toFixed(2).replace(/\.00$/, '')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );

    const badges = (
      <>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold text-white ${isInc ? 'bg-green-500' : isDec ? 'bg-red-500' : 'bg-slate-500'}`}>
          {isInc ? <TrendingUp className="w-4 h-4" /> : isDec ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
          {isInc ? 'Increase' : isDec ? 'Decrease' : 'No Change'}
        </div>
        <div className="px-3 py-1 rounded-full text-sm font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
          {diff > 0 ? '+' : ''}{Number.isInteger(diff) ? diff : diff.toFixed(2)}
        </div>
      </>
    );

    setResData({
      result: `${Math.abs(res).toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}%`,
      interpretation: `From ${valX} to ${valY} is a ${Math.abs(res).toFixed(2)}% ${isInc ? 'increase' : isDec ? 'decrease' : 'change'}`,
      badges, steps, visual, table
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-4 text-xl md:text-2xl font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-outline-variant/50 dark:border-slate-700">
        <span>From</span>
        <input type="number" value={x} onChange={e=>setX(e.target.value)} className="w-32 p-3 text-center rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-sm" placeholder="Original" />
        <span>to</span>
        <input type="number" value={y} onChange={e=>setY(e.target.value)} className="w-32 p-3 text-center rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-sm" placeholder="New" />
        <span>is what % change?</span>
      </div>
      <div className="flex justify-center">
        <button onClick={calculate} className="px-8 py-3 bg-indigo-600 dark:bg-secondary text-white font-medium rounded-xl hover:bg-indigo-700 dark:hover:bg-[#ff7a1a] transition-colors shadow-sm">Calculate</button>
      </div>
      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center">{error}</div>}
      {resData && <ResultDisplay {...resData} />}
    </div>
  );
}
