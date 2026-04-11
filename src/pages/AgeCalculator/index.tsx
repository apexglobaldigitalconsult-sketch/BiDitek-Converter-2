import React, { useState, useEffect } from 'react';
import { calculateExactAge, calculateTotalUnits, ExactAge, TotalUnits } from './utils';
import Results from './Results';
import { Calculator, Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';

type Mode = 'myAge' | 'dateToDate' | 'units';

export default function AgeCalculator() {
  const [mode, setMode] = useState<Mode>('myAge');
  
  // My Age State
  const [dob, setDob] = useState<string>('1990-01-01');
  const [showBirthTime, setShowBirthTime] = useState(false);
  const [birthTime, setBirthTime] = useState<string>('00:00');
  const [asOfDate, setAsOfDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Date to Date State
  const [startDate, setStartDate] = useState<string>('2020-01-01');
  const [startTime, setStartTime] = useState<string>('00:00');
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endTime, setEndTime] = useState<string>('00:00');
  const [includeEndDate, setIncludeEndDate] = useState(false);

  // Units State
  const [unitMode, setUnitMode] = useState<'dob' | 'age'>('dob');
  const [unitDob, setUnitDob] = useState<string>('1990-01-01');
  const [unitAge, setUnitAge] = useState<string>('25');

  // Results State
  const [exactAge, setExactAge] = useState<ExactAge | null>(null);
  const [totalUnits, setTotalUnits] = useState<TotalUnits | null>(null);
  const [resultDob, setResultDob] = useState<Date | null>(null);
  const [resultAsOf, setResultAsOf] = useState<Date | null>(null);
  const [hasTime, setHasTime] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    setExactAge(null);
    setTotalUnits(null);

    try {
      if (mode === 'myAge') {
        const d = new Date(dob);
        if (isNaN(d.getTime())) throw new Error('Invalid Date of Birth');
        if (showBirthTime && birthTime) {
          const [h, m] = birthTime.split(':').map(Number);
          d.setHours(h, m, 0, 0);
        } else {
          d.setHours(0, 0, 0, 0);
        }

        const asOf = new Date(asOfDate);
        if (isNaN(asOf.getTime())) throw new Error('Invalid As Of Date');
        if (showBirthTime && birthTime) {
          const now = new Date();
          asOf.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), 0);
        } else {
          asOf.setHours(0, 0, 0, 0);
        }

        if (d.getTime() > asOf.getTime()) {
          throw new Error('Date of Birth cannot be after As Of Date.');
        }

        setExactAge(calculateExactAge(d, asOf));
        setTotalUnits(calculateTotalUnits(d, asOf));
        setResultDob(d);
        setResultAsOf(asOf);
        setHasTime(showBirthTime);

      } else if (mode === 'dateToDate') {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) throw new Error('Invalid Start Date');
        if (startTime) {
          const [h, m] = startTime.split(':').map(Number);
          start.setHours(h, m, 0, 0);
        }

        const end = new Date(endDate);
        if (isNaN(end.getTime())) throw new Error('Invalid End Date');
        if (endTime) {
          const [h, m] = endTime.split(':').map(Number);
          end.setHours(h, m, 0, 0);
        }

        if (start.getTime() > end.getTime()) {
          throw new Error('Start Date cannot be after End Date.');
        }

        setExactAge(calculateExactAge(start, end, includeEndDate));
        setTotalUnits(calculateTotalUnits(start, end, includeEndDate));
        setResultDob(start);
        setResultAsOf(end);
        setHasTime(!!startTime || !!endTime);

      } else if (mode === 'units') {
        let start = new Date();
        let end = new Date();
        
        if (unitMode === 'dob') {
          start = new Date(unitDob);
          if (isNaN(start.getTime())) throw new Error('Invalid Date of Birth');
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
          if (start.getTime() > end.getTime()) {
            throw new Error('Date of Birth cannot be in the future.');
          }
        } else {
          const ageNum = parseFloat(unitAge);
          if (isNaN(ageNum) || ageNum < 0) throw new Error('Please enter a valid positive age.');
          start = new Date(end.getTime() - ageNum * 365.25 * 24 * 60 * 60 * 1000);
        }

        setExactAge(calculateExactAge(start, end));
        setTotalUnits(calculateTotalUnits(start, end));
        setResultDob(start);
        setResultAsOf(end);
        setHasTime(false);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Clear results when mode changes
  useEffect(() => {
    setExactAge(null);
    setTotalUnits(null);
    setError(null);
  }, [mode, unitMode]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Age Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Calculate exact age, durations between dates, and explore personal birth details and milestones.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-700 scrollbar-hide">
          {[
            { id: 'myAge', label: 'My Age' },
            { id: 'dateToDate', label: 'Date to Date' },
            { id: 'units', label: 'Age in Units' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as Mode)}
              className={`flex-1 min-w-[120px] py-4 px-6 text-sm font-bold whitespace-nowrap transition-colors ${
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
          {mode === 'myAge' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <button
                  onClick={() => setShowBirthTime(!showBirthTime)}
                  className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
                >
                  {showBirthTime ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showBirthTime ? 'Hide birth time' : 'Add birth time for more precision'}
                </button>

                {showBirthTime && (
                  <div className="animate-in slide-in-from-top-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Birth Time (optional)</label>
                    <input
                      type="time"
                      value={birthTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">Optional — add your birth time for a more precise age down to the second.</p>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">As Of Date</label>
                <input
                  type="date"
                  value={asOfDate}
                  onChange={(e) => setAsOfDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-slate-500 mt-1">Defaults to today. Change to calculate age at a past or future date.</p>
              </div>
            </div>
          )}

          {mode === 'dateToDate' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Start</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time (optional)</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
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
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Time (optional)</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
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
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Include end date (+1 day)</span>
                </label>
              </div>
            </div>
          )}

          {mode === 'units' && (
            <div className="max-w-md mx-auto space-y-6">
              <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                <button
                  onClick={() => setUnitMode('dob')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${unitMode === 'dob' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Date of Birth
                </button>
                <button
                  onClick={() => setUnitMode('age')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${unitMode === 'age' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Enter Age Directly
                </button>
              </div>

              {unitMode === 'dob' ? (
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={unitDob}
                    onChange={(e) => setUnitDob(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Age in Years</label>
                  <input
                    type="number"
                    step="any"
                    value={unitAge}
                    onChange={(e) => setUnitAge(e.target.value)}
                    placeholder="e.g. 25.5"
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}
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
              <Calculator className="w-6 h-6" /> Calculate Age
            </button>
          </div>
        </div>
      </div>

      {exactAge && totalUnits && resultDob && resultAsOf && (
        <Results 
          mode={mode}
          exactAge={exactAge}
          totalUnits={totalUnits}
          dob={resultDob}
          asOf={resultAsOf}
          hasTime={hasTime}
        />
      )}
    </div>
  );
}
