export type UnitSystem = 'imperial' | 'metric';
export type BagSize = '40lb' | '60lb' | '80lb';
export type PriceMode = 'yard' | 'bag';
export type RebarSize = '#3' | '#4' | '#5';

export const BAG_YIELDS_CU_FT: Record<BagSize, number> = {
  '40lb': 0.30,
  '60lb': 0.45,
  '80lb': 0.60
};

export const REBAR_WEIGHTS_LB_PER_FT: Record<RebarSize, number> = {
  '#3': 0.376,
  '#4': 0.668,
  '#5': 1.043
};

export const M_TO_FT = 3.28084;
export const CM_TO_IN = 0.393701;
export const FT_TO_M = 1 / M_TO_FT;
export const IN_TO_CM = 1 / CM_TO_IN;

export interface ConcreteResult {
  exactVolumeCuFt: number;
  exactVolumeCuYd: number;
  exactVolumeCuM: number;
  overageVolumeCuFt: number;
  overageVolumeCuYd: number;
  overageVolumeCuM: number;
  exactBags: number;
  overageBags: number;
  exactCost: number;
  overageCost: number;
  
  // Specific to stairs
  stairsVolumeCuFt?: number;
  landingVolumeCuFt?: number;
  totalRiseIn?: number;
  totalRunIn?: number;

  // Specific to rebar
  rebar?: {
    longitudinalFt: number;
    transverseFt: number;
    verticalFt: number;
    tiesFt: number;
    totalFt: number;
    totalM: number;
    totalLb: number;
    totalKg: number;
  }
}

export function calculateConcreteBase(
  volumeCuFt: number, 
  overagePct: number, 
  bagSize: BagSize, 
  price: number, 
  priceMode: PriceMode
): ConcreteResult {
  const overageVolumeCuFt = volumeCuFt * (1 + overagePct / 100);
  
  const exactVolumeCuYd = volumeCuFt / 27;
  const exactVolumeCuM = volumeCuFt * 0.0283168;
  
  const overageVolumeCuYd = overageVolumeCuFt / 27;
  const overageVolumeCuM = overageVolumeCuFt * 0.0283168;

  const bagYield = BAG_YIELDS_CU_FT[bagSize];
  const exactBags = Math.ceil(volumeCuFt / bagYield);
  const overageBags = Math.ceil(overageVolumeCuFt / bagYield);

  let exactCost = 0;
  let overageCost = 0;

  if (priceMode === 'yard') {
    // If metric, user might expect price per cubic meter? 
    // The prompt says "cost per cubic yard OR cost per bag". We'll stick to cubic yard.
    exactCost = exactVolumeCuYd * price;
    overageCost = overageVolumeCuYd * price;
  } else {
    exactCost = exactBags * price;
    overageCost = overageBags * price;
  }

  return {
    exactVolumeCuFt: volumeCuFt,
    exactVolumeCuYd,
    exactVolumeCuM,
    overageVolumeCuFt,
    overageVolumeCuYd,
    overageVolumeCuM,
    exactBags,
    overageBags,
    exactCost,
    overageCost
  };
}

export const toFt = (val: number, isMetric: boolean) => isMetric ? val * M_TO_FT : val;
export const inToFt = (val: number, isMetric: boolean) => isMetric ? (val * CM_TO_IN) / 12 : val / 12;
