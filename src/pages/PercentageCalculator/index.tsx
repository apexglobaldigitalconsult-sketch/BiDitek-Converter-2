import React, { useState } from 'react';
import { Percent, ArrowRightLeft, TrendingUp, SplitSquareHorizontal, RotateCcw, Receipt } from 'lucide-react';

import PctOfValueTab from './PctOfValueTab';
import ValueAsPctTab from './ValueAsPctTab';
import PctChangeTab from './PctChangeTab';
import PctDifferenceTab from './PctDifferenceTab';
import ReversePctTab from './ReversePctTab';
import TipDiscountTab from './TipDiscountTab';

type Mode = 'ofValue' | 'asValue' | 'change' | 'difference' | 'reverse' | 'tipDiscount';

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>('ofValue');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Percentage Calculator</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Calculate percentages, changes, differences, tips, and discounts.</p>
      </div>

      <div className="flex overflow-x-auto bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-outline-variant/50 dark:border-slate-700 mb-6 hide-scrollbar">
        {[
          { id: 'ofValue', label: '% of Value', icon: Percent },
          { id: 'asValue', label: 'Value as %', icon: ArrowRightLeft },
          { id: 'change', label: '% Change', icon: TrendingUp },
          { id: 'difference', label: '% Difference', icon: SplitSquareHorizontal },
          { id: 'reverse', label: 'Reverse %', icon: RotateCcw },
          { id: 'tipDiscount', label: 'Tip & Discount', icon: Receipt },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as Mode)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold uppercase tracking-wider rounded-[1px] whitespace-nowrap transition-all ${
                mode === tab.id
                  ? 'bg-primary text-background shadow-md'
                  : 'bg-surface-container text-primary/50 hover:text-secondary hover:bg-secondary/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-outline-variant/50 dark:border-slate-700">
        {mode === 'ofValue' && <PctOfValueTab />}
        {mode === 'asValue' && <ValueAsPctTab />}
        {mode === 'change' && <PctChangeTab />}
        {mode === 'difference' && <PctDifferenceTab />}
        {mode === 'reverse' && <ReversePctTab />}
        {mode === 'tipDiscount' && <TipDiscountTab />}
      </div>
    </div>
  );
}
