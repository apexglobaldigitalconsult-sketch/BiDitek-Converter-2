import React, { useState, useEffect } from 'react';
import { 
  DateResult, 
  addYears, 
  addMonths, 
  addBusinessDays, 
  calculateExactDuration, 
  calculateTotalUnits, 
  countDaysBreakdown, 
  getHolidaysInRange, 
  getISOWeek, 
  getQuarter 
} from './utils';
import Results from './Results';
import { Calculator, Calendar, Clock, CalendarDays, ArrowRight } from 'lucide-react';

type Mode = 'addSubtract' | 'duration' | 'daysFromNow';

export default function DateCalculator() {
  const [mode, setMode] = useState<Mode>('addSubtract');
  
  // Add/Subtract State
  const [addStartDate, setAddStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [addYearsInput, setAddYearsInput] = useState<number>(0);
  const [addMonthsInput, setAddMonthsInput] = useState<number>(0);
  const [addWeeksInput, setAddWeeksInput] = useState<number>(0);
  const [addDaysInput, setAddDaysInput] = useState<number>(0);
  const [addHoursInput, setAddHoursInput] = useState<number>(0);
  const [addMinutesInput, setAddMinutesInput] = useState<number>(0);
  const [businessDaysOnly, setBusinessDaysOnly] = useState(false);

  // Duration State
  const [durStartDate, setDurStartDate] = useState<string>('2024-01-01');
  const [durStartTime, setDurStartTime] = useState<string>('');
  const [durEndDate, setDurEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [durEndTime, setDurEndTime] = useState<string>('');
  const [includeEndDate, setIncludeEndDate] = useState(false);

  // Days From Now State
  const [daysNum, setDaysNum] = useState<number>(30);
  const [direction, setDirection] = useState<'future' | 'past'>('future');
  const [countMode, setCountMode] = useState<'calendar' | 'business'>('calendar');
  const [refDate, setRefDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Results & Error
  const [result, setResult] = useState<DateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Quick Reference State
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const handleCalculate = () => {
    setError(null);
    setResult(null);

    try {
      if (mode === 'addSubtract') {
        const start = new Date(addStartDate);
        if (isNaN(start.getTime())) throw new Error('Invalid Start Date');
        start.setHours(0, 0, 0, 0);

        const sign = operation === 'add' ? 1 : -1;
        let end = new Date(start);

        // Apply years
        if (addYearsInput) end = addYears(end, addYearsInput * sign);
        // Apply months
        if (addMonthsInput) end = addMonths(end, addMonthsInput * sign);
        // Apply weeks
        if (addWeeksInput) {
          if (businessDaysOnly) {
             // 1 week = 5 business days
             end = addBusinessDays(end, addWeeksInput * 5 * sign);
          } else {
             end.setDate(end.getDate() + addWeeksInput * 7 * sign);
          }
        }
        // Apply days
        if (addDaysInput) {
          if (businessDaysOnly) {
            end = addBusinessDays(end, addDaysInput * sign);
          } else {
            end.setDate(end.getDate() + addDaysInput * sign);
          }
        }
        // Apply hours/minutes
        if (addHoursInput) end.setHours(end.getHours() + addHoursInput * sign);
        if (addMinutesInput) end.setMinutes(end.getMinutes() + addMinutesInput * sign);

        const exactDuration = calculateExactDuration(start, end);
        const totalUnits = calculateTotalUnits(start, end);
        const breakdown = countDaysBreakdown(start, end);
        const holidays = getHolidaysInRange(start, end);
        
        const startWeekInfo = getISOWeek(start);
        const endWeekInfo = getISOWeek(end);

        setResult({
          startDate: start,
          endDate: end,
          exactDuration,
          totalUnits,
          businessDays: breakdown.businessDays,
          weekendDays: breakdown.weekendDays,
          saturdays: breakdown.saturdays,
          sundays: breakdown.sundays,
          holidays,
          workingDays: breakdown.businessDays - holidays.length,
          operation: `${start.toLocaleDateString()} ${operation === 'add' ? '+' : '-'} ${addYearsInput}y ${addMonthsInput}m ${addWeeksInput}w ${addDaysInput}d ${addHoursInput}h ${addMinutesInput}m`,
          isStartWeekend: start.getDay() === 0 || start.getDay() === 6,
          isEndWeekend: end.getDay() === 0 || end.getDay() === 6,
          startWeek: `${startWeekInfo.week} of ${startWeekInfo.year}`,
          endWeek: `${endWeekInfo.week} of ${endWeekInfo.year}`,
          startQuarter: getQuarter(start),
          endQuarter: getQuarter(end)
        });

      } else if (mode === 'duration') {
        const start = new Date(durStartDate);
        if (isNaN(start.getTime())) throw new Error('Invalid Start Date');
        if (durStartTime) {
          const [h, m] = durStartTime.split(':').map(Number);
          start.setHours(h, m, 0, 0);
        } else {
          start.setHours(0, 0, 0, 0);
        }

        const end = new Date(durEndDate);
        if (isNaN(end.getTime())) throw new Error('Invalid End Date');
        if (durEndTime) {
          const [h, m] = durEndTime.split(':').map(Number);
          end.setHours(h, m, 0, 0);
        } else {
          end.setHours(0, 0, 0, 0);
        }

        if (start.getTime() > end.getTime()) {
          throw new Error('Start Date cannot be after End Date.');
        }

        const exactDuration = calculateExactDuration(start, end, includeEndDate);
        const totalUnits = calculateTotalUnits(start, end, includeEndDate);
        const breakdown = countDaysBreakdown(start, end, includeEndDate);
        const holidays = getHolidaysInRange(start, end);

        const startWeekInfo = getISOWeek(start);
        const endWeekInfo = getISOWeek(end);

        setResult({
          startDate: start,
          endDate: end,
          exactDuration,
          totalUnits,
          businessDays: breakdown.businessDays,
          weekendDays: breakdown.weekendDays,
          saturdays: breakdown.saturdays,
          sundays: breakdown.sundays,
          holidays,
          workingDays: breakdown.businessDays - holidays.length,
          direction: 'before',
          isStartWeekend: start.getDay() === 0 || start.getDay() === 6,
          isEndWeekend: end.getDay() === 0 || end.getDay() === 6,
          startWeek: `${startWeekInfo.week} of ${startWeekInfo.year}`,
          endWeek: `${endWeekInfo.week} of ${endWeekInfo.year}`,
          startQuarter: getQuarter(start),
          endQuarter: getQuarter(end)
        });

      } else if (mode === 'daysFromNow') {
        if (daysNum <= 0) throw new Error('Number of days must be greater than 0.');
        
        const start = new Date(refDate);
        if (isNaN(start.getTime())) throw new Error('Invalid Reference Date');
        start.setHours(0, 0, 0, 0);

        const sign = direction === 'future' ? 1 : -1;
        let end = new Date(start);

        if (countMode === 'business') {
          end = addBusinessDays(end, daysNum * sign);
        } else {
          end.setDate(end.getDate() + daysNum * sign);
        }

        const exactDuration = calculateExactDuration(start, end);
        const totalUnits = calculateTotalUnits(start, end);
        const breakdown = countDaysBreakdown(start, end);
        const holidays = getHolidaysInRange(start, end);

        const startWeekInfo = getISOWeek(start);
        const endWeekInfo = getISOWeek(end);

        setResult({
          startDate: start,
          endDate: end,
          exactDuration,
          totalUnits,
          businessDays: breakdown.businessDays,
          weekendDays: breakdown.weekendDays,
          saturdays: breakdown.saturdays,
          sundays: breakdown.sundays,
          holidays,
          workingDays: breakdown.businessDays - holidays.length,
          direction,
          isStartWeekend: start.getDay() === 0 || start.getDay() === 6,
          isEndWeekend: end.getDay() === 0 || end.getDay() === 6,
          startWeek: `${startWeekInfo.week} of ${startWeekInfo.year}`,
          endWeek: `${endWeekInfo.week} of ${endWeekInfo.year}`,
          startQuarter: getQuarter(start),
          endQuarter: getQuarter(end)
        });
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    setResult(null);
    setError(null);
  }, [mode]);

  const applyPreset = (days: number, isYear = false) => {
    setDaysNum(isYear ? 365 : days);
    setDirection('future');
    setCountMode('calendar');
    // We need to wait for state to update before calculating, or calculate directly
    setTimeout(handleCalculate, 0);
  };

  // Quick Reference Data
  const nowWeek = getISOWeek(now);
  const nowQuarter = getQuarter(now);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemainingMonth = daysInMonth - now.getDate();
  const endOfYear = new Date(now.getFullYear(), 11, 31);
  const daysRemainingYear = Math.ceil((endOfYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const daysSinceJan1 = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 px-4 sm:px-6 lg:px-8 pt-8 flex flex-col lg:flex-row gap-8">
      
      <div className="flex-1 space-y-8">
        <div className="text-center lg:text-left space-y-4">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Date Calculator
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            Add or subtract dates, find exact durations, and calculate days from now with full business day and holiday breakdowns.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-700 scrollbar-hide">
            {[
              { id: 'addSubtract', label: 'Add / Subtract' },
              { id: 'duration', label: 'Date Duration' },
              { id: 'daysFromNow', label: 'Days From Now' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id as Mode)}
                className={`flex-1 min-w-[140px] py-4 px-6 text-sm font-bold whitespace-nowrap transition-colors ${
                  mode === tab.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {mode === 'addSubtract' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={addStartDate}
                    onChange={(e) => setAddStartDate(e.target.value)}
                    className="w-full md:w-1/2 p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-lg w-full md:w-1/2">
                  <button
                    onClick={() => setOperation('add')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${operation === 'add' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    Add (+)
                  </button>
                  <button
                    onClick={() => setOperation('subtract')}
                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${operation === 'subtract' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    Subtract (-)
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { label: 'Years', val: addYearsInput, set: setAddYearsInput },
                    { label: 'Months', val: addMonthsInput, set: setAddMonthsInput },
                    { label: 'Weeks', val: addWeeksInput, set: setAddWeeksInput },
                    { label: 'Days', val: addDaysInput, set: setAddDaysInput },
                    { label: 'Hours', val: addHoursInput, set: setAddHoursInput },
                    { label: 'Minutes', val: addMinutesInput, set: setAddMinutesInput },
                  ].map((item, i) => (
                    <div key={i}>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{item.label}</label>
                      <input
                        type="number"
                        min="0"
                        value={item.val}
                        onChange={(e) => item.set(Number(e.target.value))}
                        className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={businessDaysOnly}
                      onChange={(e) => setBusinessDaysOnly(e.target.checked)}
                      className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300 block">Business Days Only</span>
                      <span className="text-xs text-slate-500">Only applies to day/week addition/subtraction. Years and months always use calendar arithmetic.</span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {mode === 'duration' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Start</h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={durStartDate}
                      onChange={(e) => setDurStartDate(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time (optional)</label>
                    <input
                      type="time"
                      value={durStartTime}
                      onChange={(e) => setDurStartTime(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">End</h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                    <input
                      type="date"
                      value={durEndDate}
                      onChange={(e) => setDurEndDate(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Time (optional)</label>
                    <input
                      type="time"
                      value={durEndTime}
                      onChange={(e) => setDurEndTime(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer mt-4">
                    <input
                      type="checkbox"
                      checked={includeEndDate}
                      onChange={(e) => setIncludeEndDate(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Include end date in count (+1 day)</span>
                  </label>
                </div>
              </div>
            )}

            {mode === 'daysFromNow' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Number of Days</label>
                    <input
                      type="number"
                      min="1"
                      max="99999"
                      value={daysNum}
                      onChange={(e) => setDaysNum(Number(e.target.value))}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 text-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Reference Date</label>
                    <input
                      type="date"
                      value={refDate}
                      onChange={(e) => setRefDate(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                    <button
                      onClick={() => setDirection('future')}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${direction === 'future' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      From Now (Future)
                    </button>
                    <button
                      onClick={() => setDirection('past')}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${direction === 'past' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      Before Now (Past)
                    </button>
                  </div>
                  <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                    <button
                      onClick={() => setCountMode('calendar')}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${countMode === 'calendar' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      Calendar Days
                    </button>
                    <button
                      onClick={() => setCountMode('business')}
                      className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${countMode === 'business' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                      Business Days
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Presets</p>
                  <div className="flex flex-wrap gap-2">
                    {[7, 14, 30, 60, 90, 180].map(d => (
                      <button
                        key={d}
                        onClick={() => applyPreset(d)}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        +{d} days
                      </button>
                    ))}
                    <button
                      onClick={() => applyPreset(365, true)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      +1 year
                    </button>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium border border-red-100 dark:border-red-800/50">
                {error}
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={handleCalculate}
                className="w-full py-4 bg-indigo-600 text-white font-black text-lg rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"
              >
                <Calculator className="w-6 h-6" /> Calculate
              </button>
            </div>
          </div>
        </div>

        {result && <Results mode={mode} result={result} />}
      </div>

      {/* Quick Reference Panel */}
      <div className="w-full lg:w-80 shrink-0">
        <div className="bg-slate-900 rounded-3xl shadow-xl border border-slate-800 overflow-hidden sticky top-8">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-indigo-400" /> Quick Reference
            </h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Today's Date</p>
              <p className="text-lg font-medium text-white">
                {now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 p-4 rounded-xl">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Week</p>
                <p className="text-xl font-bold text-white">{nowWeek.week}</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Quarter</p>
                <p className="text-xl font-bold text-white">{nowQuarter.split(' ')[0]}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-sm text-slate-400">Days left in month</span>
                <span className="font-mono font-bold text-white">{daysRemainingMonth}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-sm text-slate-400">Days left in year</span>
                <span className="font-mono font-bold text-white">{daysRemainingYear}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-400">Days since Jan 1</span>
                <span className="font-mono font-bold text-white">{daysSinceJan1}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
