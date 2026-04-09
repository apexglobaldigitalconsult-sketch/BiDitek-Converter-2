import React, { useState, useEffect } from 'react';
import { cryptoShuffle } from './utils';

const PRESETS = {
  custom: { label: 'Custom', mainCount: 5, mainMin: 1, mainMax: 69, hasBonus: true, bonusCount: 1, bonusMin: 1, bonusMax: 26 },
  powerball: { label: 'Powerball', mainCount: 5, mainMin: 1, mainMax: 69, hasBonus: true, bonusCount: 1, bonusMin: 1, bonusMax: 26 },
  megaMillions: { label: 'Mega Millions', mainCount: 5, mainMin: 1, mainMax: 70, hasBonus: true, bonusCount: 1, bonusMin: 1, bonusMax: 25 },
  euroMillions: { label: 'EuroMillions', mainCount: 5, mainMin: 1, mainMax: 50, hasBonus: true, bonusCount: 2, bonusMin: 1, bonusMax: 12 },
  ukLotto: { label: 'UK Lotto', mainCount: 6, mainMin: 1, mainMax: 59, hasBonus: false, bonusCount: 0, bonusMin: 0, bonusMax: 0 },
  pick3: { label: 'Pick 3', mainCount: 3, mainMin: 0, mainMax: 9, hasBonus: false, bonusCount: 0, bonusMin: 0, bonusMax: 0 },
  pick4: { label: 'Pick 4', mainCount: 4, mainMin: 0, mainMax: 9, hasBonus: false, bonusCount: 0, bonusMin: 0, bonusMax: 0 },
};

