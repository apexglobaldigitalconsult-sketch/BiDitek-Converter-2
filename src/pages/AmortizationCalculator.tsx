import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AmortizationCalculator() {
  const [loanAmount, setLoanAmount] = useState('200000');
  const [loanTermYears, setLoanTermYears] = useState('15');
  const [loanTermMonths, setLoanTermMonths] = useState('0');
  const [interestRate, setInterestRate] = useState('6');
  const [makeExtraPayments, setMakeExtraPayments] = useState(false);

  const calculateAmortization = () => {
    const P = parseFloat(loanAmount) || 0;
    const years = parseFloat(loanTermYears) || 0;
    const months = parseFloat(loanTermMonths) || 0;
    const n = (years * 12) + months;
    const r = (parseFloat(interestRate) || 0) / 100 / 12;

    let monthlyPayment = 0;
    if (r > 0 && n > 0) {
      monthlyPayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else if (n > 0) {
      monthlyPayment = P / n;
    }

    const totalPayments = monthlyPayment * n;
    const totalInterest = totalPayments - P;

    return {
      monthlyPayment,
      totalPayments,
      totalInterest,
      principal: P,
      months: n
    };
  };

  const results = useMemo(() => calculateAmortization(), [loanAmount, loanTermYears, loanTermMonths, interestRate]);

  const generateAmortizationSchedule = () => {
    if (results.months <= 0) return [];

    const P = results.principal;
    const r = (parseFloat(interestRate) || 0) / 100 / 12;
    const n = results.months;
    const payment = results.monthlyPayment;

    let balance = P;
    const schedule = [];
    
    let yearlyInterest = 0;
    let yearlyPrincipal = 0;
    let currentYear = 1;

    for (let i = 1; i <= n; i++) {
      const interestPayment = balance * r;
      let principalPayment = payment - interestPayment;
      
      if (balance < principalPayment) {
        principalPayment = balance;
      }
      
      balance -= principalPayment;

      yearlyInterest += interestPayment;
      yearlyPrincipal += principalPayment;

      if (i % 12 === 0 || i === n) {
        schedule.push({
          year: currentYear,
          interest: yearlyInterest,
          principal: yearlyPrincipal,
          balance: balance > 0 ? balance : 0,
          payment: payment * 12 // For chart
        });
        
        yearlyInterest = 0;
        yearlyPrincipal = 0;
        currentYear++;
      }
    }

    return schedule;
  };

  const amortizationData = useMemo(() => generateAmortizationSchedule(), [results, interestRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans">
      <div className="flex justify-between items-center text-sm text-primary/60 mb-4">
        <div>
          <a href="#" className="hover:underline">home</a> / <a href="#" className="hover:underline">financial</a> / amortization calculator
        </div>
        <a href="#" className="text-secondary hover:underline">Print</a>
      </div>
      <h1 className="text-2xl font-bold mb-6 text-primary">Amortization Calculator</h1>
      
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
              <div className="bg-surface-container p-4 rounded-[1px] border border-outline-variant">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Loan amount</label>
                    <div className="relative w-40">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                      <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Loan term</label>
                    <div className="flex gap-1 w-40">
                      <div className="relative w-1/2">
                        <input type="number" value={loanTermYears} onChange={(e) => setLoanTermYears(e.target.value)} className="w-full pr-8 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-xs">years</span>
                      </div>
                      <div className="relative w-1/2">
                        <input type="number" value={loanTermMonths} onChange={(e) => setLoanTermMonths(e.target.value)} className="w-full pr-10 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-primary/50 text-xs">months</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Interest rate</label>
                    <div className="relative w-40">
                      <input type="number" step="0.01" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full pr-6 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={makeExtraPayments}
                        onChange={(e) => setMakeExtraPayments(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded-[1px] focus:ring-secondary"
                      />
                      <span className="text-primary/90 font-bold">Optional: make extra payments</span>
                    </label>
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
                <div className="bg-[#7cb342] text-white p-3 flex justify-between items-center">
                  <span className="font-bold text-lg">Monthly Pay: <span className="text-xl ml-2">{formatCurrency(results.monthlyPayment)}</span></span>
                  <div className="w-4 h-4 border border-white flex items-center justify-center text-[10px]">💾</div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-center gap-6 mb-6">
                    <div className="w-24 h-24 relative">
                      <div className="w-full h-full rounded-[1px]" style={{
                        background: `conic-gradient(#3b82f6 0% ${(results.principal/results.totalPayments)*100}%, #8bc34a ${(results.principal/results.totalPayments)*100}% 100%)`
                      }}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-surface-container-low rounded-[1px]"></div>
                      </div>
                      <div className="absolute top-1/2 left-2 -translate-y-1/2 text-[10px] font-bold text-white drop-shadow-md">{Math.round((results.principal/results.totalPayments)*100)}%</div>
                      <div className="absolute top-1/2 right-2 -translate-y-1/2 text-[10px] font-bold text-white drop-shadow-md">{Math.round((results.totalInterest/results.totalPayments)*100)}%</div>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500"></div> <span className="text-primary/80">Principal</span></div>
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#8bc34a]"></div> <span className="text-primary/80">Interest</span></div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm bg-surface-container p-3 rounded-[1px]">
                    <div className="flex justify-between py-1">
                      <span className="text-primary/90">Total of {results.months} monthly payments</span>
                      <span className="text-primary">{formatCurrency(results.totalPayments)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-primary/90">Total interest</span>
                      <span className="text-primary">{formatCurrency(results.totalInterest)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amortization Schedule */}
          {results.months > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-4 text-secondary">Amortization schedule</h2>
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
                        <th className="p-2">Interest</th>
                        <th className="p-2">Principal</th>
                        <th className="p-2">Ending Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {amortizationData.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-surface-container' : 'bg-surface-container-low'}>
                          <td className="p-2 text-center text-primary">{row.year}</td>
                          <td className="p-2 text-primary/60">{formatCurrency(row.interest)}</td>
                          <td className="p-2 text-primary/60">{formatCurrency(row.principal)}</td>
                          <td className="p-2 text-primary">{formatCurrency(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={amortizationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                      <XAxis dataKey="year" tick={{fontSize: 12}} stroke="#6B7280" />
                      <YAxis tickFormatter={(value) => `$${value/1000}K`} tick={{fontSize: 12}} stroke="#6B7280" />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Line type="monotone" dataKey="balance" name="Balance" stroke="#3b82f6" dot={false} strokeWidth={2} />
                      <Line type="monotone" dataKey="interest" name="Interest" stroke="#8bc34a" dot={false} strokeWidth={2} />
                      <Line type="monotone" dataKey="payment" name="Payment" stroke="#ef4444" dot={false} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Text Content */}
          <div className="mt-12 space-y-6 text-sm text-primary/80 leading-relaxed">
            <p>While the Amortization Calculator can serve as a basic tool for most, if not all, amortization calculations, there are other calculators available on this website that are more specifically geared for common amortization calculations.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-secondary">
              <a href="#" className="hover:underline">Mortgage Calculator</a>
              <a href="#" className="hover:underline">Auto Loan Calculator</a>
              <a href="#" className="hover:underline">Investment Calculator</a>
              <a href="#" className="hover:underline">Business Loan Calculator</a>
              <a href="#" className="hover:underline">Personal Loan Calculator</a>
              <a href="#" className="hover:underline">FHA Loan Calculator</a>
              <a href="#" className="hover:underline">VA Mortgage Calculator</a>
              <a href="#" className="hover:underline">Annuity Calculator</a>
            </div>

            <h3 className="text-lg font-bold text-primary mt-8">What is Amortization?</h3>
            <p>There are two general definitions of amortization. The first is the systematic repayment of a loan over time. The second is used in the context of business accounting and is the act of spreading the cost of an expensive and long-lived item over many periods. The two are explained in more detail in the sections below.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Paying Off a Loan Over Time</h3>
            <p>When a borrower takes out a mortgage, car loan, or personal loan, they usually make monthly payments to the lender; these are some of the most common uses of amortization. A part of the payment covers the interest due on the loan, and the remainder of the payment goes toward reducing the principal amount owed. Interest is computed on the current amount owed and thus will become progressively smaller as the principal decreases. It is possible to see this in action on the amortization table.</p>
            <p>Credit cards, on the other hand, are generally not amortized. They are an example of revolving debt, where the outstanding balance can be carried month-to-month, and the amount repaid each month can be varied. Please use our <a href="#" className="text-secondary hover:underline">Credit Card Calculator</a> for more information or to do calculations involving credit cards, or our <a href="#" className="text-secondary hover:underline">Credit Cards Payoff Calculator</a> to schedule a financially feasible way to pay off multiple credit cards. Examples of other loans that aren't amortized include interest-only loans and balloon loans. The former includes an interest-only period of payment, and the latter has a large principal payment at loan maturity.</p>
            
            <h4 className="font-bold text-primary mt-4">Amortization Schedule</h4>
            <p>An amortization schedule (sometimes called an amortization table) is a table detailing each periodic payment on an amortizing loan. Each calculation done by the calculator will also come with an annual and monthly amortization schedule above. Each repayment for an amortized loan will contain both an interest payment and payment towards the principal balance, which varies for each pay period. An amortization schedule helps indicate the specific amount that will be paid towards each, along with the interest and principal paid to date, and the remaining principal balance after each pay period.</p>
            <p>Basic amortization schedules do not account for extra payments, but this doesn't mean that borrowers can't pay extra towards their loans. Also, amortization schedules generally do not consider fees. Generally, amortization schedules only work for fixed-rate loans and not adjustable-rate mortgages, variable rate loans, or lines of credit.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Spreading Costs</h3>
            <p>Certain businesses sometimes purchase expensive items that are used for long periods of time that are classified as investments. Items that are commonly amortized for the purpose of spreading costs include machinery, buildings, and equipment. From an accounting perspective, a sudden purchase of an expensive factory during a quarterly period can skew the financials, so its value is amortized over the expected life of the factory instead. Although it can technically be considered amortizing, this is usually referred to as the depreciation expense of an asset amortized over its expected lifetime. For more information about or to do calculations involving depreciation, please visit the <a href="#" className="text-secondary hover:underline">Depreciation Calculator</a>.</p>
            <p>Amortization as a way of spreading business costs in accounting generally refers to intangible assets like a patent or copyright. Under Section 197 of U.S. law, the value of these assets can be deducted month-to-month or year-to-year. Just like with any other amortization, payment schedules can be forecasted by a calculated amortization schedule. The following are intangible assets that are often amortized:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Goodwill, which is the reputation of a business regarded as a quantifiable asset</li>
              <li>Going-concern value, which is the value of a business as an ongoing entity</li>
              <li>The workforce in place (current employees, including their experience, education, and training)</li>
              <li>Business books and records, operating systems, or any other information base, including lists or other information concerning current or prospective customers</li>
              <li>Patents, copyrights, formulas, processes, designs, patterns, know-hows, formats, or similar items</li>
              <li>Customer-based intangibles, including customer bases and relationships with customers</li>
              <li>Supplier-based intangibles, including the value of future purchases due to existing relationships with vendors</li>
              <li>Licenses, permits, or other rights granted by governmental units or agencies (including issuances and renewals)</li>
              <li>Covenants not to compete or non-compete agreements entered relating to acquisitions of interests in trades or businesses</li>
              <li>Franchises, trademarks, or trade names</li>
              <li>Contracts for the use of or term interests in any items on this list</li>
            </ol>
            <p>Some intangible assets, with goodwill being the most common example, that have indefinite useful lives or are "self-created" may not be legally amortized for tax purposes.</p>
            <p>According to the IRS under Section 197, some assets are not considered intangibles, including interest in businesses, contracts, land, most computer software, intangible assets not acquired in connection with the acquiring of a business or trade, interest in an existing lease or sublease of a tangible property or existing debt, rights to service residential mortgages (unless it was acquired in connection with the acquisition of a trade or business), or certain transaction costs incurred by parties in which any part of a gain or loss is not recognized.</p>
            
            <h4 className="font-bold text-primary mt-4">Amortizing Startup Costs</h4>
            <p>In the U.S., business startup costs, defined as costs incurred to investigate the potential of creating or acquiring an active business and costs to create an active business, can only be amortized under certain conditions. They must be expenses that are deducted as business expenses if incurred by an existing active business and must be incurred before the active business begins. Examples of these costs include consulting fees, financial analysis of potential acquisitions, advertising expenditures, and payments to employees, all of which must be incurred before the business is deemed active. According to IRS guidelines, initial startup costs must be amortized.</p>
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
