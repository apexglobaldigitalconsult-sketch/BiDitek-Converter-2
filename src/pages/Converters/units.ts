export type Category = 'Length' | 'Weight / Mass' | 'Temperature' | 'Area' | 'Volume' | 'Speed' | 'Time' | 'Data / Storage' | 'Energy' | 'Pressure' | 'Angle' | 'Fuel Economy';

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  factor?: number; // Multiplier to base unit (for linear)
}

export const CATEGORIES: Category[] = [
  'Length', 'Weight / Mass', 'Temperature', 'Area', 'Volume', 'Speed', 'Time', 'Data / Storage', 'Energy', 'Pressure', 'Angle', 'Fuel Economy'
];

export const UNITS: Record<Category, Unit[]> = {
  'Length': [
    { id: 'm', name: 'Meter', symbol: 'm', factor: 1 },
    { id: 'mm', name: 'Millimeter', symbol: 'mm', factor: 0.001 },
    { id: 'cm', name: 'Centimeter', symbol: 'cm', factor: 0.01 },
    { id: 'km', name: 'Kilometer', symbol: 'km', factor: 1000 },
    { id: 'in', name: 'Inch', symbol: 'in', factor: 0.0254 },
    { id: 'ft', name: 'Foot', symbol: 'ft', factor: 0.3048 },
    { id: 'yd', name: 'Yard', symbol: 'yd', factor: 0.9144 },
    { id: 'mi', name: 'Mile', symbol: 'mi', factor: 1609.344 },
    { id: 'nmi', name: 'Nautical Mile', symbol: 'nmi', factor: 1852 },
    { id: 'ly', name: 'Light Year', symbol: 'ly', factor: 9.461e15 },
    { id: 'um', name: 'Micrometer', symbol: 'µm', factor: 0.000001 },
  ],
  'Weight / Mass': [
    { id: 'kg', name: 'Kilogram', symbol: 'kg', factor: 1 },
    { id: 'ug', name: 'Microgram', symbol: 'µg', factor: 1e-9 },
    { id: 'mg', name: 'Milligram', symbol: 'mg', factor: 0.000001 },
    { id: 'g', name: 'Gram', symbol: 'g', factor: 0.001 },
    { id: 't', name: 'Metric Tonne', symbol: 't', factor: 1000 },
    { id: 'oz', name: 'Ounce', symbol: 'oz', factor: 0.0283495 },
    { id: 'lb', name: 'Pound', symbol: 'lb', factor: 0.453592 },
    { id: 'st', name: 'Stone', symbol: 'st', factor: 6.35029 },
    { id: 'ton_us', name: 'US Ton', symbol: 'ton', factor: 907.185 },
    { id: 'ton_uk', name: 'Imperial Ton', symbol: 'ton', factor: 1016.05 },
  ],
  'Temperature': [
    { id: 'c', name: 'Celsius', symbol: '°C' },
    { id: 'f', name: 'Fahrenheit', symbol: '°F' },
    { id: 'k', name: 'Kelvin', symbol: 'K' },
    { id: 'r', name: 'Rankine', symbol: '°R' },
  ],
  'Area': [
    { id: 'm2', name: 'Square meter', symbol: 'm²', factor: 1 },
    { id: 'mm2', name: 'Square millimeter', symbol: 'mm²', factor: 0.000001 },
    { id: 'cm2', name: 'Square centimeter', symbol: 'cm²', factor: 0.0001 },
    { id: 'km2', name: 'Square kilometer', symbol: 'km²', factor: 1000000 },
    { id: 'in2', name: 'Square inch', symbol: 'in²', factor: 0.00064516 },
    { id: 'ft2', name: 'Square foot', symbol: 'ft²', factor: 0.092903 },
    { id: 'yd2', name: 'Square yard', symbol: 'yd²', factor: 0.836127 },
    { id: 'acre', name: 'Acre', symbol: 'acre', factor: 4046.86 },
    { id: 'ha', name: 'Hectare', symbol: 'ha', factor: 10000 },
    { id: 'mi2', name: 'Square mile', symbol: 'mi²', factor: 2589988 },
  ],
  'Volume': [
    { id: 'l', name: 'Liter', symbol: 'L', factor: 1 },
    { id: 'ml', name: 'Milliliter', symbol: 'ml', factor: 0.001 },
    { id: 'cl', name: 'Centiliter', symbol: 'cl', factor: 0.01 },
    { id: 'm3', name: 'Cubic meter', symbol: 'm³', factor: 1000 },
    { id: 'tsp', name: 'Teaspoon US', symbol: 'tsp', factor: 0.00492892 },
    { id: 'tbsp', name: 'Tablespoon US', symbol: 'tbsp', factor: 0.0147868 },
    { id: 'floz', name: 'Fluid Ounce US', symbol: 'fl oz', factor: 0.0295735 },
    { id: 'cup', name: 'Cup US', symbol: 'cup', factor: 0.236588 },
    { id: 'pt', name: 'Pint US', symbol: 'pt', factor: 0.473176 },
    { id: 'qt', name: 'Quart US', symbol: 'qt', factor: 0.946353 },
    { id: 'gal', name: 'Gallon US', symbol: 'gal', factor: 3.78541 },
    { id: 'pt_uk', name: 'Pint UK', symbol: 'pt', factor: 0.568261 },
    { id: 'gal_uk', name: 'Gallon UK', symbol: 'gal', factor: 4.54609 },
    { id: 'in3', name: 'Cubic inch', symbol: 'in³', factor: 0.0163871 },
    { id: 'ft3', name: 'Cubic foot', symbol: 'ft³', factor: 28.3168 },
  ],
  'Speed': [
    { id: 'ms', name: 'Meter per second', symbol: 'm/s', factor: 1 },
    { id: 'kmh', name: 'Kilometer per hour', symbol: 'km/h', factor: 0.277778 },
    { id: 'mph', name: 'Mile per hour', symbol: 'mph', factor: 0.44704 },
    { id: 'knot', name: 'Knot', symbol: 'knot', factor: 0.514444 },
    { id: 'fts', name: 'Foot per second', symbol: 'ft/s', factor: 0.3048 },
    { id: 'mach', name: 'Mach (at sea level)', symbol: 'Mach', factor: 340.29 },
  ],
  'Time': [
    { id: 's', name: 'Second', symbol: 's', factor: 1 },
    { id: 'ms', name: 'Millisecond', symbol: 'ms', factor: 0.001 },
    { id: 'min', name: 'Minute', symbol: 'min', factor: 60 },
    { id: 'hr', name: 'Hour', symbol: 'hr', factor: 3600 },
    { id: 'day', name: 'Day', symbol: 'day', factor: 86400 },
    { id: 'week', name: 'Week', symbol: 'week', factor: 604800 },
    { id: 'month', name: 'Month (avg)', symbol: 'month', factor: 2629746 },
    { id: 'year', name: 'Year (avg)', symbol: 'year', factor: 31556952 },
    { id: 'decade', name: 'Decade', symbol: 'decade', factor: 315569520 },
    { id: 'century', name: 'Century', symbol: 'century', factor: 3155695200 },
  ],
  'Data / Storage': [
    { id: 'b', name: 'Byte', symbol: 'B', factor: 1 },
    { id: 'bit', name: 'Bit', symbol: 'bit', factor: 0.125 },
    { id: 'kb', name: 'Kilobyte', symbol: 'KB', factor: 1024 },
    { id: 'mb', name: 'Megabyte', symbol: 'MB', factor: 1048576 },
    { id: 'gb', name: 'Gigabyte', symbol: 'GB', factor: 1073741824 },
    { id: 'tb', name: 'Terabyte', symbol: 'TB', factor: 1099511627776 },
    { id: 'pb', name: 'Petabyte', symbol: 'PB', factor: 1125899906842624 },
    { id: 'kib', name: 'Kibibyte', symbol: 'KiB', factor: 1024 },
    { id: 'mib', name: 'Mebibyte', symbol: 'MiB', factor: 1048576 },
  ],
  'Energy': [
    { id: 'j', name: 'Joule', symbol: 'J', factor: 1 },
    { id: 'kj', name: 'Kilojoule', symbol: 'kJ', factor: 1000 },
    { id: 'cal', name: 'Calorie', symbol: 'cal', factor: 4.184 },
    { id: 'kcal', name: 'Kilocalorie', symbol: 'kcal', factor: 4184 },
    { id: 'wh', name: 'Watt-hour', symbol: 'Wh', factor: 3600 },
    { id: 'kwh', name: 'Kilowatt-hour', symbol: 'kWh', factor: 3600000 },
    { id: 'btu', name: 'BTU', symbol: 'BTU', factor: 1055.06 },
    { id: 'ev', name: 'Electronvolt', symbol: 'eV', factor: 1.60218e-19 },
    { id: 'mj', name: 'Megajoule', symbol: 'MJ', factor: 1000000 },
  ],
  'Pressure': [
    { id: 'pa', name: 'Pascal', symbol: 'Pa', factor: 1 },
    { id: 'kpa', name: 'Kilopascal', symbol: 'kPa', factor: 1000 },
    { id: 'mpa', name: 'Megapascal', symbol: 'MPa', factor: 1000000 },
    { id: 'bar', name: 'Bar', symbol: 'bar', factor: 100000 },
    { id: 'mbar', name: 'Millibar', symbol: 'mbar', factor: 100 },
    { id: 'psi', name: 'PSI', symbol: 'psi', factor: 6894.76 },
    { id: 'atm', name: 'Atmosphere', symbol: 'atm', factor: 101325 },
    { id: 'mmhg', name: 'mmHg (Torr)', symbol: 'mmHg', factor: 133.322 },
    { id: 'inhg', name: 'inHg', symbol: 'inHg', factor: 3386.39 },
  ],
  'Angle': [
    { id: 'rad', name: 'Radian', symbol: 'rad', factor: 1 },
    { id: 'deg', name: 'Degree', symbol: '°', factor: Math.PI / 180 },
    { id: 'grad', name: 'Gradian', symbol: 'grad', factor: Math.PI / 200 },
    { id: 'arcmin', name: 'Arcminute', symbol: '′', factor: Math.PI / 10800 },
    { id: 'arcsec', name: 'Arcsecond', symbol: '″', factor: Math.PI / 648000 },
    { id: 'turn', name: 'Turn (revolution)', symbol: 'turn', factor: 2 * Math.PI },
    { id: 'mrad', name: 'Milliradian', symbol: 'mrad', factor: 0.001 },
  ],
  'Fuel Economy': [
    { id: 'l100km', name: 'L/100km', symbol: 'L/100km' },
    { id: 'mpg_us', name: 'mpg (US)', symbol: 'mpg' },
    { id: 'mpg_uk', name: 'mpg (UK)', symbol: 'mpg' },
    { id: 'kml', name: 'km/L', symbol: 'km/L' },
  ],
};

