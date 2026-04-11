import React, { useState, useEffect } from 'react';
import { Copy, Check, Trash2, Info } from 'lucide-react';
import { getStrengthLevel, HistoryEntry } from './passwordGeneratorUtils';

export function CopyButton({ text, className = '' }: { text: string, className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className={`p-2 rounded-[1px] transition-all ${copied ? 'bg-green-500/10 text-green-500' : 'bg-surface-container hover:bg-outline-variant/20 text-primary/50 hover:text-primary'} ${className}`}
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

export function StrengthMeter({ entropy }: { entropy: number }) {
  const strength = getStrengthLevel(entropy);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Strength</span>
        <span className={`text-xs font-bold ${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>
      </div>
      <div className="flex gap-1 h-2">
        {[1, 2, 3, 4, 5].map(level => (
          <div 
            key={level} 
            className={`flex-1 rounded-full transition-all duration-500 ${level <= strength.score ? strength.color : 'bg-surface-container'}`}
          />
        ))}
      </div>
    </div>
  );
}

export function EntropyDisplay({ entropy }: { entropy: number }) {
  return (
    <div className="flex items-center justify-between bg-surface-container p-4 rounded-[1px] border border-outline-variant/30">
      <div className="flex items-center gap-2">
        <span className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Entropy</span>
        <div className="group relative">
          <Info className="w-3 h-3 text-primary/30 cursor-help" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-surface-container-high text-primary text-[10px] rounded-[1px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-lg border border-outline-variant/30">
            Entropy measures the randomness and unpredictability of a password. Higher is better.
          </div>
        </div>
      </div>
      <span className="font-mono font-bold text-primary">{entropy.toFixed(1)} bits</span>
    </div>
  );
}

export function HistoryPanel({ history, onClear }: { history: HistoryEntry[], onClear: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  if (history.length === 0) return null;

  return (
    <div className="mt-12 border border-outline-variant/30 rounded-[1px] bg-surface-container-low overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between bg-surface-container hover:bg-outline-variant/10 transition-colors"
      >
        <span className="font-headline font-bold text-primary">Session History ({history.length})</span>
        <span className="text-xs font-bold text-primary/50 uppercase tracking-wider">{isOpen ? 'Hide' : 'Show'}</span>
      </button>
      
      {isOpen && (
        <div className="p-4 space-y-2">
          <div className="flex justify-end mb-4">
            <button onClick={onClear} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-[1px] transition-colors">
              <Trash2 className="w-3 h-3" /> Clear History
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
            {history.map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-surface-container rounded-[1px] border border-outline-variant/10">
                <div className="flex flex-col overflow-hidden">
                  <span className="font-mono text-sm text-primary truncate">{entry.value}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary/30">{entry.mode}</span>
                    <span className="text-[10px] text-primary/30">•</span>
                    <span className="text-[10px] text-primary/30">{entry.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
                <CopyButton text={entry.value} className="ml-4 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
