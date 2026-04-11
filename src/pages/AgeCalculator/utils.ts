export interface ExactAge {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface TotalUnits {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function calculateExactAge(start: Date, end: Date, includeEndDate: boolean = false): ExactAge {
  let endMs = end.getTime();
  if (includeEndDate) {
    endMs += 24 * 60 * 60 * 1000;
  }
  const endDate = new Date(endMs);

  let years = endDate.getFullYear() - start.getFullYear();
  let months = endDate.getMonth() - start.getMonth();
  let days = endDate.getDate() - start.getDate();
  let hours = endDate.getHours() - start.getHours();
  let minutes = endDate.getMinutes() - start.getMinutes();
  let seconds = endDate.getSeconds() - start.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }
  if (minutes < 0) {
    minutes += 60;
    hours--;
  }
  if (hours < 0) {
    hours += 24;
    days--;
  }
  if (days < 0) {
    months--;
    // Get days in previous month
    const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    months += 12;
    years--;
  }

  return { years, months, days, hours, minutes, seconds };
}

export function calculateTotalUnits(start: Date, end: Date, includeEndDate: boolean = false): TotalUnits {
  let endMs = end.getTime();
  if (includeEndDate) {
    endMs += 24 * 60 * 60 * 1000;
  }
  
  const diffMs = endMs - start.getTime();
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  const exact = calculateExactAge(start, new Date(endMs));
  const totalMonths = exact.years * 12 + exact.months + exact.days / 30.44; // Approximate for fractional months
  const totalYears = exact.years + exact.months / 12 + exact.days / 365.25;

  return {
    years: totalYears,
    months: exact.years * 12 + exact.months,
    weeks,
    days,
    hours,
    minutes,
    seconds
  };
}

export function getNextBirthday(dob: Date, asOf: Date) {
  const next = new Date(dob);
  next.setFullYear(asOf.getFullYear());
  
  // If the birthday has already passed this year, next one is next year
  if (next.getTime() < asOf.getTime() && 
      (next.getMonth() !== asOf.getMonth() || next.getDate() !== asOf.getDate())) {
    next.setFullYear(asOf.getFullYear() + 1);
  }

  const isToday = next.getMonth() === asOf.getMonth() && next.getDate() === asOf.getDate();
  
  const ageTurning = next.getFullYear() - dob.getFullYear();
  
  const diffMs = next.getTime() - asOf.getTime();
  const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  const exactUntil = calculateExactAge(asOf, next);

  // Progress bar calculation
  const lastBirthday = new Date(next);
  lastBirthday.setFullYear(next.getFullYear() - 1);
  const yearLength = next.getTime() - lastBirthday.getTime();
  const elapsed = asOf.getTime() - lastBirthday.getTime();
  const progressPercent = isToday ? 100 : Math.max(0, Math.min(100, (elapsed / yearLength) * 100));

  return {
    nextDate: next,
    daysUntil,
    monthsUntil: exactUntil.months,
    daysRemaining: exactUntil.days,
    isToday,
    ageTurning,
    progressPercent
  };
}

export function getZodiacSign(month: number, day: number): string {
  // month is 0-indexed
  if ((month === 2 && day >= 21) || (month === 3 && day <= 19)) return '♈ Aries (Mar 21 – Apr 19)';
  if ((month === 3 && day >= 20) || (month === 4 && day <= 20)) return '♉ Taurus (Apr 20 – May 20)';
  if ((month === 4 && day >= 21) || (month === 5 && day <= 20)) return '♊ Gemini (May 21 – Jun 20)';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 22)) return '♋ Cancer (Jun 21 – Jul 22)';
  if ((month === 6 && day >= 23) || (month === 7 && day <= 22)) return '♌ Leo (Jul 23 – Aug 22)';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '♍ Virgo (Aug 23 – Sep 22)';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '♎ Libra (Sep 23 – Oct 22)';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 21)) return '♏ Scorpio (Oct 23 – Nov 21)';
  if ((month === 10 && day >= 22) || (month === 11 && day <= 21)) return '♐ Sagittarius (Nov 22 – Dec 21)';
  if ((month === 11 && day >= 22) || (month === 0 && day <= 19)) return '♑ Capricorn (Dec 22 – Jan 19)';
  if ((month === 0 && day >= 20) || (month === 1 && day <= 18)) return '♒ Aquarius (Jan 20 – Feb 18)';
  return '♓ Pisces (Feb 19 – Mar 20)';
}

