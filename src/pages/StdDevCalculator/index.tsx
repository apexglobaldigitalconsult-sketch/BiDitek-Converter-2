import React, { useState, useEffect, useMemo } from 'react';
import { calculateStats, StatsResult } from './utils';
import Results from './Results';
import { Calculator, Trash2, Plus, FileText } from 'lucide-react';

export default function StdDevCalculator() {
  const [inputText, setInputText] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [stats, setStats] = useState<StatsResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Live count
  const liveTokens = useMemo(() => {
    return inputText.split(/[\s,]+/).filter(t => t.trim() !== '');
  }, [inputText]);

  const handleCalculate = () => {
    setError(null);
    setStats(null);

    const tokens = inputText.split(/[\s,]+/).filter(t => t.trim() !== '');
    if (tokens.length === 0) {
      setError('Please enter at least one number.');
      return;
    }

    const data: number[] = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const num = Number(token);
      if (isNaN(num)) {
        setError(`Invalid value: '${token}' at position ${i + 1} — please enter numbers only.`);
        return;
      }
      data.push(num);
    }

    setStats(calculateStats(data));
  };

  const handleClear = () => {
    setInputText('');
    setManualInput('');
    setStats(null);
    setError(null);
  };

  const handleLoadExample = () => {
    setInputText('4, 8, 15, 16, 23, 42, 12, 19, 22, 38, 41, 5, 9, 14, 27, 31, 36, 45, 50, 2, 7, 11, 18, 25, 33, 48, 55, 60, 3, 10');
    setError(null);
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    const val = manualInput.trim();
    if (!val) return;
    
    if (isNaN(Number(val))) {
      setError(`Invalid value: '${val}' — please enter numbers only.`);
      return;
    }

    const separator = inputText.trim() === '' ? '' : inputText.includes(',') ? ', ' : '\n';
    setInputText(prev => prev.trim() === '' ? val : prev + separator + val);
    setManualInput('');
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Standard Deviation Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Compute population and sample standard deviation, full descriptive statistics, Z-scores, and visualize data distribution.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl dark:rounded-xl shadow-xl border border-outline-variant/50 dark:border-slate-700 overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Data Entry */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Dataset Input
              </label>
              <button 
                onClick={handleLoadExample}
                className="text-sm font-medium text-indigo-600 dark:text-secondary hover:text-indigo-700 flex items-center gap-1"
              >
                <FileText className="w-4 h-4" /> Load Example
              </button>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setError(null);
              }}
              placeholder="Enter values separated by commas, spaces, or newlines..."
              className="w-full h-48 p-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-mono resize-y"
            />
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {liveTokens.length} values detected
              </span>
              {liveTokens.length === 1 && (
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  Note: Sample standard deviation requires at least 2 values.
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium border border-red-100 dark:border-red-800/50">
              {error}
            </div>
          )}

          {/* Manual Entry Row */}
          <form onSubmit={handleAddManual} className="flex gap-3 items-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-outline-variant/50 dark:border-slate-700">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
              Add single value:
            </label>
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="e.g. 42"
              className="flex-1 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleCalculate}
              className="flex-1 py-4 bg-indigo-600 dark:bg-secondary text-white font-black text-lg rounded-xl hover:bg-indigo-700 dark:hover:bg-[#ff7a1a] transition-colors shadow-md shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"
            >
              <Calculator className="w-6 h-6" /> Parse & Calculate
            </button>
            <button
              onClick={handleClear}
              className="py-4 px-8 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" /> Clear
            </button>
          </div>
        </div>
      </div>

      {stats && <Results stats={stats} />}
    </div>
  );
}
