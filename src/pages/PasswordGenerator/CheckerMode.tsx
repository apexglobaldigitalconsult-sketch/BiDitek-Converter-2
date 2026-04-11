import React, { useState, useEffect } from 'react';
import { calculateEntropy, getStrengthLevel, estimateCrackTimes, COMMON_PASSWORDS } from './passwordGeneratorUtils';
import { Eye, EyeOff, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CheckerMode({ onSwitchToRandom }: { onSwitchToRandom: () => void }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [entropy, setEntropy] = useState(0);
  const [strength, setStrength] = useState(getStrengthLevel(0));
  const [crackTimes, setCrackTimes] = useState(estimateCrackTimes(0, 0));
  const [warnings, setWarnings] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [stats, setStats] = useState({ upper: 0, lower: 0, digits: 0, symbols: 0, length: 0, unique: 0, charsetSize: 0 });

  useEffect(() => {
    if (!password) {
      setEntropy(0);
      setStrength(getStrengthLevel(0));
      setCrackTimes(estimateCrackTimes(0, 0));
      setWarnings([]);
      setSuggestions([]);
      setStats({ upper: 0, lower: 0, digits: 0, symbols: 0, length: 0, unique: 0, charsetSize: 0 });
      return;
    }

    let upper = 0, lower = 0, digits = 0, symbols = 0;
    const uniqueChars = new Set(password.split(''));
    
    for (const char of password) {
      if (/[A-Z]/.test(char)) upper++;
      else if (/[a-z]/.test(char)) lower++;
      else if (/[0-9]/.test(char)) digits++;
      else symbols++;
    }

    let charsetSize = 0;
    if (upper > 0) charsetSize += 26;
    if (lower > 0) charsetSize += 26;
    if (digits > 0) charsetSize += 10;
    if (symbols > 0) charsetSize += 32; // Approx symbol count

    const ent = calculateEntropy(charsetSize, password.length);
    setEntropy(ent);
    setStrength(getStrengthLevel(ent));
    setCrackTimes(estimateCrackTimes(charsetSize, password.length));
    setStats({ upper, lower, digits, symbols, length: password.length, unique: uniqueChars.size, charsetSize });

    const newWarnings: string[] = [];
    const newSuggestions: string[] = [];

    if (password.length < 8) {
      newWarnings.push("Password is too short.");
      newSuggestions.push("Increase length to at least 12-16 characters.");
    } else if (password.length < 12) {
      newWarnings.push("Password length is marginal.");
      newSuggestions.push("Consider increasing length to 16+ characters for better security.");
    }

    if (COMMON_PASSWORDS.has(password.toLowerCase())) {
      newWarnings.push("This is a very common password.");
      newSuggestions.push("Never use common dictionary words or predictable sequences.");
    }

    if (/^[a-zA-Z]+$/.test(password)) {
      newWarnings.push("Password contains only letters.");
      newSuggestions.push("Add numbers and symbols to increase complexity.");
    } else if (/^[0-9]+$/.test(password)) {
      newWarnings.push("Password contains only numbers.");
      newSuggestions.push("Add letters and symbols. Numeric-only passwords are easily cracked.");
    }

    if (/(.)\1{2,}/.test(password)) {
      newWarnings.push("Contains repeated characters (e.g., 'aaa').");
      newSuggestions.push("Avoid repeating the same character multiple times.");
    }

    if (/(123|234|345|456|567|678|789|890|098|987|876|765|654|543|432|321|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
      newWarnings.push("Contains sequential characters or keyboard walks.");
      newSuggestions.push("Avoid sequences like '123' or 'abc'.");
    }

    if (/(19|20)\d{2}/.test(password)) {
      newWarnings.push("Contains a likely year or date.");
      newSuggestions.push("Avoid using birth years or significant dates.");
    }

    if (upper === 0 && lower > 0) newSuggestions.push("Add uppercase letters.");
    if (symbols === 0) newSuggestions.push("Add special symbols.");

    setWarnings(newWarnings);
    setSuggestions(newSuggestions);

  }, [password]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
      <div className="xl:col-span-12 bg-surface-container-low rounded-[1px] p-8 lg:p-12 border border-outline-variant/30 shadow-sm space-y-8">
        
        <div className="space-y-4">
          <label className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Enter Password to Check</label>
          <div className="relative bg-surface-container rounded-[1px] flex items-center px-6 focus-within:ring-4 ring-secondary/5 transition-all border border-transparent focus-within:border-outline-variant">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Type a password..." 
              autoComplete="off"
              spellCheck="false"
              className="w-full bg-transparent border-none py-6 text-2xl font-mono font-bold focus:ring-0 text-primary" 
            />
            <button 
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 text-primary/50 hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {password && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-outline-variant/10">
            {/* Left Column: Strength & Crack Times */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="font-headline text-2xl font-bold text-primary">Strength Overview</span>
                  <span className={`text-xl font-bold ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>
                </div>
                <div className="flex gap-1 h-3">
                  {[1, 2, 3, 4, 5].map(level => (
                    <div 
                      key={level} 
                      className={`flex-1 rounded-full transition-all duration-500 ${level <= strength.score ? strength.color : 'bg-surface-container'}`}
                    />
                  ))}
                </div>
                <p className="font-mono text-sm text-primary/50 text-right">Entropy: <span className="font-bold text-primary">{entropy.toFixed(1)} bits</span></p>
              </div>

              <div className="bg-surface-container p-6 rounded-[1px] border border-outline-variant/30 space-y-4">
                <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Estimated Crack Times</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-primary/70">Online Attack (Throttled)</span>
                    <span className="font-mono font-bold text-primary">{crackTimes.onlineThrottled}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-primary/70">Online Attack (Fast)</span>
                    <span className="font-mono font-bold text-primary">{crackTimes.onlineFast}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-primary/70">Offline Attack (bcrypt)</span>
                    <span className="font-mono font-bold text-primary">{crackTimes.offlineBcrypt}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-primary/70">Offline Attack (MD5/SHA1)</span>
                    <span className="font-mono font-bold text-primary">{crackTimes.offlineFast}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Composition & Warnings */}
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-surface-container p-4 rounded-[1px] text-center border border-outline-variant/30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-1">Length</p>
                  <p className="font-mono font-bold text-xl text-primary">{stats.length}</p>
                </div>
                <div className="bg-surface-container p-4 rounded-[1px] text-center border border-outline-variant/30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-1">Unique</p>
                  <p className="font-mono font-bold text-xl text-primary">{stats.unique}</p>
                </div>
                <div className="bg-surface-container p-4 rounded-[1px] text-center border border-outline-variant/30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-1">Charset</p>
                  <p className="font-mono font-bold text-xl text-primary">{stats.charsetSize}</p>
                </div>
                <div className="bg-surface-container p-4 rounded-[1px] text-center border border-outline-variant/30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary/50 mb-1">Types</p>
                  <div className="flex justify-center gap-1 mt-1">
                    <span className={`w-2 h-2 rounded-full ${stats.upper ? 'bg-secondary' : 'bg-outline-variant/30'}`} title="Uppercase" />
                    <span className={`w-2 h-2 rounded-full ${stats.lower ? 'bg-secondary' : 'bg-outline-variant/30'}`} title="Lowercase" />
                    <span className={`w-2 h-2 rounded-full ${stats.digits ? 'bg-secondary' : 'bg-outline-variant/30'}`} title="Digits" />
                    <span className={`w-2 h-2 rounded-full ${stats.symbols ? 'bg-secondary' : 'bg-outline-variant/30'}`} title="Symbols" />
                  </div>
                </div>
              </div>

              {warnings.length > 0 && (
                <div className="space-y-3">
                  <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-red-500/70">Warnings</p>
                  {warnings.map((w, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-red-500/10 text-red-600 rounded-[1px] border border-red-500/20">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="text-sm font-bold">{w}</span>
                    </div>
                  ))}
                </div>
              )}

              {suggestions.length > 0 && (
                <div className="space-y-3">
                  <p className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-secondary/70">Suggestions</p>
                  {suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-surface-container rounded-[1px] border border-outline-variant/30">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-secondary" />
                      <span className="text-sm text-primary">{s}</span>
                    </div>
                  ))}
                </div>
              )}

              {strength.score < 4 && (
                <button 
                  onClick={onSwitchToRandom}
                  className="w-full flex items-center justify-center gap-2 bg-secondary text-white py-4 rounded-[1px] font-headline font-bold hover:bg-secondary/90 transition-all shadow-md"
                >
                  Generate a Stronger Version <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
