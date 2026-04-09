import React, { useState, useRef, useEffect } from 'react';

export default function GraphMode() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [funcs, setFuncs] = useState([{ expr: 'sin(x)', color: '#4f46e5' }, { expr: '', color: '#e11d48' }, { expr: '', color: '#16a34a' }]);
  const [range, setRange] = useState({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const { xMin, xMax, yMin, yMax } = range;
    const scaleX = width / (xMax - xMin);
    const scaleY = height / (yMax - yMin);

    const toCanvasX = (x: number) => (x - xMin) * scaleX;
    const toCanvasY = (y: number) => height - (y - yMin) * scaleY;

    // Draw Grid
    ctx.strokeStyle = '#e2e8f0'; // slate-200
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      ctx.moveTo(toCanvasX(x), 0); ctx.lineTo(toCanvasX(x), height);
    }
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      ctx.moveTo(0, toCanvasY(y)); ctx.lineTo(width, toCanvasY(y));
    }
    ctx.stroke();

    // Draw Axes
    ctx.strokeStyle = '#64748b'; // slate-500
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(toCanvasX(0), 0); ctx.lineTo(toCanvasX(0), height);
    ctx.moveTo(0, toCanvasY(0)); ctx.lineTo(width, toCanvasY(0));
    ctx.stroke();

    // Draw Functions
    funcs.forEach(f => {
      if (!f.expr.trim()) return;
      ctx.strokeStyle = f.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      let parsed = f.expr.replace(/sin/g, 'Math.sin').replace(/cos/g, 'Math.cos').replace(/tan/g, 'Math.tan')
        .replace(/sqrt/g, 'Math.sqrt').replace(/log/g, 'Math.log10').replace(/ln/g, 'Math.log')
        .replace(/abs/g, 'Math.abs').replace(/pi/g, 'Math.PI').replace(/e/g, 'Math.E').replace(/\^/g, '**');

      let first = true;
      for (let px = 0; px <= width; px += 2) {
        const x = xMin + px / scaleX;
        try {
          const y = new Function('x', `return ${parsed}`)(x);
          if (isFinite(y)) {
            const py = toCanvasY(y);
            if (first) { ctx.moveTo(px, py); first = false; }
            else ctx.lineTo(px, py);
          } else { first = true; }
        } catch { first = true; }
      }
      ctx.stroke();
    });
  };

  useEffect(() => { drawGraph(); }, [funcs, range]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoom = e.deltaY > 0 ? 1.1 : 0.9;
    const cx = (range.xMin + range.xMax) / 2;
    const cy = (range.yMin + range.yMax) / 2;
    const dx = (range.xMax - range.xMin) * zoom / 2;
    const dy = (range.yMax - range.yMin) * zoom / 2;
    setRange({ xMin: cx - dx, xMax: cx + dx, yMin: cy - dy, yMax: cy + dy });
  };

  const handleMouseDown = (e: React.MouseEvent) => { setIsDragging(true); setLastMouse({ x: e.clientX, y: e.clientY }); };
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = (e.clientX - lastMouse.x) * (range.xMax - range.xMin) / 600;
    const dy = (e.clientY - lastMouse.y) * (range.yMax - range.yMin) / 400;
    setRange(r => ({ xMin: r.xMin - dx, xMax: r.xMax - dx, yMin: r.yMin + dy, yMax: r.yMax + dy }));
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {funcs.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: f.color }} />
            <input 
              type="text" 
              value={f.expr} 
              onChange={e => { const newF = [...funcs]; newF[i].expr = e.target.value; setFuncs(newF); }}
              placeholder={`f${i+1}(x) = ...`}
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-sm"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">X Range:</span>
          <input type="number" value={range.xMin} onChange={e => setRange(r => ({...r, xMin: Number(e.target.value)}))} className="w-16 p-1 text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
          <span>to</span>
          <input type="number" value={range.xMax} onChange={e => setRange(r => ({...r, xMax: Number(e.target.value)}))} className="w-16 p-1 text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Y Range:</span>
          <input type="number" value={range.yMin} onChange={e => setRange(r => ({...r, yMin: Number(e.target.value)}))} className="w-16 p-1 text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
          <span>to</span>
          <input type="number" value={range.yMax} onChange={e => setRange(r => ({...r, yMax: Number(e.target.value)}))} className="w-16 p-1 text-sm rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" />
        </div>
        <button onClick={() => setRange({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 })} className="ml-auto px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 text-sm font-medium">
          Reset Zoom
        </button>
      </div>

      <div className="relative w-full h-[400px] bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden cursor-move">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-full"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        />
      </div>
    </div>
  );
}
