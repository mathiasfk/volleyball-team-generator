import './index.css'
import './App.css'
import './i18n.js'

import { ThemeProvider, useTheme } from 'next-themes'
import { StrictMode } from 'react'
import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'

import DesignSystemPage from './components/DesignSystemPage.jsx'
import MainApp from './components/MainApp.jsx'
import { normalizeTheme, THEME_STORAGE_KEY } from './constants/theme.js'
import { legacyLanguageUrl } from './utils/languageUrl.js'

function BrowserThemeColor() {
  const { resolvedTheme, setTheme } = useTheme()
  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolvedTheme === 'dark' ? '#141716' : '#EDE6E3')
  }, [resolvedTheme])
  useEffect(() => {
    const recoverInvalidPreference = event => {
      if (event.key === THEME_STORAGE_KEY && event.newValue !== null && normalizeTheme(event.newValue) !== event.newValue) {
        queueMicrotask(() => setTheme('system'))
      }
    }
    window.addEventListener('storage', recoverInvalidPreference)
    return () => window.removeEventListener('storage', recoverInvalidPreference)
  }, [setTheme])
  return null
}

// Check if design system page should be shown (via query parameter for dev/internal use)
const urlParams = new URLSearchParams(window.location.search)
const showDesignSystem = urlParams.has('design-system') || urlParams.has('ds')

const legacyUrl = legacyLanguageUrl(window.location)
if (legacyUrl) {
  // Load the static HTML for the target language, including its initial canonical.
  window.location.replace(legacyUrl.href)
} else {
  const root = createRoot(document.getElementById('root'))

  root.render(
    <StrictMode>
      <ThemeProvider attribute="class" storageKey={THEME_STORAGE_KEY} defaultTheme="system" enableSystem enableColorScheme disableTransitionOnChange>
        <BrowserThemeColor />
        {showDesignSystem ? <DesignSystemPage /> : <MainApp />}
      </ThemeProvider>
    </StrictMode>,
  )
}
