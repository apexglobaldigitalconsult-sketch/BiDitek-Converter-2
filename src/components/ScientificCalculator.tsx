import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { create, all } from 'mathjs';

const math = create(all);

let currentIsDegree = true;

// Override trigonometric functions to support degrees
math.import({
  sin: (x: any) => currentIsDegree ? Math.sin(Number(x) * Math.PI / 180) : Math.sin(Number(x)),
  cos: (x: any) => currentIsDegree ? Math.cos(Number(x) * Math.PI / 180) : Math.cos(Number(x)),
  tan: (x: any) => currentIsDegree ? Math.tan(Number(x) * Math.PI / 180) : Math.tan(Number(x)),
  asin: (x: any) => currentIsDegree ? Math.asin(Number(x)) * 180 / Math.PI : Math.asin(Number(x)),
  acos: (x: any) => currentIsDegree ? Math.acos(Number(x)) * 180 / Math.PI : Math.acos(Number(x)),
  atan: (x: any) => currentIsDegree ? Math.atan(Number(x)) * 180 / Math.PI : Math.atan(Number(x)),
}, { override: true });

export default function ScientificCalculator() {
  const [expression, setExpression] = useState('0');
  const [equation, setEquation] = useState('');
  const [isDegree, setIsDegree] = useState(true);
  const [memory, setMemory] = useState(0);
  const [lastAnswer, setLastAnswer] = useState(0);

  useEffect(() => {
    currentIsDegree = isDegree;
  }, [isDegree]);

  const append = (val: string) => {
    setExpression(prev => {
      if (prev.startsWith('Error') || (prev === '0' && !['+', '-', '×', '÷', '%', '^', '.', '!', 'E'].includes(val))) {
        return val;
      }
      return prev + val;
    });
  };

  const calculate = () => {
    try {
      if (!expression) return;
      let evalExpr = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '/100');
      const res = math.evaluate(evalExpr, { Ans: lastAnswer });
      
      if (typeof res === 'number') {
        if (!isFinite(res)) {
          setExpression('Error: Div by 0');
          setEquation(expression + ' =');
          return;
        }
        const formatted = math.format(res, { precision: 14 });
        setEquation(expression + ' =');
        setExpression(formatted);
        setLastAnswer(res);
      } else if (res && res.isComplex) {
        setExpression('Error: Complex');
        setEquation(expression + ' =');
      } else {
        setExpression(res.toString());
        setEquation(expression + ' =');
      }
    } catch (e) {
      setExpression('Error');
      setEquation(expression + ' =');
    }
  };

  const clear = () => {
    setExpression('0');
    setEquation('');
  };

  const backspace = () => {
    setExpression(prev => {
      if (prev.startsWith('Error')) return '0';
      if (prev.length > 1) return prev.slice(0, -1);
      return '0';
    });
  };

  const toggleSign = () => {
    setExpression(prev => {
      if (prev.startsWith('Error')) return '0';
      const match = prev.match(/(^|[-+×÷(])(-?\d+\.?\d*)$/);
      if (match) {
        const num = match[2];
        const prefix = prev.slice(0, prev.length - num.length);
        if (num.startsWith('-')) {
          return prefix + num.slice(1);
        } else {
          return prefix + '-' + num;
        }
      }
      return prev + '-';
    });
  };

  const handleMemory = (op: string) => {
    let val = 0;
    try {
      let evalExpr = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '/100');
      const res = math.evaluate(evalExpr, { Ans: lastAnswer });
      val = typeof res === 'number' ? res : 0;
    } catch (e) {
      val = 0;
    }

    if (op === 'M+') setMemory(memory + val);
    if (op === 'M-') setMemory(memory - val);
    if (op === 'MR') append(memory.toString());
  };

  const Button = ({ children, onClick, className, variant = 'default' }: any) => (
    <button
      onClick={onClick}
      className={cn(
        "h-10 text-[11px] font-bold rounded-[1px] transition-all flex items-center justify-center border border-outline-variant/20",
        variant === 'default' && "bg-surface-container hover:bg-surface-container-high text-primary",
        variant === 'action' && "bg-secondary text-white hover:opacity-90",
        variant === 'operator' && "bg-secondary text-white shadow-sm hover:bg-secondary/90 dark:bg-background dark:text-primary dark:shadow-none dark:hover:bg-surface-container-low dark:border-outline-variant/20",
        variant === 'function' && "bg-surface-container-high hover:bg-surface-container-highest text-primary/80",
        className
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-surface-container-low p-6 rounded-[1px] border border-outline-variant/30 shadow-sm w-full">
      {/* Display */}
      <div className="bg-surface-container-highest p-4 rounded-[1px] mb-4 text-right overflow-hidden border border-outline-variant/30 shadow-inner flex flex-col justify-end h-24">
        <div className="text-primary/60 text-[12px] font-mono h-5 mb-1 truncate">{equation}</div>
        <div className="text-primary text-3xl font-mono font-bold break-all leading-tight max-h-16 overflow-y-auto scrollbar-hide">{expression}</div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-2">
        {/* Functions */}
        <div className="flex-1 grid grid-cols-5 gap-1">
          {/* Row 1 */}
          <Button onClick={() => append('sin(')} variant="function">sin</Button>
          <Button onClick={() => append('cos(')} variant="function">cos</Button>
          <Button onClick={() => append('tan(')} variant="function">tan</Button>
          <div className="col-span-2 flex items-center justify-center gap-2 bg-surface-container rounded-[1px] text-[10px] font-bold">
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="radio" checked={isDegree} onChange={() => setIsDegree(true)} className="accent-secondary" /> Deg
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="radio" checked={!isDegree} onChange={() => setIsDegree(false)} className="accent-secondary" /> Rad
            </label>
          </div>

          {/* Row 2 */}
          <Button onClick={() => append('asin(')} variant="function">sin⁻¹</Button>
          <Button onClick={() => append('acos(')} variant="function">cos⁻¹</Button>
          <Button onClick={() => append('atan(')} variant="function">tan⁻¹</Button>
          <Button onClick={() => append('pi')} variant="function">π</Button>
          <Button onClick={() => append('e')} variant="function">e</Button>

          {/* Row 3 */}
          <Button onClick={() => append('^')} variant="function">xʸ</Button>
          <Button onClick={() => append('^3')} variant="function">x³</Button>
          <Button onClick={() => append('^2')} variant="function">x²</Button>
          <Button onClick={() => append('e^')} variant="function">eˣ</Button>
          <Button onClick={() => append('10^')} variant="function">10ˣ</Button>

          {/* Row 4 */}
          <Button onClick={() => append('^(1/')} variant="function">ʸ√x</Button>
          <Button onClick={() => append('cbrt(')} variant="function">³√x</Button>
          <Button onClick={() => append('sqrt(')} variant="function">√x</Button>
          <Button onClick={() => append('log(')} variant="function">ln</Button>
          <Button onClick={() => append('log10(')} variant="function">log</Button>

          {/* Row 5 */}
          <Button onClick={() => append('(')} variant="function">(</Button>
          <Button onClick={() => append(')')} variant="function">)</Button>
          <Button onClick={() => append('^-1')} variant="function">1/x</Button>
          <Button onClick={() => append('%')} variant="operator">%</Button>
          <Button onClick={() => append('!')} variant="function">n!</Button>
        </div>

        {/* Number Pad & Basic Ops */}
        <div className="flex-1 grid grid-cols-5 gap-1">
          <Button onClick={() => append('7')}>7</Button>
          <Button onClick={() => append('8')}>8</Button>
          <Button onClick={() => append('9')}>9</Button>
          <Button onClick={() => append('+')} variant="operator">+</Button>
          <Button onClick={backspace} variant="function">Back</Button>

          <Button onClick={() => append('4')}>4</Button>
          <Button onClick={() => append('5')}>5</Button>
          <Button onClick={() => append('6')}>6</Button>
          <Button onClick={() => append('-')} variant="operator">-</Button>
          <Button onClick={() => append('Ans')} variant="function">Ans</Button>

          <Button onClick={() => append('1')}>1</Button>
          <Button onClick={() => append('2')}>2</Button>
          <Button onClick={() => append('3')}>3</Button>
          <Button onClick={() => append('×')} variant="operator">×</Button>
          <Button onClick={() => handleMemory('M+')} variant="function">M+</Button>

          <Button onClick={() => append('0')}>0</Button>
          <Button onClick={() => append('.')}>.</Button>
          <Button onClick={() => append('E')} variant="function">EXP</Button>
          <Button onClick={() => append('÷')} variant="operator">÷</Button>
          <Button onClick={() => handleMemory('M-')} variant="function">M-</Button>

          <Button onClick={toggleSign}>±</Button>
          <Button onClick={() => append('random()')}>RND</Button>
          <Button onClick={clear} variant="action">AC</Button>
          <Button onClick={calculate} variant="operator">=</Button>
          <Button onClick={() => handleMemory('MR')} variant="function">MR</Button>
        </div>
      </div>
    </div>
  );
}
