import React, { useState, useEffect } from 'react';
import { generateUniformInt } from './utils';

export default function DiceTab({ onGenerate, loadedSettings }: any) {
  const [sides, setSides] = useState('6');
  const [count, setCount] = useState('1');
  const [modifier, setModifier] = useState('0');
  
  const [result, setResult] = useState<{ rolls: number[], total: number } | null>(null);
  const [error, setError] = useState('');
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (loadedSettings) {
      setSides(loadedSettings.sides || '6');
      setCount(loadedSettings.count || '1');
      setModifier(loadedSettings.modifier || '0');
    }
  }, [loadedSettings]);

  const handleRoll = () => {
    setError('');
    const vSides = parseInt(sides);
    const vCount = parseInt(count);
    const vMod = parseInt(modifier) || 0;

    if (isNaN(vSides) || isNaN(vCount)) return setError('Please enter valid numbers.');
    if (vSides < 2 || vSides > 1000) return setError('Sides must be between 2 and 1000.');
    if (vCount < 1 || vCount > 100) return setError('Number of dice must be between 1 and 100.');

    const rolls = [];
    let sum = 0;
    for (let i = 0; i < vCount; i++) {
      const r = generateUniformInt(1, vSides);
      rolls.push(r);
      sum += r;
    }

    const total = sum + vMod;
    setResult({ rolls, total });
    setAnimKey(prev => prev + 1);
    
    onGenerate({
      tool: 'Dice',
      summary: `Rolled ${vCount}d${vSides}${vMod !== 0 ? (vMod > 0 ? '+'+vMod : vMod) : ''}: Total ${total}`,
      settings: { sides, count, modifier }
    });
  };

  const renderD6 = (val: number) => {
    const dots = [];
    if (val === 1) dots.push('col-start-2 row-start-2');
    else if (val === 2) dots.push('col-start-1 row-start-1', 'col-start-3 row-start-3');
    else if (val === 3) dots.push('col-start-1 row-start-1', 'col-start-2 row-start-2', 'col-start-3 row-start-3');
    else if (val === 4) dots.push('col-start-1 row-start-1', 'col-start-3 row-start-1', 'col-start-1 row-start-3', 'col-start-3 row-start-3');
    else if (val === 5) dots.push('col-start-1 row-start-1', 'col-start-3 row-start-1', 'col-start-2 row-start-2', 'col-start-1 row-start-3', 'col-start-3 row-start-3');
    else if (val === 6) dots.push('col-start-1 row-start-1', 'col-start-1 row-start-2', 'col-start-1 row-start-3', 'col-start-3 row-start-1', 'col-start-3 row-start-2', 'col-start-3 row-start-3');

    return (
      <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-xl border-2 border-outline-variant/50 dark:border-slate-700 shadow-sm grid grid-cols-3 grid-rows-3 p-2 gap-1">
        {dots.map((pos, i) => (
          <div key={i} className={`w-full h-full bg-slate-800 dark:bg-slate-200 rounded-full ${pos}`}></div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Quick Presets</label>
          <div className="flex flex-wrap gap-2">
            {[4, 6, 8, 10, 12, 20, 100].map(d => (
              <button key={d} onClick={() => setSides(d.toString())} className={`px-4 py-2 rounded-lg font-medium transition-colors ${sides === d.toString() ? 'bg-indigo-600 dark:bg-secondary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>d{d}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Number of Dice</label>
          <input type="number" min="1" max="100" value={count} onChange={e=>setCount(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Custom Die Sides</label>
          <input type="number" min="2" max="1000" value={sides} onChange={e=>setSides(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">+ Modifier</label>
          <input type="number" value={modifier} onChange={e=>setModifier(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      <button onClick={handleRoll} className="w-full py-4 bg-indigo-600 dark:bg-secondary text-white text-lg font-bold rounded-xl hover:bg-indigo-700 dark:hover:bg-[#ff7a1a] transition-colors shadow-sm">
        Roll Dice
      </button>

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center">{error}</div>}

      {result && (
        <div key={animKey} className="mt-8 p-8 bg-slate-50 dark:bg-slate-800/80 rounded-3xl dark:rounded-xl border border-outline-variant/50 dark:border-slate-700 text-center animate-in zoom-in-95 duration-300">
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Total Result</div>
          <div className="text-7xl md:text-9xl font-black text-indigo-600 dark:text-secondary tracking-tighter mb-8">{result.total}</div>
          
          <div className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            Dice: {result.rolls.join(' + ')} = {result.rolls.reduce((a,b)=>a+b,0)}
            {parseInt(modifier) !== 0 && `, Modifier: ${parseInt(modifier) > 0 ? '+' : ''}${modifier}`}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {result.rolls.map((r, i) => (
              parseInt(sides) === 6 ? (
                <div key={i} className="animate-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 50}ms` }}>{renderD6(r)}</div>
              ) : (
                <div key={i} className="w-16 h-16 bg-white dark:bg-slate-800 rounded-xl border-2 border-outline-variant/50 dark:border-slate-700 shadow-sm flex items-center justify-center text-2xl font-bold text-slate-800 dark:text-slate-200 animate-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 50}ms` }}>
                  {r}
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