export function getChineseZodiac(year: number): string {
  const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
  const emojis = ['🐀', '🐂', '🐅', '🐇', '🐉', '🐍', '🐎', '🐐', '🐒', '🐓', '🐕', '🐖'];
  const index = (year - 1900) % 12;
  const normalizedIndex = index < 0 ? index + 12 : index;
  return `${emojis[normalizedIndex]} ${animals[normalizedIndex]}`;
}

export function getBirthStone(month: number): string {
  const stones = [
    '💎 Garnet', '💜 Amethyst', '🌊 Aquamarine', '✨ Diamond', 
    '💚 Emerald', '⚪ Pearl', '🔴 Ruby', '🍏 Peridot', 
    '🔵 Sapphire', '🌈 Opal', '💛 Topaz', '💠 Turquoise'
  ];
  return stones[month];
}

export function getGeneration(year: number): string {
  if (year >= 1928 && year <= 1945) return 'Silent Generation (1928–1945)';
  if (year >= 1946 && year <= 1964) return 'Baby Boomers (1946–1964)';
  if (year >= 1965 && year <= 1980) return 'Generation X (1965–1980)';
  if (year >= 1981 && year <= 1996) return 'Millennials (1981–1996)';
  if (year >= 1997 && year <= 2012) return 'Generation Z (1997–2012)';
  if (year >= 2013) return 'Generation Alpha (2013–present)';
  return 'Greatest Generation (before 1928)';
}

export function getBirthSeason(month: number): string {
  if (month === 11 || month === 0 || month === 1) return 'Winter';
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  return 'Autumn';
}

export const MILESTONES = [
  { age: 1, label: 'First birthday' },
  { age: 5, label: 'Started school age' },
  { age: 13, label: 'Became a teenager' },
  { age: 16, label: 'Driving age (many countries)' },
  { age: 18, label: 'Legal adult (many countries)' },
  { age: 21, label: 'Legal drinking age (US)' },
  { age: 25, label: 'Quarter century' },
  { age: 30, label: 'Thirty' },
  { age: 40, label: 'Forty' },
  { age: 50, label: 'Half century' },
  { age: 60, label: 'Sixty' },
  { age: 65, label: 'Retirement age (many countries)' },
  { age: 100, label: 'Centenary' }
];

export function getMilestones(dob: Date, asOf: Date) {
  return MILESTONES.map(m => {
    const date = new Date(dob);
    date.setFullYear(dob.getFullYear() + m.age);
    const isPast = date.getTime() <= asOf.getTime();
    
    let status = '';
    if (isPast) {
      status = '✅ Achieved';
    } else {
      const exact = calculateExactAge(asOf, date);
      status = `🔜 In ${exact.years}y ${exact.months}m`;
    }

    return {
      ...m,
      date,
      isPast,
      status
    };
  });
}

