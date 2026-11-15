/**
 * Local storage keys used throughout the application
 */
export const STORAGE_KEYS = {
  THEME: 'volleyball-theme',
  PARTICIPANTS: 'volleyball-participants',
  TEAMS: 'volleyball-teams',
  BENCH: 'volleyball-bench',
  TOUR_COMPLETED: 'volleyball-tour-completed',
} as const

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]


