import React, { useState, useEffect, useMemo } from 'react';
import { CATEGORIES, UNITS, Category, convert, formatNumber } from './units';
import { Search, ArrowLeftRight, Copy, History, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface HistoryEntry {
  id: string;
  time: string;
  category: Category;
  value: number;
  fromId: string;
  toId: string;
  result: number;
}

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>('Length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>(UNITS['Length'][0].id);
  const [toUnit, setToUnit] = useState<string>(UNITS['Length'][1].id);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Reset units when category changes
  useEffect(() => {
    const units = UNITS[category];
    setFromUnit(units[0].id);
    setToUnit(units[1]?.id || units[0].id);
  }, [category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    if (!query) return;

    for (const cat of CATEGORIES) {
      const match = UNITS[cat].find(u => 
        u.name.toLowerCase().includes(query) || 
        u.symbol.toLowerCase() === query || 
        u.id.toLowerCase() === query
      );
      if (match) {
        setCategory(cat);
        setFromUnit(match.id);
        setSearchQuery('');
        return;
      }
    }
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const parsedValue = parseFloat(inputValue);
  const isValid = !isNaN(parsedValue) && inputValue.trim() !== '';

  // Validation checks
  let error = '';
  if (!isValid && inputValue !== '') {
    error = 'Please enter a valid number.';
  } else if (isValid) {
    if (category === 'Temperature' && fromUnit === 'k' && parsedValue < 0) {
      error = 'Temperature cannot be below absolute zero (0 K).';
    } else if (category === 'Temperature' && fromUnit === 'c' && parsedValue < -273.15) {
      error = 'Temperature cannot be below absolute zero (-273.15 °C).';
    } else if (category === 'Temperature' && fromUnit === 'f' && parsedValue < -459.67) {
      error = 'Temperature cannot be below absolute zero (-459.67 °F).';
    } else if (['Length', 'Weight / Mass', 'Area', 'Volume', 'Speed', 'Time', 'Data / Storage', 'Energy', 'Pressure', 'Fuel Economy'].includes(category) && parsedValue < 0) {
      error = 'Value cannot be negative for this category.';
    }
  }

  const canConvert = isValid && !error;

  const conversionResult = useMemo(() => {
    if (!canConvert) return null;
    return convert(parsedValue, fromUnit, toUnit, category);
  }, [parsedValue, fromUnit, toUnit, category, canConvert]);

  // Add to history (debounced)
  useEffect(() => {
    if (canConvert && conversionResult) {
      const timer = setTimeout(() => {
        setHistory(prev => {
          const newEntry: HistoryEntry = {
            id: Math.random().toString(36).substr(2, 9),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            category,
            value: parsedValue,
            fromId: fromUnit,
            toId: toUnit,
            result: conversionResult.result
          };
          // Avoid duplicate consecutive entries
          if (prev.length > 0 && prev[0].category === category && prev[0].value === parsedValue && prev[0].fromId === fromUnit && prev[0].toId === toUnit) {
            return prev;
          }
          return [newEntry, ...prev].slice(0, 30);
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [parsedValue, fromUnit, toUnit, category, canConvert, conversionResult]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const loadHistory = (entry: HistoryEntry) => {
    setCategory(entry.category);
    setInputValue(entry.value.toString());
    setTimeout(() => {
      setFromUnit(entry.fromId);
      setToUnit(entry.toId);
    }, 0);
  };

  const currentUnits = UNITS[category];
  const fromUnitObj = currentUnits.find(u => u.id === fromUnit);
  const toUnitObj = currentUnits.find(u => u.id === toUnit);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Unit Converter
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Comprehensive conversion across 12 categories with live updates and step-by-step formulas.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a unit (e.g. 'miles', 'kg')..."
            className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>
      </form>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-outline-variant/50 dark:border-slate-700 overflow-hidden">
        {/* Category Tabs */}
        <div className="flex overflow-x-auto border-b border-outline-variant/50 dark:border-slate-700 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-none py-4 px-6 text-sm font-bold whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-indigo-50 dark:bg-secondary/20 text-indigo-600 dark:text-secondary border-b-2 border-indigo-600 dark:border-secondary'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* Converter Inputs */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-end">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Value</label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full p-4 text-2xl font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">From</label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  {currentUnits.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center pb-2">
              <button
                onClick={handleSwap}
                className="p-4 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/50 dark:hover:text-secondary transition-colors shadow-sm"
                title="Swap Units"
              >
                <ArrowLeftRight className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">To</label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                >
                  {currentUnits.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
                  ))}
                </select>
              </div>
              <div className="h-[72px] flex items-end">
                <button className="w-full py-4 bg-indigo-600 dark:bg-secondary text-white font-bold rounded-xl hover:bg-indigo-700 dark:hover:bg-[#ff7a1a] transition-colors shadow-sm hidden md:block">
                  Convert
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          {/* Primary Result */}
          {canConvert && conversionResult && fromUnitObj && toUnitObj && (
            <div className="p-8 bg-indigo-50 dark:bg-secondary/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 text-center animate-in zoom-in-95 duration-300">
              <p className="text-sm font-bold text-indigo-600 dark:text-secondary uppercase tracking-wider mb-2">Result</p>
              <div className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight break-all">
                {formatNumber(conversionResult.result)} <span className="text-indigo-600 dark:text-secondary">{toUnitObj.symbol}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium">
                {formatNumber(parsedValue)} {fromUnitObj.name} = {formatNumber(conversionResult.result)} {toUnitObj.name}
              </p>
            </div>
          )}
        </div>
      </div>

      {canConvert && conversionResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Multi-Unit Table */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-outline-variant/50 dark:border-slate-700 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-outline-variant/50 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">All {category} Units</h3>
            </div>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-6 font-bold text-slate-700 dark:text-slate-300">Unit</th>
                    <th className="py-3 px-6 font-bold text-slate-700 dark:text-slate-300">Value</th>
                    <th className="py-3 px-6 font-bold text-slate-700 dark:text-slate-300 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {currentUnits.map(u => {
                    const val = convert(parsedValue, fromUnit, u.id, category).result;
                    const formattedVal = formatNumber(val);
                    const isFrom = u.id === fromUnit;
                    const isTo = u.id === toUnit;
                    
                    return (
                      <tr key={u.id} className={`
                        ${isFrom ? 'bg-slate-100 dark:bg-slate-700/50' : ''}
                        ${isTo ? 'bg-indigo-50 dark:bg-secondary/20' : ''}
                        hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors
                      `}>
                        <td className="py-3 px-6">
                          <span className={`font-medium ${isFrom || isTo ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                            {u.name}
                          </span>
                          <span className="ml-2 text-slate-400">({u.symbol})</span>
                        </td>
                        <td className={`py-3 px-6 font-mono ${isTo ? 'font-bold text-indigo-600 dark:text-secondary' : 'text-slate-900 dark:text-white'}`}>
                          {formattedVal}
                        </td>
                        <td className="py-3 px-6 text-right">
                          <button
                            onClick={() => handleCopy(formattedVal, u.id)}
                            className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-secondary transition-colors relative"
                            title="Copy value"
                          >
                            <Copy className="w-4 h-4" />
                            {copiedId === u.id && (
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg whitespace-nowrap">
                                Copied!
                              </span>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-8">
            {/* Step-by-Step Explanation */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-outline-variant/50 dark:border-slate-700 overflow-hidden">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="w-full p-6 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Formula & Steps</h3>
                {showExplanation ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>
              {showExplanation && (
                <div className="p-6 border-t border-outline-variant/50 dark:border-slate-700 bg-slate-900 text-emerald-400 font-mono text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{conversionResult.formula}</pre>
                </div>
              )}
            </div>

            {/* History */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-outline-variant/50 dark:border-slate-700 overflow-hidden flex flex-col max-h-[400px]">
              <div className="p-6 border-b border-outline-variant/50 dark:border-slate-700 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <History className="w-5 h-5" /> History
                </h3>
                {history.length > 0 && (
                  <button onClick={() => setHistory([])} className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Clear
                  </button>
                )}
              </div>
              <div className="overflow-y-auto p-2">
                {history.length === 0 ? (
                  <p className="text-center text-slate-500 py-8 text-sm">No recent conversions.</p>
                ) : (
                  <div className="space-y-1">
                    {history.map(entry => {
                      const fUnit = UNITS[entry.category].find(u => u.id === entry.fromId);
                      const tUnit = UNITS[entry.category].find(u => u.id === entry.toId);
                      if (!fUnit || !tUnit) return null;
                      
                      return (
                        <button
                          key={entry.id}
                          onClick={() => loadHistory(entry)}
                          className="w-full p-3 text-left rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex flex-col gap-1"
                        >
                          <div className="flex justify-between items-center text-xs text-slate-500">
                            <span>{entry.category}</span>
                            <span>{entry.time}</span>
                          </div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {formatNumber(entry.value)} {fUnit.symbol} → {formatNumber(entry.result)} {tUnit.symbol}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
