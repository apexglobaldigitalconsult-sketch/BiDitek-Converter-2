import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function InterestRateCalculator() {
  const [loanAmount, setLoanAmount] = useState('32000');
  const [loanTermYears, setLoanTermYears] = useState('3');
  const [loanTermMonths, setLoanTermMonths] = useState('0');
  const [monthlyPayment, setMonthlyPayment] = useState('960');

  const calculateInterestRate = () => {
    const pv = parseFloat(loanAmount) || 0;
    const years = parseInt(loanTermYears) || 0;
    const months = parseInt(loanTermMonths) || 0;
    const pmt = parseFloat(monthlyPayment) || 0;

    const n = years * 12 + months;

    let calculatedRate = 0;
    let totalPayments = 0;
    let totalInterest = 0;
    let chartData = [];
    let pieData = [];

    if (pv > 0 && n > 0 && pmt > 0 && pmt * n > pv) {
      // Use Newton-Raphson to find the monthly interest rate
      let r0 = 0.005; // Initial guess (0.5% per month)
      for (let i = 0; i < 100; i++) {
        const f = pmt * (1 - Math.pow(1 + r0, -n)) / r0 - pv;
        const df = pmt * (Math.pow(1 + r0, -n - 1) * n * r0 - (1 - Math.pow(1 + r0, -n))) / (r0 * r0);
        const r1 = r0 - f / df;
        if (Math.abs(r1 - r0) < 1e-7) {
          calculatedRate = r1 * 12 * 100; // Annual rate
          break;
        }
        r0 = r1;
      }

      totalPayments = pmt * n;
      totalInterest = totalPayments - pv;

      let balance = pv;
      let accumulatedInterest = 0;
      let accumulatedPayment = 0;
      const monthlyRate = calculatedRate / 100 / 12;

      chartData.push({
        year: 0,
        Balance: balance,
        Interest: 0,
        Payment: 0
      });

      for (let i = 1; i <= n; i++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = pmt - interestPayment;
        balance -= principalPayment;
        accumulatedInterest += interestPayment;
        accumulatedPayment += pmt;

        if (i % 12 === 0 || i === n) {
          chartData.push({
            year: i / 12,
            Balance: Math.max(0, balance),
            Interest: accumulatedInterest,
            Payment: accumulatedPayment
          });
        }
      }

      pieData = [
        { name: 'Principal', value: pv, color: '#3b82f6' },
        { name: 'Interest', value: totalInterest, color: '#8bc34a' }
      ];
    } else if (pmt * n <= pv) {
      // Invalid input or 0% interest
      calculatedRate = 0;
      totalPayments = pmt * n;
      totalInterest = 0;
    }

    return {
      rate: calculatedRate,
      n,
      totalPayments,
      totalInterest,
      chartData,
      pieData,
      pv
    };
  };

  const results = useMemo(() => calculateInterestRate(), [loanAmount, loanTermYears, loanTermMonths, monthlyPayment]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans">
      <div className="flex justify-between items-center text-sm text-primary/60 mb-4">
        <div>
          <a href="#" className="hover:underline">home</a> / <a href="#" className="hover:underline">financial</a> / interest rate calculator
        </div>
        <a href="#" className="text-secondary hover:underline">Print</a>
      </div>
      <h1 className="text-2xl font-bold mb-2 text-primary">Interest Rate Calculator</h1>
      <p className="text-sm text-primary/80 mb-6 leading-relaxed">
        The Interest Rate Calculator determines real interest rates on loans with fixed terms and monthly payments. For example, it can calculate interest rates in situations where car dealers only provide monthly payment information and total price without including the actual rate on the car loan. To calculate the interest on investments instead, use the <a href="#" className="text-secondary hover:underline">Interest Calculator</a>, or use the <a href="#" className="text-secondary hover:underline">Compound Interest Calculator</a> to understand the difference between different interest rates.
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
                <div className="space-y-3 text-sm">
                  
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Loan amount</label>
                    <div className="relative w-32">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                      <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Loan term</label>
                    <div className="flex gap-2 w-32">
                      <div className="relative w-1/2">
                        <input type="number" value={loanTermYears} onChange={(e) => setLoanTermYears(e.target.value)} className="w-full pr-6 pl-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-primary/50 text-[10px]">years</span>
                      </div>
                      <div className="relative w-1/2">
                        <input type="number" value={loanTermMonths} onChange={(e) => setLoanTermMonths(e.target.value)} className="w-full pr-8 pl-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-primary/50 text-[10px]">months</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Monthly payment</label>
                    <div className="relative w-32">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                      <input type="number" value={monthlyPayment} onChange={(e) => setMonthlyPayment(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
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
                <div className="bg-[#7cb342] text-white p-2 flex justify-between items-center">
                  <span className="font-bold text-lg">Results</span>
                  <div className="w-4 h-4 border border-white flex items-center justify-center text-[10px]">💾</div>
                </div>
                
                <div className="p-4 bg-surface-container">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1 border-b border-outline-variant">
                      <span className="text-primary/90 font-bold">Interest rate</span>
                      <span className="text-primary font-bold">{results.rate > 0 ? results.rate.toFixed(3) + '%' : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-primary/90">Total of {results.n} monthly payments</span>
                      <span className="text-primary">{formatCurrency(results.totalPayments)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-primary/90">Total interest paid</span>
                      <span className="text-primary">{formatCurrency(results.totalInterest)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          {results.rate > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="text-center font-bold text-primary mb-4">Loan Amortization Graph</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                      <XAxis dataKey="year" tick={{fontSize: 12}} stroke="#6B7280" />
                      <YAxis tickFormatter={(value) => `$${value/1000}K`} tick={{fontSize: 12}} stroke="#6B7280" />
                      <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend verticalAlign="top" align="left" iconType="square" />
                      <Line type="monotone" dataKey="Balance" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Interest" stroke="#8bc34a" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Payment" stroke="#ef4444" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h3 className="text-center font-bold text-primary mb-4">Payment Breakdown</h3>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={results.pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={0}
                        dataKey="value"
                      >
                        {results.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend layout="vertical" verticalAlign="middle" align="right" iconType="square" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Related */}
          <div className="mt-8">
            <h3 className="font-bold text-primary mb-2">Related</h3>
            <div className="flex flex-wrap gap-2">
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">APR Calculator</button>
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">Interest Calculator</button>
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">Compound Interest Calculator</button>
            </div>
          </div>

          {/* Text Content */}
          <div className="mt-12 space-y-6 text-sm text-primary/80 leading-relaxed">
            <h3 className="text-lg font-bold text-primary">What is Interest Rate?</h3>
            <p>Interest rate is the amount charged by lenders to borrowers for the use of money, expressed as a percentage of the principal, or original amount borrowed; it can also be described alternatively as the cost to borrow money. For instance, an 8% interest rate for borrowing $100 a year will obligate a person to pay $108 at year-end. As can be seen in this brief example, the interest rate directly affects the total interest paid on any loan. Generally, borrowers want the lowest possible interest rates because it will cost less to borrow; conversely, lenders (or investors) seek high interest rates for larger profits. Interest rates are usually expressed annually, but rates can also be expressed as monthly, daily, or any other period.</p>
            <p>Interest rates are involved in almost all formal lending and borrowing transactions. Examples of real-world applications of interest rates include mortgage rates, the charge on a person's outstanding debt on a credit card, business loans to fund capital projects, the growth of retirement funds, amortization of long-term assets, the discount offered by a supplier to a buyer for paying off an invoice earlier, and much, much more.</p>

            <h4 className="font-bold text-primary mt-4">Simple vs. Compound Interest</h4>
            <p>There are two methods for calculating interest. Simple interest is calculated as a percentage of principal only, while compound interest is calculated as a percentage of the principal along with any accrued interest. As a result of this compounding behavior, interest earned by lenders subsequently earns interest over time. The more frequently interest compounds within a given time period, the more interest will be accrued. Most formal interest payment calculations today are compounded, including those for this calculator, and any following reference to the interest rate will refer to compound interest rather than simple interest unless otherwise specified. To do calculations or learn more about the differences between compounding frequencies, please visit the <a href="#" className="text-secondary hover:underline">Compound Interest Calculator</a>.</p>

            <h4 className="font-bold text-primary mt-4">Fixed vs. Variable Interest Rates</h4>
            <p>Fixed rates are rates that are set as a certain percentage for the life of the loan and will not change. Variable rates are interest rates that can fluctuate over time. The degree of variance is generally based on factors such as another interest rate, inflation, or a market index. There are different pros and cons to each, but the Interest Rate Calculator will only display the result as a fixed interest rate.</p>

            <h4 className="font-bold text-primary mt-4">APR</h4>
            <p>The interest rate for many types of loans is often advertised as an annual percentage rate, or APR. APRs are commonly used within the home or car-buying contexts and are slightly different from typical interest rates in that certain fees can be packaged into them. For instance, administrative fees that are usually due when buying new cars are typically rolled into the financing of the loan instead of paid upfront. APR is a more accurate representation than the interest rate when shopping and comparing similar competing. On the other hand, annual percentage yield (APY) is the interest rate that is earned at a financial institution, usually from a savings account or Certificate of Deposit (in the U.S.). For more information or to do calculations involving APR, please visit the <a href="#" className="text-secondary hover:underline">APR Calculator</a>.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Uncontrollable Economic Factors that Affect Interest Rate</h3>
            <p>There are many factors that affect what interest rates people get on their mortgages and auto loans. Although these largely cannot be controlled, having knowledge of these factors may still be helpful.</p>
            
            <h4 className="font-bold text-primary mt-4">Economic Policy and Inflation</h4>
            <p>In most developed countries today, interest rates fluctuate mainly due to monetary policy set by central banks. The control of inflation is the major subject of monetary policies. Inflation is defined as the general increase in the price of goods and services and the fall in the purchasing power of money. It is closely related to interest rates on a macroeconomic level, and large-scale changes in either will have an effect on the other. In the U.S., the Federal Reserve can change the rate at most up to eight times a year during the Federal Open Market Committee meetings. In general, one of their main goals is to maintain steady inflation (several percentage points a year).</p>

            <h4 className="font-bold text-primary mt-4">Economic Activity</h4>
            <p>In an economy, as interest rates go down, more businesses and people are inclined to borrow money for business expansion and making expensive purchases such as homes or cars. This will create more jobs, push up salary levels, and boost consumer confidence, and more money will be spent within that economy. On the other hand, if interest rates increase, consumer confidence goes down, and fewer people and businesses are inclined to borrow. Based on this, the central bank uses the interest rate as one of the main tools to control the economy. The central bank typically lowers the interest rate if the economy is slow and increases it if the economy expands too fast.</p>

            <h4 className="font-bold text-primary mt-4">Unemployment Rate</h4>
            <p>When the unemployment rate is high, consumers spend less money, and economic growth slows. However, when the unemployment rate is too low, it may lead to rampant inflation, a fast wage increase, and a high cost of doing business. As a result, interest rates and unemployment rates are normally inversely related; that is, when unemployment is high, interest rates are artificially lowered, usually in order to spur consumer spending. Conversely, when unemployment within an economy is low and there is a lot of consumer activity, interest rates will go up.</p>

            <h4 className="font-bold text-primary mt-4">Supply and Demand</h4>
            <p>Similar to the market for goods and services, the market for credit is determined by supply and demand, albeit to a lesser extent. When there exists a surplus of demand for money or credit, lenders react by raising interest rates. When there is less demand for credit or money, they lower rates in order to entice more borrowers. With that said, banks and credit unions still have to adhere to their reserve requirements, and there is a maximum amount that they can lend out at any time.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Controllable Factors that Determine Interest Rate</h3>
            <p>While many factors that affect the interest rate are uncontrollable, individuals can, to some degree, affect the interest rates they receive.</p>

            <h4 className="font-bold text-primary mt-4">Individual Credit Standing</h4>
            <p>In the U.S., credit scores and credit reports exist to provide information about each borrower so that lenders can assess risk. A credit score is a number between 300 and 850 that represents a borrower's creditworthiness; the higher, the better. Good credit scores are built over time through timely payments, low credit utilization, and many other factors. Credit scores drop when payments are missed or late, credit utilization is high, total debt is high, and bankruptcies are involved. The average credit score in the U.S. is around 700.</p>
            <p>The higher a borrower's credit score, the more favorable the interest rate they may receive. Anything higher than 750 is considered excellent and will receive the best interest rates. From the perspective of a lender, they are more hesitant to lend to borrowers with low credit scores and/or a history of bankruptcy and missed credit card payments than they would be to borrowers with clean histories of timely mortgage and auto payments. As a result, they will either reject the lending application or charge higher rates to protect themselves from the likelihood that higher-risk borrowers default. For example, a credit card issuer can raise the interest rate on an individual's credit card if they start missing many payments.</p>

            <h4 className="font-bold text-primary mt-4">How to Receive Better Interest Rates</h4>
            <p>Although individual credit standing is one of the most important determinants of the favorability of the interest rates borrowers receive, there are other considerations they can take note of.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Secured loans</strong>—Generally speaking, unsecured loans will carry higher interest rates than secured loans, mainly because there is no collateral involved. That is, if the borrower defaults, the lender is legally entitled to ownership of the collateral. Borrowers seeking more favorable interest rates can consider putting up collateral for a secured loan instead.</li>
              <li><strong>Loan specifics</strong>—Longer repayment terms can increase the interest rate because it is riskier for lenders. In addition, making too low a down payment (which is also seen as risky) can result in the borrower receiving a higher interest rate. Choosing a shorter loan term and putting more money down can lower the interest rate a borrower is subject to.</li>
              <li><strong>Do not apply for credit too often</strong>—Too many inquiries on a credit report tell a lender that a borrower may have trouble attaining credit, which is a sign of a high-risk borrower. A single inquiry can deduct a few points off a credit score!</li>
              <li><strong>Borrow at opportune moments</strong>—While borrowers have no control over economic factors, they can choose to borrow during times when economic factors are more favorable. When the economy is slow and demand for loans is low, it is possible to find lower interest rates.</li>
              <li><strong>Research and shop around</strong>—Different lenders have different rates. Borrowers may be able to find a lower interest rate by shopping around rather than accepting the first loan offered. It is possible to reveal to each lender that another is offering a better rate as a negotiation tactic. While getting a good rate is important, be careful about specific conditions and any additional costs.</li>
            </ul>

            <h3 className="text-lg font-bold text-primary mt-8">Real Interest Rate</h3>
            <p>The relationship between real interest rate, inflation, and the nominal rate is shown by the following equation:</p>
            <p className="text-center font-mono">real rate + inflation = nominal rate</p>
            <p>In this equation, the nominal rate is generally the figure being discussed when the "interest rate" is mentioned. The nominal rate is the sum of the general level of inflation and the real rate of interest that is being applied. For more information about or to do calculations involving inflation, please visit the <a href="#" className="text-secondary hover:underline">Inflation Calculator</a>.</p>
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
