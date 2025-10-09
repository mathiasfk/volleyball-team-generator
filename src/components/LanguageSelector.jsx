import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select.jsx'

const languages = [
  { code: 'en', labelKey: 'language.english', emoji: '🇺🇸' },
  { code: 'pt', labelKey: 'language.portuguese', emoji: '🇧🇷' },
  { code: 'es', labelKey: 'language.spanish', emoji: '🇪🇸' },
  { code: 'zh', labelKey: 'language.chinese', emoji: '🇨🇳' },
]

const LanguageSelector = () => {
  const { i18n, t } = useTranslation()

  const handleChange = (newLang) => {
    i18n.changeLanguage(newLang)
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-400" />
      <Select
        value={i18n.language}
        onValueChange={handleChange}
      >
        <SelectTrigger
          className="border-gray-500 text-gray-300 hover:bg-gray-600 w-[130px]"
        >
          <SelectValue placeholder={t('language.select')} />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="flex items-center gap-2">
                <span>{lang.emoji}</span>
                {t(lang.labelKey)}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default LanguageSelector
