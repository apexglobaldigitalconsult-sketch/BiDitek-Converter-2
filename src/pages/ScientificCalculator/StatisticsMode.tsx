import React, { useState } from 'react';
import { parseDataset, calculateStats } from './utils';

export default function StatisticsMode() {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    try {
      setError('');
      const data = parseDataset(input);
      if (data.length === 0) throw new Error("Dataset is empty");
      setStats(calculateStats(data));
    } catch (e: any) {
      setError(e.message || "Invalid dataset");
      setStats(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Dataset (comma or space separated)
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. 10, 20, 30, 40, 50"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <button
          onClick={handleCalculate}
          className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Parse & Calculate
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Descriptive Statistics</h3>
            <div className="space-y-2 text-sm">
              <StatRow label="Count (n)" value={stats.n} />
              <StatRow label="Sum" value={stats.sum} />
              <StatRow label="Mean (Average)" value={stats.mean.toFixed(4)} />
              <StatRow label="Median" value={stats.median} />
              <StatRow label="Mode" value={stats.modeStr} />
              <StatRow label="Range" value={stats.range} />
              <StatRow label="Minimum" value={stats.min} />
              <StatRow label="Maximum" value={stats.max} />
              <StatRow label="Variance (Population)" value={stats.varPop.toFixed(4)} />
              <StatRow label="Variance (Sample)" value={stats.varSamp.toFixed(4)} />
              <StatRow label="Std Dev (Population)" value={stats.stdPop.toFixed(4)} />
              <StatRow label="Std Dev (Sample)" value={stats.stdSamp.toFixed(4)} />
              <StatRow label="25th Percentile (Q1)" value={stats.q1} />
              <StatRow label="75th Percentile (Q3)" value={stats.q3} />
              <StatRow label="IQR" value={stats.iqr} />
              <StatRow label="Skewness" value={stats.skewness.toFixed(4)} />
              <StatRow label="Kurtosis" value={stats.kurtosis.toFixed(4)} />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Sorted Data</h3>
            <div className="max-h-96 overflow-y-auto pr-2">
              {stats.sorted.map((val: number, i: number) => (
                <div key={i} className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700 last:border-0">
                  <span className="text-slate-500">#{i + 1}</span>
                  <span className="font-medium text-slate-900 dark:text-white">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatRow({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
      <span className="font-medium text-slate-900 dark:text-white">{value}</span>
    </div>
  );
}
