export type Category = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed' | 'data' | 'time';

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  factor?: number;
}

export const LENGTH_UNITS: Unit[] = [
  { id: 'mm', name: 'Millimeter', symbol: 'mm', factor: 0.001 },
  { id: 'cm', name: 'Centimeter', symbol: 'cm', factor: 0.01 },
  { id: 'm', name: 'Meter', symbol: 'm', factor: 1 },
  { id: 'km', name: 'Kilometer', symbol: 'km', factor: 1000 },
  { id: 'in', name: 'Inch', symbol: 'in', factor: 0.0254 },
  { id: 'ft', name: 'Foot', symbol: 'ft', factor: 0.3048 },
  { id: 'yd', name: 'Yard', symbol: 'yd', factor: 0.9144 },
  { id: 'mi', name: 'Mile', symbol: 'mi', factor: 1609.344 },
  { id: 'nmi', name: 'Nautical Mile', symbol: 'nmi', factor: 1852 },
  { id: 'ly', name: 'Light Year', symbol: 'ly', factor: 9.4607304725808e15 },
  { id: 'au', name: 'Astronomical Unit', symbol: 'au', factor: 149597870700 },
  { id: 'pc', name: 'Parsec', symbol: 'pc', factor: 3.08567758149137e16 },
  { id: 'um', name: 'Micrometer', symbol: 'μm', factor: 1e-6 },
  { id: 'nm', name: 'Nanometer', symbol: 'nm', factor: 1e-9 },
  { id: 'angstrom', name: 'Angstrom', symbol: 'Å', factor: 1e-10 },
];

export const WEIGHT_UNITS: Unit[] = [
  { id: 'mg', name: 'Milligram', symbol: 'mg', factor: 0.001 },
  { id: 'g', name: 'Gram', symbol: 'g', factor: 1 },
  { id: 'kg', name: 'Kilogram', symbol: 'kg', factor: 1000 },
  { id: 'tonne', name: 'Metric Ton', symbol: 't', factor: 1e6 },
  { id: 'ug', name: 'Microgram', symbol: 'μg', factor: 1e-6 },
  { id: 'oz', name: 'Ounce', symbol: 'oz', factor: 28.349523125 },
  { id: 'lb', name: 'Pound', symbol: 'lb', factor: 453.59237 },
  { id: 'stone', name: 'Stone', symbol: 'st', factor: 6350.29318 },
  { id: 'short_ton', name: 'Short Ton (US)', symbol: 'ton (US)', factor: 907184.74 },
  { id: 'long_ton', name: 'Long Ton (UK)', symbol: 'ton (UK)', factor: 1016046.9088 },
  { id: 'carat', name: 'Carat', symbol: 'ct', factor: 0.2 },
  { id: 'troy_oz', name: 'Troy Ounce', symbol: 'ozt', factor: 31.1034768 },
  { id: 'troy_lb', name: 'Troy Pound', symbol: 'lbt', factor: 373.2417216 },
];

export const TEMPERATURE_UNITS: Unit[] = [
  { id: 'c', name: 'Celsius', symbol: '°C' },
  { id: 'f', name: 'Fahrenheit', symbol: '°F' },
  { id: 'k', name: 'Kelvin', symbol: 'K' },
  { id: 'r', name: 'Rankine', symbol: '°R' },
  { id: 'de', name: 'Delisle', symbol: '°De' },
  { id: 'n', name: 'Newton', symbol: '°N' },
  { id: 're', name: 'Réaumur', symbol: '°Ré' },
  { id: 'ro', name: 'Rømer', symbol: '°Rø' },
];

export const AREA_UNITS: Unit[] = [
  { id: 'mm2', name: 'Square Millimeter', symbol: 'mm²', factor: 1e-6 },
  { id: 'cm2', name: 'Square Centimeter', symbol: 'cm²', factor: 1e-4 },
  { id: 'm2', name: 'Square Meter', symbol: 'm²', factor: 1 },
  { id: 'ha', name: 'Hectare', symbol: 'ha', factor: 1e4 },
  { id: 'km2', name: 'Square Kilometer', symbol: 'km²', factor: 1e6 },
  { id: 'in2', name: 'Square Inch', symbol: 'sq in', factor: 0.00064516 },
  { id: 'ft2', name: 'Square Foot', symbol: 'sq ft', factor: 0.09290304 },
  { id: 'yd2', name: 'Square Yard', symbol: 'sq yd', factor: 0.83612736 },
  { id: 'acre', name: 'Acre', symbol: 'ac', factor: 4046.8564224 },
  { id: 'mi2', name: 'Square Mile', symbol: 'sq mi', factor: 2589988.110336 },
  { id: 'nmi2', name: 'Square Nautical Mile', symbol: 'sq nmi', factor: 3429904 },
  { id: 'barn', name: 'Barn', symbol: 'b', factor: 1e-28 },
];

