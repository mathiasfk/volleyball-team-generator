import { Window } from 'happy-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ACTIONS, appReducer, initialState } from '../reducers/appReducer.js'
import { createExampleParticipants } from './exampleParticipants.js'
import { loadFromStorage, saveToStorage } from './localStorage.ts'
import { isDuplicateRealPlayerName } from './validation.ts'

afterEach(() => vi.unstubAllGlobals())

describe('example players', () => {
  it('creates individually identified, explicitly marked human examples', () => {
    const examples = createExampleParticipants()

    expect(examples.map(p => p.name)).toEqual(['Ana', 'Bruno', 'Carlos', 'Diana', 'Emir'])
    expect(new Set(examples.map(p => p.id)).size).toBe(examples.length)
    expect(examples.every(p => p.isExample === true)).toBe(true)
  })

  it('restores examples, accepts a real Ana and preserves real and legacy names', () => {
    vi.stubGlobal('localStorage', new Window({ url: 'http://localhost' }).localStorage)
    const examples = createExampleParticipants()
    const real = { id: 'real', name: 'João' }
    const legacy = { id: 'legacy', name: 'Player 1' }
    saveToStorage('players', [...examples, real, legacy])
    const [restored] = loadFromStorage('players')

    expect(isDuplicateRealPlayerName('ana', restored)).toBe(false)
    expect(isDuplicateRealPlayerName('  JOÃO ', restored)).toBe(true)
    expect(isDuplicateRealPlayerName('player 1', restored)).toBe(true)

    const state = { ...initialState, participants: restored, teams: [[examples[0], real]] }
    const next = appReducer(state, { type: ACTIONS.ADD_PARTICIPANT, payload: { id: 'new', name: 'Ana' } })
    expect(next.participants).toEqual([real, legacy, { id: 'new', name: 'Ana' }])
    expect(next.teams).toEqual([])
    expect(isDuplicateRealPlayerName('Ana', next.participants)).toBe(true)
  })
})
