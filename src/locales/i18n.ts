import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from './vi.json';
import en from './en.json';

export const defaultNS = 'translation';
export const resources = {
  vi: { translation: vi },
  en: { translation: en },
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources,
    lng: 'vi', // Ngôn ngữ mặc định
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false, // React đã tự bảo vệ XSS
    },
  });

export default i18n;