export const VOLUME_UNITS: Unit[] = [
  { id: 'ml', name: 'Milliliter', symbol: 'mL', factor: 0.001 },
  { id: 'cl', name: 'Centiliter', symbol: 'cL', factor: 0.01 },
  { id: 'dl', name: 'Deciliter', symbol: 'dL', factor: 0.1 },
  { id: 'l', name: 'Liter', symbol: 'L', factor: 1 },
  { id: 'm3', name: 'Cubic Meter', symbol: 'm³', factor: 1000 },
  { id: 'cm3', name: 'Cubic Centimeter', symbol: 'cm³', factor: 0.001 },
  { id: 'in3', name: 'Cubic Inch', symbol: 'cu in', factor: 0.016387064 },
  { id: 'ft3', name: 'Cubic Foot', symbol: 'cu ft', factor: 28.316846592 },
  { id: 'yd3', name: 'Cubic Yard', symbol: 'cu yd', factor: 764.554857984 },
  { id: 'us_tsp', name: 'US Teaspoon', symbol: 'US tsp', factor: 0.00492892159375 },
  { id: 'us_tbsp', name: 'US Tablespoon', symbol: 'US tbsp', factor: 0.01478676478125 },
  { id: 'us_floz', name: 'US Fluid Ounce', symbol: 'US fl oz', factor: 0.0295735295625 },
  { id: 'us_cup', name: 'US Cup', symbol: 'US cup', factor: 0.2365882365 },
  { id: 'us_pt', name: 'US Pint', symbol: 'US pt', factor: 0.473176473 },
  { id: 'us_qt', name: 'US Quart', symbol: 'US qt', factor: 0.946352946 },
  { id: 'us_gal', name: 'US Gallon', symbol: 'US gal', factor: 3.785411784 },
  { id: 'imp_tsp', name: 'Imperial Teaspoon', symbol: 'Imp tsp', factor: 0.0059193880208333 },
  { id: 'imp_tbsp', name: 'Imperial Tablespoon', symbol: 'Imp tbsp', factor: 0.0177581640625 },
  { id: 'imp_floz', name: 'Imperial Fluid Ounce', symbol: 'Imp fl oz', factor: 0.0284130625 },
  { id: 'imp_cup', name: 'Imperial Cup', symbol: 'Imp cup', factor: 0.284130625 },
  { id: 'imp_pt', name: 'Imperial Pint', symbol: 'Imp pt', factor: 0.56826125 },
  { id: 'imp_qt', name: 'Imperial Quart', symbol: 'Imp qt', factor: 1.1365225 },
  { id: 'imp_gal', name: 'Imperial Gallon', symbol: 'Imp gal', factor: 4.54609 },
  { id: 'barrel_oil', name: 'Barrel (oil)', symbol: 'bbl', factor: 158.987294928 },
];

export const SPEED_UNITS: Unit[] = [
  { id: 'm_s', name: 'Meters per Second', symbol: 'm/s', factor: 1 },
  { id: 'km_h', name: 'Kilometers per Hour', symbol: 'km/h', factor: 0.27777777777778 },
  { id: 'mph', name: 'Miles per Hour', symbol: 'mph', factor: 0.44704 },
  { id: 'ft_s', name: 'Feet per Second', symbol: 'ft/s', factor: 0.3048 },
  { id: 'knot', name: 'Knots', symbol: 'kn', factor: 0.51444444444444 },
  { id: 'mach', name: 'Mach (at sea level, 20°C)', symbol: 'Ma', factor: 343 },
  { id: 'c', name: 'Speed of Light', symbol: 'c', factor: 299792458 },
  { id: 'sound', name: 'Speed of Sound (in air)', symbol: 'sound', factor: 343 },
];

export const DATA_STORAGE_SI_UNITS: Unit[] = [
  { id: 'bit', name: 'Bit', symbol: 'bit', factor: 0.125 },
  { id: 'nibble', name: 'Nibble', symbol: 'nibble', factor: 0.5 },
  { id: 'byte', name: 'Byte', symbol: 'B', factor: 1 },
  { id: 'kb', name: 'Kilobyte', symbol: 'KB', factor: 1e3 },
  { id: 'mb', name: 'Megabyte', symbol: 'MB', factor: 1e6 },
  { id: 'gb', name: 'Gigabyte', symbol: 'GB', factor: 1e9 },
  { id: 'tb', name: 'Terabyte', symbol: 'TB', factor: 1e12 },
  { id: 'pb', name: 'Petabyte', symbol: 'PB', factor: 1e15 },
  { id: 'eb', name: 'Exabyte', symbol: 'EB', factor: 1e18 },
];

