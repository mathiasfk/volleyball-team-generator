/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  loadFromStorage,
  saveToStorage,
  removeFromStorage,
  removeMultipleFromStorage,
  existsInStorage,
} from './localStorage'

describe('localStorage utils', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Clear console mocks
    vi.clearAllMocks()
  })

  describe('loadFromStorage', () => {
    it('should load and parse valid JSON data', () => {
      const testData = { name: 'João', id: '1' }
      localStorage.setItem('test-key', JSON.stringify(testData))

      const [data, error] = loadFromStorage<typeof testData>('test-key')

      expect(data).toEqual(testData)
      expect(error).toBeNull()
    })

    it('should return null data when key does not exist', () => {
      const [data, error] = loadFromStorage<any>('non-existent-key')

      expect(data).toBeNull()
      expect(error).toBeNull()
    })

    it('should handle invalid JSON and remove the key', () => {
      localStorage.setItem('test-key', 'invalid-json{')
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const [data, error] = loadFromStorage<any>('test-key')

      expect(data).toBeNull()
      expect(error).toBeInstanceOf(Error)
      expect(localStorage.getItem('test-key')).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })

    it('should load arrays correctly', () => {
      const testData = [
        { id: '1', nome: 'João' },
        { id: '2', nome: 'Maria' },
      ]
      localStorage.setItem('test-key', JSON.stringify(testData))

      const [data, error] = loadFromStorage<typeof testData>('test-key')

      expect(data).toEqual(testData)
      expect(error).toBeNull()
    })

    it('should load primitive values', () => {
      localStorage.setItem('test-number', '42')
      localStorage.setItem('test-string', '"hello"')
      localStorage.setItem('test-boolean', 'true')

      const [num] = loadFromStorage<number>('test-number')
      const [str] = loadFromStorage<string>('test-string')
      const [bool] = loadFromStorage<boolean>('test-boolean')

      expect(num).toBe(42)
      expect(str).toBe('hello')
      expect(bool).toBe(true)
    })
  })

  describe('saveToStorage', () => {
    it('should save data as JSON string', () => {
      const testData = { name: 'João', id: '1' }

      const error = saveToStorage('test-key', testData)

      expect(error).toBeNull()
      expect(localStorage.getItem('test-key')).toBe(JSON.stringify(testData))
    })

    it('should save arrays correctly', () => {
      const testData = [1, 2, 3, 4, 5]

      const error = saveToStorage('test-key', testData)

      expect(error).toBeNull()
      expect(localStorage.getItem('test-key')).toBe(JSON.stringify(testData))
    })

    it('should overwrite existing data', () => {
      localStorage.setItem('test-key', 'old-data')

      const testData = { name: 'New Data' }
      saveToStorage('test-key', testData)

      expect(localStorage.getItem('test-key')).toBe(JSON.stringify(testData))
    })

    it('should handle circular reference errors', () => {
      // Create a circular reference
      const circular: any = { prop: 'value' }
      circular.self = circular

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const error = saveToStorage('test-key', circular)

      expect(error).toBeInstanceOf(Error)
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })

  describe('removeFromStorage', () => {
    it('should remove item from localStorage', () => {
      localStorage.setItem('test-key', 'some-data')

      removeFromStorage('test-key')

      expect(localStorage.getItem('test-key')).toBeNull()
    })

    it('should not throw error when removing non-existent key', () => {
      expect(() => removeFromStorage('non-existent')).not.toThrow()
    })
  })

  describe('removeMultipleFromStorage', () => {
    it('should remove multiple items from localStorage', () => {
      localStorage.setItem('key1', 'data1')
      localStorage.setItem('key2', 'data2')
      localStorage.setItem('key3', 'data3')

      removeMultipleFromStorage(['key1', 'key2', 'key3'])

      expect(localStorage.getItem('key1')).toBeNull()
      expect(localStorage.getItem('key2')).toBeNull()
      expect(localStorage.getItem('key3')).toBeNull()
    })

    it('should handle empty array', () => {
      localStorage.setItem('key1', 'data1')

      expect(() => removeMultipleFromStorage([])).not.toThrow()
      expect(localStorage.getItem('key1')).toBe('data1')
    })

    it('should not throw error for non-existent keys', () => {
      expect(() =>
        removeMultipleFromStorage(['non-existent1', 'non-existent2'])
      ).not.toThrow()
    })
  })

  describe('existsInStorage', () => {
    it('should return true for existing key', () => {
      localStorage.setItem('test-key', 'some-data')

      expect(existsInStorage('test-key')).toBe(true)
    })

    it('should return false for non-existent key', () => {
      expect(existsInStorage('non-existent')).toBe(false)
    })

    it('should return true even for empty string value', () => {
      localStorage.setItem('test-key', '')

      expect(existsInStorage('test-key')).toBe(true)
    })
  })
})

