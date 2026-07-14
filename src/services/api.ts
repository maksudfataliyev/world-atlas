import { Country } from '../types/country';
import countriesData from '../data/countries.json';

// Standard REST Countries API is extremely stable, free, and comprehensive.
const PUBLIC_API_URL = 'https://restcountries.com/v3.1';

// Pre-defined fallback dataset for 12 major countries to ensure the application 
// is ALWAYS fully interactive even if the user has network issues or the API is offline.
const FALLBACK_COUNTRIES: Partial<Country>[] = [
  {
    name: { common: 'United States', official: 'United States of America' },
    cca2: 'US',
    cca3: 'USA',
    capital: ['Washington, D.C.'],
    region: 'Americas',
    subregion: 'North America',
    population: 331002651,
    area: 9833517,
    languages: { eng: 'English' },
    currencies: { USD: { name: 'United States dollar', symbol: '$' } },
    continents: ['North America'],
    flags: {
      png: 'https://flagcdn.com/w320/us.png',
      svg: 'https://flagcdn.com/override/us.svg',
      alt: 'The flag of the United States of America is composed of thirteen equal horizontal stripes of red alternating with white, with a blue rectangle in the canton bearing fifty small white five-pointed stars.'
    },
    coatOfArms: {
      png: 'https://mainfacts.com/media/images/coats_of_arms/us.png',
      svg: 'https://mainfacts.com/media/images/coats_of_arms/us.svg'
    },
    maps: {
      googleMaps: 'https://goo.gl/maps/39YvH6g76wJ6thRz7',
      openStreetMaps: 'https://www.openstreetmap.org/relation/148838'
    },
    timezones: ['UTC-05:00', 'UTC-06:00', 'UTC-07:00', 'UTC-08:00'],
    borders: ['CAN', 'MEX'],
    independent: true,
    unMember: true,
    car: { side: 'right' },
    latlng: [38.0, -97.0],
  },
  {
    name: { common: 'Japan', official: 'Japan' },
    cca2: 'JP',
    cca3: 'JPN',
    capital: ['Tokyo'],
    region: 'Asia',
    subregion: 'Eastern Asia',
    population: 125800000,
    area: 377975,
    languages: { jpn: 'Japanese' },
    currencies: { JPY: { name: 'Japanese yen', symbol: '¥' } },
    continents: ['Asia'],
    flags: {
      png: 'https://flagcdn.com/w320/jp.png',
      svg: 'https://flagcdn.com/override/jp.svg',
      alt: 'The flag of Japan features a red circle, representing the sun, centered on a white background.'
    },
    coatOfArms: {
      png: 'https://mainfacts.com/media/images/coats_of_arms/jp.png',
      svg: 'https://mainfacts.com/media/images/coats_of_arms/jp.svg'
    },
    maps: {
      googleMaps: 'https://goo.gl/maps/87f6tMTZg76Y6thR7',
      openStreetMaps: 'https://www.openstreetmap.org/relation/188240'
    },
    timezones: ['UTC+09:00'],
    borders: [],
    independent: true,
    unMember: true,
    car: { side: 'left' },
    latlng: [36.0, 138.0],
  },
  {
    name: { common: 'France', official: 'French Republic' },
    cca2: 'FR',
    cca3: 'FRA',
    capital: ['Paris'],
    region: 'Europe',
    subregion: 'Western Europe',
    population: 67391582,
    area: 551695,
    languages: { fra: 'French' },
    currencies: { EUR: { name: 'Euro', symbol: '€' } },
    continents: ['Europe'],
    flags: {
      png: 'https://flagcdn.com/w320/fr.png',
      svg: 'https://flagcdn.com/override/fr.svg',
      alt: 'The flag of France is a tricolor composed of three vertical bands of blue, white, and red.'
    },
    coatOfArms: {
      png: 'https://mainfacts.com/media/images/coats_of_arms/fr.png',
      svg: 'https://mainfacts.com/media/images/coats_of_arms/fr.svg'
    },
    maps: {
      googleMaps: 'https://goo.gl/maps/m7f5tMTZg76Y6thR7',
      openStreetMaps: 'https://www.openstreetmap.org/relation/1403916'
    },
    timezones: ['UTC+01:00'],
    borders: ['AND', 'BEL', 'DEU', 'ITA', 'LUX', 'MCG', 'ESP', 'CHE'],
    independent: true,
    unMember: true,
    car: { side: 'right' },
    latlng: [46.0, 2.0],
  },
  {
    name: { common: 'United Kingdom', official: 'United Kingdom of Great Britain and Northern Ireland' },
    cca2: 'GB',
    cca3: 'GBR',
    capital: ['London'],
    region: 'Europe',
    subregion: 'Northern Europe',
    population: 67081000,
    area: 242900,
    languages: { eng: 'English' },
    currencies: { GBP: { name: 'British pound', symbol: '£' } },
    continents: ['Europe'],
    flags: {
      png: 'https://flagcdn.com/w320/gb.png',
      svg: 'https://flagcdn.com/override/gb.svg',
      alt: 'The flag of the United Kingdom - the Union Jack - features red, white, and blue intersecting crosses representing England, Scotland, and Ireland.'
    },
    coatOfArms: {
      png: 'https://mainfacts.com/media/images/coats_of_arms/gb.png',
      svg: 'https://mainfacts.com/media/images/coats_of_arms/gb.svg'
    },
    maps: {
      googleMaps: 'https://goo.gl/maps/u7f5tMTZg76Y6thR7',
      openStreetMaps: 'https://www.openstreetmap.org/relation/62149'
    },
    timezones: ['UTC+00:00'],
    borders: ['IRL'],
    independent: true,
    unMember: true,
    car: { side: 'left' },
    latlng: [54.0, -2.0],
  },
  {
    name: { common: 'Canada', official: 'Canada' },
    cca2: 'CA',
    cca3: 'CAN',
    capital: ['Ottawa'],
    region: 'Americas',
    subregion: 'North America',
    population: 38005238,
    area: 9984670,
    languages: { eng: 'English', fra: 'French' },
    currencies: { CAD: { name: 'Canadian dollar', symbol: '$' } },
    continents: ['North America'],
    flags: {
      png: 'https://flagcdn.com/w320/ca.png',
      svg: 'https://flagcdn.com/override/ca.svg',
      alt: 'The flag of Canada is a red flag with a white square in its centre, containing a red 11-pointed maple leaf.'
    },
    coatOfArms: {
      png: 'https://mainfacts.com/media/images/coats_of_arms/ca.png',
      svg: 'https://mainfacts.com/media/images/coats_of_arms/ca.svg'
    },
    maps: {
      googleMaps: 'https://goo.gl/maps/69YvH6g76wJ6thRz7',
      openStreetMaps: 'https://www.openstreetmap.org/relation/37340'
    },
    timezones: ['UTC-08:00', 'UTC-07:00', 'UTC-06:00', 'UTC-05:00'],
    borders: ['USA'],
    independent: true,
    unMember: true,
    car: { side: 'right' },
    latlng: [60.0, -95.0],
  },
  {
    name: { common: 'Australia', official: 'Commonwealth of Australia' },
    cca2: 'AU',
    cca3: 'AUS',
    capital: ['Canberra'],
    region: 'Oceania',
    subregion: 'Australia and New Zealand',
    population: 25687041,
    area: 7692024,
    languages: { eng: 'English' },
    currencies: { AUD: { name: 'Australian dollar', symbol: '$' } },
    continents: ['Oceania'],
    flags: {
      png: 'https://flagcdn.com/w320/au.png',
      svg: 'https://flagcdn.com/override/au.svg',
      alt: 'The flag of Australia is blue with the Union Jack in the canton, a large white seven-pointed star, and five smaller stars representing the Southern Cross.'
    },
    coatOfArms: {
      png: 'https://mainfacts.com/media/images/coats_of_arms/au.png',
      svg: 'https://mainfacts.com/media/images/coats_of_arms/au.svg'
    },
    maps: {
      googleMaps: 'https://goo.gl/maps/p7f5tMTZg76Y6thR7',
      openStreetMaps: 'https://www.openstreetmap.org/relation/2177215'
    },
    timezones: ['UTC+08:00', 'UTC+09:30', 'UTC+10:00'],
    borders: [],
    independent: true,
    unMember: true,
    car: { side: 'left' },
    latlng: [-27.0, 133.0],
  },
  {
    name: { common: 'Germany', official: 'Federal Republic of Germany' },
    cca2: 'DE',
    cca3: 'DEU',
    capital: ['Berlin'],
    region: 'Europe',
    subregion: 'Western Europe',
    population: 83240525,
    area: 357114,
    languages: { deu: 'German' },
    currencies: { EUR: { name: 'Euro', symbol: '€' } },
    continents: ['Europe'],
    flags: {
      png: 'https://flagcdn.com/w320/de.png',
      svg: 'https://flagcdn.com/override/de.svg',
      alt: 'The flag of Germany is a tricolor composed of three equal horizontal bands of black, red, and gold.'
    },
    coatOfArms: {
      png: 'https://mainfacts.com/media/images/coats_of_arms/de.png',
      svg: 'https://mainfacts.com/media/images/coats_of_arms/de.svg'
    },
    maps: {
      googleMaps: 'https://goo.gl/maps/q7f5tMTZg76Y6thR7',
      openStreetMaps: 'https://www.openstreetmap.org/relation/51477'
    },
    timezones: ['UTC+01:00'],
    borders: ['AUT', 'BEL', 'CZE', 'DNK', 'FRA', 'LUX', 'NLD', 'POL', 'CHE'],
    independent: true,
    unMember: true,
    car: { side: 'right' },
    latlng: [51.0, 9.0],
  },
  {
    name: { common: 'Brazil', official: 'Federative Republic of Brazil' },
    cca2: 'BR',
    cca3: 'BRA',
    capital: ['Brasília'],
    region: 'Americas',
    subregion: 'South America',
    population: 212559409,
    area: 8515767,
    languages: { por: 'Portuguese' },
    currencies: { BRL: { name: 'Brazilian real', symbol: 'R$' } },
    continents: ['South America'],
    flags: {
      png: 'https://flagcdn.com/w320/br.png',
      svg: 'https://flagcdn.com/override/br.svg',
      alt: 'The flag of Brazil has a green field containing a large yellow rhombus, inside which is a blue disc with white stars representing the night sky over Rio de Janeiro, and a curved band with the motto "Ordem e Progresso".'
    },
    coatOfArms: {
      png: 'https://mainfacts.com/media/images/coats_of_arms/br.png',
      svg: 'https://mainfacts.com/media/images/coats_of_arms/br.svg'
    },
    maps: {
      googleMaps: 'https://goo.gl/maps/b7f5tMTZg76Y6thR7',
      openStreetMaps: 'https://www.openstreetmap.org/relation/59470'
    },
    timezones: ['UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00'],
    borders: ['ARG', 'BOL', 'COL', 'GUF', 'GUY', 'PRY', 'PER', 'SUR', 'URY', 'VEN'],
    independent: true,
    unMember: true,
    car: { side: 'right' },
    latlng: [-10.0, -55.0],
  },
  {
    name: { common: 'Italy', official: 'Italian Republic' },
    cca2: 'IT',
    cca3: 'ITA',
    capital: ['Rome'],
    region: 'Europe',
    subregion: 'Southern Europe',
    population: 59554023,
    area: 301336,
    languages: { ita: 'Italian' },
    currencies: { EUR: { name: 'Euro', symbol: '€' } },
    continents: ['Europe'],
    flags: {
      png: 'https://flagcdn.com/w320/it.png',
      svg: 'https://flagcdn.com/override/it.svg',
      alt: 'The flag of Italy is a tricolor featuring three equal vertical bands of green, white, and red.'
    },
    coatOfArms: {
      png: 'https://mainfacts.com/media/images/coats_of_arms/it.png',
      svg: 'https://mainfacts.com/media/images/coats_of_arms/it.svg'
    },
    maps: {
      googleMaps: 'https://goo.gl/maps/i7f5tMTZg76Y6thR7',
      openStreetMaps: 'https://www.openstreetmap.org/relation/365331'
    },
    timezones: ['UTC+01:00'],
    borders: ['AUT', 'FRA', 'SMR', 'SVN', 'CHE', 'VAT'],
    independent: true,
    unMember: true,
    car: { side: 'right' },
    latlng: [42.8, 12.8],
  },
  {
    name: { common: 'India', official: 'Republic of India' },
    cca2: 'IN',
    cca3: 'IND',
    capital: ['New Delhi'],
    region: 'Asia',
    subregion: 'Southern Asia',
    population: 1380004385,
    area: 3287590,
    languages: { hin: 'Hindi', eng: 'English' },
    currencies: { INR: { name: 'Indian rupee', symbol: '₹' } },
    continents: ['Asia'],
    flags: {
      png: 'https://flagcdn.com/w320/in.png',
      svg: 'https://flagcdn.com/override/in.svg',
      alt: 'The flag of India is a horizontal tricolor of deep saffron, white, and green with a 24-spoke navy blue wheel (Ashoka Chakra) centered on the white band.'
    },
    coatOfArms: {
      png: 'https://mainfacts.com/media/images/coats_of_arms/in.png',
      svg: 'https://mainfacts.com/media/images/coats_of_arms/in.svg'
    },
    maps: {
      googleMaps: 'https://goo.gl/maps/p7f5tMTZg76Y6thR8',
      openStreetMaps: 'https://www.openstreetmap.org/relation/304716'
    },
    timezones: ['UTC+05:30'],
    borders: ['BGD', 'BTN', 'MMR', 'CHN', 'NPL', 'PAK'],
    independent: true,
    unMember: true,
    car: { side: 'left' },
    latlng: [20.0, 77.0],
  },
  {
    name: { common: 'South Africa', official: 'Republic of South Africa' },
    cca2: 'ZA',
    cca3: 'ZAF',
    capital: ['Pretoria'],
    region: 'Africa',
    subregion: 'Southern Africa',
    population: 59308690,
    area: 1221037,
    languages: { eng: 'English', zulu: 'isiZulu', xhosa: 'isiXhosa' },
    currencies: { ZAR: { name: 'South African rand', symbol: 'R' } },
    continents: ['Africa'],
    flags: {
      png: 'https://flagcdn.com/w320/za.png',
      svg: 'https://flagcdn.com/override/za.svg',
      alt: 'The flag of South Africa has two equal horizontal bands of red and blue, with a black isosceles triangle centered on the hoist side. A green Y-shaped band with narrow borders of yellow and white separates the red and blue bands and surrounds the black triangle.'
    },
    coatOfArms: {
      png: 'https://mainfacts.com/media/images/coats_of_arms/za.png',
      svg: 'https://mainfacts.com/media/images/coats_of_arms/za.svg'
    },
    maps: {
      googleMaps: 'https://goo.gl/maps/s7f5tMTZg76Y6thR7',
      openStreetMaps: 'https://www.openstreetmap.org/relation/87565'
    },
    timezones: ['UTC+02:00'],
    borders: ['BWA', 'LSO', 'MOZ', 'NAM', 'SWZ', 'ZWE'],
    independent: true,
    unMember: true,
    car: { side: 'left' },
    latlng: [-29.0, 24.0],
  },
  {
    name: { common: 'Switzerland', official: 'Swiss Confederation' },
    cca2: 'CH',
    cca3: 'CHE',
    capital: ['Bern'],
    region: 'Europe',
    subregion: 'Western Europe',
    population: 8654622,
    area: 41285,
    languages: { gsw: 'Swiss German', fra: 'French', ita: 'Italian', roh: 'Romansh' },
    currencies: { CHF: { name: 'Swiss franc', symbol: 'CHF' } },
    continents: ['Europe'],
    flags: {
      png: 'https://flagcdn.com/w320/ch.png',
      svg: 'https://flagcdn.com/override/ch.svg',
      alt: 'The flag of Switzerland is a red square featuring a white cross in the center.'
    },
    coatOfArms: {
      png: 'https://mainfacts.com/media/images/coats_of_arms/ch.png',
      svg: 'https://mainfacts.com/media/images/coats_of_arms/ch.svg'
    },
    maps: {
      googleMaps: 'https://goo.gl/maps/v7f5tMTZg76Y6thR7',
      openStreetMaps: 'https://www.openstreetmap.org/relation/51701'
    },
    timezones: ['UTC+01:00'],
    borders: ['AUT', 'FRA', 'ITA', 'LIE', 'DEU'],
    independent: true,
    unMember: true,
    car: { side: 'right' },
    latlng: [47.0, 8.0],
  }
];

