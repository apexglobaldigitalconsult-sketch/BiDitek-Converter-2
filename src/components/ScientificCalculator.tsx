import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isDegree, setIsDegree] = useState(true);
  const [memory, setMemory] = useState(0);
  const [lastAnswer, setLastAnswer] = useState(0);

  const handleNumber = (num: string) => {
    if (display === '0') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      let result: number;
      const fullEquation = equation + display;
      // Simple eval for basic arithmetic, but we should be careful
      // For a real app, use a math library like mathjs
      // Here we'll do a basic implementation
      const parts = fullEquation.split(' ');
      if (parts.length === 3) {
        const a = parseFloat(parts[0]);
        const op = parts[1];
        const b = parseFloat(parts[2]);
        switch (op) {
          case '+': result = a + b; break;
          case '-': result = a - b; break;
          case '×': result = a * b; break;
          case '÷': result = a / b; break;
          default: result = b;
        }
        setDisplay(result.toString());
        setEquation('');
        setLastAnswer(result);
      }
    } catch (e) {
      setDisplay('Error');
    }
  };

  const handleFunction = (fn: string) => {
    const val = parseFloat(display);
    let result: number = val;

    switch (fn) {
      case 'sin': result = isDegree ? Math.sin(val * Math.PI / 180) : Math.sin(val); break;
      case 'cos': result = isDegree ? Math.cos(val * Math.PI / 180) : Math.cos(val); break;
      case 'tan': result = isDegree ? Math.tan(val * Math.PI / 180) : Math.tan(val); break;
      case 'asin': result = isDegree ? Math.asin(val) * 180 / Math.PI : Math.asin(val); break;
      case 'acos': result = isDegree ? Math.acos(val) * 180 / Math.PI : Math.acos(val); break;
      case 'atan': result = isDegree ? Math.atan(val) * 180 / Math.PI : Math.atan(val); break;
      case 'sqrt': result = Math.sqrt(val); break;
      case 'sqr': result = Math.pow(val, 2); break;
      case 'cube': result = Math.pow(val, 3); break;
      case 'log': result = Math.log10(val); break;
      case 'ln': result = Math.log(val); break;
      case 'exp': result = Math.exp(val); break;
      case '10x': result = Math.pow(10, val); break;
      case 'inv': result = 1 / val; break;
      case 'fact': {
        let f = 1;
        for (let i = 1; i <= val; i++) f *= i;
        result = f;
        break;
      }
      case 'pi': result = Math.PI; break;
      case 'e': result = Math.E; break;
      case 'rnd': result = Math.random(); break;
      case 'abs': result = Math.abs(val); break;
      case 'neg': result = -val; break;
    }

    setDisplay(result.toString());
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const Button = ({ children, onClick, className, variant = 'default' }: any) => (
    <button
      onClick={onClick}
      className={cn(
        "h-10 text-[11px] font-bold rounded-[1px] transition-all flex items-center justify-center border border-outline-variant/20",
        variant === 'default' && "bg-surface-container hover:bg-surface-container-high text-primary",
        variant === 'action' && "bg-secondary text-white hover:opacity-90",
        variant === 'operator' && "bg-primary text-background hover:opacity-90",
        variant === 'function' && "bg-surface-container-high hover:bg-surface-container-highest text-primary/80",
        className
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-surface-container-low p-6 rounded-[1px] border border-outline-variant/30 shadow-sm max-w-2xl mx-auto w-full">
      {/* Display */}
      <div className="bg-primary p-4 rounded-[1px] mb-4 text-right overflow-hidden">
        <div className="text-background/60 text-[10px] font-mono h-4 mb-1">{equation}</div>
        <div className="text-background text-3xl font-mono font-bold truncate">{display}</div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-10 gap-1">
        {/* Row 1 */}
        <Button onClick={() => handleFunction('sin')} variant="function" className="col-span-2">sin</Button>
        <Button onClick={() => handleFunction('cos')} variant="function" className="col-span-2">cos</Button>
        <Button onClick={() => handleFunction('tan')} variant="function" className="col-span-2">tan</Button>
        <div className="col-span-4 flex items-center justify-center gap-2 bg-surface-container rounded-[1px] text-[10px] font-bold">
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="radio" checked={isDegree} onChange={() => setIsDegree(true)} className="accent-secondary" /> Deg
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input type="radio" checked={!isDegree} onChange={() => setIsDegree(false)} className="accent-secondary" /> Rad
          </label>
        </div>

        {/* Row 2 */}
        <Button onClick={() => handleFunction('asin')} variant="function" className="col-span-2">sin⁻¹</Button>
        <Button onClick={() => handleFunction('acos')} variant="function" className="col-span-2">cos⁻¹</Button>
        <Button onClick={() => handleFunction('atan')} variant="function" className="col-span-2">tan⁻¹</Button>
        <Button onClick={() => handleFunction('pi')} variant="function" className="col-span-2">π</Button>
        <Button onClick={() => handleFunction('e')} variant="function" className="col-span-2">e</Button>

        {/* Row 3 */}
        <Button onClick={() => handleFunction('pow')} variant="function" className="col-span-2">xʸ</Button>
        <Button onClick={() => handleFunction('cube')} variant="function" className="col-span-2">x³</Button>
        <Button onClick={() => handleFunction('sqr')} variant="function" className="col-span-2">x²</Button>
        <Button onClick={() => handleFunction('exp')} variant="function" className="col-span-2">eˣ</Button>
        <Button onClick={() => handleFunction('10x')} variant="function" className="col-span-2">10ˣ</Button>

        {/* Row 4 */}
        <Button onClick={() => handleFunction('yroot')} variant="function" className="col-span-2">ʸ√x</Button>
        <Button onClick={() => handleFunction('croot')} variant="function" className="col-span-2">³√x</Button>
        <Button onClick={() => handleFunction('sqrt')} variant="function" className="col-span-2">√x</Button>
        <Button onClick={() => handleFunction('ln')} variant="function" className="col-span-2">ln</Button>
        <Button onClick={() => handleFunction('log')} variant="function" className="col-span-2">log</Button>

        {/* Row 5 */}
        <Button onClick={() => handleNumber('(')} variant="function" className="col-span-2">(</Button>
        <Button onClick={() => handleNumber(')')} variant="function" className="col-span-2">)</Button>
        <Button onClick={() => handleFunction('inv')} variant="function" className="col-span-2">1/x</Button>
        <Button onClick={() => handleOperator('%')} variant="function" className="col-span-2">%</Button>
        <Button onClick={() => handleFunction('fact')} variant="function" className="col-span-2">n!</Button>

        {/* Number Pad & Basic Ops */}
        <div className="col-span-10 grid grid-cols-5 gap-1 mt-2">
          <Button onClick={() => handleNumber('7')}>7</Button>
          <Button onClick={() => handleNumber('8')}>8</Button>
          <Button onClick={() => handleNumber('9')}>9</Button>
          <Button onClick={() => handleOperator('+')} variant="operator">+</Button>
          <Button onClick={backspace} variant="function">Back</Button>

          <Button onClick={() => handleNumber('4')}>4</Button>
          <Button onClick={() => handleNumber('5')}>5</Button>
          <Button onClick={() => handleNumber('6')}>6</Button>
          <Button onClick={() => handleOperator('-')} variant="operator">-</Button>
          <Button onClick={() => setDisplay(lastAnswer.toString())} variant="function">Ans</Button>

          <Button onClick={() => handleNumber('1')}>1</Button>
          <Button onClick={() => handleNumber('2')}>2</Button>
          <Button onClick={() => handleNumber('3')}>3</Button>
          <Button onClick={() => handleOperator('×')} variant="operator">×</Button>
          <Button onClick={() => setMemory(memory + parseFloat(display))} variant="function">M+</Button>

          <Button onClick={() => handleNumber('0')}>0</Button>
          <Button onClick={() => handleNumber('.')}>.</Button>
          <Button onClick={() => handleFunction('exp')} variant="function">EXP</Button>
          <Button onClick={() => handleOperator('÷')} variant="operator">÷</Button>
          <Button onClick={() => setMemory(memory - parseFloat(display))} variant="function">M-</Button>

          <Button onClick={() => handleFunction('neg')}>±</Button>
          <Button onClick={() => handleFunction('rnd')}>RND</Button>
          <Button onClick={clear} variant="action">AC</Button>
          <Button onClick={calculate} variant="operator">=</Button>
          <Button onClick={() => setDisplay(memory.toString())} variant="function">MR</Button>
        </div>
      </div>
    </div>
  );
}
