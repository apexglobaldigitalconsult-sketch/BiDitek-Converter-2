export function cryptoRandom(): number {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] / (0xffffffff + 1);
}

export function cryptoShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(cryptoRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateUniformInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateUniformDec(min: number, max: number, decimals: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

export function generateNormal(min: number, max: number, mean: number, stdDev: number, decimals: number): number {
  for (let i = 0; i < 10; i++) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1 || 1e-10)) * Math.cos(2 * Math.PI * u2);
    const value = mean + z * stdDev;
    if (value >= min && value <= max) {
      return parseFloat(value.toFixed(decimals));
    }
  }
  // Fallback to clamping if 10 attempts fail
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1 || 1e-10)) * Math.cos(2 * Math.PI * u2);
  let value = mean + z * stdDev;
  value = Math.max(min, Math.min(max, value));
  return parseFloat(value.toFixed(decimals));
}

export function generateWeighted(weights: {value: number, weight: number}[]): number {
  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  if (totalWeight <= 0) return weights[0]?.value || 0;
  
  let r = Math.random() * totalWeight;
  for (const w of weights) {
    r -= w.weight;
    if (r <= 0) return w.value;
  }
  return weights[weights.length - 1].value;
}

export function calculateStats(data: number[]) {
  if (data.length === 0) return null;
  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;
  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const median = n % 2 === 0 ? (sorted[n/2 - 1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)];
  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;
  const sqDiffs = sorted.map(v => Math.pow(v - mean, 2));
  const stdDev = Math.sqrt(sqDiffs.reduce((a, b) => a + b, 0) / (n > 1 ? n - 1 : 1));

  return { count: n, min, max, sum, mean, median, range, stdDev, sorted };
}

export function generateBuckets(data: number[], bins: number = 10) {
  if (data.length === 0) return [];
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const binSize = range / bins;
  
  const buckets = Array(bins).fill(0);
  data.forEach(val => {
    let idx = Math.floor((val - min) / binSize);
    if (idx >= bins) idx = bins - 1;
    buckets[idx]++;
  });
  
  return buckets.map((count, i) => ({
    min: min + i * binSize,
    max: min + (i + 1) * binSize,
    count
  }));
}
