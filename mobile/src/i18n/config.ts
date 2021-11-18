import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import common from './en/common.json';
import news from './en/news.json';
import auth from './en/auth.json';

export const resources = {
  en: {
    common,
    auth,
    news,
  },
} as const;

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  ns: ['common', 'auth', 'news'],
  resources,
});
