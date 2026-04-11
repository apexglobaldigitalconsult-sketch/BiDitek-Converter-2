import React, { useState } from 'react';
import { TriangleData, radToDeg } from './utils';

interface TriangleDiagramProps {
  triangle: TriangleData;
}

export default function TriangleDiagram({ triangle }: TriangleDiagramProps) {
  const [showAltitudes, setShowAltitudes] = useState(false);
  const [showIncircle, setShowIncircle] = useState(false);
  const [showCircumcircle, setShowCircumcircle] = useState(false);

  // Calculate vertices
  // A is at (0, 0)
  // B is at (c, 0)
  // C is at (b * cos(A), b * sin(A))
  const { a, b, c, A, B, C } = triangle;
  
  const Ax = 0, Ay = 0;
  const Bx = c, By = 0;
  const Cx = b * Math.cos(A), Cy = b * Math.sin(A);

  // Bounding box
  const minX = Math.min(Ax, Bx, Cx);
  const maxX = Math.max(Ax, Bx, Cx);
  const minY = Math.min(Ay, By, Cy);
  const maxY = Math.max(Ay, By, Cy);

  const width = maxX - minX;
  const height = maxY - minY;

  // Incenter
  const perimeter = a + b + c;
  const Ix = (a * Ax + b * Bx + c * Cx) / perimeter;
  const Iy = (a * Ay + b * By + c * Cy) / perimeter;
  const s = perimeter / 2;
  const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
  const r = area / s;

  // Circumcenter
  const D = 2 * (Ax * (By - Cy) + Bx * (Cy - Ay) + Cx * (Ay - By));
  const Ux = ((Ax * Ax + Ay * Ay) * (By - Cy) + (Bx * Bx + By * By) * (Cy - Ay) + (Cx * Cx + Cy * Cy) * (Ay - By)) / D;
  const Uy = ((Ax * Ax + Ay * Ay) * (Cx - Bx) + (Bx * Bx + By * By) * (Ax - Cx) + (Cx * Cx + Cy * Cy) * (Bx - Ax)) / D;
  const R = (a * b * c) / (4 * area);

  // Altitudes
  // h_c: from C to AB (y=0)
  const Hc_x = Cx, Hc_y = 0;
  // h_b: from B to AC. Line AC: y = (Cy/Cx)*x. Perpendicular from B: y - By = (-Cx/Cy)*(x - Bx)
  // Intersection:
  const m_AC = Cy / (Cx || 0.00001);
  const m_perp_B = -1 / m_AC;
  const Hb_x = (m_perp_B * Bx - By) / (m_perp_B - m_AC);
  const Hb_y = m_AC * Hb_x;
  
  // h_a: from A to BC. Line BC: y - By = ((Cy-By)/(Cx-Bx))*(x - Bx). Perpendicular from A: y = (-1/m_BC)*x
  const m_BC = (Cy - By) / (Cx - Bx || 0.00001);
  const m_perp_A = -1 / m_BC;
  const Ha_x = (m_BC * Bx - By) / (m_BC - m_perp_A);
  const Ha_y = m_perp_A * Ha_x;

  // Viewport padding and scaling
  const padding = Math.max(width, height) * 0.2; // 20% padding
  
  // If circumcircle is shown, adjust bounding box
  let finalMinX = minX - padding;
  let finalMaxX = maxX + padding;
  let finalMinY = minY - padding;
  let finalMaxY = maxY + padding;

  if (showCircumcircle) {
    finalMinX = Math.min(finalMinX, Ux - R - padding * 0.5);
    finalMaxX = Math.max(finalMaxX, Ux + R + padding * 0.5);
    finalMinY = Math.min(finalMinY, Uy - R - padding * 0.5);
    finalMaxY = Math.max(finalMaxY, Uy + R + padding * 0.5);
  }

  const viewBoxWidth = finalMaxX - finalMinX;
  const viewBoxHeight = finalMaxY - finalMinY;

  // SVG coordinate system has y pointing down, so we flip y
  const transformY = (y: number) => finalMaxY - (y - finalMinY);
  const transformX = (x: number) => x - finalMinX;

  const tAx = transformX(Ax), tAy = transformY(Ay);
  const tBx = transformX(Bx), tBy = transformY(By);
  const tCx = transformX(Cx), tCy = transformY(Cy);

  const isRight = Math.abs(A - Math.PI/2) < 0.0001 || Math.abs(B - Math.PI/2) < 0.0001 || Math.abs(C - Math.PI/2) < 0.0001;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md aspect-4/3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden relative">
        <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="w-full h-full">
          {/* Circumcircle */}
          {showCircumcircle && (
            <circle cx={transformX(Ux)} cy={transformY(Uy)} r={R} fill="none" stroke="#8b5cf6" strokeWidth={viewBoxWidth * 0.005} strokeDasharray="4,4" />
          )}
          
          {/* Incircle */}
          {showIncircle && (
            <circle cx={transformX(Ix)} cy={transformY(Iy)} r={r} fill="none" stroke="#10b981" strokeWidth={viewBoxWidth * 0.005} strokeDasharray="4,4" />
          )}

          {/* Altitudes */}
          {showAltitudes && (
            <>
              <line x1={tCx} y1={tCy} x2={transformX(Hc_x)} y2={transformY(Hc_y)} stroke="#f59e0b" strokeWidth={viewBoxWidth * 0.005} strokeDasharray="4,4" />
              <line x1={tBx} y1={tBy} x2={transformX(Hb_x)} y2={transformY(Hb_y)} stroke="#f59e0b" strokeWidth={viewBoxWidth * 0.005} strokeDasharray="4,4" />
              <line x1={tAx} y1={tAy} x2={transformX(Ha_x)} y2={transformY(Ha_y)} stroke="#f59e0b" strokeWidth={viewBoxWidth * 0.005} strokeDasharray="4,4" />
            </>
          )}

          {/* Triangle Edges */}
          <polygon points={`${tAx},${tAy} ${tBx},${tBy} ${tCx},${tCy}`} fill="rgba(99, 102, 241, 0.1)" stroke="#4f46e5" strokeWidth={viewBoxWidth * 0.01} strokeLinejoin="round" />

          {/* Right Angle Marker (if applicable) */}
          {isRight && (
            <g stroke="#4f46e5" strokeWidth={viewBoxWidth * 0.005} fill="none">
              {Math.abs(A - Math.PI/2) < 0.0001 && (
                <polyline points={`${tAx + (tBx-tAx)*0.1},${tAy + (tBy-tAy)*0.1} ${tAx + (tBx-tAx)*0.1 + (tCx-tAx)*0.1},${tAy + (tBy-tAy)*0.1 + (tCy-tAy)*0.1} ${tAx + (tCx-tAx)*0.1},${tAy + (tCy-tAy)*0.1}`} />
              )}
              {Math.abs(B - Math.PI/2) < 0.0001 && (
                <polyline points={`${tBx + (tAx-tBx)*0.1},${tBy + (tAy-tBy)*0.1} ${tBx + (tAx-tBx)*0.1 + (tCx-tBx)*0.1},${tBy + (tAy-tBy)*0.1 + (tCy-tBy)*0.1} ${tBx + (tCx-tBx)*0.1},${tBy + (tCy-tBy)*0.1}`} />
              )}
              {Math.abs(C - Math.PI/2) < 0.0001 && (
                <polyline points={`${tCx + (tAx-tCx)*0.1},${tCy + (tAy-tCy)*0.1} ${tCx + (tAx-tCx)*0.1 + (tBx-tCx)*0.1},${tCy + (tAy-tCy)*0.1 + (tBy-tCy)*0.1} ${tCx + (tBx-tCx)*0.1},${tCy + (tBy-tCy)*0.1}`} />
              )}
            </g>
          )}

          {/* Vertex Labels */}
          <text x={tAx - viewBoxWidth*0.02} y={tAy + viewBoxHeight*0.04} fontSize={viewBoxWidth*0.04} fontWeight="bold" fill="#1e293b" className="dark:fill-slate-200">A</text>
          <text x={tBx + viewBoxWidth*0.02} y={tBy + viewBoxHeight*0.04} fontSize={viewBoxWidth*0.04} fontWeight="bold" fill="#1e293b" className="dark:fill-slate-200">B</text>
          <text x={tCx} y={tCy - viewBoxHeight*0.02} fontSize={viewBoxWidth*0.04} fontWeight="bold" fill="#1e293b" textAnchor="middle" className="dark:fill-slate-200">C</text>

          {/* Side Labels */}
          <text x={(tBx+tCx)/2 + viewBoxWidth*0.02} y={(tBy+tCy)/2} fontSize={viewBoxWidth*0.035} fill="#475569" className="dark:fill-slate-400">a</text>
          <text x={(tAx+tCx)/2 - viewBoxWidth*0.02} y={(tAy+tCy)/2} fontSize={viewBoxWidth*0.035} fill="#475569" className="dark:fill-slate-400">b</text>
          <text x={(tAx+tBx)/2} y={(tAy+tBy)/2 + viewBoxHeight*0.04} fontSize={viewBoxWidth*0.035} fill="#475569" textAnchor="middle" className="dark:fill-slate-400">c</text>

          {/* Angle Labels */}
          <text x={tAx + viewBoxWidth*0.05} y={tAy - viewBoxHeight*0.01} fontSize={viewBoxWidth*0.025} fill="#64748b" className="dark:fill-slate-500">{radToDeg(A).toFixed(1)}°</text>
          <text x={tBx - viewBoxWidth*0.05} y={tBy - viewBoxHeight*0.01} fontSize={viewBoxWidth*0.025} fill="#64748b" textAnchor="end" className="dark:fill-slate-500">{radToDeg(B).toFixed(1)}°</text>
          <text x={tCx} y={tCy + viewBoxHeight*0.05} fontSize={viewBoxWidth*0.025} fill="#64748b" textAnchor="middle" className="dark:fill-slate-500">{radToDeg(C).toFixed(1)}°</text>
        </svg>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={showAltitudes} onChange={e=>setShowAltitudes(e.target.checked)} className="rounded border-slate-300 text-amber-500 focus:ring-amber-500" />
          Altitudes
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={showIncircle} onChange={e=>setShowIncircle(e.target.checked)} className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
          Incircle
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={showCircumcircle} onChange={e=>setShowCircumcircle(e.target.checked)} className="rounded border-slate-300 text-violet-500 focus:ring-violet-500" />
          Circumcircle
        </label>
      </div>
    </div>
  );
}
