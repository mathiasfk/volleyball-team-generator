import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const useSEO = () => {
  const { i18n, t } = useTranslation()

  useEffect(() => {
    const updateSEO = () => {
      const lang = i18n.language

      // Get SEO data from translation files
      const title = t('seo.title')
      const description = t('seo.description')
      const languageName = t('seo.languageName')
      const locale = t('seo.locale')

      document.title = title

      let metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) metaDesc.setAttribute('content', description)

      let metaLang = document.querySelector('meta[name="language"]')
      if (metaLang) metaLang.setAttribute('content', languageName)

      let ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) ogTitle.setAttribute('content', title)

      let ogDesc = document.querySelector('meta[property="og:description"]')
      if (ogDesc) ogDesc.setAttribute('content', description)

      let ogLang = document.querySelector('meta[property="og:locale"]')
      if (ogLang) ogLang.setAttribute('content', locale)

      let twitterTitle = document.querySelector('meta[name="twitter:title"]')
      if (twitterTitle) twitterTitle.setAttribute('content', title)

      let twitterDesc = document.querySelector('meta[name="twitter:description"]')
      if (twitterDesc) twitterDesc.setAttribute('content', description)

      // Update canonical URL to point to current language version
      let canonical = document.querySelector('link[rel="canonical"]')
      const baseUrl = 'https://volleyball-team-generator.com'
      const canonicalUrl = lang !== 'en' 
        ? `${baseUrl}/?lang=${lang}`
        : `${baseUrl}/`
      
      if (canonical) {
        canonical.setAttribute('href', canonicalUrl)
      }

      // Update language direction for RTL languages
      const rtlLanguages = ['ar', 'fa', 'ur']
      if (rtlLanguages.includes(lang)) {
        document.documentElement.dir = 'rtl'
      } else {
        document.documentElement.dir = 'ltr'
      }

      // Update HTML lang attribute
      document.documentElement.lang = lang

      // Update URL with language parameter
      const url = new URL(window.location)
      if (lang !== 'en') {
        url.searchParams.set('lang', lang)
      } else {
        url.searchParams.delete('lang')
      }

      // Only update URL if it's different to avoid history pollution
      if (url.toString() !== window.location.toString()) {
        window.history.replaceState({}, '', url.toString())
      }

      // Update FAQ Schema
      updateFAQSchema()
    }

    const updateFAQSchema = () => {
      // Remove existing FAQ schema if present
      const existingSchema = document.querySelector('script[data-schema="faq"]')
      if (existingSchema) {
        existingSchema.remove()
      }

      // Get FAQ questions from translations
      const questions = t('faq.questions', { returnObjects: true })
      
      if (!questions || !Array.isArray(questions)) {
        return
      }

      // Create FAQ schema
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": questions.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      }

      // Inject schema into document
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-schema', 'faq')
      script.textContent = JSON.stringify(faqSchema)
      document.head.appendChild(script)
    }

    // Initial update
    updateSEO()

    // Update when language changes
    const handleLanguageChange = () => {
      setTimeout(updateSEO, 100) // Small delay to ensure i18n has updated
    }

    i18n.on('languageChanged', handleLanguageChange)
    return () => i18n.off('languageChanged', handleLanguageChange)
  }, [i18n, t])
}

export default useSEO
