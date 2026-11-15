export const THEME_STORAGE_KEY = 'volleyball-theme'
export const THEME_PREFERENCES = ['light', 'dark', 'system']
export const normalizeTheme = value => THEME_PREFERENCES.includes(value) ? value : 'system'
export const resolveTheme = (preference, systemDark = false) => {
  const normalized = normalizeTheme(preference)
  return normalized === 'system' ? (systemDark ? 'dark' : 'light') : normalized
}
