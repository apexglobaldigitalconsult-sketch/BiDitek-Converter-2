export const SCIENTIFIC_CONSTANTS = [
  { name: "Pi", symbol: "π", value: "3.14159265358979", unit: "—" },
  { name: "Euler's Number", symbol: "e", value: "2.71828182845904", unit: "—" },
  { name: "Speed of Light", symbol: "c", value: "299792458", unit: "m/s" },
  { name: "Gravitational Constant", symbol: "G", value: "6.674e-11", unit: "N·m²/kg²" },
  { name: "Planck's Constant", symbol: "h", value: "6.626e-34", unit: "J·s" },
  { name: "Boltzmann Constant", symbol: "k", value: "1.381e-23", unit: "J/K" },
  { name: "Avogadro's Number", symbol: "Nₐ", value: "6.022e23", unit: "mol⁻¹" },
  { name: "Elementary Charge", symbol: "e", value: "1.602e-19", unit: "C" },
  { name: "Electron Mass", symbol: "mₑ", value: "9.109e-31", unit: "kg" },
  { name: "Proton Mass", symbol: "mₚ", value: "1.673e-27", unit: "kg" },
  { name: "Fine-Structure Constant", symbol: "α", value: "7.297e-3", unit: "—" },
  { name: "Gas Constant", symbol: "R", value: "8.314", unit: "J/(mol·K)" },
  { name: "Stefan-Boltzmann Constant", symbol: "σ", value: "5.671e-8", unit: "W/(m²·K⁴)" },
  { name: "Magnetic Permeability", symbol: "μ₀", value: "1.257e-6", unit: "H/m" },
  { name: "Electric Permittivity", symbol: "ε₀", value: "8.854e-12", unit: "F/m" }
];

export const UNIT_CATEGORIES = {
  Length: {
    base: 'm',
    units: {
      mm: 0.001, cm: 0.01, m: 1, km: 1000,
      in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344, 'nautical mile': 1852
    }
  },
  'Weight / Mass': {
    base: 'kg',
    units: {
      mg: 0.000001, g: 0.001, kg: 1, tonne: 1000,
      oz: 0.0283495, lb: 0.453592, stone: 6.35029
    }
  },
  Temperature: {
    base: 'K',
    units: {
      '°C': { toBase: (v: number) => v + 273.15, fromBase: (v: number) => v - 273.15 },
      '°F': { toBase: (v: number) => (v - 32) * 5/9 + 273.15, fromBase: (v: number) => (v - 273.15) * 9/5 + 32 },
      K: 1
    }
  },
  Area: {
    base: 'm²',
    units: {
      'mm²': 1e-6, 'cm²': 1e-4, 'm²': 1, 'km²': 1e6,
      'in²': 0.00064516, 'ft²': 0.092903, acre: 4046.86, hectare: 10000
    }
  },
  Volume: {
    base: 'l',
    units: {
      ml: 0.001, cl: 0.01, l: 1, 'm³': 1000,
      tsp: 0.00492892, tbsp: 0.0147868, 'fl oz': 0.0295735, cup: 0.236588, pint: 0.473176, quart: 0.946353, gallon: 3.78541
    }
  },
  Speed: {
    base: 'm/s',
    units: {
      'm/s': 1, 'km/h': 1/3.6, mph: 0.44704, knot: 0.514444, 'ft/s': 0.3048
    }
  },
  Time: {
    base: 's',
    units: {
      ms: 0.001, s: 1, min: 60, hr: 3600, day: 86400, week: 604800, month: 2629800, year: 31557600
    }
  },
  Data: {
    base: 'byte',
    units: {
      bit: 0.125, byte: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776
    }
  },
  Energy: {
    base: 'J',
    units: {
      J: 1, kJ: 1000, cal: 4.184, kcal: 4184, Wh: 3600, kWh: 3600000, BTU: 1055.06
    }
  },
  Pressure: {
    base: 'Pa',
    units: {
      Pa: 1, kPa: 1000, bar: 100000, psi: 6894.76, atm: 101325, mmHg: 133.322
    }
  }
};
