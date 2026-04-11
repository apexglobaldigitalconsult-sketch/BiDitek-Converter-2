import React, { useState, useEffect } from 'react';
import { DateResult } from './utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ResultsProps {
  mode: 'addSubtract' | 'duration' | 'daysFromNow';
  result: DateResult;
}

export default function Results({ mode, result }: ResultsProps) {
  const [showHolidays, setShowHolidays] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (n: number) => n.toLocaleString();

  const renderCountdown = () => {
    const target = result.endDate;
    const diffMs = target.getTime() - now.getTime();
    
    if (diffMs <= 0) {
      const daysAgo = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
      return (
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
            This date was {formatNum(daysAgo)} days ago.
          </p>
        </div>
      );
    }

    const d = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const h = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diffMs / 1000 / 60) % 60);
    const s = Math.floor((diffMs / 1000) % 60);

    const totalDurationMs = target.getTime() - result.startDate.getTime();
    const elapsedMs = now.getTime() - result.startDate.getTime();
    let progress = 0;
    if (totalDurationMs > 0) {
      progress = Math.max(0, Math.min(100, (elapsedMs / totalDurationMs) * 100));
    }

    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Countdown to Result Date</h3>
        </div>
        <div className="p-8 bg-slate-900 text-white">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8">
            {[
              { label: 'Days', val: d },
              { label: 'Hours', val: h },
              { label: 'Minutes', val: m },
              { label: 'Seconds', val: s }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 min-w-[80px] md:min-w-[100px] text-center shadow-inner">
                  <span className="text-3xl md:text-5xl font-mono font-black text-indigo-400">
                    {item.val.toString().padStart(2, '0')}
                  </span>
                </div>
                <span className="text-sm text-slate-400 mt-2 uppercase tracking-wider font-bold">{item.label}</span>
              </div>
            ))}
          </div>

          {totalDurationMs > 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between text-xs text-slate-400 mb-2 font-bold uppercase tracking-wider">
                <span>Start</span>
                <span className="text-indigo-400">{progress.toFixed(1)}% of the way there</span>
                <span>Target</span>
              </div>
              <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Section 1: Primary Result */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-8 text-center bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800/50">
          {mode === 'duration' ? (
            <>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                Exact Duration
              </p>
              <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                {result.exactDuration.years} <span className="text-2xl text-slate-500">years,</span>{' '}
                {result.exactDuration.months} <span className="text-2xl text-slate-500">months,</span>{' '}
                {result.exactDuration.days} <span className="text-2xl text-slate-500">days</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                {result.startDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })} is {result.exactDuration.years} years, {result.exactDuration.months} months, {result.exactDuration.days} days {result.direction} {result.endDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
                Result Date
              </p>
              <div className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                {result.endDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
              {result.operation && (
                <p className="text-slate-700 dark:text-slate-300 font-medium mt-4">
                  {result.operation}
                </p>
              )}
              {mode === 'daysFromNow' && (
                <p className="text-slate-700 dark:text-slate-300 font-medium mt-4">
                  {formatNum(result.totalUnits.days)} {result.businessDays !== result.totalUnits.days ? 'business' : 'calendar'} days {result.direction} {result.startDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </>
          )}
        </div>
        
        {mode !== 'duration' && (
          <div className="grid grid-cols-2 divide-x divide-slate-200 dark:divide-slate-700">
            <div className="p-4 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Days from Start Date</p>
              <p className="font-medium text-slate-900 dark:text-white">{formatNum(result.totalUnits.days)} calendar days</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Business Days from Start</p>
              <p className="font-medium text-slate-900 dark:text-white">{formatNum(result.businessDays)} business days</p>
            </div>
          </div>
        )}
        {mode === 'duration' && (
          <div className="grid grid-cols-2 divide-x divide-slate-200 dark:divide-slate-700">
            <div className="p-4 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">From</p>
              <p className="font-medium text-slate-900 dark:text-white">
                {result.startDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="p-4 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">To</p>
              <p className="font-medium text-slate-900 dark:text-white">
                {result.endDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Duration in Multiple Units */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Duration in Multiple Units</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-700">
          {[
            { label: 'Years', val: `${result.exactDuration.years} years, ${result.exactDuration.months} months, ${result.exactDuration.days} days` },
            { label: 'Months', val: `${Math.floor(result.totalUnits.months)} months, ${result.exactDuration.days} days` },
            { label: 'Weeks', val: `${result.totalUnits.weeks} weeks, ${result.totalUnits.days % 7} days` },
            { label: 'Total Days', val: `${formatNum(result.totalUnits.days)} days`, highlight: true },
            { label: 'Total Hours', val: `${formatNum(result.totalUnits.hours)} hours` },
            { label: 'Total Minutes', val: `${formatNum(result.totalUnits.minutes)} minutes`, sci: result.totalUnits.minutes.toExponential(4) },
            { label: 'Total Seconds', val: `${formatNum(result.totalUnits.seconds)} seconds`, sci: result.totalUnits.seconds.toExponential(4) },
          ].map((item, i) => (
            <div key={i} className={`p-6 ${item.highlight ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-white dark:bg-slate-800'}`}>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{item.label}</p>
              <p className={`text-xl font-bold ${item.highlight ? 'text-indigo-600 dark:text-indigo-400 text-2xl' : 'text-slate-900 dark:text-white'}`}>
                {item.val}
              </p>
              {item.sci && <p className="text-xs text-slate-400 mt-1 font-mono">{item.sci}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Business Days vs Calendar Days */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Business Days vs Calendar Days</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-700">
          {[
            { label: 'Total Calendar Days', val: formatNum(result.totalUnits.days) },
            { label: 'Total Business Days (Mon-Fri)', val: formatNum(result.businessDays) },
            { label: 'Total Weekend Days', val: formatNum(result.weekendDays) },
            { label: 'Total Saturdays', val: formatNum(result.saturdays) },
            { label: 'Total Sundays', val: formatNum(result.sundays) },
            { label: 'Working Days excl. Holidays', val: formatNum(result.workingDays) },
            { label: 'Weekends as % of Total', val: result.totalUnits.days > 0 ? `${((result.weekendDays / result.totalUnits.days) * 100).toFixed(1)}%` : '0%' },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-4 flex justify-between items-center">
              <span className="text-sm text-slate-500 dark:text-slate-400">{item.label}</span>
              <span className="font-mono font-medium text-slate-900 dark:text-white text-right">{item.val}</span>
            </div>
          ))}
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={() => setShowHolidays(!showHolidays)}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="font-medium text-slate-700 dark:text-slate-300">
              US Federal Holidays in Range: <span className="font-bold">{result.holidays.length}</span>
            </span>
            {showHolidays ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
          </button>
          
          {showHolidays && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              {result.holidays.length > 0 ? (
                <ul className="space-y-2">
                  {result.holidays.map((h, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span className="text-slate-700 dark:text-slate-300">{h.name}</span>
                      <span className="text-slate-500">{h.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 italic">No US Federal Holidays fall within this date range.</p>
              )}
              <p className="text-xs text-slate-400 mt-4">Note: Holidays shown are US Federal Holidays only. Regional and international holidays are not included.</p>
            </div>
          )}
        </div>
      </div>

      {/* Section 4: Day of Week Details */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Day of Week Details</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-700">
          {[
            { label: 'Start Date Falls On', val: result.startDate.toLocaleDateString(undefined, { weekday: 'long' }) },
            { label: 'End / Result Date Falls On', val: result.endDate.toLocaleDateString(undefined, { weekday: 'long' }) },
            { label: 'Is Start Date a Weekend?', val: result.isStartWeekend ? 'Yes' : 'No' },
            { label: 'Is End/Result Date a Weekend?', val: result.isEndWeekend ? 'Yes' : 'No' },
            { label: 'Week Number of Start Date', val: `Week ${result.startWeek}` },
            { label: 'Week Number of End/Result Date', val: `Week ${result.endWeek}` },
            { label: 'Quarter of Start Date', val: result.startQuarter },
            { label: 'Quarter of End/Result Date', val: result.endQuarter },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-4 flex justify-between items-center">
              <span className="text-sm text-slate-500 dark:text-slate-400">{item.label}</span>
              <span className="font-medium text-slate-900 dark:text-white text-right">{item.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Countdown */}
      {(mode === 'addSubtract' || mode === 'daysFromNow') && renderCountdown()}
    </div>
  );
}
