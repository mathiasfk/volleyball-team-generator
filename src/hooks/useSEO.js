import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { languageFromPath, languagePath } from '../utils/languageUrl.js'

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

      // Match the language URLs emitted by the static build, without query strings.
      const canonicalUrl = `https://volleyball-team-generator.com${languagePath(lang)}`
      document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl)
      document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl)
      document.querySelector('meta[name="twitter:url"]')?.setAttribute('content', canonicalUrl)

      // Update language direction for RTL languages
      const rtlLanguages = ['ar', 'fa', 'ur']
      if (rtlLanguages.includes(lang)) {
        document.documentElement.dir = 'rtl'
      } else {
        document.documentElement.dir = 'ltr'
      }

      // Update HTML lang attribute
      document.documentElement.lang = lang

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

    // Back/forward navigation changes the path without reloading the application.
    const handlePopState = () => {
      const lang = languageFromPath(window.location.pathname)
      if (lang && lang !== i18n.language) i18n.changeLanguage(lang)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [i18n, t])
}

export default useSEO
