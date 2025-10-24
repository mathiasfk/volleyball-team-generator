import { describe, expect,it } from 'vitest'

import type { Participant } from './validation'
import { formatParticipantName,isDuplicateName, isEmptyName } from './validation'

describe('validation utils', () => {
  describe('isDuplicateName', () => {
    const participants: Participant[] = [
      { id: '1', nome: 'João' },
      { id: '2', nome: 'Maria' },
      { id: '3', nome: 'Pedro' },
    ]

    it('should return true when name is duplicate', () => {
      expect(isDuplicateName('João', participants)).toBe(true)
      expect(isDuplicateName('Maria', participants)).toBe(true)
    })

    it('should return false when name is not duplicate', () => {
      expect(isDuplicateName('Carlos', participants)).toBe(false)
      expect(isDuplicateName('Ana', participants)).toBe(false)
    })

    it('should be case insensitive', () => {
      expect(isDuplicateName('joão', participants)).toBe(true)
      expect(isDuplicateName('MARIA', participants)).toBe(true)
      expect(isDuplicateName('PeDrO', participants)).toBe(true)
    })

    it('should trim whitespace before comparing', () => {
      expect(isDuplicateName('  João  ', participants)).toBe(true)
      expect(isDuplicateName('Maria   ', participants)).toBe(true)
      expect(isDuplicateName('   Pedro', participants)).toBe(true)
    })

    it('should exclude specific id when provided', () => {
      expect(isDuplicateName('João', participants, '1')).toBe(false)
      expect(isDuplicateName('Maria', participants, '2')).toBe(false)
    })

    it('should still detect duplicates when excluding different id', () => {
      expect(isDuplicateName('João', participants, '2')).toBe(true)
      expect(isDuplicateName('Maria', participants, '1')).toBe(true)
    })

    it('should handle empty participants list', () => {
      expect(isDuplicateName('João', [])).toBe(false)
    })
  })

  describe('isEmptyName', () => {
    it('should return true for empty string', () => {
      expect(isEmptyName('')).toBe(true)
    })

    it('should return true for whitespace only', () => {
      expect(isEmptyName('   ')).toBe(true)
      expect(isEmptyName('\t')).toBe(true)
      expect(isEmptyName('\n')).toBe(true)
      expect(isEmptyName('  \t\n  ')).toBe(true)
    })

    it('should return false for non-empty string', () => {
      expect(isEmptyName('João')).toBe(false)
      expect(isEmptyName('  João  ')).toBe(false)
      expect(isEmptyName('a')).toBe(false)
    })
  })

  describe('formatParticipantName', () => {
    it('should trim whitespace from both ends', () => {
      expect(formatParticipantName('  João  ')).toBe('João')
      expect(formatParticipantName('Maria   ')).toBe('Maria')
      expect(formatParticipantName('   Pedro')).toBe('Pedro')
    })

    it('should preserve internal whitespace', () => {
      expect(formatParticipantName('  João Silva  ')).toBe('João Silva')
      expect(formatParticipantName('Maria  da Silva')).toBe('Maria  da Silva')
    })

    it('should handle already trimmed names', () => {
      expect(formatParticipantName('João')).toBe('João')
      expect(formatParticipantName('Maria')).toBe('Maria')
    })

    it('should handle empty string', () => {
      expect(formatParticipantName('')).toBe('')
      expect(formatParticipantName('   ')).toBe('')
    })
  })
})


