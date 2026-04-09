import React, { useState, useEffect } from 'react';
import { cryptoShuffle } from './utils';

export default function PickerTab({ onGenerate, loadedSettings }: any) {
  const [list, setList] = useState('');
  const [count, setCount] = useState('1');
  const [allowDupes, setAllowDupes] = useState(false);
  
  const [result, setResult] = useState<string[] | null>(null);
  const [error, setError] = useState('');
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (loadedSettings) {
      setList(loadedSettings.list || '');
      setCount(loadedSettings.count || '1');
      setAllowDupes(loadedSettings.allowDupes || false);
    }
  }, [loadedSettings]);

  const handlePick = () => {
    setError('');
    const vCount = parseInt(count);

    if (isNaN(vCount) || vCount < 1 || vCount > 500) return setError('Please enter a valid number to pick (1-500).');

    const items = list.split(/\r?\n|,/).map(s => s.trim()).filter(s => s.length > 0);
    if (items.length === 0) return setError('Please enter at least one item in the list.');

    let res: string[] = [];

    if (allowDupes) {
      for (let i = 0; i < vCount; i++) {
        res.push(items[Math.floor(Math.random() * items.length)]);
      }
    } else {
      if (vCount > items.length) return setError(`Cannot pick ${vCount} unique items from a list of ${items.length}.`);
      res = cryptoShuffle<string>(items).slice(0, vCount);
    }

    setResult(res);
    setAnimKey(prev => prev + 1);
    
    let summary = res.length === 1 ? res[0] : `Picked ${res.length} items`;
    onGenerate({
      tool: 'Picker',
      summary,
      settings: { list, count, allowDupes }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Items List</label>
        <textarea 
          value={list} 
          onChange={e=>setList(e.target.value)} 
          className="w-full h-40 p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 resize-y"
          placeholder="Enter items here..."
        ></textarea>
        <p className="text-xs text-slate-500 mt-1">Enter any names, words, or items — one per line or separated by commas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">How Many to Pick</label>
          <input type="number" min="1" max="500" value={count} onChange={e=>setCount(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="flex items-center h-full pt-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={allowDupes} onChange={e=>setAllowDupes(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Allow Duplicates</span>
          </label>
        </div>
      </div>

      <button onClick={handlePick} className="w-full py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
        Pick Random Item{parseInt(count) > 1 ? 's' : ''}
      </button>

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center">{error}</div>}

      {result && (
        <div key={animKey} className="mt-8 animate-in zoom-in-95 duration-300">
          {result.length === 1 ? (
            <div className="p-12 bg-slate-50 dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700 flex justify-center items-center text-center">
              <span className="text-4xl md:text-6xl font-black text-indigo-600 dark:text-indigo-400 break-words">{result[0]}</span>
            </div>
          ) : (
            <div className="p-6 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-medium text-slate-500 mb-4">Picked {result.length} items:</h3>
              <div className="flex flex-wrap gap-3">
                {result.map((item, i) => (
                  <div key={i} className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-medium text-slate-800 dark:text-slate-200 shadow-sm animate-in slide-in-from-bottom-4" style={{ animationDelay: `${Math.min(i * 30, 1000)}ms` }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
