import React, { useState, useEffect } from 'react';
import { ChevronRight, Info, Calendar as CalendarIcon, Clock, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';

type CalcMode = 'countdown' | 'countup' | 'duration';

interface SavedEvent {
  id: string;
  name: string;
  targetDate: Date;
  mode: 'countdown' | 'countup';
}

interface Breakdown {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  totalWeeks: number;
  businessDays: number;
  weekendDays: number;
}

export default function DueDateCalculator() {
  const [mode, setMode] = useState<CalcMode>('countdown');
  const [now, setNow] = useState(new Date());

  // Live Tick Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Inputs - Countdown
  const [cdName, setCdName] = useState('');
  const [cdDate, setCdDate] = useState('');
  const [cdTime, setCdTime] = useState('00:00');

  // Inputs - Count Up
  const [cuName, setCuName] = useState('');
  const [cuDate, setCuDate] = useState('');
  const [cuTime, setCuTime] = useState('00:00');

  // Inputs - Duration
  const [durStartDate, setDurStartDate] = useState('');
  const [durStartTime, setDurStartTime] = useState('00:00');
  const [durEndDate, setDurEndDate] = useState('');
  const [durEndTime, setDurEndTime] = useState('00:00');
  const [durIncludeEnd, setDurIncludeEnd] = useState(false);

  // UI States
  const [errors, setErrors] = useState<string[]>([]);
  const [results, setResults] = useState<{
    mode: CalcMode;
    name: string;
    start: Date;
    end: Date;
    calcDate: Date;
    includeEnd: boolean;
  } | null>(null);

  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([]);

  // Helpers
  const parseDateTime = (dateStr: string, timeStr: string) => {
    if (!dateStr) return new Date(NaN);
    const [y, m, d] = dateStr.split('-').map(Number);
    const [hr, min] = (timeStr || '00:00').split(':').map(Number);
    return new Date(y, m - 1, d, hr, min, 0);
  };

  const toDateInputString = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Presets Logic
  const getEaster = (year: number) => {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  };

  const getThanksgiving = (year: number) => {
    const nov1 = new Date(year, 10, 1);
    const dayOfWeek = nov1.getDay();
    const offset = (4 - dayOfWeek + 7) % 7;
    const firstThursday = 1 + offset;
    return new Date(year, 10, firstThursday + 21);
  };

  const applyPreset = (name: string, getNextDate: () => Date) => {
    setCdName(name);
    setCdDate(toDateInputString(getNextDate()));
    setCdTime('00:00');
    setErrors([]);
  };

  const presets = [
    { name: "🎉 New Year's Day", get: () => new Date(now.getFullYear() + 1, 0, 1) },
    { name: "🎄 Christmas", get: () => { const d = new Date(now.getFullYear(), 11, 25); return d < now ? new Date(now.getFullYear() + 1, 11, 25) : d; } },
    { name: "🎆 New Year's Eve", get: () => { const d = new Date(now.getFullYear(), 11, 31); return d < now ? new Date(now.getFullYear() + 1, 11, 31) : d; } },
    { name: "🏖️ Summer Solstice", get: () => { const d = new Date(now.getFullYear(), 5, 21); return d < now ? new Date(now.getFullYear() + 1, 5, 21) : d; } },
    { name: "❄️ Winter Solstice", get: () => { const d = new Date(now.getFullYear(), 11, 21); return d < now ? new Date(now.getFullYear() + 1, 11, 21) : d; } },
    { name: "💝 Valentine's Day", get: () => { const d = new Date(now.getFullYear(), 1, 14); return d < now ? new Date(now.getFullYear() + 1, 1, 14) : d; } },
    { name: "🌸 Easter", get: () => { const d = getEaster(now.getFullYear()); return d < now ? getEaster(now.getFullYear() + 1) : d; } },
    { name: "🦃 Thanksgiving", get: () => { const d = getThanksgiving(now.getFullYear()); return d < now ? getThanksgiving(now.getFullYear() + 1) : d; } },
    { name: "👻 Halloween", get: () => { const d = new Date(now.getFullYear(), 9, 31); return d < now ? new Date(now.getFullYear() + 1, 9, 31) : d; } },
  ];

  // Calculation Logic
  const getBreakdown = (start: Date, end: Date, includeEnd: boolean = false): Breakdown => {
    let isNegative = false;
    let s = new Date(start.getTime());
    let e = new Date(end.getTime());

    if (s > e) {
      const temp = s; s = e; e = temp;
      isNegative = true;
    }

    if (includeEnd) {
      e = new Date(e.getTime() + 24 * 60 * 60 * 1000);
    }

    const totalMs = e.getTime() - s.getTime();
    const totalSeconds = Math.floor(totalMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);

    let y = e.getFullYear() - s.getFullYear();
    let m = e.getMonth() - s.getMonth();
    let d = e.getDate() - s.getDate();

    if (d < 0) {
      m -= 1;
      const prevMonth = new Date(e.getFullYear(), e.getMonth(), 0);
      d += prevMonth.getDate();
    }
    if (m < 0) {
      y -= 1;
      m += 12;
    }

    let hrs = e.getHours() - s.getHours();
    let mins = e.getMinutes() - s.getMinutes();
    let secs = e.getSeconds() - s.getSeconds();

    if (secs < 0) { mins -= 1; secs += 60; }
    if (mins < 0) { hrs -= 1; mins += 60; }
    if (hrs < 0) {
      d -= 1;
      hrs += 24;
      if (d < 0) {
        m -= 1;
        const prevMonth = new Date(e.getFullYear(), e.getMonth(), 0);
        d += prevMonth.getDate();
        if (m < 0) {
          y -= 1;
          m += 12;
        }
      }
    }

    // Business Days
    let businessDays = 0;
    let cur = new Date(s.getTime());
    cur.setHours(0, 0, 0, 0);
    const endNorm = new Date(e.getTime());
    endNorm.setHours(0, 0, 0, 0);

    while (cur < endNorm) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) businessDays++;
      cur.setDate(cur.getDate() + 1);
    }

    const weekendDays = totalDays - businessDays;

    return {
      years: y, months: m, days: d,
      hours: hrs, minutes: mins, seconds: secs,
      totalDays, totalHours, totalMinutes, totalSeconds, totalWeeks,
      businessDays, weekendDays
    };
  };

  const handleCalculate = () => {
    const errs: string[] = [];
    let start = now;
    let end = now;
    let name = '';
    let includeEnd = false;

    if (mode === 'countdown') {
      name = cdName || 'Target Date';
      if (!cdDate) errs.push("Please select a target date.");
      else {
        end = parseDateTime(cdDate, cdTime);
        if (end <= now) errs.push("Target date and time must be in the future.");
      }
    } else if (mode === 'countup') {
      name = cuName || 'Start Date';
      if (!cuDate) errs.push("Please select a start date.");
      else {
        start = parseDateTime(cuDate, cuTime);
        if (start > now) errs.push("Start date and time must be in the past.");
      }
    } else if (mode === 'duration') {
      name = 'Duration';
      includeEnd = durIncludeEnd;
      if (!durStartDate) errs.push("Please select a start date.");
      if (!durEndDate) errs.push("Please select an end date.");
      if (durStartDate && durEndDate) {
        start = parseDateTime(durStartDate, durStartTime);
        end = parseDateTime(durEndDate, durEndTime);
        if (start > end) errs.push("End date must be after start date.");
      }
    }

    if (errs.length > 0) {
      setErrors(errs);
      setResults(null);
    } else {
      setErrors([]);
      setResults({
        mode,
        name,
        start,
        end,
        calcDate: new Date(),
        includeEnd
      });
    }
  };

  const handleTabSwitch = (newMode: CalcMode) => {
    setMode(newMode);
    setResults(null);
    setErrors([]);
  };

  const addToBoard = () => {
    if (!results || (results.mode === 'duration')) return;
    if (savedEvents.length >= 10) {
      alert("You can only save up to 10 events.");
      return;
    }
    const newEvent: SavedEvent = {
      id: Math.random().toString(36).substr(2, 9),
      name: results.name,
      targetDate: results.mode === 'countdown' ? results.end : results.start,
      mode: results.mode
    };
    setSavedEvents([...savedEvents, newEvent]);
  };

  const removeSavedEvent = (id: string) => {
    setSavedEvents(savedEvents.filter(e => e.id !== id));
  };

  const quickAddHoliday = (preset: { name: string, get: () => Date }) => {
    if (savedEvents.length >= 10) {
      alert("You can only save up to 10 events.");
      return;
    }
    const newEvent: SavedEvent = {
      id: Math.random().toString(36).substr(2, 9),
      name: preset.name,
      targetDate: preset.get(),
      mode: 'countdown'
    };
    setSavedEvents([...savedEvents, newEvent]);
  };

  // Render Helpers
  const renderDigit = (value: number, label: string) => (
    <div className="flex flex-col items-center">
      <div className="bg-surface-container-highest text-primary font-mono text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black p-3 sm:p-4 rounded-[1px] shadow-inner border border-outline-variant/50 min-w-[60px] sm:min-w-[80px] text-center">
        {value.toString().padStart(2, '0')}
      </div>
      <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-primary/40 mt-2">{label}</span>
    </div>
  );

  const renderProgressBar = (label: string, percent: number) => (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between items-end mb-2">
        <span className="text-xs font-bold text-primary/60 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-bold text-primary">{percent.toFixed(2)}%</span>
      </div>
      <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
        <div className="h-full bg-secondary transition-all duration-1000 ease-linear" style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
      </div>
    </div>
  );

  // Current Results Calculation
  let currentBreakdown: Breakdown | null = null;
  if (results) {
    if (results.mode === 'countdown') {
      currentBreakdown = getBreakdown(now, results.end);
    } else if (results.mode === 'countup') {
      currentBreakdown = getBreakdown(results.start, now);
    } else {
      currentBreakdown = getBreakdown(results.start, results.end, results.includeEnd);
    }
  }

  // Percentages
  const currentYear = now.getFullYear();
  const startOfYear = new Date(currentYear, 0, 1).getTime();
  const endOfYear = new Date(currentYear + 1, 0, 1).getTime();
  const yearPercent = ((now.getTime() - startOfYear) / (endOfYear - startOfYear)) * 100;

  const currentMonth = now.getMonth();
  const startOfMonth = new Date(currentYear, currentMonth, 1).getTime();
  const endOfMonth = new Date(currentYear, currentMonth + 1, 1).getTime();
  const monthPercent = ((now.getTime() - startOfMonth) / (endOfMonth - startOfMonth)) * 100;

  let waitPercent = 0;
  if (results && results.mode === 'countdown') {
    const totalWait = results.end.getTime() - results.calcDate.getTime();
    const elapsedWait = now.getTime() - results.calcDate.getTime();
    waitPercent = totalWait > 0 ? (elapsedWait / totalWait) * 100 : 100;
  }

  return (
    <div className="px-6 lg:px-16 py-12 lg:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-3 text-[10px] font-label font-black uppercase tracking-[0.2em] text-primary/30 mb-12">
        <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/calculators" className="hover:text-secondary transition-colors">Calculators</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-secondary font-black">Due Date Calculator</span>
      </nav>

      <div className="mb-12">
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter text-primary leading-[1.1]">Due Date Calculator</h1>
        <p className="text-primary/50 mt-6 max-w-2xl font-body text-lg leading-relaxed">
          Count down to future events, count up from past milestones, or find the exact duration between any two dates.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-12 bg-surface-container-low p-2 rounded-[1px] border border-outline-variant/30 inline-flex">
        {[
          { id: 'countdown', label: 'Countdown To' },
          { id: 'countup', label: 'Count Up From' },
          { id: 'duration', label: 'Date Duration' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => handleTabSwitch(t.id as CalcMode)}
            className={cn(
              "px-6 py-3 rounded-[1px] font-headline font-bold text-sm transition-all",
              mode === t.id ? "bg-secondary text-white shadow-md" : "text-primary/60 hover:text-primary hover:bg-surface-container"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        {/* Input Section */}
        <div className="xl:col-span-5 bg-surface-container-low rounded-[1px] p-8 lg:p-12 space-y-10 border border-outline-variant/30 shadow-sm">
          
          {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-[1px]">
              <ul className="list-disc pl-4 text-red-500 text-sm font-medium space-y-1">
                {errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}

          {/* Countdown Inputs */}
          {mode === 'countdown' && (
            <>
              <div className="space-y-4">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Event Name</label>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                  <input 
                    type="text" 
                    value={cdName}
                    onChange={(e) => setCdName(e.target.value)}
                    placeholder="e.g. My Birthday, New Year, Vacation…"
                    className="w-full bg-transparent border-none py-4 text-lg font-headline font-bold focus:ring-0 text-primary placeholder:text-primary/20"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Target Date</label>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-4 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                    <input 
                      type="date" 
                      value={cdDate}
                      onChange={(e) => setCdDate(e.target.value)}
                      className="w-full bg-transparent border-none py-4 text-base font-headline font-bold focus:ring-0 text-primary"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end pl-2">
                    <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Target Time</label>
                    <span className="text-[10px] text-primary/30 italic">Optional</span>
                  </div>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-4 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                    <input 
                      type="time" 
                      value={cdTime}
                      onChange={(e) => setCdTime(e.target.value)}
                      className="w-full bg-transparent border-none py-4 text-base font-headline font-bold focus:ring-0 text-primary"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-outline-variant/20">
                <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 mb-4 pl-2">Quick Presets</p>
                <div className="flex flex-wrap gap-2">
                  {presets.map(p => (
                    <button
                      key={p.name}
                      onClick={() => applyPreset(p.name, p.get)}
                      className="bg-surface-container hover:bg-secondary/10 hover:text-secondary text-primary/70 text-xs font-bold py-2 px-3 rounded-[1px] transition-colors border border-transparent hover:border-secondary/30"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Count Up Inputs */}
          {mode === 'countup' && (
            <>
              <div className="space-y-4">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Event Name</label>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                  <input 
                    type="text" 
                    value={cuName}
                    onChange={(e) => setCuName(e.target.value)}
                    placeholder="e.g. Wedding Anniversary, Quit Smoking…"
                    className="w-full bg-transparent border-none py-4 text-lg font-headline font-bold focus:ring-0 text-primary placeholder:text-primary/20"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Start Date</label>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-4 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                    <input 
                      type="date" 
                      value={cuDate}
                      onChange={(e) => setCuDate(e.target.value)}
                      className="w-full bg-transparent border-none py-4 text-base font-headline font-bold focus:ring-0 text-primary"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end pl-2">
                    <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Start Time</label>
                    <span className="text-[10px] text-primary/30 italic">Optional</span>
                  </div>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-4 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                    <input 
                      type="time" 
                      value={cuTime}
                      onChange={(e) => setCuTime(e.target.value)}
                      className="w-full bg-transparent border-none py-4 text-base font-headline font-bold focus:ring-0 text-primary"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Duration Inputs */}
          {mode === 'duration' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Start Date</label>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-4 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                    <input 
                      type="date" 
                      value={durStartDate}
                      onChange={(e) => setDurStartDate(e.target.value)}
                      className="w-full bg-transparent border-none py-4 text-base font-headline font-bold focus:ring-0 text-primary"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end pl-2">
                    <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Start Time</label>
                    <span className="text-[10px] text-primary/30 italic">Optional</span>
                  </div>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-4 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                    <input 
                      type="time" 
                      value={durStartTime}
                      onChange={(e) => setDurStartTime(e.target.value)}
                      className="w-full bg-transparent border-none py-4 text-base font-headline font-bold focus:ring-0 text-primary"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">End Date</label>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-4 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                    <input 
                      type="date" 
                      value={durEndDate}
                      onChange={(e) => setDurEndDate(e.target.value)}
                      className="w-full bg-transparent border-none py-4 text-base font-headline font-bold focus:ring-0 text-primary"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-end pl-2">
                    <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">End Time</label>
                    <span className="text-[10px] text-primary/30 italic">Optional</span>
                  </div>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-4 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                    <input 
                      type="time" 
                      value={durEndTime}
                      onChange={(e) => setDurEndTime(e.target.value)}
                      className="w-full bg-transparent border-none py-4 text-base font-headline font-bold focus:ring-0 text-primary"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 pl-2">
                <input 
                  type="checkbox" 
                  id="includeEnd"
                  checked={durIncludeEnd}
                  onChange={(e) => setDurIncludeEnd(e.target.checked)}
                  className="w-5 h-5 rounded-[1px] text-secondary focus:ring-secondary/50 bg-surface-container border-outline-variant/30"
                />
                <label htmlFor="includeEnd" className="text-sm font-bold text-primary/70 cursor-pointer">
                  Include end date in count (+1 day)
                </label>
              </div>
            </>
          )}

          <button 
            onClick={handleCalculate}
            className="w-full bg-secondary text-white py-6 rounded-[1px] font-headline font-bold text-xl hover:opacity-90 transition-all shadow-lg shadow-secondary/20 mt-8"
          >
            CALCULATE
          </button>
        </div>

        {/* Results Section */}
        <div className="xl:col-span-7 space-y-8">
          <AnimatePresence mode="wait">
            {results && currentBreakdown ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Section 1: Primary Live Display */}
                <div className="bg-surface-container-low rounded-[1px] p-8 md:p-10 border border-outline-variant/30 shadow-sm text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary/40 via-secondary to-secondary/40"></div>
                  <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 mb-2">
                    {results.mode === 'countdown' ? 'Time until' : results.mode === 'countup' ? 'Time since' : 'Duration of'}
                  </p>
                  <h2 className="font-headline text-2xl md:text-3xl font-extrabold text-primary tracking-tighter mb-8">
                    {results.name}
                  </h2>
                  
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
                    {currentBreakdown.years > 0 && renderDigit(currentBreakdown.years, 'Years')}
                    {(currentBreakdown.years > 0 || currentBreakdown.months > 0) && renderDigit(currentBreakdown.months, 'Months')}
                    {renderDigit(currentBreakdown.days, 'Days')}
                    {renderDigit(currentBreakdown.hours, 'Hours')}
                    {renderDigit(currentBreakdown.minutes, 'Minutes')}
                    {renderDigit(currentBreakdown.seconds, 'Seconds')}
                  </div>

                  <div className="space-y-1 text-sm font-medium text-primary/60">
                    <p>That's <strong className="text-primary">{currentBreakdown.totalDays.toLocaleString()}</strong> total days</p>
                    <p>Or <strong className="text-primary">{currentBreakdown.totalWeeks.toLocaleString()}</strong> weeks and <strong className="text-primary">{currentBreakdown.totalDays % 7}</strong> days</p>
                    <p>Or approximately <strong className="text-primary">{currentBreakdown.totalHours.toLocaleString()}</strong> hours</p>
                  </div>

                  {results.mode !== 'duration' && (
                    <button 
                      onClick={addToBoard}
                      className="mt-8 inline-flex items-center gap-2 bg-surface-container hover:bg-secondary/10 hover:text-secondary text-primary/70 text-xs font-bold py-3 px-6 rounded-[1px] transition-colors border border-outline-variant/30 hover:border-secondary/30 uppercase tracking-widest"
                    >
                      <Plus className="w-4 h-4" /> Add to Board
                    </button>
                  )}
                </div>

                {/* Section 2: Full Date & Time Breakdown */}
                <div className="bg-surface-container-low rounded-[1px] p-8 md:p-10 border border-outline-variant/30 shadow-sm">
                  <h3 className="font-headline text-xl font-bold mb-6 text-primary">Full Time Breakdown</h3>
                  <div className="overflow-hidden rounded-[1px] border border-outline-variant/30">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-surface-container font-label text-[10px] font-black uppercase tracking-widest text-primary/40">
                        <tr>
                          <th className="p-4">Unit</th>
                          <th className="p-4 text-right">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-outline-variant/20">
                          <td className="p-4 text-primary">Years</td>
                          <td className="p-4 text-right text-primary">{currentBreakdown.years} years, {currentBreakdown.months} months, {currentBreakdown.days} days</td>
                        </tr>
                        <tr className="border-t border-outline-variant/20">
                          <td className="p-4 text-primary">Months</td>
                          <td className="p-4 text-right text-primary">{currentBreakdown.years * 12 + currentBreakdown.months} months, {currentBreakdown.days} days</td>
                        </tr>
                        <tr className="border-t border-outline-variant/20">
                          <td className="p-4 text-primary">Weeks</td>
                          <td className="p-4 text-right text-primary">{currentBreakdown.totalWeeks} weeks, {currentBreakdown.totalDays % 7} days</td>
                        </tr>
                        <tr className="border-t border-outline-variant/20 bg-secondary/5 font-bold">
                          <td className="p-4 text-secondary">Total Days</td>
                          <td className="p-4 text-right text-secondary">{currentBreakdown.totalDays.toLocaleString()} days</td>
                        </tr>
                        <tr className="border-t border-outline-variant/20">
                          <td className="p-4 text-primary">Total Hours</td>
                          <td className="p-4 text-right text-primary">{currentBreakdown.totalHours.toLocaleString()} hours</td>
                        </tr>
                        <tr className="border-t border-outline-variant/20">
                          <td className="p-4 text-primary">Total Minutes</td>
                          <td className="p-4 text-right text-primary">{currentBreakdown.totalMinutes.toLocaleString()} minutes</td>
                        </tr>
                        <tr className="border-t border-outline-variant/20">
                          <td className="p-4 text-primary">Total Seconds</td>
                          <td className="p-4 text-right text-primary">{currentBreakdown.totalSeconds.toLocaleString()} seconds</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 3: Business Days vs Calendar Days */}
                <div className="bg-surface-container-low rounded-[1px] p-8 md:p-10 border border-outline-variant/30 shadow-sm">
                  <h3 className="font-headline text-xl font-bold mb-6 text-primary">Business Days vs Calendar Days</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-surface-container p-4 rounded-[1px]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Calendar Days</p>
                      <p className="font-headline font-bold text-xl text-primary">{currentBreakdown.totalDays.toLocaleString()}</p>
                    </div>
                    <div className="bg-secondary/10 p-4 rounded-[1px] border border-secondary/20">
                      <p className="text-[10px] font-black uppercase tracking-widest text-secondary/60 mb-1">Business Days</p>
                      <p className="font-headline font-bold text-xl text-secondary">{currentBreakdown.businessDays.toLocaleString()}</p>
                    </div>
                    <div className="bg-surface-container p-4 rounded-[1px]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Weekend Days</p>
                      <p className="font-headline font-bold text-xl text-primary">{currentBreakdown.weekendDays.toLocaleString()}</p>
                    </div>
                    <div className="bg-surface-container p-4 rounded-[1px]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Weekends %</p>
                      <p className="font-headline font-bold text-xl text-primary">
                        {currentBreakdown.totalDays > 0 ? ((currentBreakdown.weekendDays / currentBreakdown.totalDays) * 100).toFixed(1) : 0}%
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-primary/40 italic">
                    * Business days exclude weekends only (Mon–Fri). Public holidays are not accounted for as they vary by region.
                  </p>
                </div>

                {/* Section 4: Percentage Progress */}
                <div className="bg-surface-container-low rounded-[1px] p-8 md:p-10 border border-outline-variant/30 shadow-sm">
                  <h3 className="font-headline text-xl font-bold mb-6 text-primary">Percentage Progress</h3>
                  <div className="space-y-6">
                    {renderProgressBar(`${currentYear} is ${yearPercent.toFixed(1)}% complete`, yearPercent)}
                    {renderProgressBar(`${now.toLocaleString('default', { month: 'long' })} is ${monthPercent.toFixed(1)}% complete`, monthPercent)}
                    
                    {results.mode === 'countdown' && (
                      <div className="pt-6 border-t border-outline-variant/20">
                        {renderProgressBar(`Wait for ${results.name} is ${waitPercent.toFixed(1)}% complete`, waitPercent)}
                      </div>
                    )}
                  </div>
                </div>

              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-surface-container-low rounded-[1px] p-16 border border-outline-variant/30 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[400px]"
              >
                <Clock className="w-12 h-12 text-primary/20 mb-4" />
                <p className="font-headline font-bold text-xl text-primary/40">Ready to Calculate</p>
                <p className="text-sm text-primary/30 mt-2">Fill out the fields and click calculate to see your detailed time breakdown.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section 5: Saved Due Dates Board */}
          <div className="bg-surface-container-low rounded-[1px] p-8 md:p-10 border border-outline-variant/30 shadow-sm mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="font-headline text-xl font-bold text-primary">Saved Events Board</h3>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 flex items-center mr-2">Quick Add:</span>
                <button onClick={() => quickAddHoliday(presets[0])} className="text-xs font-bold text-secondary hover:underline">New Year</button>
                <button onClick={() => quickAddHoliday(presets[1])} className="text-xs font-bold text-secondary hover:underline">Christmas</button>
                <button onClick={() => quickAddHoliday(presets[8])} className="text-xs font-bold text-secondary hover:underline">Halloween</button>
              </div>
            </div>

            {savedEvents.length === 0 ? (
              <div className="bg-surface-container p-8 rounded-[1px] text-center border border-dashed border-outline-variant/50">
                <p className="text-primary/60 font-medium">No due dates saved yet. Calculate one above and click 'Add to Board'.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {savedEvents.map(event => {
                    const bd = event.mode === 'countdown' ? getBreakdown(now, event.targetDate) : getBreakdown(event.targetDate, now);
                    const isPast = event.mode === 'countdown' && event.targetDate <= now;
                    
                    return (
                      <motion.div 
                        key={event.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-surface-container p-5 rounded-[1px] border border-outline-variant/30 relative group"
                      >
                        <button 
                          onClick={() => removeSavedEvent(event.id)}
                          className="absolute top-4 right-4 text-primary/30 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">
                          {event.mode === 'countdown' ? 'Countdown to' : 'Count up from'}
                        </p>
                        <h4 className="font-headline font-bold text-lg text-primary pr-8 truncate mb-3">{event.name}</h4>
                        
                        {isPast ? (
                          <p className="text-sm font-bold text-secondary">Event has passed!</p>
                        ) : (
                          <div className="flex gap-3 text-sm font-mono font-bold text-primary/80">
                            <div className="flex flex-col"><span className="text-primary text-lg">{bd.totalDays}</span><span className="text-[8px] uppercase tracking-widest opacity-50">Days</span></div>
                            <div className="flex flex-col"><span className="text-primary text-lg">{bd.hours.toString().padStart(2, '0')}</span><span className="text-[8px] uppercase tracking-widest opacity-50">Hrs</span></div>
                            <div className="flex flex-col"><span className="text-primary text-lg">{bd.minutes.toString().padStart(2, '0')}</span><span className="text-[8px] uppercase tracking-widest opacity-50">Min</span></div>
                            <div className="flex flex-col"><span className="text-primary text-lg">{bd.seconds.toString().padStart(2, '0')}</span><span className="text-[8px] uppercase tracking-widest opacity-50">Sec</span></div>
                          </div>
                        )}
                        <p className="text-[10px] text-primary/40 mt-3 truncate">
                          Target: {event.targetDate.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
            {savedEvents.length >= 10 && (
              <p className="text-xs text-orange-500 font-bold mt-4 text-center">Board limit reached (10 max). Remove an event to add more.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
