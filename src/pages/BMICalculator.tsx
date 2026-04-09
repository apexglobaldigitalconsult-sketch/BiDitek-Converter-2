import React from 'react';
import { ChevronRight, ChevronDown, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';

export default function BMICalculator() {
  const [gender, setGender] = React.useState<'male' | 'female'>('male');
  const [height, setHeight] = React.useState(180);
  const [weight, setWeight] = React.useState(75);
  const [age, setAge] = React.useState(25);
  const [unit, setUnit] = React.useState<'metric' | 'imperial'>('metric');

  const bmi = React.useMemo(() => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  }, [height, weight]);

  const bmiStatus = React.useMemo(() => {
    const val = parseFloat(bmi);
    if (val < 18.5) return { label: 'Underweight', color: 'text-blue-500 bg-blue-500/10', pos: '15%' };
    if (val < 25) return { label: 'Normal Range', color: 'text-green-500 bg-green-500/10', pos: '42%' };
    if (val < 30) return { label: 'Overweight', color: 'text-yellow-500 bg-yellow-500/10', pos: '68%' };
    return { label: 'Obese', color: 'text-red-500 bg-red-500/10', pos: '85%' };
  }, [bmi]);

  return (
    <div className="px-6 lg:px-16 py-12 lg:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-3 text-[10px] font-label font-black uppercase tracking-[0.2em] text-primary/30 mb-12">
        <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/calculators" className="hover:text-secondary transition-colors">Calculators</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-secondary font-black">BMI Calculator</span>
      </nav>

      <div className="mb-16">
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter text-primary leading-[1.1]">BMI Calculator</h1>
        <p className="text-primary/50 mt-6 max-w-2xl font-body text-lg leading-relaxed">
          Calculate your Body Mass Index (BMI) using high-precision metric and imperial inputs for a professional-grade health assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        {/* Input Card */}
        <div className="xl:col-span-7 bg-surface-container-low rounded-[1px] p-10 lg:p-16 space-y-16 border border-outline-variant/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-6">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Gender Identity</label>
              <div className="flex gap-4">
                {['male', 'female'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g as any)}
                    className={cn(
                      "flex-1 py-5 rounded-[1px] font-headline font-bold text-lg transition-all",
                      gender === g ? "bg-secondary text-white shadow-xl shadow-secondary/20" : "bg-surface-container text-primary/30 hover:text-primary"
                    )}
                  >
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Chronological Age</label>
              <div className="bg-surface-container rounded-[1px] flex items-center px-8 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                <input 
                  type="number" 
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-transparent border-none py-5 text-2xl font-headline font-bold focus:ring-0 text-primary"
                />
                <span className="text-primary/20 font-label font-bold text-sm">YRS</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex justify-between items-end px-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30">Vertical Stature</label>
              <div className="flex bg-surface-container-highest rounded-[1px] p-1 text-[10px] font-black">
                <button 
                  onClick={() => setUnit('metric')}
                  className={cn("px-4 py-1.5 rounded-[1px] transition-all", unit === 'metric' ? "bg-surface-container-low text-primary shadow-sm" : "text-primary/30")}
                >CM</button>
                <button 
                  onClick={() => setUnit('imperial')}
                  className={cn("px-4 py-1.5 rounded-[1px] transition-all", unit === 'imperial' ? "bg-surface-container-low text-primary shadow-sm" : "text-primary/30")}
                >FT</button>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-[1px] p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 border border-outline-variant/30 shadow-sm">
              <div className="flex items-baseline gap-4">
                <input 
                  type="number" 
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-32 bg-transparent border-none p-0 text-6xl font-headline font-bold focus:ring-0 text-primary"
                />
                <span className="text-primary/20 font-label font-bold uppercase tracking-widest">{unit === 'metric' ? 'Centimeters' : 'Inches'}</span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="250" 
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="flex-1 h-2 bg-surface-container-highest appearance-none rounded-[1px] accent-secondary cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex justify-between items-end px-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30">Body Mass</label>
              <div className="flex bg-surface-container-highest rounded-[1px] p-1 text-[10px] font-black">
                <button className="px-4 py-1.5 bg-surface-container-low rounded-[1px] shadow-sm text-primary">KG</button>
                <button className="px-4 py-1.5 text-primary/30">LBS</button>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-[1px] p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 border border-outline-variant/30 shadow-sm">
              <div className="flex items-baseline gap-4">
                <input 
                  type="number" 
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-32 bg-transparent border-none p-0 text-6xl font-headline font-bold focus:ring-0 text-primary"
                />
                <span className="text-primary/20 font-label font-bold uppercase tracking-widest">Kilograms</span>
              </div>
              <input 
                type="range" 
                min="30" 
                max="200" 
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="flex-1 h-2 bg-surface-container-highest appearance-none rounded-[1px] accent-secondary cursor-pointer"
              />
            </div>
          </div>

          <button className="w-full bg-secondary text-white py-8 rounded-[1px] font-headline font-bold text-2xl hover:opacity-90 transition-all shadow-xl shadow-secondary/10">
            CALCULATE BMI
          </button>
        </div>

        {/* Result Card */}
        <div className="xl:col-span-5 space-y-8">
          <div className="bg-surface-container-low rounded-[1px] p-12 lg:p-16 border border-outline-variant/30 shadow-sm text-center">
            <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 mb-12">Your Body Mass Index</p>
            <div className="mb-16">
              <motion.h2 
                key={bmi}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-headline text-9xl lg:text-[10rem] font-extrabold text-primary tracking-tighter"
              >
                {bmi}
              </motion.h2>
              <span className={cn("inline-block px-8 py-3 rounded-[1px] font-headline font-bold text-sm uppercase tracking-widest mt-6", bmiStatus.color)}>
                {bmiStatus.label}
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary/20">
                <span>Under</span>
                <span>Normal</span>
                <span>Over</span>
                <span>Obese</span>
              </div>
              <div className="h-4 w-full rounded-[1px] bg-gradient-to-r from-blue-400 via-green-400 to-red-400 relative">
                <motion.div 
                  animate={{ left: bmiStatus.pos }}
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-8 bg-primary rounded-[1px] border-4 border-surface-container-low shadow-lg"
                />
              </div>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-6">
              <div className="bg-surface-container p-8 rounded-[1px]">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mb-2">Ideal Weight</p>
                <p className="font-headline font-bold text-xl">60.0 - 81.0 kg</p>
              </div>
              <div className="bg-surface-container p-8 rounded-[1px]">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 mb-2">Ponderal Index</p>
                <p className="font-headline font-bold text-xl">12.9 kg/m³</p>
              </div>
            </div>
          </div>

          <details className="group bg-surface-container-low border border-outline-variant/30 rounded-[1px] overflow-hidden transition-all">
            <summary className="flex justify-between items-center p-8 cursor-pointer list-none font-headline font-bold text-lg uppercase tracking-tight hover:bg-surface-container transition-colors">
              Technical Formula
              <ChevronDown className="w-6 h-6 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="px-10 pb-10 space-y-8">
              <div className="p-10 bg-surface-container rounded-[1px] text-center border border-outline-variant/10">
                <p className="text-primary/30 italic mb-6 font-body text-xl">BMI = mass (kg) / height² (m²)</p>
                <p className="text-base text-primary/60 leading-relaxed max-w-sm mx-auto font-body">
                  The Body Mass Index was derived by Adolphe Quetelet, a Belgian astronomer, mathematician, statistician, and sociologist. It is a simple calculation using a person's height and weight.
                </p>
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* Thresholds */}
      <section className="mt-32">
        <h3 className="font-headline text-4xl font-extrabold mb-12 tracking-tight">Clinical Thresholds</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Underweight', val: '< 18.5', color: 'border-blue-500' },
            { label: 'Normal', val: '18.5 – 25', color: 'border-green-500' },
            { label: 'Overweight', val: '25 – 30', color: 'border-yellow-500' },
            { label: 'Obese', val: '> 30', color: 'border-red-500' },
          ].map((item) => (
            <div key={item.label} className={cn("p-10 bg-surface-container-low rounded-[1px] border-l-8", item.color)}>
              <p className="font-headline font-bold text-lg mb-4 text-primary/40">{item.label}</p>
              <p className="text-4xl font-headline font-extrabold text-primary">{item.val}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
