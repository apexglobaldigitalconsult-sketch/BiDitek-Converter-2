import React, { useState, useEffect } from 'react';

export default function CoinTab({ onGenerate, loadedSettings }: any) {
  const [subMode, setSubMode] = useState<'coin' | 'decider'>('coin');
  
  // Coin state
  const [flips, setFlips] = useState('1');
  const [coinResult, setCoinResult] = useState<string[] | null>(null);
  const [coinAnimKey, setCoinAnimKey] = useState(0);
  const [coinError, setCoinError] = useState('');

  // Decider state
  const [question, setQuestion] = useState('');
  const [deciderResult, setDeciderResult] = useState<string | null>(null);
  const [deciderAnimKey, setDeciderAnimKey] = useState(0);

  useEffect(() => {
    if (loadedSettings) {
      if (loadedSettings.subMode) setSubMode(loadedSettings.subMode);
      if (loadedSettings.flips) setFlips(loadedSettings.flips);
      if (loadedSettings.question !== undefined) setQuestion(loadedSettings.question);
    }
  }, [loadedSettings]);

  const handleFlip = () => {
    setCoinError('');
    const vFlips = parseInt(flips);
    if (isNaN(vFlips) || vFlips < 1 || vFlips > 1000) return setCoinError('Please enter a valid number of flips (1-1000).');

    const res = [];
    for (let i = 0; i < vFlips; i++) {
      res.push(Math.random() < 0.5 ? 'Heads' : 'Tails');
    }

    setCoinResult(res);
    setCoinAnimKey(prev => prev + 1);
    
    let summary = res.length === 1 ? res[0] : `${res.filter(r=>r==='Heads').length} Heads, ${res.filter(r=>r==='Tails').length} Tails`;
    onGenerate({
      tool: 'Coin Flip',
      summary,
      settings: { subMode: 'coin', flips }
    });
  };

  const handleDecide = () => {
    const res = Math.random() < 0.5 ? 'YES' : 'NO';
    setDeciderResult(res);
    setDeciderAnimKey(prev => prev + 1);
    
    onGenerate({
      tool: 'Decider',
      summary: question ? `Q: ${question} -> ${res}` : res,
      settings: { subMode: 'decider', question }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl mb-6">
        <button onClick={() => setSubMode('coin')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${subMode === 'coin' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Coin Flip</button>
        <button onClick={() => setSubMode('decider')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${subMode === 'decider' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Yes / No Decider</button>
      </div>

      {subMode === 'coin' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Number of Flips</label>
            <input type="number" min="1" max="1000" value={flips} onChange={e=>setFlips(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button onClick={handleFlip} className="w-full py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
            Flip Coin
          </button>
          {coinError && <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center">{coinError}</div>}

          {coinResult && (
            <div key={coinAnimKey} className="mt-8">
              {coinResult.length === 1 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 border-4 border-amber-600 shadow-xl flex items-center justify-center animate-[flip_1s_ease-out]">
                    <span className="text-5xl font-black text-amber-900">{coinResult[0] === 'Heads' ? 'H' : 'T'}</span>
                  </div>
                  <div className="mt-8 text-4xl font-bold text-slate-800 dark:text-slate-200">{coinResult[0]}</div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                      {coinResult.filter(r=>r==='Heads').length} Heads, {coinResult.filter(r=>r==='Tails').length} Tails
                    </div>
                    <div className="w-full h-8 flex rounded-full overflow-hidden">
                      <div className="bg-amber-400 flex items-center justify-center text-amber-900 text-xs font-bold transition-all" style={{ width: `${(coinResult.filter(r=>r==='Heads').length / coinResult.length) * 100}%` }}>Heads</div>
                      <div className="bg-slate-400 flex items-center justify-center text-slate-900 text-xs font-bold transition-all" style={{ width: `${(coinResult.filter(r=>r==='Tails').length / coinResult.length) * 100}%` }}>Tails</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center max-h-64 overflow-y-auto p-2">
                    {coinResult.map((r, i) => (
                      <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${r === 'Heads' ? 'bg-amber-400 text-amber-900' : 'bg-slate-300 text-slate-800'}`}>
                        {r === 'Heads' ? 'H' : 'T'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {subMode === 'decider' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Question (optional)</label>
            <input type="text" value={question} onChange={e=>setQuestion(e.target.value)} placeholder="e.g. Should I go to the gym today?" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button onClick={handleDecide} className="w-full py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
            Decide
          </button>

          {deciderResult && (
            <div key={deciderAnimKey} className="mt-8 p-12 bg-slate-50 dark:bg-slate-800/80 rounded-3xl border border-slate-200 dark:border-slate-700 text-center animate-in zoom-in-95 duration-300">
              {question && <div className="text-xl text-slate-600 dark:text-slate-400 mb-6 italic">"{question}"</div>}
              <div className={`text-7xl md:text-9xl font-black tracking-tighter ${deciderResult === 'YES' ? 'text-green-500' : 'text-red-500'}`}>
                {deciderResult}
              </div>
            </div>
          )}
        </div>
      )}
      
      <style>{`
        @keyframes flip {
          0% { transform: rotateY(0deg) scale(1); }
          50% { transform: rotateY(720deg) scale(1.5); }
          100% { transform: rotateY(1440deg) scale(1); }
        }
      `}</style>
    </div>
  );
}
