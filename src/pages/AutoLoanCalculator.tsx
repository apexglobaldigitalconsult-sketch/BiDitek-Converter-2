import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HelpCircle } from 'lucide-react';

export default function AutoLoanCalculator() {
  const [autoPrice, setAutoPrice] = useState('50000');
  const [loanTerm, setLoanTerm] = useState('60');
  const [interestRate, setInterestRate] = useState('5');
  const [cashIncentives, setCashIncentives] = useState('0');
  const [downPayment, setDownPayment] = useState('10000');
  const [tradeInValue, setTradeInValue] = useState('0');
  const [amountOwedOnTradeIn, setAmountOwedOnTradeIn] = useState('0');
  const [state, setState] = useState('');
  const [salesTax, setSalesTax] = useState('7');
  const [fees, setFees] = useState('2000');
  const [includeTaxesAndFees, setIncludeTaxesAndFees] = useState(false);

  const calculateLoan = () => {
    const price = parseFloat(autoPrice) || 0;
    const term = parseFloat(loanTerm) || 0;
    const rate = parseFloat(interestRate) || 0;
    const incentives = parseFloat(cashIncentives) || 0;
    const down = parseFloat(downPayment) || 0;
    const tradeIn = parseFloat(tradeInValue) || 0;
    const owedOnTradeIn = parseFloat(amountOwedOnTradeIn) || 0;
    const taxRate = parseFloat(salesTax) || 0;
    const otherFees = parseFloat(fees) || 0;

    // Taxable amount is typically Price - Trade-in
    const taxableAmount = Math.max(0, price - tradeIn);
    const calculatedTax = taxableAmount * (taxRate / 100);

    let loanAmount = 0;
    let upfrontPayment = 0;

    if (includeTaxesAndFees) {
      loanAmount = price - incentives - down - tradeIn + owedOnTradeIn + calculatedTax + otherFees;
      upfrontPayment = down;
    } else {
      loanAmount = price - incentives - down - tradeIn + owedOnTradeIn;
      upfrontPayment = down + calculatedTax + otherFees;
    }

    // Ensure loan amount isn't negative
    loanAmount = Math.max(0, loanAmount);

    const r = rate / 100 / 12;
    const n = term;
    
    let monthlyPayment = 0;
    if (r > 0 && n > 0) {
      monthlyPayment = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else if (n > 0) {
      monthlyPayment = loanAmount / n;
    }

    const totalPayments = monthlyPayment * n;
    const totalInterest = totalPayments - loanAmount;
    const totalCost = price + totalInterest + calculatedTax + otherFees;

    return {
      monthlyPayment,
      loanAmount,
      calculatedTax,
      upfrontPayment,
      totalPayments,
      totalInterest,
      totalCost
    };
  };

  const results = useMemo(() => calculateLoan(), [
    autoPrice, loanTerm, interestRate, cashIncentives, downPayment, 
    tradeInValue, amountOwedOnTradeIn, salesTax, fees, includeTaxesAndFees
  ]);

  const generateAmortizationSchedule = () => {
    const P = results.loanAmount;
    const r = (parseFloat(interestRate) || 0) / 100 / 12;
    const n = parseFloat(loanTerm) || 0;
    const payment = results.monthlyPayment;

    let balance = P;
    const schedule = [];
    
    let yearlyInterest = 0;
    let yearlyPrincipal = 0;
    let currentYear = 1;

    for (let i = 1; i <= n; i++) {
      const interestPayment = balance * r;
      const principalPayment = payment - interestPayment;
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

  const amortizationData = useMemo(() => generateAmortizationSchedule(), [results, interestRate, loanTerm]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans">
      <div className="flex justify-between items-center text-sm text-primary/60 mb-4">
        <div>
          <a href="#" className="hover:underline">home</a> / <a href="#" className="hover:underline">financial</a> / auto loan calculator
        </div>
        <a href="#" className="text-secondary hover:underline">Print</a>
      </div>
      <h1 className="text-2xl font-bold mb-6 text-primary">Auto Loan Calculator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-9 space-y-8">
          
          <div className="flex gap-1 mb-4">
            <button className="bg-primary text-background px-4 py-2 text-sm font-bold rounded-[1px]">Total Price</button>
            <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-2 text-sm font-bold rounded-[1px]">Monthly Payment</button>
          </div>

          <div className="bg-secondary text-white p-2 rounded-[1px] flex items-center justify-center gap-2 cursor-pointer text-sm font-bold shadow-sm -mt-4">
            <div className="w-4 h-4 bg-white rounded-[1px] flex items-center justify-center text-blue-600 text-xs">▼</div>
            Modify the values and click the Calculate button to use
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column: Inputs */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-surface-container p-4 rounded-[1px] border border-outline-variant">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Auto Price</label>
                    <div className="relative w-40">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                      <input type="number" value={autoPrice} onChange={(e) => setAutoPrice(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Loan Term</label>
                    <div className="relative w-40">
                      <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="w-full pr-14 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-xs">months</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Interest Rate</label>
                    <div className="relative w-40">
                      <input type="number" step="0.01" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="w-full pr-6 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90 flex items-center gap-1">Cash Incentives <HelpCircle className="w-3 h-3 text-gray-400" /></label>
                    <div className="relative w-40">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                      <input type="number" value={cashIncentives} onChange={(e) => setCashIncentives(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90 flex items-center gap-1">Down Payment <HelpCircle className="w-3 h-3 text-gray-400" /></label>
                    <div className="relative w-40">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                      <input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90 flex items-center gap-1">Trade-in Value <HelpCircle className="w-3 h-3 text-gray-400" /></label>
                    <div className="relative w-40">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                      <input type="number" value={tradeInValue} onChange={(e) => setTradeInValue(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90 leading-tight flex items-center gap-1">Amount Owed<br/>on Trade-in <HelpCircle className="w-3 h-3 text-gray-400" /></label>
                    <div className="relative w-40">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                      <input type="number" value={amountOwedOnTradeIn} onChange={(e) => setAmountOwedOnTradeIn(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90">Your State</label>
                    <select value={state} onChange={(e) => setState(e.target.value)} className="w-40 py-1 px-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary">
                      <option value="">-- Select --</option>
                      <option value="CA">California</option>
                      <option value="NY">New York</option>
                      <option value="TX">Texas</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90 flex items-center gap-1">Sales Tax <HelpCircle className="w-3 h-3 text-gray-400" /></label>
                    <div className="relative w-40">
                      <input type="number" step="0.01" value={salesTax} onChange={(e) => setSalesTax(e.target.value)} className="w-full pr-6 py-1 pl-2 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50 text-sm">%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-primary/90 leading-tight flex items-center gap-1">Title, Registration<br/>and Other Fees <HelpCircle className="w-3 h-3 text-gray-400" /></label>
                    <div className="relative w-40">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                      <input type="number" value={fees} onChange={(e) => setFees(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={includeTaxesAndFees}
                        onChange={(e) => setIncludeTaxesAndFees(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded-[1px] focus:ring-secondary"
                      />
                      <span className="text-primary/90">Include taxes and fees in loan</span>
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
                  <span className="font-bold">Monthly Pay: <span className="text-xl ml-2">{formatCurrency(results.monthlyPayment)}</span></span>
                  <div className="w-4 h-4 border border-white flex items-center justify-center text-[10px]">💾</div>
                </div>
                
                <div className="p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1">
                      <span className="text-primary/90">Total Loan Amount</span>
                      <span className="text-primary">{formatCurrency(results.loanAmount)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-primary/90">Sale Tax</span>
                      <span className="text-primary">{formatCurrency(results.calculatedTax)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-primary/90 flex items-center gap-1">Upfront Payment <HelpCircle className="w-3 h-3 text-gray-400" /></span>
                      <span className="text-primary">{formatCurrency(results.upfrontPayment)}</span>
                    </div>
                    <div className="flex justify-between py-1 mt-4 border-t border-outline-variant pt-2">
                      <span className="text-primary/90">Total of {loanTerm} Loan Payments</span>
                      <span className="text-primary">{formatCurrency(results.totalPayments)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-primary/90">Total Loan Interest</span>
                      <span className="text-primary">{formatCurrency(results.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between py-1 font-bold">
                      <span className="text-primary">Total Cost (price, interest, tax, fees)</span>
                      <span className="text-primary">{formatCurrency(results.totalCost)}</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-center font-bold text-primary/90 mb-4">Loan Breakdown</h3>
                    <div className="flex items-center justify-center gap-6">
                      <div className="w-24 h-24 relative">
                        <div className="w-full h-full rounded-[1px]" style={{
                          background: `conic-gradient(#3b82f6 0% ${(results.loanAmount/results.totalPayments)*100}%, #8bc34a ${(results.loanAmount/results.totalPayments)*100}% 100%)`
                        }}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-surface-container-low rounded-[1px]"></div>
                        </div>
                        <div className="absolute top-1/2 left-2 -translate-y-1/2 text-[10px] font-bold text-white drop-shadow-md">{Math.round((results.loanAmount/results.totalPayments)*100)}%</div>
                        <div className="absolute top-1/2 right-2 -translate-y-1/2 text-[10px] font-bold text-white drop-shadow-md">{Math.round((results.totalInterest/results.totalPayments)*100)}%</div>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500"></div> <span className="text-primary/80">Principal</span></div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-[#8bc34a]"></div> <span className="text-primary/80">Interest</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-8">
                    <a href="#" className="text-secondary hover:underline text-sm">Find Average Tax Rate and Fees in Your State.</a>
                  </div>
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

          {/* Related */}
          <div className="mt-8">
            <h3 className="font-bold text-primary mb-2">Related</h3>
            <div className="flex gap-2">
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">Cash Back or Low Interest Calculator</button>
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">Auto Lease Calculator</button>
            </div>
          </div>

          {/* Text Content */}
          <div className="mt-12 space-y-6 text-sm text-primary/80 leading-relaxed">
            <p>The Auto Loan Calculator is mainly intended for car purchases within the U.S. People outside the U.S. may still use the calculator, but please adjust accordingly. If only the monthly payment for any auto loan is given, use the Monthly Payments tab (reverse auto loan) to calculate the actual vehicle purchase price and other auto loan information.</p>
            
            <h3 className="text-lg font-bold text-primary mt-8">Auto Loans</h3>
            <p>Most people turn to auto loans during a vehicle purchase. They work as any generic, secured loan from a financial institution does with a typical term of 36, 60, 72, or 84 months in the U.S. Each month, repayment of principal and interest must be made from borrowers to auto loan lenders. Money borrowed from a lender that isn't paid back can result in the car being legally repossessed.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Dealership Financing vs. Direct Lending</h3>
            <p>Generally, there are two main financing options available when it comes to auto loans: direct lending or dealership financing. The former comes in the form of a typical loan originating from a bank, credit union, or financial institution. Once a contract has been entered with a car dealer to buy a vehicle, the loan is used from the direct lender to pay for the new car. Dealership financing is somewhat similar except that the auto loan, and thus paperwork, is initiated and completed through the dealership instead. Auto loans via dealers are usually serviced by captive lenders that are often associated with each car make. The contract is retained by the dealer but is often sold to a bank, or other financial institution called an assignee that ultimately services the loan.</p>
            <p>Direct lending provides more leverage for buyers to walk into a car dealer with most of the financing done on their terms, as it places further stress on the car dealer to compete with a better rate. Getting pre-approved doesn't tie car buyers down to any one dealership, and their propensity to simply walk away is much higher. With dealer financing, the potential car buyer has fewer choices when it comes to interest rate shopping, though it's there for convenience for anyone who doesn't want to spend time shopping or cannot get an auto loan through direct lending.</p>
            <p>Often, to promote auto sales, car manufacturers offer good financing deals via dealers. Consumers in the market for a new car should start their search for financing with car manufacturers. It is not rare to get low interest rates like 0%, 0.9%, 1.9%, or 2.9% from car manufacturers.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Vehicle Rebates</h3>
            <p>Car manufacturers may offer vehicle rebates to further incentivize buyers. Depending on the state, the rebate may or may not be taxed accordingly. For example, purchasing a vehicle at $50,000 with a cash rebate of $2,000 will have sales tax calculated based on the original price of $50,000, not $48,000. Luckily, a good portion of states do not do this and don't tax cash rebates. They are Alaska, Arizona, Delaware, Iowa, Kansas, Kentucky, Louisiana, Massachusetts, Minnesota, Missouri, Montana, Nebraska, New Hampshire, Oklahoma, Oregon, Pennsylvania, Rhode Island, Texas, Utah, Vermont, and Wyoming.</p>
            <p>Generally, rebates are only offered for new cars. While some used car dealers do offer cash rebates, this is rare due to the difficulty involved in determining the true value of the vehicle.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Fees</h3>
            <p>A car purchase comes with costs other than the purchase price, the majority of which are fees that can normally be rolled into the financing of the auto loan or paid upfront. However, car buyers with low credit scores might be forced into paying fees upfront. The following is a list of common fees associated with car purchases in the U.S.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Sales Tax</strong>—Most states in the U.S. collect sales tax for auto purchases. It is possible to finance the cost of sales tax with the price of the car, depending on the state the car was purchased in. Alaska, Delaware, Montana, New Hampshire, and Oregon are the five states that don't charge sales tax.</li>
              <li><strong>Document Fees</strong>—This is a fee collected by the dealer for processing documents like title and registration.</li>
              <li><strong>Title and Registration Fees</strong>—This is the fee collected by states for vehicle title and registration.</li>
              <li><strong>Advertising Fees</strong>—This is a fee that the regional dealer pays for promoting the manufacturer's automobile in the dealer's area. If not charged separately, advertising fees are included in the auto price. A typical price tag for this fee is a few hundred dollars.</li>
              <li><strong>Destination Fee</strong>—This is a fee that covers the shipment of the vehicle from the plant to the dealer's office. This fee is usually between $900 and $1,500.</li>
              <li><strong>Insurance</strong>—In the U.S., auto insurance is strictly mandatory to be regarded as a legal driver on public roads and is usually required before dealers can process paperwork. When a car is purchased via loan and not cash, full coverage insurance is often mandatory. Auto insurance can possibly run more than $1,000 a year for full coverage. Most auto dealers can provide short-term (1 or 2 months) insurance for paperwork processing so new car owners can deal with proper insurance later.</li>
            </ul>
            <p>If the taxes and fees are bundled into the auto loan, remember to check the box 'Include taxes and fees in loan' in the calculator. If they are paid upfront instead, leave it unchecked. Should an auto dealer package any mysterious special charges into a car purchase, it would be wise to demand justification and thorough explanations for their inclusion.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Auto Loan Strategies</h3>
            
            <h4 className="font-bold text-primary">Preparation</h4>
            <p>Probably the most important strategy to get a great auto loan is to be well-prepared. This means determining what is affordable before heading to a dealership first. Knowing what kind of vehicle is desired will make it easier to research and find the best deals to suit your individual needs. Once a particular make and model is chosen, it is generally useful to have some typical going rates in mind to enable effective negotiations with a car salesman. This includes talking to more than one lender and getting quotes from several different places. Car dealers, like many businesses, want to make as much money as possible from a sale, but often, given enough negotiation, are willing to sell a car for significantly less than the price they initially offer. Getting a preapproval for an auto loan through direct lending can aid negotiations.</p>

            <h4 className="font-bold text-primary mt-4">Credit</h4>
            <p>Credit, and to a lesser extent, income, generally determines approval for auto loans, whether through dealership financing or direct lending. In addition, borrowers with excellent credit will most likely receive lower interest rates, which will result in paying less for a car overall. Borrowers can improve their chances to negotiate the best deals by taking steps towards achieving better credit scores before taking out a loan to purchase a car.</p>

            <h4 className="font-bold text-primary mt-4">Cash Back vs. Low Interest</h4>
            <p>When purchasing a vehicle, many times, auto manufacturers may offer either a cash vehicle rebate or a lower interest rate. A cash rebate instantly reduces the purchasing price of the car, but a lower rate can potentially result in savings in interest payments. The choice between the two will be different for everyone. For more information about or to do calculations involving this decision, please go to the <a href="#" className="text-secondary hover:underline">Cash Back vs. Low Interest Calculator</a>.</p>

            <h4 className="font-bold text-primary mt-4">Early Payoff</h4>
            <p>Paying off an auto loan earlier than usual not only shortens the length of the loan but can also result in interest savings. However, some lenders have an early payoff penalty or terms restricting early payoff. It is important to examine the details carefully before signing an auto loan contract.</p>

            <h4 className="font-bold text-primary mt-4">Consider Other Options</h4>
            <p>Although the allure of a new car can be strong, buying a pre-owned car even if only a few years old can translate into usually result in significant savings; new cars depreciate as soon as they are driven off the lot, sometimes by more than 10% of their values; this is called off-the-lot depreciation, and is an alternative option for prospective car buyers to consider.</p>
            <p>People who just want a new car for the enjoyment of driving a new car may also consider a lease, which is, in essence, a long-term rental that normally costs less upfront than a full purchase. For more information about or to do calculations involving auto leases, please visit the <a href="#" className="text-secondary hover:underline">Auto Lease Calculator</a>.</p>
            <p>In some cases, a car might not even be needed! If possible, consider public transportation, carpool with other people, bike, or walk instead.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Buying a Car with Cash Instead</h3>
            <p>Although most car purchases are made with auto loans in the U.S., there are benefits to buying a car outright with cash.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Avoid Monthly Payments</strong>—Paying with cash relinquishes a person of the responsibility of making monthly payments. This can be a huge emotional benefit for anyone who would prefer not to have a large loan looming over their head for the next few years. In addition, the possibility of late fees for late monthly payments no longer exists.</li>
              <li><strong>Avoid Interest</strong>—No financing involved in the purchase of a car means there will be no interest charged, which will result in a lower overall cost to own the car. As a very simple example, borrowing $32,000 for five years at 6% will require a payment of $618.65 per month, with a total interest payment of $5,118.98 over the life of the loan. In this scenario, paying in cash will save $5,118.98.</li>
              <li><strong>Future Flexibility</strong>—Because ownership of a car is 100% after paying in full. There aren't any restrictions on the car, such as the right to sell it after several months, use less expensive insurance coverage, and make certain modifications to the car.</li>
              <li><strong>Avoid Overbuying</strong>—Paying in full with a single amount will limit car buyers to what is within their immediate, calculated budget. On the other hand, financed purchases are less concrete and have the potential to result in car buyers buying more than what they can afford long term; it's easy to be tempted to add a few extra dollars to a monthly payment to stretch the loan length out for a more expensive car. To complicate matters, car salesmen tend to use tactics such as fees and intricate financing in order to get buyers to buy out of their realm. All of this can be avoided by paying in cash.</li>
              <li><strong>Discounts</strong>—In some cases, car purchases can come with the option of either an immediate rebate or low-interest financing. Certain rebates are only offered to cash purchases.</li>
              <li><strong>Avoid Underwater Loan</strong>—When it comes to financing a depreciating asset, there is the chance that the loan goes underwater, which means more is owed on the asset than its current worth. Auto loans are no different, and paying in full avoids this scenario completely.</li>
            </ul>
            <p>There are a lot of benefits to paying with cash for a car purchase, but that doesn't mean everyone should do it. Situations exist where financing with an auto loan can make more sense to a car buyer, even if they have enough saved funds to purchase the car in a single payment. For example, if a very low interest rate auto loan is offered on a car purchase and there exist other opportunities to make greater investments with the funds, it might be more worthwhile to invest the money instead to receive a higher return. Also, a car buyer striving to achieve a higher credit score can choose the financing option, and never miss a single monthly payment on their new car in order to build their scores, which aid other areas of personal finance. It is up to each individual to determine which the right decision is.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Trade-in Value</h3>
            <p>A trade-in is a process of selling your vehicle to the dealership in exchange for credit toward purchasing another vehicle. Don't expect too much value when trading in old cars to dealerships. Selling old cars privately and using the funds for a future car purchase tends to result in a more financially desirable outcome.</p>
            <p>In most of the states that collect sales tax on auto purchases (not all do), the sales tax collected is based on the difference between the new car and trade-in price. For a $50,000 new car purchase with a $10,000 trade-in value, the tax paid on the new purchase with an 8% tax rate is:</p>
            <p className="text-center">($50,000 - $10,000) × 8% = $3,200</p>
            <p>Some states do not offer any sales tax reduction with trade-ins, including California, District of Columbia, Hawaii, Kentucky, Maryland, Michigan, Montana, and Virginia. This Auto Loan Calculator automatically adjusts the method used to calculate sales tax involving Trade-in Value based on the state provided.</p>
            <p>Using the values from the example above, if the new car was purchased in a state without a sales tax reduction for trade-ins, the sales tax would be:</p>
            <p className="text-center">$50,000 × 8% = $4,000</p>
            <p>This comes out to be an $800 difference which could be a reason for people selling a car in these states to consider a private sale.</p>
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
