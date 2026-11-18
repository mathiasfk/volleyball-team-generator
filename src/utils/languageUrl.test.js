// @vitest-environment happy-dom
import { Window } from 'happy-dom'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { languageFromPath, legacyLanguageUrl } from './languageUrl.js'

beforeAll(() => {
  vi.stubGlobal('localStorage', new Window({ url: 'http://localhost' }).localStorage)
})

afterAll(() => {
  vi.unstubAllGlobals()
})

afterEach(() => {
  window.localStorage.clear()
  vi.resetModules()
})

describe('language entry URLs', () => {
  it.each([
    ['/', 'pt', 'fr-FR', 'en'],
    ['/pt/', 'en', 'es-ES', 'pt'],
    ['/nb/', 'en', 'en-US', 'nb'],
    ['/th/', 'en', 'en-US', 'th'],
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
