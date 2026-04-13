import React, { useState } from 'react';
import { Calculator, FunctionSquare, Binary, BarChart2, LineChart, History, ArrowRightLeft, BookOpen, Copy, Check } from 'lucide-react';
import ScientificMode from './ScientificMode';
import AdvancedMode from './AdvancedMode';
import ProgrammerMode from './ProgrammerMode';
import StatisticsMode from './StatisticsMode';
import GraphMode from './GraphMode';
import { SCIENTIFIC_CONSTANTS, UNIT_CATEGORIES } from './constants';

type Mode = 'scientific' | 'advanced' | 'programmer' | 'statistics' | 'graph';

export default function ScientificCalculator() {
  const [mode, setMode] = useState<Mode>('scientific');
  const [history, setHistory] = useState<{expr: string, res: string, time: Date}[]>([]);
  const [activePanel, setActivePanel] = useState<'history'|'units'|'constants'|null>(null);

  const handleHistoryAdd = (expr: string, res: string) => {
    setHistory(prev => [{expr, res, time: new Date()}, ...prev].slice(0, 50));
  };

  const tabs = [
    { id: 'scientific', label: 'Scientific', icon: Calculator },
    { id: 'advanced', label: 'Advanced', icon: FunctionSquare },
    { id: 'programmer', label: 'Programmer', icon: Binary },
    { id: 'statistics', label: 'Statistics', icon: BarChart2 },
    { id: 'graph', label: 'Graph', icon: LineChart },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Scientific Calculator</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">A comprehensive suite of mathematical tools.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Calculator Area */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="flex overflow-x-auto bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-outline-variant/50 dark:border-slate-700 mb-6 hide-scrollbar">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMode(tab.id as Mode)}
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

          {/* Active Mode Content */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-outline-variant/50 dark:border-slate-800">
            {mode === 'scientific' && <ScientificMode onHistoryAdd={handleHistoryAdd} />}
            {mode === 'advanced' && <AdvancedMode />}
            {mode === 'programmer' && <ProgrammerMode />}
            {mode === 'statistics' && <StatisticsMode />}
            {mode === 'graph' && <GraphMode />}
          </div>
        </div>

        {/* Side Panels */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-outline-variant/50 dark:border-slate-700">
            <button onClick={() => setActivePanel(p => p==='history'?null:'history')} className={`flex-1 py-2 flex justify-center items-center rounded-lg transition-colors ${activePanel==='history'?'bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-secondary':'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`} title="History"><History className="w-5 h-5" /></button>
            <button onClick={() => setActivePanel(p => p==='units'?null:'units')} className={`flex-1 py-2 flex justify-center items-center rounded-lg transition-colors ${activePanel==='units'?'bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-secondary':'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`} title="Unit Converter"><ArrowRightLeft className="w-5 h-5" /></button>
            <button onClick={() => setActivePanel(p => p==='constants'?null:'constants')} className={`flex-1 py-2 flex justify-center items-center rounded-lg transition-colors ${activePanel==='constants'?'bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-secondary':'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`} title="Constants"><BookOpen className="w-5 h-5" /></button>
          </div>

          {activePanel === 'history' && (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-outline-variant/50 dark:border-slate-700 flex flex-col h-[500px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">History</h3>
                <button onClick={() => setHistory([])} className="text-xs text-red-500 hover:text-red-600">Clear</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {history.length === 0 ? <p className="text-sm text-slate-500 text-center mt-10">No history yet</p> : history.map((h, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-indigo-300 transition-colors">
                    <div className="text-xs text-slate-400 mb-1">{h.time.toLocaleTimeString()}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300 break-all">{h.expr}</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white break-all">={h.res}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePanel === 'units' && <UnitConverterPanel />}
          {activePanel === 'constants' && <ConstantsPanel />}
        </div>
      </div>
    </div>
  );
}

function UnitConverterPanel() {
  const [category, setCategory] = useState(Object.keys(UNIT_CATEGORIES)[0]);
  const [fromUnit, setFromUnit] = useState(Object.keys(UNIT_CATEGORIES[category as keyof typeof UNIT_CATEGORIES].units)[0]);
  const [toUnit, setToUnit] = useState(Object.keys(UNIT_CATEGORIES[category as keyof typeof UNIT_CATEGORIES].units)[1]);
  const [val, setVal] = useState('1');

  const handleCategoryChange = (c: string) => {
    setCategory(c);
    const units = Object.keys(UNIT_CATEGORIES[c as keyof typeof UNIT_CATEGORIES].units);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  };

  const convert = () => {
    const num = Number(val);
    if (isNaN(num)) return '';
    const catData = UNIT_CATEGORIES[category as keyof typeof UNIT_CATEGORIES].units as any;
    const from = catData[fromUnit];
    const to = catData[toUnit];
    
    let baseVal = 0;
    if (typeof from === 'object') baseVal = from.toBase(num);
    else baseVal = num * from;

    let res = 0;
    if (typeof to === 'object') res = to.fromBase(baseVal);
    else res = baseVal / to;

    return res.toPrecision(7).replace(/\.0+$/, '');
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-outline-variant/50 dark:border-slate-700">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Unit Converter</h3>
      <select value={category} onChange={e => handleCategoryChange(e.target.value)} className="w-full mb-4 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
        {Object.keys(UNIT_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      
      <div className="space-y-4">
        <div>
          <input type="number" value={val} onChange={e => setVal(e.target.value)} className="w-full p-2 rounded-t-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
          <select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className="w-full p-2 rounded-b-lg border-x border-b border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
            {Object.keys(UNIT_CATEGORIES[category as keyof typeof UNIT_CATEGORIES].units).map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        
        <div className="flex justify-center">
          <button onClick={() => {const t=fromUnit; setFromUnit(toUnit); setToUnit(t);}} className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"><ArrowRightLeft className="w-4 h-4 text-slate-600 dark:text-slate-300 rotate-90" /></button>
        </div>

        <div>
          <div className="w-full p-2 rounded-t-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono break-all min-h-[42px]">{convert()}</div>
          <select value={toUnit} onChange={e => setToUnit(e.target.value)} className="w-full p-2 rounded-b-lg border-x border-b border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
            {Object.keys(UNIT_CATEGORIES[category as keyof typeof UNIT_CATEGORIES].units).map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}

function ConstantsPanel() {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string|null>(null);

  const filtered = SCIENTIFIC_CONSTANTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.symbol.toLowerCase().includes(search.toLowerCase()));

  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-outline-variant/50 dark:border-slate-700 flex flex-col h-[500px]">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Constants</h3>
      <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full mb-4 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm" />
      
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {filtered.map((c, i) => (
          <div key={i} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex justify-between items-center group">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-indigo-600 dark:text-secondary">{c.symbol}</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{c.name}</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">{c.value} {c.unit}</div>
            </div>
            <button onClick={() => handleCopy(c.value)} className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 opacity-0 group-hover:opacity-100 transition-all">
              {copied === c.value ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
