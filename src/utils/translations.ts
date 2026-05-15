export const translations = {
  en: {
    // Sidebar
    overview: 'Overview',
    insights: 'Insights',
    radar: 'Radar',
    favorites: 'Favorites',
    expeditions: 'Expeditions',
    identity: 'Identity',
    configuration: 'Configuration',

    // Header
    exploreLocations: 'Explore locations...',
    globalIndex: 'Global Index',
    setLocation: 'Set Location',
    global: 'Global',

    // Settings
    settings: 'Settings',
    appearance: 'Appearance',
    units: 'Units',
    notifications: 'Notifications',
    language: 'Language',
    theme: 'Theme',
    dark: 'Dark',
    light: 'Light',
    tempUnit: 'Temperature Unit',
    windUnit: 'Wind Speed Unit',
    animations: 'Animations',
    blur: 'Blur Intensity',
    dynamicBg: 'Dynamic Background',
    compactMode: 'Compact Mode',
    saveChanges: 'Save Changes',
    
    // Dashboard/Common
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    feelsLike: 'Feels Like',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    uvIndex: 'UV Index',
    pressure: 'Pressure',
    visibility: 'Visibility',
  },
  bn: {
    // Sidebar
    overview: 'ওভারভিউ',
    insights: 'ইনসাইটস',
    radar: 'রাডার',
    favorites: 'ফেভারিটস',
    expeditions: 'অভিযান',
    identity: 'পরিচয়',
    configuration: 'কনফিগারেশন',

    // Header
    exploreLocations: 'লোকেশন খুঁজুন...',
    globalIndex: 'গ্লোবাল ইনডেক্স',
    setLocation: 'লোকেশন সেট করুন',
    global: 'গ্লোবাল',

    // Settings
    settings: 'সেটিংস',
    appearance: 'অ্যাপিয়ারেন্স',
    units: 'ইউনিটস',
    notifications: 'নোটিফিকেশন',
    language: 'ভাষা',
    theme: 'থিম',
    dark: 'ডার্ক',
    light: 'লাইট',
    tempUnit: 'তাপমাত্রা ইউনিট',
    windUnit: 'বাতাসের গতি ইউনিট',
    animations: 'অ্যানিমেশন',
    blur: 'ব্লার ইনটেনসিটি',
    dynamicBg: 'ডায়নামিক ব্যাকগ্রাউন্ড',
    compactMode: 'কমপ্যাক্ট মোড',
    saveChanges: 'পরিবর্তন সেভ করুন',

    // Dashboard/Common
    humidity: 'আর্দ্রতা',
    windSpeed: 'বাতাসের গতি',
    feelsLike: 'অনুভূত তাপমাত্রা',
    sunrise: 'সূর্যোদয়',
    sunset: 'সূর্যাস্ত',
    uvIndex: 'ইউভি ইনডেক্স',
    pressure: 'বায়ুচাপ',
    visibility: 'দৃশ্যমানতা',
  }
};

export type TranslationKeys = keyof typeof translations.en;
