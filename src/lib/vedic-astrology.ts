import * as Astronomy from 'astronomy-engine';

// Vimshottari Dasha periods (in years) - total 120 years
const DASHA_YEARS: Record<string, number> = {
  'Ketu': 7,
  'Shukra': 20,
  'Surya': 6,
  'Chandra': 10,
  'Mangal': 7,
  'Rahu': 18,
  'Guru': 16,
  'Shani': 19,
  'Budh': 17,
};

// Dasha sequence (starting from Ketu)
const DASHA_SEQUENCE = ['Ketu', 'Shukra', 'Surya', 'Chandra', 'Mangal', 'Rahu', 'Guru', 'Shani', 'Budh'];

// Planet names in English
const PLANET_NAMES: Record<string, string> = {
  'Ketu': 'South Node',
  'Shukra': 'Venus',
  'Surya': 'Sun',
  'Chandra': 'Moon',
  'Mangal': 'Mars',
  'Rahu': 'North Node',
  'Guru': 'Jupiter',
  'Shani': 'Saturn',
  'Budh': 'Mercury',
};

// Nakshatra data (27 Nakshatras, each 13°20' = 13.333...°)
const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras', startDeg: 0 },
  { name: 'Bharani', lord: 'Shukra', deity: 'Yama', startDeg: 13.333 },
  { name: 'Krittika', lord: 'Surya', deity: 'Agni', startDeg: 26.667 },
  { name: 'Rohini', lord: 'Chandra', deity: 'Brahma', startDeg: 40 },
  { name: 'Mrigashira', lord: 'Mangal', deity: 'Soma', startDeg: 53.333 },
  { name: 'Ardra', lord: 'Rahu', deity: 'Rudra', startDeg: 66.667 },
  { name: 'Punarvasu', lord: 'Guru', deity: 'Aditi', startDeg: 80 },
  { name: 'Pushya', lord: 'Shani', deity: 'Brihaspati', startDeg: 93.333 },
  { name: 'Ashlesha', lord: 'Budh', deity: 'Sarpa', startDeg: 106.667 },
  { name: 'Magha', lord: 'Ketu', deity: 'Pitris', startDeg: 120 },
  { name: 'Purva Phalguni', lord: 'Shukra', deity: 'Bhaga', startDeg: 133.333 },
  { name: 'Uttara Phalguni', lord: 'Surya', deity: 'Aryaman', startDeg: 146.667 },
  { name: 'Hasta', lord: 'Chandra', deity: 'Savitar', startDeg: 160 },
  { name: 'Chitra', lord: 'Mangal', deity: 'Vishwakarma', startDeg: 173.333 },
  { name: 'Swati', lord: 'Rahu', deity: 'Vayu', startDeg: 186.667 },
  { name: 'Vishakha', lord: 'Guru', deity: 'Indra-Agni', startDeg: 200 },
  { name: 'Anuradha', lord: 'Shani', deity: 'Mitra', startDeg: 213.333 },
  { name: 'Jyeshtha', lord: 'Budh', deity: 'Indra', startDeg: 226.667 },
  { name: 'Mula', lord: 'Ketu', deity: 'Nirriti', startDeg: 240 },
  { name: 'Purva Ashadha', lord: 'Shukra', deity: 'Apas', startDeg: 253.333 },
  { name: 'Uttara Ashadha', lord: 'Surya', deity: 'Vishwadevas', startDeg: 266.667 },
  { name: 'Shravana', lord: 'Chandra', deity: 'Vishnu', startDeg: 280 },
  { name: 'Dhanishta', lord: 'Mangal', deity: 'Vasus', startDeg: 293.333 },
  { name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna', startDeg: 306.667 },
  { name: 'Purva Bhadrapada', lord: 'Guru', deity: 'Aja Ekapada', startDeg: 320 },
  { name: 'Uttara Bhadrapada', lord: 'Shani', deity: 'Ahir Budhnya', startDeg: 333.333 },
  { name: 'Revati', lord: 'Budh', deity: 'Pushan', startDeg: 346.667 },
];

