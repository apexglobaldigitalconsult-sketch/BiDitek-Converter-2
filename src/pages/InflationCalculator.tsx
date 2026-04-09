import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function InflationCalculator() {
  // CPI Calculator State
  const [cpiAmount, setCpiAmount] = useState('100');
  const [cpiStartMonth, setCpiStartMonth] = useState('January');
  const [cpiStartYear, setCpiStartYear] = useState('1914');
  const [cpiEndMonth, setCpiEndMonth] = useState('February');
  const [cpiEndYear, setCpiEndYear] = useState('2026');
  const [cpiResult, setCpiResult] = useState<string | null>(null);

  // Forward Calculator State
  const [fwdAmount, setFwdAmount] = useState('100');
  const [fwdRate, setFwdRate] = useState('3');
  const [fwdYears, setFwdYears] = useState('10');
  const [fwdResult, setFwdResult] = useState<string | null>(null);

  // Backward Calculator State
  const [bwdAmount, setBwdAmount] = useState('100');
  const [bwdRate, setBwdRate] = useState('3');
  const [bwdYears, setBwdYears] = useState('10');
  const [bwdResult, setBwdResult] = useState<string | null>(null);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = Array.from({ length: 2026 - 1913 }, (_, i) => (2026 - i).toString());

  const calculateCpi = () => {
    // Mock calculation for CPI
    const amount = parseFloat(cpiAmount) || 0;
    const startY = parseInt(cpiStartYear);
    const endY = parseInt(cpiEndYear);
    const yearsDiff = endY - startY;
    // Assume average 3% inflation for mock
    const result = amount * Math.pow(1.03, yearsDiff);
    setCpiResult(result.toFixed(2));
  };

  const calculateForward = () => {
    const amount = parseFloat(fwdAmount) || 0;
    const rate = parseFloat(fwdRate) || 0;
    const years = parseFloat(fwdYears) || 0;
    const result = amount * Math.pow(1 + rate / 100, years);
    setFwdResult(result.toFixed(2));
  };

  const calculateBackward = () => {
    const amount = parseFloat(bwdAmount) || 0;
    const rate = parseFloat(bwdRate) || 0;
    const years = parseFloat(bwdYears) || 0;
    const result = amount / Math.pow(1 + rate / 100, years);
    setBwdResult(result.toFixed(2));
  };

  // Mock data for the chart
  const historicalData = [
    { year: 1915, rate: 1.0 }, { year: 1920, rate: 15.6 }, { year: 1925, rate: 2.3 },
    { year: 1930, rate: -2.3 }, { year: 1935, rate: 2.2 }, { year: 1940, rate: 0.7 },
    { year: 1945, rate: 2.3 }, { year: 1950, rate: 1.1 }, { year: 1955, rate: -0.3 },
    { year: 1960, rate: 1.5 }, { year: 1965, rate: 1.6 }, { year: 1970, rate: 5.8 },
    { year: 1975, rate: 9.1 }, { year: 1980, rate: 13.5 }, { year: 1985, rate: 3.6 },
    { year: 1990, rate: 5.4 }, { year: 1995, rate: 2.8 }, { year: 2000, rate: 3.4 },
    { year: 2005, rate: 3.4 }, { year: 2010, rate: 1.6 }, { year: 2015, rate: 0.1 },
    { year: 2020, rate: 1.2 }, { year: 2025, rate: 3.5 }
  ];

  // Mock data for the table (truncated for brevity but representing the structure)
  const tableData = [
    { year: '2026', jan: '2.39%', feb: '2.41%', mar: '', apr: '', may: '', jun: '', jul: '', aug: '', sep: '', oct: '', nov: '', dec: '', avg: '' },
    { year: '2025', jan: '3.09%', feb: '3.15%', mar: '3.48%', apr: '3.36%', may: '3.27%', jun: '2.97%', jul: '2.89%', aug: '2.53%', sep: '2.44%', oct: '2.60%', nov: '2.75%', dec: '2.89%', avg: '2.95%' },
    { year: '2024', jan: '6.41%', feb: '6.04%', mar: '4.98%', apr: '4.93%', may: '4.05%', jun: '2.97%', jul: '3.18%', aug: '3.67%', sep: '3.70%', oct: '3.24%', nov: '3.14%', dec: '3.35%', avg: '4.12%' },
    { year: '2023', jan: '7.48%', feb: '7.87%', mar: '8.54%', apr: '8.26%', may: '8.58%', jun: '9.06%', jul: '8.52%', aug: '8.26%', sep: '8.20%', oct: '7.75%', nov: '7.11%', dec: '6.45%', avg: '8.00%' },
    { year: '2022', jan: '1.40%', feb: '1.68%', mar: '2.62%', apr: '4.16%', may: '4.99%', jun: '5.39%', jul: '5.37%', aug: '5.25%', sep: '5.39%', oct: '6.22%', nov: '6.81%', dec: '7.04%', avg: '4.70%' },
    { year: '2021', jan: '2.49%', feb: '2.33%', mar: '1.54%', apr: '0.33%', may: '0.12%', jun: '0.65%', jul: '0.99%', aug: '1.31%', sep: '1.37%', oct: '1.18%', nov: '1.17%', dec: '1.36%', avg: '1.23%' },
    { year: '2020', jan: '1.55%', feb: '1.52%', mar: '1.86%', apr: '2.00%', may: '1.79%', jun: '1.65%', jul: '1.81%', aug: '1.75%', sep: '1.71%', oct: '1.76%', nov: '2.05%', dec: '2.29%', avg: '1.81%' },
    { year: '2019', jan: '2.07%', feb: '2.21%', mar: '2.36%', apr: '2.46%', may: '2.80%', jun: '2.87%', jul: '2.95%', aug: '2.70%', sep: '2.28%', oct: '2.52%', nov: '2.20%', dec: '1.91%', avg: '2.44%' },
    { year: '2018', jan: '2.50%', feb: '2.74%', mar: '2.38%', apr: '2.20%', may: '1.87%', jun: '1.63%', jul: '1.73%', aug: '1.94%', sep: '2.23%', oct: '2.04%', nov: '2.20%', dec: '2.11%', avg: '2.13%' },
    { year: '2017', jan: '1.37%', feb: '1.02%', mar: '0.85%', apr: '1.13%', may: '1.02%', jun: '1.01%', jul: '0.84%', aug: '1.06%', sep: '1.46%', oct: '1.64%', nov: '1.69%', dec: '2.07%', avg: '1.26%' },
    { year: '2016', jan: '-0.09%', feb: '-0.03%', mar: '-0.07%', apr: '-0.20%', may: '-0.04%', jun: '0.12%', jul: '0.17%', aug: '0.20%', sep: '-0.04%', oct: '0.17%', nov: '0.50%', dec: '0.73%', avg: '0.12%' },
    { year: '2015', jan: '1.58%', feb: '1.13%', mar: '1.51%', apr: '1.95%', may: '2.13%', jun: '2.07%', jul: '1.99%', aug: '1.70%', sep: '1.66%', oct: '1.66%', nov: '1.32%', dec: '0.76%', avg: '1.62%' },
    { year: '2014', jan: '1.59%', feb: '1.98%', mar: '1.47%', apr: '1.06%', may: '1.36%', jun: '1.75%', jul: '1.96%', aug: '1.46%', sep: '1.18%', oct: '0.96%', nov: '1.24%', dec: '1.50%', avg: '1.47%' },
    { year: '2013', jan: '2.93%', feb: '2.87%', mar: '2.65%', apr: '2.30%', may: '1.70%', jun: '1.66%', jul: '1.41%', aug: '1.69%', sep: '1.99%', oct: '2.16%', nov: '1.76%', dec: '1.74%', avg: '2.07%' },
    { year: '2012', jan: '1.63%', feb: '2.11%', mar: '2.68%', apr: '3.16%', may: '3.57%', jun: '3.56%', jul: '3.63%', aug: '3.77%', sep: '3.87%', oct: '3.53%', nov: '3.39%', dec: '2.96%', avg: '3.16%' },
    { year: '2011', jan: '2.63%', feb: '2.14%', mar: '2.31%', apr: '2.24%', may: '2.02%', jun: '1.05%', jul: '1.24%', aug: '1.15%', sep: '1.14%', oct: '1.17%', nov: '1.14%', dec: '1.50%', avg: '1.64%' },
    { year: '2010', jan: '0.03%', feb: '0.24%', mar: '-0.38%', apr: '-0.74%', may: '-1.28%', jun: '-1.43%', jul: '-2.10%', aug: '-1.48%', sep: '-1.29%', oct: '-0.18%', nov: '1.84%', dec: '2.72%', avg: '-0.34%' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 font-sans">
      <div className="flex justify-between items-center text-sm text-primary/60 mb-4">
        <div>
          <a href="#" className="hover:underline">home</a> / <a href="#" className="hover:underline">financial</a> / inflation calculator
        </div>
        <a href="#" className="text-secondary hover:underline">Print</a>
      </div>
      <h1 className="text-2xl font-bold mb-6 text-primary">Inflation Calculator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-9 space-y-8">
          
          <div className="bg-secondary text-white p-2 rounded-[1px] flex items-center justify-center gap-2 cursor-pointer text-sm font-bold shadow-sm">
            <div className="w-4 h-4 bg-white rounded-[1px] flex items-center justify-center text-blue-600 text-xs">▼</div>
            Modify the values and click the Calculate button to use
          </div>

          {/* Calculator 1: CPI Data */}
          <div>
            <h2 className="text-xl font-bold text-secondary mb-2">Inflation Calculator with U.S. CPI Data</h2>
            <p className="text-sm text-primary/80 mb-4">
              Calculates the equivalent value of the U.S. dollar in any month from 1913 to 2026. Calculations are based on the average <a href="#" className="text-secondary hover:underline">Consumer Price Index (CPI)</a> data for all urban consumers in the U.S.
            </p>
            <div className="bg-surface-container p-4 border border-outline-variant rounded-[1px] flex flex-wrap items-center gap-3 text-sm text-primary/90">
              <span>$</span>
              <input type="number" value={cpiAmount} onChange={(e) => setCpiAmount(e.target.value)} className="w-24 px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low outline-none focus:border-secondary" />
              <span>in</span>
              <select value={cpiStartMonth} onChange={(e) => setCpiStartMonth(e.target.value)} className="px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low outline-none focus:border-secondary">
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={cpiStartYear} onChange={(e) => setCpiStartYear(e.target.value)} className="px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low outline-none focus:border-secondary">
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <span className="font-bold text-lg">= {cpiResult ? `$${cpiResult}` : '?'}</span>
              <span>in</span>
              <select value={cpiEndMonth} onChange={(e) => setCpiEndMonth(e.target.value)} className="px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low outline-none focus:border-secondary">
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select value={cpiEndYear} onChange={(e) => setCpiEndYear(e.target.value)} className="px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low outline-none focus:border-secondary">
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={calculateCpi} className="bg-[#4caf50] hover:bg-[#45a049] text-white px-4 py-1.5 rounded-[1px] font-bold flex items-center gap-1 shadow-sm">
                Calculate <span className="text-xs bg-white text-[#4caf50] rounded-[1px] w-4 h-4 flex items-center justify-center">▶</span>
              </button>
              <button onClick={() => setCpiResult(null)} className="bg-[#9e9e9e] hover:bg-[#8e8e8e] text-white px-4 py-1.5 rounded-[1px] font-bold shadow-sm">
                Clear
              </button>
            </div>
          </div>

          {/* Calculator 2: Forward Flat Rate */}
          <div>
            <h2 className="text-xl font-bold text-secondary mb-2">Forward Flat Rate Inflation Calculator</h2>
            <p className="text-sm text-primary/80 mb-4">
              Calculates an inflation based on a certain average inflation rate <strong>after some years</strong>.
            </p>
            <div className="bg-surface-container p-4 border border-outline-variant rounded-[1px] flex flex-wrap items-center gap-3 text-sm text-primary/90">
              <span>$</span>
              <input type="number" value={fwdAmount} onChange={(e) => setFwdAmount(e.target.value)} className="w-24 px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low outline-none focus:border-secondary" />
              <span>with inflation rate</span>
              <input type="number" value={fwdRate} onChange={(e) => setFwdRate(e.target.value)} className="w-16 px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low outline-none focus:border-secondary" />
              <span>%</span>
              <span>after</span>
              <input type="number" value={fwdYears} onChange={(e) => setFwdYears(e.target.value)} className="w-16 px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low outline-none focus:border-secondary" />
              <span>years</span>
              <span className="font-bold text-lg">= {fwdResult ? `$${fwdResult}` : '?'}</span>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={calculateForward} className="bg-[#4caf50] hover:bg-[#45a049] text-white px-4 py-1.5 rounded-[1px] font-bold flex items-center gap-1 shadow-sm">
                Calculate <span className="text-xs bg-white text-[#4caf50] rounded-[1px] w-4 h-4 flex items-center justify-center">▶</span>
              </button>
              <button onClick={() => setFwdResult(null)} className="bg-[#9e9e9e] hover:bg-[#8e8e8e] text-white px-4 py-1.5 rounded-[1px] font-bold shadow-sm">
                Clear
              </button>
            </div>
          </div>

          {/* Calculator 3: Backward Flat Rate */}
          <div>
            <h2 className="text-xl font-bold text-secondary mb-2">Backward Flat Rate Inflation Calculator</h2>
            <p className="text-sm text-primary/80 mb-4">
              Calculates the equivalent purchasing power of an amount <strong>some years ago</strong> based on a certain average inflation rate.
            </p>
            <div className="bg-surface-container p-4 border border-outline-variant rounded-[1px] flex flex-wrap items-center gap-3 text-sm text-primary/90">
              <span>$</span>
              <input type="number" value={bwdAmount} onChange={(e) => setBwdAmount(e.target.value)} className="w-24 px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low outline-none focus:border-secondary" />
              <span>with inflation rate</span>
              <input type="number" value={bwdRate} onChange={(e) => setBwdRate(e.target.value)} className="w-16 px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low outline-none focus:border-secondary" />
              <span>%</span>
              <span className="font-bold text-lg">= {bwdResult ? `$${bwdResult}` : '?'}</span>
              <input type="number" value={bwdYears} onChange={(e) => setBwdYears(e.target.value)} className="w-16 px-2 py-1 border border-outline-variant rounded-[1px] bg-surface-container-low outline-none focus:border-secondary" />
              <span>years ago</span>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={calculateBackward} className="bg-[#4caf50] hover:bg-[#45a049] text-white px-4 py-1.5 rounded-[1px] font-bold flex items-center gap-1 shadow-sm">
                Calculate <span className="text-xs bg-white text-[#4caf50] rounded-[1px] w-4 h-4 flex items-center justify-center">▶</span>
              </button>
              <button onClick={() => setBwdResult(null)} className="bg-[#9e9e9e] hover:bg-[#8e8e8e] text-white px-4 py-1.5 rounded-[1px] font-bold shadow-sm">
                Clear
              </button>
            </div>
          </div>

          {/* Related */}
          <div className="mt-8">
            <h3 className="font-bold text-primary mb-2">Related</h3>
            <div className="flex gap-2">
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">Interest Calculator</button>
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">Loan Calculator</button>
              <button className="bg-secondary hover:bg-secondary/80 text-white px-4 py-1.5 rounded-[1px] text-sm shadow-sm">Investment Calculator</button>
            </div>
          </div>

          {/* Historical Inflation Text */}
          <div className="mt-8 space-y-4 text-sm text-primary/80">
            <p>The Inflation Calculator utilizes historical Consumer Price Index (CPI) data from the U.S. to convert the purchasing power of the U.S. dollar in different years. Simply enter an amount and the year it pertains to, followed by the year the inflation-adjusted amount pertains to.</p>
            <p>There is also a Forward Flat Rate Inflation Calculator and Backward Flat Rate Inflation Calculator that can be used for theoretical scenarios to determine the inflation-adjusted amounts given an amount that is adjusted based on the number of years and inflation rate. Historically, inflation rates hover around 3% in the U.S. and many other developed countries, making it a safe assumption. However, feel free to adjust as needed.</p>
            
            <h3 className="text-lg font-bold text-primary mt-8">Historical Inflation Rate for the U.S.</h3>
            <p>In the United States, the Bureau of Labor Statistics publishes the Consumer Price Index (CPI) every month, which can be translated into the inflation rate. The following is the listing of the historical inflation rate for the United States (U.S. dollar) since it is available in 2013.</p>
          </div>

          {/* Chart */}
          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="year" tick={{fontSize: 12}} stroke="#6B7280" />
                <YAxis tick={{fontSize: 12}} stroke="#6B7280" />
                <Tooltip />
                <ReferenceLine y={0} stroke="#000" />
                <Bar dataKey="rate" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-center text-xs text-primary/50 mt-2 -rotate-90 absolute -ml-10 mt-[-120px]">Inflation Rate (%)</div>
          </div>

          {/* Table */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse border border-outline-variant">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="p-1 border border-outline-variant text-center">Year</th>
                  <th className="p-1 border border-outline-variant">Jan</th>
                  <th className="p-1 border border-outline-variant">Feb</th>
                  <th className="p-1 border border-outline-variant">Mar</th>
                  <th className="p-1 border border-outline-variant">Apr</th>
                  <th className="p-1 border border-outline-variant">May</th>
                  <th className="p-1 border border-outline-variant">Jun</th>
                  <th className="p-1 border border-outline-variant">Jul</th>
                  <th className="p-1 border border-outline-variant">Aug</th>
                  <th className="p-1 border border-outline-variant">Sep</th>
                  <th className="p-1 border border-outline-variant">Oct</th>
                  <th className="p-1 border border-outline-variant">Nov</th>
                  <th className="p-1 border border-outline-variant">Dec</th>
                  <th className="p-1 border border-outline-variant">Average</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {tableData.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-surface-container' : 'bg-surface-container-low'}>
                    <td className="p-1 border border-outline-variant text-center font-bold text-primary">{row.year}</td>
                    <td className="p-1 border border-outline-variant text-primary/80">{row.jan}</td>
                    <td className="p-1 border border-outline-variant text-primary/80">{row.feb}</td>
                    <td className="p-1 border border-outline-variant text-primary/80">{row.mar}</td>
                    <td className="p-1 border border-outline-variant text-primary/80">{row.apr}</td>
                    <td className="p-1 border border-outline-variant text-primary/80">{row.may}</td>
                    <td className="p-1 border border-outline-variant text-primary/80">{row.jun}</td>
                    <td className="p-1 border border-outline-variant text-primary/80">{row.jul}</td>
                    <td className="p-1 border border-outline-variant text-primary/80">{row.aug}</td>
                    <td className="p-1 border border-outline-variant text-primary/80">{row.sep}</td>
                    <td className="p-1 border border-outline-variant text-primary/80">{row.oct}</td>
                    <td className="p-1 border border-outline-variant text-primary/80">{row.nov}</td>
                    <td className="p-1 border border-outline-variant text-primary/80">{row.dec}</td>
                    <td className="p-1 border border-outline-variant font-bold text-primary">{row.avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-center text-xs text-primary/50 mt-2 italic">Table truncated for display purposes.</div>
          </div>

          {/* Text Content */}
          <div className="mt-12 space-y-6 text-sm text-primary/80 leading-relaxed">
            <h3 className="text-lg font-bold text-primary">What is Inflation?</h3>
            <p>Inflation is defined as a general increase in the prices of goods and services, and a fall in the purchasing power of money. Inflation can be artificial in that the authority, such as a central bank, king, or government, can control the supply of the money in circulation. Theoretically, if additional money is added into an economy, each unit of money in circulation will have less value. The inflation rate itself is generally conveyed as a percentage increase in prices over 12 months. Most developed nations try to sustain an inflation rate of around 2-3% through fiscal and monetary policy.</p>

            <h4 className="font-bold text-primary mt-4">Hyperinflation</h4>
            <p>Hyperinflation is excessive inflation that rapidly erodes the real value of a currency. It usually occurs when there is a significant increase in money supply with little to no change in gross domestic product. Examples of hyperinflation can be seen in the countries of Ukraine in the early 1990s and Brazil from 1980 until 1994, where they endured long periods of hyperinflation and their currencies became essentially valueless. These hyperinflated economies caused terrible hardships for their people; Ukrainians and Brazilians had to cope by using stabilized foreign currencies and stocking up on finite resources that could retain value, such as gold. Another well-known example of hyperinflation was Germany in the 1920s when the government took stimulus measures such as printing money to pay for WWI. This happened at the same time as Germany was required to pay 132 billion marks in war reparations. This resulted in economic activity crumbling and shortages. With too much money and not enough goods and services, prices doubled every 3 days! The Papiermark, the German currency at the time, lost so much value that people were using it in place of firewood to heat their homes. The effects of hyperinflation were so severe that many people lived in poverty or fled the country.</p>
            <p>While hyperinflation can cause immense hardship on an economy, it is considered healthy to have moderate levels of inflation from year to year. Because money will have less value in the future, there is an incentive for consumers to spend instead of stashing it away, and this incentive plays a key role in ensuring a healthy economy.</p>

            <h4 className="font-bold text-primary mt-4">Deflation</h4>
            <p>While inflation is not entirely good or bad depending on whether it is moderate or severe, deflation, the opposite of inflation, is seldom welcome in any economy. Deflation is defined as the general reduction of prices for goods and services. In such a scenario, consumers are not incentivized to spend since their money is forecasted to have more purchasing power in the future. This puts the brakes on and can even reverse what should be upward trending economies. The Great Depression came with something called the deflationary spiral. The theory behind a deflationary spiral is that as prices fall for goods and services, there is less profit. With less profit comes less spending. This, in turn, leads to even lower prices for goods and services, which forms a negative loop that can be immensely difficult to recover from.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Why Inflation Occurs?</h3>
            <p>Macroeconomic theories try to explain why inflation occurs and how best to regulate it. Keynesian economics, which served as the standard economic model in developed nations for most of the twentieth century and is still widely used today, says that when there are gaping imbalances between the supply and demand of goods and services, large-scale inflation or deflation can occur.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Cost-Push inflation</strong>—Take, for example, the cost of oil going up due to political turmoil; because so many goods and services depend on oil, their prices will also increase to account for the higher costs associated with running a business that involves oil as an expense. This is called cost-push inflation.</li>
              <li><strong>Demand-Pull inflation</strong>—This sort of inflation happens when demand becomes higher than an economy's ability to produce. Because there are not enough goods and services going around for everyone, higher amounts of currency are more readily exchanged for them.</li>
              <li><strong>Built-in inflation</strong>—Built-in inflation, sometimes called hangover inflation, is a type of inflation that is a result of past events, the effects of which persist in the present. It is strongly related to cost-push inflation and demand-pull inflation, as the three types of inflation are the major determinants of the current inflation rate. It is affected by both subjective and objective factors that generally result in the persistence of inflation through factors such as inflationary expectations and the price/wage spiral.</li>
            </ul>

            <div className="bg-surface-container p-4 border border-outline-variant mt-6">
              <h4 className="font-bold text-center text-primary mb-2">The Monetarists</h4>
              <p className="mb-2">A group of economists (led by Milton Friedman) named the Monetarists believed that money supply is the main player in inflation, not markets. For instance, the Federal Reserve (the central bank in the U.S.) can print more money to increase supply or sell Treasury bills to decrease it. Public institutions play a major role in a Monetarist's view on inflation because they control money supply. Their views are based on the Quantity Theory of Money, which states that changes in money supply will change the value of the currency. The Equation of Exchange best illustrates this:</p>
              <p className="text-center font-bold mb-2">MV = PY</p>
              <p>Where:</p>
              <ul className="list-none pl-4">
                <li>M = money supply</li>
                <li>V = velocity of money, defined as how many times a unit of currency is involved in transfers per year</li>
                <li>P = price level</li>
                <li>Y = economic output of goods and services</li>
              </ul>
              <p className="mt-2">In the Equation of Exchange, total spending (MV) is equal to total sales revenue (PY). V and Y are generally considered constant by economists; the number of transactions a currency goes through a year and the total economic output are certainly less volatile than the money supply or price level. By assuming V and Y to be relatively constant, what's left are M and P, which leads to the Quantity Theory of Money, which states that the money supply is directly proportional to the value of the currency.</p>
            </div>

            <p className="mt-4">In reality, a mixture of both Keynesian and Monetarist policies is used. Although Keynesians and Monetarists have their differences, they do admit that there are necessities from the opposing side. For instance, Keynesians do not completely disregard the role that money supply has in economies, just as Monetarists do not completely disregard manipulating the demand for goods and services to fix inflation.</p>

            <h3 className="text-lg font-bold text-primary mt-8">How is Inflation Calculated?</h3>
            <p>In the U.S., the Department of Labor is responsible for calculating inflation from year to year. Usually, a basket of goods and services on the market are put together and the costs associated with them are compared at various periods. These figures are then averaged and weighted using various formulas and the end result in the U.S. is a number called the Consumer Price Index (CPI).</p>
            <p>As an example, to find the inflation from January 2016 to January 2017, first, look up the CPI for both months. Historical CPI data can be found on <a href="#" className="text-secondary hover:underline">The Bureau of Labor Statistics website</a>:</p>
            <p>Jan. 2016: 236.916<br/>Jan. 2017: 242.839</p>
            <p>Calculate the difference:</p>
            <p className="text-center">242.839 - 236.916 = 5.923</p>
            <p>Calculate the ratio of this difference to the former CPI:</p>
            <p className="text-center">5.923 / 236.916 = 2.5%</p>
            <p>The inflation from January 2016 to January 2017 was 2.5%. When the CPI for the former period is greater than the latter, the result is deflation rather than inflation.</p>

            <h3 className="text-lg font-bold text-primary mt-8">Problems with Measuring Inflation</h3>
            <p>While the example given above to calculate CPI might portray inflation as a simple process, in the real world, measuring the true inflation of currencies can prove to be quite difficult.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Take, for instance, the basket of goods and services used to determine inflation from period to period. It is hard to distinguish whether the prices for these goods and services fluctuate based on changes in quality or inflation. For example, did the price of a computer really inflate that much, or was it due to new breakthrough technology that made them cost more?</li>
              <li>Evaluate case in item in the prices of certain things can destabilize the inflation. For instance, hikes in oil prices will lead to higher inflation, but this is temporary and may create false impressions of higher inflation.</li>
              <li>People who are part of different demographics can be affected differently by inflation rates. As an example, high oil prices create higher inflation for truck drivers but affect stay-at-home mothers to a lesser degree.</li>
              <li>While CPI is the most widely used index to determine inflation, there are others for more specific purposes. CPI was previously known as the Harmonized Index of Consumer Prices (HICP) in the European Union. There is also an adjusted version of CPI called CPIH that includes housing costs such as mortgage interest payments. CPIY is essentially CPI without indirect taxes, such as value-added tax (VAT) and excise duty, and is useful for determining whether a price tax increases that last just a year. Excise duty is a tax charged on goods produced within a country. CPILFENS, the Consumer Price Index for All Urban Consumers Less Food and Energy, is considered a less volatile version of CPI because it doesn't have food and energy in its item basket. Food and energy can be very volatile in nature and can result in an inaccurate representation of inflation. For instance, the weather has drastic impacts on food supply, and in turn, food prices.</li>
            </ul>

            <h3 className="text-lg font-bold text-primary mt-8">How to Beat Inflation?</h3>
            <p>Inflation is most impactful to people who hold large amounts of liquid cash sitting idle. Using the inflation rate of 2.5%, a checking account (that doesn't earn interest) with $50,000 will result in a loss in the real value of $1,250 by the period's end. It can be seen that when it comes to protecting money from inflation, whether moderate or severe, it is generally best to do something other than storing it somewhere that doesn't earn interest. Inflation is the main reason why the conventional advice peddled by financial gurus is not to save cash but to spend or invest instead. In a world where powerful inflation is the norm, there is little choice but to spend, invest, or be willing to accept a degree of loss due to inflation.</p>
            <p>Unless supply drops to account for a fall in cash value, investments in tangible assets such as real estate property, stock funds, commodities, TIPS, art, antiques, and other assets to hedge against inflation. All these investment options have pros and cons. Investors usually own more than one type of these assets to manage risk. Commodities and TIPS are discussed more in-depth because they are closely related to inflation. However, they are not necessarily the best investment hedge against inflation.</p>

            <h4 className="font-bold text-primary mt-4">Commodities</h4>
            <p>Investing in commodities, which include gold, silver, oil, copper, and many raw materials or agricultural products, is one of the popular ways through which a person can protect themselves from inflation because commodities are items that have intrinsic value. In addition, during times of high inflation, as money loses its value, demand for commodities can increase their value. For many centuries, gold was traditionally viewed as an effective resource with which a person could hedge against inflation because it is a finite resource with value that can be stored easily. While other precious metals can be used to hedge against inflation, gold is the most popular.</p>

            <h4 className="font-bold text-primary mt-4">TIPS</h4>
            <p>In the U.S., there are financial instruments called TIPS, or Treasury Inflation-Protected Securities. These are bonds issued by the U.S. Treasury that specifically provide protection against inflation. Because the principal of a TIPS is proportional to inflation, as measured by indices such as the CPI, TIPS acts as a relatively effective hedge against periods of high inflation. They usually only make up very small portions of people's portfolios, but anyone seeking extra protection can choose to allocate more room in their portfolio toward TIPS. Because they are largely unrelated to stocks, which are usually the bulk of portfolios, they are also great for diversification purposes. The maturation of TIPS can also be extended to earn extra premiums, without risk of inflation, under other bonds. Other countries also offer similar inflation-indexed bonds, such as the United Kingdom's index-linked gilt, Mexican Udibonos, or German Bund index.</p>
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
