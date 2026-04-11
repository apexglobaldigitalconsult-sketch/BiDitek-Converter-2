export const TOLERANCE = 0.0001;

export function degToRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function radToDeg(rad: number): number {
  return rad * (180 / Math.PI);
}

export interface TriangleData {
  a: number; b: number; c: number;
  A: number; B: number; C: number; // in radians
}

export interface DerivedProperties {
  perimeter: number;
  area: number;
  h_a: number; h_b: number; h_c: number;
  r: number; R: number;
  m_a: number; m_b: number; m_c: number;
}

export interface TriangleClassification {
  byAngle: 'Equiangular' | 'Acute' | 'Right' | 'Obtuse';
  bySide: 'Equilateral' | 'Isosceles' | 'Scalene';
}

export function calculateDerivedProperties(t: TriangleData): DerivedProperties {
  const perimeter = t.a + t.b + t.c;
  const s = perimeter / 2;
  const area = Math.sqrt(s * (s - t.a) * (s - t.b) * (s - t.c));
  
  const h_a = (2 * area) / t.a;
  const h_b = (2 * area) / t.b;
  const h_c = (2 * area) / t.c;
  
  const r = area / s;
  const R = (t.a * t.b * t.c) / (4 * area);
  
  const m_a = 0.5 * Math.sqrt(2 * t.b * t.b + 2 * t.c * t.c - t.a * t.a);
  const m_b = 0.5 * Math.sqrt(2 * t.a * t.a + 2 * t.c * t.c - t.b * t.b);
  const m_c = 0.5 * Math.sqrt(2 * t.a * t.a + 2 * t.b * t.b - t.c * t.c);

  return { perimeter, area, h_a, h_b, h_c, r, R, m_a, m_b, m_c };
}

export function classifyTriangle(t: TriangleData): TriangleClassification {
  let byAngle: TriangleClassification['byAngle'] = 'Acute';
  const angles = [t.A, t.B, t.C];
  const maxAngle = Math.max(...angles);
  
  if (Math.abs(t.A - t.B) < TOLERANCE && Math.abs(t.B - t.C) < TOLERANCE) {
    byAngle = 'Equiangular';
  } else if (Math.abs(maxAngle - Math.PI / 2) < TOLERANCE) {
    byAngle = 'Right';
  } else if (maxAngle > Math.PI / 2) {
    byAngle = 'Obtuse';
  }

  let bySide: TriangleClassification['bySide'] = 'Scalene';
  if (Math.abs(t.a - t.b) < TOLERANCE && Math.abs(t.b - t.c) < TOLERANCE) {
    bySide = 'Equilateral';
  } else if (Math.abs(t.a - t.b) < TOLERANCE || Math.abs(t.b - t.c) < TOLERANCE || Math.abs(t.a - t.c) < TOLERANCE) {
    bySide = 'Isosceles';
  }

  return { byAngle, bySide };
}

export function formatVal(val: number, isAngle: boolean = false, isDeg: boolean = false): string {
  if (isAngle && isDeg) return radToDeg(val).toFixed(4);
  return val.toFixed(4);
}
