import { describe, expect, it } from 'vitest'

import { normalizeTheme, resolveTheme, THEME_PREFERENCES, THEME_STORAGE_KEY } from './theme.js'

describe('theme preference contract', () => {
  it('normalizes missing and invalid values to system', () => {
    expect(normalizeTheme(null)).toBe('system')
    expect(normalizeTheme('invalid')).toBe('system')
    for (const value of THEME_PREFERENCES) expect(normalizeTheme(value)).toBe(value)
  })
  it('resolves system with light fallback while respecting explicit choices', () => {
    expect(resolveTheme('system')).toBe('light')
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('invalid', true)).toBe('dark')
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })
  it('matches the bootstrap storage contract', () => {
    expect(THEME_STORAGE_KEY).toBe('volleyball-theme')
  })
})

describe('head bootstrap', () => {
  it.each([
    ['light', true, 'light'],
    ['dark', false, 'dark'],
    ['system', true, 'dark'],
    ['invalid', false, 'light'],
    [null, true, 'dark'],
  ])('resolves %s with system dark=%s to %s', async (saved, systemDark, expected) => {
    const { readFileSync } = await import('node:fs')
    const { runInNewContext } = await import('node:vm')
    const html = readFileSync('index.html', 'utf8')
    const script = html.match(/<script>\s*([\s\S]*?)<\/script>/i)[1]
    const classes = new Set(['unrelated'])
    const root = { classList: { remove: (...values) => values.forEach(v => classes.delete(v)), add: value => classes.add(value) }, style: {} }
    const meta = {}
    const localStorage = { getItem: () => saved, removeItem: () => {} }
    runInNewContext(script, { localStorage, document: { documentElement: root, querySelector: () => meta }, window: { matchMedia: () => ({ matches: systemDark }) } })
    expect(classes.has(expected)).toBe(true)
    expect(classes.has('unrelated')).toBe(true)
    expect(root.style.colorScheme).toBe(expected)
    expect(meta.content).toBe(expected === 'dark' ? '#141716' : '#EDE6E3')
  })
  it('works when storage is unavailable', async () => {
    const { readFileSync } = await import('node:fs')
    const { runInNewContext } = await import('node:vm')
    const script = readFileSync('index.html', 'utf8').match(/<script>\s*([\s\S]*?)<\/script>/i)[1]
    const root = { classList: { remove() {}, add() {} }, style: {} }
    expect(() => runInNewContext(script, { localStorage: { getItem() { throw Error('blocked') } }, document: { documentElement: root, querySelector: () => ({}) }, window: {} })).not.toThrow()
    expect(root.style.colorScheme).toBe('light')
  })
})
