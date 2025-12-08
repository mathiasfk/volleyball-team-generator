import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

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

// Function to detect language from path, URL param, or localStorage
const detectLanguage = () => {
  const supportedLangs = Object.keys(resources)
  const defaultLang = 'en'

  // Priority 1: Path-based detection (/ar/, /pt/, etc.)
  const pathname = window.location.pathname
  const pathMatch = pathname.match(/^\/([a-z]{2})\//)
  if (pathMatch) {
    const pathLang = pathMatch[1]
    if (supportedLangs.includes(pathLang) && pathLang !== 'en') {
      return pathLang
    }
  }

  // Priority 2: Query parameter (fallback for old links and dev)
  const urlParams = new URLSearchParams(window.location.search)
  const urlLang = urlParams.get('lang')
  if (urlLang && supportedLangs.includes(urlLang)) {
    return urlLang
  }

  // Priority 3: localStorage
  const savedLang = localStorage.getItem('i18nextLng')
  if (savedLang && supportedLangs.includes(savedLang)) {
    return savedLang
  }

  // Priority 4: Browser language (optional, improves UX)
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