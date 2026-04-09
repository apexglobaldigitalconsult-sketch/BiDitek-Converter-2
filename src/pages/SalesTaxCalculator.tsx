import React, { useState } from 'react';

export default function SalesTaxCalculator() {
  const [beforeTax, setBeforeTax] = useState('100');
  const [taxRate, setTaxRate] = useState('6.5');
  const [afterTax, setAfterTax] = useState('');

  const handleCalculate = () => {
    const b = parseFloat(beforeTax);
    const r = parseFloat(taxRate);
    const a = parseFloat(afterTax);

    if (!isNaN(b) && !isNaN(r) && (isNaN(a) || afterTax === '')) {
      setAfterTax((b * (1 + r / 100)).toFixed(2));
    } else if (!isNaN(a) && !isNaN(r) && (isNaN(b) || beforeTax === '')) {
      setBeforeTax((a / (1 + r / 100)).toFixed(2));
    } else if (!isNaN(b) && !isNaN(a) && (isNaN(r) || taxRate === '')) {
      setTaxRate((((a / b) - 1) * 100).toFixed(3));
    } else if (!isNaN(b) && !isNaN(r) && !isNaN(a)) {
      // Default to recalculating after tax if all are filled
      setAfterTax((b * (1 + r / 100)).toFixed(2));
    }
  };

  const handleClear = () => {
    setBeforeTax('');
    setTaxRate('');
    setAfterTax('');
  };

  const stateTaxRates = [
    { state: 'Alabama', general: '4%', max: '13.50%' },
    { state: 'Alaska', general: '0%', max: '7%' },
    { state: 'Arizona', general: '5.60%', max: '10.725%' },
    { state: 'Arkansas', general: '6.50%', max: '11.625%' },
    { state: 'California', general: '7.25%', max: '10.50%' },
    { state: 'Colorado', general: '2.90%', max: '10%' },
    { state: 'Connecticut', general: '6.35%', max: '6.35%' },
    { state: 'Delaware', general: '0%', max: '0%' },
    { state: 'District of Columbia', general: '6%', max: '6%' },
    { state: 'Florida', general: '6%', max: '7.50%' },
    { state: 'Georgia', general: '4%', max: '8%' },
    { state: 'Guam', general: '4%', max: '4%' },
    { state: 'Hawaii', general: '4.166%', max: '4.712%' },
    { state: 'Idaho', general: '6%', max: '8.50%' },
    { state: 'Illinois', general: '6.25%', max: '10.25%' },
    { state: 'Indiana', general: '7%', max: '7%' },
    { state: 'Iowa', general: '6%', max: '7%' },
    { state: 'Kansas', general: '6.50%', max: '11.60%' },
    { state: 'Kentucky', general: '6%', max: '6%' },
    { state: 'Louisiana', general: '4.45%', max: '11.45%' },
    { state: 'Maine', general: '5.50%', max: '5.50%' },
    { state: 'Maryland', general: '6%', max: '6%' },
    { state: 'Massachusetts', general: '6.25%', max: '6.25%' },
    { state: 'Michigan', general: '6%', max: '6%' },
    { state: 'Minnesota', general: '6.875%', max: '7.875%' },
    { state: 'Mississippi', general: '7%', max: '7.25%' },
    { state: 'Missouri', general: '4.225%', max: '10.85%' },
    { state: 'Montana', general: '0%', max: '0%' },
    { state: 'Nebraska', general: '5.50%', max: '7.50%' },
    { state: 'Nevada', general: '6.85%', max: '8.375%' },
    { state: 'New Hampshire', general: '0%', max: '0%' },
    { state: 'New Jersey', general: '6.625%', max: '12.625%' },
    { state: 'New Mexico', general: '5.125%', max: '8.688%' },
    { state: 'New York', general: '4%', max: '8.875%' },
    { state: 'North Carolina', general: '4.75%', max: '7.50%' },
    { state: 'North Dakota', general: '5%', max: '8%' },
    { state: 'Ohio', general: '5.75%', max: '8%' },
    { state: 'Oklahoma', general: '4.50%', max: '11%' },
    { state: 'Oregon', general: '0%', max: '0%' },
    { state: 'Pennsylvania', general: '6%', max: '8%' },
    { state: 'Puerto Rico', general: '10.50%', max: '11.50%' },
    { state: 'Rhode Island', general: '7%', max: '7%' },
    { state: 'South Carolina', general: '6%', max: '9%' },
    { state: 'South Dakota', general: '4%', max: '6%' },
    { state: 'Tennessee', general: '7%', max: '9.75%' },
    { state: 'Texas', general: '6.25%', max: '8.25%' },
    { state: 'Utah', general: '6.1%', max: '8.35%' },
    { state: 'Vermont', general: '6%', max: '7%' },
    { state: 'Virginia', general: '5.30%', max: '7%' },
    { state: 'Washington', general: '6.50%', max: '10.60%' },
    { state: 'West Virginia', general: '6%', max: '7%' },
    { state: 'Wisconsin', general: '5%', max: '7.9%' },
    { state: 'Wyoming', general: '4%', max: '6%' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans">
      <div className="flex justify-between items-center text-sm text-primary/60 mb-4">
        <div>
          <a href="#" className="hover:underline">home</a> / <a href="#" className="hover:underline">financial</a> / sales tax calculator
        </div>
        <a href="#" className="text-secondary hover:underline">Print</a>
      </div>
      <h1 className="text-2xl font-bold mb-2 text-primary">Sales Tax Calculator</h1>
      <p className="text-sm text-primary/80 mb-6 leading-relaxed">
        The Sales Tax Calculator can compute any one of the following, given inputs for the remaining two: before-tax price, sale tax rate, and final, or after-tax price.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-9 space-y-8">
          
          <div className="bg-surface-container p-6 border border-outline-variant max-w-md mx-auto lg:mx-0">
            <div className="space-y-4 text-sm">
              
              <div className="flex items-center justify-between">
                <label className="text-primary/90 font-semibold w-1/2 text-right pr-4">Before Tax Price</label>
                <div className="relative w-1/2">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                  <input type="number" value={beforeTax} onChange={(e) => setBeforeTax(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-primary/90 font-semibold w-1/2 text-right pr-4">Sales Tax Rate</label>
                <div className="relative w-1/2">
                  <input type="number" step="0.01" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="w-full pr-6 pl-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/50">%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-primary/90 font-semibold w-1/2 text-right pr-4">After Tax Price</label>
                <div className="relative w-1/2">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-primary/60">$</span>
                  <input type="number" value={afterTax} onChange={(e) => setAfterTax(e.target.value)} className="w-full pl-6 pr-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low text-primary outline-none focus:border-secondary" />
                </div>
              </div>

              <div className="flex justify-center gap-2 pt-4">
                <button onClick={handleCalculate} className="bg-[#4caf50] hover:bg-[#45a049] text-white px-4 py-1.5 rounded-[1px] font-bold flex items-center gap-1 shadow-sm">
                  Calculate <span className="text-xs bg-white text-[#4caf50] rounded-[1px] w-4 h-4 flex items-center justify-center">▶</span>
                </button>
                <button onClick={handleClear} className="bg-[#9e9e9e] hover:bg-[#8e8e8e] text-white px-4 py-1.5 rounded-[1px] font-bold shadow-sm">
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Related */}
          <div className="mt-8">
            <h3 className="font-bold text-primary mb-2">Related</h3>
            <div className="flex flex-wrap gap-2">
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">VAT Calculator</button>
            </div>
          </div>

          {/* Text Content */}
          <div className="mt-12 space-y-6 text-sm text-primary/80 leading-relaxed">
            <h3 className="text-lg font-bold text-primary">What is Sales Tax?</h3>
            <p>A sales tax is a consumption tax paid to a government on the sale of certain goods and services. Usually, the vendor collects the sales tax from the consumer as the consumer makes a purchase. In most countries, the sales tax is called value-added tax (VAT) or goods and services tax (GST), which is a different form of consumption tax. In some countries, the listed prices for goods and services are the before-tax value, and a sales tax is only applied during the purchase. In other countries, the listed prices are the final after-tax values, which include the sales tax.</p>

            <h3 className="text-lg font-bold text-primary mt-8">U.S. Sales Tax</h3>
            <p>In the United States, sales tax at the federal level does not exist. At the state level, all (including District of Columbia, Puerto Rico, and Guam) but five states do not have statewide sales tax. These are Alaska, Delaware, Montana, New Hampshire, and Oregon. States that impose a sales tax have different rates, and even within states, local or city sales taxes can come into play. Unlike VAT (which is not imposed in the U.S.), sales tax is only enforced on retail purchases; most transactions of goods or services between businesses are not subject to sales tax.</p>
            <p>The sales tax rate ranges from 0% to 16% depending on the state and the type of good or service, and all states differ in their enforcement of sales tax. In Texas, prescription medicine and food seeds are exempt from taxation. Vermont has a 6% general sales tax, but an additional 10% tax is added to purchases of alcoholic drinks that are immediately consumed. These are only several examples of differences in taxation in different jurisdictions. Rules and regulations regarding sales tax vary widely from state to state.</p>
            <p>On average, the impact of sales tax on Americans is about 2 percent of their personal income. Sales tax provides nearly one-third of state government revenue and is second only to the income tax in terms of importance as a source of revenue. Reliance on the sales tax varies widely by state. Sales taxes are much more important in the south and west than they are in New England and the industrial Midwest. Florida, Washington, Tennessee, and Texas all generate more than 50 percent of their tax revenue from the sales tax, and several of these states raise nearly 60 percent of their tax revenue from the sales tax. New York, on the other hand, only raises about 20 percent of its revenues from the sales tax.</p>
            <p>The following is an overview of the sales tax rates for different states.</p>

            <div className="overflow-x-auto my-6">
              <table className="w-full max-w-2xl text-sm text-left border border-outline-variant">
                <thead>
                  <tr className="bg-secondary text-white">
                    <th className="p-2 font-bold border-r border-outline-variant">State</th>
                    <th className="p-2 font-bold border-r border-outline-variant">General State Sales Tax</th>
                    <th className="p-2 font-bold">Max Tax Rate with Local/City Sale Tax</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {stateTaxRates.map((row, idx) => (
                    <tr key={row.state} className={idx % 2 === 0 ? 'bg-surface-container' : 'bg-surface-container-low'}>
                      <td className="p-2 border-r border-outline-variant">{row.state}</td>
                      <td className="p-2 border-r border-outline-variant">{row.general}</td>
                      <td className="p-2">{row.max}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-bold text-primary mt-8">U.S. History of Sales Tax</h3>
            <p>When the U.S. was still a British colony in the 18th century, the English King imposed a sales tax on various items on the American colonists, even though they had no representation in the British government. This taxation without representation, among other things, resulted in the Boston Tea Party. This, together with other events, led to the American Revolution. Therefore, the birth of the U.S. had partly to do with the controversy over a sales tax! Since then, sales tax has had a rocky history in the U.S. and this is perhaps why there has never been a federal sales tax. Some of the earlier attempts at sales tax raised a lot of problems. Sales tax didn't take off until the Great Depression, when state governments were having difficulty finding ways to raise revenue successfully. Of the many different methods tested, sales tax prevailed because economic policy in the 1930s centered around selling goods. Mississippi was the first in 1930, and it quickly was adopted across the nation. Today, sales tax is imposed in most states as a necessary and generally effective means to raise revenue for state and local governments.</p>

            <h3 className="text-lg font-bold text-primary mt-8">How to Deduct Sales Tax in the U.S.?</h3>
            <p>When filing federal income tax, taxpayers need to choose to either take the standard deduction or itemize deductions. This decision will be different for everyone, but most Americans choose the standard deduction. Sales tax can be deducted from federal income tax only if deductions are itemized. In general, taxpayers with sales tax as their only deductible expense may find that itemizing deductions is not worth the time. Itemizing deductions also involves meticulous record-keeping and can be tedious work because the IRS requires the submission of sales tax records, such as a year's worth of purchase receipts. Anyone who plans to itemize should be keeping detailed records, as it will be very helpful in determining the amount of sales tax paid.</p>
            <p>After the choice between standard or itemized deductions has been made, taxpayers have to make another decision regarding whether or not to claim either state and local income taxes or sales taxes (but not both). Most taxpayers choose to deduct income taxes as it typically results in a larger figure. With that said, it may be better for taxpayers who made large purchases during the year to deduct sales tax instead of income tax if their total sales tax payments exceed state income tax. Taxpayers who paid for a new car, wedding, engagement ring, vacation, or multiple major appliances during a tax year can potentially have a greater sales tax payment than income tax payment. In reality, less than 2% of Americans claim sales tax as a deduction each year.</p>
            <p>For more information about or to do calculations involving income tax, please visit the <a href="#" className="text-secondary hover:underline">Income Tax Calculator</a>.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Value-Added Tax (VAT)</h3>
            <p>VAT is the version of sales tax commonly used outside of the U.S. in over 160 countries. VAT is an indirect tax that is imposed at different stages of the production of goods and services, whenever value is added. Countries that impose a VAT can also impose it on imported and exported goods. All participants in a supply chain, such as wholesalers, distributors, suppliers, manufacturers, and retailers, will usually need to pay VAT, not just the end consumer, as is done with U.S. sales tax. VAT can be calculated as the sales price minus the costs of materials or parts used that have been taxed already.</p>
            <p>A 1979 study published by the Tax Foundation offered some insight into arguments for or against VAT as compared to sales tax. Perhaps the greatest benefit of taxation via VAT is that because taxation applies at every step of the chain of production of a good, tax evasion becomes difficult. Also, there are stronger incentives to control costs when all participants involved in a supply chain are taxed. Compared to sales tax, VAT has the ability to raise more revenue at a given rate. On the other hand, VAT tends to be regressive; that is, it takes proportionately greater amounts from those with lower incomes. Also, the cascading tax is harmful to new and marginal business activities, likely to set off inflationary tendencies, and is detrimental to exports. For more information about or to do calculations involving VAT, please visit the <a href="#" className="text-secondary hover:underline">VAT Calculator</a>.</p>

            <h4 className="font-bold text-primary mt-4">Goods and Services Tax (GST)</h4>
            <p>The Goods and Services Tax (GST) is similar to VAT. It is an indirect sales tax applied to certain goods and services at multiple instances in a supply chain. Taxations across multiple countries that impose either a "GST" or "VAT" are so vastly different that neither word can properly define them. The countries that define their "sales tax" as a GST are Spain, Greece, India, Canada, Singapore, and Malaysia.</p>
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
