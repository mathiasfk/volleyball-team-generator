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

// Function to detect language from URL or localStorage
const detectLanguage = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const urlLang = urlParams.get('lang')
  const savedLang = localStorage.getItem('i18nextLng')
  
  // Priority: URL param > localStorage > default to English
  if (urlLang && (urlLang === 'en' || urlLang === 'pt')) {
    return urlLang
  }
  if (savedLang && (savedLang === 'en' || savedLang === 'pt')) {
    return savedLang
  }
  return 'en'
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detectLanguage(),
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