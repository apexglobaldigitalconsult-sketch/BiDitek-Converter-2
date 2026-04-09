import React, { useState, useEffect } from 'react';
import { generateUniformInt, generateUniformDec, cryptoShuffle } from './utils';
import StatsPanel from './StatsPanel';
import { Copy, Download } from 'lucide-react';

export default function NumberTab({ onGenerate, loadedSettings }: any) {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [type, setType] = useState<'int' | 'dec'>('int');
  const [decimals, setDecimals] = useState('2');
  const [qty, setQty] = useState('1');
  const [noDupes, setNoDupes] = useState(false);
  
  const [result, setResult] = useState<number[] | null>(null);
  const [error, setError] = useState('');
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (loadedSettings) {
      setMin(loadedSettings.min || '1');
      setMax(loadedSettings.max || '100');
      setType(loadedSettings.type || 'int');
      setDecimals(loadedSettings.decimals || '2');
      setQty(loadedSettings.qty || '1');
      setNoDupes(loadedSettings.noDupes || false);
    }
  }, [loadedSettings]);

  const handleGenerate = () => {
    setError('');
    const vMin = parseFloat(min);
    const vMax = parseFloat(max);
    const vQty = parseInt(qty);
    const vDec = parseInt(decimals);

    if (isNaN(vMin) || isNaN(vMax) || isNaN(vQty)) return setError('Please enter valid numbers.');
    if (vMin > vMax) return setError('Minimum value cannot be greater than maximum value.');
    if (vQty < 1 || vQty > 10000) return setError('Quantity must be between 1 and 10,000.');

    let res: number[] = [];

    if (noDupes) {
      if (type === 'dec') {
        return setError('No duplicates is not supported for decimal numbers.');
      }
      const rangeSize = vMax - vMin + 1;
      if (vQty > rangeSize) {
        return setError(`Cannot generate ${vQty} unique numbers in a range of ${rangeSize}.`);
      }
      
      // Generate array and shuffle
      const arr = Array.from({ length: rangeSize }, (_, i) => vMin + i);
      res = cryptoShuffle(arr).slice(0, vQty);
    } else {
      for (let i = 0; i < vQty; i++) {
        if (type === 'int') {
          res.push(generateUniformInt(vMin, vMax));
        } else {
          res.push(generateUniformDec(vMin, vMax, Math.max(1, Math.min(10, vDec))));
        }
      }
    }

    setResult(res);
    setAnimKey(prev => prev + 1);
    
    let summary = res.length === 1 ? `${res[0]}` : `${res.length} numbers between ${vMin} and ${vMax}`;
    onGenerate({
      tool: 'Number',
      summary,
      settings: { min, max, type, decimals, qty, noDupes }
    });
  };

  const copyToClipboard = () => {
    if (result) navigator.clipboard.writeText(result.join(', '));
  };

  const downloadTxt = () => {
    if (!result) return;
    const blob = new Blob([result.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'random_numbers.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Minimum Value</label>
          <input type="number" value={min} onChange={e=>setMin(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Maximum Value</label>
          <input type="number" value={max} onChange={e=>setMax(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Number Type</label>
          <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
            <button onClick={() => setType('int')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${type === 'int' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Integer</button>
            <button onClick={() => setType('dec')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${type === 'dec' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Decimal</button>
          </div>
        </div>

        {type === 'dec' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Decimal Places (1-10)</label>
            <input type="number" min="1" max="10" value={decimals} onChange={e=>setDecimals(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantity</label>
          <input type="number" min="1" max="10000" value={qty} onChange={e=>setQty(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div className="flex items-center h-full pt-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={noDupes} onChange={e=>setNoDupes(e.target.checked)} disabled={type === 'dec'} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50" />
            <span className={`text-sm font-medium ${type === 'dec' ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>No Duplicates</span>
          </label>
        </div>
      </div>

      <button onClick={handleGenerate} className="w-full py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
        Generate Number{parseInt(qty) > 1 ? 's' : ''}
      </button>

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center">{error}</div>}

      {result && (
        <div key={animKey} className="mt-8 animate-in zoom-in-95 duration-300">
          {result.length === 1 ? (
            <div className="p-12 bg-slate-50 dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700 flex justify-center items-center">
              <span className="text-7xl md:text-9xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">{result[0]}</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Generated {result.length} numbers</span>
                <div className="flex gap-2">
                  <button onClick={copyToClipboard} className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"><Copy className="w-4 h-4" /> Copy</button>
                  <button onClick={downloadTxt} className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"><Download className="w-4 h-4" /> Save</button>
                </div>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 max-h-96 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {result.map((n, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg font-mono text-slate-800 dark:text-slate-200 shadow-sm">{n}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <StatsPanel data={result} />
        </div>
      )}
    </div>
  );
}
