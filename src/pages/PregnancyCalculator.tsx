import React, { useState, useEffect } from 'react';
import { ChevronRight, Info, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';

type CalcMethod = 'lmp' | 'conception' | 'ivf' | 'ultrasound';

interface FetalDevelopment {
  week: number;
  size: string;
  development: string;
  isKey: boolean;
}

const FETAL_DEVELOPMENT: FetalDevelopment[] = [
  { week: 4, size: 'Poppy seed (1 mm)', development: 'Implantation complete', isKey: true },
  { week: 5, size: 'Sesame seed (2 mm)', development: 'Heart begins beating', isKey: false },
  { week: 6, size: 'Lentil (4 mm)', development: 'Brain and spinal cord forming', isKey: true },
  { week: 7, size: 'Blueberry (8 mm)', development: 'Hands and feet forming', isKey: false },
  { week: 8, size: 'Kidney bean (1.5 cm)', development: 'All essential organs present', isKey: true },
  { week: 9, size: 'Grape (2.3 cm)', development: 'Muscles developing', isKey: false },
  { week: 10, size: 'Strawberry (3 cm)', development: 'Embryo now a fetus', isKey: true },
  { week: 11, size: 'Lime (4 cm)', development: 'Fingers and toes defined', isKey: false },
  { week: 12, size: 'Plum (5.4 cm)', development: 'Reflexes developing', isKey: true },
  { week: 13, size: 'Peach (7 cm)', development: 'End of 1st trimester', isKey: true },
  { week: 14, size: 'Lemon (8.7 cm)', development: 'Facial expressions possible', isKey: false },
  { week: 15, size: 'Apple (10.1 cm)', development: 'Can sense light', isKey: false },
  { week: 16, size: 'Avocado (11.6 cm)', development: 'Skeletal system hardening', isKey: true },
  { week: 17, size: 'Turnip (13 cm)', development: 'Fat begins to accumulate', isKey: false },
  { week: 18, size: 'Bell pepper (14 cm)', development: 'Ears functioning', isKey: true },
  { week: 19, size: 'Heirloom tomato (15.3 cm)', development: 'Vernix coating forms', isKey: false },
  { week: 20, size: 'Banana (16.5 cm)', development: 'Halfway point', isKey: true },
  { week: 21, size: 'Carrot (26.7 cm)', development: 'Swallowing amniotic fluid', isKey: false },
  { week: 22, size: 'Papaya (19 cm)', development: 'Eyebrows and eyelids visible', isKey: true },
  { week: 23, size: 'Grapefruit (28.9 cm)', development: 'Lungs producing surfactant', isKey: false },
  { week: 24, size: 'Corn (21 cm)', development: 'Lung development accelerates', isKey: true },
  { week: 25, size: 'Rutabaga (34.6 cm)', development: 'Capillaries forming', isKey: false },
  { week: 26, size: 'Scallion (35.6 cm)', development: 'Eyes begin to open', isKey: false },
  { week: 27, size: 'Cauliflower (36.6 cm)', development: 'End of 2nd trimester', isKey: false },
  { week: 28, size: 'Eggplant (25 cm)', development: 'Eyes open for first time', isKey: true },
  { week: 29, size: 'Butternut squash (38.6 cm)', development: 'Bones fully developed', isKey: false },
  { week: 30, size: 'Cabbage (39.9 cm)', development: 'Brain surface wrinkling', isKey: false },
  { week: 31, size: 'Coconut (41.1 cm)', development: 'Rapid weight gain', isKey: false },
  { week: 32, size: 'Squash (28 cm)', development: 'Practices breathing', isKey: true },
  { week: 33, size: 'Pineapple (43.7 cm)', development: 'Immune system developing', isKey: false },
  { week: 34, size: 'Cantaloupe (45 cm)', development: 'Testicles descend (if male)', isKey: false },
  { week: 35, size: 'Honeydew (46.2 cm)', development: 'Kidneys fully developed', isKey: false },
  { week: 36, size: 'Romaine lettuce (33 cm)', development: 'Early term', isKey: true },
  { week: 37, size: 'Swiss chard (35 cm)', development: 'Full term', isKey: true },
  { week: 38, size: 'Leek (49.8 cm)', development: 'Shedding lanugo', isKey: false },
  { week: 39, size: 'Mini watermelon (50.7 cm)', development: 'Physical development complete', isKey: false },
  { week: 40, size: 'Watermelon (51 cm)', development: 'Due date', isKey: true }
];

export default function PregnancyCalculator() {
  const [method, setMethod] = useState<CalcMethod>('lmp');
  
  // Inputs
  const [lmpDate, setLmpDate] = useState('');
  const [cycleLength, setCycleLength] = useState<number | ''>(28);
  
  const [conceptionDate, setConceptionDate] = useState('');
  
  const [ivfDate, setIvfDate] = useState('');
  const [ivfAge, setIvfAge] = useState<'3' | '5'>('5');
  
  const [usScanDate, setUsScanDate] = useState('');
  const [usDueDate, setUsDueDate] = useState('');

  // UI States
  const [hasCalculated, setHasCalculated] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showAllWeeks, setShowAllWeeks] = useState(false);

  // Results
  const [results, setResults] = useState<{
    dueDate: Date;
    estimatedLMP: Date;
    conceptionDate: Date;
    gestationalDays: number;
    daysRemaining: number;
    trimester: number;
    methodUsed: string;
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

  // Reset results when method changes
  useEffect(() => {
    setHasCalculated(false);
    setErrors([]);
  }, [method]);

  const validate = () => {
    const errs: string[] = [];
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    if (method === 'lmp') {
      if (!lmpDate) errs.push("Please enter the first day of your last menstrual period.");
      if (lmpDate && parseDate(lmpDate) > today) errs.push("LMP date cannot be in the future.");
      if (!cycleLength || cycleLength < 20 || cycleLength > 45) errs.push("Cycle length must be between 20 and 45 days.");
    } else if (method === 'conception') {
      if (!conceptionDate) errs.push("Please enter the conception date.");
      if (conceptionDate && parseDate(conceptionDate) > today) errs.push("Conception date cannot be in the future.");
    } else if (method === 'ivf') {
      if (!ivfDate) errs.push("Please enter the embryo transfer date.");
      if (ivfDate && parseDate(ivfDate) > today) errs.push("Transfer date cannot be in the future.");
    } else if (method === 'ultrasound') {
      if (!usScanDate) errs.push("Please enter the ultrasound scan date.");
      if (!usDueDate) errs.push("Please enter the due date provided by ultrasound.");
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

    let dueDate: Date = new Date();
    let estimatedLMP: Date = new Date();
    let conceptionDateEst: Date = new Date();
    let methodUsedStr = '';

    if (method === 'lmp') {
      const lmp = parseDate(lmpDate);
      const cycle = Number(cycleLength);
      const adjustedOvulationDay = 14 + (cycle - 28);
      
      conceptionDateEst = addDays(lmp, adjustedOvulationDay);
      dueDate = addDays(conceptionDateEst, 266);
      estimatedLMP = lmp;
      methodUsedStr = 'Last Menstrual Period (LMP)';
    } 
    else if (method === 'conception') {
      conceptionDateEst = parseDate(conceptionDate);
      dueDate = addDays(conceptionDateEst, 266);
      estimatedLMP = addDays(conceptionDateEst, -14);
      methodUsedStr = 'Conception Date';
    }
    else if (method === 'ivf') {
      const transfer = parseDate(ivfDate);
      const daysToAdd = ivfAge === '5' ? 261 : 263;
      dueDate = addDays(transfer, daysToAdd);
      conceptionDateEst = addDays(transfer, ivfAge === '5' ? -5 : -3);
      estimatedLMP = addDays(dueDate, -280);
      methodUsedStr = `IVF Transfer (Day ${ivfAge})`;
    }
    else if (method === 'ultrasound') {
      dueDate = parseDate(usDueDate);
      estimatedLMP = addDays(dueDate, -280);
      conceptionDateEst = addDays(dueDate, -266);
      methodUsedStr = 'Ultrasound Scan';
    }

    const gestationalDays = diffDays(today, estimatedLMP);
    const remaining = diffDays(dueDate, today);
    
    let trimester = 1;
    const weeks = Math.floor(gestationalDays / 7);
    if (weeks >= 14 && weeks <= 27) trimester = 2;
    if (weeks >= 28) trimester = 3;

    setResults({
      dueDate,
      estimatedLMP,
      conceptionDate: conceptionDateEst,
      gestationalDays,
      daysRemaining: remaining,
      trimester,
      methodUsed: methodUsedStr
    });
    setHasCalculated(true);
  };

  const renderMilestone = (week: number, milestone: string, currentWeek: number) => {
    if (!results) return null;
    const milestoneDate = addDays(results.estimatedLMP, week * 7);
    const isCurrent = currentWeek === week;
    
    return (
      <div className={cn(
        "flex items-start gap-4 py-3 border-b border-outline-variant/20 last:border-0",
        isCurrent ? "bg-secondary/5 -mx-4 px-4 rounded-[1px]" : ""
      )}>
        <div className="w-16 flex-shrink-0">
          <span className={cn("text-xs font-bold", isCurrent ? "text-secondary" : "text-primary/60")}>Week {week}</span>
        </div>
        <div className="flex-1">
          <p className={cn("text-sm font-medium", isCurrent ? "text-primary font-bold" : "text-primary/80")}>{milestone}</p>
        </div>
        <div className="w-24 flex-shrink-0 text-right">
          <span className="text-xs text-primary/40">{milestoneDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
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
        <span className="text-secondary font-black">Pregnancy Calculator</span>
      </nav>

      <div className="mb-12">
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter text-primary leading-[1.1]">Pregnancy Calculator</h1>
        <p className="text-primary/50 mt-6 max-w-2xl font-body text-lg leading-relaxed">
          Calculate your due date, track your current trimester, and follow your baby's weekly development milestones.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-12 bg-surface-container-low p-2 rounded-[1px] border border-outline-variant/30 inline-flex">
        {[
          { id: 'lmp', label: 'LMP' },
          { id: 'conception', label: 'Conception Date' },
          { id: 'ivf', label: 'IVF Transfer' },
          { id: 'ultrasound', label: 'Ultrasound' }
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

          {/* LMP Inputs */}
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
                  <span className="text-[10px] text-primary/30 italic">Most cycles are 28 days. Adjust if yours differs.</span>
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

          {/* Conception Inputs */}
          {method === 'conception' && (
            <div className="space-y-4">
              <div className="flex justify-between items-end pl-2">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Conception Date</label>
                <span className="text-[10px] text-primary/30 italic">If unsure, use the LMP method instead.</span>
              </div>
              <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                <input 
                  type="date" 
                  value={conceptionDate}
                  onChange={(e) => setConceptionDate(e.target.value)}
                  className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                />
              </div>
            </div>
          )}

          {/* IVF Inputs */}
          {method === 'ivf' && (
            <>
              <div className="space-y-4">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Embryo Transfer Date</label>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                  <input 
                    type="date" 
                    value={ivfDate}
                    onChange={(e) => setIvfDate(e.target.value)}
                    className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Embryo Age at Transfer</label>
                <div className="flex gap-2">
                  {(['3', '5'] as const).map((age) => (
                    <button
                      key={age}
                      onClick={() => setIvfAge(age)}
                      className={cn(
                        "flex-1 py-4 rounded-[1px] font-headline font-bold text-sm transition-all",
                        ivfAge === age ? "bg-secondary text-white shadow-md" : "bg-surface-container text-primary/40 hover:text-primary"
                      )}
                    >
                      Day {age} Transfer {age === '5' && '(Blastocyst)'}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Ultrasound Inputs */}
          {method === 'ultrasound' && (
            <>
              <div className="space-y-4">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Ultrasound Scan Date</label>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                  <input 
                    type="date" 
                    value={usScanDate}
                    onChange={(e) => setUsScanDate(e.target.value)}
                    className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end pl-2">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Due Date from Ultrasound</label>
                  <span className="text-[10px] text-primary/30 italic">Enter exactly as provided.</span>
                </div>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                  <input 
                    type="date" 
                    value={usDueDate}
                    onChange={(e) => setUsDueDate(e.target.value)}
                    className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                  />
                </div>
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
            {hasCalculated && results ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Section 1: Due Date & Current Status */}
                <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary/40 via-secondary to-secondary/40"></div>
                  <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 mb-4">Estimated Due Date</p>
                  <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tighter mb-8">
                    {formatDate(results.dueDate)}
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                    <div className="bg-surface-container p-4 rounded-[1px]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Gestational Age</p>
                      <p className="font-headline font-bold text-lg text-primary">
                        {Math.floor(results.gestationalDays / 7)}w {results.gestationalDays % 7}d
                      </p>
                    </div>
                    <div className="bg-surface-container p-4 rounded-[1px]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Trimester</p>
                      <p className="font-headline font-bold text-lg text-secondary">
                        {results.trimester}{results.trimester === 1 ? 'st' : results.trimester === 2 ? 'nd' : 'rd'} Trimester
                      </p>
                    </div>
                    <div className="bg-surface-container p-4 rounded-[1px]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Estimated Conception</p>
                      <p className="font-headline font-bold text-sm text-primary mt-1">
                        {results.conceptionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="bg-surface-container p-4 rounded-[1px]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Method Used</p>
                      <p className="font-headline font-bold text-sm text-primary mt-1">
                        {results.methodUsed}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Countdown to Due Date */}
                <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm">
                  <h3 className="font-headline text-xl font-bold mb-6 text-primary">Countdown to Due Date</h3>
                  <div className="text-center mb-8">
                    <p className="font-headline text-6xl font-extrabold text-primary mb-2">
                      {Math.max(0, results.daysRemaining)}
                    </p>
                    <p className="text-sm font-bold text-primary/40 uppercase tracking-widest">
                      {results.daysRemaining < 0 ? 'Days Past Due' : 'Days Remaining'}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative pt-6 pb-8">
                    <div className="h-3 w-full bg-surface-container rounded-full relative overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, Math.max(0, (results.gestationalDays / 280) * 100))}%` }}
                        className="absolute top-0 left-0 bottom-0 bg-secondary rounded-full"
                      />
                    </div>
                    
                    {/* Trimester Markers */}
                    <div className="absolute top-6 bottom-8 left-[32.5%] w-px bg-primary/20 border-l border-dashed border-primary/30"></div>
                    <div className="absolute top-6 bottom-8 left-[67.5%] w-px bg-primary/20 border-l border-dashed border-primary/30"></div>
                    
                    {/* Current Marker Pin */}
                    <motion.div 
                      initial={{ left: 0 }}
                      animate={{ left: `${Math.min(100, Math.max(0, (results.gestationalDays / 280) * 100))}%` }}
                      className="absolute top-[22px] w-4 h-4 bg-white rounded-full shadow-md -ml-2 border-2 border-secondary"
                    />

                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary/40 mt-4 relative">
                      <span className="w-1/3 text-left">1st Tri</span>
                      <span className="w-1/3 text-center">2nd Tri</span>
                      <span className="w-1/3 text-right">3rd Tri</span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Trimester Breakdown & Key Milestones */}
                <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm">
                  <h3 className="font-headline text-xl font-bold mb-6 text-primary">Trimester Breakdown & Milestones</h3>
                  
                  <div className="space-y-8">
                    {/* 1st Trimester */}
                    <div>
                      <h4 className="font-headline font-bold text-lg text-primary mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-secondary"></div>
                        1st Trimester (Weeks 1–13)
                      </h4>
                      <div className="bg-surface-container p-4 rounded-[1px]">
                        {renderMilestone(4, "Missed period — pregnancy detectable", Math.floor(results.gestationalDays / 7))}
                        {renderMilestone(6, "Heartbeat detectable by ultrasound", Math.floor(results.gestationalDays / 7))}
                        {renderMilestone(8, "All major organs forming", Math.floor(results.gestationalDays / 7))}
                        {renderMilestone(10, "Embryo becomes a fetus", Math.floor(results.gestationalDays / 7))}
                        {renderMilestone(12, "End of highest miscarriage risk period", Math.floor(results.gestationalDays / 7))}
                        {renderMilestone(13, "End of 1st trimester", Math.floor(results.gestationalDays / 7))}
                      </div>
                    </div>

                    {/* 2nd Trimester */}
                    <div>
                      <h4 className="font-headline font-bold text-lg text-primary mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        2nd Trimester (Weeks 14–27)
                      </h4>
                      <div className="bg-surface-container p-4 rounded-[1px]">
                        {renderMilestone(14, "Energy typically returns", Math.floor(results.gestationalDays / 7))}
                        {renderMilestone(16, "Gender may be visible on ultrasound", Math.floor(results.gestationalDays / 7))}
                        {renderMilestone(18, "Anatomy scan (anomaly scan) window begins", Math.floor(results.gestationalDays / 7))}
                        {renderMilestone(20, "Halfway point", Math.floor(results.gestationalDays / 7))}
                        {renderMilestone(22, "Baby reaches viability threshold", Math.floor(results.gestationalDays / 7))}
                        {renderMilestone(27, "End of 2nd trimester", Math.floor(results.gestationalDays / 7))}
                      </div>
                    </div>

                    {/* 3rd Trimester */}
                    <div>
                      <h4 className="font-headline font-bold text-lg text-primary mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        3rd Trimester (Weeks 28–40)
                      </h4>
                      <div className="bg-surface-container p-4 rounded-[1px]">
                        {renderMilestone(28, "Baby opens eyes", Math.floor(results.gestationalDays / 7))}
                        {renderMilestone(32, "Baby practices breathing movements", Math.floor(results.gestationalDays / 7))}
                        {renderMilestone(36, "Baby considered early term", Math.floor(results.gestationalDays / 7))}
                        {renderMilestone(37, "Baby considered full term", Math.floor(results.gestationalDays / 7))}
                        {renderMilestone(40, "Estimated due date", Math.floor(results.gestationalDays / 7))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Weekly Fetal Development Timeline */}
                <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-headline text-xl font-bold text-primary">Weekly Fetal Development</h3>
                    <button 
                      onClick={() => setShowAllWeeks(!showAllWeeks)}
                      className="flex items-center gap-2 text-xs font-bold text-secondary hover:text-secondary/80 transition-colors"
                    >
                      {showAllWeeks ? 'Show Key Weeks Only' : 'Show All Weeks'}
                      {showAllWeeks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <div className="overflow-hidden rounded-[1px] border border-outline-variant/30 max-h-[500px] overflow-y-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-surface-container font-label text-[10px] font-black uppercase tracking-widest text-primary/40 sticky top-0 z-10 shadow-sm">
                        <tr>
                          <th className="p-4">Week</th>
                          <th className="p-4">Fetal Size (approx.)</th>
                          <th className="p-4">Key Development</th>
                        </tr>
                      </thead>
                      <tbody>
                        {FETAL_DEVELOPMENT.filter(f => showAllWeeks || f.isKey).map((f) => {
                          const isCurrent = Math.floor(results.gestationalDays / 7) === f.week;
                          return (
                            <tr 
                              key={f.week} 
                              className={cn(
                                "border-t border-outline-variant/20 transition-colors",
                                isCurrent ? "bg-secondary/10 font-bold" : "bg-transparent hover:bg-surface-container/50"
                              )}
                            >
                              <td className="p-4 text-primary">Week {f.week}</td>
                              <td className="p-4 text-primary/70">{f.size}</td>
                              <td className="p-4 text-primary">{f.development}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 5: Conception & Fertility Window */}
                <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm">
                  <h3 className="font-headline text-xl font-bold mb-6 text-primary">Conception & Fertility Window</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-surface-container p-6 rounded-[1px]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2">Fertility Window Start</p>
                      <p className="font-headline font-bold text-lg text-primary">
                        {formatDate(addDays(results.conceptionDate, -5))}
                      </p>
                    </div>
                    <div className="bg-surface-container p-6 rounded-[1px]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2">Estimated Ovulation</p>
                      <p className="font-headline font-bold text-lg text-primary">
                        {formatDate(results.conceptionDate)}
                      </p>
                    </div>
                    <div className="bg-surface-container p-6 rounded-[1px]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2">Fertility Window End</p>
                      <p className="font-headline font-bold text-lg text-primary">
                        {formatDate(addDays(results.conceptionDate, 1))}
                      </p>
                    </div>
                    <div className="bg-secondary/10 p-6 rounded-[1px] border border-secondary/20">
                      <p className="text-[10px] font-black uppercase tracking-widest text-secondary/60 mb-2">Estimated Conception</p>
                      <p className="font-headline font-bold text-lg text-secondary">
                        {formatDate(results.conceptionDate)}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-primary/40 italic">
                    * The fertility window is the approximate period during which conception is most likely. Individual cycles vary.
                  </p>
                </div>

                {/* Section 6: Important Dates Summary */}
                <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm">
                  <h3 className="font-headline text-xl font-bold mb-6 text-primary">Important Dates Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    <div className="flex justify-between py-3 border-b border-outline-variant/20">
                      <span className="text-sm font-bold text-primary/60">Last Menstrual Period</span>
                      <span className="text-sm font-bold text-primary">{formatDate(results.estimatedLMP)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-outline-variant/20">
                      <span className="text-sm font-bold text-primary/60">Estimated Conception</span>
                      <span className="text-sm font-bold text-primary">{formatDate(results.conceptionDate)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-outline-variant/20">
                      <span className="text-sm font-bold text-primary/60">End of 1st Trimester (Week 13)</span>
                      <span className="text-sm font-bold text-primary">{formatDate(addDays(results.estimatedLMP, 13 * 7))}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-outline-variant/20">
                      <span className="text-sm font-bold text-primary/60">End of 2nd Trimester (Week 27)</span>
                      <span className="text-sm font-bold text-primary">{formatDate(addDays(results.estimatedLMP, 27 * 7))}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-outline-variant/20">
                      <span className="text-sm font-bold text-primary/60">Early Term (Week 36)</span>
                      <span className="text-sm font-bold text-primary">{formatDate(addDays(results.estimatedLMP, 36 * 7))}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-outline-variant/20">
                      <span className="text-sm font-bold text-primary/60">Full Term (Week 37)</span>
                      <span className="text-sm font-bold text-primary">{formatDate(addDays(results.estimatedLMP, 37 * 7))}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b-2 border-secondary/30 bg-secondary/5 -mx-2 px-2 rounded-[1px] md:col-span-2 mt-2">
                      <span className="text-base font-bold text-secondary">Estimated Due Date (Week 40)</span>
                      <span className="text-base font-bold text-secondary">{formatDate(results.dueDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container p-6 rounded-[1px] border border-outline-variant/30 mt-8">
                  <p className="text-xs text-primary/50 text-center leading-relaxed font-medium">
                    <strong className="text-primary/70">Medical Disclaimer:</strong> This calculator provides estimates only. Gestational age and due dates should always be confirmed by a qualified healthcare provider. Do not use this tool as a substitute for professional medical advice.
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
                <Calendar className="w-12 h-12 text-primary/20 mb-4" />
                <p className="font-headline font-bold text-xl text-primary/40">Ready to Calculate</p>
                <p className="text-sm text-primary/30 mt-2">Fill out the fields and click calculate to see your comprehensive pregnancy timeline.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
