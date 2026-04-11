import React from 'react';
import { ExactAge, TotalUnits, getNextBirthday, getZodiacSign, getChineseZodiac, getBirthStone, getGeneration, getBirthSeason, getMilestones, getYearContext } from './utils';

interface ResultsProps {
  mode: 'myAge' | 'dateToDate' | 'units';
  exactAge: ExactAge;
  totalUnits: TotalUnits;
  dob: Date;
  asOf: Date;
  hasTime: boolean;
}

export default function Results({ mode, exactAge, totalUnits, dob, asOf, hasTime }: ResultsProps) {
  const nextBday = getNextBirthday(dob, asOf);
  const milestones = getMilestones(dob, asOf);
  const yearContext = getYearContext(dob.getFullYear());

  const formatNum = (n: number) => n.toLocaleString();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Section 1: Primary Age Result */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-8 text-center bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800/50">
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
            {mode === 'dateToDate' ? 'Duration' : 'Your Exact Age'}
          </p>
          <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {exactAge.years} <span className="text-2xl text-slate-500">years,</span>{' '}
            {exactAge.months} <span className="text-2xl text-slate-500">months,</span>{' '}
            {exactAge.days} <span className="text-2xl text-slate-500">days</span>
          </div>
          {hasTime && (
            <div className="text-2xl font-bold text-slate-700 dark:text-slate-300 mt-4">
              {exactAge.hours} <span className="text-lg text-slate-500">hours,</span>{' '}
              {exactAge.minutes} <span className="text-lg text-slate-500">minutes,</span>{' '}
              {exactAge.seconds} <span className="text-lg text-slate-500">seconds</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 divide-x divide-slate-200 dark:divide-slate-700">
          <div className="p-4 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">
              {mode === 'dateToDate' ? 'Start Date' : 'Date of Birth'}
            </p>
            <p className="font-medium text-slate-900 dark:text-white">
              {dob.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              <br/>
              <span className="text-sm text-slate-500">({dob.toLocaleDateString(undefined, { weekday: 'long' })})</span>
            </p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">
              {mode === 'dateToDate' ? 'End Date' : 'As of Date'}
            </p>
            <p className="font-medium text-slate-900 dark:text-white">
              {asOf.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              <br/>
              <span className="text-sm text-slate-500">({asOf.toLocaleDateString(undefined, { weekday: 'long' })})</span>
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Age in All Time Units */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Age in All Time Units</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 dark:bg-slate-700">
          {[
            { label: 'Years', val: totalUnits.years.toFixed(4) },
            { label: 'Months', val: formatNum(Math.floor(totalUnits.months)) },
            { label: 'Weeks', val: formatNum(totalUnits.weeks) },
            { label: 'Days', val: formatNum(totalUnits.days), highlight: true },
            { label: 'Hours', val: formatNum(totalUnits.hours) },
            { label: 'Minutes', val: formatNum(totalUnits.minutes), sci: totalUnits.minutes.toExponential(4) },
            { label: 'Seconds', val: formatNum(totalUnits.seconds), sci: totalUnits.seconds.toExponential(4) },
          ].map((item, i) => (
            <div key={i} className={`p-6 ${item.highlight ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-white dark:bg-slate-800'}`}>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{item.label}</p>
              <p className={`text-2xl font-bold ${item.highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                {item.val}
              </p>
              {item.sci && <p className="text-xs text-slate-400 mt-1 font-mono">{item.sci}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Next Birthday Countdown (Only for My Age / Units) */}
      {mode !== 'dateToDate' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {nextBday.isToday ? (
            <div className="p-12 text-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
              <div className="text-6xl mb-4">🎂</div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Happy Birthday!</h3>
              <p className="text-xl text-slate-600 dark:text-slate-300">You are {nextBday.ageTurning} years old today!</p>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    🎂 Next Birthday
                  </h3>
                  <p className="text-slate-500 mt-1">
                    {nextBday.nextDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })} 
                    {' '}({nextBday.nextDate.toLocaleDateString(undefined, { weekday: 'long' })})
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm text-slate-500">Age You'll Turn</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{nextBday.ageTurning} years old</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-sm text-slate-500 mb-1">Days Until Birthday</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white">{formatNum(nextBday.daysUntil)} days</p>
                </div>
                <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 text-center">
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-bold mb-1 uppercase tracking-wider">Countdown</p>
                  <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                    {nextBday.monthsUntil} <span className="text-lg">months</span>, {nextBday.daysRemaining} <span className="text-lg">days</span>
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">
                  <span>Last Birthday</span>
                  <span>{nextBday.progressPercent.toFixed(1)}% of year elapsed</span>
                  <span>Next Birthday</span>
                </div>
                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${nextBday.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Section 4: Birth Day & Personal Details */}
      {mode !== 'dateToDate' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Birth Day & Personal Details</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-700">
            {[
              { label: 'Day of the Week Born', val: `You were born on a ${dob.toLocaleDateString(undefined, { weekday: 'long' })}` },
              { label: 'Western Zodiac Sign', val: getZodiacSign(dob.getMonth(), dob.getDate()) },
              { label: 'Chinese Zodiac Animal', val: getChineseZodiac(dob.getFullYear()) },
              { label: 'Birth Stone', val: getBirthStone(dob.getMonth()) },
              { label: 'Birth Month', val: dob.toLocaleDateString(undefined, { month: 'long' }) },
              { label: 'Birth Season', val: `${getBirthSeason(dob.getMonth())} (Northern Hemisphere)` },
              { label: 'Generation', val: getGeneration(dob.getFullYear()) },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-6">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-2">{item.label}</p>
                <p className="font-medium text-slate-900 dark:text-white">{item.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 5: Birth Year Context */}
      {mode !== 'dateToDate' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">The World in {dob.getFullYear()}</h3>
            <p className="text-sm text-slate-500 mt-1">In {dob.getFullYear()}, the world population was approximately {yearContext.pop} billion.</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yearContext.events.map((ev, i) => (
              <div key={i} className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                <span className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded mb-3">
                  {ev.cat}
                </span>
                <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">{ev.text}</p>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400">
            These are selected highlights from your birth year for fun reference only.
          </div>
        </div>
      )}

      {/* Section 6: Important Age Milestones */}
      {mode !== 'dateToDate' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Important Age Milestones</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-3 px-6 font-bold">Age</th>
                  <th className="py-3 px-6 font-bold">Milestone</th>
                  <th className="py-3 px-6 font-bold">Date</th>
                  <th className="py-3 px-6 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {milestones.map((m, i) => {
                  const isNext = !m.isPast && (i === 0 || milestones[i - 1].isPast);
                  return (
                    <tr key={i} className={`
                      ${m.isPast ? 'bg-white dark:bg-slate-800 opacity-70' : 'bg-white dark:bg-slate-800'}
                      ${isNext ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}
                      hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors
                    `}>
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{m.age}</td>
                      <td className={`py-4 px-6 ${isNext ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {m.label}
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                        {m.date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          m.isPast 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : isNext
                              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
                              : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
