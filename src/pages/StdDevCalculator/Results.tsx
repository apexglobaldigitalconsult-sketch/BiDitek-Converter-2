import React, { useState } from 'react';
import { StatsResult, formatNum } from './utils';
import DistributionChart from './Chart';
import { Copy, ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';

interface ResultsProps {
  stats: StatsResult;
}

export default function Results({ stats }: ResultsProps) {
  const [showZTable, setShowZTable] = useState(stats.n <= 20);
  const [showSteps, setShowSteps] = useState(true);
  const [showChart, setShowChart] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const [sortCol, setSortCol] = useState<'index' | 'value' | 'deviation' | 'z'>('index');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (col: 'index' | 'value' | 'deviation' | 'z') => {
    if (sortCol === col) setSortAsc(!sortAsc);
    else {
      setSortCol(col);
      setSortAsc(true);
    }
  };

  const sortedZScores = [...stats.zScores].sort((a, b) => {
    let valA = a[sortCol];
    let valB = b[sortCol];
    return sortAsc ? valA - valB : valB - valA;
  });

  const handleCopyZTable = () => {
    const header = "#\tValue (x)\tDeviation (x-x̄)\tZ-Score\tClassification\n";
    const rows = sortedZScores.map(row => {
      const absZ = Math.abs(row.z);
      let classification = '';
      if (absZ <= 1) classification = 'Within 1σ';
      else if (absZ <= 2) classification = 'Within 2σ';
      else if (absZ <= 3) classification = 'Within 3σ';
      else classification = 'Outlier (beyond 3σ)';
      return `${row.index + 1}\t${row.value}\t${formatNum(row.deviation)}\t${formatNum(row.z)}\t${classification}`;
    }).join('\n');
    
    navigator.clipboard.writeText(header + rows);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Empirical Rule counts
  const sDevToUse = stats.n > 1 ? stats.sampleStdDev : stats.popStdDev;
  const count1s = stats.data.filter(x => Math.abs(x - stats.mean) <= sDevToUse).length;
  const count2s = stats.data.filter(x => Math.abs(x - stats.mean) <= 2 * sDevToUse).length;
  const count3s = stats.data.filter(x => Math.abs(x - stats.mean) <= 3 * sDevToUse).length;

  const pct1s = (count1s / stats.n) * 100;
  const pct2s = (count2s / stats.n) * 100;
  const pct3s = (count3s / stats.n) * 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Section 1: Primary Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Population (σ)</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Population Std Dev (σ)</p>
              <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{formatNum(stats.popStdDev)}</p>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-slate-100 dark:border-slate-700">
              <span className="text-sm text-slate-600 dark:text-slate-300">Population Variance (σ²)</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{formatNum(stats.popVar)}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg text-sm">
              <p className="font-mono text-slate-700 dark:text-slate-300 mb-1">σ = √[Σ(xᵢ−x̄)²/n]</p>
              <p className="text-slate-500">Use when you have data for the entire population.</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Sample (s)</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Sample Std Dev (s)</p>
              <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
                {stats.n > 1 ? formatNum(stats.sampleStdDev) : 'N/A'}
              </p>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-slate-100 dark:border-slate-700">
              <span className="text-sm text-slate-600 dark:text-slate-300">Sample Variance (s²)</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {stats.n > 1 ? formatNum(stats.sampleVar) : 'N/A'}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg text-sm">
              <p className="font-mono text-slate-700 dark:text-slate-300 mb-1">s = √[Σ(xᵢ−x̄)²/(n−1)]</p>
              <p className="text-slate-500">Use when you have a sample from a larger population.</p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm text-slate-500 text-center max-w-3xl mx-auto">
        Population std dev (σ) divides by n. Sample std dev (s) divides by n−1 (Bessel's correction) to account for the bias in estimating a population parameter from a sample.
      </p>

      {/* Section 2: Descriptive Statistics */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Full Descriptive Statistics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-700">
          {[
            { label: 'Count (n)', val: stats.n },
            { label: 'Sum (Σx)', val: formatNum(stats.sum) },
            { label: 'Mean (x̄)', val: formatNum(stats.mean) },
            { label: 'Median', val: formatNum(stats.median) },
            { label: 'Mode', val: stats.mode ? stats.mode.join(', ') : 'No mode' },
            { label: 'Minimum', val: formatNum(stats.min) },
            { label: 'Maximum', val: formatNum(stats.max) },
            { label: 'Range', val: formatNum(stats.range) },
            { label: 'Q1 (25th percentile)', val: formatNum(stats.q1) },
            { label: 'Q2 / Median (50th)', val: formatNum(stats.q2) },
            { label: 'Q3 (75th percentile)', val: formatNum(stats.q3) },
            { label: 'IQR (Q3 − Q1)', val: formatNum(stats.iqr) },
            { label: 'Lower Fence', val: formatNum(stats.lowerFence) },
            { label: 'Upper Fence', val: formatNum(stats.upperFence) },
            { label: 'Outliers', val: stats.outliers.length > 0 ? stats.outliers.join(', ') : 'None detected' },
            { 
              label: 'Skewness', 
              val: `${formatNum(stats.skewness)} (${stats.skewness === null ? 'N/A' : stats.skewness > 0.5 ? 'Positive/Right' : stats.skewness < -0.5 ? 'Negative/Left' : 'Symmetric'})`
            },
            { 
              label: 'Kurtosis (excess)', 
              val: `${formatNum(stats.kurtosis)} (${stats.kurtosis === null ? 'N/A' : stats.kurtosis > 0.5 ? 'Leptokurtic' : stats.kurtosis < -0.5 ? 'Platykurtic' : 'Mesokurtic'})`
            },
            { label: 'Coefficient of Variation', val: stats.cv !== null ? `${formatNum(stats.cv, 2)}%` : 'N/A' },
            { label: 'Standard Error of Mean', val: formatNum(stats.sem) },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-4 flex justify-between items-center">
              <span className="text-sm text-slate-500 dark:text-slate-400">{item.label}</span>
              <span className="font-mono font-medium text-slate-900 dark:text-white text-right">{item.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Visual Distribution Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <button
          onClick={() => setShowChart(!showChart)}
          className="w-full p-6 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Visual Distribution Chart</h3>
          {showChart ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>
        {showChart && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-700">
            <DistributionChart stats={stats} />
          </div>
        )}
      </div>

      {/* Section 3: Z-Score Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={() => setShowZTable(!showZTable)}
            className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
          >
            Z-Score Table
            {showZTable ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
          </button>
          {showZTable && (
            <button
              onClick={handleCopyZTable}
              className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2 relative"
            >
              <Copy className="w-4 h-4" /> Copy Table
              {copied && (
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg whitespace-nowrap">
                  Copied!
                </span>
              )}
            </button>
          )}
        </div>
        
        {showZTable && (
          <>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-900/80 sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" onClick={() => handleSort('index')}>
                      <div className="flex items-center gap-1"># <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" onClick={() => handleSort('value')}>
                      <div className="flex items-center gap-1">Value (xᵢ) <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" onClick={() => handleSort('deviation')}>
                      <div className="flex items-center gap-1">Deviation (xᵢ − x̄) <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" onClick={() => handleSort('z')}>
                      <div className="flex items-center gap-1">Z-Score <ArrowUpDown className="w-3 h-3" /></div>
                    </th>
                    <th className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {sortedZScores.map((row) => {
                    const absZ = Math.abs(row.z);
                    const isOutlier = absZ > 3;
                    return (
                      <tr key={row.index} className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 ${isOutlier ? 'bg-red-50 dark:bg-red-900/10' : ''}`}>
                        <td className="py-2 px-4 text-slate-500">{row.index + 1}</td>
                        <td className="py-2 px-4 font-mono text-slate-900 dark:text-white">{row.value}</td>
                        <td className="py-2 px-4 font-mono text-slate-600 dark:text-slate-400">{formatNum(row.deviation)}</td>
                        <td className={`py-2 px-4 font-mono font-bold ${isOutlier ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
                          {formatNum(row.z)}
                        </td>
                        <td className="py-2 px-4">
                          {isOutlier ? (
                            <span className="text-red-600 dark:text-red-400 font-bold flex items-center gap-1">⚠️ Outlier (beyond 3σ)</span>
                          ) : absZ <= 1 ? (
                            <span className="text-green-600 dark:text-green-400">Within 1σ</span>
                          ) : absZ <= 2 ? (
                            <span className="text-yellow-600 dark:text-yellow-400">Within 2σ</span>
                          ) : (
                            <span className="text-orange-600 dark:text-orange-400">Within 3σ</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empirical Rule Summary */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Empirical Rule Summary</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                      <th className="py-2 px-4">Range</th>
                      <th className="py-2 px-4">Count in Dataset</th>
                      <th className="py-2 px-4">% of Dataset</th>
                      <th className="py-2 px-4">Expected (Normal)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 dark:border-slate-700/50">
                      <td className="py-2 px-4 font-medium">Within 1σ (x̄ ± 1s)</td>
                      <td className="py-2 px-4">{count1s}</td>
                      <td className="py-2 px-4">{pct1s.toFixed(2)}%</td>
                      <td className="py-2 px-4 text-slate-500">68.27%</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-700/50">
                      <td className="py-2 px-4 font-medium">Within 2σ (x̄ ± 2s)</td>
                      <td className="py-2 px-4">{count2s}</td>
                      <td className="py-2 px-4">{pct2s.toFixed(2)}%</td>
                      <td className="py-2 px-4 text-slate-500">95.45%</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-medium">Within 3σ (x̄ ± 3s)</td>
                      <td className="py-2 px-4">{count3s}</td>
                      <td className="py-2 px-4">{pct3s.toFixed(2)}%</td>
                      <td className="py-2 px-4 text-slate-500">99.73%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Section 4: Step-by-Step Solution */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <button
          onClick={() => setShowSteps(!showSteps)}
          className="w-full p-6 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Step-by-Step Solution</h3>
          {showSteps ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
        </button>
        {showSteps && (
          <div className="p-6 border-t border-slate-200 dark:border-slate-700 space-y-4 text-sm text-slate-700 dark:text-slate-300 font-mono">
            <p>1. <strong>Dataset:</strong> {stats.data.length <= 10 ? stats.data.join(', ') : `${stats.data.slice(0, 5).join(', ')} ... ${stats.data.slice(-5).join(', ')}`}</p>
            <p>2. <strong>Count:</strong> n = {stats.n}</p>
            <p>3. <strong>Sum:</strong> Σxᵢ = {formatNum(stats.sum)}</p>
            <p>4. <strong>Mean:</strong> x̄ = Σxᵢ / n = {formatNum(stats.sum)} / {stats.n} = {formatNum(stats.mean)}</p>
            
            <div className="mt-4">
              <p className="font-bold mb-2">5. Deviations from mean (xᵢ − x̄) and Squared Deviations (xᵢ − x̄)²:</p>
              <div className="pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-1">
                {stats.data.slice(0, 5).map((x, i) => {
                  const dev = x - stats.mean;
                  return <p key={i}>x_{i+1}: ({x} − {formatNum(stats.mean)}) = {formatNum(dev)} &nbsp;→&nbsp; ({formatNum(dev)})² = {formatNum(dev * dev)}</p>;
                })}
                {stats.data.length > 10 && <p className="text-slate-400 my-2">... ({stats.data.length - 10} more values) ...</p>}
                {stats.data.length > 5 && stats.data.slice(Math.max(5, stats.data.length - 5)).map((x, i) => {
                  const dev = x - stats.mean;
                  const idx = Math.max(5, stats.data.length - 5) + i + 1;
                  return <p key={idx}>x_{idx}: ({x} − {formatNum(stats.mean)}) = {formatNum(dev)} &nbsp;→&nbsp; ({formatNum(dev)})² = {formatNum(dev * dev)}</p>;
                })}
              </div>
            </div>

            <p className="mt-4">6. <strong>Sum of squared deviations:</strong> Σ(xᵢ − x̄)² = {formatNum(stats.popVar * stats.n)}</p>
            
            <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
              <p className="font-bold text-indigo-900 dark:text-indigo-100 mb-2">Population Calculations:</p>
              <p>7a. <strong>Population variance:</strong> σ² = Σ(xᵢ − x̄)² / n = {formatNum(stats.popVar * stats.n)} / {stats.n} = {formatNum(stats.popVar)}</p>
              <p>8a. <strong>Population std dev:</strong> σ = √σ² = √{formatNum(stats.popVar)} = <strong>{formatNum(stats.popStdDev)}</strong></p>
            </div>

            <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
              <p className="font-bold text-emerald-900 dark:text-emerald-100 mb-2">Sample Calculations:</p>
              {stats.n > 1 ? (
                <>
                  <p>7b. <strong>Sample variance:</strong> s² = Σ(xᵢ − x̄)² / (n−1) = {formatNum(stats.popVar * stats.n)} / {stats.n - 1} = {formatNum(stats.sampleVar)}</p>
                  <p>8b. <strong>Sample std dev:</strong> s = √s² = √{formatNum(stats.sampleVar)} = <strong>{formatNum(stats.sampleStdDev)}</strong></p>
                </>
              ) : (
                <p className="text-red-500">Sample standard deviation requires at least 2 values.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
