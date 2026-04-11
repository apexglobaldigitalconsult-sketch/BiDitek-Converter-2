export function formatSeconds(totalSeconds: number) {
  const isNegative = totalSeconds < 0;
  const absSeconds = Math.abs(totalSeconds);
  const days = Math.floor(absSeconds / 86400);
  const hours = Math.floor((absSeconds % 86400) / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const seconds = Math.round(absSeconds % 60);
  return { days, hours, minutes, seconds, isNegative };
}

export function parseTime(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':').map(Number);
  const h = parts[0] || 0;
  const m = parts[1] || 0;
  const s = parts[2] || 0;
  return h * 3600 + m * 60 + s;
}

export function formatTime(seconds: number): string {
  const s = Math.abs(seconds);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.round(s % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

export const TIME_UNITS = [
  { id: 'ms', name: 'Milliseconds', factor: 0.001 },
  { id: 's', name: 'Seconds', factor: 1 },
  { id: 'min', name: 'Minutes', factor: 60 },
  { id: 'hr', name: 'Hours', factor: 3600 },
  { id: 'day', name: 'Days', factor: 86400 },
  { id: 'week', name: 'Weeks', factor: 604800 }
];

export const TIMEZONES = Intl.supportedValuesOf('timeZone');

export const REGION_PRESETS = {
  'Americas': ['America/New_York', 'America/Chicago', 'America/Los_Angeles', 'America/Toronto', 'America/Sao_Paulo'],
  'Europe': ['Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Moscow'],
  'Asia/Pacific': ['Asia/Tokyo', 'Asia/Shanghai', 'Asia/Singapore', 'Australia/Sydney', 'Asia/Kolkata'],
  'Africa': ['Africa/Cairo', 'Africa/Johannesburg', 'Africa/Lagos', 'Africa/Nairobi'],
  'Middle East': ['Asia/Dubai', 'Asia/Riyadh', 'Asia/Jerusalem']
};

export function formatNum(num: number): string {
  if (num === 0) return '0';
  const absNum = Math.abs(num);
  if (absNum > 1e9 || absNum < 1e-6) {
    return num.toExponential(4).replace(/\.?0+e/, 'e');
  }
  return parseFloat(num.toPrecision(8)).toString();
}
