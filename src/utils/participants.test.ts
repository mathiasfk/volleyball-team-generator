import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Participant } from '@/lib/types'
import {
  createParticipant,
  findParticipantByName,
  namesToParticipants,
  namesToTeams,
  participantsToNames,
  teamsToNames,
} from '@/utils/participants'

describe('participants utils', () => {
  const mockParticipants: Participant[] = [
    { id: '1', nome: 'João' },
    { id: '2', nome: 'Maria' },
    { id: '3', nome: 'Pedro' },
  ]

  describe('participantsToNames', () => {
    it('should convert participants array to names array', () => {
      const result = participantsToNames(mockParticipants)

      expect(result).toEqual(['João', 'Maria', 'Pedro'])
    })

    it('should handle empty array', () => {
      const result = participantsToNames([])

      expect(result).toEqual([])
    })

    it('should preserve order', () => {
      const participants = [
        { id: '1', nome: 'C' },
        { id: '2', nome: 'A' },
        { id: '3', nome: 'B' },
      ]

      const result = participantsToNames(participants)

      expect(result).toEqual(['C', 'A', 'B'])
    })
  })

  describe('namesToParticipants', () => {
    it('should convert names to participants with existing IDs', () => {
      const names = ['João', 'Maria', 'Pedro']

      const result = namesToParticipants(names, mockParticipants)

      expect(result).toEqual(mockParticipants)
    })

    it('should create new participants for unknown names', () => {
      const names = ['Carlos', 'Ana']

      const result = namesToParticipants(names, mockParticipants)

      expect(result).toHaveLength(2)
      expect(result[0].nome).toBe('Carlos')
      expect(result[1].nome).toBe('Ana')
      expect(result[0].id).toBeTruthy()
      expect(result[1].id).toBeTruthy()
    })

    it('should mix existing and new participants', () => {
      const names = ['João', 'Carlos', 'Maria']

      const result = namesToParticipants(names, mockParticipants)

      expect(result).toHaveLength(3)
      expect(result[0]).toEqual({ id: '1', nome: 'João' })
      expect(result[1].nome).toBe('Carlos')
      expect(result[1].id).toBeTruthy()
      expect(result[2]).toEqual({ id: '2', nome: 'Maria' })
    })

    it('should handle empty names array', () => {
      const result = namesToParticipants([], mockParticipants)

      expect(result).toEqual([])
    })

    it('should handle empty existing participants', () => {
      const names = ['João', 'Maria']

      const result = namesToParticipants(names, [])

      expect(result).toHaveLength(2)
      expect(result[0].nome).toBe('João')
      expect(result[1].nome).toBe('Maria')
      expect(result[0].id).toBeTruthy()
      expect(result[1].id).toBeTruthy()
    })
  })

  describe('teamsToNames', () => {
    it('should convert teams of participants to teams of names', () => {
      const teams = [
        [mockParticipants[0], mockParticipants[1]],
        [mockParticipants[2]],
      ]

      const result = teamsToNames(teams)

      expect(result).toEqual([['João', 'Maria'], ['Pedro']])
    })

    it('should handle empty teams array', () => {
      const result = teamsToNames([])

      expect(result).toEqual([])
    })

    it('should handle empty team', () => {
      const teams = [[mockParticipants[0]], []]

      const result = teamsToNames(teams)

      expect(result).toEqual([['João'], []])
    })
  })

  describe('namesToTeams', () => {
    it('should convert teams of names to teams of participants', () => {
      const teamNames = [
        ['João', 'Maria'],
        ['Pedro'],
      ]

      const result = namesToTeams(teamNames, mockParticipants)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual([mockParticipants[0], mockParticipants[1]])
      expect(result[1]).toEqual([mockParticipants[2]])
    })

    it('should handle empty teams array', () => {
      const result = namesToTeams([], mockParticipants)

      expect(result).toEqual([])
    })

    it('should handle mix of known and unknown names', () => {
      const teamNames = [
        ['João', 'Carlos'],
        ['Maria'],
      ]

      const result = namesToTeams(teamNames, mockParticipants)

      expect(result).toHaveLength(2)
      expect(result[0][0]).toEqual({ id: '1', nome: 'João' })
      expect(result[0][1].nome).toBe('Carlos')
      expect(result[0][1].id).toBeTruthy()
      expect(result[1][0]).toEqual({ id: '2', nome: 'Maria' })
    })
  })

  describe('findParticipantByName', () => {
    it('should find participant by exact name', () => {
      const result = findParticipantByName('João', mockParticipants)

      expect(result).toEqual({ id: '1', nome: 'João' })
    })

    it('should find participant case insensitively', () => {
      expect(findParticipantByName('joão', mockParticipants)).toEqual({
        id: '1',
        nome: 'João',
      })
      expect(findParticipantByName('MARIA', mockParticipants)).toEqual({
        id: '2',
        nome: 'Maria',
      })
      expect(findParticipantByName('PeDrO', mockParticipants)).toEqual({
        id: '3',
        nome: 'Pedro',
      })
    })

    it('should return undefined for non-existent name', () => {
      const result = findParticipantByName('Carlos', mockParticipants)

      expect(result).toBeUndefined()
    })

    it('should handle empty participants array', () => {
      const result = findParticipantByName('João', [])

      expect(result).toBeUndefined()
    })
  })

  describe('createParticipant', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should create participant with name and generated ID', () => {
      vi.setSystemTime(new Date('2025-01-01'))

      const result = createParticipant('João')

      expect(result.nome).toBe('João')
      expect(result.id).toBeTruthy()
      expect(typeof result.id).toBe('string')
    })

    it('should create unique IDs for different participants', () => {
      const p1 = createParticipant('João')
      const p2 = createParticipant('Maria')

      expect(p1.id).not.toBe(p2.id)
    })

    it('should handle special characters in name', () => {
      const result = createParticipant('José María')

      expect(result.nome).toBe('José María')
      expect(result.id).toBeTruthy()
    })
  })
})