// Rashi data (12 signs, each 30°)
const RASHIS = [
  { name: 'Mesha', english: 'Aries', lord: 'Mangal', startDeg: 0 },
  { name: 'Vrishabha', english: 'Taurus', lord: 'Shukra', startDeg: 30 },
  { name: 'Mithuna', english: 'Gemini', lord: 'Budh', startDeg: 60 },
  { name: 'Karka', english: 'Cancer', lord: 'Chandra', startDeg: 90 },
  { name: 'Simha', english: 'Leo', lord: 'Surya', startDeg: 120 },
  { name: 'Kanya', english: 'Virgo', lord: 'Budh', startDeg: 150 },
  { name: 'Tula', english: 'Libra', lord: 'Shukra', startDeg: 180 },
  { name: 'Vrishchika', english: 'Scorpio', lord: 'Mangal', startDeg: 210 },
  { name: 'Dhanu', english: 'Sagittarius', lord: 'Guru', startDeg: 240 },
  { name: 'Makara', english: 'Capricorn', lord: 'Shani', startDeg: 270 },
  { name: 'Kumbha', english: 'Aquarius', lord: 'Shani', startDeg: 300 },
  { name: 'Meena', english: 'Pisces', lord: 'Guru', startDeg: 330 },
];

// Calculate Lahiri Ayanamsa for a given date
function getLahiriAyanamsa(date: Date): number {
  const year2000 = new Date('2000-01-01T00:00:00Z');
  const yearsDiff = (date.getTime() - year2000.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  const ayanamsa2000 = 23.8531;
  const annualPrecession = 0.01397;
  return ayanamsa2000 + (yearsDiff * annualPrecession);
}

// Convert tropical longitude to sidereal longitude
function toSidereal(tropicalLongitude: number, date: Date): number {
  const ayanamsa = getLahiriAyanamsa(date);
  let sidereal = tropicalLongitude - ayanamsa;
  if (sidereal < 0) sidereal += 360;
  return sidereal;
}

// Get Nakshatra from sidereal longitude
function getNakshatra(siderealLongitude: number) {
  const nakshatraIndex = Math.floor(siderealLongitude / 13.333333);
  const nakshatra = NAKSHATRAS[nakshatraIndex % 27];
  const degreeInNakshatra = siderealLongitude % 13.333333;
  const pada = Math.floor(degreeInNakshatra / 3.333333) + 1;
  return { ...nakshatra, pada, index: nakshatraIndex };
}

// Get Rashi from sidereal longitude
function getRashi(siderealLongitude: number) {
  const rashiIndex = Math.floor(siderealLongitude / 30);
  const rashi = RASHIS[rashiIndex % 12];
  const degreeInRashi = siderealLongitude % 30;
  return { ...rashi, degree: degreeInRashi, index: rashiIndex };
}

// Format degrees to degrees, minutes, seconds
function formatDegrees(deg: number): string {
  const degrees = Math.floor(deg);
  const minutesFloat = (deg - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = Math.round((minutesFloat - minutes) * 60);
  return `${degrees}°${minutes}'${seconds}"`;
}

// Get Moon position at a specific time
function getMoonPosition(date: Date, coordinates: { lat: number; lng: number }) {
  const observer = new Astronomy.Observer(coordinates.lat, coordinates.lng, 0);
  const moonEquator = Astronomy.Equator(Astronomy.Body.Moon, date, observer, true, true);
  const moonEcliptic = Astronomy.Ecliptic(moonEquator.vec);
  return moonEcliptic.elon;
}

// Calculate Lagna (Ascendant) - the rising sign at the time of birth
function calculateLagna(date: Date, coordinates: { lat: number; lng: number }) {
  // Calculate Local Sidereal Time
  const astroTime = Astronomy.MakeTime(date);
  const jd = astroTime.ut + 2451545.0; // Convert to Julian Date
  const T = (jd - 2451545.0) / 36525.0;

  // Greenwich Mean Sidereal Time in degrees
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T;
  gmst = gmst % 360;
  if (gmst < 0) gmst += 360;

  // Local Sidereal Time
  let lst = gmst + coordinates.lng;
  lst = lst % 360;
  if (lst < 0) lst += 360;

  // Apply Lahiri Ayanamsa to get sidereal ascendant
  const ayanamsa = getLahiriAyanamsa(date);
  let siderealAsc = lst - ayanamsa;
  if (siderealAsc < 0) siderealAsc += 360;

  // Get the Rashi (sign) of the ascendant
  const lagnaRashi = getRashi(siderealAsc);
  const lagnaNakshatra = getNakshatra(siderealAsc);

  return {
    degree: siderealAsc,
    formattedDegree: formatDegrees(siderealAsc),
    rashi: lagnaRashi,
    nakshatra: lagnaNakshatra,
  };
}

// Calculate current age in years and days
function calculateAge(birthDate: Date): { years: number; months: number; days: number; totalDays: number } {
  const today = new Date();
  const diffTime = today.getTime() - birthDate.getTime();
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days, totalDays };
}

// Calculate Vimshottari Dasha based on Nakshatra and DOB
function calculateDasha(birthDate: Date, nakshatra: { name: string; lord: string; pada: number }, moonDegreeInNakshatra: number) {
  const nakshatraLord = nakshatra.lord;
  const nakshatraSpan = 13.333333; // degrees

  // Calculate how much of the first dasha has already passed at birth
  const proportionPassed = moonDegreeInNakshatra / nakshatraSpan;
  const firstDashaYears = DASHA_YEARS[nakshatraLord];
  const remainingFirstDasha = firstDashaYears * (1 - proportionPassed);

  // Find the starting index in dasha sequence
  const startIndex = DASHA_SEQUENCE.indexOf(nakshatraLord);

  // Calculate age
  const age = calculateAge(birthDate);
  const ageInYears = age.years + (age.months / 12) + (age.days / 365);

  // Build dasha timeline
  const dashaTimeline: Array<{
    planet: string;
    planetEnglish: string;
    startAge: number;
    endAge: number;
    years: number;
    isCurrent: boolean;
  }> = [];

  let currentAge = 0;
  let currentDasha = { planet: '', startAge: 0, endAge: 0 };

  // First dasha (partial)
  const firstPlanet = DASHA_SEQUENCE[startIndex];
  dashaTimeline.push({
    planet: firstPlanet,
    planetEnglish: PLANET_NAMES[firstPlanet],
    startAge: 0,
    endAge: remainingFirstDasha,
    years: remainingFirstDasha,
    isCurrent: ageInYears <= remainingFirstDasha,
  });

  if (ageInYears <= remainingFirstDasha) {
    currentDasha = { planet: firstPlanet, startAge: 0, endAge: remainingFirstDasha };
  }

  currentAge = remainingFirstDasha;

  // Subsequent dashas (full cycles)
  for (let cycle = 0; cycle < 2; cycle++) { // 2 cycles = 240 years, more than enough
    for (let i = 1; i <= 9; i++) {
      const planetIndex = (startIndex + i) % 9;
      const planet = DASHA_SEQUENCE[planetIndex];
      const years = DASHA_YEARS[planet];
      const startAge = currentAge;
      const endAge = currentAge + years;

      const isCurrent = ageInYears > startAge && ageInYears <= endAge;

      dashaTimeline.push({
        planet,
        planetEnglish: PLANET_NAMES[planet],
        startAge,
        endAge,
        years,
        isCurrent,
      });

      if (isCurrent) {
        currentDasha = { planet, startAge, endAge };
      }

      currentAge = endAge;

      if (currentAge > 120) break; // Limit to 120 years
    }
    if (currentAge > 120) break;
  }

  // Find current Mahadasha
  const currentMahadasha = dashaTimeline.find(d => d.isCurrent) || dashaTimeline[0];

  // Calculate Antardasha (sub-period)
  const mahadashaYears = DASHA_YEARS[currentMahadasha.planet];
  const yearsIntoMahadasha = ageInYears - currentMahadasha.startAge;

  // Antardasha sequence starts from Mahadasha lord
  const mahadashaIndex = DASHA_SEQUENCE.indexOf(currentMahadasha.planet);
  let antardashaAge = 0;
  let currentAntardasha = { planet: '', startAge: 0, endAge: 0 };

  for (let i = 0; i < 9; i++) {
    const planetIndex = (mahadashaIndex + i) % 9;
    const planet = DASHA_SEQUENCE[planetIndex];
    const antardashaYears = (DASHA_YEARS[currentMahadasha.planet] * DASHA_YEARS[planet]) / 120;
    const startAge = antardashaAge;
    const endAge = antardashaAge + antardashaYears;

    if (yearsIntoMahadasha > startAge && yearsIntoMahadasha <= endAge) {
      currentAntardasha = { planet, startAge, endAge };
      break;
    }

    antardashaAge = endAge;
  }

  // Calculate remaining time in current periods
  const remainingMahadasha = currentMahadasha.endAge - ageInYears;
  const remainingAntardasha = currentAntardasha.endAge - yearsIntoMahadasha;

  return {
    currentAge: age,
    ageInYears: Math.floor(ageInYears),
    mahadasha: {
      planet: currentMahadasha.planet,
      planetEnglish: PLANET_NAMES[currentMahadasha.planet],
      startAge: Math.floor(currentMahadasha.startAge),
      endAge: Math.floor(currentMahadasha.endAge),
      remainingYears: Math.round(remainingMahadasha * 10) / 10,
    },
    antardasha: {
      planet: currentAntardasha.planet,
      planetEnglish: PLANET_NAMES[currentAntardasha.planet],
      remainingMonths: Math.round(remainingAntardasha * 12),
    },
    upcomingDashas: dashaTimeline.slice(0, 7).map(d => ({
      planet: d.planet,
      planetEnglish: d.planetEnglish,
      ageRange: `${Math.floor(d.startAge)}-${Math.floor(d.endAge)}`,
      isCurrent: d.isCurrent,
    })),
  };
}

// Main calculation function with exact time
export function calculateVedicChart(
  dateOfBirth: string,
  timeOfBirth: string,
  placeOfBirth: string = 'Hyderabad'
) {
  const [year, month, day] = dateOfBirth.split('-').map(Number);
  const [hours, minutes] = timeOfBirth.split(':').map(Number);
  const coordinates = getCoordinates(placeOfBirth);

  // Convert IST to UTC
  const istOffset = 5.5;
  const utcHours = hours - istOffset;
  const birthDate = new Date(Date.UTC(year, month - 1, day, Math.floor(utcHours), minutes + (utcHours % 1) * 60));
  const birthDateLocal = new Date(year, month - 1, day);

  const tropicalMoonLongitude = getMoonPosition(birthDate, coordinates);
  const siderealMoonLongitude = toSidereal(tropicalMoonLongitude, birthDate);
  const ayanamsa = getLahiriAyanamsa(birthDate);

  const nakshatra = getNakshatra(siderealMoonLongitude);
  const rashi = getRashi(siderealMoonLongitude);

  // Calculate Lagna (Ascendant)
  const lagna = calculateLagna(birthDate, coordinates);

  // Calculate moon's degree within the nakshatra for Dasha calculation
  const nakshatraStartDeg = Math.floor(siderealMoonLongitude / 13.333333) * 13.333333;
  const moonDegreeInNakshatra = siderealMoonLongitude - nakshatraStartDeg;

  // Calculate Dasha periods
  const dasha = calculateDasha(birthDateLocal, nakshatra, moonDegreeInNakshatra);

  return {
    isExact: true,
    hasTime: true,
    birthDetails: {
      date: dateOfBirth,
      time: timeOfBirth,
      place: placeOfBirth,
      coordinates,
    },
    moon: {
      tropicalLongitude: tropicalMoonLongitude,
      siderealLongitude: siderealMoonLongitude,
      formattedSidereal: formatDegrees(siderealMoonLongitude),
    },
    ayanamsa: {
      value: ayanamsa,
      formatted: formatDegrees(ayanamsa),
      type: 'Lahiri (Chitrapaksha)',
    },
    lagna: {
      name: lagna.rashi.name,
      english: lagna.rashi.english,
      lord: lagna.rashi.lord,
      degree: lagna.degree,
      formattedDegree: lagna.formattedDegree,
      fullName: `${lagna.rashi.name} (${lagna.rashi.english})`,
      nakshatra: lagna.nakshatra.name,
    },
    rashi: {
      name: rashi.name,
      english: rashi.english,
      lord: rashi.lord,
      degree: rashi.degree,
      formattedDegree: formatDegrees(rashi.degree),
      fullName: `${rashi.name} (${rashi.english})`,
    },
    nakshatra: {
      name: nakshatra.name,
      lord: nakshatra.lord,
      deity: nakshatra.deity,
      pada: nakshatra.pada,
      fullName: `${nakshatra.name} - Pada ${nakshatra.pada}`,
    },
    dasha,
  };
}

// Calculate all possibilities for a day when time is unknown
export function calculatePossibleCharts(
  dateOfBirth: string,
  placeOfBirth: string = 'Hyderabad'
) {
  const [year, month, day] = dateOfBirth.split('-').map(Number);
  const coordinates = getCoordinates(placeOfBirth);
  const ayanamsa = getLahiriAyanamsa(new Date(year, month - 1, day));

  // Check Moon position at different times throughout the day (every 2 hours)
  const timeSlots = [
    { time: '00:00', label: '12:00 AM (Midnight)' },
    { time: '02:00', label: '2:00 AM' },
    { time: '04:00', label: '4:00 AM' },
    { time: '06:00', label: '6:00 AM (Sunrise)' },
    { time: '08:00', label: '8:00 AM' },
    { time: '10:00', label: '10:00 AM' },
    { time: '12:00', label: '12:00 PM (Noon)' },
    { time: '14:00', label: '2:00 PM' },
    { time: '16:00', label: '4:00 PM' },
    { time: '18:00', label: '6:00 PM (Sunset)' },
    { time: '20:00', label: '8:00 PM' },
    { time: '22:00', label: '10:00 PM' },
    { time: '23:59', label: '11:59 PM' },
  ];

  const positions: Array<{
    time: string;
    label: string;
    rashi: { name: string; english: string; fullName: string };
    nakshatra: { name: string; pada: number; lord: string; deity: string; fullName: string };
    moonDegree: string;
  }> = [];

  const uniqueNakshatras = new Set<string>();
  const uniqueRashis = new Set<string>();

  for (const slot of timeSlots) {
    const [hours, minutes] = slot.time.split(':').map(Number);
    const istOffset = 5.5;
    const utcHours = hours - istOffset;
    const date = new Date(Date.UTC(year, month - 1, day, Math.floor(utcHours), minutes + (utcHours % 1) * 60));

    const tropicalLon = getMoonPosition(date, coordinates);
    const siderealLon = toSidereal(tropicalLon, date);
    const nakshatra = getNakshatra(siderealLon);
    const rashi = getRashi(siderealLon);

    uniqueNakshatras.add(nakshatra.name);
    uniqueRashis.add(rashi.name);

    positions.push({
      time: slot.time,
      label: slot.label,
      rashi: {
        name: rashi.name,
        english: rashi.english,
        fullName: `${rashi.name} (${rashi.english})`,
      },
      nakshatra: {
        name: nakshatra.name,
        pada: nakshatra.pada,
        lord: nakshatra.lord,
        deity: nakshatra.deity,
        fullName: `${nakshatra.name} - Pada ${nakshatra.pada}`,
      },
      moonDegree: formatDegrees(siderealLon),
    });
  }

  // Get unique combinations
  const possibleNakshatras = Array.from(uniqueNakshatras).map(name => {
    const n = NAKSHATRAS.find(nak => nak.name === name)!;
    return { name: n.name, lord: n.lord, deity: n.deity };
  });

  const possibleRashis = Array.from(uniqueRashis).map(name => {
    const r = RASHIS.find(ras => ras.name === name)!;
    return { name: r.name, english: r.english, lord: r.lord, fullName: `${r.name} (${r.english})` };
  });

  return {
    isExact: false,
    birthDetails: {
      date: dateOfBirth,
      time: null,
      place: placeOfBirth,
      coordinates,
    },
    ayanamsa: {
      value: ayanamsa,
      formatted: formatDegrees(ayanamsa),
      type: 'Lahiri (Chitrapaksha)',
    },
    possibleRashis,
    possibleNakshatras,
    timeWisePositions: positions,
    message: `On ${dateOfBirth}, the Moon transited through ${possibleNakshatras.length} Nakshatra(s) and ${possibleRashis.length} Rashi(s). Provide your exact birth time for accurate results.`,
  };
}

// Get approximate coordinates for Indian cities
function getCoordinates(place: string): { lat: number; lng: number } {
  const cities: Record<string, { lat: number; lng: number }> = {
    'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'mumbai': { lat: 19.0760, lng: 72.8777 },
    'delhi': { lat: 28.6139, lng: 77.2090 },
    'bangalore': { lat: 12.9716, lng: 77.5946 },
    'bengaluru': { lat: 12.9716, lng: 77.5946 },
    'chennai': { lat: 13.0827, lng: 80.2707 },
    'kolkata': { lat: 22.5726, lng: 88.3639 },
    'pune': { lat: 18.5204, lng: 73.8567 },
    'ahmedabad': { lat: 23.0225, lng: 72.5714 },
    'jaipur': { lat: 26.9124, lng: 75.7873 },
    'lucknow': { lat: 26.8467, lng: 80.9462 },
    'vijayawada': { lat: 16.5062, lng: 80.6480 },
    'visakhapatnam': { lat: 17.6868, lng: 83.2185 },
    'vizag': { lat: 17.6868, lng: 83.2185 },
    'tirupati': { lat: 13.6288, lng: 79.4192 },
    'warangal': { lat: 17.9784, lng: 79.5941 },
    'guntur': { lat: 16.3067, lng: 80.4365 },
    'nellore': { lat: 14.4426, lng: 79.9865 },
    'kurnool': { lat: 15.8281, lng: 78.0373 },
    'rajahmundry': { lat: 16.9891, lng: 81.7840 },
    'kadapa': { lat: 14.4673, lng: 78.8242 },
    'anantapur': { lat: 14.6819, lng: 77.6006 },
    'karimnagar': { lat: 18.4386, lng: 79.1288 },
    'nizamabad': { lat: 18.6725, lng: 78.0941 },
    'khammam': { lat: 17.2473, lng: 80.1514 },
    'secunderabad': { lat: 17.4399, lng: 78.4983 },
    'mancherial': { lat: 18.8706, lng: 79.4361 },
    'siddipet': { lat: 18.1018, lng: 78.8520 },
    'suryapet': { lat: 17.1391, lng: 79.6208 },
    'mahabubnagar': { lat: 16.7488, lng: 77.9894 },
    'adilabad': { lat: 19.6641, lng: 78.5320 },
    'nalgonda': { lat: 17.0575, lng: 79.2690 },
    'miryalaguda': { lat: 16.8753, lng: 79.5622 },
    'srikakulam': { lat: 18.2949, lng: 83.8935 },
    'eluru': { lat: 16.7107, lng: 81.0952 },
    'ongole': { lat: 15.5057, lng: 80.0499 },
    'kakinada': { lat: 16.9891, lng: 82.2475 },
    'machilipatnam': { lat: 16.1875, lng: 81.1389 },
    'tenali': { lat: 16.2430, lng: 80.6400 },
    'proddatur': { lat: 14.7502, lng: 78.5481 },
    'nandyal': { lat: 15.4786, lng: 78.4836 },
    'tadipatri': { lat: 14.9091, lng: 78.0092 },
    'hindupur': { lat: 13.8299, lng: 77.4910 },
    'chittoor': { lat: 13.2172, lng: 79.1003 },
    'madanapalle': { lat: 13.5500, lng: 78.5000 },
    'coimbatore': { lat: 11.0168, lng: 76.9558 },
    'madurai': { lat: 9.9252, lng: 78.1198 },
    'trichy': { lat: 10.7905, lng: 78.7047 },
    'salem': { lat: 11.6643, lng: 78.1460 },
    'tirunelveli': { lat: 8.7139, lng: 77.7567 },
    'erode': { lat: 11.3410, lng: 77.7172 },
    'vellore': { lat: 12.9165, lng: 79.1325 },
    'thoothukudi': { lat: 8.7642, lng: 78.1348 },
    'thanjavur': { lat: 10.7870, lng: 79.1378 },
    'dindigul': { lat: 10.3624, lng: 77.9695 },
    'ranchi': { lat: 23.3441, lng: 85.3096 },
    'jamshedpur': { lat: 22.8046, lng: 86.2029 },
    'dhanbad': { lat: 23.7957, lng: 86.4304 },
    'patna': { lat: 25.5941, lng: 85.1376 },
    'gaya': { lat: 24.7914, lng: 85.0002 },
    'bhubaneswar': { lat: 20.2961, lng: 85.8245 },
    'cuttack': { lat: 20.4625, lng: 85.8830 },
    'rourkela': { lat: 22.2604, lng: 84.8536 },
    'guwahati': { lat: 26.1445, lng: 91.7362 },
    'silchar': { lat: 24.8333, lng: 92.7789 },
    'imphal': { lat: 24.8170, lng: 93.9368 },
    'shillong': { lat: 25.5788, lng: 91.8933 },
    'aizawl': { lat: 23.7271, lng: 92.7176 },
    'agartala': { lat: 23.8315, lng: 91.2868 },
    'kohima': { lat: 25.6751, lng: 94.1086 },
    'itanagar': { lat: 27.0844, lng: 93.6053 },
    'gangtok': { lat: 27.3389, lng: 88.6065 },
    'srinagar': { lat: 34.0837, lng: 74.7973 },
    'jammu': { lat: 32.7266, lng: 74.8570 },
    'leh': { lat: 34.1526, lng: 77.5771 },
    'shimla': { lat: 31.1048, lng: 77.1734 },
    'manali': { lat: 32.2396, lng: 77.1887 },
    'dharamshala': { lat: 32.2190, lng: 76.3234 },
    'chandigarh': { lat: 30.7333, lng: 76.7794 },
    'amritsar': { lat: 31.6340, lng: 74.8723 },
    'ludhiana': { lat: 30.9010, lng: 75.8573 },
    'jalandhar': { lat: 31.3260, lng: 75.5762 },
    'patiala': { lat: 30.3398, lng: 76.3869 },
    'dehradun': { lat: 30.3165, lng: 78.0322 },
    'haridwar': { lat: 29.9457, lng: 78.1642 },
    'rishikesh': { lat: 30.0869, lng: 78.2676 },
    'nainital': { lat: 29.3919, lng: 79.4542 },
    'varanasi': { lat: 25.3176, lng: 82.9739 },
    'prayagraj': { lat: 25.4358, lng: 81.8463 },
    'allahabad': { lat: 25.4358, lng: 81.8463 },
    'kanpur': { lat: 26.4499, lng: 80.3319 },
    'agra': { lat: 27.1767, lng: 78.0081 },
    'mathura': { lat: 27.4924, lng: 77.6737 },
    'meerut': { lat: 28.9845, lng: 77.7064 },
    'noida': { lat: 28.5355, lng: 77.3910 },
    'ghaziabad': { lat: 28.6692, lng: 77.4538 },
    'faridabad': { lat: 28.4089, lng: 77.3178 },
    'gurugram': { lat: 28.4595, lng: 77.0266 },
    'gurgaon': { lat: 28.4595, lng: 77.0266 },
    'bhopal': { lat: 23.2599, lng: 77.4126 },
    'indore': { lat: 22.7196, lng: 75.8577 },
    'jabalpur': { lat: 23.1815, lng: 79.9864 },
    'gwalior': { lat: 26.2183, lng: 78.1828 },
    'ujjain': { lat: 23.1765, lng: 75.7885 },
    'nagpur': { lat: 21.1458, lng: 79.0882 },
    'nashik': { lat: 19.9975, lng: 73.7898 },
    'aurangabad': { lat: 19.8762, lng: 75.3433 },
    'solapur': { lat: 17.6599, lng: 75.9064 },
    'kolhapur': { lat: 16.7050, lng: 74.2433 },
    'sangli': { lat: 16.8524, lng: 74.5815 },
    'satara': { lat: 17.6805, lng: 74.0183 },
    'ahmednagar': { lat: 19.0948, lng: 74.7480 },
    'jalgaon': { lat: 21.0077, lng: 75.5626 },
    'akola': { lat: 20.7002, lng: 77.0082 },
    'amravati': { lat: 20.9374, lng: 77.7796 },
    'nanded': { lat: 19.1383, lng: 77.3210 },
    'latur': { lat: 18.4088, lng: 76.5604 },
    'dhule': { lat: 20.9042, lng: 74.7749 },
    'panaji': { lat: 15.4909, lng: 73.8278 },
    'margao': { lat: 15.2832, lng: 73.9862 },
    'vasco': { lat: 15.3982, lng: 73.8113 },
    'surat': { lat: 21.1702, lng: 72.8311 },
    'vadodara': { lat: 22.3072, lng: 73.1812 },
    'rajkot': { lat: 22.3039, lng: 70.8022 },
    'bhavnagar': { lat: 21.7645, lng: 72.1519 },
    'jamnagar': { lat: 22.4707, lng: 70.0577 },
    'junagadh': { lat: 21.5222, lng: 70.4579 },
    'gandhinagar': { lat: 23.2156, lng: 72.6369 },
    'anand': { lat: 22.5645, lng: 72.9289 },
    'nadiad': { lat: 22.6916, lng: 72.8634 },
    'bharuch': { lat: 21.7051, lng: 72.9959 },
    'porbandar': { lat: 21.6417, lng: 69.6293 },
    'dwarka': { lat: 22.2394, lng: 68.9678 },
    'somnath': { lat: 20.8880, lng: 70.4012 },
    'udaipur': { lat: 24.5854, lng: 73.7125 },
    'jodhpur': { lat: 26.2389, lng: 73.0243 },
    'ajmer': { lat: 26.4499, lng: 74.6399 },
    'kota': { lat: 25.2138, lng: 75.8648 },
    'bikaner': { lat: 28.0229, lng: 73.3119 },
    'alwar': { lat: 27.5530, lng: 76.6346 },
    'bharatpur': { lat: 27.2152, lng: 77.5030 },
    'sikar': { lat: 27.6094, lng: 75.1399 },
    'pali': { lat: 25.7711, lng: 73.3234 },
    'mount abu': { lat: 24.5926, lng: 72.7156 },
    'pushkar': { lat: 26.4897, lng: 74.5511 },
  };

  const normalizedPlace = place.toLowerCase().trim();

  for (const [city, coords] of Object.entries(cities)) {
    if (normalizedPlace.includes(city)) {
      return coords;
    }
  }

  return cities['hyderabad'];
}

export { NAKSHATRAS, RASHIS };
