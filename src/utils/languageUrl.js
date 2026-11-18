// Keep these codes aligned with the locale files and the static multilingual build.
export const supportedLanguages = ['en', 'pt', 'es', 'zh', 'hi', 'ar', 'fr', 'de', 'id', 'tr', 'ja', 'ru', 'fa', 'ur', 'bn', 'uk', 'it', 'sr', 'tl', 'nb']

export const languagePath = (lang) => lang === 'en' ? '/' : `/${lang}/`

// Only the home pages represent language routes; leave unrelated paths alone.
export function languageFromPath(pathname) {
  if (pathname === '/') return 'en'
  const match = pathname.match(/^\/([a-z]{2})\/?$/)
  return match && supportedLanguages.includes(match[1]) ? match[1] : null
}

export function legacyLanguageUrl(location) {
  if (location.pathname !== '/') return null
  const url = new URL(location.href)
  const lang = url.searchParams.get('lang')
  if (!supportedLanguages.includes(lang)) return null
  url.pathname = languagePath(lang)
  url.searchParams.delete('lang')
  return url
}

export function selectLanguage(lang, i18n, browser = window) {
  if (!supportedLanguages.includes(lang)) return
  const url = new URL(browser.location.href)
  if (languageFromPath(url.pathname) !== null) {
    url.pathname = languagePath(lang)
    url.searchParams.delete('lang')
    if (url.href !== browser.location.href) {
      browser.history.pushState(browser.history.state, '', url.href)
    }
  }
  i18n.changeLanguage(lang)
}
