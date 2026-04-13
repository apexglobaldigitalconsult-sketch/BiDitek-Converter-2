import React from 'react';
import { calculateStats, generateBuckets } from './utils';

export default function StatsPanel({ data, distribution }: { data: number[], distribution?: string }) {
  const stats = calculateStats(data);
  if (!stats || stats.count < 2) return null;

  const buckets = distribution === 'normal' ? generateBuckets(data, 10) : [];
  const maxBucketCount = buckets.length > 0 ? Math.max(...buckets.map(b => b.count)) : 0;

  return (
    <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-outline-variant/50 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Statistics Summary</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatBox label="Count" value={stats.count} />
        <StatBox label="Sum" value={Number.isInteger(stats.sum) ? stats.sum : stats.sum.toFixed(4)} />
        <StatBox label="Minimum" value={stats.min} />
        <StatBox label="Maximum" value={stats.max} />
        <StatBox label="Mean" value={stats.mean.toFixed(4)} />
        <StatBox label="Median" value={stats.median.toFixed(4)} />
        <StatBox label="Range" value={stats.range.toFixed(4)} />
        <StatBox label="Std Dev" value={stats.stdDev.toFixed(4)} />
      </div>

      {distribution === 'normal' && buckets.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Distribution Curve</h4>
          <div className="flex items-end gap-1 h-32 pt-4">
            {buckets.map((b, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group relative">
                <div 
                  className="w-full bg-indigo-500 rounded-t-sm transition-all group-hover:bg-indigo-400"
                  style={{ height: `${(b.count / maxBucketCount) * 100}%`, minHeight: b.count > 0 ? '4px' : '0' }}
                ></div>
                <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10 transition-opacity">
                  {b.min.toFixed(1)} - {b.max.toFixed(1)}: {b.count}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>{stats.min.toFixed(2)}</span>
            <span>{stats.max.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-outline-variant/50 dark:border-slate-700">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="font-semibold text-slate-900 dark:text-white truncate" title={String(value)}>{value}</div>
    </div>
  );
}
