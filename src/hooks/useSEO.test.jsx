// @vitest-environment happy-dom
import { Window } from 'happy-dom'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import i18n from '../i18n.js'
import { selectLanguage } from '../utils/languageUrl.js'
import useSEO from './useSEO.js'

function SEO() {
  useSEO()
  return null
}

describe('language selection and SEO', () => {
  let root
  let container

  beforeAll(() => {
    vi.stubGlobal('localStorage', new Window({ url: 'http://localhost' }).localStorage)
  })

  afterAll(() => {
    vi.unstubAllGlobals()
  })

  beforeEach(async () => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true
    window.history.replaceState({ existing: true }, '', '/?campaign=spring#teams')
    document.head.innerHTML = '<link rel="canonical" href="https://volleyball-team-generator.com/"><meta property="og:url"><meta name="twitter:url">'
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    await act(async () => {
      await i18n.changeLanguage('en')
      root.render(<SEO />)
    })
  })

  afterEach(async () => {
    await act(async () => root.unmount())
    container.remove()
    delete globalThis.IS_REACT_ACT_ENVIRONMENT
  })

  it('updates the path and canonical together, preserving state, parameters and hash', async () => {
    await act(async () => selectLanguage('pt', i18n))
    expect(window.location.pathname + window.location.search + window.location.hash).toBe('/pt/?campaign=spring#teams')
    expect(window.history.state).toEqual({ existing: true })
    expect(document.documentElement.lang).toBe('pt')
    expect(document.querySelector('link[rel="canonical"]').href).toBe('https://volleyball-team-generator.com/pt/')
    expect(document.querySelector('meta[property="og:url"]').content).toBe('https://volleyball-team-generator.com/pt/')
    expect(document.querySelector('meta[name="twitter:url"]').content).toBe('https://volleyball-team-generator.com/pt/')

    await act(async () => selectLanguage('en', i18n))
    expect(window.location.pathname).toBe('/')
    expect(document.querySelector('link[rel="canonical"]').href).toBe('https://volleyball-team-generator.com/')
  })

  it('updates the Norwegian social, install and structured metadata on language changes', async () => {
    document.head.insertAdjacentHTML('beforeend', `
      <meta property="og:locale" content="en_US">
      <meta property="og:locale:alternate" content="nb_NO">
      <meta property="og:image:alt">
      <meta name="twitter:image">
      <meta name="apple-mobile-web-app-title">
      <link rel="manifest" href="/site.webmanifest">
      <script type="application/ld+json">{"@type":"WebApplication"}</script>
    `)

    await act(async () => selectLanguage('nb', i18n))
    expect(window.location.pathname).toBe('/nb/')
    expect(document.documentElement.lang).toBe('nb')
    expect(document.querySelector('meta[property="og:locale"]').content).toBe('nb_NO')
    expect(document.querySelector('meta[property="og:locale:alternate"]').content).toBe('en_US')
    expect(document.querySelector('meta[property="og:image:alt"]').content).toMatch(/^Skjermbilde/)
    expect(document.querySelector('meta[name="twitter:image"]').content).toBe('https://volleyball-team-generator.com/nb/og-image.png')
    expect(document.querySelector('meta[name="apple-mobile-web-app-title"]').content).toBe('Lagtrekning for volleyball')
    expect(document.querySelector('link[rel="manifest"]').getAttribute('href')).toBe('/nb/site.webmanifest')

    const appSchema = JSON.parse(document.querySelector('script[type="application/ld+json"]:not([data-schema])').textContent)
    expect(appSchema).toMatchObject({
      name: 'Lagtrekning for volleyball',
      browserRequirements: 'Krever JavaScript.',
      url: 'https://volleyball-team-generator.com/nb/',
    })
    const faqSchema = JSON.parse(document.querySelector('script[data-schema="faq"]').textContent)
    expect(faqSchema.inLanguage).toBe('nb')
    expect(faqSchema.mainEntity[0].name).toBe('Hvordan fungerer lagtrekningen?')

    await act(async () => selectLanguage('en', i18n))
    expect(document.querySelector('meta[property="og:locale"]').content).toBe('en_US')
    expect(document.querySelector('link[rel="manifest"]').getAttribute('href')).toBe('/site.webmanifest')
  })

  it('synchronizes the language and canonical on back and forward', async () => {
    await act(async () => selectLanguage('pt', i18n))
    await act(async () => {
      window.history.back()
      await window.happyDOM.waitUntilComplete()
    })
    expect(window.location.pathname).toBe('/')
    expect(i18n.language).toBe('en')
    expect(document.querySelector('link[rel="canonical"]').href).toBe('https://volleyball-team-generator.com/')
    await act(async () => {
      window.history.forward()
      await window.happyDOM.waitUntilComplete()
    })
    expect(window.location.pathname).toBe('/pt/')
    expect(i18n.language).toBe('pt')
    expect(document.querySelector('link[rel="canonical"]').href).toBe('https://volleyball-team-generator.com/pt/')
  })
})
