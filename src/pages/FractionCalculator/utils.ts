export type Fraction = { num: number; den: number };
export type MixedFraction = { whole: number; num: number; den: number };

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

export function simplify(f: Fraction): Fraction {
  if (f.den === 0) throw new Error("Denominator cannot be zero");
  if (f.num === 0) return { num: 0, den: 1 };
  
  let divisor = gcd(f.num, f.den);
  let num = f.num / divisor;
  let den = f.den / divisor;
  
  if (den < 0) {
    num = -num;
    den = -den;
  }
  
  return { num, den };
}

export function add(f1: Fraction, f2: Fraction): Fraction {
  return simplify({
    num: f1.num * f2.den + f2.num * f1.den,
    den: f1.den * f2.den
  });
}

export function subtract(f1: Fraction, f2: Fraction): Fraction {
  return simplify({
    num: f1.num * f2.den - f2.num * f1.den,
    den: f1.den * f2.den
  });
}

export function multiply(f1: Fraction, f2: Fraction): Fraction {
  return simplify({
    num: f1.num * f2.num,
    den: f1.den * f2.den
  });
}

export function divide(f1: Fraction, f2: Fraction): Fraction {
  if (f2.num === 0) throw new Error("Cannot divide by zero");
  return simplify({
    num: f1.num * f2.den,
    den: f1.den * f2.num
  });
}

export function toMixed(f: Fraction): MixedFraction {
  const simplified = simplify(f);
  const sign = simplified.num < 0 ? -1 : 1;
  const absNum = Math.abs(simplified.num);
  const whole = Math.floor(absNum / simplified.den) * sign;
  const num = absNum % simplified.den;
  return { whole, num, den: simplified.den };
}

export function fromMixed(m: MixedFraction): Fraction {
  const sign = m.whole < 0 || Object.is(m.whole, -0) || (m.whole === 0 && m.num < 0) ? -1 : 1;
  const absWhole = Math.abs(m.whole);
  const absNum = Math.abs(m.num);
  return {
    num: sign * (absWhole * m.den + absNum),
    den: m.den
  };
}

export function decimalToFraction(decimalStr: string, maxDen: number = 1000): Fraction {
  const x = parseFloat(decimalStr);
  if (isNaN(x)) throw new Error("Invalid decimal");
  
  const sign = x < 0 ? -1 : 1;
  let absX = Math.abs(x);
  
  const parts = decimalStr.split('.');
  if (parts.length === 2) {
    const decPart = parts[1];
    const den = Math.pow(10, decPart.length);
    const num = Math.round(absX * den);
    const exact = simplify({ num: sign * num, den });
    if (exact.den <= maxDen) return exact;
  }
  
  let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
  let b = absX;
  
  while (true) {
    let a = Math.floor(b);
    let h = a * h1 + h2;
    let k = a * k1 + k2;
    
    if (k > maxDen) break;
    
    h2 = h1; h1 = h;
    k2 = k1; k1 = k;
    
    if (b - a < 1e-10) break;
    b = 1 / (b - a);
  }
  
  return { num: sign * h1, den: k1 };
}

export function fractionToDecimal(f: Fraction): { decimal: string, isRepeating: boolean, repeatingBlock?: string } {
  if (f.den === 0) throw new Error("Denominator cannot be zero");
  let num = Math.abs(f.num);
  let den = Math.abs(f.den);
  const sign = f.num * f.den < 0 ? "-" : "";
  
  let whole = Math.floor(num / den);
  let rem = num % den;
  
  if (rem === 0) {
    return { decimal: `${sign}${whole}`, isRepeating: false };
  }
  
  let res = `${sign}${whole}.`;
  let rems = new Map<number, number>();
  let decPart = "";
  
  while (rem !== 0 && !rems.has(rem)) {
    rems.set(rem, decPart.length);
    rem *= 10;
    decPart += Math.floor(rem / den);
    rem %= den;
  }
  
  if (rem === 0) {
    return { decimal: res + decPart, isRepeating: false };
  } else {
    const repeatStart = rems.get(rem)!;
    const nonRepeating = decPart.substring(0, repeatStart);
    const repeating = decPart.substring(repeatStart);
    return { 
      decimal: `${res}${nonRepeating}(${repeating})`, 
      isRepeating: true,
      repeatingBlock: repeating
    };
  }
}
