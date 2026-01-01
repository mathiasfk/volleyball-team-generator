import { Globe, MessageCircleQuestionMark } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip.jsx'
import { useIsMobile } from '@/hooks/use-mobile'
import { gtag } from '@/services/analytics.js'
import { cn } from '@/utils/ui'

const languages = [
  { code: 'en', labelKey: 'language.english' },
  { code: 'pt', labelKey: 'language.portuguese' },
  { code: 'es', labelKey: 'language.spanish' },
  { code: 'fr', labelKey: 'language.french' },
  { code: 'tr', labelKey: 'language.turkish' },
  { code: 'uk', labelKey: 'language.ukrainian' },
  { code: 'de', labelKey: 'language.german' },
  { code: 'it', labelKey: 'language.italian' },
  { code: 'sr', labelKey: 'language.serbian' },
  { code: 'zh', labelKey: 'language.chinese' },
  { code: 'ja', labelKey: 'language.japanese' },
  { code: 'ru', labelKey: 'language.russian' },
  { code: 'hi', labelKey: 'language.hindi' },
  { code: 'ar', labelKey: 'language.arabic' },
  { code: 'id', labelKey: 'language.indonesian' },
  { code: 'fa', labelKey: 'language.persian' },
  { code: 'ur', labelKey: 'language.urdu' },
  { code: 'bn', labelKey: 'language.bengali' },
  { code: 'tl', labelKey: 'language.tagalog' },
]

const LanguageSelector = ({ onRestartTour }) => {
  const { i18n, t } = useTranslation()
  const isMobile = useIsMobile()

  const handleChange = (newLang) => {
    const previousLang = i18n.language
    
    gtag('event', 'change_language', {
      'previous_language': previousLang,
      'new_language': newLang,
    })
    
    i18n.changeLanguage(newLang)
  }

  return (
    <div className="flex items-center gap-2 tour-language-selector">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onRestartTour}
            className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
            aria-label={t('tour.restart_button')}
          >
            <MessageCircleQuestionMark className="w-4 h-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t('tour.restart_button')}</p>
        </TooltipContent>
      </Tooltip>
      <Select
        value={i18n.language}
        onValueChange={handleChange}
      >
        <SelectTrigger
          className={cn(
            'border-gray-500 text-gray-300 hover:bg-gray-600',
            isMobile ? 'w-[95px]' : 'w-auto min-w-[120px]',
            isMobile && '[&_[data-slot=select-value]_.lang-name]:hidden [&_[data-slot=select-value]_.lang-code]:!inline-block',
            !isMobile && '[&_[data-slot=select-value]_.lang-code]:hidden'
          )}
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 flex-shrink-0" />
            <SelectValue placeholder={t('language.select')} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="flex items-center gap-2">
                <span className="lang-name">{t(lang.labelKey)}</span>
                <span className="lang-code hidden">{lang.code}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default LanguageSelector
