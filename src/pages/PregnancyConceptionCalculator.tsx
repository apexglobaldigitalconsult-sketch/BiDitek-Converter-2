import React, { useState, useEffect } from 'react';
import { ChevronRight, Info, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';

type CalcMethod = 'dueDate' | 'lmp' | 'gestationalAge' | 'planner';

interface PlannerCycle {
  cycleNum: number;
  startDate: Date;
  ovulationDate: Date;
  dueDate: Date;
  isMatch: boolean;
  diffDays: number;
}

export default function PregnancyConceptionCalculator() {
  const [method, setMethod] = useState<CalcMethod>('dueDate');
  
  // Inputs
  const [dueDateInput, setDueDateInput] = useState('');
  const [cycleLength, setCycleLength] = useState<number | ''>(28);
  
  const [lmpDate, setLmpDate] = useState('');
  
  const [gaWeeks, setGaWeeks] = useState<number | ''>('');
  const [gaDays, setGaDays] = useState<number | ''>('');
  const [todayDate, setTodayDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  
  const [cyclesToShow, setCyclesToShow] = useState<number | ''>(3);
  const [targetDueDate, setTargetDueDate] = useState('');

  // UI States
  const [hasCalculated, setHasCalculated] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Results - Standard
  const [stdResults, setStdResults] = useState<{
    conceptionDate: Date;
    ovulationDate: Date;
    estimatedLMP: Date;
    dueDate: Date;
    methodUsed: string;
    currentGestationalDays: number;
  } | null>(null);

  // Results - Planner
  const [plannerResults, setPlannerResults] = useState<{
    cycles: PlannerCycle[];
    targetDueDate?: Date;
    idealConceptionDate?: Date;
    nearestCycle?: PlannerCycle;
  } | null>(null);

  // Helper to parse date safely avoiding timezone shifts
  const parseDate = (dateStr: string) => new Date(dateStr + 'T12:00:00');
  
  const addDays = (date: Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };

  const diffDays = (d1: Date, d2: Date) => {
    const diffTime = d1.getTime() - d2.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Reset results when method changes
  useEffect(() => {
    setHasCalculated(false);
    setErrors([]);
  }, [method]);

  const validate = () => {
    const errs: string[] = [];
    const cl = Number(cycleLength);

    if (method === 'dueDate') {
      if (!dueDateInput) errs.push("Please enter a known due date.");
      if (!cycleLength || cl < 20 || cl > 45) errs.push("Cycle length must be between 20 and 45 days.");
    } else if (method === 'lmp') {
      if (!lmpDate) errs.push("Please enter the first day of your last menstrual period.");
      if (!cycleLength || cl < 20 || cl > 45) errs.push("Cycle length must be between 20 and 45 days.");
    } else if (method === 'gestationalAge') {
      if (gaWeeks === '' || Number(gaWeeks) < 1 || Number(gaWeeks) > 42) errs.push("Gestational weeks must be between 1 and 42.");
      if (gaDays === '' || Number(gaDays) < 0 || Number(gaDays) > 6) errs.push("Gestational days must be between 0 and 6.");
      if (!todayDate) errs.push("Please enter today's date.");
    } else if (method === 'planner') {
      if (!lmpDate) errs.push("Please enter the first day of your last menstrual period.");
      if (!cycleLength || cl < 20 || cl > 45) errs.push("Cycle length must be between 20 and 45 days.");
      if (!cyclesToShow || Number(cyclesToShow) < 1 || Number(cyclesToShow) > 6) errs.push("Number of cycles to show must be between 1 and 6.");
    }

    setErrors(errs);
    return errs.length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) {
      setHasCalculated(false);
      return;
    }

    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const cl = Number(cycleLength) || 28;
    const ovulationDayOffset = cl - 14;

    if (method === 'planner') {
      const lmp = parseDate(lmpDate);
      const cyclesCount = Number(cyclesToShow);
      const target = targetDueDate ? parseDate(targetDueDate) : undefined;
      
      const cycles: PlannerCycle[] = [];
      let nearestCycle: PlannerCycle | undefined = undefined;
      let minDiff = Infinity;

      for (let i = 0; i < cyclesCount; i++) {
        const startDate = addDays(lmp, i * cl);
        const ovulationDate = addDays(startDate, ovulationDayOffset);
        const dueDate = addDays(ovulationDate, 266);
        
        let isMatch = false;
        let diff = 0;
        
        if (target) {
          diff = diffDays(dueDate, target);
          if (Math.abs(diff) <= 7) {
            isMatch = true;
          }
          if (Math.abs(diff) < minDiff) {
            minDiff = Math.abs(diff);
            nearestCycle = { cycleNum: i + 1, startDate, ovulationDate, dueDate, isMatch, diffDays: diff };
          }
        }

        cycles.push({
          cycleNum: i + 1,
          startDate,
          ovulationDate,
          dueDate,
          isMatch,
          diffDays: diff
        });
      }

      setPlannerResults({
        cycles,
        targetDueDate: target,
        idealConceptionDate: target ? addDays(target, -266) : undefined,
        nearestCycle
      });
      setStdResults(null);

    } else {
      let conceptionDate: Date;
      let ovulationDate: Date;
      let estimatedLMP: Date;
      let dueDate: Date;
      let methodUsed = '';

      if (method === 'dueDate') {
        dueDate = parseDate(dueDateInput);
        estimatedLMP = addDays(dueDate, -280);
        ovulationDate = addDays(estimatedLMP, ovulationDayOffset);
        conceptionDate = addDays(dueDate, -266); // Standard conception is due date - 266
        methodUsed = 'From Due Date';
      } else if (method === 'lmp') {
        estimatedLMP = parseDate(lmpDate);
        ovulationDate = addDays(estimatedLMP, ovulationDayOffset);
        conceptionDate = ovulationDate;
        dueDate = addDays(ovulationDate, 266);
        methodUsed = 'From Last Menstrual Period (LMP)';
      } else {
        // gestationalAge
        const refDate = parseDate(todayDate);
        const totalDays = (Number(gaWeeks) * 7) + Number(gaDays);
        estimatedLMP = addDays(refDate, -totalDays);
        ovulationDate = addDays(estimatedLMP, 14); // Assume 28-day cycle for GA method as no cycle length input
        conceptionDate = ovulationDate;
        dueDate = addDays(estimatedLMP, 280);
        methodUsed = 'From Gestational Age';
      }

      const currentGestationalDays = diffDays(today, estimatedLMP);

      setStdResults({
        conceptionDate,
        ovulationDate,
        estimatedLMP,
        dueDate,
        methodUsed,
        currentGestationalDays
      });
      setPlannerResults(null);
    }

    setHasCalculated(true);
  };

  const renderFertileStrip = (ovulationDate: Date) => {
    const days = [
      { offset: -5, label: 'Ovulation - 5', fertility: 'Low-Moderate', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      { offset: -4, label: 'Ovulation - 4', fertility: 'Moderate', color: 'bg-orange-100 text-orange-800 border-orange-200' },
      { offset: -3, label: 'Ovulation - 3', fertility: 'Moderate-High', color: 'bg-orange-200 text-orange-900 border-orange-300' },
      { offset: -2, label: 'Ovulation - 2', fertility: 'High', color: 'bg-red-100 text-red-800 border-red-200' },
      { offset: -1, label: 'Ovulation - 1', fertility: 'Peak', color: 'bg-red-200 text-red-900 border-red-300' },
      { offset: 0, label: 'Ovulation', fertility: 'Peak (Ovulation Day)', color: 'bg-red-500 text-white border-red-600 shadow-md transform scale-105 z-10' },
      { offset: 1, label: 'Ovulation + 1', fertility: 'Low', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    ];

    return (
      <div className="flex flex-col md:flex-row gap-2 md:gap-1 w-full overflow-x-auto pb-4">
        {days.map((d) => {
          const date = addDays(ovulationDate, d.offset);
          return (
            <div key={d.offset} className={cn("flex-1 flex flex-col items-center justify-center p-3 rounded-[1px] border text-center min-w-[100px] transition-all", d.color)}>
              <span className="text-[10px] font-black uppercase tracking-wider opacity-80 mb-1">{d.label}</span>
              <span className="font-headline font-bold text-lg mb-1">{formatShortDate(date)}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{d.fertility}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="px-6 lg:px-16 py-12 lg:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-3 text-[10px] font-label font-black uppercase tracking-[0.2em] text-primary/30 mb-12">
        <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/calculators" className="hover:text-secondary transition-colors">Calculators</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-secondary font-black">Pregnancy Conception</span>
      </nav>

      <div className="mb-12">
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter text-primary leading-[1.1]">Conception Calculator</h1>
        <p className="text-primary/50 mt-6 max-w-2xl font-body text-lg leading-relaxed">
          Determine your conception date, track your fertile window, or plan ahead for a target due date.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-12 bg-surface-container-low p-2 rounded-[1px] border border-outline-variant/30 inline-flex">
        {[
          { id: 'dueDate', label: 'From Due Date' },
          { id: 'lmp', label: 'From LMP' },
          { id: 'gestationalAge', label: 'From Gestational Age' },
          { id: 'planner', label: 'Conception Planner' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setMethod(t.id as CalcMethod)}
            className={cn(
              "px-6 py-3 rounded-[1px] font-headline font-bold text-sm transition-all",
              method === t.id ? "bg-secondary text-white shadow-md" : "text-primary/60 hover:text-primary hover:bg-surface-container"
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

          {/* From Due Date Inputs */}
          {method === 'dueDate' && (
            <>
              <div className="space-y-4">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Known Due Date</label>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30 relative">
                  <input 
                    type="date" 
                    value={dueDateInput}
                    onChange={(e) => setDueDateInput(e.target.value)}
                    className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end pl-2">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Average Cycle Length</label>
                </div>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                  <input 
                    type="number" 
                    value={cycleLength}
                    onChange={(e) => setCycleLength(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                  />
                  <span className="text-primary/30 font-label font-bold text-xs">DAYS</span>
                </div>
              </div>
            </>
          )}

          {/* From LMP Inputs */}
          {method === 'lmp' && (
            <>
              <div className="space-y-4">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">First Day of Last Period (LMP)</label>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30 relative">
                  <input 
                    type="date" 
                    value={lmpDate}
                    onChange={(e) => setLmpDate(e.target.value)}
                    className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end pl-2">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Average Cycle Length</label>
                </div>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                  <input 
                    type="number" 
                    value={cycleLength}
                    onChange={(e) => setCycleLength(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                  />
                  <span className="text-primary/30 font-label font-bold text-xs">DAYS</span>
                </div>
              </div>
            </>
          )}

          {/* From Gestational Age Inputs */}
          {method === 'gestationalAge' && (
            <>
              <div className="space-y-4">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Current Gestational Age</label>
                <div className="flex gap-4">
                  <div className="bg-surface-container rounded-[1px] flex items-center px-4 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30 flex-1">
                    <input 
                      type="number" 
                      value={gaWeeks}
                      onChange={(e) => setGaWeeks(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary text-center"
                      placeholder="0"
                    />
                    <span className="text-primary/30 font-label font-bold text-xs">WEEKS</span>
                  </div>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-4 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30 flex-1">
                    <input 
                      type="number" 
                      value={gaDays}
                      onChange={(e) => setGaDays(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary text-center"
                      placeholder="0"
                    />
                    <span className="text-primary/30 font-label font-bold text-xs">DAYS</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Today's Date</label>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30 relative">
                  <input 
                    type="date" 
                    value={todayDate}
                    onChange={(e) => setTodayDate(e.target.value)}
                    className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                  />
                </div>
              </div>
            </>
          )}

          {/* Conception Planner Inputs */}
          {method === 'planner' && (
            <>
              <div className="space-y-4">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">First Day of Last Period (LMP)</label>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30 relative">
                  <input 
                    type="date" 
                    value={lmpDate}
                    onChange={(e) => setLmpDate(e.target.value)}
                    className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end pl-2">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Average Cycle Length</label>
                </div>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                  <input 
                    type="number" 
                    value={cycleLength}
                    onChange={(e) => setCycleLength(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                  />
                  <span className="text-primary/30 font-label font-bold text-xs">DAYS</span>
                </div>
              </div>
              <div className="space-y-4">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Number of Upcoming Cycles to Show</label>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                  <input 
                    type="number" 
                    value={cyclesToShow}
                    onChange={(e) => setCyclesToShow(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                  />
                  <span className="text-primary/30 font-label font-bold text-xs">CYCLES</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end pl-2">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Target Due Date</label>
                  <span className="text-[10px] text-primary/30 italic">Optional</span>
                </div>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30 relative">
                  <input 
                    type="date" 
                    value={targetDueDate}
                    onChange={(e) => setTargetDueDate(e.target.value)}
                    className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                  />
                </div>
                <p className="text-xs text-primary/40 pl-2">Fill this in to see which conception window would result in your desired due date.</p>
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
            {hasCalculated && (stdResults || plannerResults) ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Standard Results (Tabs 1-3) */}
                {stdResults && (
                  <>
                    {/* Section 1: Conception Date Result */}
                    <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary/40 via-secondary to-secondary/40"></div>
                      <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 mb-4">Estimated Conception Date</p>
                      <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tighter mb-8">
                        {formatDate(stdResults.conceptionDate)}
                      </h2>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left mb-6">
                        <div className="bg-surface-container p-4 rounded-[1px]">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Earliest</p>
                          <p className="font-headline font-bold text-sm text-primary">
                            {formatDate(addDays(stdResults.ovulationDate, -5))}
                          </p>
                        </div>
                        <div className="bg-secondary/10 p-4 rounded-[1px] border border-secondary/20">
                          <p className="text-[10px] font-black uppercase tracking-widest text-secondary/60 mb-1">Peak (Ovulation)</p>
                          <p className="font-headline font-bold text-sm text-secondary">
                            {formatDate(stdResults.ovulationDate)}
                          </p>
                        </div>
                        <div className="bg-surface-container p-4 rounded-[1px]">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Latest</p>
                          <p className="font-headline font-bold text-sm text-primary">
                            {formatDate(addDays(stdResults.ovulationDate, 1))}
                          </p>
                        </div>
                        <div className="bg-surface-container p-4 rounded-[1px]">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Estimated LMP</p>
                          <p className="font-headline font-bold text-sm text-primary">
                            {formatDate(stdResults.estimatedLMP)}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-primary/50 italic">
                        * Conception most likely occurred within this 6-day window. The peak date represents estimated ovulation. Method Used: {stdResults.methodUsed}.
                      </p>
                    </div>

                    {/* Section 2: Fertile Window & Ovulation Details */}
                    <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm">
                      <h3 className="font-headline text-xl font-bold mb-6 text-primary">Fertile Window & Ovulation Details</h3>
                      
                      {renderFertileStrip(stdResults.ovulationDate)}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-surface-container p-6 rounded-[1px]">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2">Ovulation Date</p>
                          <p className="font-headline font-bold text-lg text-primary">
                            {formatDate(stdResults.ovulationDate)}
                          </p>
                        </div>
                        <div className="bg-surface-container p-6 rounded-[1px]">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2">Fertile Window</p>
                          <p className="font-headline font-bold text-lg text-primary">
                            {formatShortDate(addDays(stdResults.ovulationDate, -5))} – {formatShortDate(addDays(stdResults.ovulationDate, 1))}
                          </p>
                        </div>
                        <div className="bg-surface-container p-6 rounded-[1px]">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2">Days Until Next Ovulation</p>
                          <p className="font-headline font-bold text-lg text-primary">
                            {(() => {
                              const today = new Date();
                              today.setHours(12, 0, 0, 0);
                              const diff = diffDays(stdResults.ovulationDate, today);
                              return diff > 0 ? `${diff} days` : 'Passed';
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Due Date Derived from Conception */}
                    <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm">
                      <h3 className="font-headline text-xl font-bold mb-6 text-primary">Due Date Milestones</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        <div className="flex justify-between py-3 border-b-2 border-secondary/30 bg-secondary/5 -mx-2 px-2 rounded-[1px] md:col-span-2 mb-2">
                          <span className="text-base font-bold text-secondary">Estimated Due Date</span>
                          <span className="text-base font-bold text-secondary">{formatDate(stdResults.dueDate)}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-outline-variant/20">
                          <span className="text-sm font-bold text-primary/60">End of 1st Trimester (Week 13)</span>
                          <span className="text-sm font-bold text-primary">{formatDate(addDays(stdResults.estimatedLMP, 13 * 7))}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-outline-variant/20">
                          <span className="text-sm font-bold text-primary/60">End of 2nd Trimester (Week 27)</span>
                          <span className="text-sm font-bold text-primary">{formatDate(addDays(stdResults.estimatedLMP, 27 * 7))}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-outline-variant/20">
                          <span className="text-sm font-bold text-primary/60">Full Term Date (Week 37)</span>
                          <span className="text-sm font-bold text-primary">{formatDate(addDays(stdResults.estimatedLMP, 37 * 7))}</span>
                        </div>
                        {stdResults.currentGestationalDays >= 0 && (
                          <div className="flex justify-between py-3 border-b border-outline-variant/20">
                            <span className="text-sm font-bold text-primary/60">Current Gestational Age</span>
                            <span className="text-sm font-bold text-primary">
                              {Math.floor(stdResults.currentGestationalDays / 7)}w {stdResults.currentGestationalDays % 7}d
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Planner Results (Tab 4) */}
                {plannerResults && (
                  <>
                    {/* Section 5: Best Days to Conceive (if target entered) */}
                    {plannerResults.targetDueDate && (
                      <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm">
                        <h3 className="font-headline text-xl font-bold mb-6 text-primary">Best Days to Conceive for Target Due Date</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="bg-surface-container p-6 rounded-[1px]">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2">Target Due Date</p>
                            <p className="font-headline font-bold text-xl text-primary">
                              {formatDate(plannerResults.targetDueDate)}
                            </p>
                          </div>
                          <div className="bg-secondary/10 p-6 rounded-[1px] border border-secondary/20">
                            <p className="text-[10px] font-black uppercase tracking-widest text-secondary/60 mb-2">Ideal Conception Window</p>
                            <p className="font-headline font-bold text-xl text-secondary">
                              {formatShortDate(addDays(plannerResults.idealConceptionDate!, -5))} – {formatShortDate(addDays(plannerResults.idealConceptionDate!, 1))}
                            </p>
                            <p className="text-sm text-secondary/80 mt-1">Peak: {formatDate(plannerResults.idealConceptionDate!)}</p>
                          </div>
                        </div>

                        {plannerResults.nearestCycle ? (
                          <div className="bg-surface-container p-6 rounded-[1px] border-l-4 border-secondary">
                            <h4 className="font-headline font-bold text-lg text-primary mb-2">Nearest Cycle Match: Cycle {plannerResults.nearestCycle.cycleNum}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Ovulation</p>
                                <p className="font-bold text-primary">{formatDate(plannerResults.nearestCycle.ovulationDate)}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Resulting Due Date</p>
                                <p className="font-bold text-primary">{formatDate(plannerResults.nearestCycle.dueDate)}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Days Off Target</p>
                                <p className="font-bold text-primary">
                                  {plannerResults.nearestCycle.diffDays > 0 ? '+' : ''}{plannerResults.nearestCycle.diffDays} days
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-surface-container p-6 rounded-[1px] text-center border border-dashed border-outline-variant/50">
                            <p className="text-primary/60 font-medium">None of the upcoming cycles result in your target due date. Try adjusting your target or extending the number of cycles.</p>
                          </div>
                        )}
                        <p className="text-xs text-primary/50 italic mt-6">
                          * To achieve your target due date, aim to conceive during the ideal conception window shown above. Conception is not an exact science — the resulting due date may vary by days or weeks.
                        </p>
                      </div>
                    )}

                    {/* Section 4: Cycle-Based Conception Planning Calendar */}
                    <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm">
                      <h3 className="font-headline text-xl font-bold mb-6 text-primary">Cycle-Based Conception Planning Calendar</h3>
                      <div className="space-y-4">
                        {plannerResults.cycles.map((cycle) => (
                          <div 
                            key={cycle.cycleNum} 
                            className={cn(
                              "p-6 rounded-[1px] border transition-all",
                              cycle.isMatch 
                                ? "bg-secondary/5 border-secondary shadow-sm" 
                                : "bg-surface-container border-outline-variant/30"
                            )}
                          >
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-headline font-bold text-lg text-primary">Cycle {cycle.cycleNum}</h4>
                              {cycle.isMatch && (
                                <span className="bg-secondary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                  ✓ Matches Target
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Cycle Start</p>
                                <p className="font-bold text-sm text-primary">{formatDate(cycle.startDate)}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Ovulation Date</p>
                                <p className="font-bold text-sm text-primary">{formatDate(cycle.ovulationDate)}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Fertile Window</p>
                                <p className="font-bold text-sm text-primary">
                                  {formatShortDate(addDays(cycle.ovulationDate, -5))} – {formatShortDate(addDays(cycle.ovulationDate, 1))}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Resulting Due Date</p>
                                <p className={cn("font-bold text-sm", cycle.isMatch ? "text-secondary" : "text-primary")}>
                                  {formatDate(cycle.dueDate)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="bg-surface-container p-6 rounded-[1px] border border-outline-variant/30 mt-8">
                  <p className="text-xs text-primary/50 text-center leading-relaxed font-medium">
                    <strong className="text-primary/70">Medical Disclaimer:</strong> This calculator provides estimates only. Conception dates, fertile windows, and due dates are approximations based on average cycle data. Individual fertility varies. Always consult a qualified healthcare provider for personal medical guidance.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-surface-container-low rounded-[1px] p-16 border border-outline-variant/30 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[400px]"
              >
                <CalendarIcon className="w-12 h-12 text-primary/20 mb-4" />
                <p className="font-headline font-bold text-xl text-primary/40">Ready to Calculate</p>
                <p className="text-sm text-primary/30 mt-2">Fill out the fields and click calculate to see your conception estimates and planning calendar.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
