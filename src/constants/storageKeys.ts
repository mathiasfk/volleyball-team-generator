/**
 * Local storage keys used throughout the application
 */
export const STORAGE_KEYS = {
  PARTICIPANTS: 'volleyball-participants',
  TEAMS: 'volleyball-teams',
  BENCH: 'volleyball-bench',
} as const

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]


