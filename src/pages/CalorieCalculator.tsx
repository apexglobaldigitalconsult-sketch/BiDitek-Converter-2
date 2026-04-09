import React, { useState, useMemo } from 'react';
import { ChevronRight, Info, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';

type TabMode = 'BMR' | 'TDEE' | 'Weight Goal' | 'Food Tracker';
type Gender = 'male' | 'female';
type Unit = 'metric' | 'imperial';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
type Goal = 'lose' | 'maintain' | 'gain';
type Formula = 'mifflin' | 'harris' | 'katch';

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
};

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary (little or no exercise)',
  light: 'Lightly Active (light exercise 1–3 days/week)',
  moderate: 'Moderately Active (moderate exercise 3–5 days/week)',
  very: 'Very Active (hard exercise 6–7 days/week)',
  extra: 'Extra Active (very hard exercise, physical job)',
};

export default function CalorieCalculator() {
  const [activeTab, setActiveTab] = useState<TabMode>('BMR');
  
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
  
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('sedentary');
  const [goal, setGoal] = useState<Goal>('maintain');
  const [formula, setFormula] = useState<Formula>('mifflin');
  const [bodyFat, setBodyFat] = useState<number | ''>('');

  // Food Tracker State
  const [foods, setFoods] = useState<FoodEntry[]>([]);
  const [foodInput, setFoodInput] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });

  const [hasCalculated, setHasCalculated] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Derived Values
  const currentHeightCm = useMemo(() => {
    if (unit === 'metric') return Number(heightCm) || 0;
    return (Number(heightFt) * 30.48) + (Number(heightIn) * 2.54);
  }, [unit, heightCm, heightFt, heightIn]);

  const currentWeightKg = useMemo(() => {
    if (unit === 'metric') return Number(weightKg) || 0;
    return Number(weightLbs) * 0.453592;
  }, [unit, weightKg, weightLbs]);

  const validate = () => {
    const newErrors: string[] = [];
    if (!age || age < 15 || age > 80) newErrors.push('Age must be between 15 and 80.');
    if (unit === 'metric' && (!heightCm || heightCm <= 0)) newErrors.push('Please enter a valid height.');
    if (unit === 'imperial' && (!heightFt || heightFt <= 0)) newErrors.push('Please enter a valid height.');
    if (unit === 'metric' && (!weightKg || weightKg <= 0)) newErrors.push('Please enter a valid weight.');
    if (unit === 'imperial' && (!weightLbs || weightLbs <= 0)) newErrors.push('Please enter a valid weight.');
    if (formula === 'katch' && (!bodyFat || bodyFat < 3 || bodyFat > 60)) newErrors.push('Body fat must be between 3% and 60% for Katch-McArdle.');
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleCalculate = () => {
    if (validate()) {
      setHasCalculated(true);
    } else {
      setHasCalculated(false);
    }
  };

  // Calculations
  const bmr = useMemo(() => {
    if (!hasCalculated) return 0;
    
    let result = 0;
    if (formula === 'mifflin') {
      result = (10 * currentWeightKg) + (6.25 * currentHeightCm) - (5 * Number(age));
      result += gender === 'male' ? 5 : -161;
    } else if (formula === 'harris') {
      if (gender === 'male') {
        result = 88.362 + (13.397 * currentWeightKg) + (4.799 * currentHeightCm) - (5.677 * Number(age));
      } else {
        result = 447.593 + (9.247 * currentWeightKg) + (3.098 * currentHeightCm) - (4.330 * Number(age));
      }
    } else if (formula === 'katch') {
      const leanBodyMass = currentWeightKg * (1 - Number(bodyFat) / 100);
      result = 370 + (21.6 * leanBodyMass);
    }
    return Math.round(result);
  }, [hasCalculated, formula, currentWeightKg, currentHeightCm, age, gender, bodyFat]);

  const tdee = useMemo(() => Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]), [bmr, activityLevel]);

  const targetCalories = useMemo(() => {
    if (goal === 'lose') return tdee - 500;
    if (goal === 'gain') return tdee + 500;
    return tdee;
  }, [tdee, goal]);

  const macros = useMemo(() => {
    return {
      protein: Math.round((targetCalories * 0.3) / 4),
      carbs: Math.round((targetCalories * 0.4) / 4),
      fat: Math.round((targetCalories * 0.3) / 9),
    };
  }, [targetCalories]);

  // Food Tracker Handlers
  const handleAddFood = () => {
    if (!foodInput.name || !foodInput.calories) return;
    setFoods([...foods, {
      id: Math.random().toString(36).substr(2, 9),
      name: foodInput.name,
      calories: Number(foodInput.calories) || 0,
      protein: Number(foodInput.protein) || 0,
      carbs: Number(foodInput.carbs) || 0,
      fat: Number(foodInput.fat) || 0,
    }]);
    setFoodInput({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  };

  const foodTotals = useMemo(() => {
    return foods.reduce((acc, food) => ({
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [foods]);

  return (
    <div className="px-6 lg:px-16 py-12 lg:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-3 text-[10px] font-label font-black uppercase tracking-[0.2em] text-primary/30 mb-12">
        <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/calculators" className="hover:text-secondary transition-colors">Calculators</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-secondary font-black">Calorie Calculator</span>
      </nav>

      <div className="mb-12">
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter text-primary leading-[1.1]">Calorie Calculator</h1>
        <p className="text-primary/50 mt-6 max-w-2xl font-body text-lg leading-relaxed">
          Calculate your BMR, TDEE, and daily calorie goals, or track your meals all in one place.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-12 bg-surface-container-low p-2 rounded-[1px] border border-outline-variant/30 inline-flex">
        {(['BMR', 'TDEE', 'Weight Goal', 'Food Tracker'] as TabMode[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setHasCalculated(false);
            }}
            className={cn(
              "px-6 py-3 rounded-[1px] font-headline font-bold text-sm transition-all",
              activeTab === tab ? "bg-secondary text-white shadow-md" : "text-primary/60 hover:text-primary hover:bg-surface-container"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        {/* Input Section */}
        {activeTab !== 'Food Tracker' && (
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
                  onClick={() => setUnit('metric')}
                  className={cn("px-4 py-1.5 rounded-[1px] transition-all", unit === 'metric' ? "bg-surface-container-low text-primary shadow-sm" : "text-primary/40")}
                >METRIC</button>
                <button 
                  onClick={() => setUnit('imperial')}
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

            {/* Formula */}
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Formula</label>
              <select 
                value={formula}
                onChange={(e) => setFormula(e.target.value as Formula)}
                className="w-full bg-surface-container border-none py-4 px-6 text-sm font-headline font-bold focus:ring-2 ring-secondary/20 text-primary rounded-[1px] appearance-none"
              >
                <option value="mifflin">Mifflin-St Jeor (Default, Most Accurate)</option>
                <option value="harris">Harris-Benedict (Classic)</option>
                <option value="katch">Katch-McArdle (Requires Body Fat %)</option>
              </select>
            </div>

            {/* Body Fat (Conditional) */}
            {formula === 'katch' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
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

            {/* Activity Level (TDEE & Weight Goal) */}
            {(activeTab === 'TDEE' || activeTab === 'Weight Goal') && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
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
              </motion.div>
            )}

            {/* Weight Goal (Weight Goal Tab Only) */}
            {activeTab === 'Weight Goal' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Weight Goal</label>
                <div className="flex gap-2">
                  {(['lose', 'maintain', 'gain'] as Goal[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      className={cn(
                        "flex-1 py-4 rounded-[1px] font-headline font-bold text-sm transition-all capitalize",
                        goal === g ? "bg-secondary text-white shadow-md" : "bg-surface-container text-primary/40 hover:text-primary"
                      )}
                    >
                      {g} Weight
                    </button>
                  ))}
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
        )}

        {/* Results Section */}
        {activeTab !== 'Food Tracker' && (
          <div className="xl:col-span-5 space-y-8">
            <AnimatePresence mode="wait">
              {hasCalculated ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm"
                >
                  <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 mb-8 text-center">Results</p>
                  
                  {activeTab === 'BMR' && (
                    <div className="text-center space-y-8">
                      <div>
                        <p className="text-sm font-bold text-primary/50 mb-2">Basal Metabolic Rate</p>
                        <h2 className="font-headline text-6xl font-extrabold text-primary tracking-tighter">
                          {bmr.toLocaleString()} <span className="text-2xl text-primary/40">kcal/day</span>
                        </h2>
                      </div>
                      <div className="bg-surface-container p-6 rounded-[1px]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">Formula Used</p>
                        <p className="font-headline font-bold text-primary capitalize">{formula === 'mifflin' ? 'Mifflin-St Jeor' : formula === 'harris' ? 'Harris-Benedict' : 'Katch-McArdle'}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'TDEE' && (
                    <div className="space-y-8">
                      <div className="text-center">
                        <p className="text-sm font-bold text-primary/50 mb-2">TDEE (Maintenance Calories)</p>
                        <h2 className="font-headline text-6xl font-extrabold text-secondary tracking-tighter">
                          {tdee.toLocaleString()} <span className="text-2xl text-secondary/50">kcal/day</span>
                        </h2>
                      </div>
                      <div className="flex justify-between items-center bg-surface-container p-6 rounded-[1px]">
                        <span className="text-sm font-bold text-primary/60">BMR</span>
                        <span className="font-headline font-bold text-lg">{bmr.toLocaleString()} kcal</span>
                      </div>
                      
                      <div className="mt-8">
                        <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 mb-4">Activity Breakdown</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                          {(Object.entries(ACTIVITY_MULTIPLIERS) as [ActivityLevel, number][]).map(([level, mult]) => (
                            <div key={level} className={cn(
                              "flex flex-col items-center justify-center p-4 rounded-[1px] text-center border",
                              activityLevel === level ? "bg-secondary/10 text-secondary border-secondary/30 shadow-sm" : "bg-surface-container text-primary/70 border-transparent"
                            )}>
                              <span className="text-[10px] font-black uppercase tracking-widest mb-2 capitalize">{level.replace('-', ' ')}</span>
                              <span className="font-headline font-bold text-lg">{Math.round(bmr * mult).toLocaleString()}</span>
                              <span className="text-xs opacity-60">kcal</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'Weight Goal' && (
                    <div className="space-y-8">
                      <div className="text-center">
                        <p className="text-sm font-bold text-primary/50 mb-2">Daily Calorie Target</p>
                        <h2 className="font-headline text-6xl font-extrabold text-secondary tracking-tighter">
                          {targetCalories.toLocaleString()} <span className="text-2xl text-secondary/50">kcal/day</span>
                        </h2>
                        <p className="text-sm font-medium text-primary/60 mt-4">
                          Estimated Change: <strong className="text-primary">{goal === 'lose' ? '-0.5 kg (-1 lb)' : goal === 'gain' ? '+0.5 kg (+1 lb)' : '0 kg (0 lbs)'} / week</strong>
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface-container p-4 rounded-[1px] text-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">BMR</p>
                          <p className="font-headline font-bold">{bmr.toLocaleString()} kcal</p>
                        </div>
                        <div className="bg-surface-container p-4 rounded-[1px] text-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-1">TDEE</p>
                          <p className="font-headline font-bold">{tdee.toLocaleString()} kcal</p>
                        </div>
                      </div>

                      <div className="mt-8">
                        <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 mb-4">Macronutrient Breakdown</p>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-[1px] text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Protein (30%)</p>
                            <p className="font-headline font-bold text-blue-700 text-xl">{macros.protein}g</p>
                          </div>
                          <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-[1px] text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-1">Carbs (40%)</p>
                            <p className="font-headline font-bold text-green-700 text-xl">{macros.carbs}g</p>
                          </div>
                          <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-[1px] text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-yellow-600 mb-1">Fat (30%)</p>
                            <p className="font-headline font-bold text-yellow-700 text-xl">{macros.fat}g</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

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
        )}

        {/* Food Tracker Tab */}
        {activeTab === 'Food Tracker' && (
          <div className="xl:col-span-12 bg-surface-container-low rounded-[1px] p-8 lg:p-12 border border-outline-variant/30 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-headline text-2xl font-bold text-primary">Daily Food Log</h2>
              {foods.length > 0 && (
                <button 
                  onClick={() => setFoods([])}
                  className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Add Food Row */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8 bg-surface-container p-4 rounded-[1px]">
              <div className="md:col-span-2">
                <input 
                  type="text" 
                  placeholder="Food Name" 
                  value={foodInput.name}
                  onChange={(e) => setFoodInput({...foodInput, name: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 px-4 py-3 rounded-[1px] text-sm focus:ring-2 ring-secondary/20 outline-none"
                />
              </div>
              <div>
                <input 
                  type="number" 
                  placeholder="Calories" 
                  value={foodInput.calories}
                  onChange={(e) => setFoodInput({...foodInput, calories: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 px-4 py-3 rounded-[1px] text-sm focus:ring-2 ring-secondary/20 outline-none"
                />
              </div>
              <div>
                <input 
                  type="number" 
                  placeholder="Protein (g)" 
                  value={foodInput.protein}
                  onChange={(e) => setFoodInput({...foodInput, protein: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 px-4 py-3 rounded-[1px] text-sm focus:ring-2 ring-secondary/20 outline-none"
                />
              </div>
              <div>
                <input 
                  type="number" 
                  placeholder="Carbs (g)" 
                  value={foodInput.carbs}
                  onChange={(e) => setFoodInput({...foodInput, carbs: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 px-4 py-3 rounded-[1px] text-sm focus:ring-2 ring-secondary/20 outline-none"
                />
              </div>
              <div>
                <input 
                  type="number" 
                  placeholder="Fat (g)" 
                  value={foodInput.fat}
                  onChange={(e) => setFoodInput({...foodInput, fat: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/50 px-4 py-3 rounded-[1px] text-sm focus:ring-2 ring-secondary/20 outline-none"
                />
              </div>
              <div className="md:col-span-6 flex justify-end mt-2">
                <button 
                  onClick={handleAddFood}
                  disabled={!foodInput.name || !foodInput.calories}
                  className="flex items-center gap-2 bg-secondary text-white px-6 py-2.5 rounded-[1px] font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Food
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/50">
                    <th className="py-4 px-4 font-label text-[10px] font-black uppercase tracking-widest text-primary/40">Food</th>
                    <th className="py-4 px-4 font-label text-[10px] font-black uppercase tracking-widest text-primary/40 text-right">Calories</th>
                    <th className="py-4 px-4 font-label text-[10px] font-black uppercase tracking-widest text-primary/40 text-right">Protein</th>
                    <th className="py-4 px-4 font-label text-[10px] font-black uppercase tracking-widest text-primary/40 text-right">Carbs</th>
                    <th className="py-4 px-4 font-label text-[10px] font-black uppercase tracking-widest text-primary/40 text-right">Fat</th>
                    <th className="py-4 px-4 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {foods.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-primary/40 text-sm font-medium">
                        No foods logged yet. Add your first meal above.
                      </td>
                    </tr>
                  ) : (
                    foods.map((food) => (
                      <tr key={food.id} className="border-b border-outline-variant/20 hover:bg-surface-container/50 transition-colors">
                        <td className="py-4 px-4 font-medium text-primary">{food.name}</td>
                        <td className="py-4 px-4 text-right font-bold text-primary">{food.calories}</td>
                        <td className="py-4 px-4 text-right text-primary/70">{food.protein}g</td>
                        <td className="py-4 px-4 text-right text-primary/70">{food.carbs}g</td>
                        <td className="py-4 px-4 text-right text-primary/70">{food.fat}g</td>
                        <td className="py-4 px-4 text-right">
                          <button 
                            onClick={() => setFoods(foods.filter(f => f.id !== food.id))}
                            className="text-red-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {foods.length > 0 && (
                  <tfoot>
                    <tr className="bg-surface-container font-bold text-primary">
                      <td className="py-4 px-4">Daily Totals</td>
                      <td className="py-4 px-4 text-right text-secondary">{foodTotals.calories}</td>
                      <td className="py-4 px-4 text-right">{foodTotals.protein}g</td>
                      <td className="py-4 px-4 text-right">{foodTotals.carbs}g</td>
                      <td className="py-4 px-4 text-right">{foodTotals.fat}g</td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
