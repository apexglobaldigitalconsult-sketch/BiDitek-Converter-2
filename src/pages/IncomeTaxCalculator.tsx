import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function IncomeTaxCalculator() {
  const [grossIncome, setGrossIncome] = useState('75000');
  const [filingStatus, setFilingStatus] = useState('single');
  const [stateTaxRate, setStateTaxRate] = useState('5');
  const [deductionType, setDeductionType] = useState('standard');
  const [itemizedDeduction, setItemizedDeduction] = useState('0');

  const calculateTaxes = () => {
    const gross = parseFloat(grossIncome) || 0;
    const stateRate = parseFloat(stateTaxRate) || 0;
    const itemized = parseFloat(itemizedDeduction) || 0;

    // 2024 Standard Deductions
    const standardDeduction = filingStatus === 'single' ? 14600 : 29200;
    const deduction = deductionType === 'standard' ? standardDeduction : itemized;

    const taxableIncome = Math.max(0, gross - deduction);

    // 2024 Federal Tax Brackets
    const singleBrackets = [
      { limit: 11600, rate: 0.10 },
      { limit: 47150, rate: 0.12 },
      { limit: 100525, rate: 0.22 },
      { limit: 191950, rate: 0.24 },
      { limit: 243725, rate: 0.32 },
      { limit: 609350, rate: 0.35 },
      { limit: Infinity, rate: 0.37 }
    ];

    const mfjBrackets = [
      { limit: 23200, rate: 0.10 },
      { limit: 94300, rate: 0.12 },
      { limit: 201050, rate: 0.22 },
      { limit: 383900, rate: 0.24 },
      { limit: 487450, rate: 0.32 },
      { limit: 731200, rate: 0.35 },
      { limit: Infinity, rate: 0.37 }
    ];

    const brackets = filingStatus === 'single' ? singleBrackets : mfjBrackets;

    let federalTax = 0;
    let previousLimit = 0;

    for (let i = 0; i < brackets.length; i++) {
      if (taxableIncome > previousLimit) {
        const taxableAtThisRate = Math.min(taxableIncome - previousLimit, brackets[i].limit - previousLimit);
        federalTax += taxableAtThisRate * brackets[i].rate;
        previousLimit = brackets[i].limit;
      } else {
        break;
      }
    }

    // FICA (Social Security + Medicare)
    const ssLimit = 168600; // 2024 limit
    const ssTax = Math.min(gross, ssLimit) * 0.062;
    
    let medicareTax = gross * 0.0145;
    const additionalMedicareThreshold = filingStatus === 'single' ? 200000 : 250000;
    if (gross > additionalMedicareThreshold) {
      medicareTax += (gross - additionalMedicareThreshold) * 0.009;
    }

    const ficaTax = ssTax + medicareTax;
    
    // Simplified State Tax
    const stateTax = gross * (stateRate / 100);

    const totalTax = federalTax + ficaTax + stateTax;
    const takeHome = gross - totalTax;
    const effectiveRate = gross > 0 ? (totalTax / gross) * 100 : 0;

    const chartData = [
      { name: 'Take Home Pay', value: Math.max(0, takeHome), color: '#4caf50' },
      { name: 'Federal Tax', value: federalTax, color: '#3b82f6' },
      { name: 'FICA (SS & Medicare)', value: ficaTax, color: '#f97316' },
      { name: 'State Tax', value: stateTax, color: '#8b5cf6' }
    ].filter(item => item.value > 0);

    return {
      gross,
      federalTax,
      ficaTax,
      stateTax,
      totalTax,
      takeHome,
      effectiveRate,
      taxableIncome,
      deduction,
      chartData
    };
  };

  const results = useMemo(() => calculateTaxes(), [grossIncome, filingStatus, stateTaxRate, deductionType, itemizedDeduction]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans">
      <div className="flex justify-between items-center text-sm text-primary/60 mb-4">
        <div>
          <a href="#" className="hover:underline">home</a> / <a href="#" className="hover:underline">financial</a> / income tax calculator
        </div>
        <a href="#" className="text-secondary hover:underline">Print</a>
      </div>
      <h1 className="text-2xl font-bold mb-2 text-primary">Income Tax Calculator</h1>
      <p className="text-sm text-primary/80 mb-6 leading-relaxed">
        This calculator estimates your federal, state, and local income taxes for the 2024 tax year. It provides a breakdown of your take-home pay, tax brackets, and effective tax rate based on your gross income and filing status.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-9 space-y-8">
          
          <div className="bg-secondary text-white p-2 rounded-[1px] flex items-center justify-center gap-2 cursor-pointer text-sm font-bold shadow-sm">
            <div className="w-4 h-4 bg-white rounded-[1px] flex items-center justify-center text-blue-600 text-xs">▼</div>
            Modify the values and click the Calculate button to use
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column: Inputs */}
            <div className="md:col-span-5">
              <div className="bg-surface-container p-4 border border-outline-variant rounded-[1px]">
                <div className="space-y-4 text-sm">
                  
                  <div className="flex flex-col space-y-1">
                    <label className="text-primary/90 font-semibold">Gross Income (Annual)</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                      <input type="number" value={grossIncome} onChange={(e) => setGrossIncome(e.target.value)} className="w-full pl-6 pr-2 py-1.5 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-primary/90 font-semibold">Filing Status</label>
                    <select value={filingStatus} onChange={(e) => setFilingStatus(e.target.value)} className="w-full px-2 py-1.5 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary">
                      <option value="single">Single</option>
                      <option value="mfj">Married Filing Jointly</option>
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-primary/90 font-semibold">Estimated State Tax Rate</label>
                    <div className="relative">
                      <input type="number" step="0.1" value={stateTaxRate} onChange={(e) => setStateTaxRate(e.target.value)} className="w-full pr-6 pl-2 py-1.5 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-primary/90 font-semibold">Deduction Type</label>
                    <select value={deductionType} onChange={(e) => setDeductionType(e.target.value)} className="w-full px-2 py-1.5 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary">
                      <option value="standard">Standard Deduction</option>
                      <option value="itemized">Itemized Deduction</option>
                    </select>
                  </div>

                  {deductionType === 'itemized' && (
                    <div className="flex flex-col space-y-1">
                      <label className="text-primary/90 font-semibold">Itemized Amount</label>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                        <input type="number" value={itemizedDeduction} onChange={(e) => setItemizedDeduction(e.target.value)} className="w-full pl-6 pr-2 py-1.5 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center gap-2 pt-4">
                    <button className="bg-[#4caf50] hover:bg-[#45a049] text-white px-6 py-2 rounded-[1px] font-bold flex items-center gap-1 shadow-sm w-full justify-center">
                      Calculate
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Results */}
            <div className="md:col-span-7 space-y-6">
              <div className="bg-surface-container-low border border-outline-variant rounded-[1px] shadow-sm overflow-hidden">
                <div className="bg-[#7cb342] text-white p-2 flex justify-between items-center">
                  <span className="font-bold text-lg">Results Summary</span>
                  <div className="w-4 h-4 border border-white flex items-center justify-center text-[10px]">💾</div>
                </div>
                
                <div className="p-4 bg-surface-container">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-outline-variant">
                      <span className="text-primary/90 font-bold text-base">Estimated Take Home Pay</span>
                      <span className="text-[#4caf50] font-bold text-lg">{formatCurrency(results.takeHome)}</span>
                    </div>
                    
                    <div className="flex justify-between py-1">
                      <span className="text-primary/80">Gross Income</span>
                      <span className="text-primary font-medium">{formatCurrency(results.gross)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-primary/80">Total Taxes</span>
                      <span className="text-red-600 dark:text-red-400 font-medium">-{formatCurrency(results.totalTax)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-t border-outline-variant mt-2 pt-2">
                      <span className="text-primary/90 font-semibold">Effective Tax Rate</span>
                      <span className="text-primary font-bold">{results.effectiveRate.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Breakdown Table */}
              <div className="bg-surface-container-low border border-outline-variant rounded-[1px] shadow-sm overflow-hidden">
                <div className="bg-secondary text-white p-2">
                  <span className="font-bold">Tax Breakdown</span>
                </div>
                <div className="p-0">
                  <table className="w-full text-sm text-left">
                    <tbody className="divide-y divide-outline-variant">
                      <tr className="bg-surface-container-low">
                        <td className="p-3 text-primary/90 font-medium">Federal Income Tax</td>
                        <td className="p-3 text-right text-primary">{formatCurrency(results.federalTax)}</td>
                      </tr>
                      <tr className="bg-surface-container">
                        <td className="p-3 text-primary/90 font-medium">State Income Tax (Est.)</td>
                        <td className="p-3 text-right text-primary">{formatCurrency(results.stateTax)}</td>
                      </tr>
                      <tr className="bg-surface-container-low">
                        <td className="p-3 text-primary/90 font-medium">FICA (Social Security + Medicare)</td>
                        <td className="p-3 text-right text-primary">{formatCurrency(results.ficaTax)}</td>
                      </tr>
                      <tr className="bg-surface-container font-bold">
                        <td className="p-3 text-primary">Total Tax Amount</td>
                        <td className="p-3 text-right text-red-600 dark:text-red-400">{formatCurrency(results.totalTax)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>

          {/* Chart */}
          <div className="mt-8 bg-surface-container-low p-6 border border-outline-variant rounded-[1px] shadow-sm">
            <h3 className="text-center font-bold text-primary mb-4">Income Breakdown</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={results.chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {results.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Related */}
          <div className="mt-8">
            <h3 className="font-bold text-primary mb-2">Related</h3>
            <div className="flex flex-wrap gap-2">
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">Salary Calculator</button>
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">Retirement Calculator</button>
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">401K Calculator</button>
            </div>
          </div>

          {/* Text Content */}
          <div className="mt-12 space-y-6 text-sm text-primary/80 leading-relaxed">
            <h3 className="text-lg font-bold text-primary">Understanding Income Tax in the US</h3>
            <p>In the United States, the income tax system is progressive, meaning that as your income increases, the percentage of tax you pay on the higher portions of your income also increases. The federal government, most state governments, and some local governments impose income taxes.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Federal Income Tax Brackets (2024)</h3>
            <p>The US tax system is divided into brackets. You don't pay the top rate on all your income; instead, you pay the specific rate for each portion of your income that falls within that bracket. For example, a single filer in 2024 pays 10% on the first $11,600, 12% on the amount between $11,601 and $47,150, and so on.</p>
            
            <h3 className="text-lg font-bold text-primary mt-8">Standard vs. Itemized Deductions</h3>
            <p>Before calculating your tax, you can reduce your gross income by taking deductions. The IRS offers a Standard Deduction, which is a fixed dollar amount that reduces the income you're taxed on. For 2024, the standard deduction is $14,600 for single filers and $29,200 for married couples filing jointly.</p>
            <p>Alternatively, you can choose to itemize your deductions if your eligible expenses (like mortgage interest, state/local taxes, and charitable contributions) exceed the standard deduction amount.</p>

            <h3 className="text-lg font-bold text-primary mt-8">FICA (Social Security and Medicare)</h3>
            <p>In addition to federal income tax, employees must pay FICA taxes. This consists of a 6.2% Social Security tax (up to a wage base limit of $168,600 in 2024) and a 1.45% Medicare tax on all earnings. High earners may also be subject to an Additional Medicare Tax of 0.9% on earnings above certain thresholds.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Effective vs. Marginal Tax Rate</h3>
            <p>Your <strong>Marginal Tax Rate</strong> is the highest tax bracket your top dollar of income falls into. Your <strong>Effective Tax Rate</strong> is the actual percentage of your total income that you pay in taxes. Because of the progressive bracket system and deductions, your effective tax rate is almost always lower than your marginal tax rate.</p>
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
                <a href="#" className="text-secondary hover:underline">Income Tax</a>
                <a href="#" className="text-secondary hover:underline">Salary</a>
                <a href="#" className="text-secondary hover:underline">401K</a>
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
