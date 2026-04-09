import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HelpCircle } from 'lucide-react';

export default function InterestCalculator() {
  const [initialInvestment, setInitialInvestment] = useState('20000');
  const [annualContribution, setAnnualContribution] = useState('5000');
  const [monthlyContribution, setMonthlyContribution] = useState('0');
  const [contributeAt, setContributeAt] = useState('beginning');
  const [interestRate, setInterestRate] = useState('5');
  const [compound, setCompound] = useState('Annually');
  const [years, setYears] = useState('5');
  const [months, setMonths] = useState('0');
  const [taxRate, setTaxRate] = useState('0');
  const [inflationRate, setInflationRate] = useState('3');

  const calculateInterest = () => {
    const initial = parseFloat(initialInvestment) || 0;
    const annualContrib = parseFloat(annualContribution) || 0;
    const monthlyContrib = parseFloat(monthlyContribution) || 0;
    const rate = (parseFloat(interestRate) || 0) / 100;
    const tax = (parseFloat(taxRate) || 0) / 100;
    const inflation = (parseFloat(inflationRate) || 0) / 100;
    const y = parseFloat(years) || 0;
    const m = parseFloat(months) || 0;
    const totalYears = y + m / 12;

    let balance = initial;
    let totalContributions = 0;
    let totalInterest = 0;
    let interestOfInitial = 0;
    let initialBalanceOnly = initial;
    
    const schedule = [];
    
    for (let i = 1; i <= totalYears; i++) {
      const deposit = annualContrib + (monthlyContrib * 12);
      totalContributions += deposit;
      
      let principalForInterest = balance;
      let initialPrincipalForInterest = initialBalanceOnly;
      
      if (contributeAt === 'beginning') {
        principalForInterest += deposit;
      }
      
      const interestEarned = principalForInterest * rate;
      const interestAfterTaxes = interestEarned * (1 - tax);
      
      const initialInterestEarned = initialPrincipalForInterest * rate;
      const initialInterestAfterTaxes = initialInterestEarned * (1 - tax);
      
      interestOfInitial += initialInterestAfterTaxes;
      
      if (contributeAt === 'end') {
        balance += deposit;
      } else {
        balance = principalForInterest;
      }
      
      balance += interestAfterTaxes;
      initialBalanceOnly += initialInterestAfterTaxes;
      totalInterest += interestAfterTaxes;
      
      schedule.push({
        year: i,
        deposit: deposit,
        interest: interestAfterTaxes,
        endingBalance: balance,
        initialInvestment: initial,
        contributions: totalContributions,
        accumulatedInterest: totalInterest
      });
    }

    const totalPrincipal = initial + totalContributions;
    const buyingPower = balance / Math.pow(1 + inflation, totalYears);
    const interestOfContributions = totalInterest - interestOfInitial;

    return {
      endingBalance: balance,
      totalPrincipal,
      totalContributions,
      totalInterest,
      interestOfInitial,
      interestOfContributions,
      buyingPower,
      schedule
    };
  };

  const results = useMemo(() => calculateInterest(), [
    initialInvestment, annualContribution, monthlyContribution, contributeAt,
    interestRate, compound, years, months, taxRate, inflationRate
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans">
      <div className="flex justify-between items-center text-sm text-primary/60 mb-4">
        <div>
          <a href="#" className="hover:underline">home</a> / <a href="#" className="hover:underline">financial</a> / interest calculator
        </div>
        <a href="#" className="text-secondary hover:underline">Print</a>
      </div>
      <h1 className="text-2xl font-bold mb-2 text-primary">Interest Calculator</h1>
      <p className="text-sm text-primary/80 mb-6">
        This Compound Interest Calculator can help determine the compound interest accumulation and final balances on both fixed principal amounts and additional periodic contributions. There are also optional factors available for consideration, such as the tax on interest income and inflation.
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
            <div className="md:col-span-5 space-y-4">
              <div className="bg-surface-container p-4 rounded-[1px] border border-outline-variant">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Initial investment</label>
                    <div className="relative w-40">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                      <input type="number" value={initialInvestment} onChange={(e) => setInitialInvestment(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Annual contribution</label>
                    <div className="relative w-40">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                      <input type="number" value={annualContribution} onChange={(e) => setAnnualContribution(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Monthly contribution</label>
                    <div className="relative w-40">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                      <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 text-xs text-primary/80">
                      <span>Contribute at the</span>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="contributeAt" value="beginning" checked={contributeAt === 'beginning'} onChange={(e) => setContributeAt(e.target.value)} className="text-blue-600" /> beginning
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="contributeAt" value="end" checked={contributeAt === 'end'} onChange={(e) => setContributeAt(e.target.value)} className="text-blue-600" /> end
                      </label>
                    </div>
                    <span className="text-xs text-primary/80">of each compounding period</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Interest rate</label>
                    <div className="relative w-40">
                      <input type="number" step="0.01" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full pr-6 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Compound</label>
                    <select value={compound} onChange={(e) => setCompound(e.target.value)} className="w-40 py-1 px-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary">
                      <option>Annually</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Investment length</label>
                    <div className="flex gap-1 w-40">
                      <div className="relative w-1/2">
                        <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full pr-8 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-xs">years</span>
                      </div>
                      <div className="relative w-1/2">
                        <input type="number" value={months} onChange={(e) => setMonths(e.target.value)} className="w-full pr-10 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-primary/50 text-xs">months</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90 flex items-center gap-1">Tax rate <HelpCircle className="w-3 h-3 text-gray-400" /></label>
                    <div className="relative w-40">
                      <input type="number" step="0.01" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="w-full pr-6 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Inflation rate</label>
                    <div className="relative w-40">
                      <input type="number" step="0.01" value={inflationRate} onChange={(e) => setInflationRate(e.target.value)} className="w-full pr-6 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                    </div>
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
                  <span className="font-bold text-lg">Results</span>
                  <div className="w-4 h-4 border border-white flex items-center justify-center text-[10px]">💾</div>
                </div>
                
                <div className="p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1 font-bold">
                      <span className="text-primary">Ending balance</span>
                      <span className="text-primary">{formatCurrency(results.endingBalance)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-primary/90">Total principal</span>
                      <span className="text-primary">{formatCurrency(results.totalPrincipal)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-primary/90">Total contributions</span>
                      <span className="text-primary">{formatCurrency(results.totalContributions)}</span>
                    </div>
                    <div className="flex justify-between py-1 font-bold">
                      <span className="text-primary">Total interest</span>
                      <span className="text-primary">{formatCurrency(results.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-primary/90">Interest of initial investment</span>
                      <span className="text-primary">{formatCurrency(results.interestOfInitial)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-primary/90">Interest of the contributions</span>
                      <span className="text-primary">{formatCurrency(results.interestOfContributions)}</span>
                    </div>
                    <div className="flex justify-between py-1 mt-4 border-t border-outline-variant pt-2">
                      <span className="text-primary/90">Buying power of the end balance<br/>after inflation adjustment</span>
                      <span className="text-primary">{formatCurrency(results.buyingPower)}</span>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-center gap-6">
                    <div className="w-24 h-24 relative">
                      <div className="w-full h-full rounded-[1px]" style={{
                        background: `conic-gradient(#3b82f6 0% ${(results.totalPrincipal/results.endingBalance)*100}%, #8bc34a ${(results.totalPrincipal/results.endingBalance)*100}% ${((results.totalPrincipal+results.totalContributions)/results.endingBalance)*100}%, #ef4444 ${((results.totalPrincipal+results.totalContributions)/results.endingBalance)*100}% 100%)`
                      }}></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-surface-container-low rounded-[1px]"></div>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500"></div> <span className="text-primary/80">Initial investment</span></div>
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#8bc34a]"></div> <span className="text-primary/80">Contributions</span></div>
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500"></div> <span className="text-primary/80">Interest</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Accumulation Schedule */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4 text-secondary">Accumulation Schedule</h2>
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
                      <th className="p-2">Deposit</th>
                      <th className="p-2">Interest</th>
                      <th className="p-2">Ending balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {results.schedule.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-surface-container' : 'bg-surface-container-low'}>
                        <td className="p-2 text-center text-primary">{row.year}</td>
                        <td className="p-2 text-primary/60">{formatCurrency(row.deposit)}</td>
                        <td className="p-2 text-primary/60">{formatCurrency(row.interest)}</td>
                        <td className="p-2 text-primary">{formatCurrency(row.endingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.schedule} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                    <XAxis dataKey="year" tick={{fontSize: 12}} stroke="#6B7280" />
                    <YAxis tickFormatter={(value) => `$${value/1000}K`} tick={{fontSize: 12}} stroke="#6B7280" />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="initialInvestment" stackId="a" name="Initial investment" fill="#3b82f6" />
                    <Bar dataKey="contributions" stackId="a" name="Contributions" fill="#8bc34a" />
                    <Bar dataKey="accumulatedInterest" stackId="a" name="Interest" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Related */}
          <div className="mt-8">
            <h3 className="font-bold text-primary mb-2">Related</h3>
            <div className="flex gap-2">
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">Investment Calculator</button>
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">Average Return Calculator</button>
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">ROI Calculator</button>
            </div>
          </div>

          {/* Text Content */}
          <div className="mt-12 space-y-6 text-sm text-primary/80 leading-relaxed">
            <p>Interest is the compensation paid by the borrower to the lender for the use of money as a percent or an amount. The concept of interest is the backbone behind most financial instruments in the world.</p>
            <p>There are two distinct methods of accumulating interest, categorized into simple interest or compound interest.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Simple Interest</h3>
            <p>The following is a basic example of how interest works. Derek would like to borrow $100 (usually called the principal) from the bank for one year. The bank wants 10% interest on it. To calculate interest:</p>
            <p className="text-center">$100 × 10% = $10</p>
            <p>This interest is added to the principal, and the sum becomes Derek's required repayment to the bank one year later.</p>
            <p className="text-center">$100 + $10 = $110</p>
            <p>Derek owes the bank $110 a year later, $100 for the principal and $10 as interest.</p>
            <p>Let's assume that Derek wanted to borrow $100 for two years instead of one, and the bank calculates interest annually. He would simply be charged the interest rate twice, once at the end of each year.</p>
            <p className="text-center">$100 + $10(year 1) + $10(year 2) = $120</p>
            <p>Derek owes the bank $120 two years later, $100 for the principal and $20 as interest.</p>
            <p>The formula to calculate simple interest is:</p>
            <p className="text-center">interest = principal × interest rate × term</p>
            <p>When more complicated frequencies of applying interest are involved, such as monthly or daily, use the formula:</p>
            <p className="text-center">interest = principal × interest rate × (term / frequency)</p>
            <p>However, simple interest is very seldom used in the real world. Even when people use the everyday word 'interest,' they are usually referring to interest that compounds.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Compound Interest</h3>
            <p>Compounding interest requires more than one period, so let's go back to the example of Derek borrowing $100 from the bank for two years at a 10% interest rate. For the first year, we calculate interest as usual.</p>
            <p className="text-center">$100 × 10% = $10</p>
            <p>This interest is added to the principal, and the sum becomes Derek's required repayment to the bank for that present time.</p>
            <p className="text-center">$100 + $10 = $110</p>
            <p>However, the year ends, and in comes another period. For compounding interest, rather than the original amount, the principal + any interest accumulated since is used. In Derek's case:</p>
            <p className="text-center">$110 × 10% = $11</p>
            <p>Derek's interest charge at the end of year 2 is $11. This is added to what is owed after year 1:</p>
            <p className="text-center">$110 + $11 = $121</p>
            <p>When the loan ends, the bank collects $121 from Derek instead of $120 if it were calculated using simple interest instead. This is because interest is also earned on interest.</p>
            <p>The more frequently interest is compounded within a time period, the higher the interest will be earned on an original principal. The following is a graph showing just that, a $1,000 investment at various compounding frequencies earning 20% interest.</p>
            
            <div className="my-6 p-4 bg-surface-container-low border border-outline-variant rounded-[1px] text-center text-primary/50">
              [Graph: Compounding Frequency Comparison]
            </div>

            <p>There is little difference during the beginning between all frequencies, but over time they slowly start to diverge. This is the power of compound interest everyone likes to talk about, illustrated in a concise graph. The continuous compound will always have the highest return due to its use of the mathematical limit of the frequency of compounding that can occur within a specified time period.</p>

            <h3 className="text-lg font-bold text-primary mt-8">The Rule of 72</h3>
            <p>Anyone who wants to estimate compound interest in their head may find the rule of 72 very useful. Not for exact calculations as given by financial calculators, but to get ideas for ballpark figures. It states that in order to find the number of years (n) required to double a certain amount of money with any interest rate, simply divide 72 by that same rate.</p>
            <p>Example: How long would it take to double $1,000 with an 8% interest rate?</p>
            <p className="text-center">n = 72 / 8 = 9</p>
            <p>It will take 9 years for the $1,000 to become $2,000 at 8% interest. This formula works best for interest rates between 6 and 10%, but it should also work reasonably well for anything below 20%.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Fixed vs. Floating Interest Rate</h3>
            <p>The interest rate of a loan or savings can be "fixed" or "floating." Floating rate loans or savings are normally based on some reference rate, such as the U.S. Federal Reserve (Fed) funds rate or the LIBOR (London Interbank Offered Rate). Normally, the loan rate is a little higher, and the savings rate is a little lower than the reference rate. The difference goes to the profit of the bank. Both the Fed rate and LIBOR are short-term inter-bank interest rates, but the Fed rate is the main tool that the Federal Reserve uses to influence the supply of money in the U.S. economy. LIBOR is a commercial rate calculated from prevailing interest rates between highly credit-worthy institutions. Our Interest Calculator deals with fixed interest rates only.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Contributions</h3>
            <p>Our Interest Calculator above allows periodic deposits/contributions. This is useful for those who have the habit of saving a certain amount periodically. An important distinction to make regarding contributions is whether they occur at the beginning or end of compounding periods. Periodic payments that occur at the end have one less interest period total per contribution.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Tax Rate</h3>
            <p>Some forms of interest income are subject to taxes, including bonds, savings, and certificate of deposits(CDs). In the U.S., corporate bonds are almost always taxed. Certain types are fully taxed while others are partially taxed; for example, while interest earned on U.S. federal treasury bonds may be taxed at the federal level, they are generally exempt at the state and local level. Taxes can have very big impacts on the end balance. For example, if Derek saves $100 at 6% for 20 years, he will get:</p>
            <p className="text-center">$100 × (1 + 6%)²⁰ = $320.71</p>
            <p>This is tax-free. However, if Derek has a marginal tax rate of 25%, he will end up with $239.78 only because the tax rate of 25% applies to each compounding period.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Inflation Rate</h3>
            <p>Inflation is defined as a sustained increase in the prices of goods and services over time. As a result, a fixed amount of money will relatively afford less in the future. The average inflation rate in the U.S. in the past 100 years has hovered around 3%. As a tool of comparison, the average annual return rate of the S&P 500 (Standard & Poor's) index in the United States is around 10% in the same period. Please refer to our <a href="#" className="text-secondary hover:underline">Inflation Calculator</a> for more detailed information about inflation.</p>
            <p>For our Interest Calculator, leave the inflation rate at 0 for quick, generalized results. But for real and accurate numbers, it is possible to input figures in order to account for inflation.</p>
            <p>Tax and inflation combined make it hard to grow the real value of money. For example, in the United States, the middle class has a marginal tax rate of around 25%, and the average inflation rate is 3%. To maintain the value of the money, a stable interest rate or investment return rate of 4% or above needs to be earned, and this is not easy to achieve.</p>
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
