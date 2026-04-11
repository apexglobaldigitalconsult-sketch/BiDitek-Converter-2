export interface StatsResult {
  n: number;
  sum: number;
  mean: number;
  popVar: number;
  popStdDev: number;
  sampleVar: number;
  sampleStdDev: number;
  median: number;
  mode: number[] | null;
  min: number;
  max: number;
  range: number;
  q1: number;
  q2: number;
  q3: number;
  iqr: number;
  lowerFence: number;
  upperFence: number;
  outliers: number[];
  skewness: number | null;
  kurtosis: number | null;
  cv: number | null;
  sem: number | null;
  data: number[];
  sortedData: number[];
  zScores: { index: number; value: number; deviation: number; z: number }[];
}

export function calculateStats(data: number[]): StatsResult {
  const n = data.length;
  const sum = data.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  let sumSqDev = 0;
  const deviations = data.map(x => {
    const dev = x - mean;
    sumSqDev += dev * dev;
    return dev;
  });

  const popVar = sumSqDev / n;
  const popStdDev = Math.sqrt(popVar);
  
  const sampleVar = n > 1 ? sumSqDev / (n - 1) : 0;
  const sampleStdDev = n > 1 ? Math.sqrt(sampleVar) : 0;

  const sortedData = [...data].sort((a, b) => a - b);
  
  const getMedian = (arr: number[]) => {
    if (arr.length === 0) return 0;
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
  };

  const median = getMedian(sortedData);
  const q2 = median;

  let lowerHalf: number[], upperHalf: number[];
  const mid = Math.floor(n / 2);
  if (n % 2 === 0) {
    lowerHalf = sortedData.slice(0, mid);
    upperHalf = sortedData.slice(mid);
  } else {
    lowerHalf = sortedData.slice(0, mid);
    upperHalf = sortedData.slice(mid + 1);
  }

  const q1 = getMedian(lowerHalf);
  const q3 = getMedian(upperHalf);
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;
  const outliers = sortedData.filter(x => x < lowerFence || x > upperFence);

  const min = sortedData[0];
  const max = sortedData[n - 1];
  const range = max - min;

  // Mode
  const counts = new Map<number, number>();
  let maxCount = 0;
  for (const val of data) {
    const c = (counts.get(val) || 0) + 1;
    counts.set(val, c);
    if (c > maxCount) maxCount = c;
  }
  
  let mode: number[] | null = null;
  if (maxCount > 1) {
    const modes = Array.from(counts.entries()).filter(([_, c]) => c === maxCount).map(([v]) => v);
    if (modes.length < counts.size) {
      mode = modes.sort((a, b) => a - b);
    }
  }

  // Skewness & Kurtosis
  let skewness: number | null = null;
  let kurtosis: number | null = null;
  
  if (n > 2 && sampleStdDev > 0) {
    let sumZ3 = 0;
    for (const x of data) {
      sumZ3 += Math.pow((x - mean) / sampleStdDev, 3);
    }
    skewness = (n / ((n - 1) * (n - 2))) * sumZ3;
  }

  if (n > 3 && sampleStdDev > 0) {
    let sumZ4 = 0;
    for (const x of data) {
      sumZ4 += Math.pow((x - mean) / sampleStdDev, 4);
    }
    const part1 = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
    const part2 = (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
    kurtosis = part1 * sumZ4 - part2;
  }

  const cv = mean !== 0 ? (sampleStdDev / mean) * 100 : null;
  const sem = n > 0 ? sampleStdDev / Math.sqrt(n) : null;

  const sDevToUse = n > 1 ? sampleStdDev : popStdDev;
  const zScores = data.map((x, i) => ({
    index: i,
    value: x,
    deviation: x - mean,
    z: sDevToUse > 0 ? (x - mean) / sDevToUse : 0
  }));

  return {
    n, sum, mean, popVar, popStdDev, sampleVar, sampleStdDev,
    median, mode, min, max, range, q1, q2, q3, iqr, lowerFence, upperFence, outliers,
    skewness, kurtosis, cv, sem, data, sortedData, zScores
  };
}

export function formatNum(num: number | null | undefined, decimals: number = 4): string {
  if (num === null || num === undefined) return '-';
  return Number.isInteger(num) ? num.toString() : num.toFixed(decimals);
}
