import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import pt from './locales/pt.json'
import es from './locales/es.json'

const resources = {
  en: {
    translation: en
  },
  pt: {
    translation: pt
  },
  es: {
    translation: es
  }
}

// Function to detect language from URL or localStorage
const detectLanguage = () => {
  const supportedLangs = Object.keys(resources)
  const defaultLang = 'en'

  const urlParams = new URLSearchParams(window.location.search)
  const urlLang = urlParams.get('lang')
  const savedLang = localStorage.getItem('i18nextLng')

  // Priority: URL param > localStorage > default
  if (urlLang && supportedLangs.includes(urlLang)) {
    return urlLang
  }

  if (savedLang && supportedLangs.includes(savedLang)) {
    return savedLang
  }

  // Fallback: try browser language (optional, improves UX)
  const browserLang = navigator.language?.slice(0, 2)
  if (browserLang && supportedLangs.includes(browserLang)) {
    return browserLang
  }

  // Default to English
  return defaultLang
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