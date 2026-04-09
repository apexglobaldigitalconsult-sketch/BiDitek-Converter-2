import React, { useState, useMemo } from 'react';
import { ChevronRight, Info, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';

type FormulaTab = 'devine' | 'robinson' | 'miller' | 'hamwi' | 'compare';
type Gender = 'male' | 'female';
type Unit = 'metric' | 'imperial';
type FrameSize = 'small' | 'medium' | 'large';

export default function IdealWeightCalculator() {
  const [tab, setTab] = useState<FormulaTab>('compare');
  
  // Shared Inputs
  const [gender, setGender] = useState<Gender>('male');
  const [unit, setUnit] = useState<Unit>('metric');
  
  // Height
  const [heightCm, setHeightCm] = useState<number | ''>(175);
  const [heightFt, setHeightFt] = useState<number | ''>(5);
  const [heightIn, setHeightIn] = useState<number | ''>(9);
  
  // Weight
  const [weightKg, setWeightKg] = useState<number | ''>(70);
  const [weightLbs, setWeightLbs] = useState<number | ''>(154);

  // Frame Size
  const [frameSize, setFrameSize] = useState<FrameSize>('medium');
  const [isFrameHelperOpen, setIsFrameHelperOpen] = useState(false);

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
    
    const h = unit === 'metric' ? Number(heightCm) : (Number(heightFt) * 12 + Number(heightIn)) * 2.54;
    const w = unit === 'metric' ? Number(weightKg) : Number(weightLbs) / 2.20462;
    
    if (!h || h <= 0) errs.push("Please enter a valid height.");
    if (!w || w <= 0) errs.push("Please enter a valid current weight.");
    
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

  // Calculations
  const hCm = unit === 'metric' ? Number(heightCm) : (Number(heightFt) * 12 + Number(heightIn)) * 2.54;
  const hInches = hCm / 2.54;
  const wKg = unit === 'metric' ? Number(weightKg) : Number(weightLbs) / 2.20462;
  
  const hOver60 = Math.max(0, hInches - 60);

  const calculateIBWLbs = (formula: 'devine' | 'robinson' | 'miller' | 'hamwi', g: Gender) => {
    let base = 0;
    if (formula === 'devine') {
      base = g === 'male' ? 50 + (2.3 * hOver60) : 45.5 + (2.3 * hOver60);
    } else if (formula === 'robinson') {
      base = g === 'male' ? 52 + (1.9 * hOver60) : 49 + (1.7 * hOver60);
    } else if (formula === 'miller') {
      base = g === 'male' ? 56.2 + (1.41 * hOver60) : 53.1 + (1.36 * hOver60);
    } else if (formula === 'hamwi') {
      base = g === 'male' ? 48 + (2.7 * hOver60) : 45.5 + (2.2 * hOver60);
    }
    // Convert base from kg to lbs since formulas produce kg
    // Wait, the prompt says: "All formulas use height in inches and produce results in lbs internally."
    // Let's re-read: "Devine Formula: Male: IBW = 50 + (2.3 × h)"
    // Actually, Devine produces KG. 50kg + 2.3kg per inch.
    // Let's assume the prompt meant "produce results in kg internally" because 50 + 2.3*h is the standard KG formula.
    // Let's check: 50 + 2.3 * 0 = 50kg for 5ft male. Yes, that's kg.
    // I will calculate in KG and convert to LBS if needed.
    return base;
  };

  const getFrameMultiplier = (frame: FrameSize) => {
    if (frame === 'small') return 0.9;
    if (frame === 'large') return 1.1;
    return 1;
  };

  const formatWeight = (kgVal: number) => {
    if (unit === 'metric') return `${kgVal.toFixed(1)} kg`;
    return `${(kgVal * 2.20462).toFixed(1)} lbs`;
  };

  const getRange = (kgVal: number, frame: FrameSize) => {
    const target = kgVal * getFrameMultiplier(frame);
    // Let's use a +/- 5% range around the frame-adjusted target
    const low = target * 0.95;
    const high = target * 1.05;
    if (unit === 'metric') return `${low.toFixed(1)} – ${high.toFixed(1)} kg`;
    return `${(low * 2.20462).toFixed(1)} – ${(high * 2.20462).toFixed(1)} lbs`;
  };

  const activeFormula = (tab === 'compare' ? 'devine' : tab) as 'devine' | 'robinson' | 'miller' | 'hamwi';
  const baseIBWKg = calculateIBWLbs(activeFormula, gender);
  const targetIBWKg = baseIBWKg * getFrameMultiplier(frameSize);
  const targetLowKg = targetIBWKg * 0.95;
  const targetHighKg = targetIBWKg * 1.05;

  // BMI Healthy Weight Range
  const heightM = hCm / 100;
  const bmiLowKg = 18.5 * (heightM * heightM);
  const bmiHighKg = 24.9 * (heightM * heightM);
  const currentBMI = wKg / (heightM * heightM);

  let bmiCategory = '';
  let bmiColor = '';
  if (currentBMI < 18.5) { bmiCategory = 'Underweight'; bmiColor = 'text-blue-500'; }
  else if (currentBMI < 25) { bmiCategory = 'Normal'; bmiColor = 'text-green-500'; }
  else if (currentBMI < 30) { bmiCategory = 'Overweight'; bmiColor = 'text-yellow-500'; }
  else { bmiCategory = 'Obese'; bmiColor = 'text-red-500'; }

  // Distance from Ideal
  const diffKg = wKg - baseIBWKg;
  const diffLbs = diffKg * 2.20462;
  const isWithinRange = Math.abs(diffKg) <= 2;

  let distanceStatus = '';
  let distanceColor = '';
  if (isWithinRange) {
    distanceStatus = 'You are within your ideal weight range. Great work!';
    distanceColor = 'text-green-500';
  } else if (diffKg > 0) {
    distanceStatus = `You are ${unit === 'metric' ? diffKg.toFixed(1) + ' kg' : diffLbs.toFixed(1) + ' lbs'} above your ideal weight.`;
    distanceColor = 'text-orange-500';
  } else {
    distanceStatus = `You are ${unit === 'metric' ? Math.abs(diffKg).toFixed(1) + ' kg' : Math.abs(diffLbs).toFixed(1) + ' lbs'} below your ideal weight.`;
    distanceColor = 'text-blue-500';
  }

  const formulas: ('devine' | 'robinson' | 'miller' | 'hamwi')[] = ['devine', 'robinson', 'miller', 'hamwi'];

  return (
    <div className="px-6 lg:px-16 py-12 lg:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-3 text-[10px] font-label font-black uppercase tracking-[0.2em] text-primary/30 mb-12">
        <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/calculators" className="hover:text-secondary transition-colors">Calculators</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-secondary font-black">Ideal Weight Calculator</span>
      </nav>

      <div className="mb-12">
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter text-primary leading-[1.1]">Ideal Weight Calculator</h1>
        <p className="text-primary/50 mt-6 max-w-2xl font-body text-lg leading-relaxed">
          Calculate your ideal weight using four major scientific formulas, find your BMI healthy weight range, and see how close you are to your goal.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-12 bg-surface-container-low p-2 rounded-[1px] border border-outline-variant/30 inline-flex">
        {[
          { id: 'compare', label: 'Compare All (Recommended)' },
          { id: 'devine', label: 'Devine' },
          { id: 'robinson', label: 'Robinson' },
          { id: 'miller', label: 'Miller' },
          { id: 'hamwi', label: 'Hamwi' }
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

            {/* Current Weight */}
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Current Weight</label>
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

          {/* Frame Size */}
          <div className="space-y-4">
            <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Body Frame Size</label>
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as FrameSize[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFrameSize(f)}
                  className={cn(
                    "flex-1 py-4 rounded-[1px] font-headline font-bold text-sm transition-all capitalize",
                    frameSize === f ? "bg-secondary text-white shadow-md" : "bg-surface-container text-primary/40 hover:text-primary"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            
            <div className="mt-2">
              <button 
                onClick={() => setIsFrameHelperOpen(!isFrameHelperOpen)}
                className="flex items-center gap-2 text-xs font-bold text-primary/50 hover:text-primary transition-colors pl-2"
              >
                <Info className="w-4 h-4" /> How do I know my frame size?
                <ChevronDown className={cn("w-4 h-4 transition-transform", isFrameHelperOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {isFrameHelperOpen && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-surface-container p-4 mt-2 rounded-[1px] text-sm text-primary/70 space-y-2">
                      <p>Measure your wrist circumference in cm:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li><strong>Female:</strong> Small &lt; 15.2 cm | Medium 15.2–16.5 cm | Large &gt; 16.5 cm</li>
                        <li><strong>Male:</strong> Small &lt; 16.5 cm | Medium 16.5–19.1 cm | Large &gt; 19.1 cm</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
                {/* Section 1: Ideal Weight Result */}
                <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm text-center">
                  <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 mb-4">Your Ideal Weight</p>
                  <h2 className="font-headline text-6xl md:text-7xl font-extrabold text-primary tracking-tighter mb-4">
                    {unit === 'metric' ? targetLowKg.toFixed(1) : (targetLowKg * 2.20462).toFixed(1)} 
                    <span className="text-3xl text-primary/40 mx-2">–</span> 
                    {unit === 'metric' ? targetHighKg.toFixed(1) : (targetHighKg * 2.20462).toFixed(1)}
                    <span className="text-3xl text-primary/40 ml-2">{unit === 'metric' ? 'kg' : 'lbs'}</span>
                  </h2>
                  <div className="flex flex-wrap justify-center gap-4 mt-6">
                    <div className="bg-surface-container px-6 py-2 rounded-[1px] font-headline font-bold text-sm tracking-widest uppercase text-primary/70">
                      Frame: <span className="text-primary">{frameSize}</span>
                    </div>
                    <div className="bg-surface-container px-6 py-2 rounded-[1px] font-headline font-bold text-sm tracking-widest uppercase text-primary/70">
                      Formula: <span className="text-primary capitalize">{activeFormula}</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Compare All Formulas */}
                <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm">
                  <h3 className="font-headline text-xl font-bold mb-6 text-primary">Compare All Formulas</h3>
                  <div className="overflow-hidden rounded-[1px] border border-outline-variant/30">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-surface-container font-label text-[10px] font-black uppercase tracking-widest text-primary/40">
                        <tr>
                          <th className="p-4">Formula</th>
                          <th className="p-4 text-right">Ideal Weight (Medium)</th>
                          <th className="p-4 text-right">Range ({frameSize} frame)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formulas.map((f) => {
                          const kg = calculateIBWLbs(f, gender);
                          return (
                            <tr 
                              key={f} 
                              className={cn(
                                "border-t border-outline-variant/20 transition-colors",
                                activeFormula === f ? "bg-secondary/10 font-bold" : "bg-transparent"
                              )}
                            >
                              <td className="p-4 text-primary capitalize">{f}</td>
                              <td className="p-4 text-right text-primary">{formatWeight(kg)}</td>
                              <td className="p-4 text-right text-primary">{getRange(kg, frameSize)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-primary/40 mt-4 italic">
                    * Results vary by formula. The range represents practical guidance based on your selected frame size.
                  </p>
                </div>

                {/* Section 3: BMI Healthy Weight Range */}
                <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm">
                  <h3 className="font-headline text-xl font-bold mb-6 text-primary">BMI Healthy Weight Range</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-surface-container p-6 rounded-[1px] text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2">Healthy Range (BMI 18.5–24.9)</p>
                      <p className="font-headline font-bold text-xl text-primary">
                        {unit === 'metric' ? bmiLowKg.toFixed(1) : (bmiLowKg * 2.20462).toFixed(1)} – {unit === 'metric' ? bmiHighKg.toFixed(1) : (bmiHighKg * 2.20462).toFixed(1)} {unit === 'metric' ? 'kg' : 'lbs'}
                      </p>
                    </div>
                    <div className="bg-surface-container p-6 rounded-[1px] text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2">Your Current BMI</p>
                      <p className="font-headline font-bold text-xl text-primary">{currentBMI.toFixed(1)}</p>
                    </div>
                    <div className={cn("p-6 rounded-[1px] text-center border-2", bmiColor.replace('text-', 'border-').replace('500', '500/30'), bmiColor.replace('text-', 'bg-').replace('500', '500/10'))}>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">BMI Category</p>
                      <p className={cn("font-headline font-bold text-xl", bmiColor)}>{bmiCategory}</p>
                    </div>
                  </div>

                  {/* BMI Scale Bar */}
                  <div className="pt-6 pb-2">
                    <div className="relative h-4 w-full rounded-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-500">
                      <motion.div 
                        initial={{ left: 0 }}
                        animate={{ left: `${Math.min(100, Math.max(0, ((currentBMI - 15) / 25) * 100))}%` }}
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-8 bg-white rounded-[1px] border-2 border-primary shadow-md -ml-1.5"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary/40 mt-3">
                      <span>15</span>
                      <span>18.5</span>
                      <span>25</span>
                      <span>30</span>
                      <span>40+</span>
                    </div>
                  </div>
                </div>

                {/* Section 4: Distance from Ideal Weight */}
                <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm">
                  <h3 className="font-headline text-xl font-bold mb-6 text-primary">Distance from Ideal Weight</h3>
                  <div className="text-center mb-8">
                    <p className={cn("font-headline font-bold text-2xl", distanceColor)}>
                      {distanceStatus}
                    </p>
                  </div>

                  {/* Distance Bar */}
                  <div className="relative pt-8 pb-4">
                    <div className="h-2 w-full bg-surface-container rounded-full relative">
                      {/* Ideal Zone (middle 20%) */}
                      <div className="absolute left-[40%] right-[40%] top-0 bottom-0 bg-green-500/20 rounded-full border-x-2 border-green-500"></div>
                      
                      {/* Current Weight Pin */}
                      <motion.div 
                        initial={{ left: '50%' }}
                        animate={{ 
                          left: `${Math.min(100, Math.max(0, 50 + ((wKg - baseIBWKg) / baseIBWKg) * 100 * 2.5))}%` 
                        }}
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-md -ml-2 border-2 border-white"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary/40 mt-4">
                      <span>-20%</span>
                      <span>Ideal</span>
                      <span>+20%</span>
                    </div>
                  </div>
                </div>

                {/* Section 5: Ideal Weight by Frame Size Summary */}
                <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm">
                  <h3 className="font-headline text-xl font-bold mb-6 text-primary">Frame Size Summary ({activeFormula})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['small', 'medium', 'large'] as FrameSize[]).map((f) => (
                      <div 
                        key={f}
                        className={cn(
                          "p-6 rounded-[1px] text-center border",
                          frameSize === f ? "bg-secondary/10 border-secondary/30" : "bg-surface-container border-transparent"
                        )}
                      >
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2 capitalize">{f} Frame</p>
                        <p className={cn("font-headline font-bold text-xl", frameSize === f ? "text-secondary" : "text-primary")}>
                          {getRange(baseIBWKg, f)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-primary/40 text-center mt-6">
                  * Ideal weight formulas are general estimates and do not account for muscle mass, age, or individual health conditions.
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
                <p className="text-sm text-primary/30 mt-2">Fill out the fields and click calculate to see your comprehensive ideal weight analysis.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
