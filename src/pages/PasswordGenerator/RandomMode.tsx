import React, { useState, useEffect, useCallback } from 'react';
import { cryptoRandInt, cryptoShuffle, calculateEntropy, HistoryEntry } from './passwordGeneratorUtils';
import { CopyButton, StrengthMeter, EntropyDisplay } from './SharedComponents';
import { RefreshCw, Copy } from 'lucide-react';

const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?'
};

const AMBIGUOUS = '0Ol1I';

export default function RandomMode({ onGenerate }: { onGenerate: (pw: string, mode: string) => void }) {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [customSymbols, setCustomSymbols] = useState('');
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [excludeDuplicate, setExcludeDuplicate] = useState(false);
  const [guaranteeTypes, setGuaranteeTypes] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const [passwords, setPasswords] = useState<string[]>([]);
  const [entropy, setEntropy] = useState(0);

  const generate = useCallback(() => {
    let charset = '';
    const types: string[] = [];

    let upper = CHARSETS.uppercase;
    let lower = CHARSETS.lowercase;
    let nums = CHARSETS.numbers;
    let syms = customSymbols || CHARSETS.symbols;

    if (excludeAmbiguous) {
      const ambigRegex = new RegExp(`[${AMBIGUOUS}]`, 'g');
      upper = upper.replace(ambigRegex, '');
      lower = lower.replace(ambigRegex, '');
      nums = nums.replace(ambigRegex, '');
      syms = syms.replace(ambigRegex, '');
    }

    if (useUpper) { charset += upper; types.push(upper); }
    if (useLower) { charset += lower; types.push(lower); }
    if (useNumbers) { charset += nums; types.push(nums); }
    if (useSymbols) { charset += syms; types.push(syms); }

    if (charset.length === 0) {
      setPasswords([]);
      setEntropy(0);
      return;
    }

    // Disable exclude duplicate if length > charset size
    const actualExcludeDuplicate = excludeDuplicate && length <= charset.length;

    const newPasswords: string[] = [];
    for (let q = 0; q < quantity; q++) {
      let pwChars: string[] = [];
      let availableCharset = charset;

      for (let i = 0; i < length; i++) {
        if (actualExcludeDuplicate && availableCharset.length > 0) {
          const idx = cryptoRandInt(0, availableCharset.length - 1);
          pwChars.push(availableCharset[idx]);
          availableCharset = availableCharset.slice(0, idx) + availableCharset.slice(idx + 1);
        } else {
          pwChars.push(charset[cryptoRandInt(0, charset.length - 1)]);
        }
      }

      if (guaranteeTypes && types.length > 0 && length >= types.length) {
        // Ensure at least one of each selected type
        const guaranteedChars = types.map(t => t[cryptoRandInt(0, t.length - 1)]);
        // Replace first N characters with guaranteed characters
        for (let i = 0; i < guaranteedChars.length; i++) {
          pwChars[i] = guaranteedChars[i];
        }
        // Shuffle to distribute guaranteed characters
        pwChars = cryptoShuffle(pwChars);
      }

      const finalPw = pwChars.join('');
      newPasswords.push(finalPw);
      onGenerate(finalPw, 'Random Password');
    }

    setPasswords(newPasswords);
    setEntropy(calculateEntropy(charset.length, length));
  }, [length, useUpper, useLower, useNumbers, useSymbols, customSymbols, excludeAmbiguous, excludeDuplicate, guaranteeTypes, quantity, onGenerate]);

  useEffect(() => {
    generate();
  }, [generate]);

  const copyAll = () => {
    navigator.clipboard.writeText(passwords.join('\n'));
  };

  const handleLengthChange = (val: number) => {
    setLength(Math.max(4, Math.min(128, val)));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
      <div className="xl:col-span-4 bg-surface-container-low rounded-[1px] p-8 space-y-8 border border-outline-variant/30">
        <h3 className="font-headline text-xl font-bold text-primary">Settings</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Length</label>
            <span className="font-mono font-bold text-secondary">{length}</span>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="range" min="4" max="128" value={length} 
              onChange={e => handleLengthChange(parseInt(e.target.value))}
              className="flex-1 accent-secondary"
            />
            <input 
              type="number" min="4" max="128" value={length}
              onChange={e => handleLengthChange(parseInt(e.target.value))}
              className="w-16 bg-surface-container border-none p-2 text-center font-bold text-primary focus:ring-2 ring-secondary/20 rounded-[1px]"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Characters</label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={useUpper} onChange={e => setUseUpper(e.target.checked)} className="w-4 h-4 text-secondary bg-surface-container border-outline-variant/30 rounded-[1px] focus:ring-secondary/20" />
            <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">Uppercase (A-Z)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={useLower} onChange={e => setUseLower(e.target.checked)} className="w-4 h-4 text-secondary bg-surface-container border-outline-variant/30 rounded-[1px] focus:ring-secondary/20" />
            <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">Lowercase (a-z)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={useNumbers} onChange={e => setUseNumbers(e.target.checked)} className="w-4 h-4 text-secondary bg-surface-container border-outline-variant/30 rounded-[1px] focus:ring-secondary/20" />
            <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">Numbers (0-9)</span>
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={useSymbols} onChange={e => setUseSymbols(e.target.checked)} className="w-4 h-4 text-secondary bg-surface-container border-outline-variant/30 rounded-[1px] focus:ring-secondary/20" />
              <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">Symbols</span>
            </label>
            {useSymbols && (
              <input 
                type="text" 
                value={customSymbols} 
                onChange={e => setCustomSymbols(e.target.value)} 
                placeholder={CHARSETS.symbols}
                className="w-full bg-surface-container border-none p-3 text-sm font-mono text-primary focus:ring-2 ring-secondary/20 rounded-[1px] ml-7 w-[calc(100%-1.75rem)]"
              />
            )}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-outline-variant/10">
          <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Options</label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={excludeAmbiguous} onChange={e => setExcludeAmbiguous(e.target.checked)} className="w-4 h-4 text-secondary bg-surface-container border-outline-variant/30 rounded-[1px] focus:ring-secondary/20" />
            <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">Exclude Ambiguous (0, O, l, 1, I)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={excludeDuplicate} onChange={e => setExcludeDuplicate(e.target.checked)} className="w-4 h-4 text-secondary bg-surface-container border-outline-variant/30 rounded-[1px] focus:ring-secondary/20" />
            <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">Exclude Duplicates</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={guaranteeTypes} onChange={e => setGuaranteeTypes(e.target.checked)} className="w-4 h-4 text-secondary bg-surface-container border-outline-variant/30 rounded-[1px] focus:ring-secondary/20" />
            <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">Guarantee One of Each Selected Type</span>
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
          setLength(16); setUseUpper(true); setUseLower(true); setUseNumbers(true); setUseSymbols(true);
          setCustomSymbols(''); setExcludeAmbiguous(false); setExcludeDuplicate(false); setGuaranteeTypes(true); setQuantity(1);
        }} className="w-full bg-surface-container text-primary py-4 rounded-[1px] font-headline font-bold hover:bg-outline-variant/20 transition-all">
          RESET SETTINGS
        </button>
      </div>

      <div className="xl:col-span-8 space-y-8">
        <div className="bg-surface-container-low rounded-[1px] p-8 lg:p-12 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30">Generated Passwords</p>
            <div className="flex gap-2">
              {passwords.length > 1 && (
                <button onClick={copyAll} className="flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-outline-variant/20 text-primary rounded-[1px] font-bold text-xs uppercase tracking-wider transition-all">
                  <Copy className="w-4 h-4" /> Copy All
                </button>
              )}
              <button onClick={generate} className="flex items-center gap-2 px-4 py-2 bg-secondary text-white hover:bg-secondary/90 rounded-[1px] font-bold text-xs uppercase tracking-wider transition-all shadow-md">
                <RefreshCw className="w-4 h-4" /> Regenerate
              </button>
            </div>
          </div>
          
          {passwords.length > 0 ? (
            <div className="space-y-4">
              <div className="bg-surface-container p-6 rounded-[1px] border border-outline-variant/30 max-h-[400px] overflow-y-auto space-y-2">
                {passwords.map((pw, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0 group">
                    <span className="font-mono text-xl text-primary font-bold break-all pr-4">{pw}</span>
                    <CopyButton text={pw} className="opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0" />
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <StrengthMeter entropy={entropy} />
                <EntropyDisplay entropy={entropy} />
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-primary/30 font-headline text-xl font-bold">Select at least one character set</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
