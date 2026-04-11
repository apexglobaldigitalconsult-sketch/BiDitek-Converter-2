import React, { useState, useEffect, useCallback } from 'react';
import { cryptoRandInt, calculateEntropy } from './passwordGeneratorUtils';
import { CopyButton, StrengthMeter, EntropyDisplay } from './SharedComponents';
import { RefreshCw, Copy } from 'lucide-react';

const PIN_CHARSETS = {
  numeric: '0123456789',
  alphanumeric: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  hexadecimal: '0123456789ABCDEF'
};

const AMBIGUOUS = '0O1I';

export default function PinMode({ onGenerate }: { onGenerate: (pw: string, mode: string) => void }) {
  const [pinType, setPinType] = useState<'numeric' | 'alphanumeric' | 'hexadecimal'>('numeric');
  const [length, setLength] = useState(6);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [noRepeating, setNoRepeating] = useState(false);
  const [noSequential, setNoSequential] = useState(false);
  const [groupDigits, setGroupDigits] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [pins, setPins] = useState<string[]>([]);
  const [entropy, setEntropy] = useState(0);

  const isSequential = (a: string, b: string, c: string) => {
    const codeA = a.charCodeAt(0);
    const codeB = b.charCodeAt(0);
    const codeC = c.charCodeAt(0);
    return (codeB - codeA === 1 && codeC - codeB === 1) || (codeA - codeB === 1 && codeB - codeC === 1);
  };

  const generate = useCallback(() => {
    let charset = PIN_CHARSETS[pinType];

    if (excludeAmbiguous && pinType === 'alphanumeric') {
      const ambigRegex = new RegExp(`[${AMBIGUOUS}]`, 'g');
      charset = charset.replace(ambigRegex, '');
    }

    const newPins: string[] = [];
    for (let q = 0; q < quantity; q++) {
      let pinChars: string[] = [];
      
      for (let i = 0; i < length; i++) {
        let char = '';
        let valid = false;
        let attempts = 0;

        while (!valid && attempts < 100) {
          char = charset[cryptoRandInt(0, charset.length - 1)];
          valid = true;

          if (noRepeating && i > 0 && char === pinChars[i - 1]) {
            valid = false;
          }

          if (noSequential && i > 1 && valid) {
            if (isSequential(pinChars[i - 2], pinChars[i - 1], char)) {
              valid = false;
            }
          }
          attempts++;
        }
        pinChars.push(char);
      }

      let finalPin = pinChars.join('');
      if (groupDigits) {
        finalPin = finalPin.match(/.{1,4}/g)?.join(' ') || finalPin;
      }

      newPins.push(finalPin);
      onGenerate(finalPin, 'PIN');
    }

    setPins(newPins);
    setEntropy(calculateEntropy(charset.length, length));
  }, [pinType, length, excludeAmbiguous, noRepeating, noSequential, groupDigits, quantity, onGenerate]);

  useEffect(() => {
    generate();
  }, [generate]);

  const copyAll = () => {
    navigator.clipboard.writeText(pins.join('\n'));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
      <div className="xl:col-span-4 bg-surface-container-low rounded-[1px] p-8 space-y-8 border border-outline-variant/30">
        <h3 className="font-headline text-xl font-bold text-primary">Settings</h3>
        
        <div className="space-y-4">
          <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">PIN Type</label>
          <select 
            value={pinType} 
            onChange={e => setPinType(e.target.value as any)}
            className="w-full bg-surface-container border-none p-4 text-sm font-bold text-primary focus:ring-2 ring-secondary/20 rounded-[1px]"
          >
            <option value="numeric">Numeric (0-9)</option>
            <option value="alphanumeric">Alphanumeric (0-9, A-Z)</option>
            <option value="hexadecimal">Hexadecimal (0-9, A-F)</option>
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Length</label>
            <span className="font-mono font-bold text-secondary">{length}</span>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="range" min="4" max="24" value={length} 
              onChange={e => setLength(parseInt(e.target.value))}
              className="flex-1 accent-secondary"
            />
            <input 
              type="number" min="4" max="24" value={length}
              onChange={e => setLength(parseInt(e.target.value))}
              className="w-16 bg-surface-container border-none p-2 text-center font-bold text-primary focus:ring-2 ring-secondary/20 rounded-[1px]"
            />
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-outline-variant/10">
          <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Rules</label>
          {pinType === 'alphanumeric' && (
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={excludeAmbiguous} onChange={e => setExcludeAmbiguous(e.target.checked)} className="w-4 h-4 text-secondary bg-surface-container border-outline-variant/30 rounded-[1px] focus:ring-secondary/20" />
              <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">Exclude Ambiguous (0, O, 1, I)</span>
            </label>
          )}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={noRepeating} onChange={e => setNoRepeating(e.target.checked)} className="w-4 h-4 text-secondary bg-surface-container border-outline-variant/30 rounded-[1px] focus:ring-secondary/20" />
            <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">No Repeating Digits (e.g. 11)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={noSequential} onChange={e => setNoSequential(e.target.checked)} className="w-4 h-4 text-secondary bg-surface-container border-outline-variant/30 rounded-[1px] focus:ring-secondary/20" />
            <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">No Sequential Digits (e.g. 123)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={groupDigits} onChange={e => setGroupDigits(e.target.checked)} className="w-4 h-4 text-secondary bg-surface-container border-outline-variant/30 rounded-[1px] focus:ring-secondary/20" />
            <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">Group Digits (e.g. 1234 5678)</span>
          </label>
        </div>

        <div className="space-y-4 pt-4 border-t border-outline-variant/10">
          <div className="flex justify-between items-center">
            <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Quantity</label>
            <span className="font-mono font-bold text-secondary">{quantity}</span>
          </div>
          <input 
            type="range" min="1" max="20" value={quantity} 
            onChange={e => setQuantity(parseInt(e.target.value))}
            className="w-full accent-secondary"
          />
        </div>

        <button onClick={() => {
          setPinType('numeric'); setLength(6); setExcludeAmbiguous(false); setNoRepeating(false); 
          setNoSequential(false); setGroupDigits(false); setQuantity(1);
        }} className="w-full bg-surface-container text-primary py-4 rounded-[1px] font-headline font-bold hover:bg-outline-variant/20 transition-all">
          RESET SETTINGS
        </button>
      </div>

      <div className="xl:col-span-8 space-y-8">
        <div className="bg-surface-container-low rounded-[1px] p-8 lg:p-12 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30">Generated PINs</p>
            <div className="flex gap-2">
              {pins.length > 1 && (
                <button onClick={copyAll} className="flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-outline-variant/20 text-primary rounded-[1px] font-bold text-xs uppercase tracking-wider transition-all">
                  <Copy className="w-4 h-4" /> Copy All
                </button>
              )}
              <button onClick={generate} className="flex items-center gap-2 px-4 py-2 bg-secondary text-white hover:bg-secondary/90 rounded-[1px] font-bold text-xs uppercase tracking-wider transition-all shadow-md">
                <RefreshCw className="w-4 h-4" /> Regenerate
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-surface-container p-6 rounded-[1px] border border-outline-variant/30 max-h-[400px] overflow-y-auto space-y-2">
              {pins.map((pw, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0 group">
                  <span className="font-mono text-2xl tracking-widest text-primary font-bold break-all pr-4">{pw}</span>
                  <CopyButton text={pw} className="opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0" />
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <StrengthMeter entropy={entropy} />
              <EntropyDisplay entropy={entropy} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
