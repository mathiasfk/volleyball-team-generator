import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button.jsx'
import { Globe } from 'lucide-react'

const LanguageSelector = () => {
  const { i18n, t } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'pt' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      className="border-gray-500 text-gray-300 hover:bg-gray-600"
    >
      <Globe className="w-4 h-4 mr-2" />
      {i18n.language === 'en' ? t('language.portuguese') : t('language.english')}
    </Button>
  )
}

export default LanguageSelector