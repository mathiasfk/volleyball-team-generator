/**
 * Result tuple from loading data from localStorage
 * [data, error]
 */
export type LoadResult<T> = [T | null, Error | null]

/**
 * Loads and parses data from localStorage
 * @param key - The localStorage key
 * @returns Tuple of [parsedData, error]
 */
export const loadFromStorage = <T>(key: string): LoadResult<T> => {
  const savedData = localStorage.getItem(key)
  let parsedData: T | null = null
  let errorLoading: Error | null = null

  if (savedData) {
    try {
      parsedData = JSON.parse(savedData) as T
    } catch (error) {
      console.error(`❌ Error parsing ${key} from localStorage:`, error)
      localStorage.removeItem(key)
      errorLoading = error instanceof Error ? error : new Error(String(error))
    }
  }

  return [parsedData, errorLoading]
}

/**
 * Saves data to localStorage as JSON
 * @param key - The localStorage key
 * @param data - The data to save
 * @returns Error if save failed, null otherwise
 */
export const saveToStorage = <T>(key: string, data: T): Error | null => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return null
  } catch (error) {
    console.error(`❌ Error saving ${key} to localStorage:`, error)
    return error instanceof Error ? error : new Error(String(error))
  }
}

/**
 * Removes an item from localStorage
 * @param key - The localStorage key
 */
export const removeFromStorage = (key: string): void => {
  localStorage.removeItem(key)
}

/**
 * Removes multiple items from localStorage
 * @param keys - Array of localStorage keys
 */
export const removeMultipleFromStorage = (keys: string[]): void => {
  keys.forEach((key) => localStorage.removeItem(key))
}

/**
 * Checks if a key exists in localStorage
 * @param key - The localStorage key
 * @returns true if key exists, false otherwise
 */
export const existsInStorage = (key: string): boolean => {
  return localStorage.getItem(key) !== null
}


