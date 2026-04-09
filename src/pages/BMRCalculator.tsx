import React, { useState, useMemo } from 'react';
import { ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';

type FormulaTab = 'mifflin' | 'harris' | 'katch' | 'compare';
type Gender = 'male' | 'female';
type Unit = 'metric' | 'imperial';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
};

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary (little or no exercise)',
  light: 'Lightly Active (1–3 days/week)',
  moderate: 'Moderately Active (3–5 days/week)',
  very: 'Very Active (6–7 days/week)',
  extra: 'Extra Active (physical job or 2× training)',
};

export default function BMRCalculator() {
  const [tab, setTab] = useState<FormulaTab>('mifflin');
  
  // Shared Inputs
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState<number | ''>(25);
  const [unit, setUnit] = useState<Unit>('metric');
  
  // Height
  const [heightCm, setHeightCm] = useState<number | ''>(180);
  const [heightFt, setHeightFt] = useState<number | ''>(5);
  const [heightIn, setHeightIn] = useState<number | ''>(11);
  
  // Weight
  const [weightKg, setWeightKg] = useState<number | ''>(75);
  const [weightLbs, setWeightLbs] = useState<number | ''>(165);

  // Body Fat
  const [bodyFat, setBodyFat] = useState<number | ''>('');

  // Activity Level
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('sedentary');

  // Results
  const [hasCalculated, setHasCalculated] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleUnitToggle = (newUnit: Unit) => {
    if (newUnit === unit) return;
    
    if (newUnit === 'imperial') {
      setWeightLbs(weightKg ? +(Number(weightKg) * 2.20462).toFixed(1) : '');
      if (heightCm) {
        const totalInches = Number(heightCm) / 2.54;
        setHeightFt(Math.floor(totalInches / 12));
        setHeightIn(+(totalInches % 12).toFixed(1));
      }
    } else {
      setWeightKg(weightLbs ? +(Number(weightLbs) / 2.20462).toFixed(1) : '');
      if (heightFt !== '' || heightIn !== '') {
        setHeightCm(+(((Number(heightFt) * 12) + Number(heightIn)) * 2.54).toFixed(1));
      }
    }
    setUnit(newUnit);
  };

  const validate = () => {
    const errs: string[] = [];
    if (!age || age < 15 || age > 80) errs.push("Age must be between 15 and 80.");
    
    const h = unit === 'metric' ? Number(heightCm) : (Number(heightFt) * 12 + Number(heightIn)) * 2.54;
    const w = unit === 'metric' ? Number(weightKg) : Number(weightLbs) / 2.20462;
    
    if (!h || h <= 0) errs.push("Please enter a valid height.");
    if (!w || w <= 0) errs.push("Please enter a valid weight.");

    if ((tab === 'katch' || tab === 'compare') && (!bodyFat || bodyFat < 3 || bodyFat > 60)) {
      errs.push("Body fat must be between 3% and 60% for Katch-McArdle.");
    }
    
    setErrors(errs);
    return errs.length === 0;
  };

  const handleCalculate = () => {
    if (validate()) {
      setHasCalculated(true);
    } else {
      setHasCalculated(false);
    }
  };

  const hCm = unit === 'metric' ? Number(heightCm) : (Number(heightFt) * 12 + Number(heightIn)) * 2.54;
  const wKg = unit === 'metric' ? Number(weightKg) : Number(weightLbs) / 2.20462;
  const a = Number(age);
  const bf = Number(bodyFat);

  const calculateMifflin = (weight: number, height: number, ageVal: number, g: Gender) => {
    return (10 * weight) + (6.25 * height) - (5 * ageVal) + (g === 'male' ? 5 : -161);
  };

  const calculateHarris = (weight: number, height: number, ageVal: number, g: Gender) => {
    if (g === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * ageVal);
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * ageVal);
    }
  };

  const calculateKatch = (weight: number, bodyFatPct: number) => {
    const lbm = weight * (1 - bodyFatPct / 100);
    return 370 + (21.6 * lbm);
  };

  const mifflinBMR = Math.round(calculateMifflin(wKg, hCm, a, gender));
  const harrisBMR = Math.round(calculateHarris(wKg, hCm, a, gender));
  const katchBMR = bf ? Math.round(calculateKatch(wKg, bf)) : 0;

  const currentBMR = tab === 'mifflin' ? mifflinBMR : tab === 'harris' ? harrisBMR : tab === 'katch' ? katchBMR : mifflinBMR; // For compare, use mifflin as base for TDEE
  
  const currentTDEE = Math.round(currentBMR * ACTIVITY_MULTIPLIERS[activityLevel]);

  const macros = {
    protein: { pct: 30, kcal: Math.round(currentTDEE * 0.3), g: Math.round((currentTDEE * 0.3) / 4) },
    carbs: { pct: 40, kcal: Math.round(currentTDEE * 0.4), g: Math.round((currentTDEE * 0.4) / 4) },
    fat: { pct: 30, kcal: Math.round(currentTDEE * 0.3), g: Math.round((currentTDEE * 0.3) / 9) },
  };

  const trendData = [];
  for (let i = 20; i <= 80; i += 5) {
    let bmrAtAge = 0;
    if (tab === 'mifflin' || tab === 'compare') bmrAtAge = calculateMifflin(wKg, hCm, i, gender);
    else if (tab === 'harris') bmrAtAge = calculateHarris(wKg, hCm, i, gender);
    else if (tab === 'katch') bmrAtAge = calculateKatch(wKg, bf); // Katch doesn't change with age directly in formula, but LBM usually drops. We'll just show flat for Katch if they selected it, or maybe it's better to note it.
    
    trendData.push({ age: i, bmr: Math.round(bmrAtAge) });
  }

  // Find closest age for highlighting
  const closestAge = trendData.reduce((prev, curr) => Math.abs(curr.age - a) < Math.abs(prev.age - a) ? curr : prev).age;

  return (
    <div className="px-6 lg:px-16 py-12 lg:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-3 text-[10px] font-label font-black uppercase tracking-[0.2em] text-primary/30 mb-12">
        <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/calculators" className="hover:text-secondary transition-colors">Calculators</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-secondary font-black">BMR Calculator</span>
      </nav>

      <div className="mb-12">
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter text-primary leading-[1.1]">BMR Calculator</h1>
        <p className="text-primary/50 mt-6 max-w-2xl font-body text-lg leading-relaxed">
          Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) using the most accurate scientific formulas.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-12 bg-surface-container-low p-2 rounded-[1px] border border-outline-variant/30 inline-flex">
        {[
          { id: 'mifflin', label: 'Mifflin-St Jeor' },
          { id: 'harris', label: 'Harris-Benedict' },
          { id: 'katch', label: 'Katch-McArdle' },
          { id: 'compare', label: 'Compare All' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id as FormulaTab);
              setHasCalculated(false);
            }}
            className={cn(
              "px-6 py-3 rounded-[1px] font-headline font-bold text-sm transition-all",
              tab === t.id ? "bg-secondary text-white shadow-md" : "text-primary/60 hover:text-primary hover:bg-surface-container"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Gender */}
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Gender</label>
              <div className="flex gap-2">
                {['male', 'female'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g as Gender)}
                    className={cn(
                      "flex-1 py-4 rounded-[1px] font-headline font-bold text-sm transition-all",
                      gender === g ? "bg-secondary text-white shadow-md" : "bg-surface-container text-primary/40 hover:text-primary"
                    )}
                  >
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Age */}
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Age (15-80)</label>
              <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                <input 
                  type="number" 
                  value={age}
                  onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                />
                <span className="text-primary/30 font-label font-bold text-xs">YRS</span>
              </div>
            </div>
          </div>

          {/* Unit Toggle */}
          <div className="flex justify-end">
            <div className="flex bg-surface-container-highest rounded-[1px] p-1 text-[10px] font-black">
              <button 
                onClick={() => handleUnitToggle('metric')}
                className={cn("px-4 py-1.5 rounded-[1px] transition-all", unit === 'metric' ? "bg-surface-container-low text-primary shadow-sm" : "text-primary/40")}
              >METRIC</button>
              <button 
                onClick={() => handleUnitToggle('imperial')}
                className={cn("px-4 py-1.5 rounded-[1px] transition-all", unit === 'imperial' ? "bg-surface-container-low text-primary shadow-sm" : "text-primary/40")}
              >IMPERIAL</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Height */}
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Height</label>
              {unit === 'metric' ? (
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                  <input 
                    type="number" 
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                  />
                  <span className="text-primary/30 font-label font-bold text-xs">CM</span>
                </div>
              ) : (
                <div className="flex gap-4">
                  <div className="bg-surface-container rounded-[1px] flex items-center px-4 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30 flex-1">
                    <input 
                      type="number" 
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                    />
                    <span className="text-primary/30 font-label font-bold text-xs">FT</span>
                  </div>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-4 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30 flex-1">
                    <input 
                      type="number" 
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                    />
                    <span className="text-primary/30 font-label font-bold text-xs">IN</span>
                  </div>
                </div>
              )}
            </div>

            {/* Weight */}
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Weight</label>
              <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                <input 
                  type="number" 
                  value={unit === 'metric' ? weightKg : weightLbs}
                  onChange={(e) => {
                    const val = e.target.value ? Number(e.target.value) : '';
                    if (unit === 'metric') setWeightKg(val);
                    else setWeightLbs(val);
                  }}
                  className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                />
                <span className="text-primary/30 font-label font-bold text-xs">{unit === 'metric' ? 'KG' : 'LBS'}</span>
              </div>
            </div>
          </div>

          {/* Body Fat (Conditional) */}
          <AnimatePresence>
            {(tab === 'katch' || tab === 'compare') && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Body Fat %</label>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                  <input 
                    type="number" 
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                  />
                  <span className="text-primary/30 font-label font-bold text-xs">%</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Activity Level */}
          <div className="space-y-4">
            <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Activity Level</label>
            <select 
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
              className="w-full bg-surface-container border-none py-4 px-6 text-sm font-headline font-bold focus:ring-2 ring-secondary/20 text-primary rounded-[1px] appearance-none"
            >
              {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

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
            {hasCalculated ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Section 1: BMR Result */}
                <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm text-center">
                  <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 mb-4">Your Basal Metabolic Rate</p>
                  
                  {tab !== 'compare' ? (
                    <>
                      <h2 className="font-headline text-7xl font-extrabold text-primary tracking-tighter mb-4">
                        {currentBMR.toLocaleString()}<span className="text-3xl text-primary/40 ml-2">kcal/day</span>
                      </h2>
                      <div className="inline-block bg-surface-container px-6 py-2 rounded-[1px] font-headline font-bold text-sm tracking-widest uppercase text-primary/70 mb-6">
                        {tab === 'mifflin' ? 'Mifflin-St Jeor' : tab === 'harris' ? 'Harris-Benedict' : 'Katch-McArdle'}
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <div className="bg-surface-container p-6 rounded-[1px] border-2 border-secondary/30 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-[1px]">Recommended</div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2 mt-2">Mifflin-St Jeor</p>
                        <p className="font-headline font-bold text-2xl text-primary">{mifflinBMR.toLocaleString()}</p>
                        <p className="text-xs text-primary/40">kcal/day</p>
                      </div>
                      <div className="bg-surface-container p-6 rounded-[1px]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2 mt-2">Harris-Benedict</p>
                        <p className="font-headline font-bold text-2xl text-primary">{harrisBMR.toLocaleString()}</p>
                        <p className="text-xs text-primary/40">kcal/day</p>
                      </div>
                      <div className="bg-surface-container p-6 rounded-[1px]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2 mt-2">Katch-McArdle</p>
                        <p className="font-headline font-bold text-2xl text-primary">{katchBMR.toLocaleString()}</p>
                        <p className="text-xs text-primary/40">kcal/day</p>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm text-primary/60 font-medium">
                    This is the number of calories your body burns at complete rest to maintain basic functions.
                  </p>
                </div>

                {/* Section 2: TDEE Breakdown */}
                <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm">
                  <h3 className="font-headline text-xl font-bold mb-6 text-primary">TDEE Breakdown Across All Activity Levels</h3>
                  <div className="overflow-hidden rounded-[1px] border border-outline-variant/30">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-surface-container font-label text-[10px] font-black uppercase tracking-widest text-primary/40">
                        <tr>
                          <th className="p-4">Activity Level</th>
                          <th className="p-4 text-right">Daily Calories (TDEE)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(Object.entries(ACTIVITY_MULTIPLIERS) as [ActivityLevel, number][]).map(([level, mult]) => (
                          <tr 
                            key={level} 
                            className={cn(
                              "border-t border-outline-variant/20 transition-colors",
                              activityLevel === level ? "bg-secondary/10 font-bold" : "bg-transparent"
                            )}
                          >
                            <td className="p-4 text-primary">{ACTIVITY_LABELS[level]}</td>
                            <td className="p-4 text-right text-primary">
                              <span className={cn(activityLevel === level ? "text-secondary" : "")}>
                                {Math.round(currentBMR * mult).toLocaleString()} kcal/day
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 3: Macronutrient Suggestions */}
                <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm">
                  <h3 className="font-headline text-xl font-bold mb-6 text-primary">Macronutrient Suggestions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                      <table className="w-full text-left text-sm">
                        <thead className="bg-surface-container font-label text-[10px] font-black uppercase tracking-widest text-primary/40">
                          <tr>
                            <th className="p-3">Macro</th>
                            <th className="p-3 text-right">Ratio</th>
                            <th className="p-3 text-right">Grams/Day</th>
                            <th className="p-3 text-right">kcal</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-outline-variant/20">
                            <td className="p-3 font-bold text-blue-600 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div>Protein</td>
                            <td className="p-3 text-right text-primary/70">30%</td>
                            <td className="p-3 text-right font-bold text-primary">{macros.protein.g}g</td>
                            <td className="p-3 text-right text-primary/70">{macros.protein.kcal}</td>
                          </tr>
                          <tr className="border-t border-outline-variant/20">
                            <td className="p-3 font-bold text-green-600 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div>Carbs</td>
                            <td className="p-3 text-right text-primary/70">40%</td>
                            <td className="p-3 text-right font-bold text-primary">{macros.carbs.g}g</td>
                            <td className="p-3 text-right text-primary/70">{macros.carbs.kcal}</td>
                          </tr>
                          <tr className="border-t border-outline-variant/20">
                            <td className="p-3 font-bold text-yellow-600 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div>Fat</td>
                            <td className="p-3 text-right text-primary/70">30%</td>
                            <td className="p-3 text-right font-bold text-primary">{macros.fat.g}g</td>
                            <td className="p-3 text-right text-primary/70">{macros.fat.kcal}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-center">
                      {/* Pure CSS Donut Chart */}
                      <div className="relative w-48 h-48 rounded-full" style={{
                        background: `conic-gradient(
                          #3b82f6 0% 30%, 
                          #22c55e 30% 70%, 
                          #eab308 70% 100%
                        )`
                      }}>
                        <div className="absolute inset-4 bg-surface-container-low rounded-full flex items-center justify-center flex-col">
                          <span className="font-headline font-bold text-2xl text-primary">{currentTDEE}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">kcal</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: BMR vs. Age Trend */}
                <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm">
                  <h3 className="font-headline text-xl font-bold mb-6 text-primary">BMR vs. Age Trend</h3>
                  <div className="overflow-x-auto">
                    <div className="flex items-end gap-2 h-48 pt-8 pb-4 border-b border-outline-variant/30 min-w-[600px]">
                      {trendData.map((data) => {
                        const maxBmr = Math.max(...trendData.map(d => d.bmr));
                        const heightPct = (data.bmr / maxBmr) * 100;
                        const isCurrent = data.age === closestAge;
                        
                        return (
                          <div key={data.age} className="flex-1 flex flex-col items-center justify-end group">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-primary mb-2">
                              {data.bmr}
                            </div>
                            <div 
                              className={cn(
                                "w-full rounded-t-[1px] transition-all",
                                isCurrent ? "bg-secondary" : "bg-primary/10 group-hover:bg-primary/20"
                              )}
                              style={{ height: `${heightPct}%` }}
                            />
                            <div className={cn(
                              "mt-2 text-xs font-bold",
                              isCurrent ? "text-secondary" : "text-primary/40"
                            )}>
                              {data.age}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-sm text-primary/60 mt-6 text-center italic">
                    "BMR naturally decreases with age due to changes in muscle mass and metabolism."
                  </p>
                </div>

                <p className="text-xs text-primary/40 text-center mt-6">
                  * BMR and TDEE figures are estimates and individual metabolism may vary.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-surface-container-low rounded-[1px] p-16 border border-outline-variant/30 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[400px]"
              >
                <Info className="w-12 h-12 text-primary/20 mb-4" />
                <p className="font-headline font-bold text-xl text-primary/40">Ready to Calculate</p>
                <p className="text-sm text-primary/30 mt-2">Fill out the fields and click calculate to see your comprehensive BMR analysis.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
