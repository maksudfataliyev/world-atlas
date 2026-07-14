export interface CountryName {
  common: string;
  official: string;
  nativeName?: {
    [key: string]: {
      official: string;
      common: string;
    };
  };
}

export interface Currencies {
  [code: string]: {
    name: string;
    symbol: string;
  };
}

export interface Languages {
  [code: string]: string;
}

export interface Maps {
  googleMaps: string;
  openStreetMaps: string;
}

export interface Flags {
  png: string;
  svg: string;
  alt?: string;
}

export interface CoatOfArms {
  png?: string;
  svg?: string;
}

export interface Country {
  name: CountryName;
  tld?: string[];
  cca2: string;
  ccn3?: string;
  cca3: string;
  cioc?: string;
  independent?: boolean;
  status?: string;
  unMember?: boolean;
  currencies?: Currencies;
  idd?: {
    root?: string;
    suffixes?: string[];
  };
  capital?: string[];
  altSpellings?: string[];
  region: string;
  subregion?: string;
  languages?: Languages;
  translations?: {
    [key: string]: {
      official: string;
      common: string;
    };
  };
  latlng: [number, number];
  landlocked?: boolean;
  borders?: string[];
  area: number;
  demonyms?: {
    [key: string]: {
      f: string;
      m: string;
    };
  };
  flag?: string;
  maps: Maps;
  population: number;
  gini?: {
    [year: string]: number;
  };
  fifa?: string;
  car?: {
    signs?: string[];
    side: 'left' | 'right';
  };
  timezones: string[];
  continents: string[];
  flags: Flags;
  coatOfArms?: CoatOfArms;
  startOfWeek?: string;
  capitalInfo?: {
    latlng?: [number, number];
  };
  postalCode?: {
    format: string;
    regex?: string;
  };
}

export interface Preferences {
  theme: 'dark' | 'light' | 'system';
  accentColor: 'indigo' | 'emerald' | 'amber' | 'rose' | 'blue' | 'purple';
  animationsEnabled: boolean;
  units: 'metric' | 'imperial';
  language: 'en' | 'es' | 'fr' | 'de' | 'zh';
}
