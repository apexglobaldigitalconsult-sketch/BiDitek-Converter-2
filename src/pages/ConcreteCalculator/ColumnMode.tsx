import React, { useState } from 'react';
import { UnitSystem, BagSize, PriceMode, RebarSize, calculateConcreteBase, toFt, inToFt, ConcreteResult, BAG_YIELDS_CU_FT, REBAR_WEIGHTS_LB_PER_FT } from './concreteCalculatorUtils';

export default function ColumnMode() {
  const [shape, setShape] = useState<'round' | 'square'>('round');
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  
  // Round
  const [diameter, setDiameter] = useState('');
  
  // Square
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  
  const [height, setHeight] = useState('');
  const [columns, setColumns] = useState('1');
  
  const [overage, setOverage] = useState('10');
  const [bagSize, setBagSize] = useState<BagSize>('80lb');
  const [priceMode, setPriceMode] = useState<PriceMode>('yard');
  const [price, setPrice] = useState('');

  // Rebar
  const [enableRebar, setEnableRebar] = useState(false);
  const [verticalBars, setVerticalBars] = useState('4');
  const [ties, setTies] = useState('');
  const [tieSpacing, setTieSpacing] = useState('12');
  const [rebarSize, setRebarSize] = useState<RebarSize>('#4');

  const [result, setResult] = useState<ConcreteResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clear = () => {
    setDiameter(''); setWidth(''); setLength(''); setHeight(''); setColumns('1');
    setOverage('10'); setBagSize('80lb'); setPriceMode('yard'); setPrice('');
    setEnableRebar(false); setVerticalBars('4'); setTies(''); setTieSpacing('12'); setRebarSize('#4');
    setResult(null); setError(null);
  };

  const calculate = () => {
    const isMetric = unit === 'metric';
    let volumeCuFt = 0;
    
    const h = Number(height);
    const c = Number(columns);
    
    if (h <= 0 || c <= 0 || !Number.isInteger(c)) {
      setError('Height must be > 0. Number of columns must be a positive integer.');
      return;
    }

    const hFt = toFt(h, isMetric);

    let perimeterFt = 0;

    if (shape === 'round') {
      const d = Number(diameter);
      if (d <= 0) {
        setError('Diameter must be greater than 0.');
        return;
      }
      const dFt = inToFt(d, isMetric);
      const rFt = dFt / 2;
      volumeCuFt = Math.PI * rFt * rFt * hFt * c;
      perimeterFt = Math.PI * (dFt - 0.25); // Assume 1.5" clearance -> 3" total -> 0.25ft
    } else {
      const w = Number(width);
      const l = Number(length);
      if (w <= 0 || l <= 0) {
        setError('Width and length must be greater than 0.');
        return;
      }
      const wFt = inToFt(w, isMetric);
      const lFt = inToFt(l, isMetric);
      volumeCuFt = wFt * lFt * hFt * c;
      perimeterFt = 2 * (wFt - 0.25) + 2 * (lFt - 0.25);
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

    if (enableRebar) {
      const vBars = Number(verticalBars);
      const tSpacing = Number(tieSpacing);
      const numTies = ties !== '' ? Number(ties) : Math.ceil(hFt / (isMetric ? toFt(tSpacing / 100, true) : tSpacing / 12));
      
      if (vBars <= 0 || !Number.isInteger(vBars) || numTies < 0 || !Number.isInteger(numTies)) {
        setError('Vertical bars and ties must be positive integers.');
        return;
      }
      
      const verticalFt = vBars * hFt * c;
      const tiesFt = numTies * Math.max(0, perimeterFt) * c;
      const totalFt = verticalFt + tiesFt;
      
      baseResult.rebar = {
        longitudinalFt: 0,
        transverseFt: 0,
        verticalFt,
        tiesFt,
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
            <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Column Shape</label>
            <div className="flex bg-surface-container rounded-[1px] p-1 border border-outline-variant/30">
              <button onClick={() => setShape('round')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${shape === 'round' ? 'bg-secondary text-white shadow-md' : 'text-primary/50 hover:text-primary'}`}>Round</button>
              <button onClick={() => setShape('square')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${shape === 'square' ? 'bg-secondary text-white shadow-md' : 'text-primary/50 hover:text-primary'}`}>Square/Rect</button>
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
            {shape === 'round' ? (
              <div className="space-y-4 md:col-span-2">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Diameter ({unit === 'imperial' ? 'in' : 'cm'})</label>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                  <input type="number" min="0" value={diameter} onChange={e => setDiameter(e.target.value)} placeholder="0" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Width ({unit === 'imperial' ? 'in' : 'cm'})</label>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                    <input type="number" min="0" value={width} onChange={e => setWidth(e.target.value)} placeholder="0" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Length ({unit === 'imperial' ? 'in' : 'cm'})</label>
                  <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                    <input type="number" min="0" value={length} onChange={e => setLength(e.target.value)} placeholder="0" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
                  </div>
                </div>
              </>
            )}
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Height ({unit === 'imperial' ? 'ft' : 'm'})</label>
              <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                <input type="number" min="0" value={height} onChange={e => setHeight(e.target.value)} placeholder="0" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
              </div>
            </div>
            <div className="space-y-4">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Number of Columns</label>
              <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                <input type="number" min="1" value={columns} onChange={e => setColumns(e.target.value)} placeholder="1" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Rebar Settings */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-surface-container/50 border border-outline-variant/30 rounded-[1px]">
              <div className="space-y-4">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Vertical Bars (per col)</label>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                  <input type="number" min="1" value={verticalBars} onChange={e => setVerticalBars(e.target.value)} placeholder="4" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
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
              <div className="space-y-4">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Number of Ties (Optional)</label>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                  <input type="number" min="0" value={ties} onChange={e => setTies(e.target.value)} placeholder="Auto" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Tie Spacing ({unit === 'imperial' ? 'in' : 'cm'})</label>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                  <input type="number" min="1" value={tieSpacing} onChange={e => setTieSpacing(e.target.value)} placeholder="12" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
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

              {result.rebar && (
                <div className="bg-surface-container p-8 rounded-[1px] border border-outline-variant/30 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/50 text-center">Rebar Needed ({rebarSize})</p>
                  <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2">
                    <span className="text-sm font-bold text-primary/70">Vertical Bars</span>
                    <span className="font-headline font-bold text-primary">{result.rebar.verticalFt.toFixed(1)} ft</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-outline-variant/30 pb-2">
                    <span className="text-sm font-bold text-primary/70">Ties / Stirrups</span>
                    <span className="font-headline font-bold text-primary">{result.rebar.tiesFt.toFixed(1)} ft</span>
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