export function convert(value: number, fromId: string, toId: string, category: Category): { result: number, formula: string } {
  if (fromId === toId) return { result: value, formula: `result = ${value}` };

  if (category === 'Temperature') {
    let c = 0;
    let formula1 = '';
    if (fromId === 'c') { c = value; formula1 = `C = ${value}`; }
    else if (fromId === 'f') { c = (value - 32) * 5/9; formula1 = `C = (${value} - 32) × 5/9 = ${c}`; }
    else if (fromId === 'k') { c = value - 273.15; formula1 = `C = ${value} - 273.15 = ${c}`; }
    else if (fromId === 'r') { c = (value - 491.67) * 5/9; formula1 = `C = (${value} - 491.67) × 5/9 = ${c}`; }

    let res = 0;
    let formula2 = '';
    if (toId === 'c') { res = c; formula2 = `Result = ${c} °C`; }
    else if (toId === 'f') { res = (c * 9/5) + 32; formula2 = `°F = (${c} × 9/5) + 32 = ${res}`; }
    else if (toId === 'k') { res = c + 273.15; formula2 = `K = ${c} + 273.15 = ${res}`; }
    else if (toId === 'r') { res = (c + 273.15) * 9/5; formula2 = `°R = (${c} + 273.15) × 9/5 = ${res}`; }

    if (fromId === 'c' && toId === 'f') return { result: (value * 9/5) + 32, formula: `°F = (${value} × 9/5) + 32` };
    if (fromId === 'c' && toId === 'k') return { result: value + 273.15, formula: `K = ${value} + 273.15` };
    if (fromId === 'c' && toId === 'r') return { result: (value + 273.15) * 9/5, formula: `°R = (${value} + 273.15) × 9/5` };
    if (fromId === 'f' && toId === 'c') return { result: (value - 32) * 5/9, formula: `°C = (${value} − 32) × 5/9` };
    if (fromId === 'f' && toId === 'k') return { result: (value - 32) * 5/9 + 273.15, formula: `K = (${value} − 32) × 5/9 + 273.15` };
    if (fromId === 'f' && toId === 'r') return { result: value + 459.67, formula: `°R = ${value} + 459.67` };
    if (fromId === 'k' && toId === 'c') return { result: value - 273.15, formula: `°C = ${value} − 273.15` };
    if (fromId === 'k' && toId === 'f') return { result: (value - 273.15) * 9/5 + 32, formula: `°F = (${value} − 273.15) × 9/5 + 32` };
    if (fromId === 'k' && toId === 'r') return { result: value * 9/5, formula: `°R = ${value} × 9/5` };
    if (fromId === 'r' && toId === 'c') return { result: (value - 491.67) * 5/9, formula: `°C = (${value} − 491.67) × 5/9` };
    if (fromId === 'r' && toId === 'f') return { result: value - 459.67, formula: `°F = ${value} − 459.67` };
    if (fromId === 'r' && toId === 'k') return { result: value * 5/9, formula: `K = ${value} × 5/9` };

    return { result: res, formula: formula1 + '\n' + formula2 };
  }

  if (category === 'Fuel Economy') {
    let l100 = 0;
    let formula1 = '';
    if (fromId === 'l100km') { l100 = value; formula1 = `L/100km = ${value}`; }
    else if (fromId === 'mpg_us') { l100 = 235.214 / value; formula1 = `L/100km = 235.214 / ${value} = ${l100}`; }
    else if (fromId === 'mpg_uk') { l100 = 282.481 / value; formula1 = `L/100km = 282.481 / ${value} = ${l100}`; }
    else if (fromId === 'kml') { l100 = 100 / value; formula1 = `L/100km = 100 / ${value} = ${l100}`; }

    let res = 0;
    let formula2 = '';
    if (toId === 'l100km') { res = l100; formula2 = `Result = ${l100} L/100km`; }
    else if (toId === 'mpg_us') { res = 235.214 / l100; formula2 = `mpg (US) = 235.214 / ${l100} = ${res}`; }
    else if (toId === 'mpg_uk') { res = 282.481 / l100; formula2 = `mpg (UK) = 282.481 / ${l100} = ${res}`; }
    else if (toId === 'kml') { res = 100 / l100; formula2 = `km/L = 100 / ${l100} = ${res}`; }

    if (fromId === 'mpg_us' && toId === 'l100km') return { result: 235.214 / value, formula: `L/100km = 235.214 / ${value}` };
    if (fromId === 'mpg_uk' && toId === 'l100km') return { result: 282.481 / value, formula: `L/100km = 282.481 / ${value}` };
    if (fromId === 'kml' && toId === 'l100km') return { result: 100 / value, formula: `L/100km = 100 / ${value}` };
    if (fromId === 'l100km' && toId === 'mpg_us') return { result: 235.214 / value, formula: `mpg (US) = 235.214 / ${value}` };
    if (fromId === 'l100km' && toId === 'mpg_uk') return { result: 282.481 / value, formula: `mpg (UK) = 282.481 / ${value}` };
    if (fromId === 'l100km' && toId === 'kml') return { result: 100 / value, formula: `km/L = 100 / ${value}` };

    return { result: res, formula: formula1 + '\n' + formula2 };
  }

  const fromUnit = UNITS[category].find(u => u.id === fromId)!;
  const toUnit = UNITS[category].find(u => u.id === toId)!;

  const result = (value * fromUnit.factor!) / toUnit.factor!;
  const formula = `Conversion factor from ${fromUnit.name} to base unit: × ${fromUnit.factor}
Conversion factor from base unit to ${toUnit.name}: ÷ ${toUnit.factor}
Formula: result = inputValue × fromFactor / toFactor
Substitute: result = ${value} × ${fromUnit.factor} / ${toUnit.factor}
Result: ${formatNumber(result)} ${toUnit.symbol}`;

  return { result, formula };
}

export function formatNumber(num: number): string {
  if (num === 0) return '0';
  const absNum = Math.abs(num);
  if (absNum > 1e9 || absNum < 1e-6) {
    return num.toExponential(6).replace(/\.?0+e/, 'e');
  }
  return parseFloat(num.toPrecision(8)).toString();
}
