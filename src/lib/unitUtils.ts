export function convertTemp(celsius: number, unit: 'C' | 'F'): number {
  if (unit === 'C') return celsius;
  return (celsius * 9) / 5 + 32;
}

export function convertWindSpeed(kmh: number, unit: 'km/h' | 'mph' | 'm/s' | 'knots'): number {
  switch (unit) {
    case 'km/h':
      return kmh;
    case 'mph':
      return kmh / 1.60934;
    case 'm/s':
      return kmh / 3.6;
    case 'knots':
      return kmh / 1.852;
    default:
      return kmh;
  }
}

export function formatTemp(celsius: number, unit: 'C' | 'F'): string {
  const value = convertTemp(celsius, unit);
  return `${Math.round(value)}°${unit}`;
}
