/**
 * Converts ISO 3166-1 alpha-2 country codes to full country names.
 * @param code The country code (e.g., 'US', 'GB')
 * @returns The full country name (e.g., 'United States', 'United Kingdom')
 */
export const getCountryName = (code: string): string => {
  try {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return regionNames.of(code) || code;
  } catch (error) {
    console.error('Error translating country code:', error);
    return code;
  }
};
