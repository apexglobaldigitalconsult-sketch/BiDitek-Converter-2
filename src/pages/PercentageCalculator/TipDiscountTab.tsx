import React, { useState } from 'react';
import ResultDisplay from './ResultDisplay';

export default function TipDiscountTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <TipCalculator />
      <DiscountCalculator />
    </div>
  );
}

function TipCalculator() {
  const [bill, setBill] = useState('');
  const [tip, setTip] = useState('');
  const [people, setPeople] = useState('1');
  const [resData, setResData] = useState<any>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError(''); setResData(null);
    const valBill = parseFloat(bill);
    const valTip = parseFloat(tip);
    const valPeople = parseInt(people) || 1;

    if (isNaN(valBill) || isNaN(valTip)) return setError('Please enter valid numbers for bill and tip.');
    if (valPeople < 1) return setError('Number of people must be at least 1.');

    const tipAmt = valBill * (valTip / 100);
    const total = valBill + tipAmt;
    const perPersonBill = valBill / valPeople;
    const perPersonTip = tipAmt / valPeople;
    const perPersonTotal = total / valPeople;

    const customResult = (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Tip Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>Tip Amount</span><span className="font-medium text-slate-900 dark:text-white">${tipAmt.toFixed(2)}</span></div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>Total Bill</span><span className="font-medium text-slate-900 dark:text-white">${total.toFixed(2)}</span></div>
          {valPeople > 1 && (
            <>
              <div className="w-full h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>Per Person — Bill</span><span className="font-medium text-slate-900 dark:text-white">${perPersonBill.toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>Per Person — Tip</span><span className="font-medium text-slate-900 dark:text-white">${perPersonTip.toFixed(2)}</span></div>
            </>
          )}
          <div className="w-full h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
          <div className="flex justify-between items-center bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
            <span className="font-bold text-indigo-900 dark:text-indigo-100">{valPeople > 1 ? 'Per Person — Total' : 'Total to Pay'}</span>
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">${perPersonTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );

    const visual = (
      <div className="space-y-2">
        <div className="w-full flex h-8 rounded-full overflow-hidden">
          <div className="bg-slate-400 flex items-center justify-center text-white text-xs font-bold transition-all" style={{ width: `${(valBill/total)*100}%` }}>Bill</div>
          <div className="bg-green-500 flex items-center justify-center text-white text-xs font-bold transition-all" style={{ width: `${(tipAmt/total)*100}%` }}>Tip</div>
        </div>
        <div className="flex justify-between text-xs font-bold text-slate-500">
          <span>$0</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    );

    const table = (
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500">
          <tr><th className="p-3 rounded-l-lg">Tip %</th><th className="p-3">Tip Amount</th><th className="p-3 rounded-r-lg">Total</th></tr>
        </thead>
        <tbody>
          {[10, 15, 18, 20, 25].map(p => {
            const t = valBill * (p/100);
            return (
              <tr key={p} className={p === valTip ? 'bg-indigo-50 dark:bg-indigo-900/20 font-bold text-indigo-700 dark:text-indigo-300' : 'border-b border-slate-100 dark:border-slate-800'}>
                <td className="p-3">{p}%</td>
                <td className="p-3">${t.toFixed(2)}</td>
                <td className="p-3">${(valBill + t).toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );

    setResData({ customResult, visual, table });
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Tip Calculator</h3>
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bill Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input type="number" value={bill} onChange={e=>setBill(e.target.value)} className="w-full pl-8 p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" placeholder="0.00" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tip %</label>
          <div className="relative mb-2">
            <input type="number" value={tip} onChange={e=>setTip(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" placeholder="20" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">%</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[10, 15, 18, 20, 25].map(p => (
              <button key={p} onClick={() => setTip(p.toString())} className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">{p}%</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Number of People</label>
          <input type="number" value={people} onChange={e=>setPeople(e.target.value)} min="1" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" placeholder="1" />
        </div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">Calculate Tip</button>
      {error && <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm text-center">{error}</div>}
      {resData && <div className="mt-6"><ResultDisplay {...resData} /></div>}
    </div>
  );
}

function DiscountCalculator() {
  const [orig, setOrig] = useState('');
  const [disc, setDisc] = useState('');
  const [tax, setTax] = useState('');
  const [resData, setResData] = useState<any>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError(''); setResData(null);
    const valOrig = parseFloat(orig);
    const valDisc = parseFloat(disc);
    const valTax = parseFloat(tax || '0');

    if (isNaN(valOrig) || isNaN(valDisc)) return setError('Please enter valid numbers for price and discount.');

    const discAmt = valOrig * (valDisc / 100);
    const afterDisc = valOrig - discAmt;
    const taxAmt = afterDisc * (valTax / 100);
    const finalPrice = afterDisc + taxAmt;
    const savings = valOrig - finalPrice;

    const customResult = (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Discount Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>Discount Amount</span><span className="font-medium text-red-500">-${discAmt.toFixed(2)}</span></div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>Price After Discount</span><span className="font-medium text-slate-900 dark:text-white">${afterDisc.toFixed(2)}</span></div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400"><span>Tax Amount</span><span className="font-medium text-slate-900 dark:text-white">+${taxAmt.toFixed(2)}</span></div>
          <div className="w-full h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
          <div className="flex justify-between items-center bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
            <span className="font-bold text-indigo-900 dark:text-indigo-100">Final Price</span>
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">${finalPrice.toFixed(2)}</span>
          </div>
          <div className="text-center text-sm font-medium text-green-600 dark:text-green-400 mt-2">
            You Save ${discAmt.toFixed(2)} ({valDisc}%)
          </div>
        </div>
      </div>
    );

    const visual = (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="w-16 text-sm font-medium text-slate-500">Original</span>
          <div className="flex-1 flex h-6 rounded-full overflow-hidden">
            <div className="bg-slate-400" style={{ width: `${(afterDisc/valOrig)*100}%` }}></div>
            <div className="bg-red-400" style={{ width: `${(discAmt/valOrig)*100}%` }}></div>
          </div>
          <span className="w-16 text-right font-bold">${valOrig.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-16 text-sm font-medium text-slate-500">Final</span>
          <div className="flex-1 flex h-6 rounded-full overflow-hidden">
            <div className="bg-slate-400" style={{ width: `${(afterDisc/Math.max(valOrig, finalPrice))*100}%` }}></div>
            <div className="bg-amber-400" style={{ width: `${(taxAmt/Math.max(valOrig, finalPrice))*100}%` }}></div>
          </div>
          <span className="w-16 text-right font-bold">${finalPrice.toFixed(2)}</span>
        </div>
        <div className="flex gap-4 text-xs text-slate-500 justify-center">
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-400 rounded-sm"></div> Price After Discount</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-400 rounded-sm"></div> Discount</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-400 rounded-sm"></div> Tax</span>
        </div>
      </div>
    );

    const table = (
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500">
          <tr><th className="p-3 rounded-l-lg">Discount %</th><th className="p-3">Discount</th><th className="p-3 rounded-r-lg">Final Price</th></tr>
        </thead>
        <tbody>
          {[5, 10, 15, 20, 25, 30, 50].map(p => {
            const d = valOrig * (p/100);
            const a = valOrig - d;
            const t = a * (valTax/100);
            const f = a + t;
            return (
              <tr key={p} className={p === valDisc ? 'bg-indigo-50 dark:bg-indigo-900/20 font-bold text-indigo-700 dark:text-indigo-300' : 'border-b border-slate-100 dark:border-slate-800'}>
                <td className="p-3">{p}%</td>
                <td className="p-3">${d.toFixed(2)}</td>
                <td className="p-3">${f.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );

    setResData({ customResult, visual, table });
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Discount Calculator</h3>
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Original Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input type="number" value={orig} onChange={e=>setOrig(e.target.value)} className="w-full pl-8 p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" placeholder="0.00" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Discount %</label>
          <div className="relative mb-2">
            <input type="number" value={disc} onChange={e=>setDisc(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" placeholder="20" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">%</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[5, 10, 15, 20, 25, 30, 50].map(p => (
              <button key={p} onClick={() => setDisc(p.toString())} className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">{p}%</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tax % (optional)</label>
          <div className="relative">
            <input type="number" value={tax} onChange={e=>setTax(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" placeholder="0" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">%</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Tax is applied after discount.</p>
        </div>
      </div>
      <button onClick={calculate} className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">Calculate Discount</button>
      {error && <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm text-center">{error}</div>}
      {resData && <div className="mt-6"><ResultDisplay {...resData} /></div>}
    </div>
  );
}
