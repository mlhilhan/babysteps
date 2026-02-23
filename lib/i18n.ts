import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import trTranslation from '@/locales/tr.json';
import enTranslation from '@/locales/en.json';
import arTranslation from '@/locales/ar.json';
import deTranslation from '@/locales/de.json';
import esTranslation from '@/locales/es.json';
import frTranslation from '@/locales/fr.json';
import hiTranslation from '@/locales/hi.json';
import itTranslation from '@/locales/it.json';
import jaTranslation from '@/locales/ja.json';
import koTranslation from '@/locales/ko.json';
import nlTranslation from '@/locales/nl.json';
import ptTranslation from '@/locales/pt.json';
import ruTranslation from '@/locales/ru.json';
import svTranslation from '@/locales/sv.json';
import zhTranslation from '@/locales/zh.json';

const resources = {
  tr: { translation: trTranslation },
  en: { translation: enTranslation },
  ar: { translation: arTranslation },
  de: { translation: deTranslation },
  es: { translation: esTranslation },
  fr: { translation: frTranslation },
  hi: { translation: hiTranslation },
  it: { translation: itTranslation },
  ja: { translation: jaTranslation },
  ko: { translation: koTranslation },
  nl: { translation: nlTranslation },
  pt: { translation: ptTranslation },
  ru: { translation: ruTranslation },
  sv: { translation: svTranslation },
  zh: { translation: zhTranslation },
};

const SUPPORTED_LANGS = Object.keys(resources) as string[];

const hasStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const customLanguageDetector = {
  type: 'languageDetector' as const,
  detect: (): string => {
    if (typeof window === 'undefined') return 'en';
    try {
      if (hasStorage()) {
        const stored = window.localStorage.getItem('i18nextLng');
        if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
      }
    } catch {
      // React Native etc.: no localStorage
    }
    const browser = navigator.language || (navigator as { userLanguage?: string }).userLanguage || '';
    const code = browser.split('-')[0].toLowerCase();
    return SUPPORTED_LANGS.includes(code) ? code : 'en';
  },
  init: () => {},
  cacheUserLanguage: (lng: string) => {
    try {
      if (hasStorage()) {
        window.localStorage.setItem('i18nextLng', lng);
      } else {
        void AsyncStorage.setItem('language', lng);
      }
    } catch {
      // ignore
    }
  },
};

i18next
  .use(customLanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'en',
    supportedLngs: SUPPORTED_LANGS,
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18next;