// Curated events for 1920-2024
export const YEAR_CONTEXT: Record<number, { pop: string, events: { cat: string, text: string }[] }> = {
  1980: { pop: '4.4', events: [{ cat: 'Pop Culture', text: 'Pac-Man is released in Japan.' }, { cat: 'World Events', text: 'Mount St. Helens erupts in Washington state.' }, { cat: 'Science', text: 'The eradication of smallpox is officially certified by the WHO.' }] },
  1981: { pop: '4.5', events: [{ cat: 'Science', text: 'The first Space Shuttle, Columbia, is launched.' }, { cat: 'Pop Culture', text: 'MTV broadcasts for the first time.' }, { cat: 'Science', text: 'The IBM Personal Computer is released.' }] },
  1982: { pop: '4.6', events: [{ cat: 'Pop Culture', text: 'Michael Jackson releases Thriller, the best-selling album of all time.' }, { cat: 'Science', text: 'The first artificial heart is implanted in a human.' }, { cat: 'World Events', text: 'The Falklands War takes place.' }] },
  1983: { pop: '4.7', events: [{ cat: 'Science', text: 'The Internet is officially born as ARPANET switches to TCP/IP.' }, { cat: 'Pop Culture', text: 'Mario Bros. is released by Nintendo.' }, { cat: 'Science', text: 'The HIV virus is discovered.' }] },
  1984: { pop: '4.8', events: [{ cat: 'Science', text: 'Apple releases the Macintosh personal computer.' }, { cat: 'Pop Culture', text: 'Tetris is created by Alexey Pajitnov.' }, { cat: 'Sports', text: 'The Summer Olympics are held in Los Angeles.' }] },
  1985: { pop: '4.8', events: [{ cat: 'Science', text: 'The first .com domain name is registered.' }, { cat: 'Pop Culture', text: 'Super Mario Bros. is released for the NES.' }, { cat: 'World Events', text: 'Live Aid concerts are held globally.' }] },
  1986: { pop: '4.9', events: [{ cat: 'World Events', text: 'The Chernobyl nuclear disaster occurs.' }, { cat: 'Science', text: 'The Space Shuttle Challenger disaster.' }, { cat: 'Science', text: 'Halley\'s Comet reaches its perihelion.' }] },
  1987: { pop: '5.0', events: [{ cat: 'World Events', text: 'Black Monday: Stock markets around the world crash.' }, { cat: 'Pop Culture', text: 'The Simpsons debut as a series of animated shorts.' }, { cat: 'Science', text: 'Prozac is approved by the FDA.' }] },
  1988: { pop: '5.1', events: [{ cat: 'Science', text: 'The first transatlantic fiber optic cable is laid.' }, { cat: 'World Events', text: 'The Iran-Iraq War ends.' }, { cat: 'Sports', text: 'The Summer Olympics are held in Seoul.' }] },
  1989: { pop: '5.2', events: [{ cat: 'World Events', text: 'The Berlin Wall falls.' }, { cat: 'Science', text: 'Tim Berners-Lee invents the World Wide Web.' }, { cat: 'Pop Culture', text: 'The Game Boy is released by Nintendo.' }] },
  1990: { pop: '5.3', events: [{ cat: 'World Events', text: 'Nelson Mandela is released from prison.' }, { cat: 'Science', text: 'The Hubble Space Telescope is launched.' }, { cat: 'World Events', text: 'East and West Germany are reunified.' }] },
  1991: { pop: '5.4', events: [{ cat: 'World Events', text: 'The Soviet Union is officially dissolved.' }, { cat: 'Science', text: 'The first website goes live on the internet.' }, { cat: 'Pop Culture', text: 'Nirvana releases Nevermind.' }] },
  1992: { pop: '5.5', events: [{ cat: 'World Events', text: 'The Maastricht Treaty is signed, founding the European Union.' }, { cat: 'Sports', text: 'The "Dream Team" competes in the Barcelona Olympics.' }, { cat: 'Science', text: 'The first exoplanets are discovered.' }] },
  1993: { pop: '5.5', events: [{ cat: 'Science', text: 'The Pentium microprocessor is introduced by Intel.' }, { cat: 'Pop Culture', text: 'Jurassic Park is released in theaters.' }, { cat: 'World Events', text: 'The European Union formally established.' }] },
  1994: { pop: '5.6', events: [{ cat: 'World Events', text: 'Nelson Mandela becomes President of South Africa.' }, { cat: 'Pop Culture', text: 'The PlayStation is released in Japan.' }, { cat: 'Science', text: 'The Channel Tunnel opens between the UK and France.' }] },
  1995: { pop: '5.7', events: [{ cat: 'Science', text: 'The first exoplanet orbiting a sun-like star is discovered.' }, { cat: 'Pop Culture', text: 'Toy Story, the first fully computer-animated feature film, is released.' }, { cat: 'Science', text: 'Windows 95 is released by Microsoft.' }] },
  1996: { pop: '5.8', events: [{ cat: 'Science', text: 'Dolly the sheep becomes the first cloned mammal.' }, { cat: 'Pop Culture', text: 'Pokémon Red and Green are released in Japan.' }, { cat: 'Sports', text: 'The Summer Olympics are held in Atlanta.' }] },
  1997: { pop: '5.9', events: [{ cat: 'Science', text: 'IBM\'s Deep Blue defeats Garry Kasparov in chess.' }, { cat: 'Pop Culture', text: 'Harry Potter and the Philosopher\'s Stone is published.' }, { cat: 'World Events', text: 'Hong Kong is transferred back to China.' }] },
  1998: { pop: '6.0', events: [{ cat: 'Science', text: 'Google is founded by Larry Page and Sergey Brin.' }, { cat: 'World Events', text: 'The Good Friday Agreement is signed in Northern Ireland.' }, { cat: 'Science', text: 'Construction of the International Space Station begins.' }] },
  1999: { pop: '6.0', events: [{ cat: 'World Events', text: 'The Euro currency is introduced.' }, { cat: 'Pop Culture', text: 'The Matrix is released in theaters.' }, { cat: 'World Events', text: 'The world prepares for the Y2K bug.' }] },
  2000: { pop: '6.1', events: [{ cat: 'Science', text: 'The first draft of the human genome is completed.' }, { cat: 'Pop Culture', text: 'The PlayStation 2 is released.' }, { cat: 'World Events', text: 'The Y2K bug passes without serious widespread computer failures.' }] },
  2001: { pop: '6.2', events: [{ cat: 'World Events', text: 'The September 11 attacks occur in the US.' }, { cat: 'Science', text: 'Wikipedia is launched.' }, { cat: 'Pop Culture', text: 'The first Harry Potter and Lord of the Rings films are released.' }] },
  2002: { pop: '6.3', events: [{ cat: 'World Events', text: 'Euro banknotes and coins enter circulation.' }, { cat: 'Science', text: 'SpaceX is founded by Elon Musk.' }, { cat: 'Sports', text: 'Brazil wins the FIFA World Cup in South Korea/Japan.' }] },
  2003: { pop: '6.4', events: [{ cat: 'Science', text: 'The Human Genome Project is completed.' }, { cat: 'World Events', text: 'The Iraq War begins.' }, { cat: 'Science', text: 'Concorde makes its final commercial flight.' }] },
  2004: { pop: '6.4', events: [{ cat: 'Science', text: 'Facebook is founded by Mark Zuckerberg.' }, { cat: 'World Events', text: 'The Indian Ocean earthquake and tsunami occur.' }, { cat: 'Science', text: 'NASA\'s Spirit and Opportunity rovers land on Mars.' }] },
  2005: { pop: '6.5', events: [{ cat: 'Science', text: 'YouTube is founded.' }, { cat: 'World Events', text: 'Hurricane Katrina strikes the US Gulf Coast.' }, { cat: 'Pop Culture', text: 'The Xbox 360 is released.' }] },
  2006: { pop: '6.6', events: [{ cat: 'Science', text: 'Twitter is launched.' }, { cat: 'Science', text: 'Pluto is reclassified as a "dwarf planet".' }, { cat: 'Pop Culture', text: 'The Nintendo Wii is released.' }] },
  2007: { pop: '6.7', events: [{ cat: 'Science', text: 'Apple releases the first iPhone.' }, { cat: 'World Events', text: 'The global financial crisis begins to unfold.' }, { cat: 'Pop Culture', text: 'The final Harry Potter book is published.' }] },
  2008: { pop: '6.8', events: [{ cat: 'World Events', text: 'Barack Obama is elected as the first African American US President.' }, { cat: 'Science', text: 'The Large Hadron Collider is powered up.' }, { cat: 'Sports', text: 'Usain Bolt sets world records at the Beijing Olympics.' }] },
  2009: { pop: '6.8', events: [{ cat: 'Science', text: 'Bitcoin, the first cryptocurrency, is created.' }, { cat: 'World Events', text: 'The H1N1 swine flu pandemic occurs.' }, { cat: 'Pop Culture', text: 'Avatar becomes the highest-grossing film of all time.' }] },
  2010: { pop: '6.9', events: [{ cat: 'Science', text: 'Instagram is launched.' }, { cat: 'World Events', text: 'The Deepwater Horizon oil spill occurs.' }, { cat: 'Science', text: 'Apple releases the first iPad.' }] },
  2011: { pop: '7.0', events: [{ cat: 'World Events', text: 'The Arab Spring protests spread across the Middle East.' }, { cat: 'Science', text: 'The Space Shuttle program ends.' }, { cat: 'World Events', text: 'The Fukushima nuclear disaster occurs in Japan.' }] },
  2012: { pop: '7.1', events: [{ cat: 'Science', text: 'The Higgs boson particle is discovered at CERN.' }, { cat: 'Science', text: 'NASA\'s Curiosity rover lands on Mars.' }, { cat: 'Sports', text: 'The Summer Olympics are held in London.' }] },
  2013: { pop: '7.2', events: [{ cat: 'World Events', text: 'Edward Snowden leaks NSA surveillance documents.' }, { cat: 'Pop Culture', text: 'Frozen is released by Disney.' }, { cat: 'World Events', text: 'Pope Francis becomes the first Pope from the Americas.' }] },
  2014: { pop: '7.3', events: [{ cat: 'World Events', text: 'The Ebola outbreak begins in West Africa.' }, { cat: 'Science', text: 'The Rosetta spacecraft lands a probe on a comet.' }, { cat: 'Sports', text: 'Germany wins the FIFA World Cup in Brazil.' }] },
  2015: { pop: '7.4', events: [{ cat: 'World Events', text: 'The Paris Agreement on climate change is adopted.' }, { cat: 'Science', text: 'NASA\'s New Horizons probe flies by Pluto.' }, { cat: 'Science', text: 'Gravitational waves are detected for the first time.' }] },
  2016: { pop: '7.5', events: [{ cat: 'World Events', text: 'The UK votes to leave the European Union (Brexit).' }, { cat: 'World Events', text: 'Donald Trump is elected US President.' }, { cat: 'Pop Culture', text: 'Pokémon Go becomes a global phenomenon.' }] },
  2017: { pop: '7.6', events: [{ cat: 'Science', text: 'The first interstellar object, \'Oumuamua, is discovered.' }, { cat: 'Pop Culture', text: 'The Nintendo Switch is released.' }, { cat: 'World Events', text: 'The #MeToo movement gains global prominence.' }] },
  2018: { pop: '7.6', events: [{ cat: 'Science', text: 'SpaceX launches the Falcon Heavy rocket.' }, { cat: 'World Events', text: 'The Thai cave rescue captivates the world.' }, { cat: 'Sports', text: 'France wins the FIFA World Cup in Russia.' }] },
  2019: { pop: '7.7', events: [{ cat: 'Science', text: 'The first image of a black hole is captured.' }, { cat: 'World Events', text: 'The Notre-Dame cathedral in Paris catches fire.' }, { cat: 'World Events', text: 'The first cases of COVID-19 are identified.' }] },
  2020: { pop: '7.8', events: [{ cat: 'World Events', text: 'The COVID-19 pandemic causes global lockdowns.' }, { cat: 'Science', text: 'SpaceX becomes the first private company to send humans to orbit.' }, { cat: 'World Events', text: 'Global protests occur following the murder of George Floyd.' }] },
  2021: { pop: '7.9', events: [{ cat: 'Science', text: 'The James Webb Space Telescope is launched.' }, { cat: 'World Events', text: 'The US Capitol is attacked.' }, { cat: 'Science', text: 'NASA\'s Perseverance rover lands on Mars.' }] },
  2022: { pop: '8.0', events: [{ cat: 'World Events', text: 'Russia invades Ukraine.' }, { cat: 'Science', text: 'Global population reaches 8 billion.' }, { cat: 'Sports', text: 'Argentina wins the FIFA World Cup in Qatar.' }] },
  2023: { pop: '8.0', events: [{ cat: 'Science', text: 'Generative AI tools like ChatGPT gain massive mainstream adoption.' }, { cat: 'World Events', text: 'Charles III is crowned King of the UK.' }, { cat: 'Science', text: 'India\'s Chandrayaan-3 successfully lands on the Moon\'s south pole.' }] },
  2024: { pop: '8.1', events: [{ cat: 'Sports', text: 'The Summer Olympics are held in Paris.' }, { cat: 'Science', text: 'Total solar eclipse crosses North America.' }, { cat: 'World Events', text: 'Numerous major global elections take place.' }] }
};

export function getYearContext(year: number) {
  if (YEAR_CONTEXT[year]) return YEAR_CONTEXT[year];
  
  // Fallback for missing years
  return {
    pop: 'Unknown',
    events: [
      { cat: 'Note', text: `Birth year context is available for years 1980–2024. We don't have curated events for ${year}.` }
    ]
  };
}
