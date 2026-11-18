import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button.jsx'

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const { t } = useTranslation()
  const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
  const Icon = nextTheme === 'light' ? Sun : Moon
  const nextThemeLabel = t(`theme.${nextTheme}`)
  const label = `${t('theme.label')} · ${nextThemeLabel}`

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="size-11 lg:w-auto lg:px-3"
      aria-label={label}
      title={label}
      onClick={() => setTheme(nextTheme)}
    >
      <Icon aria-hidden="true" />
      <span className="hidden lg:inline">{nextThemeLabel}</span>
    </Button>
  )
}
