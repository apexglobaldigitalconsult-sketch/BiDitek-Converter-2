import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Info, HelpCircle } from 'lucide-react';

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState('400000');
  const [downPaymentPercent, setDownPaymentPercent] = useState('20');
  const [downPaymentAmount, setDownPaymentAmount] = useState('80000');
  const [loanTerm, setLoanTerm] = useState('30');
  const [interestRate, setInterestRate] = useState('6.47');
  const [startMonth, setStartMonth] = useState('Apr');
  const [startYear, setStartYear] = useState('2026');
  
  const [includeTaxes, setIncludeTaxes] = useState(true);
  const [propertyTaxesPercent, setPropertyTaxesPercent] = useState('1.2');
  const [propertyTaxesAmount, setPropertyTaxesAmount] = useState('4800');
  const [homeInsurance, setHomeInsurance] = useState('1500');
  const [pmiInsurance, setPmiInsurance] = useState('0');
  const [hoaFee, setHoaFee] = useState('0');
  const [otherCosts, setOtherCosts] = useState('4000');

  const calculateMortgage = () => {
    const P = (parseFloat(homePrice) || 0) - (parseFloat(downPaymentAmount) || 0);
    const r = (parseFloat(interestRate) || 0) / 100 / 12;
    const n = (parseFloat(loanTerm) || 0) * 12;
    
    let monthlyPrincipalAndInterest = 0;
    if (r > 0) {
      monthlyPrincipalAndInterest = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else if (n > 0) {
      monthlyPrincipalAndInterest = P / n;
    }

    const monthlyPropertyTax = includeTaxes ? (parseFloat(propertyTaxesAmount) || 0) / 12 : 0;
    const monthlyHomeInsurance = includeTaxes ? (parseFloat(homeInsurance) || 0) / 12 : 0;
    const monthlyPMI = includeTaxes ? (parseFloat(pmiInsurance) || 0) : 0;
    const monthlyHOA = includeTaxes ? (parseFloat(hoaFee) || 0) : 0;
    const monthlyOther = includeTaxes ? (parseFloat(otherCosts) || 0) / 12 : 0;

    const totalMonthlyPayment = monthlyPrincipalAndInterest + monthlyPropertyTax + monthlyHomeInsurance + monthlyPMI + monthlyHOA + monthlyOther;

    return {
      principalAndInterest: monthlyPrincipalAndInterest || 0,
      propertyTax: monthlyPropertyTax || 0,
      homeInsurance: monthlyHomeInsurance || 0,
      pmi: monthlyPMI || 0,
      hoa: monthlyHOA || 0,
      other: monthlyOther || 0,
      total: totalMonthlyPayment || 0,
      loanAmount: P || 0,
      totalInterest: ((monthlyPrincipalAndInterest * n) - P) || 0,
      totalPayments: (totalMonthlyPayment * n) || 0
    };
  };

  const results = useMemo(() => calculateMortgage(), [
    homePrice, downPaymentAmount, loanTerm, interestRate, 
    includeTaxes, propertyTaxesAmount, homeInsurance, pmiInsurance, hoaFee, otherCosts
  ]);

  const generateAmortizationSchedule = () => {
    const P = results.loanAmount || 0;
    const r = (parseFloat(interestRate) || 0) / 100 / 12;
    const n = (parseFloat(loanTerm) || 0) * 12;
    const payment = results.principalAndInterest || 0;

    let balance = P;
    const schedule = [];
    let currentYear = parseInt(startYear) || new Date().getFullYear();
    let currentMonthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(startMonth);
    if (currentMonthIndex === -1) currentMonthIndex = 0;

    let yearlyInterest = 0;
    let yearlyPrincipal = 0;

    for (let i = 1; i <= n; i++) {
      const interestPayment = balance * r;
      const principalPayment = payment - interestPayment;
      balance -= principalPayment;

      yearlyInterest += interestPayment;
      yearlyPrincipal += principalPayment;

      currentMonthIndex++;
      if (currentMonthIndex > 11) {
        currentMonthIndex = 0;
        currentYear++;
        
        schedule.push({
          year: i / 12,
          date: `${currentYear}`,
          interest: yearlyInterest,
          principal: yearlyPrincipal,
          balance: balance > 0 ? balance : 0
        });
        
        yearlyInterest = 0;
        yearlyPrincipal = 0;
      }
    }
    
    if (yearlyInterest > 0 || yearlyPrincipal > 0) {
        schedule.push({
          year: Math.ceil(n/12),
          date: `${currentYear}`,
          interest: yearlyInterest,
          principal: yearlyPrincipal,
          balance: balance > 0 ? balance : 0
        });
    }

    return schedule;
  };

  const amortizationData = useMemo(() => generateAmortizationSchedule(), [results, startMonth, startYear]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  const formatCurrencyDecimals = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const handleHomePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHomePrice(val);
    setDownPaymentAmount((parseFloat(val) * (parseFloat(downPaymentPercent) / 100)).toString());
  };

  const handleDownPaymentPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDownPaymentPercent(val);
    setDownPaymentAmount((parseFloat(homePrice) * (parseFloat(val) / 100)).toString());
  };

  const handleDownPaymentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDownPaymentAmount(val);
    setDownPaymentPercent(((parseFloat(val) / parseFloat(homePrice)) * 100).toFixed(2));
  };

  const handlePropertyTaxesPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setPropertyTaxesPercent(val);
      setPropertyTaxesAmount((parseFloat(homePrice) * (parseFloat(val) / 100)).toString());
  }

  const handlePropertyTaxesAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setPropertyTaxesAmount(val);
      setPropertyTaxesPercent(((parseFloat(val) / parseFloat(homePrice)) * 100).toFixed(2));
  }


  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans">
      <div className="flex justify-between items-center text-sm text-primary/60 mb-4">
        <div>
          <a href="#" className="hover:underline">home</a> / <a href="#" className="hover:underline">financial</a> / mortgage calculator
        </div>
        <a href="#" className="text-secondary hover:underline">Print</a>
      </div>
      <h1 className="text-2xl font-bold mb-6 text-primary">Mortgage Calculator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-9 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column: Inputs */}
            <div className="md:col-span-5 space-y-6">
          <div className="bg-secondary text-white p-3 rounded-[1px] flex items-center justify-between cursor-pointer">
            <span className="font-semibold">Modify the values and click the Calculate button to use</span>
            <span className="text-xl">▼</span>
          </div>
          
          <div className="bg-surface-container-low p-6 border border-outline-variant rounded-[1px] shadow-sm space-y-4">
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-primary/80 font-medium">Home Price</label>
              <div className="relative w-40">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50">$</span>
                <input 
                  type="number" 
                  value={homePrice}
                  onChange={handleHomePriceChange}
                  className="w-full pl-6 pr-3 py-1.5 border border-outline-variant rounded-[1px] text-right bg-surface-container-low text-primary focus:ring-2 focus:ring-secondary outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-primary/80 font-medium flex items-center gap-1">
                Down Payment <HelpCircle className="w-3 h-3 text-gray-400" />
              </label>
              <div className="flex gap-2 w-40">
                <div className="relative w-1/3">
                  <input 
                    type="number" 
                    value={downPaymentPercent}
                    onChange={handleDownPaymentPercentChange}
                    className="w-full pr-4 py-1.5 border border-outline-variant rounded-[1px] text-right bg-surface-container-low text-primary focus:ring-2 focus:ring-secondary outline-none"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-xs">%</span>
                </div>
                <div className="relative w-2/3">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/50 text-xs">$</span>
                  <input 
                    type="number" 
                    value={downPaymentAmount}
                    onChange={handleDownPaymentAmountChange}
                    className="w-full pl-5 pr-2 py-1.5 border border-outline-variant rounded-[1px] text-right bg-surface-container-low text-primary focus:ring-2 focus:ring-secondary outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-primary/80 font-medium">Loan Term</label>
              <div className="relative w-40">
                <input 
                  type="number" 
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full pr-12 py-1.5 border border-outline-variant rounded-[1px] text-right bg-surface-container-low text-primary focus:ring-2 focus:ring-secondary outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/50 text-sm">years</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-primary/80 font-medium flex items-center gap-1">
                Interest Rate <HelpCircle className="w-3 h-3 text-gray-400" />
              </label>
              <div className="relative w-40">
                <input 
                  type="number" 
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full pr-6 py-1.5 border border-outline-variant rounded-[1px] text-right bg-surface-container-low text-primary focus:ring-2 focus:ring-secondary outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-primary/80 font-medium">Start Date</label>
              <div className="flex gap-2 w-40">
                <select 
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="w-1/2 py-1.5 px-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary focus:ring-2 focus:ring-secondary outline-none text-sm"
                >
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <input 
                  type="number" 
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  className="w-1/2 py-1.5 px-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary focus:ring-2 focus:ring-secondary outline-none text-sm"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant mt-4">
              <label className="flex items-center gap-2 mb-4 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={includeTaxes}
                  onChange={(e) => setIncludeTaxes(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-[1px] focus:ring-secondary"
                />
                <span className="text-sm font-bold text-primary/90">Include Taxes & Costs Below</span>
              </label>

              <div className="text-right text-xs text-primary/50 mb-2">Annual Tax & Cost</div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-primary/80 flex items-center gap-1">
                    Property Taxes <HelpCircle className="w-3 h-3 text-gray-400" />
                  </label>
                  <div className="flex gap-2 w-40">
                    <div className="relative w-1/3">
                      <input 
                        type="number" 
                        step="0.1"
                        value={propertyTaxesPercent}
                        onChange={handlePropertyTaxesPercentChange}
                        disabled={!includeTaxes}
                        className="w-full pr-4 py-1 border border-outline-variant rounded-[1px] text-right bg-surface-container-low text-primary disabled:opacity-50 focus:ring-2 focus:ring-secondary outline-none text-sm"
                      />
                      <span className="absolute right-1 top-1/2 -translate-y-1/2 text-primary/50 text-xs">%</span>
                    </div>
                    <div className="relative w-2/3">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/50 text-xs">$</span>
                      <input 
                        type="number" 
                        value={propertyTaxesAmount}
                        onChange={handlePropertyTaxesAmountChange}
                        disabled={!includeTaxes}
                        className="w-full pl-5 pr-2 py-1 border border-outline-variant rounded-[1px] text-right bg-surface-container-low text-primary disabled:opacity-50 focus:ring-2 focus:ring-secondary outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-primary/80 flex items-center gap-1">
                    Home Insurance <HelpCircle className="w-3 h-3 text-gray-400" />
                  </label>
                  <div className="relative w-40">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/50 text-xs">$</span>
                    <input 
                      type="number" 
                      value={homeInsurance}
                      onChange={(e) => setHomeInsurance(e.target.value)}
                      disabled={!includeTaxes}
                      className="w-full pl-5 pr-2 py-1 border border-outline-variant rounded-[1px] text-right bg-surface-container-low text-primary disabled:opacity-50 focus:ring-2 focus:ring-secondary outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-primary/80 flex items-center gap-1">
                    PMI Insurance <HelpCircle className="w-3 h-3 text-gray-400" />
                  </label>
                  <div className="relative w-40">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/50 text-xs">$</span>
                    <input 
                      type="number" 
                      value={pmiInsurance}
                      onChange={(e) => setPmiInsurance(e.target.value)}
                      disabled={!includeTaxes}
                      className="w-full pl-5 pr-2 py-1 border border-outline-variant rounded-[1px] text-right bg-surface-container-low text-primary disabled:opacity-50 focus:ring-2 focus:ring-secondary outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-primary/80 flex items-center gap-1">
                    HOA Fee <HelpCircle className="w-3 h-3 text-gray-400" />
                  </label>
                  <div className="relative w-40">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/50 text-xs">$</span>
                    <input 
                      type="number" 
                      value={hoaFee}
                      onChange={(e) => setHoaFee(e.target.value)}
                      disabled={!includeTaxes}
                      className="w-full pl-5 pr-2 py-1 border border-outline-variant rounded-[1px] text-right bg-surface-container-low text-primary disabled:opacity-50 focus:ring-2 focus:ring-secondary outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-primary/80 flex items-center gap-1">
                    Other Costs <HelpCircle className="w-3 h-3 text-gray-400" />
                  </label>
                  <div className="relative w-40">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/50 text-xs">$</span>
                    <input 
                      type="number" 
                      value={otherCosts}
                      onChange={(e) => setOtherCosts(e.target.value)}
                      disabled={!includeTaxes}
                      className="w-full pl-5 pr-2 py-1 border border-outline-variant rounded-[1px] text-right bg-surface-container-low text-primary disabled:opacity-50 focus:ring-2 focus:ring-secondary outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <button className="text-secondary text-sm hover:underline">+ More Options</button>
              </div>

              <div className="mt-6 flex gap-2">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-[1px] font-semibold flex items-center justify-center gap-2">
                  Calculate <span className="text-xs">▶</span>
                </button>
                <button className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-[1px] font-semibold">
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-surface-container-low border border-outline-variant rounded-[1px] shadow-sm overflow-hidden">
            <div className="bg-green-600 text-white p-3 flex justify-between items-center">
              <span className="font-bold">Monthly Pay:</span>
              <span className="text-xl font-bold">{formatCurrencyDecimals(results.total)}</span>
            </div>
            
            <div className="p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant">
                    <th className="text-left py-2 font-semibold text-primary/80"></th>
                    <th className="text-right py-2 font-semibold text-primary/80">Monthly</th>
                    <th className="text-right py-2 font-semibold text-primary/80">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  <tr>
                    <td className="py-2 font-bold text-primary">Mortgage Payment</td>
                    <td className="text-right py-2 font-bold text-primary">{formatCurrencyDecimals(results.principalAndInterest)}</td>
                    <td className="text-right py-2 font-bold text-primary">{formatCurrencyDecimals(results.principalAndInterest * parseFloat(loanTerm) * 12)}</td>
                  </tr>
                  {includeTaxes && (
                    <>
                      <tr>
                        <td className="py-2 text-primary/60">Property Tax</td>
                        <td className="text-right py-2 text-primary/60">{formatCurrencyDecimals(results.propertyTax)}</td>
                        <td className="text-right py-2 text-primary/60">{formatCurrencyDecimals(results.propertyTax * parseFloat(loanTerm) * 12)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-primary/60">Home Insurance</td>
                        <td className="text-right py-2 text-primary/60">{formatCurrencyDecimals(results.homeInsurance)}</td>
                        <td className="text-right py-2 text-primary/60">{formatCurrencyDecimals(results.homeInsurance * parseFloat(loanTerm) * 12)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-primary/60">Other Costs</td>
                        <td className="text-right py-2 text-primary/60">{formatCurrencyDecimals(results.other)}</td>
                        <td className="text-right py-2 text-primary/60">{formatCurrencyDecimals(results.other * parseFloat(loanTerm) * 12)}</td>
                      </tr>
                    </>
                  )}
                  <tr className="bg-surface-container">
                    <td className="py-2 font-bold text-primary">Total Out-of-Pocket</td>
                    <td className="text-right py-2 font-bold text-primary">{formatCurrencyDecimals(results.total)}</td>
                    <td className="text-right py-2 font-bold text-primary">{formatCurrencyDecimals(results.totalPayments)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-32 h-32 relative">
                  {/* Simple CSS Pie Chart representation */}
                  <div className="w-full h-full rounded-[1px]" style={{
                    background: `conic-gradient(
                      #3b82f6 0% ${(results.principalAndInterest/results.total)*100}%, 
                      #10b981 ${(results.principalAndInterest/results.total)*100}% ${((results.principalAndInterest+results.propertyTax)/results.total)*100}%, 
                      #f59e0b ${((results.principalAndInterest+results.propertyTax)/results.total)*100}% ${((results.principalAndInterest+results.propertyTax+results.homeInsurance)/results.total)*100}%,
                      #6366f1 ${((results.principalAndInterest+results.propertyTax+results.homeInsurance)/results.total)*100}% 100%
                    )`
                  }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-surface-container-low rounded-[1px]"></div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500"></div> <span className="text-primary/80">Principal & Interest</span></div>
                  {includeTaxes && <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500"></div> <span className="text-primary/80">Property Taxes</span></div>}
                  {includeTaxes && <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500"></div> <span className="text-primary/80">Home Insurance</span></div>}
                  {includeTaxes && <div className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-500"></div> <span className="text-primary/80">Other Cost</span></div>}
                </div>
              </div>

              <div className="mt-8 space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-outline-variant">
                  <span className="font-bold text-primary">House Price</span>
                  <span className="text-primary/80">{formatCurrency(parseFloat(homePrice))}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant">
                  <span className="text-primary/80">Loan Amount</span>
                  <span className="text-primary/80">{formatCurrency(results.loanAmount)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant">
                  <span className="text-primary/80">Down Payment</span>
                  <span className="text-primary/80">{formatCurrency(parseFloat(downPaymentAmount))}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant">
                  <span className="text-primary/80">Total of {parseFloat(loanTerm) * 12} Mortgage Payments</span>
                  <span className="text-primary/80">{formatCurrency(results.principalAndInterest * parseFloat(loanTerm) * 12)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-outline-variant">
                  <span className="text-primary/80">Total Interest</span>
                  <span className="text-primary/80">{formatCurrency(results.totalInterest)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-primary/80">Mortgage Payoff Date</span>
                  <span className="text-primary/80">{startMonth} {parseInt(startYear) + parseInt(loanTerm)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-sm">
            <div className="mb-2">
              <span className="font-bold text-primary/90">Latest Mortgage Rates:</span>{' '}
              <span className="text-primary/60">30 Years: <a href="#" className="text-secondary hover:underline">6.47%</a></span>{' '}
              <span className="text-primary/60">15 Years: <a href="#" className="text-secondary hover:underline">5.587%</a></span>{' '}
              <span className="text-primary/60">10 Years: <a href="#" className="text-secondary hover:underline">5.447%</a></span>
            </div>
            <div className="flex justify-center gap-2">
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm font-semibold">See your local rates</button>
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm font-semibold">Get pre-approval</button>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4 text-primary">Amortization schedule</h2>
        <div className="flex gap-4 mb-4 border-b border-outline-variant">
          <button className="pb-2 border-b-2 border-blue-600 font-semibold text-secondary">Annual Schedule</button>
          <button className="pb-2 text-secondary hover:underline">Monthly Schedule</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="p-2 text-center">Year</th>
                  <th className="p-2 text-center">Date</th>
                  <th className="p-2">Interest</th>
                  <th className="p-2">Principal</th>
                  <th className="p-2">Ending Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {amortizationData.slice(0, 10).map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-surface-container' : 'bg-surface-container-low'}>
                    <td className="p-2 text-center text-primary">{row.year}</td>
                    <td className="p-2 text-center text-primary/60">{startMonth} {row.date}</td>
                    <td className="p-2 text-primary/60">{formatCurrency(row.interest)}</td>
                    <td className="p-2 text-primary/60">{formatCurrency(row.principal)}</td>
                    <td className="p-2 text-primary">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={amortizationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="year" tick={{fontSize: 12}} stroke="#6B7280" />
                <YAxis tickFormatter={(value) => `$${value/1000}K`} tick={{fontSize: 12}} stroke="#6B7280" />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="balance" name="Balance" stroke="#3b82f6" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="principal" name="Principal" stroke="#10b981" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="interest" name="Interest" stroke="#f59e0b" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="mt-12 space-y-6 text-sm text-primary/80 leading-relaxed">
        <p>The Mortgage Calculator helps estimate the monthly payment due along with other financial costs associated with mortgages. There are options to include extra payments or annual percentage increases of common mortgage-related expenses. The calculator is mainly intended for use by U.S. residents.</p>
        
        <h3 className="text-lg font-bold text-primary mt-8">Mortgages</h3>
        <p>A mortgage is a loan secured by property, usually real estate property. Lenders define it as the money borrowed to pay for real estate. In essence, the lender helps the buyer pay the seller of a house, and the buyer agrees to repay the money borrowed over a period of time, usually 15 or 30 years in the U.S. Each month, a payment is made from buyer to lender. A portion of the monthly payment is called the principal, which is the original amount borrowed. The other portion is the interest, which is the cost paid to the lender for using the money. There may be an escrow account involved to cover the cost of property taxes and insurance. The buyer cannot be considered the full owner of the mortgaged property until the last monthly payment is made. In the U.S., the most common mortgage loan is the conventional 30-year fixed-interest loan, which represents 70% to 90% of all mortgages. Mortgages are how most people are able to own homes in the U.S.</p>

        <h3 className="text-lg font-bold text-primary mt-8">Mortgage Calculator Components</h3>
        <p>A mortgage usually includes the following key components. These are also the basic components of a mortgage calculator.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Loan amount</strong>—the amount borrowed from a lender or bank. In a mortgage, this amounts to the purchase price minus any down payment. The maximum loan amount one can borrow normally correlates with household income or affordability. To estimate an affordable amount, please use our <a href="#" className="text-secondary hover:underline">House Affordability Calculator</a>.</li>
          <li><strong>Down payment</strong>—the upfront payment of the purchase, usually a percentage of the total price. This is the portion of the purchase price covered by the borrower. Typically, mortgage lenders want the borrower to put 20% or more as a down payment. In some cases, borrowers may put down as low as 3%. If the borrowers make a down payment of less than 20%, they will be required to pay private mortgage insurance (PMI). Borrowers need to hold this insurance until the loan's remaining principal dropped below 80% of the home's original purchase price. A general rule of thumb is that the higher the down payment, the more favorable the interest rate and the more likely the loan will be approved.</li>
          <li><strong>Loan term</strong>—the amount of time over which the loan must be repaid in full. Most fixed-rate mortgages are for 15, 20, or 30-year terms. A shorter period, such as 15 or 20 years, typically includes a lower interest rate.</li>
          <li><strong>Interest rate</strong>—the percentage of the loan charged as a cost of borrowing. Mortgages can charge either fixed-rate mortgages (FRM) or adjustable-rate mortgages (ARM). As the name implies, interest rates remain the same for the term of the FRM loan. The calculator above calculates fixed rates only. For ARMs, interest rates are generally fixed for a period of time, after which they will be periodically adjusted based on market indices. ARMs transfer part of the risk to borrowers. Therefore, the initial interest rates are normally 0.5% to 2% lower than FRM with the same loan term. Mortgage interest rates are normally expressed in Annual Percentage Rate (APR), sometimes called nominal APR or effective APR. It is the interest rate expressed as a periodic rate multiplied by the number of compounding periods in a year. For example, if a mortgage rate is 6% APR, it means the borrower will have to pay 6% divided by twelve, which comes out to 0.5% in interest every month.</li>
        </ul>

        <h3 className="text-lg font-bold text-primary mt-8">Costs Associated with Home Ownership and Mortgages</h3>
        <p>Monthly mortgage payments usually comprise the bulk of the financial costs associated with owning a house, but there are other substantial costs to keep in mind. These costs are separated into two categories, recurring and non-recurring.</p>
        
        <h4 className="font-bold text-primary">Recurring Costs</h4>
        <p>Most recurring costs persist throughout and beyond the life of a mortgage. They are a significant financial factor. Property taxes, home insurance, HOA fees, and other costs increase with time as a byproduct of inflation. In the calculator, the recurring costs are under the "Include Options Below" checkbox. There are also optional inputs within the calculator for annual percentage increases under "More Options."</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Property taxes</strong>—a tax that property owners pay to governing authorities. In the U.S., property tax is usually managed by municipal or county governments. All 50 states impose taxes on property at the local level. The annual real estate tax in the U.S. varies by location; on average, Americans pay about 1.1% of their property's value as property tax each year.</li>
          <li><strong>Home insurance</strong>—an insurance policy that protects the owner from accidents that may happen to their real estate properties. Home insurance can also contain personal liability coverage, which protects against lawsuits involving injuries that occur on and off the property. The cost of home insurance varies according to factors such as location, condition of the property, and the coverage amount.</li>
          <li><strong>Private mortgage insurance (PMI)</strong>—protects the mortgage lender if the borrower is unable to repay the loan. In the U.S. specifically, if the down payment is less than 20% of the property's value, the lender will normally require the borrower to purchase PMI until the loan-to-value ratio (LTV) reaches 80% or 78%. PMI price varies according to factors such as down payment, size of the loan, and credit of the borrower. The annual cost typically ranges from 0.3% to 1.9% of the loan amount.</li>
          <li><strong>HOA fee</strong>—a fee imposed on the property owner by a homeowner's association (HOA), which is an organization that maintains and improves the property and environment of the neighborhoods within its purview. Condominiums, townhomes, and some single-family homes commonly require the payment of HOA fees. Annual HOA fees usually amount to less than one percent of the property value.</li>
          <li><strong>Other costs</strong>—includes utilities, home maintenance costs, and anything pertaining to the general upkeep of the property. It is common to spend 1% or more of the property value on annual maintenance alone.</li>
        </ul>

        <h4 className="font-bold text-primary mt-4">Non-Recurring Costs</h4>
        <p>These costs aren't addressed by the calculator, but they are still important to keep in mind.</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Closing costs</strong>—the fees paid at the closing of a real estate transaction. These are not recurring fees, but they can be expensive. In the U.S., the closing cost on a mortgage can include an attorney fee, the title service cost, recording fee, survey fee, property transfer tax, brokerage commission, mortgage application fee, points, appraisal fee, inspection fee, home warranty, pre-paid home insurance, pro-rata property taxes, pro-rata homeowner association dues, pro-rata interest, and more. These costs typically fall on the buyer, but it is possible to negotiate a "credit" with the seller or the lender. It is not unusual for a buyer to pay about $10,000 in total closing costs on a $400,000 transaction.</li>
          <li><strong>Initial renovations</strong>—some buyers choose to renovate before moving in. Examples of renovations include changing the flooring, repainting the walls, updating the kitchen, or even overhauling the entire interior or exterior. While these expenses can add up quickly, renovation costs are optional, and owners may choose not to address renovation issues immediately.</li>
          <li><strong>Miscellaneous</strong>—new furniture, new appliances, and moving costs are typical non-recurring costs of a home purchase. This also includes repair costs.</li>
        </ul>

        <h3 className="text-lg font-bold text-primary mt-8">Early Repayment and Extra Payments</h3>
        <p>In many situations, mortgage borrowers may want to pay off mortgages earlier rather than later, either in whole or in part, for reasons including but not limited to interest savings, wanting to sell their home, or refinancing. Our calculator can factor in monthly, annual, or one-time extra payments. However, borrowers need to understand the advantages and disadvantages of paying ahead on the mortgage.</p>
        
        <h4 className="font-bold text-primary">Early Repayment Strategies</h4>
        <p>Aside from paying off the mortgage loan entirely, typically, there are three main strategies that can be used to repay a mortgage loan earlier. Borrowers mainly adopt these strategies to save on interest. These methods can be used in combination or individually.</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Make extra payments</strong>—This is simply an extra payment over and above the monthly payment. On typical long-term mortgage loans, a very big portion of the earlier payments will go towards paying down interest rather than the principal. Any extra payments will decrease the loan balance, thereby decreasing interest and allowing the borrower to pay off the loan earlier in the long run. Some people form the habit of paying extra every month, while others pay extra whenever they can. There are optional inputs in the Mortgage Calculator to include many extra payments, and it can be helpful to compare the results of supplementing mortgages with or without extra payments.</li>
          <li><strong>Biweekly payments</strong>—The borrower pays half the monthly payment every two weeks. With 52 weeks in a year, this amounts to 26 payments or 13 months of mortgage repayments during the year. This method is mainly for those who receive their paycheck biweekly. It is easier for them to form a habit of taking a portion from each paycheck to make mortgage payments. Displayed in the calculator results are biweekly payments for comparison purposes.</li>
          <li><strong>Refinance to a loan with a shorter term</strong>—Refinancing involves taking out a new loan to pay off an old loan. In employing this strategy, borrowers can shorten the term, typically resulting in a lower interest rate. This can speed up the payoff and save on interest. However, this usually imposes a larger monthly payment on the borrower. Also, a borrower will likely need to pay closing costs and fees when they refinance.</li>
        </ol>

        <h4 className="font-bold text-primary mt-4">Reasons for early repayment</h4>
        <p>Making extra payments offers the following advantages:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Lower interest costs</strong>—Borrowers can save money on interest, which often amounts to a significant expense.</li>
          <li><strong>Shorter repayment period</strong>—A shortened repayment period means the payoff will come faster than the original term stated in the mortgage agreement. This results in the borrower paying off the mortgage faster.</li>
          <li><strong>Personal satisfaction</strong>—The feeling of emotional well-being that can come with freedom from debt obligations. A debt-free status also empowers borrowers to spend and invest in other areas.</li>
        </ul>

        <h4 className="font-bold text-primary mt-4">Drawbacks of early repayment</h4>
        <p>However, extra payments also come at a cost. Borrowers should consider the following factors before paying ahead on a mortgage:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Possible prepayment penalties</strong>—A prepayment penalty is an agreement, most likely explained in a mortgage contract, between a borrower and a mortgage lender that regulates what the borrower is allowed to pay off and when. Penalty amounts are usually expressed as a percent of the outstanding balance at the time of prepayment or a specified number of months of interest. The penalty amount typically decreases with time until it phases out eventually, normally within 5 years. One-time payoff due to home selling is normally exempt from a prepayment penalty.</li>
          <li><strong>Opportunity costs</strong>—Paying off a mortgage early may not be ideal since mortgage rates are relatively low compared to other financial rates. For example, paying off a mortgage with a 4% interest rate when a person could potentially make 10% or more by instead investing that money can be a significant opportunity cost.</li>
          <li><strong>Capital locked up in the house</strong>—Money put into the house is cash that the borrower cannot spend elsewhere. This may ultimately force a borrower to take out an additional loan if an unexpected need for cash arises.</li>
          <li><strong>Loss of tax deduction</strong>—Borrowers in the U.S. can deduct mortgage interest costs from their taxes. Lower interest payments result in less of a deduction. However, only taxpayers who itemize (rather than taking the standard deduction) can take advantage of this benefit.</li>
        </ul>

        <h3 className="text-lg font-bold text-primary mt-8">Brief History of Mortgages in the U.S.</h3>
        <p>In the early 20<sup>th</sup> century, buying a home involved saving up a large down payment. Borrowers would have to put 50% down, take out a three or five-year loan, then face a balloon payment at the end of the term.</p>
        <p>Only four in ten Americans could afford a home under such conditions. During the Great Depression, one-fourth of homeowners lost their homes.</p>
        <p>To remedy this situation, the government created the Federal Housing Administration (FHA) and Fannie Mae in the 1930s to bring liquidity, stability, and affordability to the mortgage market. Both entities helped to bring 30-year mortgages with more modest down payments and universal construction standards.</p>
        <p>These programs also helped returning soldiers finance a home after the end of World War II and sparked a construction boom in the following decades. Also, the FHA helped borrowers during harder times, such as the inflation crisis of the 1970s and the drop in energy prices in the 1980s.</p>
        <p>By 2001, the homeownership rate had reached a record level of 68.1%.</p>
        <p>Government involvement also helped during the 2008 financial crisis. The crisis forced a federal takeover of Fannie Mae as it lost billions amid massive defaults, though it returned to profitability by 2012.</p>
        <p>The FHA also offered further help amid the nationwide drop in real estate prices. It stepped in, claiming a higher percentage of mortgages amid backing by the Federal Reserve. This helped to stabilize the housing market by 2013. Today, both entities continue to actively insure millions of single-family homes and other residential properties.</p>
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
