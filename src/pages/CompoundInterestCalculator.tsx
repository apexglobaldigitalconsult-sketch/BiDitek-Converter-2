import React, { useState, useMemo } from 'react';

export default function CompoundInterestCalculator() {
  const [inputInterest, setInputInterest] = useState('6');
  const [inputCompound, setInputCompound] = useState('12');
  const [outputCompound, setOutputCompound] = useState('1');

  const calculateOutput = () => {
    const r = parseFloat(inputInterest) / 100;
    if (isNaN(r)) return '0.00000%';

    const nIn = parseFloat(inputCompound);
    const nOut = parseFloat(outputCompound);

    let ear = 0;
    if (nIn === 0) {
      ear = Math.exp(r) - 1;
    } else {
      ear = Math.pow(1 + r / nIn, nIn) - 1;
    }

    let outRate = 0;
    if (nOut === 0) {
      outRate = Math.log(1 + ear);
    } else {
      outRate = nOut * (Math.pow(1 + ear, 1 / nOut) - 1);
    }

    return (outRate * 100).toFixed(5) + '%';
  };

  const outputInterest = useMemo(() => calculateOutput(), [inputInterest, inputCompound, outputCompound]);

  const frequencies = [
    { label: 'Continuously', value: '0' },
    { label: 'Daily (365)', value: '365' },
    { label: 'Weekly (52)', value: '52' },
    { label: 'Bi-weekly (26)', value: '26' },
    { label: 'Semi-monthly (24)', value: '24' },
    { label: 'Monthly (APR)', value: '12' },
    { label: 'Bimonthly (6)', value: '6' },
    { label: 'Quarterly (4)', value: '4' },
    { label: 'Semi-annually (2)', value: '2' },
    { label: 'Annually (APY)', value: '1' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans">
      <div className="flex justify-between items-center text-sm text-primary/60 mb-4">
        <div>
          <a href="#" className="hover:underline">home</a> / <a href="#" className="hover:underline">financial</a> / compound interest calculator
        </div>
        <a href="#" className="text-secondary hover:underline">Print</a>
      </div>
      <h1 className="text-2xl font-bold mb-2 text-primary">Compound Interest Calculator</h1>
      <p className="text-sm text-primary/80 mb-6 leading-relaxed">
        The <em>Compound Interest Calculator</em> below can be used to compare or convert the interest rates of different compounding periods. Please use our <a href="#" className="text-secondary hover:underline">Interest Calculator</a> to do actual calculations on compound interest.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-9 space-y-8">
          
          <div className="bg-secondary text-white p-2 rounded-[1px] flex items-center justify-center gap-2 cursor-pointer text-sm font-bold shadow-sm">
            <div className="w-4 h-4 bg-white rounded-[1px] flex items-center justify-center text-blue-600 text-xs">▼</div>
            Modify the values and click the Calculate button to use
          </div>

          <div className="bg-surface-container p-4 border border-outline-variant">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center">
                <thead>
                  <tr className="text-primary/90">
                    <th className="pb-2 font-normal">Input Interest</th>
                    <th className="pb-2 font-normal">Compound</th>
                    <th className="pb-2 font-normal">Output Interest</th>
                    <th className="pb-2 font-normal">Compound</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2">
                      <div className="relative inline-block w-24">
                        <input type="number" step="0.01" value={inputInterest} onChange={(e) => setInputInterest(e.target.value)} className="w-full pr-6 pl-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary text-right" />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50">%</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <select value={inputCompound} onChange={(e) => setInputCompound(e.target.value)} className="w-36 px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary">
                        {frequencies.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                      </select>
                    </td>
                    <td className="p-2 font-bold text-lg text-primary/90 whitespace-nowrap">
                      = <span className="text-[#4caf50]">{outputInterest}</span>
                    </td>
                    <td className="p-2">
                      <select value={outputCompound} onChange={(e) => setOutputCompound(e.target.value)} className="w-36 px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary">
                        {frequencies.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
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

          {/* Related */}
          <div className="mt-8">
            <h3 className="font-bold text-primary mb-2">Related</h3>
            <div className="flex flex-wrap gap-2">
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">Interest Calculator</button>
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">Investment Calculator</button>
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">Auto Loan Calculator</button>
            </div>
          </div>

          {/* Text Content */}
          <div className="mt-12 space-y-6 text-sm text-primary/80 leading-relaxed">
            <h3 className="text-lg font-bold text-primary">What is compound interest?</h3>
            <p>Interest is the cost of using borrowed money, or more specifically, the amount a lender receives for advancing money to a borrower. When paying interest, the borrower will mostly pay a percentage of the principal (the borrowed amount). The concept of interest can be categorized into simple interest or compound interest.</p>
            <p>Simple interest refers to interest earned only on the principal, usually denoted as a specified percentage of the principal. To determine an interest payment, simply multiply principal by the interest rate and the number of periods for which the loan remains active. For example, if one person borrowed $100 from a bank at a simple interest rate of 10% per year for two years, at the end of the two years, the interest would come out to:</p>
            <p className="text-center font-mono">$100 × 10% × 2 years = $20</p>
            <p>Simple interest is rarely used in the real world. Compound interest is widely used instead. Compound interest is interest earned on both the principal and on the accumulated interest. For example, if one person borrowed $100 from a bank at a compound interest rate of 10% per year for two years, at the end of the first year, the interest would amount to:</p>
            <p className="text-center font-mono">$100 × 10% × 1 year = $10</p>
            <p>At the end of the first year, the loan's balance is principal plus interest, or $100 + $10, which equals $110. The compound interest of the second year is calculated based on the balance of $110 instead of the principal of $100. Thus, the interest of the second year would come out to:</p>
            <p className="text-center font-mono">$110 × 10% × 1 year = $11</p>
            <p>The total compound interest after 2 years is $10 + $11 = $21 versus $20 for the simple interest.</p>
            <p>Because lenders earn interest on interest, earnings compound over time like an exponentially growing snowball. Therefore, compound interest can financially reward lenders generously over time. The longer the interest compounds for any investment, the greater the growth.</p>
            <p>As a simple example, a young man at age 20 invested $1,000 into the stock market at a 10% annual return rate, the S&P 500's average rate of return since the 1920s. At the age of 65, when he retires, the fund will grow to $72,890, or approximately 73 times the initial investment!</p>
            <p>While compound interest grows wealth effectively, it can also work against debtholders. This is why one can also describe compound interest as a double-edged sword. Putting off or prolonging outstanding debt can dramatically increase the total interest owed.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Different compounding frequencies</h3>
            <p>Interest can compound on any given frequency schedule but will typically compound annually or monthly. Compounding frequencies impact the interest owed on a loan. For example, a loan with a 10% interest rate compounding semi-annually has an interest rate of 10% / 2, or 5% every half a year. For every $100 borrowed, the interest of the first half of the year comes out to:</p>
            <p className="text-center font-mono">$100 × 5% = $5</p>
            <p>For the second half of the year, the interest rises to:</p>
            <p className="text-center font-mono">($100 + $5) × 5% = $5.25</p>
            <p>The total interest is $5 + $5.25 = $10.25. Therefore, a 10% interest rate compounding semi-annually is equivalent to a 10.25% interest rate compounding annually.</p>
            <p>The interest rates of savings accounts and Certificate of Deposits (CD) tend to compound annually. Mortgage loans, home equity loans, and credit card accounts usually compound monthly. Also, an interest rate compounded more frequently tends to appear lower. For this reason, lenders often like to present interest rates compounded monthly instead of annually. For example, a 6% mortgage interest rate amounts to a monthly 0.5% interest rate. However, after compounding monthly, interest totals 6.17% compounded annually.</p>
            <p>Our compound interest calculator above accommodates the conversion between daily, bi-weekly, semi-monthly, monthly, quarterly, semi-annual, annual, and continuous (meaning an infinite number of periods) compounding frequencies.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Compound interest formulas</h3>
            <p>The calculation of compound interest can involve complicated formulas. Our calculator provides a simple solution to address that difficulty. However, those who want a deeper understanding of how the calculations work can refer to the formulas below:</p>
            
            <h4 className="font-bold text-primary mt-4">Basic compound interest</h4>
            <p>The basic formula for compound interest is as follows:</p>
            <p className="text-center font-mono">A<sub>t</sub> = A<sub>0</sub>(1 + r)<sup>n</sup></p>
            <div className="bg-surface-container p-4 rounded-[1px] border border-outline-variant font-mono text-xs">
              where:<br/>
              A<sub>0</sub> : principal amount, or initial investment<br/>
              A<sub>t</sub> : amount after time t<br/>
              r : interest rate<br/>
              n : number of compounding periods, usually expressed in years
            </div>
            <p>In the following example, a depositor opens a $1,000 savings account. It offers a 6% APY compounded once a year for the next two years. Use the equation above to find the total due at maturity:</p>
            <p className="text-center font-mono">A<sub>t</sub> = $1,000 × (1 + 6%)<sup>2</sup> = $1,123.60</p>
            <p>For other compounding frequencies (such as monthly, weekly, or daily), prospective depositors should refer to the formula below.</p>
            <p className="text-center font-mono">A<sub>t</sub> = A<sub>0</sub> × (1 + r/n)<sup>nt</sup></p>
            <div className="bg-surface-container p-4 rounded-[1px] border border-outline-variant font-mono text-xs">
              where:<br/>
              A<sub>0</sub> : principal amount, or initial investment<br/>
              A<sub>t</sub> : amount after time t<br/>
              n : number of compounding periods in a year<br/>
              r : interest rate<br/>
              t : number of years
            </div>
            <p>Assume that the $1,000 in the savings account in the previous example includes a rate of 6% interest compounded daily. This amounts to a daily interest rate of:</p>
            <p className="text-center font-mono">6% ÷ 365 = 0.0164384%</p>
            <p>Using the formula above, depositors can apply that daily interest rate to calculate the following total account value after two years:</p>
            <p className="text-center font-mono">A<sub>t</sub> = $1,000 × (1 + 0.0164384%)<sup>(365 × 2)</sup><br/>
            A<sub>t</sub> = $1,000 × 1.12749<br/>
            A<sub>t</sub> = $1,127.49</p>
            <p>Hence, if a two-year savings account containing $1,000 pays a 6% interest rate compounded daily, it will grow to $1,127.49 at the end of two years.</p>

            <h4 className="font-bold text-primary mt-4">Continuous compound interest</h4>
            <p>Continuously compounding interest represents the mathematical limit that compound interest can reach within a specified period. The continuous compound equation is represented by the equation below:</p>
            <p className="text-center font-mono">A<sub>t</sub> = A<sub>0</sub>e<sup>rt</sup></p>
            <div className="bg-surface-container p-4 rounded-[1px] border border-outline-variant font-mono text-xs">
              where:<br/>
              A<sub>0</sub> : principal amount, or initial investment<br/>
              A<sub>t</sub> : amount after time t<br/>
              r : interest rate<br/>
              t : number of years<br/>
              e : mathematical constant e, ~2.718
            </div>
            <p>For instance, we wanted to find the maximum amount of interest that we could earn on a $1,000 savings account in two years.<br/>Using the equation above:</p>
            <p className="text-center font-mono">A<sub>t</sub> = $1,000e<sup>(6% × 2)</sup><br/>
            A<sub>t</sub> = $1,000e<sup>0.12</sup><br/>
            A<sub>t</sub> = $1,127.50</p>
            <p>As shown by the examples, the shorter the compounding frequency, the higher the interest earned. However, above a specific compounding frequency, depositors only make marginal gains, particularly on smaller amounts of principal.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Rule of 72</h3>
            <p>The Rule of 72 is a shortcut to determine how long it will take for a specific amount of money to double given a fixed return rate that compounds annually. One can use it for any investment as long as it involves a fixed rate with compound interest in a reasonable range. Simply divide the number 72 by the annual rate of return to determine how many years it will take to double.</p>
            <p>For example, $100 with a fixed rate of return of 8% will take approximately nine (72 / 8) years to grow to $200. Bear in mind that "8" denotes 8%, and users should avoid converting it to decimal form. Hence, one would use "8" and not "0.08" in the calculation. Also, remember that the Rule of 72 is not an accurate calculation. Investors should use it as a quick, rough estimation.</p>

            <h3 className="text-lg font-bold text-primary mt-8">History of Compound Interest</h3>
            <p>Ancient texts provide evidence that two of the earliest civilizations in human history, the Babylonians and Sumerians, first used compound interest about 4400 years ago. However, their application of compound interest differed significantly from the methods used widely today. In their application, 20% of the principal amount was accumulated until the interest equaled the principal, and they would then add it to the principal.</p>
            <p>Historically, rulers regarded simple interest as legal in most cases. However, certain societies did not grant the same legality to compound interest, which they labeled usury. For example, Roman law condemned compound interest, and both Christian and Islamic texts described it as a sin. Nevertheless, lenders have used compound interest since medieval times, and it gained wider use with the creation of compound interest tables in the 1600s.</p>
            <p>Another factor that popularized compound interest was Euler's Constant, or "e." Mathematicians define e as the mathematical limit that compound interest can reach.</p>
            <p>Jacob Bernoulli discovered e while studying compound interest in 1683. He understood that having more compounding periods within a specified finite period led to faster growth of the principal. It did not matter whether one measured the intervals in years, months, or any other unit of measurement. Each additional period generated higher returns for the lender. Bernoulli also discerned that this sequence eventually approached a limit, e, which describes the relationship between the plateau and the interest rate when compounding.</p>
            <p>Leonhard Euler later discovered that the constant equaled approximately 2.71828 and named it e. For this reason, the constant bears Euler's name.</p>
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
