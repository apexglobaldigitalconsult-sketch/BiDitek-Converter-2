import React, { useEffect, useRef } from 'react';
import { StatsResult, formatNum } from './utils';

interface ChartProps {
  stats: StatsResult;
}

export default function DistributionChart({ stats }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { data, min, max, mean, sampleStdDev, popStdDev, q1, q2, q3, lowerFence, upperFence, outliers } = stats;
    const s = data.length > 1 ? sampleStdDev : popStdDev;

    // Handle edge case where all values are the same
    if (min === max || s === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#64748b';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Not enough variance to plot distribution.', canvas.width / 2, canvas.height / 2);
      return;
    }

    const width = canvas.width;
    const height = canvas.height;
    const padding = { top: 40, right: 40, bottom: 80, left: 50 }; // Extra bottom padding for box plot
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    // 1. Histogram
    const numBins = 10;
    const binWidth = (max - min) / numBins;
    const bins = new Array(numBins).fill(0);

    data.forEach(val => {
      let binIdx = Math.floor((val - min) / binWidth);
      if (binIdx === numBins) binIdx--; // Handle exact max value
      bins[binIdx]++;
    });

    const maxFreq = Math.max(...bins);
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#cbd5e1'; // slate-300
    ctx.lineWidth = 1;
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + chartH);
    ctx.lineTo(padding.left + chartW, padding.top + chartH);
    ctx.stroke();

    // Draw bars
    const barW = chartW / numBins;
    bins.forEach((freq, i) => {
      if (freq === 0) return;
      const barH = (freq / maxFreq) * chartH;
      const x = padding.left + i * barW;
      const y = padding.top + chartH - barH;
      
      const binMid = min + (i + 0.5) * binWidth;
      const z = Math.abs((binMid - mean) / s);
      
      if (z <= 1) ctx.fillStyle = 'rgba(34, 197, 94, 0.6)'; // green-500
      else if (z <= 2) ctx.fillStyle = 'rgba(234, 179, 8, 0.6)'; // yellow-500
      else if (z <= 3) ctx.fillStyle = 'rgba(249, 115, 22, 0.6)'; // orange-500
      else ctx.fillStyle = 'rgba(239, 68, 68, 0.6)'; // red-500

      ctx.fillRect(x + 1, y, barW - 2, barH);
    });

    // 2. Normal Curve Overlay
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.8)'; // indigo-500
    ctx.lineWidth = 2;
    
    // Scale curve so its peak roughly matches the histogram's expected peak
    // Expected peak freq = n * binWidth * (1 / (s * sqrt(2pi)))
    const expectedPeak = data.length * binWidth * (1 / (s * Math.sqrt(2 * Math.PI)));
    const scaleY = chartH / Math.max(maxFreq, expectedPeak);

    for (let i = 0; i <= chartW; i++) {
      const xVal = min + (i / chartW) * (max - min);
      const exponent = -Math.pow(xVal - mean, 2) / (2 * s * s);
      const yVal = (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
      
      const px = padding.left + i;
      const py = padding.top + chartH - (yVal * scaleY * data.length * binWidth);
      
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // 3. Sigma Lines
    const drawLine = (val: number, label: string, color: string) => {
      if (val < min || val > max) return;
      const px = padding.left + ((val - min) / (max - min)) * chartW;
      
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.setLineDash([4, 4]);
      ctx.moveTo(px, padding.top);
      ctx.lineTo(px, padding.top + chartH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = color;
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, px, padding.top - 5);
    };

    drawLine(mean, 'x̄', '#475569'); // slate-600
    drawLine(mean + s, '+1σ', '#22c55e');
    drawLine(mean - s, '-1σ', '#22c55e');
    drawLine(mean + 2*s, '+2σ', '#eab308');
    drawLine(mean - 2*s, '-2σ', '#eab308');
    drawLine(mean + 3*s, '+3σ', '#f97316');
    drawLine(mean - 3*s, '-3σ', '#f97316');

    // 4. Box Plot (below histogram)
    const boxY = height - 30;
    const boxH = 20;
    
    const getPx = (val: number) => padding.left + ((val - min) / (max - min)) * chartW;
    
    const pxQ1 = getPx(q1);
    const pxQ2 = getPx(q2);
    const pxQ3 = getPx(q3);
    
    // Fences clamped to min/max for whiskers
    const pxMinWhisk = getPx(Math.max(min, lowerFence));
    const pxMaxWhisk = getPx(Math.min(max, upperFence));

    ctx.strokeStyle = '#334155'; // slate-700
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(148, 163, 184, 0.3)'; // slate-400

    // Whiskers
    ctx.beginPath();
    ctx.moveTo(pxMinWhisk, boxY);
    ctx.lineTo(pxQ1, boxY);
    ctx.moveTo(pxQ3, boxY);
    ctx.lineTo(pxMaxWhisk, boxY);
    ctx.stroke();

    // Whisker ends
    ctx.beginPath();
    ctx.moveTo(pxMinWhisk, boxY - boxH/4);
    ctx.lineTo(pxMinWhisk, boxY + boxH/4);
    ctx.moveTo(pxMaxWhisk, boxY - boxH/4);
    ctx.lineTo(pxMaxWhisk, boxY + boxH/4);
    ctx.stroke();

    // Box
    ctx.fillRect(pxQ1, boxY - boxH/2, pxQ3 - pxQ1, boxH);
    ctx.strokeRect(pxQ1, boxY - boxH/2, pxQ3 - pxQ1, boxH);

    // Median
    ctx.beginPath();
    ctx.moveTo(pxQ2, boxY - boxH/2);
    ctx.lineTo(pxQ2, boxY + boxH/2);
    ctx.strokeStyle = '#0f172a'; // slate-900
    ctx.stroke();

    // Outliers
    ctx.fillStyle = '#ef4444'; // red-500
    outliers.forEach(outVal => {
      const px = getPx(outVal);
      ctx.beginPath();
      ctx.arc(px, boxY, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Labels for Box Plot
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Min', pxMinWhisk, boxY + boxH/2 + 12);
    ctx.fillText('Max', pxMaxWhisk, boxY + boxH/2 + 12);

  }, [stats]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px] w-full aspect-[2/1] relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={400} 
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
