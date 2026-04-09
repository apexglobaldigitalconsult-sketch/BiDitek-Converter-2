import React, { useState, useMemo } from 'react';
import { ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';

type TabMode = 'navy' | 'bmi' | 'skinfold';
type Gender = 'male' | 'female';
type Unit = 'metric' | 'imperial';

export default function BodyFatCalculator() {
  const [tab, setTab] = useState<TabMode>('navy');
  
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

  // Navy Method Inputs
  const [waistCm, setWaistCm] = useState<number | ''>('');
  const [waistIn, setWaistIn] = useState<number | ''>('');
  const [neckCm, setNeckCm] = useState<number | ''>('');
  const [neckIn, setNeckIn] = useState<number | ''>('');
  const [hipCm, setHipCm] = useState<number | ''>('');
  const [hipIn, setHipIn] = useState<number | ''>('');

  // Skinfold Inputs (in mm)
  const [skinfold1, setSkinfold1] = useState<number | ''>(''); // Male: Chest, Female: Tricep
  const [skinfold2, setSkinfold2] = useState<number | ''>(''); // Male: Abdomen, Female: Suprailiac
  const [skinfold3, setSkinfold3] = useState<number | ''>(''); // Thigh for both

  // Results
  const [hasCalculated, setHasCalculated] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [resultBF, setResultBF] = useState<number>(0);
  const [resultWeightKg, setResultWeightKg] = useState<number>(0);

  const handleUnitToggle = (newUnit: Unit) => {
    if (newUnit === unit) return;
    
    if (newUnit === 'imperial') {
      setWeightLbs(weightKg ? +(Number(weightKg) * 2.20462).toFixed(1) : '');
      if (heightCm) {
        const totalInches = Number(heightCm) / 2.54;
        setHeightFt(Math.floor(totalInches / 12));
        setHeightIn(+(totalInches % 12).toFixed(1));
      }
      setWaistIn(waistCm ? +(Number(waistCm) / 2.54).toFixed(1) : '');
      setNeckIn(neckCm ? +(Number(neckCm) / 2.54).toFixed(1) : '');
      setHipIn(hipCm ? +(Number(hipCm) / 2.54).toFixed(1) : '');
    } else {
      setWeightKg(weightLbs ? +(Number(weightLbs) / 2.20462).toFixed(1) : '');
      if (heightFt !== '' || heightIn !== '') {
        setHeightCm(+(((Number(heightFt) * 12) + Number(heightIn)) * 2.54).toFixed(1));
      }
      setWaistCm(waistIn ? +(Number(waistIn) * 2.54).toFixed(1) : '');
      setNeckCm(neckIn ? +(Number(neckIn) * 2.54).toFixed(1) : '');
      setHipCm(hipIn ? +(Number(hipIn) * 2.54).toFixed(1) : '');
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

    if (tab === 'navy') {
      const waist = unit === 'metric' ? Number(waistCm) : Number(waistIn) * 2.54;
      const neck = unit === 'metric' ? Number(neckCm) : Number(neckIn) * 2.54;
      const hip = unit === 'metric' ? Number(hipCm) : Number(hipIn) * 2.54;
      
      if (!waist || waist <= 0) errs.push("Please enter a valid waist circumference.");
      if (!neck || neck <= 0) errs.push("Please enter a valid neck circumference.");
      if (gender === 'female' && (!hip || hip <= 0)) errs.push("Please enter a valid hip circumference.");
      if (waist <= neck) errs.push("Waist must be larger than neck for the Navy formula.");
    } else if (tab === 'skinfold') {
      if (!skinfold1 || skinfold1 <= 0) errs.push(`Please enter a valid ${gender === 'male' ? 'Chest' : 'Tricep'} measurement.`);
      if (!skinfold2 || skinfold2 <= 0) errs.push(`Please enter a valid ${gender === 'male' ? 'Abdomen' : 'Suprailiac'} measurement.`);
      if (!skinfold3 || skinfold3 <= 0) errs.push(`Please enter a valid Thigh measurement.`);
    }
    
    setErrors(errs);
    return errs.length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) {
      setHasCalculated(false);
      return;
    }
    
    const h = unit === 'metric' ? Number(heightCm) : (Number(heightFt) * 12 + Number(heightIn)) * 2.54;
    const w = unit === 'metric' ? Number(weightKg) : Number(weightLbs) / 2.20462;
    let bf = 0;

    if (tab === 'navy') {
      const waist = unit === 'metric' ? Number(waistCm) : Number(waistIn) * 2.54;
      const neck = unit === 'metric' ? Number(neckCm) : Number(neckIn) * 2.54;
      const hip = unit === 'metric' ? Number(hipCm) : Number(hipIn) * 2.54;
      
      if (gender === 'male') {
        bf = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(h) + 36.76;
      } else {
        bf = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(h) - 78.387;
      }
    } else if (tab === 'bmi') {
      const bmi = w / Math.pow(h / 100, 2);
      bf = (1.20 * bmi) + (0.23 * Number(age)) - (10.8 * (gender === 'male' ? 1 : 0)) - 5.4;
    } else if (tab === 'skinfold') {
      const sum = Number(skinfold1) + Number(skinfold2) + Number(skinfold3);
      let d = 0;
      if (gender === 'male') {
        d = 1.10938 - (0.0008267 * sum) + (0.0000016 * sum * sum) - (0.0002574 * Number(age));
      } else {
        d = 1.0994921 - (0.0009929 * sum) + (0.0000023 * sum * sum) - (0.0001392 * Number(age));
      }
      bf = (495 / d) - 450;
    }

    setResultBF(Math.max(1, Math.min(bf, 80))); // clamp between 1% and 80%
    setResultWeightKg(w);
    setHasCalculated(true);
  };

  const getCategory = (bf: number, g: Gender) => {
    if (g === 'male') {
      if (bf < 2) return { name: 'Underfat', color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500' };
      if (bf <= 5) return { name: 'Essential Fat', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500' };
      if (bf <= 13) return { name: 'Athletic', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500' };
      if (bf <= 17) return { name: 'Fit', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500' };
      if (bf <= 24) return { name: 'Average', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500' };
      return { name: 'Obese', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500' };
    } else {
      if (bf < 10) return { name: 'Underfat', color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500' };
      if (bf <= 13) return { name: 'Essential Fat', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500' };
      if (bf <= 20) return { name: 'Athletic', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500' };
      if (bf <= 24) return { name: 'Fit', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500' };
      if (bf <= 31) return { name: 'Average', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500' };
      return { name: 'Obese', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500' };
    }
  };

  const category = getCategory(resultBF, gender);
  const fatMassKg = resultWeightKg * (resultBF / 100);
  const leanMassKg = resultWeightKg - fatMassKg;
  const fatMassLbs = fatMassKg * 2.20462;
  const leanMassLbs = leanMassKg * 2.20462;

  const maxBf = gender === 'male' ? 40 : 50;
  const pinPosition = Math.min(100, Math.max(0, (resultBF / maxBf) * 100));

  return (
    <div className="px-6 lg:px-16 py-12 lg:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-3 text-[10px] font-label font-black uppercase tracking-[0.2em] text-primary/30 mb-12">
        <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/calculators" className="hover:text-secondary transition-colors">Calculators</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-secondary font-black">Body Fat Calculator</span>
      </nav>

      <div className="mb-12">
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter text-primary leading-[1.1]">Body Fat Calculator</h1>
        <p className="text-primary/50 mt-6 max-w-2xl font-body text-lg leading-relaxed">
          Estimate your body fat percentage using the U.S. Navy Method, BMI Method, or Skinfold Calipers.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-12 bg-surface-container-low p-2 rounded-[1px] border border-outline-variant/30 inline-flex">
        {[
          { id: 'navy', label: 'Navy Method' },
          { id: 'bmi', label: 'BMI Method' },
          { id: 'skinfold', label: 'Skinfold / Calipers' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id as TabMode);
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
        <div className="xl:col-span-7 bg-surface-container-low rounded-[1px] p-8 lg:p-12 space-y-10 border border-outline-variant/30 shadow-sm">
          
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
                    onClick={() => {
                      setGender(g as Gender);
                      setSkinfold1('');
                      setSkinfold2('');
                      setSkinfold3('');
                    }}
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

          {/* Navy Method Specific Inputs */}
          {tab === 'navy' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 border-t border-outline-variant/30 pt-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Waist (at navel)</label>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                    <input 
                      type="number" 
                      value={unit === 'metric' ? waistCm : waistIn}
                      onChange={(e) => {
                        const val = e.target.value ? Number(e.target.value) : '';
                        if (unit === 'metric') setWaistCm(val);
                        else setWaistIn(val);
                      }}
                      className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                    />
                    <span className="text-primary/30 font-label font-bold text-xs">{unit === 'metric' ? 'CM' : 'IN'}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Neck (below larynx)</label>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                    <input 
                      type="number" 
                      value={unit === 'metric' ? neckCm : neckIn}
                      onChange={(e) => {
                        const val = e.target.value ? Number(e.target.value) : '';
                        if (unit === 'metric') setNeckCm(val);
                        else setNeckIn(val);
                      }}
                      className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                    />
                    <span className="text-primary/30 font-label font-bold text-xs">{unit === 'metric' ? 'CM' : 'IN'}</span>
                  </div>
                </div>
                {gender === 'female' && (
                  <div className="space-y-4">
                    <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Hip (widest point)</label>
                    <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                      <input 
                        type="number" 
                        value={unit === 'metric' ? hipCm : hipIn}
                        onChange={(e) => {
                          const val = e.target.value ? Number(e.target.value) : '';
                          if (unit === 'metric') setHipCm(val);
                          else setHipIn(val);
                        }}
                        className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                      />
                      <span className="text-primary/30 font-label font-bold text-xs">{unit === 'metric' ? 'CM' : 'IN'}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Skinfold Specific Inputs */}
          {tab === 'skinfold' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 border-t border-outline-variant/30 pt-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">
                    {gender === 'male' ? 'Chest' : 'Tricep'}
                  </label>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                    <input 
                      type="number" 
                      value={skinfold1}
                      onChange={(e) => setSkinfold1(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                    />
                    <span className="text-primary/30 font-label font-bold text-xs">MM</span>
                  </div>
                  <p className="text-xs text-primary/40 pl-2">
                    {gender === 'male' ? 'Diagonal fold, halfway between nipple and armpit.' : 'Vertical fold, back of upper arm.'}
                  </p>
                </div>
                <div className="space-y-4">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">
                    {gender === 'male' ? 'Abdomen' : 'Suprailiac'}
                  </label>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                    <input 
                      type="number" 
                      value={skinfold2}
                      onChange={(e) => setSkinfold2(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                    />
                    <span className="text-primary/30 font-label font-bold text-xs">MM</span>
                  </div>
                  <p className="text-xs text-primary/40 pl-2">
                    {gender === 'male' ? 'Vertical fold, 2cm right of navel.' : 'Diagonal fold, just above hip bone.'}
                  </p>
                </div>
                <div className="space-y-4">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Thigh</label>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                    <input 
                      type="number" 
                      value={skinfold3}
                      onChange={(e) => setSkinfold3(e.target.value ? Number(e.target.value) : '')}
                      className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                    />
                    <span className="text-primary/30 font-label font-bold text-xs">MM</span>
                  </div>
                  <p className="text-xs text-primary/40 pl-2">Vertical fold, front of thigh, midway.</p>
                </div>
              </div>
            </motion.div>
          )}

          <button 
            onClick={handleCalculate}
            className="w-full bg-secondary text-white py-6 rounded-[1px] font-headline font-bold text-xl hover:opacity-90 transition-all shadow-lg shadow-secondary/20 mt-8"
          >
            CALCULATE
          </button>
        </div>

        {/* Results Section */}
        <div className="xl:col-span-5 space-y-8">
          <AnimatePresence mode="wait">
            {hasCalculated ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm space-y-8"
              >
                <div className="text-center">
                  <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 mb-2">Body Fat Percentage</p>
                  <h2 className="font-headline text-7xl font-extrabold text-primary tracking-tighter">
                    {resultBF.toFixed(1)}<span className="text-4xl text-primary/40">%</span>
                  </h2>
                  <div className={cn("inline-block mt-4 px-6 py-2 rounded-[1px] font-headline font-bold text-sm tracking-widest uppercase", category.bg, category.color)}>
                    {category.name}
                  </div>
                </div>

                {/* Visual Bar */}
                <div className="pt-6 pb-2">
                  <div className="relative h-4 w-full rounded-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 via-orange-400 to-red-400">
                    <motion.div 
                      initial={{ left: 0 }}
                      animate={{ left: `${pinPosition}%` }}
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-8 bg-white rounded-[1px] border-2 border-primary shadow-md -ml-1.5"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary/30 mt-3">
                    <span>Essential</span>
                    <span>Athletic</span>
                    <span>Fit</span>
                    <span>Average</span>
                    <span>Obese</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container p-4 rounded-[1px] text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Fat Mass</p>
                    <p className="font-headline font-bold text-lg">{fatMassKg.toFixed(1)} kg / {fatMassLbs.toFixed(1)} lbs</p>
                  </div>
                  <div className="bg-surface-container p-4 rounded-[1px] text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Lean Mass</p>
                    <p className="font-headline font-bold text-lg">{leanMassKg.toFixed(1)} kg / {leanMassLbs.toFixed(1)} lbs</p>
                  </div>
                </div>

                <div className="bg-surface-container p-4 rounded-[1px] text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Method Used</p>
                  <p className="font-headline font-bold text-primary capitalize">
                    {tab === 'navy' ? 'U.S. Navy Method' : tab === 'bmi' ? 'BMI-Based Estimation' : 'Jackson-Pollock 3-Site Skinfold'}
                  </p>
                </div>

                {/* Classification Table */}
                <div className="mt-8 overflow-hidden rounded-[1px] border border-outline-variant/30">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-container font-label text-[10px] font-black uppercase tracking-widest text-primary/40">
                      <tr>
                        <th className="p-3">Category</th>
                        <th className="p-3">Women</th>
                        <th className="p-3">Men</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Essential Fat', w: '10–13%', m: '2–5%', color: 'border-blue-500' },
                        { name: 'Athletic', w: '14–20%', m: '6–13%', color: 'border-green-500' },
                        { name: 'Fit', w: '21–24%', m: '14–17%', color: 'border-yellow-500' },
                        { name: 'Average', w: '25–31%', m: '18–24%', color: 'border-orange-500' },
                        { name: 'Obese', w: '32%+', m: '25%+', color: 'border-red-500' },
                      ].map((row) => (
                        <tr 
                          key={row.name} 
                          className={cn(
                            "border-t border-outline-variant/20 border-l-4", 
                            row.color,
                            category.name === row.name ? "bg-secondary/5 font-bold" : "bg-transparent"
                          )}
                        >
                          <td className="p-3 text-primary">{row.name}</td>
                          <td className="p-3 text-primary/70">{row.w}</td>
                          <td className="p-3 text-primary/70">{row.m}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-primary/40 text-center mt-6">
                  * Body fat estimates are approximations and not a substitute for professional medical assessment.
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
                <p className="text-sm text-primary/30 mt-2">Fill out the fields and click calculate to see your results.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
