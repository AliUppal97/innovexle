export interface Region {
  id: string;
  name: string;
  currency: string;
  currencySymbol: string;
  exchangeRate: number; // relative to USD
  locale: string;
}

export const regions: Region[] = [
  {
    id: "global",
    name: "Global",
    currency: "USD",
    currencySymbol: "$",
    exchangeRate: 1,
    locale: "en-US",
  },
  {
    id: "europe",
    name: "Europe",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRate: 0.92,
    locale: "de-DE",
  },
  {
    id: "uk",
    name: "United Kingdom",
    currency: "GBP",
    currencySymbol: "£",
    exchangeRate: 0.79,
    locale: "en-GB",
  },
  {
    id: "india",
    name: "India",
    currency: "INR",
    currencySymbol: "₹",
    exchangeRate: 83.5,
    locale: "en-IN",
  },
  {
    id: "canada",
    name: "Canada",
    currency: "CAD",
    currencySymbol: "CA$",
    exchangeRate: 1.36,
    locale: "en-CA",
  },
  {
    id: "pakistan",
    name: "Pakistan",
    currency: "PKR",
    currencySymbol: "₨",
    exchangeRate: 278,
    locale: "en-PK",
  },
];

export function getDefaultRegion(): Region {
  return regions[0];
}

export function getRegionById(id: string): Region | undefined {
  return regions.find((r) => r.id === id);
}

export function convertSalary(
  amountUSD: number,
  targetRegion: Region
): number {
  return Math.round(amountUSD * targetRegion.exchangeRate);
}

export function formatRegionalSalary(
  min: number,
  max: number,
  region: Region
): string {
  const convertedMin = convertSalary(min, region);
  const convertedMax = convertSalary(max, region);

  const formatter = new Intl.NumberFormat(region.locale, {
    style: "currency",
    currency: region.currency,
    maximumFractionDigits: 0,
  });

  return `${formatter.format(convertedMin)} – ${formatter.format(convertedMax)}`;
}
