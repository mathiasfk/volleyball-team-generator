// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest'

import { languageFromPath, legacyLanguageUrl } from './languageUrl.js'

afterEach(() => {
  window.localStorage.clear()
  vi.resetModules()
})

describe('language entry URLs', () => {
  it.each([
    ['/', 'pt', 'fr-FR', 'en'],
    ['/pt/', 'en', 'es-ES', 'pt'],
    ['/es', 'pt', 'en-US', 'es'],
    ['/en/', 'pt', 'pt-BR', 'en'],
  ])('uses %s regardless of saved and browser preferences', async (path, saved, browser, expected) => {
    window.history.replaceState(null, '', path)
    window.localStorage.setItem('i18nextLng', saved)
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue(browser)
    const { default: i18n } = await import('../i18n.js')
    expect(i18n.language).toBe(expected)
    expect(window.location.pathname).toBe(path)
    vi.restoreAllMocks()
  })

  it('redirects recognized legacy root links to their static language page', () => {
    const url = new URL('https://example.com/?lang=pt&campaign=spring#teams')
    expect(legacyLanguageUrl(url).href).toBe('https://example.com/pt/?campaign=spring#teams')
    expect(legacyLanguageUrl(new URL('https://example.com/?lang=en&x=1')).href).toBe('https://example.com/?x=1')
    expect(legacyLanguageUrl(new URL('https://example.com/pt/?lang=es'))).toBeNull()
    expect(legacyLanguageUrl(new URL('https://example.com/?lang=unknown'))).toBeNull()
    expect(languageFromPath('/design-system')).toBeNull()
    expect(languageFromPath('/pt/other')).toBeNull()
  })
})
