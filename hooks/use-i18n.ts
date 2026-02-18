import { useTranslation as useTranslationBase } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useTranslation() {
  const { t, i18n } = useTranslationBase();

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem('language', lang);
  };

  return {
    t,
    i18n,
    changeLanguage,
    currentLanguage: i18n.language,
  };
}
