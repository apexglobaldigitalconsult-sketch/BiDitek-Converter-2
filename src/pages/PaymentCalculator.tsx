import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PaymentCalculator() {
  const [activeTab, setActiveTab] = useState<'fixedTerm' | 'fixedPayments'>('fixedTerm');

  // Fixed Term State
  const [ftLoanAmount, setFtLoanAmount] = useState('200000');
  const [ftLoanTerm, setFtLoanTerm] = useState('15');
  const [ftInterestRate, setFtInterestRate] = useState('6');

  // Fixed Payments State
  const [fpLoanAmount, setFpLoanAmount] = useState('200000');
  const [fpMonthlyPay, setFpMonthlyPay] = useState('1687.71');
  const [fpInterestRate, setFpInterestRate] = useState('6');

  const calculateFixedTerm = () => {
    const P = parseFloat(ftLoanAmount) || 0;
    const n = (parseFloat(ftLoanTerm) || 0) * 12;
    const r = (parseFloat(ftInterestRate) || 0) / 100 / 12;

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
      months: n,
      years: parseFloat(ftLoanTerm) || 0
    };
  };

  const calculateFixedPayments = () => {
    const P = parseFloat(fpLoanAmount) || 0;
    const pmt = parseFloat(fpMonthlyPay) || 0;
    const r = (parseFloat(fpInterestRate) || 0) / 100 / 12;

    let n = 0;
    let totalPayments = 0;
    let totalInterest = 0;
    let error = null;

    if (r > 0 && pmt > 0 && P > 0) {
      if (pmt <= P * r) {
        error = "Monthly payment is too low to cover the interest.";
      } else {
        n = Math.log(pmt / (pmt - P * r)) / Math.log(1 + r);
        totalPayments = pmt * n;
        totalInterest = totalPayments - P;
      }
    } else if (pmt > 0 && P > 0) {
      n = P / pmt;
      totalPayments = P;
      totalInterest = 0;
    }

    return {
      months: n,
      years: n / 12,
      totalPayments,
      totalInterest,
      principal: P,
      monthlyPayment: pmt,
      error
    };
  };

  const results = useMemo(() => {
    if (activeTab === 'fixedTerm') {
      return calculateFixedTerm();
    } else {
      return calculateFixedPayments();
    }
  }, [activeTab, ftLoanAmount, ftLoanTerm, ftInterestRate, fpLoanAmount, fpMonthlyPay, fpInterestRate]);

  const generateAmortizationSchedule = () => {
    if (results.error || results.months <= 0) return [];

    const P = results.principal;
    const r = (parseFloat(activeTab === 'fixedTerm' ? ftInterestRate : fpInterestRate) || 0) / 100 / 12;
    const n = Math.ceil(results.months);
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

  const amortizationData = useMemo(() => generateAmortizationSchedule(), [results]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans">
      <div className="flex justify-between items-center text-sm text-primary/60 mb-4">
        <div>
          <a href="#" className="hover:underline">home</a> / <a href="#" className="hover:underline">financial</a> / payment calculator
        </div>
        <a href="#" className="text-secondary hover:underline">Print</a>
      </div>
      <h1 className="text-2xl font-bold mb-2 text-primary">Payment Calculator</h1>
      <p className="text-sm text-primary/80 mb-6 leading-relaxed">
        The Payment Calculator can determine the monthly payment amount or loan term for a fixed interest loan. Use the "Fixed Term" tab to calculate the monthly payment of a fixed-term loan. Use the "Fixed Payments" tab to calculate the time to pay off a loan with a fixed monthly payment. For more information about or to do calculations specifically for car payments, please use the <a href="#" className="text-secondary hover:underline">Auto Loan Calculator</a>. To find net payment of salary after taxes and deductions, use the <a href="#" className="text-secondary hover:underline">Take-Home-Pay Calculator</a>.
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
                <button 
                  className={`flex-1 py-2 text-sm font-bold rounded-[1px] ${activeTab === 'fixedTerm' ? 'bg-primary text-background' : 'bg-secondary text-white hover:bg-secondary/80'}`}
                  onClick={() => setActiveTab('fixedTerm')}
                >
                  Fixed Term
                </button>
                <button 
                  className={`flex-1 py-2 text-sm font-bold rounded-[1px] ${activeTab === 'fixedPayments' ? 'bg-primary text-background' : 'bg-secondary text-white hover:bg-secondary/80'}`}
                  onClick={() => setActiveTab('fixedPayments')}
                >
                  Fixed Payments
                </button>
              </div>
              
              <div className="bg-surface-container p-4 rounded-[1px] border border-outline-variant border-t-0">
                <div className="space-y-3 text-sm">
                  {activeTab === 'fixedTerm' ? (
                    <>
                      <div className="flex items-center justify-between">
                        <label className="text-primary/90">Loan Amount</label>
                        <div className="relative w-40">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                          <input type="number" value={ftLoanAmount} onChange={(e) => setFtLoanAmount(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-primary/90">Loan Term</label>
                        <div className="relative w-40">
                          <input type="number" value={ftLoanTerm} onChange={(e) => setFtLoanTerm(e.target.value)} className="w-full pr-12 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-xs">years</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-primary/90">Interest Rate</label>
                        <div className="relative w-40">
                          <input type="number" step="0.01" value={ftInterestRate} onChange={(e) => setFtInterestRate(e.target.value)} className="w-full pr-6 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <label className="text-primary/90">Loan Amount</label>
                        <div className="relative w-40">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                          <input type="number" value={fpLoanAmount} onChange={(e) => setFpLoanAmount(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-primary/90">Monthly Pay</label>
                        <div className="relative w-40">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                          <input type="number" value={fpMonthlyPay} onChange={(e) => setFpMonthlyPay(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-primary/90">Interest Rate</label>
                        <div className="relative w-40">
                          <input type="number" step="0.01" value={fpInterestRate} onChange={(e) => setFpInterestRate(e.target.value)} className="w-full pr-6 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                        </div>
                      </div>
                    </>
                  )}
                  
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
                  <span className="font-bold text-lg">{activeTab === 'fixedTerm' ? 'Monthly Payment:' : 'Time to Payoff:'} <span className="text-xl ml-2">{activeTab === 'fixedTerm' ? formatCurrency(results.monthlyPayment) : `${Math.floor(results.years)} years ${Math.ceil((results.years - Math.floor(results.years)) * 12)} months`}</span></span>
                  <div className="w-4 h-4 border border-white flex items-center justify-center text-[10px]">💾</div>
                </div>
                
                <div className="p-4">
                  {results.error ? (
                    <div className="text-red-500 font-bold text-center py-4">{results.error}</div>
                  ) : (
                    <>
                      <div className="mb-4 text-sm text-primary/90">
                        {activeTab === 'fixedTerm' 
                          ? `You will need to pay ${formatCurrency(results.monthlyPayment)} every month for ${results.years} years to payoff the debt.`
                          : `You will need to pay ${formatCurrency(results.monthlyPayment)} every month for ${Math.ceil(results.months)} months to payoff the debt.`
                        }
                      </div>
                      <div className="space-y-2 text-sm border-t border-outline-variant pt-2">
                        <div className="flex justify-between py-1">
                          <span className="text-primary/90">Total of {Math.ceil(results.months)} Payments</span>
                          <span className="text-primary">{formatCurrency(results.totalPayments)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-primary/90">Total Interest</span>
                          <span className="text-primary">{formatCurrency(results.totalInterest)}</span>
                        </div>
                      </div>

                      <div className="mt-8 flex items-center justify-center gap-6">
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Amortization Schedule */}
          {!results.error && (
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
                      <Line type="monotone" dataKey="balance" name="Balance" stroke="#ef4444" dot={false} strokeWidth={2} />
                      <Line type="monotone" dataKey="interest" name="Interest" stroke="#3b82f6" dot={false} strokeWidth={2} />
                      <Line type="monotone" dataKey="payment" name="Payment" stroke="#f59e0b" dot={false} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Related */}
          <div className="mt-8">
            <h3 className="font-bold text-primary mb-2">Related</h3>
            <div className="flex gap-2">
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">Loan Calculator</button>
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">Auto Loan Calculator</button>
            </div>
          </div>

          {/* Text Content */}
          <div className="mt-12 space-y-6 text-sm text-primary/80 leading-relaxed">
            <p>A loan is a contract between a borrower and a lender in which the borrower receives an amount of money (principal) that they are obligated to pay back in the future. Loans can be customized based on various factors. The number of available options can be overwhelming. Two of the most common deciding factors are the term and monthly payment amount, which are separated by tabs in the calculator above.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Fixed Term</h3>
            <p>Mortgages, auto, and many other loans tend to use the time limit approach to the repayment of loans. For mortgages, in particular, choosing to have routine monthly payments between 30 years or 15 years or other terms can be a very important decision because how long a debt obligation lasts can affect a person's long-term financial goals. Some examples include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Choosing a shorter mortgage term because of the uncertainty of long-term job security or preference for a lower interest rate while there is a sizable amount in savings</li>
              <li>Choosing a longer mortgage term in order to time it correctly with the release of Social Security retirement benefits, which can be used to pay off the mortgage</li>
            </ul>
            <p>The Payment Calculator can help sort out the fine details of such considerations. It can also be used when deciding between financing options for a car, which can range from 12 months to 96 months periods. Even though many car buyers will be tempted to take the longest option that results in the lowest monthly payment, the shortest term typically results in the lowest total paid for the car (interest + principal). Car buyers should experiment with the variables to see which term is best accommodated by their budget and situation. For additional information about or to do calculations involving mortgages or auto loans, please visit the <a href="#" className="text-secondary hover:underline">Mortgage Calculator</a> or <a href="#" className="text-secondary hover:underline">Auto Loan Calculator</a>.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Fixed Monthly Payment Amount</h3>
            <p>This method helps determine the time required to pay off a loan and is often used to find how fast the debt on a credit card can be repaid. This calculator can also estimate how early a person who has some extra money at the end of each month can pay off their loan. Simply add the extra into the "Monthly Pay" section of the calculator.</p>
            <p>It is possible that a calculation may result in a certain monthly payment that is not enough to repay the principal and interest on a loan. This means that interest will accrue at such a pace that repayment of the loan at the given "Monthly Pay" cannot keep up. If so, simply adjust one of the three inputs until a viable result is calculated. Either "Loan Amount" needs to be lower, "Monthly Pay" needs to be higher, or "Interest Rate" needs to be lower.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Interest Rate (APR)</h3>
            <p>When using a figure for this input, it is important to make the distinction between interest rate and annual percentage rate (APR). Especially when very large loans are involved, such as mortgages, the difference can be up to thousands of dollars. By definition, the interest rate is simply the cost of borrowing the principal loan amount. On the other hand, APR is a broader measure of the cost of a loan, which rolls in other costs such as broker fees, discount points, closing costs, and administrative fees. In other words, instead of upfront payments, these additional costs are added onto the cost of borrowing the loan and prorated over the life of the loan instead. If there are no fees associated with a loan, then the interest rate equals the APR. For more information about or to do calculations involving APR or Interest Rate, please visit the <a href="#" className="text-secondary hover:underline">APR Calculator</a> or <a href="#" className="text-secondary hover:underline">Interest Rate Calculator</a>.</p>
            <p>Borrowers can input both interest rate and APR (if they know them) into the calculator to see the different results. Use interest rate in order to determine loan details without the addition of other costs. To find the total cost of the loan, use APR. The advertised APR generally provides more accurate loan details.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Variable vs. Fixed</h3>
            <p>When it comes to loans, there are generally two available interest options to choose from: variable (sometimes called adjustable or floating) or fixed. The majority of loans have fixed interest rates, such as conventionally amortized loans like mortgages, auto loans, or student loans. Examples of variable loans include adjustable-rate mortgages, home equity lines of credit (HELOC), and some personal and student loans. For more information about or to do calculations involving any of these other loans, please visit the <a href="#" className="text-secondary hover:underline">Mortgage Calculator</a>, <a href="#" className="text-secondary hover:underline">Auto Loan Calculator</a>, <a href="#" className="text-secondary hover:underline">Student Loan Calculator</a>, or <a href="#" className="text-secondary hover:underline">Personal Loan Calculator</a>.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Variable Rate Information</h3>
            <p>In variable rate loans, the interest rate may change based on indices such as inflation or the central bank rate (all of which are usually in movement with the economy). The most common financial index that lenders reference for variable rates is the key index rate set by the U.S. Federal Reserve or the London Interbank Offered Rate (Libor).</p>
            <p>Because rates of variable loans vary over time, fluctuations in rates will alter routine payment amounts; the rate change in one month changes the monthly payment due for that month as well as the total expected interest owed over the life of the loan. Some lenders may place caps on variable loan rates, which are maximum limits on the interest rate charged, regardless of how much the index interest rate changes. Lenders only update interest rates periodically at a frequency agreed to by the borrower, most likely disclosed in a loan contract. As a result, a change to an indexed interest rate does not necessarily mean an immediate change to a variable loan's interest rate. Broadly speaking, variable rates are more favorable to the borrower when indexed interest rates are trending downward.</p>
            <p>Credit card rates can be fixed or variable. Credit card issuers aren't required to give advanced notice of an interest rate increase for credit cards with variable interest rates. It is possible for borrowers with excellent credit to request more favorable rates on their variable loans or credit cards. For more information or to perform calculations that involve paying off a credit card, use the <a href="#" className="text-secondary hover:underline">Credit Card Calculator</a> or use the <a href="#" className="text-secondary hover:underline">Credit Cards Payoff Calculator</a> for paying off multiple credit cards.</p>
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
