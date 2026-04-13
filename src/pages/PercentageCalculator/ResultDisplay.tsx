import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function ResultDisplay({ result, interpretation, badges, steps, visual, table, customResult }: any) {
  const [showSteps, setShowSteps] = useState(true);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 mt-8">
      {/* Primary Result */}
      {customResult ? customResult : (
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-outline-variant/50 dark:border-slate-700 flex flex-col items-center text-center">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Result</h2>
          <div className="text-4xl md:text-5xl font-bold text-indigo-600 dark:text-secondary mb-4">{result}</div>
          {badges && <div className="flex gap-2 mb-4">{badges}</div>}
          {interpretation && <div className="text-lg font-medium text-slate-700 dark:text-slate-300">{interpretation}</div>}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Step-by-Step */}
          {steps && (
            <div className="border border-outline-variant/50 dark:border-slate-700 rounded-xl overflow-hidden">
              <button onClick={() => setShowSteps(!showSteps)} className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="font-semibold text-slate-900 dark:text-white">Step-by-Step Solution</span>
                {showSteps ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>
              {showSteps && (
                <div className="p-6 bg-white dark:bg-slate-900">
                  <div className="space-y-3 text-slate-700 dark:text-slate-300">
                    {steps}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Visual Comparison Bar */}
          {visual && (
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-outline-variant/50 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Visual Comparison</h3>
              {visual}
            </div>
          )}
        </div>

        {/* Quick Reference Table */}
        {table && (
          <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-outline-variant/50 dark:border-slate-700 h-fit">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Quick Reference</h3>
            <div className="overflow-x-auto">
              {table}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
