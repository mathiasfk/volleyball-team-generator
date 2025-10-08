import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import pt from './locales/pt.json'

const resources = {
  en: {
    translation: en
  },
  pt: {
    translation: pt
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || 'en', // get saved language or default to English
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    }
  })

// Save language changes to localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng)
})

export default i18n