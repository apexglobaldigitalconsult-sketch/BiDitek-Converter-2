import React, { useState, useEffect, useMemo } from 'react';
import {
  Category, Unit, LENGTH_UNITS, WEIGHT_UNITS, TEMPERATURE_UNITS, AREA_UNITS, VOLUME_UNITS, SPEED_UNITS,
  DATA_STORAGE_SI_UNITS, DATA_STORAGE_IEC_UNITS, DATA_TRANSFER_UNITS, TIME_UNITS,
  convertValue, convertTemperature, formatNumber, HistoryEntry
} from './conversionCalculatorUtils';
import { ArrowRightLeft, Copy, Trash2, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="text-secondary hover:text-secondary/80 transition-colors" title="Copy">
      {copied ? <span className="text-xs font-bold text-green-500">Copied!</span> : <Copy className="w-4 h-4" />}
    </button>
  );
};

function HistoryPanel({ history, onClear, onRestore }: { history: HistoryEntry[], onClear: () => void, onRestore: (entry: HistoryEntry) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  if (history.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface-container-low border-t border-outline-variant/30 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-surface-container/50 transition-colors"
        >
          <div className="flex items-center gap-2 text-primary">
            <Clock className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wider">Recent Conversions ({history.length})</span>
          </div>
          {isOpen ? <ChevronDown className="w-5 h-5 text-primary/50" /> : <ChevronUp className="w-5 h-5 text-primary/50" />}
        </button>
        
        {isOpen && (
          <div className="p-4 pt-0">
            <div className="flex justify-end mb-4">
              <button 
                onClick={onClear}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Clear History
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto pr-2">
              {history.map(entry => (
                <div 
                  key={entry.id} 
                  onClick={() => { onRestore(entry); setIsOpen(false); }}
                  className="bg-surface-container p-4 rounded-[1px] border border-outline-variant/30 hover:border-secondary/50 cursor-pointer transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/50">{entry.category}</span>
                    <span className="text-[10px] text-primary/30">{entry.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-sm text-primary">
                    <span className="truncate">{formatNumber(entry.fromValue)} {entry.fromUnit}</span>
                    <ArrowRightLeft className="w-3 h-3 shrink-0 text-primary/30" />
                    <span className="truncate font-bold text-secondary">{formatNumber(entry.toValue)} {entry.toUnit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface CategoryConverterProps {
  category: Category;
  onConvert: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  restoredEntry: HistoryEntry | null;
}

const CategoryConverter: React.FC<CategoryConverterProps> = ({ 
  category, 
  onConvert,
  restoredEntry
}) => {
  const [fromValue, setFromValue] = useState<string>('1');
  const [fromUnitId, setFromUnitId] = useState<string>('');
  const [toUnitId, setToUnitId] = useState<string>('');
  const [showAllUnits, setShowAllUnits] = useState(false);
  
  // Data Storage specific
  const [dataMode, setDataMode] = useState<'storage' | 'transfer'>('storage');
  const [useIEC, setUseIEC] = useState(false);
  const [fileSize, setFileSize] = useState('1');
  const [fileSizeUnit, setFileSizeUnit] = useState('gb');
  
  // Time specific
  const [showBreakdown, setShowBreakdown] = useState(false);

  const activeUnits = useMemo(() => {
    switch (category) {
      case 'length': return LENGTH_UNITS;
      case 'weight': return WEIGHT_UNITS;
      case 'temperature': return TEMPERATURE_UNITS;
      case 'area': return AREA_UNITS;
      case 'volume': return VOLUME_UNITS;
      case 'speed': return SPEED_UNITS;
      case 'data': 
        if (dataMode === 'transfer') return DATA_TRANSFER_UNITS;
        return useIEC ? DATA_STORAGE_IEC_UNITS : DATA_STORAGE_SI_UNITS;
      case 'time': return TIME_UNITS;
      default: return LENGTH_UNITS;
    }
  }, [category, dataMode, useIEC]);

  // Handle restored entry
  useEffect(() => {
    if (restoredEntry && restoredEntry.category === category) {
      setFromValue(restoredEntry.fromValue.toString());
      
      // Determine if we need to switch sub-modes for data
      if (category === 'data') {
        const isTransfer = DATA_TRANSFER_UNITS.some(u => u.symbol === restoredEntry.fromUnit);
        if (isTransfer) setDataMode('transfer');
        else {
          setDataMode('storage');
          const isIEC = DATA_STORAGE_IEC_UNITS.some(u => u.symbol === restoredEntry.fromUnit && u.id !== 'bit' && u.id !== 'nibble' && u.id !== 'byte');
          setUseIEC(isIEC);
        }
      }

      // We need to wait for activeUnits to update if sub-mode changed, so we use a timeout or let the next effect handle it.
      // Actually, since activeUnits is derived, we can just find the unit in all possible lists.
      let allPossibleUnits = activeUnits;
      if (category === 'data') {
        allPossibleUnits = [...DATA_STORAGE_SI_UNITS, ...DATA_STORAGE_IEC_UNITS, ...DATA_TRANSFER_UNITS];
      }
      
      const fromU = allPossibleUnits.find(u => u.symbol === restoredEntry.fromUnit);
      const toU = allPossibleUnits.find(u => u.symbol === restoredEntry.toUnit);
      if (fromU) setFromUnitId(fromU.id);
      if (toU) setToUnitId(toU.id);
    }
  }, [restoredEntry, category]);

  // Initialize units when category changes (only if not restoring)
  useEffect(() => {
    if (activeUnits.length > 0 && (!restoredEntry || restoredEntry.category !== category)) {
      // Only set if current unit is not in the new list
      if (!activeUnits.find(u => u.id === fromUnitId)) {
        setFromUnitId(activeUnits[0].id);
      }
      if (!activeUnits.find(u => u.id === toUnitId)) {
        setToUnitId(activeUnits[1]?.id || activeUnits[0].id);
      }
    }
  }, [activeUnits, category, restoredEntry]);

  const numValue = parseFloat(fromValue) || 0;

  const getConvertedValue = (targetUnitId: string) => {
    if (category === 'temperature') {
      return convertTemperature(numValue, fromUnitId, targetUnitId);
    }
    return convertValue(numValue, fromUnitId, targetUnitId, activeUnits);
  };

  const resultValue = getConvertedValue(toUnitId);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (numValue !== 0 && fromUnitId && toUnitId) {
        const fromUnit = activeUnits.find(u => u.id === fromUnitId);
        const toUnit = activeUnits.find(u => u.id === toUnitId);
        if (fromUnit && toUnit) {
          onConvert({
            category,
            fromValue: numValue,
            fromUnit: fromUnit.symbol,
            toValue: resultValue,
            toUnit: toUnit.symbol
          });
        }
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [numValue, fromUnitId, toUnitId, category, activeUnits, resultValue]);

  const handleSwap = () => {
    const temp = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(temp);
  };

  const getDurationBreakdown = (seconds: number) => {
    if (seconds < 0) return '';
    let s = Math.floor(seconds);
    const y = Math.floor(s / 31557600); s %= 31557600;
    const d = Math.floor(s / 86400); s %= 86400;
    const h = Math.floor(s / 3600); s %= 3600;
    const m = Math.floor(s / 60); s %= 60;
    
    const parts = [];
    if (y > 0) parts.push(`${y} year${y !== 1 ? 's' : ''}`);
    if (d > 0) parts.push(`${d} day${d !== 1 ? 's' : ''}`);
    if (h > 0) parts.push(`${h} hour${h !== 1 ? 's' : ''}`);
    if (m > 0) parts.push(`${m} minute${m !== 1 ? 's' : ''}`);
    if (s > 0 || parts.length === 0) parts.push(`${s} second${s !== 1 ? 's' : ''}`);
    
    return parts.join(', ');
  };

  const secondsValue = category === 'time' ? convertValue(numValue, fromUnitId, 's', TIME_UNITS) : 0;

  const getTransferTime = () => {
    const sizeNum = parseFloat(fileSize) || 0;
    const sizeInBytes = convertValue(sizeNum, fileSizeUnit, 'byte', DATA_STORAGE_SI_UNITS);
    const rateInBps = convertValue(numValue, fromUnitId, 'Bps', DATA_TRANSFER_UNITS);
    
    if (rateInBps === 0) return 'Infinite';
    const seconds = sizeInBytes / rateInBps;
    return getDurationBreakdown(seconds);
  };

  return (
    <div className="space-y-8">
      {category === 'data' && (
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex bg-surface-container rounded-[1px] p-1">
            <button 
              onClick={() => setDataMode('storage')}
              className={`px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-[1px] transition-all ${dataMode === 'storage' ? 'bg-primary text-background shadow-sm' : 'text-primary/50 hover:text-secondary hover:bg-secondary/10'}`}
            >
              Storage Size
            </button>
            <button 
              onClick={() => setDataMode('transfer')}
              className={`px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-[1px] transition-all ${dataMode === 'transfer' ? 'bg-primary text-background shadow-sm' : 'text-primary/50 hover:text-secondary hover:bg-secondary/10'}`}
            >
              Transfer Rate
            </button>
          </div>
          {dataMode === 'storage' && (
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={useIEC} onChange={e => setUseIEC(e.target.checked)} className="w-4 h-4 text-secondary bg-surface-container border-outline-variant/30 rounded-[1px] focus:ring-secondary/20" />
              <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">Use IEC (1024-based)</span>
            </label>
          )}
        </div>
      )}

      {category === 'time' && (
        <div className="flex flex-wrap gap-4 mb-6">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={showBreakdown} onChange={e => setShowBreakdown(e.target.checked)} className="w-4 h-4 text-secondary bg-surface-container border-outline-variant/30 rounded-[1px] focus:ring-secondary/20" />
            <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">Show as days/hours/minutes/seconds</span>
          </label>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-center bg-surface-container-low p-8 rounded-[1px] border border-outline-variant/30 shadow-sm">
        <div className="space-y-4">
          <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">From</label>
          <input 
            type="number" 
            value={fromValue} 
            onChange={e => setFromValue(e.target.value)}
            className="w-full bg-surface-container border-none p-4 text-2xl font-mono font-bold text-primary focus:ring-2 ring-secondary/20 rounded-[1px]"
          />
          <select 
            value={fromUnitId} 
            onChange={e => setFromUnitId(e.target.value)}
            className="w-full bg-surface-container border-none p-4 text-sm font-bold text-primary focus:ring-2 ring-secondary/20 rounded-[1px]"
          >
            {activeUnits.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
            ))}
          </select>
        </div>

        <div className="flex justify-center pt-8">
          <button 
            onClick={handleSwap}
            className="p-4 bg-surface-container hover:bg-outline-variant/20 text-primary rounded-full transition-all"
            title="Swap Units"
          >
            <ArrowRightLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">To</label>
          <div className="relative w-full bg-surface-container border-none p-4 text-2xl font-mono font-bold text-primary rounded-[1px] min-h-[64px] flex items-center justify-between group">
            <span className="truncate pr-4">{formatNumber(resultValue)}</span>
            <CopyButton text={formatNumber(resultValue)} />
          </div>
          <select 
            value={toUnitId} 
            onChange={e => setToUnitId(e.target.value)}
            className="w-full bg-surface-container border-none p-4 text-sm font-bold text-primary focus:ring-2 ring-secondary/20 rounded-[1px]"
          >
            {activeUnits.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.symbol})</option>
            ))}
          </select>
        </div>
      </div>

      {category === 'time' && showBreakdown && (
        <div className="bg-surface-container-low p-6 rounded-[1px] border border-outline-variant/30 shadow-sm">
          <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50 mb-2">Duration Breakdown</p>
          <p className="font-mono text-lg text-primary">{getDurationBreakdown(secondsValue)}</p>
        </div>
      )}

      {category === 'data' && dataMode === 'transfer' && (
        <div className="bg-surface-container-low p-6 rounded-[1px] border border-outline-variant/30 shadow-sm space-y-4">
          <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Transfer Time Estimate</p>
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-bold text-primary">File Size:</span>
            <input 
              type="number" 
              value={fileSize} 
              onChange={e => setFileSize(e.target.value)}
              className="w-32 bg-surface-container border-none p-2 text-sm font-mono font-bold text-primary focus:ring-2 ring-secondary/20 rounded-[1px]"
            />
            <select 
              value={fileSizeUnit} 
              onChange={e => setFileSizeUnit(e.target.value)}
              className="w-32 bg-surface-container border-none p-2 text-sm font-bold text-primary focus:ring-2 ring-secondary/20 rounded-[1px]"
            >
              {DATA_STORAGE_SI_UNITS.map(u => (
                <option key={u.id} value={u.id}>{u.symbol}</option>
              ))}
            </select>
            <span className="text-sm font-bold text-primary ml-4">Estimated Time:</span>
            <span className="font-mono text-secondary font-bold">{getTransferTime()}</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <button 
          onClick={() => setShowAllUnits(!showAllUnits)}
          className="flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-outline-variant/20 text-primary rounded-[1px] font-bold text-xs uppercase tracking-wider transition-all"
        >
          {showAllUnits ? 'Hide All Units' : 'Show All Units'}
        </button>
        <button 
          onClick={() => {
            setFromValue('1');
            if (activeUnits.length > 0) {
              setFromUnitId(activeUnits[0].id);
              setToUnitId(activeUnits[1]?.id || activeUnits[0].id);
            }
          }}
          className="text-xs font-bold uppercase tracking-wider text-primary/50 hover:text-primary transition-colors"
        >
          Reset
        </button>
      </div>

      {showAllUnits && (
        <div className="bg-surface-container-low rounded-[1px] border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant/30">
                  <th className="p-4 font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Unit</th>
                  <th className="p-4 font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Value</th>
                  <th className="p-4 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {[...activeUnits].sort((a, b) => (a.factor || 0) - (b.factor || 0)).map(u => {
                  const val = getConvertedValue(u.id);
                  const formatted = formatNumber(val);
                  return (
                    <tr key={u.id} className="border-b border-outline-variant/10 last:border-0 hover:bg-surface-container/50 transition-colors group">
                      <td className="p-4">
                        <span className="font-bold text-primary">{u.name}</span>
                        <span className="ml-2 text-primary/50 text-sm">({u.symbol})</span>
                      </td>
                      <td className="p-4 font-mono text-primary">{formatted}</td>
                      <td className="p-4 text-right">
                        <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          <CopyButton text={formatted} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConversionCalculator() {
  const [activeCategory, setActiveCategory] = useState<Category>('length');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [restoredEntry, setRestoredEntry] = useState<HistoryEntry | null>(null);

  const categories: { id: Category, label: string }[] = [
    { id: 'length', label: 'Length & Distance' },
    { id: 'weight', label: 'Weight & Mass' },
    { id: 'temperature', label: 'Temperature' },
    { id: 'area', label: 'Area' },
    { id: 'volume', label: 'Volume & Capacity' },
    { id: 'speed', label: 'Speed & Velocity' },
    { id: 'data', label: 'Data Storage' },
    { id: 'time', label: 'Time & Duration' },
  ];

  const handleConvert = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    setHistory(prev => {
      if (prev.length > 0 && 
          prev[0].category === entry.category && 
          prev[0].fromValue === entry.fromValue && 
          prev[0].fromUnit === entry.fromUnit && 
          prev[0].toUnit === entry.toUnit) {
        return prev;
      }
      const newEntry = { ...entry, id: Math.random().toString(), timestamp: new Date() };
      return [newEntry, ...prev].slice(0, 10);
    });
  };

  const handleRestore = (entry: HistoryEntry) => {
    setActiveCategory(entry.category as Category);
    setRestoredEntry(entry);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 space-y-12 mb-20">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary/50 text-sm font-bold uppercase tracking-widest mb-8">
          <span>Calculators</span>
          <span>/</span>
          <span>Other</span>
          <span>/</span>
          <span className="text-secondary">Conversion Calculator</span>
        </div>
        <h1 className="font-headline text-4xl lg:text-6xl font-bold text-primary tracking-tight">
          Conversion Calculator
        </h1>
        <p className="text-lg text-primary/60 max-w-2xl leading-relaxed">
          Instantly convert between hundreds of units across 8 different categories. 
          Features smart number formatting, real-time updates, and a comprehensive all-units view.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-outline-variant/30 pb-4">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setRestoredEntry(null);
            }}
            className={`px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all rounded-[1px] ${
              activeCategory === cat.id 
                ? 'bg-primary text-background shadow-md' 
                : 'bg-surface-container text-primary/50 hover:text-secondary hover:bg-secondary/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        <CategoryConverter 
          key={activeCategory} // Force re-mount on category change unless restored
          category={activeCategory} 
          onConvert={handleConvert} 
          restoredEntry={restoredEntry}
        />
      </div>

      <HistoryPanel 
        history={history} 
        onClear={() => setHistory([])} 
        onRestore={handleRestore} 
      />
    </div>
  );
}
