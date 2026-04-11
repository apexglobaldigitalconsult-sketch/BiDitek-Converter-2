export interface DateResult {
  startDate: Date;
  endDate: Date;
  exactDuration: { years: number; months: number; days: number; hours: number; minutes: number; seconds: number };
  totalUnits: { years: number; months: number; weeks: number; days: number; hours: number; minutes: number; seconds: number };
  businessDays: number;
  weekendDays: number;
  saturdays: number;
  sundays: number;
  holidays: { name: string; date: Date }[];
  workingDays: number; // businessDays - holidays
  operation?: string;
  direction?: 'future' | 'past';
  isStartWeekend: boolean;
  isEndWeekend: boolean;
  startWeek: string;
  endWeek: string;
  startQuarter: string;
  endQuarter: string;
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  if (d.getDate() !== day) {
    d.setDate(0); // Snap to last day of previous month
  }
  return d;
}

export function addYears(date: Date, years: number): Date {
  const d = new Date(date);
  const month = d.getMonth();
  const day = d.getDate();
  d.setFullYear(d.getFullYear() + years);
  if (month === 1 && day === 29 && !isLeapYear(d.getFullYear())) {
    d.setDate(28);
  }
  return d;
}

export function addBusinessDays(date: Date, days: number): Date {
  const d = new Date(date);
  let remaining = Math.abs(days);
  const step = days > 0 ? 1 : -1;
  while (remaining > 0) {
    d.setDate(d.getDate() + step);
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      remaining--;
    }
  }
  return d;
}

// Get nth day of week in month (e.g., 3rd Monday)
function getNthDayOfMonth(year: number, month: number, dayOfWeek: number, n: number): Date {
  const d = new Date(year, month, 1);
  let count = 0;
  while (d.getMonth() === month) {
    if (d.getDay() === dayOfWeek) {
      count++;
      if (count === n) return new Date(d);
    }
    d.setDate(d.getDate() + 1);
  }
  return d; // Fallback
}

// Get last day of week in month (e.g., last Monday)
function getLastDayOfMonth(year: number, month: number, dayOfWeek: number): Date {
  const d = new Date(year, month + 1, 0);
  while (d.getDay() !== dayOfWeek) {
    d.setDate(d.getDate() - 1);
  }
  return new Date(d);
}

function observeHoliday(date: Date): Date {
  const d = new Date(date);
  if (d.getDay() === 6) d.setDate(d.getDate() - 1); // Saturday -> Friday
  else if (d.getDay() === 0) d.setDate(d.getDate() + 1); // Sunday -> Monday
  return d;
}

export function getHolidaysForYear(year: number): { name: string; date: Date }[] {
  return [
    { name: "New Year's Day", date: observeHoliday(new Date(year, 0, 1)) },
    { name: "Martin Luther King Jr. Day", date: getNthDayOfMonth(year, 0, 1, 3) },
    { name: "Presidents' Day", date: getNthDayOfMonth(year, 1, 1, 3) },
    { name: "Memorial Day", date: getLastDayOfMonth(year, 4, 1) },
    { name: "Juneteenth", date: observeHoliday(new Date(year, 5, 19)) },
    { name: "Independence Day", date: observeHoliday(new Date(year, 6, 4)) },
    { name: "Labor Day", date: getNthDayOfMonth(year, 8, 1, 1) },
    { name: "Columbus Day", date: getNthDayOfMonth(year, 9, 1, 2) },
    { name: "Veterans Day", date: observeHoliday(new Date(year, 10, 11)) },
    { name: "Thanksgiving", date: getNthDayOfMonth(year, 10, 4, 4) },
    { name: "Christmas Day", date: observeHoliday(new Date(year, 11, 25)) },
  ];
}

export function getHolidaysInRange(start: Date, end: Date): { name: string; date: Date }[] {
  const s = start.getTime() < end.getTime() ? start : end;
  const e = start.getTime() < end.getTime() ? end : start;
  
  const startYear = s.getFullYear();
  const endYear = e.getFullYear();
  
  let holidays: { name: string; date: Date }[] = [];
  for (let y = startYear; y <= endYear; y++) {
    holidays = holidays.concat(getHolidaysForYear(y));
  }
  
  // Filter to range, ignoring time
  const sTime = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
  const eTime = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
  
  return holidays.filter(h => {
    const hTime = h.date.getTime();
    return hTime >= sTime && hTime <= eTime;
  });
}

export function getISOWeek(date: Date): { week: number; year: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { week, year: d.getUTCFullYear() };
}

export function getQuarter(date: Date): string {
  const q = Math.floor(date.getMonth() / 3) + 1;
  return `Q${q} ${date.getFullYear()}`;
}

export function calculateExactDuration(start: Date, end: Date, includeEndDate: boolean = false) {
  let s = new Date(start);
  let e = new Date(end);
  let isNegative = false;
  
  if (s.getTime() > e.getTime()) {
    const temp = s;
    s = e;
    e = temp;
    isNegative = true;
  }

  if (includeEndDate) {
    e.setDate(e.getDate() + 1);
  }

  let years = e.getFullYear() - s.getFullYear();
  let months = e.getMonth() - s.getMonth();
  let days = e.getDate() - s.getDate();
  let hours = e.getHours() - s.getHours();
  let minutes = e.getMinutes() - s.getMinutes();
  let seconds = e.getSeconds() - s.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0) { hours += 24; days--; }
  if (days < 0) {
    months--;
    const prevMonth = new Date(e.getFullYear(), e.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) { months += 12; years--; }

  return { years, months, days, hours, minutes, seconds, isNegative };
}

export function calculateTotalUnits(start: Date, end: Date, includeEndDate: boolean = false) {
  let s = new Date(start);
  let e = new Date(end);
  if (s.getTime() > e.getTime()) {
    const temp = s;
    s = e;
    e = temp;
  }

  if (includeEndDate) {
    e.setDate(e.getDate() + 1);
  }

  const diffMs = e.getTime() - s.getTime();
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  const exact = calculateExactDuration(s, e);
  const totalMonths = exact.years * 12 + exact.months + exact.days / 30.44;
  const totalYears = exact.years + exact.months / 12 + exact.days / 365.25;

  return { years: totalYears, months: exact.years * 12 + exact.months, weeks, days, hours, minutes, seconds };
}

export function countDaysBreakdown(start: Date, end: Date, includeEndDate: boolean = false) {
  let s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  let e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  
  if (s.getTime() > e.getTime()) {
    const temp = s;
    s = e;
    e = temp;
  }

  if (includeEndDate) {
    e.setDate(e.getDate() + 1);
  }

  let businessDays = 0;
  let saturdays = 0;
  let sundays = 0;
  let totalDays = 0;

  const current = new Date(s);
  while (current.getTime() < e.getTime()) {
    totalDays++;
    const day = current.getDay();
    if (day === 0) sundays++;
    else if (day === 6) saturdays++;
    else businessDays++;
    
    current.setDate(current.getDate() + 1);
  }

  return { totalDays, businessDays, saturdays, sundays, weekendDays: saturdays + sundays };
}
