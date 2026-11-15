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
