import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'

import { normalizeTheme, THEME_PREFERENCES } from '../constants/theme.js'

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()
  return <Select value={normalizeTheme(theme)} onValueChange={setTheme}>
    <SelectTrigger aria-label={t('theme.label')} className="min-h-11 w-[110px] sm:w-[140px] border-input"><SelectValue /></SelectTrigger>
    <SelectContent>{THEME_PREFERENCES.map(value => <SelectItem key={value} value={value}>{t(`theme.${value}`)}</SelectItem>)}</SelectContent>
  </Select>
}
