import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { languageFromPath, languagePath } from '../utils/languageUrl.js'

const baseUrl = 'https://volleyball-team-generator.com'

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
      if (ogLang && ogLang.content !== locale) {
        const alternate = document.querySelector(`meta[property="og:locale:alternate"][content="${locale}"]`)
        if (alternate) alternate.content = ogLang.content
        ogLang.content = locale
      }

      let twitterTitle = document.querySelector('meta[name="twitter:title"]')
      if (twitterTitle) twitterTitle.setAttribute('content', title)

      let twitterDesc = document.querySelector('meta[name="twitter:description"]')
      if (twitterDesc) twitterDesc.setAttribute('content', description)

      const appName = t('app.title')
      const image = `${baseUrl}${t('seo.image')}`
      const imageAlt = t('seo.imageAlt')
      document.querySelector('meta[name="title"]')?.setAttribute('content', title)
      document.querySelectorAll('meta[name="author"], meta[name="application-name"], meta[name="apple-mobile-web-app-title"], meta[property="og:site_name"]')
        .forEach(meta => meta.setAttribute('content', appName))
      document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]')
        .forEach(meta => meta.setAttribute('content', image))
      document.querySelectorAll('meta[property="og:image:alt"], meta[name="twitter:image:alt"]')
        .forEach(meta => meta.setAttribute('content', imageAlt))
      document.querySelector('link[rel="manifest"]')?.setAttribute('href', t('seo.manifest'))

      // Match the language URLs emitted by the static build, without query strings.
      const canonicalUrl = `${baseUrl}${languagePath(lang)}`
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

      const applicationSchema = document.querySelector('script[type="application/ld+json"]:not([data-schema])')
      if (applicationSchema) {
        const schema = JSON.parse(applicationSchema.textContent)
        const name = t('structuredData.name')
        applicationSchema.textContent = JSON.stringify({
          ...schema,
          name,
          alternateName: t('structuredData.alternateName'),
          description: t('structuredData.description'),
          url: canonicalUrl,
          screenshot: image,
          operatingSystem: t('structuredData.operatingSystem'),
          browserRequirements: t('structuredData.browserRequirements'),
          publisher: { ...schema.publisher, name },
          featureList: t('structuredData.featureList', { returnObjects: true }),
        })
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
        "inLanguage": i18n.language,
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
