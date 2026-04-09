import React, { useState, useEffect } from 'react';
import { evaluateExpression } from './utils';

interface ScientificModeProps {
  onHistoryAdd: (expr: string, res: string) => void;
}

export default function ScientificMode({ onHistoryAdd }: ScientificModeProps) {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [useRadians, setUseRadians] = useState(true);
  const [memory, setMemory] = useState<number>(0);

  const handleInput = (val: string) => {
    setExpression(prev => prev + val);
  };

  const calculate = () => {
    try {
      const res = evaluateExpression(expression, useRadians);
      setResult(res.toString());
      onHistoryAdd(expression, res.toString());
    } catch (e) {
      setResult('Error: undefined');
    }
  };

  const handleClear = () => {
    setExpression('');
    setResult('');
  };

  const handleDelete = () => {
    setExpression(prev => prev.slice(0, -1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') { e.preventDefault(); calculate(); }
      else if (e.key === 'Escape') handleClear();
      else if (e.key === 'Backspace') handleDelete();
      else if (/^[0-9.+\-*/()^%]$/.test(e.key)) handleInput(e.key);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, useRadians]);

  const buttons = [
    ['sin', 'cos', 'tan', 'sin⁻¹', 'cos⁻¹', 'tan⁻¹'],
    ['sinh', 'cosh', 'tanh', 'log', 'ln', 'log₂'],
    ['10ˣ', 'eˣ', 'x²', 'x³', 'xʸ', '√'],
    ['∛', 'ʸ√', '1/x', 'x!', 'nPr', 'nCr'],
    ['mod', 'π', 'e', 'Ans', '(', ')'],
    ['MC', 'MR', 'M+', 'M-', 'AC', 'DEL'],
    ['7', '8', '9', '÷', '%', '±'],
    ['4', '5', '6', '×', '', ''],
    ['1', '2', '3', '−', '', ''],
    ['0', '.', '=', '+', '', '']
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <button onClick={() => setUseRadians(!useRadians)} className="font-bold hover:text-indigo-600">
            {useRadians ? 'RAD' : 'DEG'}
          </button>
          {memory !== 0 && <span>M = {memory}</span>}
        </div>
        <div className="text-right text-lg text-slate-600 dark:text-slate-400 min-h-[28px] break-all">
          {expression}
        </div>
        <div className="text-right text-3xl font-bold text-slate-900 dark:text-white min-h-[40px] break-all">
          {result}
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {buttons.flat().map((btn, i) => (
          btn ? (
            <button
              key={i}
              onClick={() => {
                if (btn === '=') calculate();
                else if (btn === 'AC') handleClear();
                else if (btn === 'DEL') handleDelete();
                else if (btn === 'MC') setMemory(0);
                else if (btn === 'MR') handleInput(memory.toString());
                else if (btn === 'M+') setMemory(memory + Number(result || 0));
                else if (btn === 'M-') setMemory(memory - Number(result || 0));
                else if (btn === '±') setExpression(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev);
                else handleInput(btn.replace('ˣ', '^').replace('²', '^2').replace('³', '^3').replace('ʸ', '^'));
              }}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                ['=', 'AC', 'DEL'].includes(btn) ? 'bg-indigo-600 text-white hover:bg-indigo-700' :
                ['÷', '×', '−', '+'].includes(btn) ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600' :
                'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {btn}
            </button>
          ) : <div key={i} />
        ))}
      </div>
    </div>
  );
}
