import React, { useState, useEffect } from 'react';
import { ChevronRight, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';

type CalcMode = 'pace' | 'time' | 'distance';
type ActivityType = 'running' | 'walking' | 'cycling' | 'swimming';
type Unit = 'metric' | 'imperial';

const PRESET_DISTANCES = [
  { label: '5K', km: 5, miles: 3.10686 },
  { label: '10K', km: 10, miles: 6.21371 },
  { label: 'Half Marathon', km: 21.097, miles: 13.1094 },
  { label: 'Marathon', km: 42.195, miles: 26.2188 },
  { label: 'Custom', km: 0, miles: 0 }
];

export default function PaceCalculator() {
  const [mode, setMode] = useState<CalcMode>('pace');
  
  // Shared
  const [activity, setActivity] = useState<ActivityType>('running');
  const [unit, setUnit] = useState<Unit>('metric');
  const [weightKg, setWeightKg] = useState<number | ''>('');
  const [weightLbs, setWeightLbs] = useState<number | ''>('');

  // Distance
  const [distance, setDistance] = useState<number | ''>('');
  const [presetDistance, setPresetDistance] = useState<string>('Custom');

  // Time
  const [timeH, setTimeH] = useState<number | ''>('');
  const [timeM, setTimeM] = useState<number | ''>('');
  const [timeS, setTimeS] = useState<number | ''>('');

  // Pace
  const [paceM, setPaceM] = useState<number | ''>('');
  const [paceS, setPaceS] = useState<number | ''>('');

  // Results
  const [hasCalculated, setHasCalculated] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [showSplits, setShowSplits] = useState(false);

  // Computed Results
  const [resultPaceSecPerKm, setResultPaceSecPerKm] = useState(0);
  const [resultTotalSec, setResultTotalSec] = useState(0);
  const [resultDistanceKm, setResultDistanceKm] = useState(0);

  const handleUnitToggle = (newUnit: Unit) => {
    if (newUnit === unit) return;
    
    if (newUnit === 'imperial') {
      setWeightLbs(weightKg ? +(Number(weightKg) * 2.20462).toFixed(1) : '');
      setDistance(distance ? +(Number(distance) / 1.60934).toFixed(3) : '');
      if (paceM !== '' || paceS !== '') {
        const paceSecPerKm = (Number(paceM) * 60) + Number(paceS);
        const paceSecPerMile = paceSecPerKm * 1.60934;
        setPaceM(Math.floor(paceSecPerMile / 60));
        setPaceS(Math.round(paceSecPerMile % 60));
      }
    } else {
      setWeightKg(weightLbs ? +(Number(weightLbs) / 2.20462).toFixed(1) : '');
      setDistance(distance ? +(Number(distance) * 1.60934).toFixed(3) : '');
      if (paceM !== '' || paceS !== '') {
        const paceSecPerMile = (Number(paceM) * 60) + Number(paceS);
        const paceSecPerKm = paceSecPerMile / 1.60934;
        setPaceM(Math.floor(paceSecPerKm / 60));
        setPaceS(Math.round(paceSecPerKm % 60));
      }
    }
    setUnit(newUnit);
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setPresetDistance(val);
    if (val !== 'Custom') {
      const preset = PRESET_DISTANCES.find(p => p.label === val);
      if (preset) {
        setDistance(unit === 'metric' ? preset.km : preset.miles);
      }
    } else {
      setDistance('');
    }
  };

  // Auto-switch preset to Custom if distance is manually edited
  useEffect(() => {
    if (distance !== '') {
      const isPreset = PRESET_DISTANCES.some(p => {
        const target = unit === 'metric' ? p.km : p.miles;
        return Math.abs(target - Number(distance)) < 0.001;
      });
      if (!isPreset) {
        setPresetDistance('Custom');
      }
    }
  }, [distance, unit]);

  const validate = () => {
    const errs: string[] = [];
    
    const d = Number(distance);
    const th = Number(timeH);
    const tm = Number(timeM);
    const ts = Number(timeS);
    const pm = Number(paceM);
    const ps = Number(paceS);

    const totalTimeSec = (th * 3600) + (tm * 60) + ts;
    const totalPaceSec = (pm * 60) + ps;

    if (mode === 'pace') {
      if (!d || d <= 0) errs.push("Please enter a valid distance.");
      if (totalTimeSec <= 0) errs.push("Please enter a valid time.");
    } else if (mode === 'time') {
      if (!d || d <= 0) errs.push("Please enter a valid distance.");
      if (totalPaceSec <= 0) errs.push("Please enter a valid pace.");
    } else if (mode === 'distance') {
      if (totalTimeSec <= 0) errs.push("Please enter a valid time.");
      if (totalPaceSec <= 0) errs.push("Please enter a valid pace.");
    }

    setErrors(errs);
    return errs.length === 0;
  };

  const handleCalculate = () => {
    if (validate()) {
      const d = Number(distance);
      const th = Number(timeH);
      const tm = Number(timeM);
      const ts = Number(timeS);
      const pm = Number(paceM);
      const ps = Number(paceS);

      let distKm = 0;
      let totalSec = 0;
      let paceSecPerKm = 0;

      if (mode === 'pace') {
        totalSec = (th * 3600) + (tm * 60) + ts;
        distKm = unit === 'metric' ? d : d * 1.60934;
        paceSecPerKm = totalSec / distKm;
      } else if (mode === 'time') {
        distKm = unit === 'metric' ? d : d * 1.60934;
        const paceSec = (pm * 60) + ps;
        paceSecPerKm = unit === 'metric' ? paceSec : paceSec / 1.60934;
        totalSec = paceSecPerKm * distKm;
      } else if (mode === 'distance') {
        totalSec = (th * 3600) + (tm * 60) + ts;
        const paceSec = (pm * 60) + ps;
        paceSecPerKm = unit === 'metric' ? paceSec : paceSec / 1.60934;
        distKm = totalSec / paceSecPerKm;
      }

      setResultDistanceKm(distKm);
      setResultTotalSec(totalSec);
      setResultPaceSecPerKm(paceSecPerKm);
      setHasCalculated(true);
      setShowSplits(false);
    } else {
      setHasCalculated(false);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.round(totalSeconds % 60);
    if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  };

  const formatPace = (secPerUnit: number) => {
    const m = Math.floor(secPerUnit / 60);
    const s = Math.round(secPerUnit % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatTimeColons = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.round(totalSeconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getMET = () => {
    if (activity === 'walking') return 3.5;
    if (activity === 'cycling') return 8.0;
    if (activity === 'swimming') return 8.3;
    
    // Running
    const paceMinPerKm = resultPaceSecPerKm / 60;
    if (paceMinPerKm < 4.0) return 16.0;
    if (paceMinPerKm <= 5.0) return 12.8;
    if (paceMinPerKm <= 6.0) return 11.0;
    if (paceMinPerKm <= 7.0) return 9.8;
    return 8.0;
  };

  const paceSecPerMile = resultPaceSecPerKm * 1.60934;
  const speedKmh = resultPaceSecPerKm > 0 ? 3600 / resultPaceSecPerKm : 0;
  const speedMph = paceSecPerMile > 0 ? 3600 / paceSecPerMile : 0;

  const wKg = unit === 'metric' ? Number(weightKg) : Number(weightLbs) / 2.20462;
  const calories = wKg > 0 ? getMET() * wKg * (resultTotalSec / 3600) : 0;

  const renderSplits = () => {
    const splits = [];
    const totalDist = unit === 'metric' ? resultDistanceKm : resultDistanceKm / 1.60934;
    const paceSec = unit === 'metric' ? resultPaceSecPerKm : paceSecPerMile;
    
    const step = totalDist > 50 ? 2 : 1;
    const maxRows = 50;
    
    for (let i = step; i <= totalDist; i += step) {
      if (splits.length >= maxRows) break;
      splits.push({
        dist: i,
        time: i * paceSec
      });
    }
    
    // Add final split if not exactly on a whole number
    if (totalDist % step !== 0 && splits.length < maxRows) {
      splits.push({
        dist: totalDist,
        time: resultTotalSec
      });
    }

    return (
      <div className="overflow-hidden rounded-[1px] border border-outline-variant/30">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container font-label text-[10px] font-black uppercase tracking-widest text-primary/40">
            <tr>
              <th className="p-4">Split</th>
              <th className="p-4 text-right">Cumulative Time</th>
            </tr>
          </thead>
          <tbody>
            {splits.map((s, idx) => (
              <tr key={idx} className="border-t border-outline-variant/20">
                <td className="p-4 text-primary">{s.dist.toFixed(2)} {unit === 'metric' ? 'km' : 'mi'}</td>
                <td className="p-4 text-right text-primary font-mono">{formatTimeColons(s.time)}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
        <span className="text-secondary font-black">Pace Calculator</span>
      </nav>

      <div className="mb-12">
        <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tighter text-primary leading-[1.1]">Pace Calculator</h1>
        <p className="text-primary/50 mt-6 max-w-2xl font-body text-lg leading-relaxed">
          Calculate your pace, time, or distance for running, walking, cycling, or swimming. See split times and calorie estimates.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-12 bg-surface-container-low p-2 rounded-[1px] border border-outline-variant/30 inline-flex">
        {[
          { id: 'pace', label: 'Calculate Pace' },
          { id: 'time', label: 'Calculate Time' },
          { id: 'distance', label: 'Calculate Distance' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setMode(t.id as CalcMode);
              setHasCalculated(false);
            }}
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

          {/* Activity & Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Activity Type</label>
              <select 
                value={activity}
                onChange={(e) => setActivity(e.target.value as ActivityType)}
                className="w-full bg-surface-container border-none py-4 px-6 text-sm font-headline font-bold focus:ring-2 ring-secondary/20 text-primary rounded-[1px] appearance-none"
              >
                <option value="running">🏃 Running</option>
                <option value="walking">🚶 Walking</option>
                <option value="cycling">🚴 Cycling</option>
                <option value="swimming">🏊 Swimming</option>
              </select>
            </div>
            
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Unit System</label>
              <div className="flex bg-surface-container rounded-[1px] p-1 text-[10px] font-black h-[52px]">
                <button 
                  onClick={() => handleUnitToggle('metric')}
                  className={cn("flex-1 rounded-[1px] transition-all", unit === 'metric' ? "bg-surface-container-low text-primary shadow-sm" : "text-primary/40")}
                >METRIC</button>
                <button 
                  onClick={() => handleUnitToggle('imperial')}
                  className={cn("flex-1 rounded-[1px] transition-all", unit === 'imperial' ? "bg-surface-container-low text-primary shadow-sm" : "text-primary/40")}
                >IMPERIAL</button>
              </div>
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-4">
            <div className="flex justify-between items-end pl-2">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Weight</label>
              <span className="text-[10px] text-primary/30 italic">Optional — needed for calorie estimate only</span>
            </div>
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
                placeholder="Optional"
              />
              <span className="text-primary/30 font-label font-bold text-xs">{unit === 'metric' ? 'KG' : 'LBS'}</span>
            </div>
          </div>

          <hr className="border-outline-variant/20" />

          {/* Distance Input */}
          {(mode === 'pace' || mode === 'time') && (
            <div className="space-y-4">
              <div className="flex justify-between items-end pl-2">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Distance</label>
                <select 
                  value={presetDistance}
                  onChange={handlePresetChange}
                  className="bg-transparent text-[10px] font-bold text-secondary uppercase tracking-widest outline-none cursor-pointer"
                >
                  {PRESET_DISTANCES.map(p => <option key={p.label} value={p.label}>{p.label}</option>)}
                </select>
              </div>
              <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30">
                <input 
                  type="number" 
                  value={distance}
                  onChange={(e) => setDistance(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary"
                />
                <span className="text-primary/30 font-label font-bold text-xs">{unit === 'metric' ? 'KM' : 'MILES'}</span>
              </div>
            </div>
          )}

          {/* Time Input */}
          {(mode === 'pace' || mode === 'distance') && (
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Time</label>
              <div className="flex gap-4">
                <div className="bg-surface-container rounded-[1px] flex items-center px-4 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30 flex-1">
                  <input 
                    type="number" 
                    value={timeH}
                    onChange={(e) => setTimeH(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary text-center"
                    placeholder="00"
                  />
                  <span className="text-primary/30 font-label font-bold text-xs">H</span>
                </div>
                <div className="bg-surface-container rounded-[1px] flex items-center px-4 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30 flex-1">
                  <input 
                    type="number" 
                    value={timeM}
                    onChange={(e) => setTimeM(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary text-center"
                    placeholder="00"
                  />
                  <span className="text-primary/30 font-label font-bold text-xs">M</span>
                </div>
                <div className="bg-surface-container rounded-[1px] flex items-center px-4 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30 flex-1">
                  <input 
                    type="number" 
                    value={timeS}
                    onChange={(e) => setTimeS(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary text-center"
                    placeholder="00"
                  />
                  <span className="text-primary/30 font-label font-bold text-xs">S</span>
                </div>
              </div>
            </div>
          )}

          {/* Pace Input */}
          {(mode === 'time' || mode === 'distance') && (
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 pl-2">Pace (per {unit === 'metric' ? 'km' : 'mile'})</label>
              <div className="flex gap-4">
                <div className="bg-surface-container rounded-[1px] flex items-center px-4 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30 flex-1">
                  <input 
                    type="number" 
                    value={paceM}
                    onChange={(e) => setPaceM(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary text-center"
                    placeholder="00"
                  />
                  <span className="text-primary/30 font-label font-bold text-xs">MIN</span>
                </div>
                <div className="bg-surface-container rounded-[1px] flex items-center px-4 focus-within:ring-2 ring-secondary/20 transition-all border border-transparent focus-within:border-secondary/30 flex-1">
                  <input 
                    type="number" 
                    value={paceS}
                    onChange={(e) => setPaceS(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary text-center"
                    placeholder="00"
                  />
                  <span className="text-primary/30 font-label font-bold text-xs">SEC</span>
                </div>
              </div>
            </div>
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
            {hasCalculated ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Section 1: Primary Result */}
                <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm text-center">
                  <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 mb-4">
                    {mode === 'pace' ? 'Your Pace' : mode === 'time' ? 'Your Time' : 'Your Distance'}
                  </p>
                  <h2 className="font-headline text-5xl md:text-6xl font-extrabold text-primary tracking-tighter mb-4">
                    {mode === 'pace' && (
                      <>
                        {formatPace(unit === 'metric' ? resultPaceSecPerKm : paceSecPerMile)} <span className="text-2xl text-primary/40">min/{unit === 'metric' ? 'km' : 'mi'}</span>
                      </>
                    )}
                    {mode === 'time' && (
                      <>{formatTime(resultTotalSec)}</>
                    )}
                    {mode === 'distance' && (
                      <>
                        {(unit === 'metric' ? resultDistanceKm : resultDistanceKm / 1.60934).toFixed(2)} <span className="text-2xl text-primary/40">{unit === 'metric' ? 'km' : 'miles'}</span>
                      </>
                    )}
                  </h2>
                  {mode === 'pace' && (
                    <p className="text-lg text-primary/60 font-medium">
                      {formatPace(unit === 'metric' ? paceSecPerMile : resultPaceSecPerKm)} min/{unit === 'metric' ? 'mi' : 'km'}
                    </p>
                  )}
                </div>

                {/* Section 2: Speed Conversions */}
                <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm">
                  <h3 className="font-headline text-xl font-bold mb-6 text-primary">Speed Conversions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-surface-container p-6 rounded-[1px] text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2">Pace (min/km)</p>
                      <p className="font-headline font-bold text-xl text-primary">{formatPace(resultPaceSecPerKm)}</p>
                    </div>
                    <div className="bg-surface-container p-6 rounded-[1px] text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2">Pace (min/mi)</p>
                      <p className="font-headline font-bold text-xl text-primary">{formatPace(paceSecPerMile)}</p>
                    </div>
                    <div className="bg-surface-container p-6 rounded-[1px] text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2">Speed (km/h)</p>
                      <p className="font-headline font-bold text-xl text-primary">{speedKmh.toFixed(2)}</p>
                    </div>
                    <div className="bg-surface-container p-6 rounded-[1px] text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2">Speed (mph)</p>
                      <p className="font-headline font-bold text-xl text-primary">{speedMph.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Section 3: Race Finish Time Projections */}
                <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm">
                  <h3 className="font-headline text-xl font-bold mb-6 text-primary">Race Finish Time Projections</h3>
                  <div className="overflow-hidden rounded-[1px] border border-outline-variant/30">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-surface-container font-label text-[10px] font-black uppercase tracking-widest text-primary/40">
                        <tr>
                          <th className="p-4">Race</th>
                          <th className="p-4">Distance</th>
                          <th className="p-4 text-right">Projected Finish Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {PRESET_DISTANCES.filter(p => p.label !== 'Custom').map((p) => {
                          const isSelected = presetDistance === p.label;
                          return (
                            <tr 
                              key={p.label} 
                              className={cn(
                                "border-t border-outline-variant/20 transition-colors",
                                isSelected ? "bg-secondary/10 font-bold" : "bg-transparent"
                              )}
                            >
                              <td className="p-4 text-primary">{p.label}</td>
                              <td className="p-4 text-primary/70">{p.km} km</td>
                              <td className="p-4 text-right text-primary">
                                {formatTime(p.km * resultPaceSecPerKm)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 4: Split Times */}
                <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-headline text-xl font-bold text-primary">Split Times</h3>
                    <button 
                      onClick={() => setShowSplits(!showSplits)}
                      className="flex items-center gap-2 text-xs font-bold text-secondary hover:text-secondary/80 transition-colors"
                    >
                      {showSplits ? 'Hide Splits' : 'Show Splits'}
                      {showSplits ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                  <AnimatePresence>
                    {showSplits && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {renderSplits()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Section 5: Calories Burned Estimate */}
                <div className="bg-surface-container-low rounded-[1px] p-10 border border-outline-variant/30 shadow-sm">
                  <h3 className="font-headline text-xl font-bold mb-6 text-primary">Calories Burned Estimate</h3>
                  {wKg > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-surface-container p-6 rounded-[1px] text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2">Activity</p>
                        <p className="font-headline font-bold text-xl text-primary capitalize">{activity}</p>
                      </div>
                      <div className="bg-surface-container p-6 rounded-[1px] text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/40 mb-2">Duration</p>
                        <p className="font-headline font-bold text-xl text-primary">{formatTime(resultTotalSec)}</p>
                      </div>
                      <div className="bg-secondary/10 p-6 rounded-[1px] text-center border border-secondary/30">
                        <p className="text-[10px] font-black uppercase tracking-widest text-secondary/60 mb-2">Estimated Calories</p>
                        <p className="font-headline font-bold text-2xl text-secondary">{Math.round(calories)} kcal</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-surface-container p-8 rounded-[1px] text-center border border-dashed border-outline-variant/50">
                      <p className="text-primary/60 font-medium">Enter your weight above to see calorie estimate.</p>
                    </div>
                  )}
                  {wKg > 0 && (
                    <p className="text-xs text-primary/40 mt-4 text-center">
                      * MET Value Used: {getMET().toFixed(1)}. Calorie estimates are approximations based on MET values and individual results may vary.
                    </p>
                  )}
                </div>

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
                <p className="text-sm text-primary/30 mt-2">Fill out the fields and click calculate to see your comprehensive pace analysis.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
