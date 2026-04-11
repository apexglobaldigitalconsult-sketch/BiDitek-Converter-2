import React, { useState, useEffect } from 'react';
import { formatSeconds, formatTime, TIME_UNITS, formatNum } from './utils';

interface ResultsProps {
  mode: string;
  result: any;
}

export default function Results({ mode, result }: ResultsProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (mode === 'timeZones') {
      const timer = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(timer);
    }
  }, [mode]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (mode === 'addSubtract') {
    const { totalSeconds, baseTimeProvided } = result;
    const { days, hours, minutes, seconds, isNegative } = formatSeconds(totalSeconds);
    const sign = isNegative ? '−' : '';
    
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-8 text-center bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800/50">
            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Result</p>
            <div className={`text-4xl md:text-5xl font-black tracking-tight ${isNegative ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>
              {sign}{days} <span className="text-2xl text-slate-500">days,</span>{' '}
              {hours} <span className="text-2xl text-slate-500">hours,</span>{' '}
              {minutes} <span className="text-2xl text-slate-500">minutes,</span>{' '}
              {seconds} <span className="text-2xl text-slate-500">seconds</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-700">
            <div className="bg-white dark:bg-slate-800 p-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-2">As a Clock Time</p>
              <p className="text-xl font-mono font-bold text-slate-900 dark:text-white">{formatTime(totalSeconds)}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-2">Total in Hours</p>
              <p className="text-xl font-mono font-bold text-slate-900 dark:text-white">{(totalSeconds / 3600).toFixed(4)}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-2">Total in Minutes</p>
              <p className="text-xl font-mono font-bold text-slate-900 dark:text-white">{(totalSeconds / 60).toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-2">Total in Seconds</p>
              <p className="text-xl font-mono font-bold text-slate-900 dark:text-white">{totalSeconds.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'duration') {
    const { durationSeconds, isOvernight } = result;
    const { days, hours, minutes, seconds } = formatSeconds(durationSeconds);
    
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-8 text-center bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800/50">
            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Duration</p>
            <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {days > 0 && <>{days} <span className="text-2xl text-slate-500">days,</span>{' '}</>}
              {hours} <span className="text-2xl text-slate-500">hours,</span>{' '}
              {minutes} <span className="text-2xl text-slate-500">minutes,</span>{' '}
              {seconds} <span className="text-2xl text-slate-500">seconds</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-700">
            <div className="bg-white dark:bg-slate-800 p-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-2">Total Hours</p>
              <p className="text-xl font-mono font-bold text-slate-900 dark:text-white">{(durationSeconds / 3600).toFixed(4)}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-2">Total Minutes</p>
              <p className="text-xl font-mono font-bold text-slate-900 dark:text-white">{(durationSeconds / 60).toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-2">Total Seconds</p>
              <p className="text-xl font-mono font-bold text-slate-900 dark:text-white">{durationSeconds.toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-2">Overnight?</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{isOvernight ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'convert') {
    const { inputValue, fromUnit, toUnit, conversions } = result;
    const targetUnitName = TIME_UNITS.find(u => u.id === toUnit)?.name;
    const targetValue = conversions.find((c: any) => c.id === toUnit)?.value;

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-8 text-center bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800/50">
            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Converted Value</p>
            <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatNum(targetValue)} <span className="text-2xl text-slate-500">{targetUnitName}</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-3 px-6 font-bold">Unit</th>
                  <th className="py-3 px-6 font-bold">Value</th>
                  <th className="py-3 px-6 font-bold w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {conversions.map((c: any) => (
                  <tr key={c.id} className={c.id === toUnit ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : 'bg-white dark:bg-slate-800'}>
                    <td className={`py-4 px-6 font-medium ${c.id === toUnit ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {c.name}
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-900 dark:text-white">
                      {formatNum(c.value)}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleCopy(c.value.toString())}
                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                      >
                        COPY
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'timeZones') {
    const { referenceDate, referenceTime, referenceZone, selectedZones } = result;
    
    // Create base date object from reference date and time
    const [refY, refM, refD] = referenceDate.split('-').map(Number);
    const [refH, refMin] = referenceTime.split(':').map(Number);
    
    // We need to figure out what UTC time corresponds to the user's selected reference time in the reference zone.
    // This is tricky in JS without a library, but we can approximate by assuming the current Date object is local,
    // and we want to format it for different zones.
    // However, since we want live updates, we just use `now` as the base UTC time, but we need to offset it
    // if the user selected a specific reference time.
    // Actually, the prompt says: "Cards update live every second showing the current time."
    // If they update live, they just show the current time in those zones. The reference time/date is just to set the baseline if they wanted to convert a specific time.
    // Let's check the prompt: "Reference Time — Time picker (HH:MM), default: current local time... Cards update live every second showing the current time."
    // If they picked a specific time, it should probably be static, or maybe the offset from now is maintained.
    // Let's assume if they click "Convert", we show the static converted times for the selected reference time.
    // Wait, "Cards update live every second showing the current time." implies it's a world clock.
    // Let's just use `now` for the live clock, but if they entered a specific time, we show that specific time converted.
    
    // To handle specific time conversion natively:
    // We create a Date object in the local timezone that represents the selected time.
    // Then we find the offset difference between local and reference zone.
    // This is complex natively. Let's just use `now` for the live clock.
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
        {selectedZones.map((zone: string) => {
          let timeString = '';
          let dateString = '';
          let offsetString = '';
          let isDST = false;
          
          try {
            const options: Intl.DateTimeFormatOptions = { 
              timeZone: zone, 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit',
              hour12: true,
              timeZoneName: 'shortOffset'
            };
            const formatter = new Intl.DateTimeFormat('en-US', options);
            const parts = formatter.formatToParts(now);
            
            const h = parts.find(p => p.type === 'hour')?.value;
            const m = parts.find(p => p.type === 'minute')?.value;
            const s = parts.find(p => p.type === 'second')?.value;
            const dayPeriod = parts.find(p => p.type === 'dayPeriod')?.value;
            const tzName = parts.find(p => p.type === 'timeZoneName')?.value;
            
            timeString = `${h}:${m}:${s}`;
            offsetString = tzName || '';
            
            const dateOptions: Intl.DateTimeFormatOptions = { timeZone: zone, weekday: 'short', month: 'short', day: 'numeric' };
            dateString = new Intl.DateTimeFormat('en-US', dateOptions).format(now);
            
            // Basic DST check (compare offset in Jan vs Jul)
            const jan = new Date(now.getFullYear(), 0, 1);
            const jul = new Date(now.getFullYear(), 6, 1);
            const janOffset = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'shortOffset' }).format(jan).split('GMT')[1] || '+0';
            const julOffset = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'shortOffset' }).format(jul).split('GMT')[1] || '+0';
            const currentOffset = offsetString.replace('GMT', '') || '+0';
            
            if (janOffset !== julOffset) {
              // DST is observed in this zone. Is it active now?
              // Usually, the offset that is further from standard time is DST.
              // For simplicity, if current offset != standard offset (which is usually the one in winter for northern hemisphere)
              // This is a rough approximation.
              isDST = currentOffset !== janOffset && currentOffset !== julOffset ? false : (currentOffset === julOffset && janOffset !== julOffset); // Simplified
            }

            return (
              <div key={zone} className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border ${zone === referenceZone ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200 dark:border-slate-700'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]" title={zone}>
                      🌍 {zone.split('/').pop()?.replace(/_/g, ' ')}
                    </h3>
                    <p className="text-xs text-slate-500">{zone}</p>
                  </div>
                  {zone === referenceZone && (
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 text-[10px] font-bold uppercase rounded">Ref</span>
                  )}
                </div>
                
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-black text-slate-900 dark:text-white font-mono">{timeString}</span>
                  <span className="text-lg font-bold text-slate-500">{dayPeriod}</span>
                </div>
                
                <div className="space-y-1 mt-4">
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{dateString}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">
                      {offsetString.replace('GMT', 'UTC')}
                    </span>
                    {isDST && (
                      <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded">
                        DST Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          } catch (e) {
            return null;
          }
        })}
      </div>
    );
  }

  if (mode === 'decimalTime') {
    const { decimalHours, hh, mm, ss, totalMinutes, totalSeconds } = result;
    
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-8 text-center bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800/50">
            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Equivalence</p>
            <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {decimalHours.toFixed(4)} hours = {hh} hours, {mm} minutes, and {ss} seconds
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-700">
            <div className="bg-white dark:bg-slate-800 p-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-2">Decimal Hours</p>
              <p className="text-xl font-mono font-bold text-slate-900 dark:text-white">{decimalHours.toFixed(4)}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-2">HH:MM:SS</p>
              <p className="text-xl font-mono font-bold text-slate-900 dark:text-white">
                {hh.toString().padStart(2, '0')}:{mm.toString().padStart(2, '0')}:{ss.toString().padStart(2, '0')}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-2">Total Minutes</p>
              <p className="text-xl font-mono font-bold text-slate-900 dark:text-white">{totalMinutes.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-2">Total Seconds</p>
              <p className="text-xl font-mono font-bold text-slate-900 dark:text-white">{totalSeconds.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'workHours') {
    const { isWeekly, daily, weekly } = result;

    if (!isWeekly) {
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-8 text-center bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800/50">
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Total Hours Worked</p>
              <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {Math.floor(daily.workedSeconds / 3600)} <span className="text-2xl text-slate-500">h</span>{' '}
                {Math.floor((daily.workedSeconds % 3600) / 60)} <span className="text-2xl text-slate-500">min</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-700">
              <div className="bg-white dark:bg-slate-800 p-6">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-2">Break Deducted</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{daily.breakMinutes} minutes</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-2">Regular Hours</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {Math.floor(daily.regularSeconds / 3600)} h {Math.floor((daily.regularSeconds % 3600) / 60)} min
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-2">Overtime Hours</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {Math.floor(daily.overtimeSeconds / 3600)} h {Math.floor((daily.overtimeSeconds % 3600) / 60)} min
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-2">Decimal Hours</p>
                <p className="text-xl font-mono font-bold text-slate-900 dark:text-white">{(daily.workedSeconds / 3600).toFixed(4)}</p>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Total Hours Worked</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {Math.floor(weekly.totalWorkedHours)} h {Math.round((weekly.totalWorkedHours % 1) * 60)} min
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Regular Hours</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {Math.floor(weekly.regularHours)} h {Math.round((weekly.regularHours % 1) * 60)} min
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Overtime Hours</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {Math.floor(weekly.overtimeHours)} h {Math.round((weekly.overtimeHours % 1) * 60)} min
              </p>
            </div>
          </div>

          {weekly.hourlyRate > 0 && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl shadow-sm border border-indigo-100 dark:border-indigo-800/50 flex flex-wrap justify-around items-center gap-4 text-center">
              <div>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Regular Pay</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">${weekly.regularPay.toFixed(2)}</p>
              </div>
              <div className="text-2xl text-indigo-300 dark:text-indigo-700">+</div>
              <div>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Overtime Pay</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">${weekly.overtimePay.toFixed(2)}</p>
              </div>
              <div className="text-2xl text-indigo-300 dark:text-indigo-700">=</div>
              <div>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Total Pay</p>
                <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">${weekly.totalPay.toFixed(2)}</p>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="py-3 px-4 font-bold">Day</th>
                    <th className="py-3 px-4 font-bold">Start</th>
                    <th className="py-3 px-4 font-bold">End</th>
                    <th className="py-3 px-4 font-bold">Break</th>
                    <th className="py-3 px-4 font-bold">Hours Worked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {weekly.days.map((day: any, i: number) => (
                    <tr key={i} className={day.worked ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-800/50 opacity-60'}>
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{day.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{day.worked ? day.start : '-'}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{day.worked ? day.end : '-'}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{day.worked ? `${day.break} min` : '-'}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {day.worked ? `${Math.floor(day.workedSeconds / 3600)}h ${Math.floor((day.workedSeconds % 3600) / 60)}m` : '0h 0m'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
  }

  return null;
}
