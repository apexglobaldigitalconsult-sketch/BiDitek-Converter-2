import React, { useState } from 'react';
import ResultDisplay from './ResultDisplay';

export default function ReversePctTab() {
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [resData, setResData] = useState<any>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError(''); setResData(null);
    if (!x || !y) return setError('Please fill in all fields.');
    const valX = parseFloat(x); const valY = parseFloat(y);
    if (isNaN(valX) || isNaN(valY)) return setError('Please enter valid numbers.');
    if (valX === -100) return setError('Percentage change cannot be -100% as it results in division by zero.');

    const orig = valY / (1 + valX / 100);
    
    const steps = (
      <>
        <p><strong>Formula:</strong> Original = Result ÷ (1 + % Change ÷ 100)</p>
        <p><strong>Substitute:</strong> {valY} ÷ (1 + {valX} ÷ 100)</p>
        <p><strong>Step 1:</strong> {valX} ÷ 100 = {valX/100}</p>
        <p><strong>Step 2:</strong> 1 + ({valX/100}) = {1+valX/100}</p>
        <p><strong>Step 3:</strong> {valY} ÷ {1+valX/100} = {orig}</p>
        <p><strong>Answer:</strong> The original value was {orig}</p>
      </>
    );

    const maxVal = Math.max(orig, valY, 0);
    const minVal = Math.min(orig, valY, 0);
    const range = maxVal - minVal || 1;
    const pctOrig = ((orig - minVal) / range) * 100;
    const pctRes = ((valY - minVal) / range) * 100;

    const visual = (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="w-20 text-sm font-medium text-slate-500">Original</span>
          <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-6 relative">
            <div className="absolute left-0 top-0 bottom-0 bg-slate-400 rounded-full transition-all" style={{ width: `${pctOrig}%` }}></div>
          </div>
          <span className="w-16 text-right font-bold">{Number.isInteger(orig) ? orig : orig.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-20 text-sm font-medium text-slate-500">Result</span>
          <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-6 relative">
            <div className="absolute left-0 top-0 bottom-0 bg-indigo-500 rounded-full transition-all" style={{ width: `${pctRes}%` }}></div>
          </div>
          <span className="w-16 text-right font-bold">{valY}</span>
        </div>
      </div>
    );

    setResData({
      result: Number.isInteger(orig) ? orig : orig.toFixed(4).replace(/0+$/, '').replace(/\.$/, ''),
      interpretation: `${valY} is the result after a ${valX}% change. The original value was ${Number.isInteger(orig) ? orig : orig.toFixed(2)}.`,
      steps, visual
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-4 text-xl md:text-2xl font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-outline-variant/50 dark:border-slate-700">
        <input type="number" value={y} onChange={e=>setY(e.target.value)} className="w-32 p-3 text-center rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-sm" placeholder="Result" />
        <span>is the result after a</span>
        <div className="relative">
          <input type="number" value={x} onChange={e=>setX(e.target.value)} className="w-32 p-3 text-center rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-sm" placeholder="% Change" />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">%</span>
        </div>
        <span>change.</span>
        <div className="w-full text-center mt-2 text-lg text-slate-500">What was the original value?</div>
      </div>
      <div className="flex justify-center">
        <button onClick={calculate} className="px-8 py-3 bg-indigo-600 dark:bg-secondary text-white font-medium rounded-xl hover:bg-indigo-700 dark:hover:bg-[#ff7a1a] transition-colors shadow-sm">Calculate</button>
      </div>
      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center">{error}</div>}
      {resData && <ResultDisplay {...resData} />}
    </div>
  );
}
