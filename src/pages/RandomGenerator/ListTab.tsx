import React, { useState, useEffect } from 'react';
import { generateUniformInt, generateUniformDec, generateNormal, generateWeighted, cryptoShuffle } from './utils';
import StatsPanel from './StatsPanel';
import { Copy, Download, Plus, Trash2 } from 'lucide-react';

export default function ListTab({ onGenerate, loadedSettings }: any) {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [type, setType] = useState<'int' | 'dec'>('int');
  const [decimals, setDecimals] = useState('2');
  const [qty, setQty] = useState('10');
  const [noDupes, setNoDupes] = useState(false);
  const [sort, setSort] = useState<'none' | 'asc' | 'desc'>('none');
  const [dist, setDist] = useState<'uniform' | 'normal' | 'weighted'>('uniform');
  
  // Normal dist params
  const [mean, setMean] = useState('');
  const [stdDev, setStdDev] = useState('');

  // Weighted dist params
  const [weights, setWeights] = useState([{ value: '10', weight: '1' }, { value: '20', weight: '2' }]);

  const [result, setResult] = useState<number[] | null>(null);
  const [error, setError] = useState('');
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (loadedSettings) {
      setMin(loadedSettings.min || '1');
      setMax(loadedSettings.max || '100');
      setType(loadedSettings.type || 'int');
      setDecimals(loadedSettings.decimals || '2');
      setQty(loadedSettings.qty || '10');
      setNoDupes(loadedSettings.noDupes || false);
      setSort(loadedSettings.sort || 'none');
      setDist(loadedSettings.dist || 'uniform');
      if (loadedSettings.mean) setMean(loadedSettings.mean);
      if (loadedSettings.stdDev) setStdDev(loadedSettings.stdDev);
      if (loadedSettings.weights) setWeights(loadedSettings.weights);
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

    if (dist === 'uniform') {
      if (noDupes) {
        if (type === 'dec') return setError('No duplicates is not supported for decimal numbers.');
        const rangeSize = vMax - vMin + 1;
        if (vQty > rangeSize) return setError(`Cannot generate ${vQty} unique numbers in a range of ${rangeSize}.`);
        const arr = Array.from({ length: rangeSize }, (_, i) => vMin + i);
        res = cryptoShuffle(arr).slice(0, vQty);
      } else {
        for (let i = 0; i < vQty; i++) {
          res.push(type === 'int' ? generateUniformInt(vMin, vMax) : generateUniformDec(vMin, vMax, Math.max(1, Math.min(10, vDec))));
        }
      }
    } else if (dist === 'normal') {
      const defaultMean = (vMin + vMax) / 2;
      const defaultStdDev = (vMax - vMin) / 6;
      const vMean = mean ? parseFloat(mean) : defaultMean;
      const vStdDev = stdDev ? parseFloat(stdDev) : defaultStdDev;
      
      if (isNaN(vMean) || isNaN(vStdDev)) return setError('Invalid mean or standard deviation.');
      
      for (let i = 0; i < vQty; i++) {
        let val = generateNormal(vMin, vMax, vMean, vStdDev, type === 'int' ? 0 : Math.max(1, Math.min(10, vDec)));
        if (type === 'int') val = Math.round(val);
        res.push(val);
      }
    } else if (dist === 'weighted') {
      const parsedWeights = weights.map(w => ({ value: parseFloat(w.value), weight: parseFloat(w.weight) })).filter(w => !isNaN(w.value) && !isNaN(w.weight) && w.weight > 0);
      if (parsedWeights.length === 0) return setError('Please provide valid weights (weight > 0).');
      
      for (let i = 0; i < vQty; i++) {
        res.push(generateWeighted(parsedWeights));
      }
    }

    if (sort === 'asc') res.sort((a, b) => a - b);
    else if (sort === 'desc') res.sort((a, b) => b - a);

    setResult(res);
    setAnimKey(prev => prev + 1);
    
    onGenerate({
      tool: 'List',
      summary: `List of ${res.length} numbers (${dist} dist)`,
      settings: { min, max, type, decimals, qty, noDupes, sort, dist, mean, stdDev, weights }
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
    a.download = 'random_list.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Distribution</label>
          <select value={dist} onChange={e=>setDist(e.target.value as any)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
            <option value="uniform">Uniform (Equal)</option>
            <option value="normal">Normal (Bell Curve)</option>
            <option value="weighted">Weighted (Custom)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantity</label>
          <input type="number" min="1" max="10000" value={qty} onChange={e=>setQty(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sort Order</label>
          <select value={sort} onChange={e=>setSort(e.target.value as any)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
            <option value="none">Unsorted</option>
            <option value="asc">Ascending (A-Z)</option>
            <option value="desc">Descending (Z-A)</option>
          </select>
        </div>
      </div>

      {dist !== 'weighted' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-outline-variant/50 dark:border-slate-700">
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
            <div className="flex bg-slate-200 dark:bg-slate-600 p-1 rounded-xl">
              <button onClick={() => setType('int')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${type === 'int' ? 'bg-white dark:bg-slate-500 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-300'}`}>Integer</button>
              <button onClick={() => setType('dec')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${type === 'dec' ? 'bg-white dark:bg-slate-500 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-300'}`}>Decimal</button>
            </div>
          </div>

          {type === 'dec' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Decimal Places</label>
              <input type="number" min="1" max="10" value={decimals} onChange={e=>setDecimals(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
            </div>
          )}

          {dist === 'uniform' && (
            <div className="md:col-span-2 flex items-center h-full">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={noDupes} onChange={e=>setNoDupes(e.target.checked)} disabled={type === 'dec'} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50" />
                <span className={`text-sm font-medium ${type === 'dec' ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>No Duplicates</span>
              </label>
            </div>
          )}

          {dist === 'normal' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mean (Average)</label>
                <input type="number" value={mean} onChange={e=>setMean(e.target.value)} placeholder={`Default: ${(parseFloat(min)+parseFloat(max))/2 || ''}`} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Standard Deviation</label>
                <input type="number" value={stdDev} onChange={e=>setStdDev(e.target.value)} placeholder={`Default: ${(parseFloat(max)-parseFloat(min))/6 || ''}`} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
              </div>
            </>
          )}
        </div>
      )}

      {dist === 'weighted' && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-outline-variant/50 dark:border-slate-700 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-slate-900 dark:text-white">Weight Table</h3>
            <button onClick={() => setWeights([...weights, { value: '', weight: '1' }])} disabled={weights.length >= 10} className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50"><Plus className="w-4 h-4"/> Add Row</button>
          </div>
          {weights.map((w, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex-1">
                <input type="number" value={w.value} onChange={e => { const nw = [...weights]; nw[i].value = e.target.value; setWeights(nw); }} placeholder="Value" className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" />
              </div>
              <div className="flex-1">
                <input type="number" value={w.weight} onChange={e => { const nw = [...weights]; nw[i].weight = e.target.value; setWeights(nw); }} placeholder="Weight" className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" />
              </div>
              <button onClick={() => setWeights(weights.filter((_, idx) => idx !== i))} disabled={weights.length <= 1} className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-50"><Trash2 className="w-5 h-5"/></button>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleGenerate} className="w-full py-4 bg-indigo-600 dark:bg-secondary text-white text-lg font-bold rounded-xl hover:bg-indigo-700 dark:hover:bg-[#ff7a1a] transition-colors shadow-sm">
        Generate List
      </button>

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center">{error}</div>}

      {result && (
        <div key={animKey} className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-500">Generated {result.length} numbers</span>
              <div className="flex gap-2">
                <button onClick={copyToClipboard} className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-700 border border-outline-variant/50 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"><Copy className="w-4 h-4" /> Copy</button>
                <button onClick={downloadTxt} className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-700 border border-outline-variant/50 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"><Download className="w-4 h-4" /> Save</button>
              </div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-outline-variant/50 dark:border-slate-700 max-h-96 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {result.map((n, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-outline-variant/50 dark:border-slate-600 rounded-lg font-mono text-slate-800 dark:text-slate-200 shadow-sm">{n}</span>
                ))}
              </div>
            </div>
          </div>
          
          <StatsPanel data={result} distribution={dist} />
        </div>
      )}
    </div>
  );
}
