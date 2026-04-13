import React, { useState, useEffect } from 'react';
import { parseTime, TIME_UNITS, TIMEZONES, REGION_PRESETS } from './utils';
import Results from './Results';
import { Calculator, Clock, Globe2, ArrowRightLeft, Plus, X } from 'lucide-react';

type Mode = 'addSubtract' | 'duration' | 'convert' | 'timeZones' | 'decimalTime' | 'workHours';

export default function TimeCalculator() {
  const [mode, setMode] = useState<Mode>('addSubtract');
  
  // Add/Subtract State
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [useBaseTime, setUseBaseTime] = useState(false);
  const [baseTime, setBaseTime] = useState('00:00:00');
  const [timeRows, setTimeRows] = useState([{ id: 1, days: 0, hours: 0, minutes: 0, seconds: 0 }]);

  // Duration State
  const [durStartTime, setDurStartTime] = useState('09:00:00');
  const [durStartDate, setDurStartDate] = useState('');
  const [durEndTime, setDurEndTime] = useState('17:00:00');
  const [durEndDate, setDurEndDate] = useState('');

  // Convert State
  const [convValue, setConvValue] = useState('1');
  const [convFrom, setConvFrom] = useState('hr');
  const [convTo, setConvTo] = useState('min');

  // Time Zones State
  const [tzRefTime, setTzRefTime] = useState(new Date().toTimeString().slice(0, 5));
  const [tzRefDate, setTzRefDate] = useState(new Date().toISOString().split('T')[0]);
  const [tzRefZone, setTzRefZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [tzSelected, setTzSelected] = useState<string[]>([Intl.DateTimeFormat().resolvedOptions().timeZone, 'UTC']);
  const [tzSearch, setTzSearch] = useState('');

  // Decimal Time State
  const [decMode, setDecMode] = useState<'toDec' | 'toHHMMSS'>('toHHMMSS');
  const [decInput, setDecInput] = useState('2.75');
  const [decH, setDecH] = useState(2);
  const [decM, setDecM] = useState(45);
  const [decS, setDecS] = useState(0);

  // Work Hours State
  const [workMode, setWorkMode] = useState<'daily' | 'weekly'>('daily');
  const [workStart, setWorkStart] = useState('09:00');
  const [workEnd, setWorkEnd] = useState('17:00');
  const [workBreak, setWorkBreak] = useState(60);
  const [workStdDay, setWorkStdDay] = useState(8);
  
  const [weeklyRows, setWeeklyRows] = useState([
    { name: 'Monday', worked: true, start: '09:00', end: '17:00', break: 60 },
    { name: 'Tuesday', worked: true, start: '09:00', end: '17:00', break: 60 },
    { name: 'Wednesday', worked: true, start: '09:00', end: '17:00', break: 60 },
    { name: 'Thursday', worked: true, start: '09:00', end: '17:00', break: 60 },
    { name: 'Friday', worked: true, start: '09:00', end: '17:00', break: 60 },
    { name: 'Saturday', worked: false, start: '09:00', end: '17:00', break: 0 },
    { name: 'Sunday', worked: false, start: '09:00', end: '17:00', break: 0 },
  ]);
  const [workStdWeek, setWorkStdWeek] = useState(40);
  const [workOtRate, setWorkOtRate] = useState(1.5);
  const [workHourlyRate, setWorkHourlyRate] = useState<number | ''>('');

  // Results & Error
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Clear results on mode change
  useEffect(() => {
    setResult(null);
    setError(null);
  }, [mode]);

  // Live conversion for Convert tab
  useEffect(() => {
    if (mode === 'convert') {
      const val = parseFloat(convValue);
      if (isNaN(val)) {
        setResult(null);
        return;
      }
      const fromFactor = TIME_UNITS.find(u => u.id === convFrom)?.factor || 1;
      const baseSeconds = val * fromFactor;
      
      const conversions = TIME_UNITS.map(u => ({
        id: u.id,
        name: u.name,
        value: baseSeconds / u.factor
      }));

      setResult({
        inputValue: val,
        fromUnit: convFrom,
        toUnit: convTo,
        conversions
      });
    }
  }, [mode, convValue, convFrom, convTo]);

  // Live conversion for Decimal Time tab
  useEffect(() => {
    if (mode === 'decimalTime') {
      if (decMode === 'toHHMMSS') {
        const val = parseFloat(decInput);
        if (isNaN(val)) {
          setResult(null);
          return;
        }
        const totalSeconds = val * 3600;
        const hh = Math.floor(Math.abs(val));
        const mm = Math.floor((Math.abs(val) - hh) * 60);
        const ss = Math.round(((Math.abs(val) - hh) * 60 - mm) * 60);
        setResult({
          decimalHours: val,
          hh, mm, ss,
          totalMinutes: totalSeconds / 60,
          totalSeconds
        });
      } else {
        const totalSeconds = (decH * 3600) + (decM * 60) + decS;
        const decimalHours = totalSeconds / 3600;
        setResult({
          decimalHours,
          hh: decH, mm: decM, ss: decS,
          totalMinutes: totalSeconds / 60,
          totalSeconds
        });
      }
    }
  }, [mode, decMode, decInput, decH, decM, decS]);

  const handleCalculate = () => {
    setError(null);
    setResult(null);

    try {
      if (mode === 'addSubtract') {
        let baseSec = 0;
        if (useBaseTime) {
          baseSec = parseTime(baseTime);
        }

        let sumSec = 0;
        timeRows.forEach(row => {
          sumSec += (row.days * 86400) + (row.hours * 3600) + (row.minutes * 60) + row.seconds;
        });

        const totalSeconds = operation === 'add' ? baseSec + sumSec : baseSec - sumSec;
        
        setResult({
          totalSeconds,
          baseTimeProvided: useBaseTime
        });

      } else if (mode === 'duration') {
        let startMs = 0;
        let endMs = 0;
        let isOvernight = false;

        if (durStartDate && durEndDate) {
          const sDate = new Date(`${durStartDate}T${durStartTime || '00:00:00'}`);
          const eDate = new Date(`${durEndDate}T${durEndTime || '00:00:00'}`);
          if (isNaN(sDate.getTime()) || isNaN(eDate.getTime())) throw new Error('Invalid date/time format');
          startMs = sDate.getTime();
          endMs = eDate.getTime();
        } else {
          startMs = parseTime(durStartTime) * 1000;
          endMs = parseTime(durEndTime) * 1000;
          if (endMs < startMs) {
            endMs += 86400000; // Add 24 hours
            isOvernight = true;
          }
        }

        if (endMs < startMs) throw new Error('End time cannot be before start time unless overnight is implied.');

        setResult({
          durationSeconds: (endMs - startMs) / 1000,
          isOvernight
        });

      } else if (mode === 'timeZones') {
        if (tzSelected.length === 0) throw new Error('Please select at least one time zone to display.');
        setResult({
          referenceDate: tzRefDate,
          referenceTime: tzRefTime,
          referenceZone: tzRefZone,
          selectedZones: tzSelected
        });

      } else if (mode === 'workHours') {
        if (workMode === 'daily') {
          const sSec = parseTime(workStart + ':00');
          let eSec = parseTime(workEnd + ':00');
          if (eSec < sSec) eSec += 86400; // overnight
          
          const workedSeconds = Math.max(0, (eSec - sSec) - (workBreak * 60));
          const regularSeconds = Math.min(workedSeconds, workStdDay * 3600);
          const overtimeSeconds = Math.max(0, workedSeconds - (workStdDay * 3600));

          setResult({
            isWeekly: false,
            daily: {
              workedSeconds,
              regularSeconds,
              overtimeSeconds,
              breakMinutes: workBreak
            }
          });
        } else {
          let totalWorkedHours = 0;
          const daysData = weeklyRows.map(day => {
            if (!day.worked) return { ...day, workedSeconds: 0 };
            const sSec = parseTime(day.start + ':00');
            let eSec = parseTime(day.end + ':00');
            if (eSec < sSec) eSec += 86400;
            const workedSeconds = Math.max(0, (eSec - sSec) - (day.break * 60));
            totalWorkedHours += workedSeconds / 3600;
            return { ...day, workedSeconds };
          });

          const regularHours = Math.min(totalWorkedHours, workStdWeek);
          const overtimeHours = Math.max(0, totalWorkedHours - workStdWeek);
          const rate = Number(workHourlyRate) || 0;
          const regularPay = regularHours * rate;
          const overtimePay = overtimeHours * rate * workOtRate;

          setResult({
            isWeekly: true,
            weekly: {
              days: daysData,
              totalWorkedHours,
              regularHours,
              overtimeHours,
              hourlyRate: rate,
              regularPay,
              overtimePay,
              totalPay: regularPay + overtimePay
            }
          });
        }
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const addTimeRow = () => {
    if (timeRows.length < 20) {
      setTimeRows([...timeRows, { id: Date.now(), days: 0, hours: 0, minutes: 0, seconds: 0 }]);
    }
  };

  const removeTimeRow = (id: number) => {
    if (timeRows.length > 1) {
      setTimeRows(timeRows.filter(r => r.id !== id));
    }
  };

  const updateTimeRow = (id: number, field: string, value: number) => {
    setTimeRows(timeRows.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const toggleTz = (zone: string) => {
    if (tzSelected.includes(zone)) {
      setTzSelected(tzSelected.filter(z => z !== zone));
    } else if (tzSelected.length < 15) {
      setTzSelected([...tzSelected, zone]);
    }
  };

  const addRegionPreset = (region: keyof typeof REGION_PRESETS) => {
    const newZones = [...new Set([...tzSelected, ...REGION_PRESETS[region]])].slice(0, 15);
    setTzSelected(newZones);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 px-4 sm:px-6 lg:px-8 pt-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Time Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Calculate time durations, add/subtract time, convert time zones, and calculate work hours.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl dark:rounded-xl shadow-xl border border-outline-variant/50 dark:border-slate-700 overflow-hidden">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-outline-variant/50 dark:border-slate-700 scrollbar-hide">
          {[
            { id: 'addSubtract', label: 'Add / Subtract' },
            { id: 'duration', label: 'Duration' },
            { id: 'convert', label: 'Convert' },
            { id: 'timeZones', label: 'Time Zones' },
            { id: 'decimalTime', label: 'Decimal Time' },
            { id: 'workHours', label: 'Work Hours' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as Mode)}
              className={`flex-1 min-w-[120px] py-4 px-6 text-sm font-bold whitespace-nowrap transition-colors ${
                mode === tab.id
                  ? 'bg-indigo-50 dark:bg-secondary/20 text-indigo-600 dark:text-secondary border-b-2 border-indigo-600 dark:border-secondary'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8 space-y-6">
          
          {/* ADD / SUBTRACT */}
          {mode === 'addSubtract' && (
            <div className="space-y-6">
              <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-lg w-full md:w-64">
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

              <div className="space-y-4">
                {timeRows.map((row, index) => (
                  <div key={row.id} className="flex flex-wrap md:flex-nowrap items-end gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-outline-variant/50 dark:border-slate-700">
                    <div className="w-full md:w-auto font-bold text-slate-500 dark:text-slate-400 pt-2 md:pt-0">
                      Time {index + 1}
                    </div>
                    <div className="flex-1 grid grid-cols-4 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Days</label>
                        <input type="number" min="0" value={row.days} onChange={(e) => updateTimeRow(row.id, 'days', Number(e.target.value))} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hrs</label>
                        <input type="number" min="0" max="23" value={row.hours} onChange={(e) => updateTimeRow(row.id, 'hours', Number(e.target.value))} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Min</label>
                        <input type="number" min="0" max="59" value={row.minutes} onChange={(e) => updateTimeRow(row.id, 'minutes', Number(e.target.value))} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sec</label>
                        <input type="number" min="0" max="59" value={row.seconds} onChange={(e) => updateTimeRow(row.id, 'seconds', Number(e.target.value))} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
                      </div>
                    </div>
                    {timeRows.length > 1 && (
                      <button onClick={() => removeTimeRow(row.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                
                {timeRows.length < 20 && (
                  <button onClick={addTimeRow} className="text-sm font-bold text-indigo-600 dark:text-secondary hover:text-indigo-700 flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add Another Time
                  </button>
                )}
              </div>

              <div className="pt-4 border-t border-outline-variant/50 dark:border-slate-700">
                <label className="flex items-center gap-2 cursor-pointer mb-4">
                  <input type="checkbox" checked={useBaseTime} onChange={(e) => setUseBaseTime(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Start with a base time (HH:MM:SS)</span>
                </label>
                {useBaseTime && (
                  <input type="time" step="1" value={baseTime} onChange={(e) => setBaseTime(e.target.value)} className="w-full md:w-64 p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                )}
              </div>
            </div>
          )}

          {/* DURATION */}
          {mode === 'duration' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white border-b border-outline-variant/50 dark:border-slate-700 pb-2">Start Time</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time (HH:MM:SS)</label>
                  <input type="time" step="1" value={durStartTime} onChange={(e) => setDurStartTime(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date (Optional)</label>
                  <input type="date" value={durStartDate} onChange={(e) => setDurStartDate(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white border-b border-outline-variant/50 dark:border-slate-700 pb-2">End Time</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time (HH:MM:SS)</label>
                  <input type="time" step="1" value={durEndTime} onChange={(e) => setDurEndTime(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date (Optional)</label>
                  <input type="date" value={durEndDate} onChange={(e) => setDurEndDate(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                </div>
                {!durStartDate && !durEndDate && durEndTime < durStartTime && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg border border-amber-200 dark:border-amber-800/50">
                    Note: Assuming end time is the following day.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* CONVERT */}
          {mode === 'convert' && (
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Input Value</label>
                <input type="number" step="any" value={convValue} onChange={(e) => setConvValue(e.target.value)} className="w-full p-4 text-xl font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">From Unit</label>
                <select value={convFrom} onChange={(e) => setConvFrom(e.target.value)} className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                  {TIME_UNITS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <button 
                onClick={() => { const temp = convFrom; setConvFrom(convTo); setConvTo(temp); }}
                className="p-4 mt-6 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Swap units"
              >
                <ArrowRightLeft className="w-6 h-6" />
              </button>
              <div className="flex-1 w-full">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">To Unit</label>
                <select value={convTo} onChange={(e) => setConvTo(e.target.value)} className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                  {TIME_UNITS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* TIME ZONES */}
          {mode === 'timeZones' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Reference Time</label>
                  <input type="time" value={tzRefTime} onChange={(e) => setTzRefTime(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Reference Date</label>
                  <input type="date" value={tzRefDate} onChange={(e) => setTzRefDate(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Reference Time Zone</label>
                  <select value={tzRefZone} onChange={(e) => setTzRefZone(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500">
                    {TIMEZONES.map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Time Zones to Display (Max 15)</label>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {Object.keys(REGION_PRESETS).map(region => (
                    <button key={region} onClick={() => addRegionPreset(region as keyof typeof REGION_PRESETS)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      + {region}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 p-4 min-h-[100px] border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                  {tzSelected.map(zone => (
                    <span key={zone} className="inline-flex items-center gap-1 px-3 py-1 bg-white dark:bg-slate-800 border border-outline-variant/50 dark:border-slate-700 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300">
                      {zone.split('/').pop()?.replace(/_/g, ' ')}
                      <button onClick={() => toggleTz(zone)} className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                    </span>
                  ))}
                  {tzSelected.length === 0 && <span className="text-slate-500 italic text-sm">No time zones selected...</span>}
                </div>

                <div className="relative">
                  <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search time zones to add..." 
                    value={tzSearch}
                    onChange={(e) => setTzSearch(e.target.value)}
                    className="w-full pl-10 p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                  {tzSearch && (
                    <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white dark:bg-slate-800 border border-outline-variant/50 dark:border-slate-700 rounded-xl shadow-lg">
                      {TIMEZONES.filter(z => z.toLowerCase().includes(tzSearch.toLowerCase())).slice(0, 50).map(z => (
                        <li key={z}>
                          <button 
                            onClick={() => { toggleTz(z); setTzSearch(''); }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-300 flex justify-between items-center"
                          >
                            {z}
                            {tzSelected.includes(z) && <span className="text-indigo-600 dark:text-secondary font-bold text-xs">Added</span>}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* DECIMAL TIME */}
          {mode === 'decimalTime' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
                <button
                  onClick={() => setDecMode('toHHMMSS')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${decMode === 'toHHMMSS' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Decimal → HH:MM:SS
                </button>
                <button
                  onClick={() => setDecMode('toDec')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${decMode === 'toDec' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  HH:MM:SS → Decimal
                </button>
              </div>

              {decMode === 'toHHMMSS' ? (
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Decimal Hours</label>
                  <input type="number" step="any" value={decInput} onChange={(e) => setDecInput(e.target.value)} placeholder="e.g. 2.75" className="w-full p-4 text-xl font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Hours</label>
                    <input type="number" min="0" value={decH} onChange={(e) => setDecH(Number(e.target.value))} className="w-full p-4 text-xl font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Minutes</label>
                    <input type="number" min="0" max="59" value={decM} onChange={(e) => setDecM(Number(e.target.value))} className="w-full p-4 text-xl font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Seconds</label>
                    <input type="number" min="0" max="59" value={decS} onChange={(e) => setDecS(Number(e.target.value))} className="w-full p-4 text-xl font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* WORK HOURS */}
          {mode === 'workHours' && (
            <div className="space-y-6">
              <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-lg w-full md:w-64 mx-auto">
                <button
                  onClick={() => setWorkMode('daily')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${workMode === 'daily' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setWorkMode('weekly')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${workMode === 'weekly' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Weekly
                </button>
              </div>

              {workMode === 'daily' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                    <input type="time" value={workStart} onChange={(e) => setWorkStart(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Time</label>
                    <input type="time" value={workEnd} onChange={(e) => setWorkEnd(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Break Duration (minutes)</label>
                    <input type="number" min="0" value={workBreak} onChange={(e) => setWorkBreak(Number(e.target.value))} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Standard Hours Per Day</label>
                    <input type="number" min="1" max="24" value={workStdDay} onChange={(e) => setWorkStdDay(Number(e.target.value))} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                        <tr>
                          <th className="py-2 px-4 font-bold">Day</th>
                          <th className="py-2 px-4 font-bold">Worked?</th>
                          <th className="py-2 px-4 font-bold">Start Time</th>
                          <th className="py-2 px-4 font-bold">End Time</th>
                          <th className="py-2 px-4 font-bold">Break (min)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {weeklyRows.map((row, i) => (
                          <tr key={i} className={row.worked ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-800/50 opacity-60'}>
                            <td className="py-2 px-4 font-medium text-slate-900 dark:text-white">{row.name}</td>
                            <td className="py-2 px-4">
                              <input type="checkbox" checked={row.worked} onChange={(e) => {
                                const newRows = [...weeklyRows];
                                newRows[i].worked = e.target.checked;
                                setWeeklyRows(newRows);
                              }} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                            </td>
                            <td className="py-2 px-4">
                              <input type="time" disabled={!row.worked} value={row.start} onChange={(e) => {
                                const newRows = [...weeklyRows];
                                newRows[i].start = e.target.value;
                                setWeeklyRows(newRows);
                              }} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-50" />
                            </td>
                            <td className="py-2 px-4">
                              <input type="time" disabled={!row.worked} value={row.end} onChange={(e) => {
                                const newRows = [...weeklyRows];
                                newRows[i].end = e.target.value;
                                setWeeklyRows(newRows);
                              }} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-50" />
                            </td>
                            <td className="py-2 px-4">
                              <input type="number" min="0" disabled={!row.worked} value={row.break} onChange={(e) => {
                                const newRows = [...weeklyRows];
                                newRows[i].break = Number(e.target.value);
                                setWeeklyRows(newRows);
                              }} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-50" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-outline-variant/50 dark:border-slate-700">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Standard Hours/Week</label>
                      <input type="number" min="1" value={workStdWeek} onChange={(e) => setWorkStdWeek(Number(e.target.value))} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Overtime Rate (Multiplier)</label>
                      <input type="number" step="0.1" min="1" value={workOtRate} onChange={(e) => setWorkOtRate(Number(e.target.value))} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hourly Rate ($) - Optional</label>
                      <input type="number" step="0.01" min="0" value={workHourlyRate} onChange={(e) => setWorkHourlyRate(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g. 25.00" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-medium border border-red-100 dark:border-red-800/50">
              {error}
            </div>
          )}

          {mode !== 'convert' && mode !== 'decimalTime' && (
            <div className="pt-4">
              <button
                onClick={handleCalculate}
                className="w-full py-4 bg-indigo-600 dark:bg-secondary text-white font-black text-lg rounded-xl hover:bg-indigo-700 dark:hover:bg-[#ff7a1a] transition-colors shadow-md shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"
              >
                <Calculator className="w-6 h-6" /> Calculate
              </button>
            </div>
          )}
        </div>
      </div>

      {result && <Results mode={mode} result={result} />}
    </div>
  );
}
