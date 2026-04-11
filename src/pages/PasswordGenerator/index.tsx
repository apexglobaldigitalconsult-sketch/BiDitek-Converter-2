import React, { useState } from 'react';
import RandomMode from './RandomMode';
import PassphraseMode from './PassphraseMode';
import PinMode from './PinMode';
import CheckerMode from './CheckerMode';
import { HistoryPanel } from './SharedComponents';
import { HistoryEntry } from './passwordGeneratorUtils';
import { ShieldCheck } from 'lucide-react';

export default function PasswordGenerator() {
  const [activeTab, setActiveTab] = useState<'random' | 'passphrase' | 'pin' | 'checker'>('random');
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const handleGenerate = (value: string, mode: string) => {
    setHistory(prev => {
      const newEntry: HistoryEntry = {
        id: Math.random().toString(),
        value,
        mode,
        timestamp: new Date()
      };
      return [newEntry, ...prev].slice(0, 20); // Keep last 20
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const tabs = [
    { id: 'random', label: 'Random Password' },
    { id: 'passphrase', label: 'Passphrase' },
    { id: 'pin', label: 'PIN' },
    { id: 'checker', label: 'Strength Checker' }
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary/50 text-sm font-bold uppercase tracking-widest mb-8">
          <span>Calculators</span>
          <span>/</span>
          <span>Security</span>
          <span>/</span>
          <span className="text-secondary">Password Generator</span>
        </div>
        <h1 className="font-headline text-4xl lg:text-6xl font-bold text-primary tracking-tight">
          Password Generator
        </h1>
        <p className="text-lg text-primary/60 max-w-2xl leading-relaxed">
          Generate secure, cryptographically random passwords, memorable passphrases, and PINs. 
          Analyze existing passwords for strength and vulnerabilities.
        </p>
        <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-4 py-2 rounded-[1px] inline-flex border border-green-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">All generation happens entirely in your browser. Nothing is transmitted or stored.</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-outline-variant/30 pb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all rounded-[1px] ${
              activeTab === tab.id 
                ? 'bg-primary text-surface shadow-md' 
                : 'bg-surface-container text-primary/50 hover:text-primary hover:bg-outline-variant/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[600px]">
        {activeTab === 'random' && <RandomMode onGenerate={handleGenerate} />}
        {activeTab === 'passphrase' && <PassphraseMode onGenerate={handleGenerate} />}
        {activeTab === 'pin' && <PinMode onGenerate={handleGenerate} />}
        {activeTab === 'checker' && <CheckerMode onSwitchToRandom={() => setActiveTab('random')} />}
      </div>

      <HistoryPanel history={history} onClear={clearHistory} />
    </div>
  );
}
