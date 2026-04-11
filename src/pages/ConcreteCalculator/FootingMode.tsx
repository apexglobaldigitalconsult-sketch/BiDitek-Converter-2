import React, { useState } from 'react';
import { UnitSystem, BagSize, PriceMode, RebarSize, calculateConcreteBase, toFt, ConcreteResult, BAG_YIELDS_CU_FT, REBAR_WEIGHTS_LB_PER_FT } from './concreteCalculatorUtils';

export default function FootingMode() {
  const [type, setType] = useState<'strip' | 'pad'>('strip');
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  
  // Strip Footing
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('');
  
  // Pad Footing
  const [pads, setPads] = useState('1');
  const [padLength, setPadLength] = useState('');
  const [padWidth, setPadWidth] = useState('');
  const [padDepth, setPadDepth] = useState('');
  
  const [overage, setOverage] = useState('10');
  const [bagSize, setBagSize] = useState<BagSize>('80lb');
  const [priceMode, setPriceMode] = useState<PriceMode>('yard');
  const [price, setPrice] = useState('');

  // Rebar
  const [enableRebar, setEnableRebar] = useState(false);
  const [rebarRuns, setRebarRuns] = useState('2');
  const [rebarSpacing, setRebarSpacing] = useState('12');
  const [rebarSize, setRebarSize] = useState<RebarSize>('#4');

  const [result, setResult] = useState<ConcreteResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clear = () => {
    setLength(''); setWidth(''); setDepth('');
    setPads('1'); setPadLength(''); setPadWidth(''); setPadDepth('');
    setOverage('10'); setBagSize('80lb'); setPriceMode('yard'); setPrice('');
    setEnableRebar(false); setRebarRuns('2'); setRebarSpacing('12'); setRebarSize('#4');
    setResult(null); setError(null);
  };

  const calculate = () => {
    const isMetric = unit === 'metric';
    let volumeCuFt = 0;
    
    let lFt = 0;
    let wFt = 0;

    if (type === 'strip') {
      const l = Number(length);
      const w = Number(width);
      const d = Number(depth);
      if (l <= 0 || w <= 0 || d <= 0) {
        setError('Length, width, and depth must be greater than 0.');
        return;
      }
      lFt = toFt(l, isMetric);
      wFt = toFt(w, isMetric);
      const dFt = toFt(d, isMetric);
      volumeCuFt = lFt * wFt * dFt;
    } else {
      const p = Number(pads);
      const l = Number(padLength);
      const w = Number(padWidth);
      const d = Number(padDepth);
      if (p <= 0 || !Number.isInteger(p) || l <= 0 || w <= 0 || d <= 0) {
        setError('Number of pads must be a positive integer. Dimensions must be > 0.');
        return;
      }
      volumeCuFt = p * toFt(l, isMetric) * toFt(w, isMetric) * toFt(d, isMetric);
    }

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
    const baseResult = calculateConcreteBase(volumeCuFt, ov, bagSize, p, priceMode);

    if (enableRebar && type === 'strip') {
      const runs = Number(rebarRuns);
      const spacing = Number(rebarSpacing);
      if (runs <= 0 || !Number.isInteger(runs) || spacing <= 0) {
        setError('Rebar runs must be a positive integer. Spacing must be > 0.');
        return;
      }
      
      const spacingFt = isMetric ? toFt(spacing / 100, true) : spacing / 12; // cm to m to ft, or in to ft
      
      const longitudinalFt = lFt * runs;
      const numTransverse = Math.ceil(lFt / spacingFt) + 1;
      const transverseFt = numTransverse * (wFt - 0.5); // Assume 3" clearance total (1.5" each side) -> 0.25ft each side -> 0.5ft total
      const totalFt = longitudinalFt + Math.max(0, transverseFt);
      
      baseResult.rebar = {
        longitudinalFt,
        transverseFt: Math.max(0, transverseFt),
        verticalFt: 0,
        tiesFt: 0,
        totalFt,
        totalM: totalFt * 0.3048,
        totalLb: totalFt * REBAR_WEIGHTS_LB_PER_FT[rebarSize],
        totalKg: totalFt * REBAR_WEIGHTS_LB_PER_FT[rebarSize] * 0.453592
      };
    }

    setResult(baseResult);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
      <div className="xl:col-span-7 bg-surface-container-low rounded-[1px] p-10 lg:p-16 space-y-12 border border-outline-variant/30">
        
        {/* Settings Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Footing Type</label>
            <div className="flex bg-surface-container rounded-[1px] p-1 border border-outline-variant/30">
              <button onClick={() => setType('strip')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${type === 'strip' ? 'bg-secondary text-white shadow-md' : 'text-primary/50 hover:text-primary'}`}>Strip Footing</button>
              <button onClick={() => setType('pad')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${type === 'pad' ? 'bg-secondary text-white shadow-md' : 'text-primary/50 hover:text-primary'}`}>Pad Footing</button>
            </div>
          </div>
          <div className="space-y-4">
            <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Unit System</label>
            <div className="flex bg-surface-container rounded-[1px] p-1 border border-outline-variant/30">
              <button onClick={() => setUnit('imperial')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${unit === 'imperial' ? 'bg-secondary text-white shadow-md' : 'text-primary/50 hover:text-primary'}`}>Imperial</button>
              <button onClick={() => setUnit('metric')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${unit === 'metric' ? 'bg-secondary text-white shadow-md' : 'text-primary/50 hover:text-primary'}`}>Metric</button>
            </div>
          </div>
        </div>

        {/* Dimensions */}
        <div className="space-y-6">
          <h3 className="font-headline text-xl font-bold text-primary">Dimensions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {type === 'strip' ? (
              <>
                <div className="space-y-4 md:col-span-2">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Total Length ({unit === 'imperial' ? 'ft' : 'm'})</label>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                    <input type="number" min="0" value={length} onChange={e => setLength(e.target.value)} placeholder="0" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Width ({unit === 'imperial' ? 'ft' : 'm'})</label>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                    <input type="number" min="0" value={width} onChange={e => setWidth(e.target.value)} placeholder="0" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Depth ({unit === 'imperial' ? 'ft' : 'm'})</label>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                    <input type="number" min="0" value={depth} onChange={e => setDepth(e.target.value)} placeholder="0" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4 md:col-span-2">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Number of Pads</label>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                    <input type="number" min="1" value={pads} onChange={e => setPads(e.target.value)} placeholder="1" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Length per Pad ({unit === 'imperial' ? 'ft' : 'm'})</label>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                    <input type="number" min="0" value={padLength} onChange={e => setPadLength(e.target.value)} placeholder="0" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Width per Pad ({unit === 'imperial' ? 'ft' : 'm'})</label>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                    <input type="number" min="0" value={padWidth} onChange={e => setPadWidth(e.target.value)} placeholder="0" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
                  </div>
                </div>
                <div className="space-y-4 md:col-span-2">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Depth per Pad ({unit === 'imperial' ? 'ft' : 'm'})</label>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                    <input type="number" min="0" value={padDepth} onChange={e => setPadDepth(e.target.value)} placeholder="0" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Rebar Settings */}
        {type === 'strip' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-xl font-bold text-primary">Rebar Estimation</h3>
              <button 
                onClick={() => setEnableRebar(!enableRebar)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-[1px] transition-all ${enableRebar ? 'bg-secondary text-white' : 'bg-surface-container text-primary/50 hover:text-primary'}`}
              >
                {enableRebar ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            {enableRebar && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-surface-container/50 border border-outline-variant/30 rounded-[1px]">
                <div className="space-y-4">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Longitudinal Runs</label>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                    <input type="number" min="1" value={rebarRuns} onChange={e => setRebarRuns(e.target.value)} placeholder="2" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Transverse Spacing ({unit === 'imperial' ? 'in' : 'cm'})</label>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                    <input type="number" min="1" value={rebarSpacing} onChange={e => setRebarSpacing(e.target.value)} placeholder="12" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Rebar Size</label>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                    <select value={rebarSize} onChange={e => setRebarSize(e.target.value as RebarSize)} className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary">
                      <option value="#3">#3 (3/8")</option>
                      <option value="#4">#4 (1/2")</option>
                      <option value="#5">#5 (5/8")</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

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

              {result.rebar && (
                <div className="bg-surface-container p-8 rounded-[1px] border border-outline-variant/30 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/50 text-center">Rebar Needed ({rebarSize})</p>
                  <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2">
                    <span className="text-sm font-bold text-primary/70">Longitudinal</span>
                    <span className="font-headline font-bold text-primary">{result.rebar.longitudinalFt.toFixed(1)} ft</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2">
                    <span className="text-sm font-bold text-primary/70">Transverse</span>
                    <span className="font-headline font-bold text-primary">{result.rebar.transverseFt.toFixed(1)} ft</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-black text-primary">Total Length</span>
                    <div className="text-right">
                      <p className="font-headline font-bold text-xl text-primary">{result.rebar.totalFt.toFixed(1)} ft</p>
                      <p className="text-xs font-bold text-primary/50">{result.rebar.totalM.toFixed(1)} m</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-black text-primary">Total Weight</span>
                    <div className="text-right">
                      <p className="font-headline font-bold text-xl text-primary">{result.rebar.totalLb.toFixed(1)} lb</p>
                      <p className="text-xs font-bold text-primary/50">{result.rebar.totalKg.toFixed(1)} kg</p>
                    </div>
                  </div>
                </div>
              )}
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
