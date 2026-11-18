import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button.jsx'
import { gtag } from '@/services/analytics.js'

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const { t } = useTranslation()
  const theme = resolvedTheme ?? (document.documentElement.classList.contains('dark') ? 'dark' : 'light')
  const nextTheme = theme === 'dark' ? 'light' : 'dark'
  const Icon = nextTheme === 'light' ? Sun : Moon
  const nextThemeLabel = t(`theme.${nextTheme}`)
  const label = `${t('theme.label')} · ${nextThemeLabel}`

  const handleClick = () => {
    setTheme(nextTheme)
    gtag('event', 'change_theme', { new_theme: nextTheme })
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="size-11 lg:w-auto lg:px-3"
      aria-label={label}
      title={label}
      onClick={handleClick}
    >
      <Icon aria-hidden="true" />
      <span className="hidden lg:inline">{nextThemeLabel}</span>
    </Button>
  )
}
