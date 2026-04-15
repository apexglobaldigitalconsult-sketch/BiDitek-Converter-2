import React, { useState, useEffect, useCallback } from 'react';
import { cryptoRandInt, calculateEntropy, COMMON_WORDS, EXTENDED_WORDS, NATO_ALPHABET } from './passwordGeneratorUtils';
import { CopyButton, StrengthMeter, EntropyDisplay } from './SharedComponents';
import { RefreshCw, Copy } from 'lucide-react';

export default function PassphraseMode({ onGenerate }: { onGenerate: (pw: string, mode: string) => void }) {
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [customSeparator, setCustomSeparator] = useState('');
  const [capitalize, setCapitalize] = useState<'none' | 'first' | 'all' | 'random'>('none');
  const [includeNumber, setIncludeNumber] = useState(false);
  const [includeSymbol, setIncludeSymbol] = useState(false);
  const [wordlist, setWordlist] = useState<'common' | 'extended' | 'nato'>('common');
  const [quantity, setQuantity] = useState(1);

  const [passphrases, setPassphrases] = useState<string[]>([]);
  const [entropy, setEntropy] = useState(0);

  const generate = useCallback(() => {
    let list: string[] = [];
    if (wordlist === 'common') list = COMMON_WORDS;
    else if (wordlist === 'extended') list = EXTENDED_WORDS;
    else if (wordlist === 'nato') list = NATO_ALPHABET;

    const sep = separator === 'custom' ? customSeparator : 
                separator === 'space' ? ' ' : 
                separator === 'none' ? '' : 
                separator === 'number' ? '' : separator;

    const newPassphrases: string[] = [];
    for (let q = 0; q < quantity; q++) {
      let words: string[] = [];
      for (let i = 0; i < wordCount; i++) {
        let word = list[cryptoRandInt(0, list.length - 1)];
        
        if (capitalize === 'first') word = word.charAt(0).toUpperCase() + word.slice(1);
        else if (capitalize === 'all') word = word.toUpperCase();
        else if (capitalize === 'random') {
          word = word.split('').map(c => cryptoRandInt(0, 1) === 1 ? c.toUpperCase() : c).join('');
        }
        
        words.push(word);
      }

      let finalPhrase = '';
      if (separator === 'number') {
        finalPhrase = words.map((w, i) => i < words.length - 1 ? w + cryptoRandInt(0, 9) : w).join('');
      } else {
        finalPhrase = words.join(sep);
      }

      if (includeNumber) {
        const num = cryptoRandInt(0, 9999).toString();
        const pos = cryptoRandInt(0, 2);
        if (pos === 0) finalPhrase = num + finalPhrase;
        else if (pos === 1) finalPhrase = finalPhrase + num;
        else {
          const insertIdx = cryptoRandInt(1, finalPhrase.length - 1);
          finalPhrase = finalPhrase.slice(0, insertIdx) + num + finalPhrase.slice(insertIdx);
        }
      }

      if (includeSymbol) {
        const syms = '!@#$%^&*()-_=+[]{}|;:,.<>?';
        const sym = syms[cryptoRandInt(0, syms.length - 1)];
        const pos = cryptoRandInt(0, 2);
        if (pos === 0) finalPhrase = sym + finalPhrase;
        else if (pos === 1) finalPhrase = finalPhrase + sym;
        else {
          const insertIdx = cryptoRandInt(1, finalPhrase.length - 1);
          finalPhrase = finalPhrase.slice(0, insertIdx) + sym + finalPhrase.slice(insertIdx);
        }
      }

      newPassphrases.push(finalPhrase);
      onGenerate(finalPhrase, 'Passphrase');
    }

    setPassphrases(newPassphrases);
    
    // Calculate entropy
    let baseEntropy = wordCount * Math.log2(list.length);
    if (includeNumber) baseEntropy += Math.log2(10000);
    if (includeSymbol) baseEntropy += Math.log2(26); // 26 symbols
    if (capitalize === 'random') baseEntropy += wordCount * 5; // approx 5 chars per word * 1 bit per char
    setEntropy(baseEntropy);

  }, [wordCount, separator, customSeparator, capitalize, includeNumber, includeSymbol, wordlist, quantity, onGenerate]);

  useEffect(() => {
    generate();
  }, [generate]);

  const copyAll = () => {
    navigator.clipboard.writeText(passphrases.join('\n'));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
      <div className="xl:col-span-4 bg-surface-container-low rounded-[1px] p-8 space-y-8 border border-outline-variant/30">
        <h3 className="font-headline text-xl font-bold text-primary">Settings</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Number of Words</label>
            <span className="font-mono font-bold text-secondary">{wordCount}</span>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="range" min="2" max="10" value={wordCount} 
              onChange={e => setWordCount(parseInt(e.target.value))}
              className="flex-1 accent-secondary"
            />
            <input 
              type="number" min="2" max="10" value={wordCount}
              onChange={e => setWordCount(parseInt(e.target.value))}
              className="w-16 bg-surface-container border-none p-2 text-center font-bold text-primary focus:ring-2 ring-secondary/20 rounded-[1px]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Wordlist</label>
          <select 
            value={wordlist} 
            onChange={e => setWordlist(e.target.value as 'common' | 'extended' | 'nato')}
            className="w-full bg-surface-container border-none p-4 text-sm font-bold text-primary focus:ring-2 ring-secondary/20 rounded-[1px]"
          >
            <option value="common">Common English (~300 words)</option>
            <option value="extended">Extended English (~450 words)</option>
            <option value="nato">NATO Phonetic Alphabet (26 words)</option>
          </select>
        </div>

        <div className="space-y-4">
          <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Separator</label>
          <select 
            value={separator} 
            onChange={e => setSeparator(e.target.value)}
            className="w-full bg-surface-container border-none p-4 text-sm font-bold text-primary focus:ring-2 ring-secondary/20 rounded-[1px]"
          >
            <option value="-">Hyphen (-)</option>
            <option value="_">Underscore (_)</option>
            <option value="space">Space ( )</option>
            <option value=".">Period (.)</option>
            <option value="number">Random Number</option>
            <option value="none">None</option>
            <option value="custom">Custom...</option>
          </select>
          {separator === 'custom' && (
            <input 
              type="text" 
              value={customSeparator} 
              onChange={e => setCustomSeparator(e.target.value)} 
              placeholder="Enter custom separator"
              className="w-full bg-surface-container border-none p-3 text-sm font-mono text-primary focus:ring-2 ring-secondary/20 rounded-[1px]"
            />
          )}
        </div>

        <div className="space-y-4">
          <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Capitalization</label>
          <select 
            value={capitalize} 
            onChange={e => setCapitalize(e.target.value as 'none' | 'first' | 'all' | 'random')}
            className="w-full bg-surface-container border-none p-4 text-sm font-bold text-primary focus:ring-2 ring-secondary/20 rounded-[1px]"
          >
            <option value="none">none</option>
            <option value="first">First Letter</option>
            <option value="all">ALL CAPS</option>
            <option value="random">rAnDoM</option>
          </select>
        </div>

        <div className="space-y-3 pt-4 border-t border-outline-variant/10">
          <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Additions</label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={includeNumber} onChange={e => setIncludeNumber(e.target.checked)} className="w-4 h-4 text-secondary bg-surface-container border-outline-variant/30 rounded-[1px] focus:ring-secondary/20" />
            <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">Include Random Number</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" checked={includeSymbol} onChange={e => setIncludeSymbol(e.target.checked)} className="w-4 h-4 text-secondary bg-surface-container border-outline-variant/30 rounded-[1px] focus:ring-secondary/20" />
            <span className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">Include Random Symbol</span>
          </label>
        </div>

        <div className="space-y-4 pt-4 border-t border-outline-variant/10">
          <div className="flex justify-between items-center">
            <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Quantity</label>
            <span className="font-mono font-bold text-secondary">{quantity}</span>
          </div>
          <input 
            type="range" min="1" max="10" value={quantity} 
            onChange={e => setQuantity(parseInt(e.target.value))}
            className="w-full accent-secondary"
          />
        </div>

        <button onClick={() => {
          setWordCount(4); setSeparator('-'); setCustomSeparator(''); setCapitalize('none'); 
          setIncludeNumber(false); setIncludeSymbol(false); setWordlist('common'); setQuantity(1);
        }} className="w-full bg-surface-container text-primary py-4 rounded-[1px] font-headline font-bold hover:bg-outline-variant/20 transition-all">
          RESET SETTINGS
        </button>
      </div>

      <div className="xl:col-span-8 space-y-8">
        <div className="bg-surface-container-low rounded-[1px] p-8 lg:p-12 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/30">Generated Passphrases</p>
            <div className="flex gap-2">
              {passphrases.length > 1 && (
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
              {passphrases.map((pw, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0 group">
                  <div className="flex flex-col">
                    <span className="font-mono text-xl text-primary font-bold break-all pr-4">{pw}</span>
                    <span className="text-[10px] text-primary/30 font-bold uppercase tracking-wider mt-1">{pw.length} chars</span>
                  </div>
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
