import React, { useState } from 'react';
import { UnitSystem, BagSize, PriceMode, calculateConcreteBase, toFt, inToFt, ConcreteResult, BAG_YIELDS_CU_FT } from './concreteCalculatorUtils';

export default function StairsMode() {
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  
  const [steps, setSteps] = useState('');
  const [rise, setRise] = useState('');
  const [run, setRun] = useState('');
  const [width, setWidth] = useState('');
  
  const [enableLanding, setEnableLanding] = useState(false);
  const [landingLength, setLandingLength] = useState('');
  const [landingWidth, setLandingWidth] = useState('');
  const [landingThickness, setLandingThickness] = useState('');
  
  const [overage, setOverage] = useState('10');
  const [bagSize, setBagSize] = useState<BagSize>('80lb');
  const [priceMode, setPriceMode] = useState<PriceMode>('yard');
  const [price, setPrice] = useState('');

  const [result, setResult] = useState<ConcreteResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clear = () => {
    setSteps(''); setRise(''); setRun(''); setWidth('');
    setEnableLanding(false); setLandingLength(''); setLandingWidth(''); setLandingThickness('');
    setOverage('10'); setBagSize('80lb'); setPriceMode('yard'); setPrice('');
    setResult(null); setError(null);
  };

  const calculate = () => {
    const isMetric = unit === 'metric';
    
    const s = Number(steps);
    const r = Number(rise);
    const rn = Number(run);
    const w = Number(width);
    
    if (s <= 0 || !Number.isInteger(s) || r <= 0 || rn <= 0 || w <= 0) {
      setError('Steps must be a positive integer. Dimensions must be > 0.');
      return;
    }

    const rFt = inToFt(r, isMetric);
    const rnFt = inToFt(rn, isMetric);
    const wFt = toFt(w, isMetric);

    // Volume of stairs = 0.5 * rise * run * width * number of steps
    const stairsVolumeCuFt = 0.5 * rFt * rnFt * wFt * s;
    let landingVolumeCuFt = 0;

    if (enableLanding) {
      const ll = Number(landingLength);
      const lw = Number(landingWidth);
      const lt = Number(landingThickness);
      
      if (ll <= 0 || lw <= 0 || lt <= 0) {
        setError('Landing dimensions must be > 0.');
        return;
      }
      
      landingVolumeCuFt = toFt(ll, isMetric) * toFt(lw, isMetric) * inToFt(lt, isMetric);
    }

    const totalVolumeCuFt = stairsVolumeCuFt + landingVolumeCuFt;

    const ov = Number(overage);
    if (ov < 0 || ov > 100) {
      setError('Overage must be between 0 and 100.');
      return;
    }

    const p = Number(price);
    if (p < 0) {
      setError('Price cannot be negative.');
      return;
    }

    setError(null);
    const baseResult = calculateConcreteBase(totalVolumeCuFt, ov, bagSize, p, priceMode);
    
    baseResult.stairsVolumeCuFt = stairsVolumeCuFt;
    baseResult.landingVolumeCuFt = landingVolumeCuFt;
    baseResult.totalRiseIn = r * s;
    baseResult.totalRunIn = rn * s;

    setResult(baseResult);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
      <div className="xl:col-span-7 bg-surface-container-low rounded-[1px] p-10 lg:p-16 space-y-12 border border-outline-variant/30">
        
        {/* Settings Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 md:col-span-2">
            <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Unit System</label>
            <div className="flex bg-surface-container rounded-[1px] p-1 border border-outline-variant/30">
              <button onClick={() => setUnit('imperial')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${unit === 'imperial' ? 'bg-secondary text-white shadow-md' : 'text-primary/50 hover:text-primary'}`}>Imperial</button>
              <button onClick={() => setUnit('metric')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${unit === 'metric' ? 'bg-secondary text-white shadow-md' : 'text-primary/50 hover:text-primary'}`}>Metric</button>
            </div>
          </div>
        </div>

        {/* Dimensions */}
        <div className="space-y-6">
          <h3 className="font-headline text-xl font-bold text-primary">Stairs Dimensions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Number of Steps</label>
              <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                <input type="number" min="1" value={steps} onChange={e => setSteps(e.target.value)} placeholder="1" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
              </div>
            </div>
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Stair Width ({unit === 'imperial' ? 'ft' : 'm'})</label>
              <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                <input type="number" min="0" value={width} onChange={e => setWidth(e.target.value)} placeholder="0" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
              </div>
            </div>
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Rise per Step ({unit === 'imperial' ? 'in' : 'cm'})</label>
              <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                <input type="number" min="0" value={rise} onChange={e => setRise(e.target.value)} placeholder="0" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
              </div>
            </div>
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Run per Step ({unit === 'imperial' ? 'in' : 'cm'})</label>
              <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                <input type="number" min="0" value={run} onChange={e => setRun(e.target.value)} placeholder="0" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Landing Settings */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-xl font-bold text-primary">Platform / Landing</h3>
            <button 
              onClick={() => setEnableLanding(!enableLanding)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-[1px] transition-all ${enableLanding ? 'bg-secondary text-white' : 'bg-surface-container text-primary/50 hover:text-primary'}`}
            >
              {enableLanding ? 'Enabled' : 'Disabled'}
            </button>
          </div>
          {enableLanding && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-surface-container/50 border border-outline-variant/30 rounded-[1px]">
              <div className="space-y-4">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Length ({unit === 'imperial' ? 'ft' : 'm'})</label>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                  <input type="number" min="0" value={landingLength} onChange={e => setLandingLength(e.target.value)} placeholder="0" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Width ({unit === 'imperial' ? 'ft' : 'm'})</label>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                  <input type="number" min="0" value={landingWidth} onChange={e => setLandingWidth(e.target.value)} placeholder="0" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Thickness ({unit === 'imperial' ? 'in' : 'cm'})</label>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                  <input type="number" min="0" value={landingThickness} onChange={e => setLandingThickness(e.target.value)} placeholder="0" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Estimation Settings */}
        <div className="space-y-6">
          <h3 className="font-headline text-xl font-bold text-primary">Estimation Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Wastage / Overage (%)</label>
              <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                <input type="number" min="0" max="100" value={overage} onChange={e => setOverage(e.target.value)} placeholder="10" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
              </div>
            </div>
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Bag Size</label>
              <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                <select value={bagSize} onChange={e => setBagSize(e.target.value as BagSize)} className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary">
                  <option value="40lb">40 lb ({BAG_YIELDS_CU_FT['40lb']} cu ft)</option>
                  <option value="60lb">60 lb ({BAG_YIELDS_CU_FT['60lb']} cu ft)</option>
                  <option value="80lb">80 lb ({BAG_YIELDS_CU_FT['80lb']} cu ft)</option>
                </select>
              </div>
            </div>
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center justify-between pl-4 mb-2">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30">Price</label>
                <div className="flex gap-2 text-xs font-bold uppercase tracking-wider text-primary/50">
                  <button onClick={() => setPriceMode('yard')} className={priceMode === 'yard' ? 'text-secondary' : 'hover:text-primary'}>Per Cu Yd</button>
                  <span>|</span>
                  <button onClick={() => setPriceMode('bag')} className={priceMode === 'bag' ? 'text-secondary' : 'hover:text-primary'}>Per Bag</button>
                </div>
              </div>
              <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                <span className="text-primary/50 font-headline font-bold text-xl mr-2">$</span>
                <input type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {error && <div className="p-4 bg-red-500/10 text-red-600 rounded-[1px] font-bold border border-red-500/20">{error}</div>}

        <div className="flex gap-4">
          <button onClick={calculate} className="flex-1 bg-secondary text-white py-6 rounded-[1px] font-headline font-bold text-xl hover:opacity-90 transition-all shadow-xl shadow-secondary/10">
            CALCULATE
          </button>
          <button onClick={clear} className="px-8 bg-surface-container text-primary py-6 rounded-[1px] font-headline font-bold text-xl hover:bg-outline-variant/20 transition-all">
            CLEAR
          </button>
        </div>
      </div>

      {/* Result Card */}
      <div className="xl:col-span-5 space-y-8">
        <div className="bg-surface-container-low rounded-[1px] p-10 lg:p-12 border border-outline-variant/30 shadow-sm">
          <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 mb-8 text-center">Results</p>
          
          {result ? (
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-2">Volume Needed (With Overage)</p>
                <h2 className="font-headline text-5xl lg:text-6xl font-extrabold text-primary tracking-tighter">
                  {result.overageVolumeCuYd.toFixed(2)} <span className="text-2xl text-primary/50">yd³</span>
                </h2>
                <p className="text-sm font-bold text-primary/50 mt-2">Exact: {result.exactVolumeCuYd.toFixed(2)} yd³</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container p-6 rounded-[1px] text-center border border-outline-variant/30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-2">Cubic Feet</p>
                  <p className="font-headline font-bold text-2xl text-primary">{result.overageVolumeCuFt.toFixed(2)}</p>
                  <p className="text-xs font-bold text-primary/40 mt-1">Exact: {result.exactVolumeCuFt.toFixed(2)}</p>
                </div>
                <div className="bg-surface-container p-6 rounded-[1px] text-center border border-outline-variant/30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-2">Cubic Meters</p>
                  <p className="font-headline font-bold text-2xl text-primary">{result.overageVolumeCuM.toFixed(2)}</p>
                  <p className="text-xs font-bold text-primary/40 mt-1">Exact: {result.exactVolumeCuM.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-secondary/5 p-8 rounded-[1px] border border-secondary/20 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">Bags Needed ({bagSize})</p>
                <p className="font-headline font-extrabold text-4xl text-secondary">{result.overageBags}</p>
                <p className="text-xs font-bold text-secondary/60 mt-2">Exact: {result.exactBags} bags</p>
              </div>

              {price !== '' && Number(price) > 0 && (
                <div className="bg-surface-container p-8 rounded-[1px] border border-outline-variant/30 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-2">Estimated Cost</p>
                  <p className="font-headline font-extrabold text-4xl text-primary">${result.overageCost.toFixed(2)}</p>
                  <p className="text-xs font-bold text-primary/40 mt-2">Exact: ${result.exactCost.toFixed(2)}</p>
                </div>
              )}

              <div className="bg-surface-container p-8 rounded-[1px] border border-outline-variant/30 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/50 text-center">Breakdown</p>
                <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2">
                  <span className="text-sm font-bold text-primary/70">Stairs Volume</span>
                  <span className="font-headline font-bold text-primary">{result.stairsVolumeCuFt?.toFixed(2)} ft³</span>
                </div>
                {enableLanding && (
                  <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2">
                    <span className="text-sm font-bold text-primary/70">Landing Volume</span>
                    <span className="font-headline font-bold text-primary">{result.landingVolumeCuFt?.toFixed(2)} ft³</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-bold text-primary/70">Total Rise</span>
                  <span className="font-headline font-bold text-primary">{result.totalRiseIn?.toFixed(1)} {unit === 'imperial' ? 'in' : 'cm'}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-bold text-primary/70">Total Run</span>
                  <span className="font-headline font-bold text-primary">{result.totalRunIn?.toFixed(1)} {unit === 'imperial' ? 'in' : 'cm'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-primary/30 font-headline text-xl font-bold">Enter dimensions to calculate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