export default function LotteryTab({ onGenerate, loadedSettings }: any) {
  const [format, setFormat] = useState<keyof typeof PRESETS>('powerball');
  const [lines, setLines] = useState('1');
  
  // Custom settings
  const [mainCount, setMainCount] = useState(PRESETS.powerball.mainCount.toString());
  const [mainMin, setMainMin] = useState(PRESETS.powerball.mainMin.toString());
  const [mainMax, setMainMax] = useState(PRESETS.powerball.mainMax.toString());
  const [hasBonus, setHasBonus] = useState(PRESETS.powerball.hasBonus);
  const [bonusCount, setBonusCount] = useState(PRESETS.powerball.bonusCount.toString());
  const [bonusMin, setBonusMin] = useState(PRESETS.powerball.bonusMin.toString());
  const [bonusMax, setBonusMax] = useState(PRESETS.powerball.bonusMax.toString());

  const [result, setResult] = useState<{ main: number[], bonus: number[] }[] | null>(null);
  const [error, setError] = useState('');
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (loadedSettings) {
      setFormat(loadedSettings.format || 'powerball');
      setLines(loadedSettings.lines || '1');
      if (loadedSettings.format === 'custom') {
        setMainCount(loadedSettings.mainCount);
        setMainMin(loadedSettings.mainMin);
        setMainMax(loadedSettings.mainMax);
        setHasBonus(loadedSettings.hasBonus);
        setBonusCount(loadedSettings.bonusCount);
        setBonusMin(loadedSettings.bonusMin);
        setBonusMax(loadedSettings.bonusMax);
      }
    }
  }, [loadedSettings]);

  const handleFormatChange = (e: any) => {
    const f = e.target.value as keyof typeof PRESETS;
    setFormat(f);
    if (f !== 'custom') {
      const p = PRESETS[f];
      setMainCount(p.mainCount.toString());
      setMainMin(p.mainMin.toString());
      setMainMax(p.mainMax.toString());
      setHasBonus(p.hasBonus);
      setBonusCount(p.bonusCount.toString());
      setBonusMin(p.bonusMin.toString());
      setBonusMax(p.bonusMax.toString());
    }
  };

  const handleGenerate = () => {
    setError('');
    const vLines = parseInt(lines);
    const vMainCount = parseInt(mainCount);
    const vMainMin = parseInt(mainMin);
    const vMainMax = parseInt(mainMax);
    const vBonusCount = parseInt(bonusCount);
    const vBonusMin = parseInt(bonusMin);
    const vBonusMax = parseInt(bonusMax);

    if (isNaN(vLines) || vLines < 1 || vLines > 20) return setError('Lines must be between 1 and 20.');
    if (isNaN(vMainCount) || isNaN(vMainMin) || isNaN(vMainMax)) return setError('Invalid main number settings.');
    if (hasBonus && (isNaN(vBonusCount) || isNaN(vBonusMin) || isNaN(vBonusMax))) return setError('Invalid bonus number settings.');

    const mainRange = vMainMax - vMainMin + 1;
    if (vMainCount > mainRange && format !== 'pick3' && format !== 'pick4') return setError(`Cannot pick ${vMainCount} unique numbers from a range of ${mainRange}.`);
    
    if (hasBonus) {
      const bonusRange = vBonusMax - vBonusMin + 1;
      if (vBonusCount > bonusRange) return setError(`Cannot pick ${vBonusCount} unique bonus numbers from a range of ${bonusRange}.`);
    }

    const res = [];
    for (let i = 0; i < vLines; i++) {
      let main: number[] = [];
      if (format === 'pick3' || format === 'pick4') {
        // Allow duplicates for Pick 3 / Pick 4
        for(let j=0; j<vMainCount; j++) {
          main.push(Math.floor(Math.random() * (vMainMax - vMainMin + 1)) + vMainMin);
        }
      } else {
        const mainArr = Array.from({ length: mainRange }, (_, i) => vMainMin + i);
        main = cryptoShuffle(mainArr).slice(0, vMainCount).sort((a, b) => a - b);
      }

      let bonus: number[] = [];
      if (hasBonus) {
        const bonusArr = Array.from({ length: vBonusMax - vBonusMin + 1 }, (_, i) => vBonusMin + i);
        bonus = cryptoShuffle(bonusArr).slice(0, vBonusCount).sort((a, b) => a - b);
      }

      res.push({ main, bonus });
    }

    setResult(res);
    setAnimKey(prev => prev + 1);
    
    onGenerate({
      tool: 'Lottery',
      summary: `${PRESETS[format].label}: ${vLines} line${vLines > 1 ? 's' : ''}`,
      settings: { format, lines, mainCount, mainMin, mainMax, hasBonus, bonusCount, bonusMin, bonusMax }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lottery Format</label>
          <select value={format} onChange={handleFormatChange} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
            {Object.entries(PRESETS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Number of Lines</label>
          <input type="number" min="1" max="20" value={lines} onChange={e=>setLines(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      {format === 'custom' && (
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-6">
          <div>
            <h4 className="font-medium text-slate-900 dark:text-white mb-4">Main Numbers</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Count</label>
                <input type="number" value={mainCount} onChange={e=>setMainCount(e.target.value)} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Min</label>
                <input type="number" value={mainMin} onChange={e=>setMainMin(e.target.value)} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Max</label>
                <input type="number" value={mainMax} onChange={e=>setMainMax(e.target.value)} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-slate-900 dark:text-white">Bonus Numbers</h4>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hasBonus} onChange={e=>setHasBonus(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm">Include</span>
              </label>
            </div>
            {hasBonus && (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Count</label>
                  <input type="number" value={bonusCount} onChange={e=>setBonusCount(e.target.value)} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Min</label>
                  <input type="number" value={bonusMin} onChange={e=>setBonusMin(e.target.value)} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Max</label>
                  <input type="number" value={bonusMax} onChange={e=>setBonusMax(e.target.value)} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <button onClick={handleGenerate} className="w-full py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
        Generate Numbers
      </button>

      {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center">{error}</div>}

      {result && (
        <div key={animKey} className="mt-8 space-y-4">
          {result.map((line, idx) => (
            <div key={idx} className="p-6 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4 animate-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider w-16 text-center sm:text-left">Line {idx + 1}</div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 flex-1">
                {line.main.map((n, i) => (
                  <div key={`m-${i}`} className="w-12 h-12 rounded-full bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center font-bold text-lg text-slate-800 dark:text-slate-200 shadow-sm">
                    {n}
                  </div>
                ))}
                {line.bonus.map((n, i) => (
                  <div key={`b-${i}`} className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 border-2 border-indigo-300 dark:border-indigo-700 flex items-center justify-center font-bold text-lg text-indigo-700 dark:text-indigo-300 shadow-sm ml-2">
                    {n}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
