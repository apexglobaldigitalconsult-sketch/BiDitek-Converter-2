import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

export default function LoanCalculator() {
  // Amortized Loan State
  const [amortizedAmount, setAmortizedAmount] = useState('100000');
  const [amortizedYears, setAmortizedYears] = useState('10');
  const [amortizedMonths, setAmortizedMonths] = useState('0');
  const [amortizedRate, setAmortizedRate] = useState('6');
  const [amortizedCompound, setAmortizedCompound] = useState('Monthly (APR)');
  const [amortizedPayBack, setAmortizedPayBack] = useState('Every Month');

  // Deferred Payment Loan State
  const [deferredAmount, setDeferredAmount] = useState('100000');
  const [deferredYears, setDeferredYears] = useState('10');
  const [deferredMonths, setDeferredMonths] = useState('0');
  const [deferredRate, setDeferredRate] = useState('6');
  const [deferredCompound, setDeferredCompound] = useState('Annually (APY)');

  // Bond State
  const [bondAmount, setBondAmount] = useState('100000');
  const [bondYears, setBondYears] = useState('10');
  const [bondMonths, setBondMonths] = useState('0');
  const [bondRate, setBondRate] = useState('6');
  const [bondCompound, setBondCompound] = useState('Annually (APY)');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const calculateAmortized = () => {
    const P = parseFloat(amortizedAmount) || 0;
    const r = (parseFloat(amortizedRate) || 0) / 100 / 12;
    const n = (parseFloat(amortizedYears) || 0) * 12 + (parseFloat(amortizedMonths) || 0);

    let payment = 0;
    if (r > 0) {
      payment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else if (n > 0) {
      payment = P / n;
    }

    const totalPayments = payment * n;
    const totalInterest = totalPayments - P;

    return { payment, totalPayments, totalInterest, principal: P };
  };

  const calculateDeferred = () => {
    const P = parseFloat(deferredAmount) || 0;
    const r = (parseFloat(deferredRate) || 0) / 100;
    const t = (parseFloat(deferredYears) || 0) + (parseFloat(deferredMonths) || 0) / 12;

    const amountDue = P * Math.pow(1 + r, t);
    const totalInterest = amountDue - P;

    return { amountDue, totalInterest, principal: P };
  };

  const calculateBond = () => {
    const A = parseFloat(bondAmount) || 0;
    const r = (parseFloat(bondRate) || 0) / 100;
    const t = (parseFloat(bondYears) || 0) + (parseFloat(bondMonths) || 0) / 12;

    const P = A / Math.pow(1 + r, t);
    const totalInterest = A - P;

    return { amountReceived: P, totalInterest, principal: A };
  };

  const amortizedResults = useMemo(() => calculateAmortized(), [amortizedAmount, amortizedYears, amortizedMonths, amortizedRate, amortizedCompound, amortizedPayBack]);
  const deferredResults = useMemo(() => calculateDeferred(), [deferredAmount, deferredYears, deferredMonths, deferredRate, deferredCompound]);
  const bondResults = useMemo(() => calculateBond(), [bondAmount, bondYears, bondMonths, bondRate, bondCompound]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans">
      <div className="flex justify-between items-center text-sm text-primary/60 mb-4">
        <div>
          <a href="#" className="hover:underline">home</a> / <a href="#" className="hover:underline">financial</a> / loan calculator
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-6 text-primary">Loan Calculator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-9 space-y-8">
          
          <div className="text-sm text-primary/80 leading-relaxed">
            <p className="mb-4">A loan is a contract between a borrower and a lender in which the borrower receives an amount of money (principal) that they are obligated to pay back in the future. Most loans can be categorized into one of three categories:</p>
            <ol className="list-decimal pl-8 space-y-1 mb-6">
              <li><strong>Amortized Loan:</strong> <a href="#" className="text-secondary hover:underline">Fixed payments paid periodically until loan maturity</a></li>
              <li><strong>Deferred Payment Loan:</strong> <a href="#" className="text-secondary hover:underline">Single lump sum paid at loan maturity</a></li>
              <li><strong>Bond:</strong> <a href="#" className="text-secondary hover:underline">Predetermined lump sum paid at loan maturity (the face or par value of a bond)</a></li>
            </ol>
          </div>

          <div className="bg-secondary text-white p-2 rounded-[1px] flex items-center justify-center gap-2 cursor-pointer text-sm font-bold shadow-sm">
            <div className="w-4 h-4 bg-white rounded-[1px] flex items-center justify-center text-blue-600 text-xs">▼</div>
            Modify the values and click the Calculate button to use
          </div>

          {/* Amortized Loan Section */}
          <div>
            <h2 className="text-xl font-bold text-secondary mb-2">Amortized Loan: Paying Back a Fixed Amount Periodically</h2>
            <p className="text-sm text-primary/80 mb-4">Use this calculator for basic calculations of common loan types such as <a href="#" className="text-secondary hover:underline">mortgages</a>, <a href="#" className="text-secondary hover:underline">auto loans</a>, <a href="#" className="text-secondary hover:underline">student loans</a>, or <a href="#" className="text-secondary hover:underline">personal loans</a>, or click the links for more detail on each.</p>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Inputs */}
              <div className="bg-surface-container p-4 rounded-[1px] border border-outline-variant w-full md:w-[350px] flex-shrink-0">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Loan Amount</label>
                    <div className="relative w-40">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                      <input type="number" value={amortizedAmount} onChange={(e) => setAmortizedAmount(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Loan Term</label>
                    <div className="flex gap-1 w-40">
                      <div className="relative w-1/2">
                        <input type="number" value={amortizedYears} onChange={(e) => setAmortizedYears(e.target.value)} className="w-full pr-8 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-xs">years</span>
                      </div>
                      <div className="relative w-1/2">
                        <input type="number" value={amortizedMonths} onChange={(e) => setAmortizedMonths(e.target.value)} className="w-full pr-10 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-primary/50 text-xs">months</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Interest Rate</label>
                    <div className="relative w-40">
                      <input type="number" step="0.01" value={amortizedRate} onChange={(e) => setAmortizedRate(e.target.value)} className="w-full pr-6 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Compound</label>
                    <select value={amortizedCompound} onChange={(e) => setAmortizedCompound(e.target.value)} className="w-40 py-1 px-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary">
                      <option>Monthly (APR)</option>
                      <option>Annually (APY)</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Pay Back</label>
                    <select value={amortizedPayBack} onChange={(e) => setAmortizedPayBack(e.target.value)} className="w-40 py-1 px-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary">
                      <option>Every Month</option>
                      <option>Every Year</option>
                    </select>
                  </div>
                  <div className="flex justify-center gap-2 pt-2">
                    <button className="bg-[#4caf50] hover:bg-[#45a049] text-white px-4 py-1.5 rounded-[1px] font-bold flex items-center gap-1 shadow-sm">
                      Calculate <span className="text-xs bg-white text-[#4caf50] rounded-[1px] w-4 h-4 flex items-center justify-center">▶</span>
                    </button>
                    <button className="bg-[#9e9e9e] hover:bg-[#8e8e8e] text-white px-4 py-1.5 rounded-[1px] font-bold shadow-sm">
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="flex-1">
                <div className="bg-[#7cb342] text-white p-2 font-bold flex justify-between items-center">
                  <span>Results:</span>
                  <div className="w-4 h-4 border border-white flex items-center justify-center text-[10px]">💾</div>
                </div>
                <div className="p-4 border border-outline-variant border-t-0 text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-primary/90">Payment Every Month</span>
                    <span className="font-bold text-primary">{formatCurrency(amortizedResults.payment)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-primary/90">Total of {parseFloat(amortizedYears) * 12 + parseFloat(amortizedMonths) || 120} Payments</span>
                    <span className="font-bold text-primary">{formatCurrency(amortizedResults.totalPayments)}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-primary/90">Total Interest</span>
                    <span className="font-bold text-primary">{formatCurrency(amortizedResults.totalInterest)}</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-6 mt-6">
                    <div className="w-20 h-20 relative">
                      <div className="w-full h-full rounded-[1px]" style={{
                        background: `conic-gradient(#3b82f6 0% ${(amortizedResults.principal/amortizedResults.totalPayments)*100}%, #8bc34a ${(amortizedResults.principal/amortizedResults.totalPayments)*100}% 100%)`
                      }}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-surface-container-low rounded-[1px]"></div>
                      </div>
                      <div className="absolute top-1/2 left-2 -translate-y-1/2 text-[10px] font-bold text-white drop-shadow-md">{Math.round((amortizedResults.principal/amortizedResults.totalPayments)*100)}%</div>
                      <div className="absolute top-1/2 right-2 -translate-y-1/2 text-[10px] font-bold text-white drop-shadow-md">{Math.round((amortizedResults.totalInterest/amortizedResults.totalPayments)*100)}%</div>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500"></div> <span className="text-primary/80">Principal</span></div>
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#8bc34a]"></div> <span className="text-primary/80">Interest</span></div>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <a href="#" className="text-secondary hover:underline text-sm">View Amortization Table</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deferred Payment Loan Section */}
          <div>
            <h2 className="text-xl font-bold text-secondary mb-2">Deferred Payment Loan: Paying Back a Lump Sum Due at Maturity</h2>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Inputs */}
              <div className="bg-surface-container p-4 rounded-[1px] border border-outline-variant w-full md:w-[350px] flex-shrink-0">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Loan Amount</label>
                    <div className="relative w-40">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                      <input type="number" value={deferredAmount} onChange={(e) => setDeferredAmount(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Loan Term</label>
                    <div className="flex gap-1 w-40">
                      <div className="relative w-1/2">
                        <input type="number" value={deferredYears} onChange={(e) => setDeferredYears(e.target.value)} className="w-full pr-8 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-xs">years</span>
                      </div>
                      <div className="relative w-1/2">
                        <input type="number" value={deferredMonths} onChange={(e) => setDeferredMonths(e.target.value)} className="w-full pr-10 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-primary/50 text-xs">months</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Interest Rate</label>
                    <div className="relative w-40">
                      <input type="number" step="0.01" value={deferredRate} onChange={(e) => setDeferredRate(e.target.value)} className="w-full pr-6 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Compound</label>
                    <select value={deferredCompound} onChange={(e) => setDeferredCompound(e.target.value)} className="w-40 py-1 px-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary">
                      <option>Annually (APY)</option>
                      <option>Monthly (APR)</option>
                    </select>
                  </div>
                  <div className="flex justify-center gap-2 pt-2">
                    <button className="bg-[#4caf50] hover:bg-[#45a049] text-white px-4 py-1.5 rounded-[1px] font-bold flex items-center gap-1 shadow-sm">
                      Calculate <span className="text-xs bg-white text-[#4caf50] rounded-[1px] w-4 h-4 flex items-center justify-center">▶</span>
                    </button>
                    <button className="bg-[#9e9e9e] hover:bg-[#8e8e8e] text-white px-4 py-1.5 rounded-[1px] font-bold shadow-sm">
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="flex-1">
                <div className="bg-[#7cb342] text-white p-2 font-bold flex justify-between items-center">
                  <span>Results:</span>
                  <div className="w-4 h-4 border border-white flex items-center justify-center text-[10px]">💾</div>
                </div>
                <div className="p-4 border border-outline-variant border-t-0 text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-primary/90">Amount Due at Loan Maturity</span>
                    <span className="font-bold text-primary">{formatCurrency(deferredResults.amountDue)}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-primary/90">Total Interest</span>
                    <span className="font-bold text-primary">{formatCurrency(deferredResults.totalInterest)}</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-6 mt-6">
                    <div className="w-20 h-20 relative">
                      <div className="w-full h-full rounded-[1px]" style={{
                        background: `conic-gradient(#3b82f6 0% ${(deferredResults.principal/deferredResults.amountDue)*100}%, #8bc34a ${(deferredResults.principal/deferredResults.amountDue)*100}% 100%)`
                      }}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-surface-container-low rounded-[1px]"></div>
                      </div>
                      <div className="absolute top-1/2 left-2 -translate-y-1/2 text-[10px] font-bold text-white drop-shadow-md">{Math.round((deferredResults.principal/deferredResults.amountDue)*100)}%</div>
                      <div className="absolute top-1/2 right-2 -translate-y-1/2 text-[10px] font-bold text-white drop-shadow-md">{Math.round((deferredResults.totalInterest/deferredResults.amountDue)*100)}%</div>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500"></div> <span className="text-primary/80">Principal</span></div>
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#8bc34a]"></div> <span className="text-primary/80">Interest</span></div>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <a href="#" className="text-secondary hover:underline text-sm">View Schedule Table</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bond Section */}
          <div>
            <h2 className="text-xl font-bold text-secondary mb-2">Bond: Paying Back a Predetermined Amount Due at Loan Maturity</h2>
            <p className="text-sm text-primary/80 mb-4">Use this calculator to compute the initial value of a bond/loan based on a predetermined face value to be paid back at bond/loan maturity.</p>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Inputs */}
              <div className="bg-surface-container p-4 rounded-[1px] border border-outline-variant w-full md:w-[350px] flex-shrink-0">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90 leading-tight">Predetermined<br/>Due Amount</label>
                    <div className="relative w-40">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                      <input type="number" value={bondAmount} onChange={(e) => setBondAmount(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Loan Term</label>
                    <div className="flex gap-1 w-40">
                      <div className="relative w-1/2">
                        <input type="number" value={bondYears} onChange={(e) => setBondYears(e.target.value)} className="w-full pr-8 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-xs">years</span>
                      </div>
                      <div className="relative w-1/2">
                        <input type="number" value={bondMonths} onChange={(e) => setBondMonths(e.target.value)} className="w-full pr-10 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-primary/50 text-xs">months</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Interest Rate</label>
                    <div className="relative w-40">
                      <input type="number" step="0.01" value={bondRate} onChange={(e) => setBondRate(e.target.value)} className="w-full pr-6 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Compound</label>
                    <select value={bondCompound} onChange={(e) => setBondCompound(e.target.value)} className="w-40 py-1 px-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary">
                      <option>Annually (APY)</option>
                      <option>Monthly (APR)</option>
                    </select>
                  </div>
                  <div className="flex justify-center gap-2 pt-2">
                    <button className="bg-[#4caf50] hover:bg-[#45a049] text-white px-4 py-1.5 rounded-[1px] font-bold flex items-center gap-1 shadow-sm">
                      Calculate <span className="text-xs bg-white text-[#4caf50] rounded-[1px] w-4 h-4 flex items-center justify-center">▶</span>
                    </button>
                    <button className="bg-[#9e9e9e] hover:bg-[#8e8e8e] text-white px-4 py-1.5 rounded-[1px] font-bold shadow-sm">
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="flex-1">
                <div className="bg-[#7cb342] text-white p-2 font-bold flex justify-between items-center">
                  <span>Results:</span>
                  <div className="w-4 h-4 border border-white flex items-center justify-center text-[10px]">💾</div>
                </div>
                <div className="p-4 border border-outline-variant border-t-0 text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-primary/90">Amount Received When the Loan Starts</span>
                    <span className="font-bold text-primary">{formatCurrency(bondResults.amountReceived)}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-primary/90">Total Interest</span>
                    <span className="font-bold text-primary">{formatCurrency(bondResults.totalInterest)}</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-6 mt-6">
                    <div className="w-20 h-20 relative">
                      <div className="w-full h-full rounded-[1px]" style={{
                        background: `conic-gradient(#3b82f6 0% ${(bondResults.amountReceived/bondResults.principal)*100}%, #8bc34a ${(bondResults.amountReceived/bondResults.principal)*100}% 100%)`
                      }}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-surface-container-low rounded-[1px]"></div>
                      </div>
                      <div className="absolute top-1/2 left-2 -translate-y-1/2 text-[10px] font-bold text-white drop-shadow-md">{Math.round((bondResults.amountReceived/bondResults.principal)*100)}%</div>
                      <div className="absolute top-1/2 right-2 -translate-y-1/2 text-[10px] font-bold text-white drop-shadow-md">{Math.round((bondResults.totalInterest/bondResults.principal)*100)}%</div>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500"></div> <span className="text-primary/80">Principal</span></div>
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#8bc34a]"></div> <span className="text-primary/80">Interest</span></div>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <a href="#" className="text-secondary hover:underline text-sm">View Schedule Table</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="mt-12 space-y-6 text-sm text-primary/80 leading-relaxed">
            <h3 className="text-lg font-bold text-secondary">Amortized Loan: Fixed Amount Paid Periodically</h3>
            <p>Many consumer loans fall into this category of loans that have regular payments that are amortized uniformly over their lifetime. Routine payments are made on principal and interest until the loan reaches maturity (is entirely paid off). Some of the most familiar amortized loans include mortgages, car loans, student loans, and personal loans. The word "loan" will probably refer to this type in everyday conversation, not the type in the second or third calculation. Below are links to calculators related to loans that fall under this category, which can provide more information or allow specific calculations involving each type of loan. Instead of using this Loan Calculator, it may be more useful to use any of the following for each specific need:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
              <a href="#" className="text-secondary hover:underline">Mortgage Calculator</a>
              <a href="#" className="text-secondary hover:underline">Auto Loan Calculator</a>
              <a href="#" className="text-secondary hover:underline">Student Loan Calculator</a>
              <a href="#" className="text-secondary hover:underline">FHA Loan Calculator</a>
              <a href="#" className="text-secondary hover:underline">VA Mortgage Calculator</a>
              <a href="#" className="text-secondary hover:underline">Investment Calculator</a>
              <a href="#" className="text-secondary hover:underline">Business Loan Calculator</a>
              <a href="#" className="text-secondary hover:underline">Personal Loan Calculator</a>
            </div>

            <h3 className="text-lg font-bold text-secondary mt-8">Deferred Payment Loan: Single Lump Sum Due at Loan Maturity</h3>
            <p>Many commercial loans or short-term loans are in this category. Unlike the first calculation, which is amortized with payments spread uniformly over their lifetimes, these loans have a single, large lump sum due at maturity. Some loans, such as balloon loans, can also have smaller routine payments during their lifetimes, but this calculation only works for loans with a single payment of all principal and interest due at maturity.</p>

            <h3 className="text-lg font-bold text-secondary mt-8">Bond: Predetermined Lump Sum Paid at Loan Maturity</h3>
            <p>This kind of loan is rarely made except in the form of bonds. Technically, bonds operate differently from more conventional loans in that borrowers make a predetermined payment at maturity. The face, or par value of a bond, is the amount paid by the issuer (borrower) when the bond matures, assuming the borrower doesn't default. Face value denotes the amount received at maturity.</p>
            <p>Two common bond types are coupon and zero-coupon bonds. With coupon bonds, lenders base coupon interest payments on a percentage of the face value. Coupon interest payments occur at predetermined intervals, usually annually or semi-annually. Zero-coupon bonds do not pay interest directly. Instead, borrowers sell bonds at a deep discount to their face value, then pay the face value when the bond matures. Users should note that the calculator above runs calculations for zero-coupon bonds.</p>
            <p>After a borrower issues a bond, its value will fluctuate based on interest rates, market forces, and many other factors. While this does not change the bond's value at maturity, a bond's market price can still vary during its lifetime.</p>

            <h3 className="text-xl font-bold text-secondary mt-8">Loan Basics for Borrowers</h3>
            
            <h4 className="font-bold text-primary">Interest Rate</h4>
            <p>Nearly all loan structures include interest, which is the profit that banks or lenders make on loans. Interest rate is the percentage of a loan paid by borrowers to lenders. For most loans, interest is paid in addition to principal repayment. Loan interest is usually expressed in APR, or annual percentage rate, which includes both interest and fees. The rate usually published by banks for saving accounts, money market accounts, and CDs is the annual percentage yield, or APY. It is important to understand the difference between APR and APY. Borrowers seeking loans can calculate the actual interest paid to lenders based on their advertised rates by using the <a href="#" className="text-secondary hover:underline">Interest Calculator</a>. For more information about or to do calculations involving APR, please visit the <a href="#" className="text-secondary hover:underline">APR Calculator</a>.</p>

            <h4 className="font-bold text-primary mt-6">Compounding Frequency</h4>
            <p>Compound interest is interest that is earned not only on the initial principal but also on accumulated interest from previous periods. Generally, the more frequently compounding occurs, the higher the total amount due on the loan. In most loans, compounding occurs monthly. Use the <a href="#" className="text-secondary hover:underline">Compound Interest Calculator</a> to learn more about or do calculations involving compound interest.</p>

            <h4 className="font-bold text-primary mt-6">Loan Term</h4>
            <p>A loan term is the duration of the loan, given that required minimum payments are made each month. The term of the loan can affect the structure of the loan in many ways. Generally, the longer the term, the more interest will be accrued over time, raising the total cost of the loan for borrowers, but reducing the periodic payments.</p>

            <h3 className="text-xl font-bold text-secondary mt-8">Consumer Loans</h3>
            <p>There are two basic kinds of consumer loans: secured or unsecured.</p>

            <h4 className="font-bold text-primary mt-4">Secured Loans</h4>
            <p>A secured loan means that the borrower has put up some asset as a form of collateral before being granted a loan. The lender is issued a lien, which is a right to possession of property belonging to another person until a debt is paid. In other words, defaulting on a secured loan will give the loan issuer the legal ability to seize the asset that was put up as collateral. The most common secured loans are mortgages and auto loans. In these examples, the lender holds the deed or title, which is a representation of ownership, until the secured loan is fully paid. Defaulting on a mortgage typically results in the bank foreclosing on a home, while not paying a car loan means that the lender can repossess the car.</p>
            <p>Lenders are generally hesitant to lend large amounts of money with no guarantee. Secured loans reduce the risk of the borrower defaulting since they risk losing whatever asset they put up as collateral. If the collateral is worth less than the outstanding debt, the borrower can still be liable for the remainder of the debt.</p>
            <p>Secured loans generally have a higher chance of approval compared to unsecured loans and can be a better option for those who would not qualify for an unsecured loan.</p>

            <h4 className="font-bold text-primary mt-6">Unsecured Loans</h4>
            <p>An unsecured loan is an agreement to pay a loan back without collateral. Because there is no collateral involved, lenders need a way to verify the financial integrity of their borrowers. This can be achieved through the five C's of credit, which is a common methodology used by lenders to gauge the creditworthiness of potential borrowers.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Character</strong>—may include credit history and reports to showcase the track record of a borrower's ability to fulfill debt obligations in the past, their work experience and income level, and any outstanding legal considerations</li>
              <li><strong>Capacity</strong>—measures a borrower's ability to repay a loan using a ratio to compare their debt to income</li>
              <li><strong>Capital</strong>—refers to any other assets borrowers may have, aside from income, that can be used to fulfill a debt obligation, such as a down payment, savings, or investments</li>
              <li><strong>Collateral</strong>—only applies to secured loans. Collateral refers to something pledged as security for repayment of a loan in the event that the borrower defaults</li>
              <li><strong>Conditions</strong>—the current state of the lending climate, trends in the industry, and what the loan will be used for</li>
            </ul>
            <p>Unsecured loans generally feature higher interest rates, lower borrowing limits, and shorter repayment terms than secured loans. Lenders may sometimes require a co-signer (a person who agrees to pay a borrower's debt if they default) for unsecured loans if the lender deems the borrower as risky.</p>
            <p>If borrowers do not repay unsecured loans, lenders may hire a collection agency. Collection agencies are companies that recover funds for past due payments or accounts in default.</p>
            <p>Examples of unsecured loans include credit cards, personal loans, and student loans. Please visit our <a href="#" className="text-secondary hover:underline">Credit Card Calculator</a>, <a href="#" className="text-secondary hover:underline">Personal Loan Calculator</a>, or <a href="#" className="text-secondary hover:underline">Student Loan Calculator</a> for more information or to do calculations involving each of them.</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex gap-2 mb-4">
            <input type="text" className="w-full px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary focus:ring-2 focus:ring-secondary outline-none text-sm" />
            <button className="bg-secondary hover:bg-secondary/80 text-white px-3 py-1 rounded-[1px] text-sm font-semibold">Search</button>
          </div>

          <div className="border border-blue-600 rounded-[1px] overflow-hidden">
            <div className="bg-secondary text-white p-2 font-bold text-sm">
              Financial Calculators
            </div>
            <div className="bg-surface-container p-3">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <a href="#" className="text-secondary hover:underline">Mortgage</a>
                <a href="#" className="text-secondary hover:underline">Loan</a>
                <a href="#" className="text-secondary hover:underline">Auto Loan</a>
                <a href="#" className="text-secondary hover:underline">Interest</a>
                <a href="#" className="text-secondary hover:underline">Payment</a>
                <a href="#" className="text-secondary hover:underline">Retirement</a>
                <a href="#" className="text-secondary hover:underline">Amortization</a>
                <a href="#" className="text-secondary hover:underline">Investment</a>
                <a href="#" className="text-secondary hover:underline">Currency</a>
                <a href="#" className="text-secondary hover:underline">Inflation</a>
                <a href="#" className="text-secondary hover:underline">Finance</a>
                <a href="#" className="text-secondary hover:underline">Mortgage Payoff</a>
                <a href="#" className="text-secondary hover:underline">Income Tax</a>
                <a href="#" className="text-secondary hover:underline">Compound Interest</a>
                <a href="#" className="text-secondary hover:underline">Salary</a>
                <a href="#" className="text-secondary hover:underline">401K</a>
                <a href="#" className="text-secondary hover:underline">Interest Rate</a>
                <a href="#" className="text-secondary hover:underline">Sales Tax</a>
                <a href="#" className="text-secondary hover:underline col-span-2">More Financial Calculators</a>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-primary/60 space-x-2">
            <a href="#" className="hover:underline">Financial</a> | 
            <a href="#" className="hover:underline">Fitness and Health</a> | 
            <a href="#" className="hover:underline">Math</a> | 
            <a href="#" className="hover:underline">Other</a>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-outline-variant text-center text-sm text-primary/60">
        <a href="#" className="hover:underline">about us</a> | <a href="#" className="hover:underline">sitemap</a> | <a href="#" className="hover:underline">terms of use</a> | <a href="#" className="hover:underline">privacy policy</a> © 2008 - 2026 calculator.net
      </div>
    </div>
  );
}