function normalizeCountry(raw: any): Country {
  const cca2 = (raw.cca2 || 'US').toUpperCase();
  const cca3 = (raw.cca3 || 'USA').toUpperCase();
  const commonName = raw.name?.common || raw.name || 'Unknown';
  const officialName = raw.name?.official || commonName;

  // Derive continents if missing
  let continents = raw.continents;
  if (!continents || continents.length === 0) {
    if (raw.region === 'Americas') {
      const isSouth = raw.subregion?.toLowerCase().includes('south');
      continents = isSouth ? ['South America'] : ['North America'];
    } else if (raw.region === 'Europe') {
      continents = ['Europe'];
    } else if (raw.region === 'Asia') {
      continents = ['Asia'];
    } else if (raw.region === 'Africa') {
      continents = ['Africa'];
    } else if (raw.region === 'Oceania') {
      continents = ['Oceania'];
    } else {
      continents = [raw.region || 'Unknown'];
    }
  }

  // Ensure maps is defined
  const maps = raw.maps || {
    googleMaps: `https://goo.gl/maps/${cca3.toLowerCase()}`,
    openStreetMaps: `https://www.openstreetmap.org/relation/${cca2.toLowerCase()}`,
  };

  // Ensure flags is defined
  const flags = raw.flags || {
    png: `https://flagcdn.com/w320/${cca2.toLowerCase()}.png`,
    svg: `https://flagcdn.com/w320/${cca2.toLowerCase()}.svg`,
    alt: `Flag of ${commonName}`,
  };

  // Ensure coatOfArms is defined
  const coatOfArms = raw.coatOfArms || {
    png: `https://mainfacts.com/media/images/coats_of_arms/${cca2.toLowerCase()}.png`,
    svg: `https://mainfacts.com/media/images/coats_of_arms/${cca2.toLowerCase()}.svg`,
  };

  // Ensure timezones is defined
  const timezones = raw.timezones && raw.timezones.length > 0 
    ? raw.timezones 
    : ['UTC+00:00'];

  return {
    name: {
      common: commonName,
      official: officialName,
      nativeName: raw.name?.nativeName || raw.name?.native || undefined,
    },
    tld: raw.tld || [],
    cca2,
    ccn3: raw.ccn3 || '',
    cca3,
    cioc: raw.cioc || '',
    independent: raw.independent !== false,
    status: raw.status || 'officially-assigned',
    unMember: raw.unMember === true,
    currencies: raw.currencies || {},
    idd: raw.idd || {},
    capital: raw.capital || [],
    altSpellings: raw.altSpellings || [],
    region: raw.region || 'Unknown',
    subregion: raw.subregion || '',
    languages: raw.languages || {},
    translations: raw.translations || {},
    latlng: raw.latlng || [0, 0],
    landlocked: raw.landlocked === true,
    borders: raw.borders || [],
    area: typeof raw.area === 'number' ? raw.area : 0,
    demonyms: raw.demonyms || {},
    flag: raw.flag || '🏳️',
    maps,
    population: typeof raw.population === 'number' ? raw.population : 0,
    gini: raw.gini || {},
    fifa: raw.fifa || '',
    car: raw.car || { side: 'right' },
    timezones,
    continents,
    flags,
    coatOfArms,
    startOfWeek: raw.startOfWeek || 'monday',
    capitalInfo: raw.capitalInfo || {},
    postalCode: raw.postalCode || undefined,
  };
}

export async function getAllCountries(): Promise<Country[]> {
  try {
    const response = await fetch(`${PUBLIC_API_URL}/all`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('API returned empty or invalid data');
    }
    
    // Sort alphabetically by common name by default
    return data.sort((a, b) => a.name.common.localeCompare(b.name.common));
  } catch (error) {
    console.warn('REST Countries API error, loading backup dataset:', error);
    // Return our normalized 250 countries local list
    const normalized = (countriesData as any[]).map(normalizeCountry);
    return normalized.sort((a, b) => a.name.common.localeCompare(b.name.common));
  }
}

// Country of the day algorithm: deterministic selection based on the day of year
export function getCountryOfTheDay(countries: Country[]): Country {
  if (!countries || countries.length === 0) {
    const fallbackNormalized = (countriesData as any[]).map(normalizeCountry);
    return fallbackNormalized[0];
  }
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const index = dayOfYear % countries.length;
  return countries[index];
}
