/**
 * Team color configuration
 */
export interface TeamColor {
  name: string
  color: string
  textColor: string
}

/**
 * Returns the team colors array based on translation function
 * @param t - Translation function from i18next
 * @returns Array of team colors
 */
export const getTeamColors = (t: (key: string) => string): TeamColor[] => [
  { name: t('colors.red'), color: '#ef4444', textColor: '#ffffff' },
  { name: t('colors.blue'), color: '#3b82f6', textColor: '#ffffff' },
  { name: t('colors.green'), color: '#22c55e', textColor: '#ffffff' },
  { name: t('colors.purple'), color: '#a855f7', textColor: '#ffffff' },
  { name: t('colors.orange'), color: '#f97316', textColor: '#ffffff' },
  { name: t('colors.pink'), color: '#ec4899', textColor: '#ffffff' },
]

/**
 * Raw team colors without translation (for testing/static use)
 */
export const TEAM_COLORS_RAW = [
  { color: '#ef4444', textColor: '#ffffff' },
  { color: '#3b82f6', textColor: '#ffffff' },
  { color: '#22c55e', textColor: '#ffffff' },
  { color: '#a855f7', textColor: '#ffffff' },
  { color: '#f97316', textColor: '#ffffff' },
  { color: '#ec4899', textColor: '#ffffff' },
] as const


