import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export default function RetirementCalculator() {
  // State for Calculator 1
  const [c1CurrentAge, setC1CurrentAge] = useState('35');
  const [c1RetirementAge, setC1RetirementAge] = useState('67');
  const [c1LifeExpectancy, setC1LifeExpectancy] = useState('85');
  const [c1CurrentIncome, setC1CurrentIncome] = useState('70000');
  const [c1IncomeIncrease, setC1IncomeIncrease] = useState('3');
  const [c1IncomeNeeded, setC1IncomeNeeded] = useState('75');
  const [c1InvestmentReturn, setC1InvestmentReturn] = useState('6');
  const [c1InflationRate, setC1InflationRate] = useState('3');
  const [c1OtherIncome, setC1OtherIncome] = useState('0');
  const [c1CurrentSavings, setC1CurrentSavings] = useState('30000');
  const [c1FutureSavings, setC1FutureSavings] = useState('10');
  const [c1Result, setC1Result] = useState<any>(null);

  // State for Calculator 2
  const [c2AgeNow, setC2AgeNow] = useState('35');
  const [c2RetirementAge, setC2RetirementAge] = useState('67');
  const [c2AmountNeeded, setC2AmountNeeded] = useState('600000');
  const [c2SavingsNow, setC2SavingsNow] = useState('30000');
  const [c2InvestmentReturn, setC2InvestmentReturn] = useState('6');
  const [c2Result, setC2Result] = useState<any>(null);

  // State for Calculator 3
  const [c3AgeNow, setC3AgeNow] = useState('35');
  const [c3RetirementAge, setC3RetirementAge] = useState('67');
  const [c3LifeExpectancy, setC3LifeExpectancy] = useState('85');
  const [c3SavingsToday, setC3SavingsToday] = useState('30000');
  const [c3AnnualContribution, setC3AnnualContribution] = useState('0');
  const [c3MonthlyContribution, setC3MonthlyContribution] = useState('500');
  const [c3InvestmentReturn, setC3InvestmentReturn] = useState('6');
  const [c3InflationRate, setC3InflationRate] = useState('3');
  const [c3Result, setC3Result] = useState<any>(null);

  // State for Calculator 4
  const [c4AmountHave, setC4AmountHave] = useState('600000');
  const [c4WithdrawAmount, setC4WithdrawAmount] = useState('5000');
  const [c4InvestmentReturn, setC4InvestmentReturn] = useState('6');
  const [c4Result, setC4Result] = useState<any>(null);

  const calculateC1 = () => {
    const currentAge = parseFloat(c1CurrentAge) || 0;
    const retirementAge = parseFloat(c1RetirementAge) || 0;
    const lifeExpectancy = parseFloat(c1LifeExpectancy) || 0;
    const currentIncome = parseFloat(c1CurrentIncome) || 0;
    const incomeIncrease = (parseFloat(c1IncomeIncrease) || 0) / 100;
    const incomeNeeded = (parseFloat(c1IncomeNeeded) || 0) / 100;
    const investmentReturn = (parseFloat(c1InvestmentReturn) || 0) / 100;
    const inflationRate = (parseFloat(c1InflationRate) || 0) / 100;
    const otherIncome = parseFloat(c1OtherIncome) || 0;
    const currentSavings = parseFloat(c1CurrentSavings) || 0;
    const futureSavings = (parseFloat(c1FutureSavings) || 0) / 100;

    const yearsToRetirement = retirementAge - currentAge;
    const yearsInRetirement = lifeExpectancy - retirementAge;

    if (yearsToRetirement <= 0 || yearsInRetirement <= 0) return;

    const incomeAtRetirement = currentIncome * Math.pow(1 + incomeIncrease, yearsToRetirement);
    const firstYearRetirementIncomeNeeded = incomeAtRetirement * incomeNeeded;
    const annualOtherIncome = otherIncome * 12;
    const netIncomeNeededFirstYear = Math.max(0, firstYearRetirementIncomeNeeded - annualOtherIncome);

    let amountNeededAtRetirement = 0;
    const r = investmentReturn;
    const g = inflationRate;
    const n = yearsInRetirement;

    if (r === g) {
      amountNeededAtRetirement = netIncomeNeededFirstYear * n;
    } else {
      amountNeededAtRetirement = netIncomeNeededFirstYear * (1 - Math.pow((1 + g) / (1 + r), n)) / (r - g);
    }

    const fvCurrentSavings = currentSavings * Math.pow(1 + r, yearsToRetirement);
    
    let fvFutureSavings = 0;
    const pmt = currentIncome * futureSavings;
    const g_inc = incomeIncrease;
    const n_to_ret = yearsToRetirement;

    if (r === g_inc) {
      fvFutureSavings = pmt * n_to_ret * Math.pow(1 + r, n_to_ret - 1);
    } else {
      fvFutureSavings = pmt * (Math.pow(1 + r, n_to_ret) - Math.pow(1 + g_inc, n_to_ret)) / (r - g_inc);
    }

    const totalSavedAtRetirement = fvCurrentSavings + fvFutureSavings;
    const difference = totalSavedAtRetirement - amountNeededAtRetirement;

    setC1Result({
      amountNeeded: amountNeededAtRetirement,
      amountSaved: totalSavedAtRetirement,
      difference: difference
    });
  };

  const calculateC2 = () => {
    const ageNow = parseFloat(c2AgeNow) || 0;
    const retirementAge = parseFloat(c2RetirementAge) || 0;
    const amountNeeded = parseFloat(c2AmountNeeded) || 0;
    const savingsNow = parseFloat(c2SavingsNow) || 0;
    const investmentReturn = (parseFloat(c2InvestmentReturn) || 0) / 100;

    const yearsToRetirement = retirementAge - ageNow;
    if (yearsToRetirement <= 0) return;

    const r = investmentReturn;
    const fvCurrentSavings = savingsNow * Math.pow(1 + r, yearsToRetirement);
    const shortfall = Math.max(0, amountNeeded - fvCurrentSavings);

    let annualContribution = 0;
    if (r === 0) {
      annualContribution = shortfall / yearsToRetirement;
    } else {
      annualContribution = shortfall * r / (Math.pow(1 + r, yearsToRetirement) - 1);
    }

    const r_m = r / 12;
    const n_m = yearsToRetirement * 12;
    const fvCurrentSavings_m = savingsNow * Math.pow(1 + r_m, n_m);
    const shortfall_m = Math.max(0, amountNeeded - fvCurrentSavings_m);
    
    let monthlyContribution = 0;
    if (r_m === 0) {
      monthlyContribution = shortfall_m / n_m;
    } else {
      monthlyContribution = shortfall_m * r_m / (Math.pow(1 + r_m, n_m) - 1);
    }

    setC2Result({
      annualContribution,
      monthlyContribution
    });
  };

  const calculateC3 = () => {
    const ageNow = parseFloat(c3AgeNow) || 0;
    const retirementAge = parseFloat(c3RetirementAge) || 0;
    const lifeExpectancy = parseFloat(c3LifeExpectancy) || 0;
    const savingsToday = parseFloat(c3SavingsToday) || 0;
    const annualContribution = parseFloat(c3AnnualContribution) || 0;
    const monthlyContribution = parseFloat(c3MonthlyContribution) || 0;
    const investmentReturn = (parseFloat(c3InvestmentReturn) || 0) / 100;
    const inflationRate = (parseFloat(c3InflationRate) || 0) / 100;

    const yearsToRetirement = retirementAge - ageNow;
    const yearsInRetirement = lifeExpectancy - retirementAge;

    if (yearsToRetirement < 0 || yearsInRetirement <= 0) return;

    const r = investmentReturn;
    const g = inflationRate;
    
    const totalAnnualContribution = annualContribution + monthlyContribution * 12;
    
    const fvSavings = savingsToday * Math.pow(1 + r, yearsToRetirement);
    let fvContributions = 0;
    if (r === 0) {
      fvContributions = totalAnnualContribution * yearsToRetirement;
    } else {
      fvContributions = totalAnnualContribution * (Math.pow(1 + r, yearsToRetirement) - 1) / r;
    }

    const totalAtRetirement = fvSavings + fvContributions;

    let firstYearWithdrawal = 0;
    if (r === g) {
      firstYearWithdrawal = totalAtRetirement / yearsInRetirement;
    } else {
      firstYearWithdrawal = totalAtRetirement * (r - g) / (1 - Math.pow((1 + g) / (1 + r), yearsInRetirement));
    }

    setC3Result({
      totalAtRetirement,
      monthlyWithdrawal: firstYearWithdrawal / 12
    });
  };

  const calculateC4 = () => {
    const amountHave = parseFloat(c4AmountHave) || 0;
    const withdrawAmount = parseFloat(c4WithdrawAmount) || 0;
    const investmentReturn = (parseFloat(c4InvestmentReturn) || 0) / 100;

    const r_m = investmentReturn / 12;
    const pmt = withdrawAmount;
    const pv = amountHave;

    if (pv * r_m >= pmt) {
      setC4Result({
        lastsForever: true
      });
      return;
    }

    let n = 0;
    if (r_m === 0) {
      n = pv / pmt;
    } else {
      n = -Math.log(1 - pv * r_m / pmt) / Math.log(1 + r_m);
    }

    const years = Math.floor(n / 12);
    const months = Math.ceil(n % 12);

    setC4Result({
      lastsForever: false,
      years,
      months
    });
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans">
      <div className="flex justify-between items-center text-sm text-primary/60 mb-4">
        <div>
          <a href="#" className="hover:underline">home</a> / <a href="#" className="hover:underline">financial</a> / retirement calculator
        </div>
        <a href="#" className="text-secondary hover:underline">Print</a>
      </div>
      <h1 className="text-2xl font-bold mb-6 text-primary">Retirement Calculator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-9 space-y-8">
          
          <div className="bg-secondary text-white p-2 rounded-[1px] flex items-center justify-center gap-2 cursor-pointer text-sm font-bold shadow-sm">
            <div className="w-4 h-4 bg-white rounded-[1px] flex items-center justify-center text-blue-600 text-xs">▼</div>
            Modify the values and click the Calculate button to use
          </div>

          {/* Calculator 1: How much do you need to retire? */}
          <div>
            <h2 className="text-xl font-bold text-secondary mb-2">How much do you need to retire?</h2>
            <p className="text-sm text-primary/80 mb-4">
              This calculator can help with planning the financial aspects of your retirement, such as providing an idea where you stand in terms of retirement savings, how much to save to reach your target, and what your retrievals will look like in retirement.
            </p>
            <div className="bg-surface-container p-4 rounded-[1px] border border-outline-variant max-w-xl">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">Your current age</label>
                  <input type="number" value={c1CurrentAge} onChange={(e) => setC1CurrentAge(e.target.value)} className="w-40 px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">Your planned retirement age</label>
                  <input type="number" value={c1RetirementAge} onChange={(e) => setC1RetirementAge(e.target.value)} className="w-40 px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-primary/90 flex items-center gap-1">Your life expectancy <HelpCircle className="w-3 h-3 text-gray-400" /></label>
                  <input type="number" value={c1LifeExpectancy} onChange={(e) => setC1LifeExpectancy(e.target.value)} className="w-40 px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">Your current pre-tax income</label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-40">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                      <input type="number" value={c1CurrentIncome} onChange={(e) => setC1CurrentIncome(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    </div>
                    <span className="text-primary/80">/year</span>
                  </div>
                </div>

                <div className="bg-secondary text-white px-2 py-1 font-bold mt-4 mb-2">Assumptions</div>
                
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">Your current income increase</label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-24">
                      <input type="number" value={c1IncomeIncrease} onChange={(e) => setC1IncomeIncrease(e.target.value)} className="w-full pr-6 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                    </div>
                    <span className="text-primary/80">/year</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-primary/90 flex items-center gap-1">Income needed after retirement <HelpCircle className="w-3 h-3 text-gray-400" /></label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-24">
                      <input type="number" value={c1IncomeNeeded} onChange={(e) => setC1IncomeNeeded(e.target.value)} className="w-full pr-6 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                    </div>
                    <span className="text-primary/80">of current income</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">Average investment return</label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-24">
                      <input type="number" value={c1InvestmentReturn} onChange={(e) => setC1InvestmentReturn(e.target.value)} className="w-full pr-6 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                    </div>
                    <span className="text-primary/80">/year</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-primary/90 flex items-center gap-1">Inflation rate <HelpCircle className="w-3 h-3 text-gray-400" /></label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-24">
                      <input type="number" value={c1InflationRate} onChange={(e) => setC1InflationRate(e.target.value)} className="w-full pr-6 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                    </div>
                    <span className="text-primary/80">/year</span>
                  </div>
                </div>

                <div className="bg-secondary text-white px-2 py-1 font-bold mt-4 mb-2">Optional</div>
                
                <div className="flex items-center justify-between">
                  <label className="text-primary/90 flex items-center gap-1">Other income after retirement <HelpCircle className="w-3 h-3 text-gray-400" /></label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-24">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                      <input type="number" value={c1OtherIncome} onChange={(e) => setC1OtherIncome(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    </div>
                    <span className="text-primary/80">/month</span>
                    <span className="text-xs text-primary/50"><a href="#" className="text-secondary hover:underline">social security</a>, pension, etc</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">Your current retirement savings</label>
                  <div className="relative w-40">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                    <input type="number" value={c1CurrentSavings} onChange={(e) => setC1CurrentSavings(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">Future retirement savings</label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-24">
                      <input type="number" value={c1FutureSavings} onChange={(e) => setC1FutureSavings(e.target.value)} className="w-full pr-6 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                    </div>
                    <span className="text-primary/80">of income</span>
                  </div>
                </div>

                <div className="flex justify-center gap-2 pt-4">
                  <button onClick={calculateC1} className="bg-[#4caf50] hover:bg-[#45a049] text-white px-4 py-1.5 rounded-[1px] font-bold flex items-center gap-1 shadow-sm">
                    Calculate <span className="text-xs bg-white text-[#4caf50] rounded-[1px] w-4 h-4 flex items-center justify-center">▶</span>
                  </button>
                  <button onClick={() => setC1Result(null)} className="bg-[#9e9e9e] hover:bg-[#8e8e8e] text-white px-4 py-1.5 rounded-[1px] font-bold shadow-sm">
                    Clear
                  </button>
                </div>
              </div>
            </div>
            {c1Result && (
              <div className="mt-4 bg-surface-container-low p-4 border border-outline-variant rounded-[1px] max-w-xl">
                <h3 className="font-bold text-primary mb-2">Results</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-primary/80">Amount needed at retirement:</span>
                    <span className="font-bold text-primary">{formatCurrency(c1Result.amountNeeded)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary/80">Amount saved at retirement:</span>
                    <span className="font-bold text-primary">{formatCurrency(c1Result.amountSaved)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-outline-variant">
                    <span className="text-primary/80 font-bold">Difference:</span>
                    <span className={`font-bold ${c1Result.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {c1Result.difference >= 0 ? '+' : ''}{formatCurrency(c1Result.difference)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Calculator 2: How can you save for retirement? */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-secondary mb-2">How can you save for retirement?</h2>
            <p className="text-sm text-primary/80 mb-4">
              This calculation presents potential savings plans based on desired savings at retirement.
            </p>
            <div className="bg-surface-container p-4 rounded-[1px] border border-outline-variant max-w-xl">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">Your age now</label>
                  <input type="number" value={c2AgeNow} onChange={(e) => setC2AgeNow(e.target.value)} className="w-40 px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">Your planned retirement age</label>
                  <input type="number" value={c2RetirementAge} onChange={(e) => setC2RetirementAge(e.target.value)} className="w-40 px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">Amount needed at the retirement age</label>
                  <div className="relative w-40">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                    <input type="number" value={c2AmountNeeded} onChange={(e) => setC2AmountNeeded(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">Your retirement savings now</label>
                  <div className="relative w-40">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                    <input type="number" value={c2SavingsNow} onChange={(e) => setC2SavingsNow(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">Average investment return</label>
                  <div className="relative w-40">
                    <input type="number" value={c2InvestmentReturn} onChange={(e) => setC2InvestmentReturn(e.target.value)} className="w-full pr-6 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                  </div>
                </div>

                <div className="flex justify-center gap-2 pt-4">
                  <button onClick={calculateC2} className="bg-[#4caf50] hover:bg-[#45a049] text-white px-4 py-1.5 rounded-[1px] font-bold flex items-center gap-1 shadow-sm">
                    Calculate <span className="text-xs bg-white text-[#4caf50] rounded-[1px] w-4 h-4 flex items-center justify-center">▶</span>
                  </button>
                  <button onClick={() => setC2Result(null)} className="bg-[#9e9e9e] hover:bg-[#8e8e8e] text-white px-4 py-1.5 rounded-[1px] font-bold shadow-sm">
                    Clear
                  </button>
                </div>
              </div>
            </div>
            {c2Result && (
              <div className="mt-4 bg-surface-container-low p-4 border border-outline-variant rounded-[1px] max-w-xl">
                <h3 className="font-bold text-primary mb-2">Results</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-primary/80">Monthly contribution needed:</span>
                    <span className="font-bold text-primary">{formatCurrency(c2Result.monthlyContribution)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary/80">Annual contribution needed:</span>
                    <span className="font-bold text-primary">{formatCurrency(c2Result.annualContribution)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Calculator 3: How much can you withdraw after retirement? */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-secondary mb-2">How much can you withdraw after retirement?</h2>
            <p className="text-sm text-primary/80 mb-4">
              This calculation estimates the amount a person can withdraw every month in retirement.
            </p>
            <div className="bg-surface-container p-4 rounded-[1px] border border-outline-variant max-w-xl">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">Your age now</label>
                  <input type="number" value={c3AgeNow} onChange={(e) => setC3AgeNow(e.target.value)} className="w-40 px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">Your planned retirement age</label>
                  <input type="number" value={c3RetirementAge} onChange={(e) => setC3RetirementAge(e.target.value)} className="w-40 px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">Your life expectancy</label>
                  <input type="number" value={c3LifeExpectancy} onChange={(e) => setC3LifeExpectancy(e.target.value)} className="w-40 px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">Your retirement savings today</label>
                  <div className="relative w-40">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                    <input type="number" value={c3SavingsToday} onChange={(e) => setC3SavingsToday(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">Annual contribution</label>
                  <div className="relative w-40">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                    <input type="number" value={c3AnnualContribution} onChange={(e) => setC3AnnualContribution(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">Monthly contribution</label>
                  <div className="relative w-40">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                    <input type="number" value={c3MonthlyContribution} onChange={(e) => setC3MonthlyContribution(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">Average investment return</label>
                  <div className="relative w-40">
                    <input type="number" value={c3InvestmentReturn} onChange={(e) => setC3InvestmentReturn(e.target.value)} className="w-full pr-6 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">Inflation rate (annual)</label>
                  <div className="relative w-40">
                    <input type="number" value={c3InflationRate} onChange={(e) => setC3InflationRate(e.target.value)} className="w-full pr-6 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                  </div>
                </div>

                <div className="flex justify-center gap-2 pt-4">
                  <button onClick={calculateC3} className="bg-[#4caf50] hover:bg-[#45a049] text-white px-4 py-1.5 rounded-[1px] font-bold flex items-center gap-1 shadow-sm">
                    Calculate <span className="text-xs bg-white text-[#4caf50] rounded-[1px] w-4 h-4 flex items-center justify-center">▶</span>
                  </button>
                  <button onClick={() => setC3Result(null)} className="bg-[#9e9e9e] hover:bg-[#8e8e8e] text-white px-4 py-1.5 rounded-[1px] font-bold shadow-sm">
                    Clear
                  </button>
                </div>
              </div>
            </div>
            {c3Result && (
              <div className="mt-4 bg-surface-container-low p-4 border border-outline-variant rounded-[1px] max-w-xl">
                <h3 className="font-bold text-primary mb-2">Results</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-primary/80">Total at retirement:</span>
                    <span className="font-bold text-primary">{formatCurrency(c3Result.totalAtRetirement)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary/80">Monthly withdrawal amount:</span>
                    <span className="font-bold text-primary">{formatCurrency(c3Result.monthlyWithdrawal)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Calculator 4: How long can your money last? */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-secondary mb-2">How long can your money last?</h2>
            <p className="text-sm text-primary/80 mb-4">
              This calculator estimates how long your savings can last at a given withdrawal rate.
            </p>
            <div className="bg-surface-container p-4 rounded-[1px] border border-outline-variant max-w-xl">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">The amount you have</label>
                  <div className="relative w-40">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                    <input type="number" value={c4AmountHave} onChange={(e) => setC4AmountHave(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">You plan to withdraw</label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-32">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                      <input type="number" value={c4WithdrawAmount} onChange={(e) => setC4WithdrawAmount(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    </div>
                    <span className="text-primary/80">/month</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-primary/90">Average investment return</label>
                  <div className="relative w-40">
                    <input type="number" value={c4InvestmentReturn} onChange={(e) => setC4InvestmentReturn(e.target.value)} className="w-full pr-6 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                  </div>
                </div>

                <div className="flex justify-center gap-2 pt-4">
                  <button onClick={calculateC4} className="bg-[#4caf50] hover:bg-[#45a049] text-white px-4 py-1.5 rounded-[1px] font-bold flex items-center gap-1 shadow-sm">
                    Calculate <span className="text-xs bg-white text-[#4caf50] rounded-[1px] w-4 h-4 flex items-center justify-center">▶</span>
                  </button>
                  <button onClick={() => setC4Result(null)} className="bg-[#9e9e9e] hover:bg-[#8e8e8e] text-white px-4 py-1.5 rounded-[1px] font-bold shadow-sm">
                    Clear
                  </button>
                </div>
              </div>
            </div>
            {c4Result && (
              <div className="mt-4 bg-surface-container-low p-4 border border-outline-variant rounded-[1px] max-w-xl">
                <h3 className="font-bold text-primary mb-2">Results</h3>
                <div className="text-sm">
                  {c4Result.lastsForever ? (
                    <p className="font-bold text-green-600">Your money will last forever at this withdrawal rate!</p>
                  ) : (
                    <p className="text-primary/80">
                      Your money will last for <span className="font-bold text-primary">{c4Result.years} years</span> and <span className="font-bold text-primary">{c4Result.months} months</span>.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Related */}
          <div className="mt-8">
            <h3 className="font-bold text-primary mb-2">Related</h3>
            <div className="flex gap-2">
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">401K Calculator</button>
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">Roth IRA Calculator</button>
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">Investment Calculator</button>
            </div>
          </div>

          {/* Text Content */}
          <div className="mt-12 space-y-6 text-sm text-primary/80 leading-relaxed">
            <h3 className="text-lg font-bold text-secondary">What is Retirement?</h3>
            <p>To retire is to withdraw from active working life, and for most retirees, retirement lasts the rest of their lives.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Why Retire?</h3>
            <p>There are many factors at play that ultimately affect a person's decision to retire. Physical or mental health can affect a person's decision to retire; if a worker is not physically strong enough, succumbs to a disability, or has mentally declined too much to perform the duties of their job, they should probably consider retiring, or at the very least try to find a new occupation that better accommodates their health. Also, stressors associated with an occupation can become too unbearable, leading to a decline in satisfaction with work. Age is also a factor that affects a person's decision to retire. Theoretically, retirement can happen during any normal working year. Some may choose to "semi-retire" by gradually decreasing their work hours as they approach retirement. Some announce retirement and enter it short-term, just to rejoin the workforce again. However, it generally occurs between the ages of 55 and 70.</p>
            <p>One of the most important factors that affect a person's decision to retire is whether it is even financially possible in the first place. While it is somewhat possible to retire with nothing in savings and to rely solely on Social Security (which an unfortunately significant number of Americans in the U.S. do), it is generally a bad idea for most due to the sheer difference between a working income as opposed to the Social Security benefits. In the U.S., Social Security benefits are only designed to replace about 40% of the average worker's wages during retirement.</p>
            <p>Retirement is an important consideration for everyone, and when not forced to retire due to various reasons such as illness or disability, most people choose to retire when they are ready and comfortable with the decision.</p>

            <h3 className="text-lg font-bold text-primary mt-8">How Much to Save for Retirement</h3>
            <p>Naturally, the next question becomes: how much should a person save for retirement? Simply put, it's an extremely loaded question with very few definite answers. Similar to the answer to the question of whether to retire or not, it will depend on each person, and factors such as how much income will be needed, entitlement for Social Security retirement benefits, health and life expectancy, personal preferences regarding inheritances, and many other things.</p>
            <p>Below are some general guidelines.</p>

            <h4 className="font-bold text-primary mt-4">10% Rule</h4>
            <p>This rule suggests that a person save 10% to 15% of their pre-tax income per year during their working years. For instance, a person who makes $50,000 a year would put away anywhere from $5,000 to $7,500 for that year. Roughly speaking, by saving 10% starting at age 25, a $1 million nest egg by the time of retirement is possible.</p>

            <h4 className="font-bold text-primary mt-4">80% Rule</h4>
            <p>Another popular rule suggests that an income of 70% to 80% of a worker's pre-retirement income can maintain a retiree's standard of living after retirement. For example, if a person made roughly $100,000 a year on average during his working life, this person can have a similar standard of living with $70,000 - $80,000 a year of income after retirement. This 70% - 80% figure can vary greatly depending on how people envision their retirements. Some retirees want to sail a yacht around the world, while others want to live in a simple cabin in the woods.</p>

            <h4 className="font-bold text-primary mt-4">4% Rule</h4>
            <p>People who have a good estimate of how much they will require a year in retirement can divide this number by 4% to determine the nest egg required to enable their lifestyle. For instance, if a retiree estimates they need $100,000 a year, according to the 4% rule, the nest egg required is $100,000 / 4% = $2.5 million.</p>
            <p>Some experts claim that savings of 15 to 25 times of a person's current annual income are enough to last them throughout their retirement. Of course, there are other ways to determine how much to save for retirement. The calculations here can be helpful, as can many other retirement calculators out there. It also can be helpful to speak with licensed professionals who help people plan their retirements.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Impact of Inflation on Retirement Savings</h3>
            <p>Inflation is the general increase in prices and a fall in the purchasing power of money over time. The average inflation rate in the United States for the past 30 years has been around 2.6% per year, which means that the purchasing power of one dollar now is not only less than one dollar 30 years ago but less than 50 cents! Inflation is one of the reasons why people tend to underestimate how much they need to save for retirement.</p>
            <p>Although inflation does have an impact on retirement savings, it is unpredictable and mostly out of a person's control. As a result, people generally do not center their retirement planning or investments around inflation and instead focus mainly on achieving as large and steady a total return on investment as possible. For people interested in mitigating inflation, there are investments in the U.S. that are specifically designed to counter inflation called Treasury Inflation-Protected Securities (TIPS) and similar investments in other countries that go by different names. Also, gold and other commodities are traditionally favored as protection against inflation, as are dividend-paying stocks as opposed to short-term bonds.</p>
            <p>Our Retirement Calculator can help by considering inflation in several calculations. Please visit the <a href="#" className="text-secondary hover:underline">Inflation Calculator</a> for more information about inflation or to do calculations involving inflation.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Common Sources of Retirement Funds</h3>
            <p>People in the U.S. generally rely on the following sources for financial support after retirement.</p>

            <h4 className="font-bold text-primary mt-4">Social Security</h4>
            <p>Social Security is a social insurance program run by the government to provide protection against poverty, old age, and disability. People in the U.S. who have contributed to the Federal Insurance Contributions Act (FICA) tax as a percentage of their payroll will receive some of their income in the form of Social Security benefits during retirement. In the U.S., Social Security was designed to replace approximately 40% of a person's working income. Yet, approximately one-third of the working population and 50% of retirees expect Social Security to be their major source of income after retirement.</p>
            <p>Future proceeds from Social Security are only loosely based on past income levels. For example, a person earning $20,000 per year would receive approximately $800 per month in benefits. A person earning $100,000 per year would receive around $2,000 per month in benefits. As can be seen, while a person who earns more does receive more in benefits as their income increases, the increase in benefits is not proportional. What this translates to is that low income-earners have more to gain from their initial investments into Social Security relative to higher income-earners. For more information or to do calculations involving Social Security, please visit our <a href="#" className="text-secondary hover:underline">Social Security Calculator</a>.</p>

            <h4 className="font-bold text-primary mt-4">Pensions, 401(k)s, Individual Retirement Accounts (IRA), and Other Savings Plans</h4>
            
            <h5 className="font-bold text-primary/90 mt-2">401(k), 403(b), 457 Plan</h5>
            <p>In the U.S., two of the most popular ways to save for retirement include Employer Matching Programs such as the 401(k) and their offshoot, the 403(b) (nonprofit, religious organizations, school districts, governmental organizations). 401(k)s vary from company to company, but many employers offer a matching contribution up to a certain percentage of the gross income of the employee. For example, an employer may match up to 3% of an employee's contribution to their 401(k); if this employee earned $60,000, the employer would contribute a maximum of $1,800 to the employee's 401(k) that year. Only 6% of companies that offer 401(k)s don't make some sort of employer contribution. It is generally recommended to at least contribute the maximum amount that an employer will match.</p>
            <p>Employer matching program contributions are made using pre-tax dollars. Funds are essentially allowed to grow tax-free until distributed. Only distributions are taxed as ordinary income in retirement, during which retirees most likely fall within a lower tax bracket. Please visit our <a href="#" className="text-secondary hover:underline">401K Calculator</a> for more information about 401(k)s.</p>

            <h5 className="font-bold text-primary/90 mt-2">IRA and Roth IRA</h5>
            <p>In the U.S., the traditional IRA (Individual Retirement Account) and Roth IRA are also popular forms of retirement savings. Just like 401(k)s and other employer matching programs, there are specific tax shields in place that make them both appealing. The big difference between traditional IRAs and Roth IRAs is when taxation is applied. The former's contributions go in pre-tax (usually taken from gross pay, very similar to 401(k)s) but are taxed upon withdrawal. In contrast, Roth IRA contributions are deposited using after-tax dollars and are not taxed when withdrawn during retirement. For more information about traditional IRAs or Roth IRAs, please visit our <a href="#" className="text-secondary hover:underline">IRA Calculator</a> or <a href="#" className="text-secondary hover:underline">Roth IRA Calculator</a>.</p>

            <h5 className="font-bold text-primary/90 mt-2">Pension Plans</h5>
            <p>Pension plans are retirement funds that employers pool together and manage for their employees until they retire. Most public servants in the United States are covered by pension programs rather than Social Security. Some private employers may also provide pension benefits. Upon retirement, each employee can then choose to have fixed payouts from their share of the pension pot or sell them as a lump sum to an insurance company. They can then choose to receive income in the form of an annuity.</p>
            <p>In the U.S., pension plans were a popular form of saving for retirement in the past, but they have since fallen out of favor, largely due to increasing longevity; there are fewer workers for each retired person. However, they can still be found in the public sector or traditional corporations.</p>
            <p>For more information about or to do calculations involving pensions, please visit the <a href="#" className="text-secondary hover:underline">Pension Calculator</a>.</p>

            <h5 className="font-bold text-primary/90 mt-2">Investments and CDs</h5>
            <p>In the U.S., while pensions, 401(k)s, and IRAs are great ways to save for retirement due to their tax benefits, they all have annual investment limits that can vary based on income or other factors. In general, investments are used as a method to grow wealth, but people who have maxed out their tax-advantaged retirement accounts are searching for other places to put retirement funds can also use investments in order to reach their retirement goals.</p>
            <p>Examples of typical investments in the U.S. include mutual funds, index funds, individual stocks, real estate properties, bonds, commodities such as gold, and Certificates of Deposit (CDs). While these are some of the most popular, the list of potential investments as a way to grow wealth for retirement is much, much longer.</p>
            <p>Some funds offer a relatively steady rate of growth over time, while individual stocks tend to be volatile. Gold and other commodities tend to fluctuate depending on economic conditions, and so does real estate. Comparatively, CDs and fixed income investments have low returns but make good options for those who seek low-risk, steady income, and are approaching or in retirement. All investments have different levels of risk and reward, and it is up to each individual to decide what is best for them. Tax-advantaged retirement accounts listed above will most likely use these same investments in their portfolios, with the addition of the tax benefits.</p>
            <p>For more information or to do calculations involving investments, please visit the <a href="#" className="text-secondary hover:underline">Investment Calculator</a>.</p>

            <h5 className="font-bold text-primary/90 mt-2">Personal Savings</h5>
            <p>What may seem like the most obvious way to save for retirement is through personal savings such as checking, savings, or money market accounts; after all, it is the first place where surplus disposable income accumulates for most people before something is done with it. However, it may not exactly be the best method to save for retirement over the long term, mainly due to inflation. In the U.S., personal savings such as cash, checking accounts, savings accounts, or other forms of liquid assets normally offer little to no interest. With income tax accounted for, the returns rarely beat inflation.</p>
            <p>That's not to say that there aren't certain benefits to having some savings in a readily available form in the case of an emergency. Emergency funds are an important part of healthy personal finance arrangements that can eventually be contributed to a retirement fund if not used.</p>

            <h4 className="font-bold text-primary mt-4">Other Sources of Retirement Income</h4>
            
            <h5 className="font-bold text-primary/90 mt-2">Home Equity and Real Estate</h5>
            <p>For some people in certain scenarios, preexisting mortgages and ownership of real estate can be liquidated for disposable income during retirement through a reverse mortgage. A reverse mortgage is just as it is aptly named — a reversing of a mortgage where at the end (the last amortized payment has been released), ownership of the house is transferred to whoever bought the reverse mortgage. In other words, retirees are paid to live in their homes until a fixed point in the future, where ownership of the home is finally transferred.</p>

            <h5 className="font-bold text-primary/90 mt-2">Annuities</h5>
            <p>A common way to receive income in retirement is through the use of an annuity, which is a fixed sum of periodic cash flows typically distributed for the rest of an annuitant's life. There are two types of annuities: immediate and deferred. Immediate annuities are upfront premiums paid which release payments from the principal starting as early as the next month. Deferred annuities are annuities with two phases. The first phase is the accumulation or deferral phase, during which a person contributes money to the account (or pays a premium). The second phase is the distribution, or annuitization phase, during which a person will receive periodic payments until death. For more information, it may be worth checking out our <a href="#" className="text-secondary hover:underline">Annuity Calculator</a> or <a href="#" className="text-secondary hover:underline">Annuity Payout Calculator</a> to determine whether annuities could be a viable option for your retirement.</p>

            <h5 className="font-bold text-primary/90 mt-2">Passive Income</h5>
            <p>Just because other investments don't have tax benefits doesn't mean they should automatically be ruled out. Passive income is one of them. During retirement, they can come in forms such as rental income, income from a business, stock dividends, or royalties. When 401(k) and IRA accounts have reached their contribution limits, passively-held investments offer another avenue where any remaining money can be placed. For more information on rental properties, please visit the <a href="#" className="text-secondary hover:underline">Rental Property Calculator</a>.</p>

            <h5 className="font-bold text-primary/90 mt-2">Inheritance</h5>
            <p>An inheritance is a portion of assets given to the heirs of the deceased, which an heir can use as income for retirement. However, because the estates of owners that die haven't exchanged hands since ownership, they may still be subject to tax, whether state or federal (In the U.S., along with the mandatory federal estate tax, six states mandate the payment of a separate inheritance tax). Also, the value of an inheritance may change due to factors such as legal rights or financial volatility. Tangible assets such as real estate or jewelry may require the payment of capital gains tax if the assets are sold for profit. For more information about inheritances or to do calculations involving estate tax, please visit the <a href="#" className="text-secondary hover:underline">Estate Tax Calculator</a>.</p>
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
