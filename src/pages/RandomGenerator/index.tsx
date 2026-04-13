import React, { useState } from 'react';
import { Hash, ListOrdered, Dices, MousePointerClick, CircleDot, Ticket, Info, History as HistoryIcon, Trash2, RefreshCw } from 'lucide-react';
import NumberTab from './NumberTab';
import ListTab from './ListTab';
import DiceTab from './DiceTab';
import PickerTab from './PickerTab';
import CoinTab from './CoinTab';
import LotteryTab from './LotteryTab';

export type HistoryEntry = {
  id: string;
  timestamp: Date;
  tool: string;
  summary: string;
  settings: any;
};

export default function RandomGenerator() {
  const [mode, setMode] = useState('number');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showRandomNote, setShowRandomNote] = useState(false);
  const [loadedSettings, setLoadedSettings] = useState<any>(null);

  const addHistory = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    setHistory(prev => [
      { ...entry, id: Math.random().toString(36).substr(2, 9), timestamp: new Date() },
      ...prev
    ].slice(0, 20));
  };

  const loadSettings = (tool: string, settings: any) => {
    setMode(tool);
    setLoadedSettings({ ...settings, _t: Date.now() }); // Force re-render with new settings
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Random Number Generator</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Generate numbers, lists, dice rolls, coin flips, and lottery picks.</p>
      </div>

      <div className="flex overflow-x-auto bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-outline-variant/50 dark:border-slate-700 mb-6 hide-scrollbar">
        {[
          { id: 'number', label: 'Number', icon: Hash },
          { id: 'list', label: 'List', icon: ListOrdered },
          { id: 'dice', label: 'Dice', icon: Dices },
          { id: 'picker', label: 'Picker', icon: MousePointerClick },
          { id: 'coin', label: 'Coin / Decider', icon: CircleDot },
          { id: 'lottery', label: 'Lottery', icon: Ticket },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                mode === tab.id
                  ? 'bg-indigo-50 dark:bg-secondary/30 text-indigo-600 dark:text-secondary'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-outline-variant/50 dark:border-slate-700">
            {mode === 'number' && <NumberTab onGenerate={addHistory} loadedSettings={loadedSettings} />}
            {mode === 'list' && <ListTab onGenerate={addHistory} loadedSettings={loadedSettings} />}
            {mode === 'dice' && <DiceTab onGenerate={addHistory} loadedSettings={loadedSettings} />}
            {mode === 'picker' && <PickerTab onGenerate={addHistory} loadedSettings={loadedSettings} />}
            {mode === 'coin' && <CoinTab onGenerate={addHistory} loadedSettings={loadedSettings} />}
            {mode === 'lottery' && <LotteryTab onGenerate={addHistory} loadedSettings={loadedSettings} />}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-outline-variant/50 dark:border-slate-700 overflow-hidden">
            <button 
              onClick={() => setShowRandomNote(!showRandomNote)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <Info className="w-5 h-5 text-indigo-500" />
                About True Randomness
              </div>
            </button>
            {showRandomNote && (
              <div className="p-6 text-sm text-slate-600 dark:text-slate-400 space-y-3">
                <p>This generator primarily uses JavaScript's <code>Math.random()</code>, which is a <strong>Pseudorandom Number Generator (PRNG)</strong>.</p>
                <p>While perfectly suitable for games, casual decisions, and general use, it is <strong>not</strong> cryptographically secure. Do not use these results for generating passwords, encryption keys, or security tokens.</p>
                <p>For operations requiring stronger randomness (like the "No Duplicates" shuffle mode), this tool utilizes <code>window.crypto.getRandomValues()</code>, which provides cryptographically secure random numbers.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-outline-variant/50 dark:border-slate-700 flex flex-col h-[600px]">
            <div className="p-4 border-b border-outline-variant/50 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-t-2xl">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <HistoryIcon className="w-5 h-5 text-slate-500" />
                History
              </h3>
              {history.length > 0 && (
                <button onClick={() => setHistory([])} className="text-slate-400 hover:text-red-500 transition-colors" title="Clear History">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {history.length === 0 ? (
                <div className="text-center text-slate-500 dark:text-slate-400 mt-10">
                  No history yet. Generate something!
                </div>
              ) : (
                history.map(entry => (
                  <div key={entry.id} className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-indigo-600 dark:text-secondary uppercase tracking-wider">{entry.tool}</span>
                      <span className="text-xs text-slate-400">{entry.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3 break-words">
                      {entry.summary}
                    </div>
                    <button 
                      onClick={() => loadSettings(entry.tool.toLowerCase(), entry.settings)}
                      className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-secondary transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" /> Re-use Settings
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