export const DATA_STORAGE_IEC_UNITS: Unit[] = [
  { id: 'bit', name: 'Bit', symbol: 'bit', factor: 0.125 },
  { id: 'nibble', name: 'Nibble', symbol: 'nibble', factor: 0.5 },
  { id: 'byte', name: 'Byte', symbol: 'B', factor: 1 },
  { id: 'kib', name: 'Kibibyte', symbol: 'KiB', factor: 1024 },
  { id: 'mib', name: 'Mebibyte', symbol: 'MiB', factor: 1048576 },
  { id: 'gib', name: 'Gibibyte', symbol: 'GiB', factor: 1073741824 },
  { id: 'tib', name: 'Tebibyte', symbol: 'TiB', factor: 1099511627776 },
  { id: 'pib', name: 'Pebibyte', symbol: 'PiB', factor: 1125899906842624 },
  { id: 'eib', name: 'Exbibyte', symbol: 'EiB', factor: 1152921504606846976 },
];

export const DATA_TRANSFER_UNITS: Unit[] = [
  { id: 'bps', name: 'Bits per second', symbol: 'bps', factor: 0.125 },
  { id: 'kbps', name: 'Kilobits/s', symbol: 'kbps', factor: 125 },
  { id: 'mbps', name: 'Megabits/s', symbol: 'Mbps', factor: 125000 },
  { id: 'gbps', name: 'Gigabits/s', symbol: 'Gbps', factor: 125000000 },
  { id: 'Bps', name: 'Bytes per second', symbol: 'B/s', factor: 1 },
  { id: 'KBps', name: 'Kilobytes/s', symbol: 'KB/s', factor: 1000 },
  { id: 'MBps', name: 'Megabytes/s', symbol: 'MB/s', factor: 1000000 },
  { id: 'GBps', name: 'Gigabytes/s', symbol: 'GB/s', factor: 1000000000 },
];

export const TIME_UNITS: Unit[] = [
  { id: 'ns', name: 'Nanosecond', symbol: 'ns', factor: 1e-9 },
  { id: 'us', name: 'Microsecond', symbol: 'μs', factor: 1e-6 },
  { id: 'ms', name: 'Millisecond', symbol: 'ms', factor: 0.001 },
  { id: 's', name: 'Second', symbol: 's', factor: 1 },
  { id: 'min', name: 'Minute', symbol: 'min', factor: 60 },
  { id: 'hr', name: 'Hour', symbol: 'hr', factor: 3600 },
  { id: 'day', name: 'Day', symbol: 'd', factor: 86400 },
  { id: 'week', name: 'Week', symbol: 'wk', factor: 604800 },
  { id: 'fortnight', name: 'Fortnight', symbol: 'ftn', factor: 1209600 },
  { id: 'month', name: 'Month', symbol: 'mo', factor: 2629800 },
  { id: 'year', name: 'Year', symbol: 'yr', factor: 31557600 },
  { id: 'decade', name: 'Decade', symbol: 'dec', factor: 315576000 },
  { id: 'century', name: 'Century', symbol: 'c', factor: 3155760000 },
  { id: 'millennium', name: 'Millennium', symbol: 'ky', factor: 31557600000 },
];

export function convertValue(value: number, fromId: string, toId: string, units: Unit[]): number {
  if (fromId === toId) return value;
  const fromUnit = units.find(u => u.id === fromId);
  const toUnit = units.find(u => u.id === toId);
  if (!fromUnit || !toUnit || fromUnit.factor === undefined || toUnit.factor === undefined) return 0;
  
  const valueInBase = value * fromUnit.factor;
  return valueInBase / toUnit.factor;
}

export function convertTemperature(value: number, fromId: string, toId: string): number {
  if (fromId === toId) return value;
  
  // Convert to Celsius first
  let c = value;
  switch (fromId) {
    case 'f': c = (value - 32) * 5/9; break;
    case 'k': c = value - 273.15; break;
    case 'r': c = (value * 5/9) - 273.15; break;
    case 'de': c = 100 - (value * 2/3); break;
    case 'n': c = value * 100/33; break;
    case 're': c = value * 5/4; break;
    case 'ro': c = (value - 7.5) * 40/21; break;
  }
  
  // Convert from Celsius to target
  switch (toId) {
    case 'c': return c;
    case 'f': return (c * 9/5) + 32;
    case 'k': return c + 273.15;
    case 'r': return (c + 273.15) * 9/5;
    case 'de': return (100 - c) * 3/2;
    case 'n': return c * 33/100;
    case 're': return c * 4/5;
    case 'ro': return (c * 21/40) + 7.5;
  }
  return 0;
}

export function formatNumber(num: number): string {
  if (num === 0) return '0';
  const absNum = Math.abs(num);
  
  if (absNum >= 0.001 && absNum <= 9999999) {
    return parseFloat(num.toPrecision(10)).toString();
  } else {
    let formatted = num.toExponential(9);
    formatted = formatted.replace(/(\.\d*?[1-9])0+e/, '$1e').replace(/\.0+e/, 'e');
    return formatted.replace('e+', ' × 10^').replace('e', ' × 10^').replace('e-', ' × 10^-');
  }
}

export interface HistoryEntry {
  id: string;
  category: string;
  fromValue: number;
  fromUnit: string;
  toValue: number;
  toUnit: string;
  timestamp: Date;
}
