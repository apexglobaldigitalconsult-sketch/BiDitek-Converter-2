import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FinanceCalculator() {
  const [activeTab, setActiveTab] = useState('FV');

  const [n, setN] = useState('10');
  const [iy, setIy] = useState('6');
  const [pv, setPv] = useState('20000');
  const [pmt, setPmt] = useState('-2000');
  const [fv, setFv] = useState('0');

  const calculateTVM = () => {
    const numN = parseFloat(n) || 0;
    const numIy = parseFloat(iy) || 0;
    const numPv = parseFloat(pv) || 0;
    const numPmt = parseFloat(pmt) || 0;
    const numFv = parseFloat(fv) || 0;

    const r = numIy / 100;
    
    let calculatedFv = numFv;
    let calculatedPv = numPv;
    let calculatedPmt = numPmt;
    let calculatedN = numN;
    let calculatedIy = numIy;

    if (activeTab === 'FV') {
      if (r === 0) calculatedFv = -(numPv + numPmt * numN);
      else calculatedFv = -(numPv * Math.pow(1 + r, numN) + numPmt * (Math.pow(1 + r, numN) - 1) / r);
    } else if (activeTab === 'PV') {
      if (r === 0) calculatedPv = -(numFv + numPmt * numN);
      else calculatedPv = -(numFv + numPmt * (Math.pow(1 + r, numN) - 1) / r) / Math.pow(1 + r, numN);
    } else if (activeTab === 'PMT') {
      if (r === 0) calculatedPmt = -(numPv + numFv) / numN;
      else calculatedPmt = -(numPv * Math.pow(1 + r, numN) + numFv) * r / (Math.pow(1 + r, numN) - 1);
    } else if (activeTab === 'N') {
      if (r === 0) calculatedN = -(numPv + numFv) / numPmt;
      else {
        const num = numPmt / r - numFv;
        const den = numPv + numPmt / r;
        if (den !== 0 && num / den > 0) {
          calculatedN = Math.log(num / den) / Math.log(1 + r);
        }
      }
    } else if (activeTab === 'I/Y') {
      let r0 = 0.1;
      for (let i = 0; i < 100; i++) {
        const f = numPv * Math.pow(1 + r0, numN) + numPmt * (Math.pow(1 + r0, numN) - 1) / r0 + numFv;
        const df = numPv * numN * Math.pow(1 + r0, numN - 1) + numPmt * ((numN * r0 * Math.pow(1 + r0, numN - 1) - Math.pow(1 + r0, numN) + 1) / (r0 * r0));
        const r1 = r0 - f / df;
        if (Math.abs(r1 - r0) < 1e-7) {
          calculatedIy = r1 * 100;
          break;
        }
        r0 = r1;
      }
    }

    const actualN = activeTab === 'N' ? calculatedN : numN;
    const actualIy = activeTab === 'I/Y' ? calculatedIy : numIy;
    const actualPv = activeTab === 'PV' ? calculatedPv : numPv;
    const actualPmt = activeTab === 'PMT' ? calculatedPmt : numPmt;
    const actualFv = activeTab === 'FV' ? calculatedFv : numFv;

    const schedule = [];
    let currentBalance = actualPv;
    let totalInterest = 0;
    let sumOfPmt = 0;
    const actualR = actualIy / 100;

    let chartData = [];
    chartData.push({
      period: 0,
      PV: actualPv,
      FV: -actualPv,
      SumOfPMT: 0,
      AccumulatedInterest: 0
    });

    for (let i = 1; i <= Math.ceil(actualN); i++) {
      const interest = currentBalance * actualR;
      totalInterest += interest;
      sumOfPmt += actualPmt;
      currentBalance = currentBalance + interest + actualPmt;
      
      schedule.push({
        period: i,
        pv: currentBalance - interest - actualPmt,
        pmt: actualPmt,
        interest: interest,
        fv: -currentBalance
      });

      chartData.push({
        period: i,
        PV: currentBalance,
        FV: -currentBalance,
        SumOfPMT: sumOfPmt,
        AccumulatedInterest: totalInterest
      });
    }

    return {
      fv: calculatedFv,
      pv: calculatedPv,
      pmt: calculatedPmt,
      n: calculatedN,
      iy: calculatedIy,
      schedule,
      chartData,
      sumOfPmt,
      totalInterest
    };
  };

  const results = useMemo(() => calculateTVM(), [activeTab, n, iy, pv, pmt, fv]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const tabs = ['FV', 'PMT', 'I/Y', 'N', 'PV'];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans">
      <div className="flex justify-between items-center text-sm text-primary/60 mb-4">
        <div>
          <a href="#" className="hover:underline">home</a> / <a href="#" className="hover:underline">financial</a> / finance calculator
        </div>
        <a href="#" className="text-secondary hover:underline">Print</a>
      </div>
      <h1 className="text-2xl font-bold mb-2 text-primary">Finance Calculator</h1>
      <p className="text-sm text-primary/80 mb-6 leading-relaxed">
        This finance calculator can be used to calculate the future value (FV), periodic payment (PMT), interest rate (I/Y), number of compounding periods (N), and PV (Present Value). Each of the following tabs represents the parameters to be calculated. It works the same way as the 5-key time value of money calculators, such as BA II Plus or HP 12CP calculator.
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
              <div className="flex">
                {tabs.map(tab => (
                  <button 
                    key={tab}
                    className={`flex-1 px-2 py-2 text-xs font-bold border-r border-outline-variant last:border-r-0 ${activeTab === tab ? 'bg-secondary text-white' : 'bg-surface-container-highest text-white hover:bg-secondary/80'}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <div className="bg-surface-container p-4 border border-outline-variant">
                <div className="space-y-3 text-sm">
                  {activeTab !== 'N' && (
                    <div className="flex items-center justify-between">
                      <label className="text-primary/90 text-right flex-1 pr-4">N (# of periods)</label>
                      <input type="number" value={n} onChange={(e) => setN(e.target.value)} className="w-32 px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    </div>
                  )}
                  {activeTab !== 'I/Y' && (
                    <div className="flex items-center justify-between">
                      <label className="text-primary/90 text-right flex-1 pr-4">I/Y (Interest per year)</label>
                      <div className="relative w-32">
                        <input type="number" step="0.01" value={iy} onChange={(e) => setIy(e.target.value)} className="w-full pr-6 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                      </div>
                    </div>
                  )}
                  {activeTab !== 'PV' && (
                    <div className="flex items-center justify-between">
                      <label className="text-primary/90 text-right flex-1 pr-4">PV (Present Value)</label>
                      <div className="relative w-32">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                        <input type="number" value={pv} onChange={(e) => setPv(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                      </div>
                    </div>
                  )}
                  {activeTab !== 'PMT' && (
                    <div className="flex items-center justify-between">
                      <label className="text-primary/90 text-right flex-1 pr-4">PMT (Periodic Payment)</label>
                      <div className="relative w-32">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                        <input type="number" value={pmt} onChange={(e) => setPmt(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                      </div>
                    </div>
                  )}
                  {activeTab !== 'FV' && (
                    <div className="flex items-center justify-between">
                      <label className="text-primary/90 text-right flex-1 pr-4">FV (Future Value)</label>
                      <div className="relative w-32">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                        <input type="number" value={fv} onChange={(e) => setFv(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center pt-2">
                    <button className="text-secondary hover:underline text-sm font-semibold">+ Settings</button>
                  </div>

                  <div className="flex justify-center gap-2 pt-4">
                    <button className="bg-[#4caf50] hover:bg-[#45a049] text-white px-4 py-1.5 rounded-[1px] font-bold flex items-center gap-1 shadow-sm">
                      Calculate <span className="text-xs bg-white text-[#4caf50] rounded-[1px] w-4 h-4 flex items-center justify-center">▶</span>
                    </button>
                    <button className="bg-[#9e9e9e] hover:bg-[#8e8e8e] text-white px-4 py-1.5 rounded-[1px] font-bold shadow-sm">
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Results */}
            <div className="md:col-span-7 space-y-6">
              <div className="bg-surface-container-low border border-outline-variant rounded-[1px] shadow-sm overflow-hidden">
                <div className="bg-[#7cb342] text-white p-2 flex justify-between items-center">
                  <span className="font-bold text-lg">Results</span>
                  <div className="w-4 h-4 border border-white flex items-center justify-center text-[10px]">💾</div>
                </div>
                
                <div className="p-4 bg-surface-container">
                  <div className="space-y-2 text-sm">
                    {activeTab === 'FV' && (
                      <div className="flex justify-between py-1 border-b border-outline-variant">
                        <span className="text-primary/90 font-bold">FV = </span>
                        <span className="text-[#4caf50] font-bold">{formatCurrency(results.fv)}</span>
                      </div>
                    )}
                    {activeTab === 'PV' && (
                      <div className="flex justify-between py-1 border-b border-outline-variant">
                        <span className="text-primary/90 font-bold">PV = </span>
                        <span className="text-[#4caf50] font-bold">{formatCurrency(results.pv)}</span>
                      </div>
                    )}
                    {activeTab === 'PMT' && (
                      <div className="flex justify-between py-1 border-b border-outline-variant">
                        <span className="text-primary/90 font-bold">PMT = </span>
                        <span className="text-[#4caf50] font-bold">{formatCurrency(results.pmt)}</span>
                      </div>
                    )}
                    {activeTab === 'N' && (
                      <div className="flex justify-between py-1 border-b border-outline-variant">
                        <span className="text-primary/90 font-bold">N = </span>
                        <span className="text-[#4caf50] font-bold">{results.n.toFixed(3)}</span>
                      </div>
                    )}
                    {activeTab === 'I/Y' && (
                      <div className="flex justify-between py-1 border-b border-outline-variant">
                        <span className="text-primary/90 font-bold">I/Y = </span>
                        <span className="text-[#4caf50] font-bold">{results.iy.toFixed(3)}%</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between py-1">
                      <span className="text-primary/90">Sum of all periodic payments</span>
                      <span className="text-primary">{formatCurrency(results.sumOfPmt)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-primary/90">Total Interest</span>
                      <span className="text-primary">{formatCurrency(results.totalInterest)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="mt-8">
            <h3 className="text-center font-bold text-primary mb-4">Value changes over time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results.chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="period" tick={{fontSize: 12}} stroke="#6B7280" />
                  <YAxis tickFormatter={(value) => `$${value/1000}K`} tick={{fontSize: 12}} stroke="#6B7280" />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                  <Line type="monotone" dataKey="PV" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="FV" stroke="#8bc34a" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="SumOfPMT" name="Sum of PMT" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="AccumulatedInterest" name="Accumulated Interest" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Schedule */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-secondary">Schedule</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead>
                  <tr className="bg-secondary text-white">
                    <th className="p-2 text-center">Period</th>
                    <th className="p-2">PV</th>
                    <th className="p-2">PMT</th>
                    <th className="p-2">Interest</th>
                    <th className="p-2">FV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {results.schedule.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-surface-container' : 'bg-surface-container-low'}>
                      <td className="p-2 text-center text-primary">{row.period}</td>
                      <td className="p-2 text-primary/60">{formatCurrency(row.pv)}</td>
                      <td className="p-2 text-primary/60">{formatCurrency(row.pmt)}</td>
                      <td className="p-2 text-primary/60">{formatCurrency(row.interest)}</td>
                      <td className="p-2 text-primary">{formatCurrency(row.fv)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Related */}
          <div className="mt-8">
            <h3 className="font-bold text-primary mb-2">Related</h3>
            <div className="flex gap-2">
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">Loan Calculator</button>
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">Interest Calculator</button>
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">Investment Calculator</button>
            </div>
          </div>

          {/* Text Content */}
          <div className="mt-12 space-y-6 text-sm text-primary/80 leading-relaxed">
            <p>In basic finance courses, lots of time is spent on the computation of the time value of money, which can involve 4 or 5 different elements, including Present Value (PV), Future Value (FV), Interest Rate (I/Y), and Number of Periods (N). Periodic Payment (PMT) can be included but is not a required element.</p>

            <h3 className="text-lg font-bold text-primary mt-8">The Time Value of Money (TVM)</h3>
            <p>Suppose someone owes you $500. Would you rather have this money repaid to you right away in one payment or spread out over a year in four installment payments? How would you feel if you had to wait to get the full payment instead of getting it all at once? Wouldn't you feel that the delay in the payment cost you something?</p>
            <p>According to a concept that economists call the "time value of money," you will probably want all the money right away because it can immediately be deployed for many different uses: spent on the lavish dream vacation, invested to earn interest, or used to pay off all or part of a loan. The "time value of money" refers to the fact that a dollar in hand today is worth more than a dollar promised at some future time.</p>
            <p>This is the basis of the concept of interest payments; a good example is when money is deposited in a savings account, small dividends are received for leaving the money with the bank; the financial institution pays a small price for having that money at hand. This is also why the bank will pay more for keeping the money in long and for committing it there for fixed periods.</p>
            <p>This increased value in money at the end of a period of collecting interest is called future value in finance. Here is how it works.</p>
            <p>Suppose $100 (PV) is invested in a savings account that pays 10% interest (I/Y) per year. How much will there be in one year? The answer is $110 (FV). This $110 is equal to the original principal of $100 plus $10 in interest. $110 is the future value of $100 invested for one year at 10%, meaning that $100 today is worth $110 in one year, given that the interest rate is 10%.</p>
            <p>In general, investing for one period at an interest rate r will grow to (1 + r) per dollar invested. In our example, r is 10%, so the investment grows to:</p>
            <p className="text-center font-mono">1 + 0.10 = 1.10</p>
            <p>$1.10 dollars per dollar invested. Because $100 was invested in this case, the result, or FV, is:</p>
            <p className="text-center font-mono">$100 × 1.10 = $110</p>
            <p>The original $100 investment is now $110. However, if that money is kept in the savings account further, what will be the resulting FV after two years, assuming the interest rate remains the same?</p>
            <p className="text-center font-mono">$110 × 0.10 = $11</p>
            <p>$11 will be earned in interest after the second year, making a total of:</p>
            <p className="text-center font-mono">$110 + $11 = $121</p>
            <p>$121 is the future value of $100 in two years at 10%.</p>
            <p>Also, the PV in finance is what the FV will be worth given a discount rate, which carries the same meaning as interest rate except applied inversely with respect to time (backward rather than forward). In the example, the PV of an FV of $121 with a 10% discount rate after 2 compounding periods (N) is $100.</p>
            <p>This $121 FV has several different parts in terms of its money structure:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The first part is the first $100 original principal, or its Present Value (PV)</li>
              <li>The second part is the $10 in interest earned in the first year</li>
              <li>The third part is the other $10 interest earned in the second year.</li>
              <li>The fourth part is $1, which is interest earned in the second year on the interest paid in the first year: ($10 × 0.10 = $1)</li>
            </ul>

            <h3 className="text-lg font-bold text-primary mt-8">PMT</h3>
            <p>PMT or periodic payment is an inflow or outflow amount that occurs at each period of a financial stream. Take, for instance, a <a href="#" className="text-secondary hover:underline">rental property</a> that brings in rental income of $1,000 per month, a recurring cash flow. Investors may wonder what the cash flow of $1,000 per month for 10 years is worth. Otherwise, they have no conclusive evidence that suggests they should invest so much money into a rental property. As another example, what about the evaluation of a business that generates $100 in income every year? What about the payment of a down payment of $30,000 and a monthly mortgage of $1,000? For these questions, the payment formula is quite complex, so it is best left in the hands of our Finance Calculator, which can help evaluate all these situations with the inclusion of the PMT function. Don't forget to choose the correct input for whether payments are made at the beginning or end of compounding periods; the choice has large ramifications on the final amount of interest incurred.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Finance Class</h3>
            <p>For any business student, it is an immensely difficult task to navigate finance courses without a handy financial calculator. While most basic financial calculations can technically be done by hand, professors generally allow students to use financial calculators, even during exams. It's not the ability to perform calculations by hand that's important; it's the understanding of financial concepts and how to apply them using these handy calculating tools that were invented. Our web-based financial calculator can serve as a good tool to have during lectures or homework, and because it is web-based, it is never out of reach, as long as a smartphone is nearby. The inclusion of a graph and a schedule, two things missing from physical calculators, can be more visually helpful for learning purposes.</p>

            <h3 className="text-lg font-bold text-primary mt-8">The Importance of the Finance Calculator</h3>
            <p>In essence, our Finance Calculator is the foundation for most of our <a href="#" className="text-secondary hover:underline">Financial Calculators</a>. It helps to think of it as an equivalent to the steam engine that was eventually used to power a wide variety of things such as the steamboat, railway locomotives, factories, and road vehicles. There can be no <a href="#" className="text-secondary hover:underline">Mortgage Calculator</a>, or <a href="#" className="text-secondary hover:underline">Credit Card Calculator</a>, or <a href="#" className="text-secondary hover:underline">Auto Loan Calculator</a> without the concept of the time value of money as explained by the Finance Calculator. As a matter of fact, our <a href="#" className="text-secondary hover:underline">Investment Calculator</a> is simply a rebranding of the Finance Calculator while everything underneath the hood is essentially the same.</p>
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
