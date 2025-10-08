import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const useSEO = () => {
  const { i18n } = useTranslation()

  useEffect(() => {
    const updateSEO = () => {
      const isPortuguese = i18n.language === 'pt'
      
      // Update title
      const title = isPortuguese 
        ? 'Sorteio de Times de Vôlei - Crie Times Justos e Equilibrados Instantaneamente'
        : 'Volleyball Team Generator - Create Fair & Balanced Teams Instantly'
      document.title = title
      
      // Update meta description
      const description = isPortuguese
        ? 'Gerador gratuito de times de vôlei online. Crie automaticamente times justos e equilibrados com seus jogadores. Perfeito para treinadores, ligas recreativas e jogos casuais.'
        : 'Free online volleyball team generator. Automatically create fair and balanced teams from your players. Perfect for coaches, recreational leagues, and pickup games.'
        
      let metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) {
        metaDesc.setAttribute('content', description)
      }
      
      // Update Open Graph title
      let ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) {
        ogTitle.setAttribute('content', title)
      }
      
      // Update Open Graph description
      let ogDesc = document.querySelector('meta[property="og:description"]')
      if (ogDesc) {
        ogDesc.setAttribute('content', description)
      }
      
      // Update Twitter title
      let twitterTitle = document.querySelector('meta[name="twitter:title"]')
      if (twitterTitle) {
        twitterTitle.setAttribute('content', title)
      }
      
      // Update Twitter description
      let twitterDesc = document.querySelector('meta[name="twitter:description"]')
      if (twitterDesc) {
        twitterDesc.setAttribute('content', description)
      }
      
      // Update HTML lang attribute
      document.documentElement.lang = isPortuguese ? 'pt' : 'en'
      
      // Update URL with language parameter
      const url = new URL(window.location)
      if (isPortuguese) {
        url.searchParams.set('lang', 'pt')
      } else {
        url.searchParams.delete('lang')
      }
      
      // Only update URL if it's different to avoid history pollution
      if (url.toString() !== window.location.toString()) {
        window.history.replaceState({}, '', url.toString())
      }
    }

    // Initial update
    updateSEO()
    
    // Update when language changes
    const handleLanguageChange = () => {
      setTimeout(updateSEO, 100) // Small delay to ensure i18n has updated
    }
    
    i18n.on('languageChanged', handleLanguageChange)
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])
}

export default useSEO