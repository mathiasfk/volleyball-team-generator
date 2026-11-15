import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { languageFromPath } from './utils/languageUrl.js'

// Import all locale files dynamically
const localeFiles = import.meta.glob('./locales/*.json', { eager: true })

// Transform the imports into the resources object
const resources = Object.entries(localeFiles).reduce((acc, [path, module]) => {
  // Extract the language code from the path (e.g., './locales/en.json' -> 'en')
  const lang = path.match(/\.\/locales\/(.+)\.json/)[1]
  
  acc[lang] = {
    translation: module.default || module
  }
  return acc
}, {})

// Indexable home pages always derive their language from their path.
const detectLanguage = () => {
  const pathLanguage = languageFromPath(window.location.pathname)
  if (pathLanguage) return pathLanguage

  // Preserve the existing preference behavior for unrelated routes.
  const supportedLangs = Object.keys(resources)
  const urlLang = new URLSearchParams(window.location.search).get('lang')
  if (supportedLangs.includes(urlLang)) return urlLang
  const savedLang = window.localStorage.getItem('i18nextLng')
  if (supportedLangs.includes(savedLang)) return savedLang
  const browserLang = window.navigator.language?.slice(0, 2)
  return supportedLangs.includes(browserLang) ? browserLang : 'en'
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
  window.localStorage.setItem('i18nextLng', lng)
})

export default i18n
