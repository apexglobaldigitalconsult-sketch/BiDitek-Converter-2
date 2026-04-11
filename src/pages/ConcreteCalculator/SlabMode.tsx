import React, { useState, useEffect } from 'react';
import { UnitSystem, BagSize, PriceMode, calculateConcreteBase, toFt, inToFt, ConcreteResult, BAG_YIELDS_CU_FT } from './concreteCalculatorUtils';

export default function SlabMode() {
  const [shape, setShape] = useState<'rect' | 'circle'>('rect');
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [diameter, setDiameter] = useState('');
  const [thickness, setThickness] = useState('');
  
  const [overage, setOverage] = useState('10');
  const [bagSize, setBagSize] = useState<BagSize>('80lb');
  const [priceMode, setPriceMode] = useState<PriceMode>('yard');
  const [price, setPrice] = useState('');

  const [result, setResult] = useState<ConcreteResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clear = () => {
    setLength(''); setWidth(''); setDiameter(''); setThickness('');
    setOverage('10'); setBagSize('80lb'); setPriceMode('yard'); setPrice('');
    setResult(null); setError(null);
  };

  const calculate = () => {
    const isMetric = unit === 'metric';
    const t = Number(thickness);
    if (t <= 0) {
      setError('Thickness must be greater than 0.');
      return;
    }

    let volumeCuFt = 0;
    const tFt = inToFt(t, isMetric);

    if (shape === 'rect') {
      const l = Number(length);
      const w = Number(width);
      if (l <= 0 || w <= 0) {
        setError('Length and width must be greater than 0.');
        return;
      }
      volumeCuFt = toFt(l, isMetric) * toFt(w, isMetric) * tFt;
    } else {
      const d = Number(diameter);
      if (d <= 0) {
        setError('Diameter must be greater than 0.');
        return;
      }
      const rFt = toFt(d, isMetric) / 2;
      volumeCuFt = Math.PI * rFt * rFt * tFt;
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
    setResult(calculateConcreteBase(volumeCuFt, ov, bagSize, p, priceMode));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
      <div className="xl:col-span-7 bg-surface-container-low rounded-[1px] p-10 lg:p-16 space-y-12 border border-outline-variant/30">
        
        {/* Settings Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Shape</label>
            <div className="flex bg-surface-container rounded-[1px] p-1 border border-outline-variant/30">
              <button onClick={() => setShape('rect')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${shape === 'rect' ? 'bg-secondary text-white shadow-md' : 'text-primary/50 hover:text-primary'}`}>Rectangular</button>
              <button onClick={() => setShape('circle')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${shape === 'circle' ? 'bg-secondary text-white shadow-md' : 'text-primary/50 hover:text-primary'}`}>Circular</button>
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
            {shape === 'rect' ? (
              <>
                <div className="space-y-4">
                  <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Length ({unit === 'imperial' ? 'ft' : 'm'})</label>
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
              </>
            ) : (
              <div className="space-y-4 md:col-span-2">
                <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Diameter ({unit === 'imperial' ? 'ft' : 'm'})</label>
                <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                  <input type="number" min="0" value={diameter} onChange={e => setDiameter(e.target.value)} placeholder="0" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
                </div>
              </div>
            )}
            <div className="space-y-4 md:col-span-2">
              <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 pl-4">Thickness / Depth ({unit === 'imperial' ? 'in' : 'cm'})</label>
              <div className="bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
                <input type="number" min="0" value={thickness} onChange={e => setThickness(e.target.value)} placeholder="0" className="w-full bg-transparent border-none py-4 text-xl font-headline font-bold focus:ring-0 text-primary" />
              </div>
            </div>
          </div>
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
