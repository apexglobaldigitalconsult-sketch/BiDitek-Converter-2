import React, { useState, useEffect } from 'react';

export default function ProgrammerMode() {
  const [input, setInput] = useState('0');
  const [base, setBase] = useState<10|2|8|16>(10);
  const [bitLength, setBitLength] = useState<8|16|32>(32);
  
  const [bitA, setBitA] = useState('0');
  const [bitB, setBitB] = useState('0');
  const [shiftN, setShiftN] = useState('1');
  const [bitResult, setBitResult] = useState<number | null>(null);

  const parseValue = (val: string, b: number) => {
    if (!val) return 0;
    const parsed = parseInt(val, b);
    return isNaN(parsed) ? 0 : parsed;
  };

  const currentVal = parseValue(input, base);

  const formatValue = (val: number, b: number) => {
    let str = (val >>> 0).toString(b).toUpperCase();
    if (b === 2) str = str.padStart(bitLength, '0').slice(-bitLength);
    if (b === 16) str = str.padStart(bitLength / 4, '0').slice(-bitLength / 4);
    return str;
  };

  const handleBitOp = (op: string) => {
    const a = parseValue(bitA, 10);
    const b = parseValue(bitB, 10);
    const n = parseValue(shiftN, 10);
    let res = 0;
    
    switch (op) {
      case 'AND': res = a & b; break;
      case 'OR': res = a | b; break;
      case 'XOR': res = a ^ b; break;
      case 'NOT A': res = ~a; break;
      case 'NOT B': res = ~b; break;
      case 'LSH': res = a << n; break;
      case 'RSH': res = a >> n; break;
    }
    
    // Apply bit mask
    const mask = bitLength === 32 ? 0xFFFFFFFF : (1 << bitLength) - 1;
    setBitResult((res & mask) >>> 0);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Base Conversion</h3>
        <div className="flex gap-4 mb-4">
          <select 
            value={base} 
            onChange={(e) => setBase(Number(e.target.value) as any)}
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            <option value={10}>DEC</option>
            <option value={16}>HEX</option>
            <option value={8}>OCT</option>
            <option value={2}>BIN</option>
          </select>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            className="flex-1 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            placeholder="Enter value..."
          />
        </div>
        
        <div className="space-y-2">
          {[
            { label: 'HEX', b: 16 },
            { label: 'DEC', b: 10 },
            { label: 'OCT', b: 8 },
            { label: 'BIN', b: 2 }
          ].map(({ label, b }) => (
            <div 
              key={label}
              onClick={() => { setBase(b as any); setInput(formatValue(currentVal, b)); }}
              className="flex items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-900 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="w-12 font-bold text-slate-500">{label}</span>
              <span className="font-mono text-slate-900 dark:text-white break-all">{formatValue(currentVal, b)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Bitwise Operations</h3>
          <select 
            value={bitLength} 
            onChange={(e) => setBitLength(Number(e.target.value) as any)}
            className="p-1 text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            <option value={8}>8-bit</option>
            <option value={16}>16-bit</option>
            <option value={32}>32-bit</option>
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Input A (DEC)</label>
            <input type="number" value={bitA} onChange={(e) => setBitA(e.target.value)} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Input B (DEC)</label>
            <input type="number" value={bitB} onChange={(e) => setBitB(e.target.value)} className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
          </div>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {['AND', 'OR', 'XOR', 'NOT A', 'NOT B'].map(op => (
            <button key={op} onClick={() => handleBitOp(op)} className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 text-sm font-medium">
              {op}
            </button>
          ))}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-slate-500">n =</span>
            <input type="number" value={shiftN} onChange={(e) => setShiftN(e.target.value)} className="w-16 p-1 text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
            <button onClick={() => handleBitOp('LSH')} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 text-sm font-medium">A {'<<'} n</button>
            <button onClick={() => handleBitOp('RSH')} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 text-sm font-medium">A {'>>'} n</button>
          </div>
        </div>

        {bitResult !== null && (
          <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30">
            <div className="text-sm text-indigo-600 dark:text-indigo-400 mb-2 font-medium">Result</div>
            <div className="grid grid-cols-[40px_1fr] gap-2 text-sm">
              <span className="font-bold text-slate-500">DEC</span><span className="font-mono text-slate-900 dark:text-white">{bitResult}</span>
              <span className="font-bold text-slate-500">HEX</span><span className="font-mono text-slate-900 dark:text-white">{formatValue(bitResult, 16)}</span>
              <span className="font-bold text-slate-500">BIN</span><span className="font-mono text-slate-900 dark:text-white break-all">{formatValue(bitResult, 2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
