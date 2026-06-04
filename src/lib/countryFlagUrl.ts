/** ISO 3166-1 alpha-3 (F1) → alpha-2 for flag CDN. */
const F1_COUNTRY_TO_ISO2: Record<string, string> = {
  GBR: "gb",
  USA: "us",
  NED: "nl",
  ITA: "it",
  ESP: "es",
  FRA: "fr",
  MON: "mc",
  CAN: "ca",
  AUS: "au",
  JPN: "jp",
  CHN: "cn",
  BRA: "br",
  MEX: "mx",
  AUT: "at",
  BEL: "be",
  HUN: "hu",
  SGP: "sg",
  AZE: "az",
  SAU: "sa",
  QAT: "qa",
  UAE: "ae",
  GER: "de",
  FIN: "fi",
  DEN: "dk",
  THA: "th",
  CHI: "cl",
  ARG: "ar",
  COL: "co",
  SUI: "ch",
  POL: "pl",
  POR: "pt",
  ISR: "il",
  NZL: "nz",
  ZAF: "za",
};

export function countryFlagUrl(countryCode: string): string {
  const key = countryCode.trim().toUpperCase();
  const iso2 =
    key.length === 2
      ? key.toLowerCase()
      : (F1_COUNTRY_TO_ISO2[key] ?? key.slice(0, 2).toLowerCase());
  return `https://flagcdn.com/w80/${iso2}.png`;
}
