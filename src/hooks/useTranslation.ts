import { useSettings } from '../context/SettingsContext';
import { translations, TranslationKeys } from '../utils/translations';

export function useTranslation() {
  const { settings } = useSettings();
  const lang = settings.language as keyof typeof translations;
  
  // Fallback to English if translation is missing
  const t = (key: TranslationKeys) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return { t, lang };
}
