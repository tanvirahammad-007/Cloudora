export const translations = {
  en: {
    // Sidebar
    overview: 'Home',
    insights: 'Weather info',
    radar: 'Map',
    favorites: 'Saved',
    expeditions: 'Trips',
    identity: 'Profile',
    configuration: 'Settings',

    // Header
    exploreLocations: 'Search a city...',
    globalIndex: 'Search results',
    setLocation: 'Choose a place',
    global: 'World',

    // Settings
    settings: 'Settings',
    appearance: 'Look',
    units: 'Units',
    notifications: 'Alerts',
    language: 'Language',
    theme: 'Theme',
    dark: 'Dark',
    light: 'Light',
    tempUnit: 'Temperature unit',
    windUnit: 'Wind unit',
    animations: 'Motion',
    blur: 'Blur level',
    dynamicBg: 'Moving background',
    compactMode: 'Compact view',
    saveChanges: 'Save',

    // Dashboard/Common
    humidity: 'Humidity',
    windSpeed: 'Wind',
    feelsLike: 'Feels like',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    uvIndex: 'UV',
    pressure: 'Air pressure',
    visibility: 'Visibility',
  },
  bn: {
    // Sidebar
    overview: 'হোম',
    insights: 'আবহাওয়া তথ্য',
    radar: 'মানচিত্র',
    favorites: 'সেভ করা',
    expeditions: 'ভ্রমণ',
    identity: 'প্রোফাইল',
    configuration: 'সেটিংস',

    // Header
    exploreLocations: 'শহর খুঁজুন...',
    globalIndex: 'খোঁজার ফলাফল',
    setLocation: 'জায়গা বাছুন',
    global: 'বিশ্ব',

    // Settings
    settings: 'সেটিংস',
    appearance: 'দেখতে কেমন',
    units: 'ইউনিট',
    notifications: 'সতর্কতা',
    language: 'ভাষা',
    theme: 'থিম',
    dark: 'ডার্ক',
    light: 'লাইট',
    tempUnit: 'তাপমাত্রার ইউনিট',
    windUnit: 'বাতাসের ইউনিট',
    animations: 'নড়াচড়া',
    blur: 'ব্লার মাত্রা',
    dynamicBg: 'চলমান ব্যাকগ্রাউন্ড',
    compactMode: 'ছোট ভিউ',
    saveChanges: 'সেভ করুন',

    // Dashboard/Common
    humidity: 'আর্দ্রতা',
    windSpeed: 'বাতাস',
    feelsLike: 'মনে হয়',
    sunrise: 'সূর্যোদয়',
    sunset: 'সূর্যাস্ত',
    uvIndex: 'ইউভি',
    pressure: 'বায়ুচাপ',
    visibility: 'দৃশ্যমানতা',
  }
};

export type TranslationKeys = keyof typeof translations.en;
