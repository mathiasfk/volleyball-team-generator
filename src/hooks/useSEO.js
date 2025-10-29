import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const useSEO = () => {
  const { i18n } = useTranslation()

  useEffect(() => {
    const updateSEO = () => {
      const lang = i18n.language

      const seoData = {
        en: {
          title: 'Volleyball Team Generator - Create Fair & Balanced Teams Instantly',
          description:
            'Free online volleyball team draw. Automatically create fair and balanced teams from your players. Perfect for coaches, recreational leagues, and pickup games.',
          languageName: 'English',
          locale: 'en_US',
        },
        pt: {
          title: 'Gerador de Times de Vôlei - Crie Times Justos e Equilibrados Instantaneamente',
          description:
            'Sorteio gratuito de times de vôlei online. Crie automaticamente times justos e equilibrados com seus jogadores. Perfeito para treinadores, ligas recreativas e jogos casuais.',
          languageName: 'Português',
          locale: 'pt_BR',
        },
        es: {
          title: 'Generador de Equipos de Voleibol - Crea Equipos Justos y Equilibrados al Instante',
          description:
            'Sorteo gratuito de equipos de voleibol en línea. Crea automáticamente equipos justos y equilibrados con tus jugadores. Perfecto para entrenadores, ligas recreativas y partidos informales.',
          languageName: 'Español',
          locale: 'es_ES',
        },
        zh: {
          title: '排球队伍生成器 - 立即创建公平平衡的队伍',
          description:
            '免费在线排球分队抽签。自动从您的球员中创建公平、均衡的队伍。非常适合教练、娱乐联赛和休闲比赛。',
          languageName: '中文',
          locale: 'zh_CN',
        },
        hi: {
          title: 'वॉलीबॉल टीम जनरेटर - निष्पक्ष और संतुलित टीमें तुरंत बनाएं',
          description:
            'मुफ्त ऑनलाइन वॉलीबॉल टीम ड्रा। अपने खिलाड़ियों से स्वचालित रूप से निष्पक्ष और संतुलित टीमें बनाएं। कोचों, मनोरंजन लीग और आकस्मिक खेलों के लिए बिल्कुल सही।',
          languageName: 'हिन्दी',
          locale: 'hi_IN',
        },
        ar: {
          title: 'مولّد فرق الكرة الطائرة - أنشئ فرقاً عادلة ومتوازنة فوراً',
          description:
            'سحب قرعة مجاني لفرق الكرة الطائرة عبر الإنترنت. كوّن تلقائياً فرقاً عادلة ومتوازنة من لاعبيك. مثالي للمدربين والدوريات الترفيهية والمباريات الودية.',
          languageName: 'العربية',
          locale: 'ar_SA',
        },
        fr: {
          title: "Générateur d'équipes de volley - Créez des équipes justes et équilibrées instantanément",
          description:
            "Tirage au sort gratuit d'équipes de volley en ligne. Créez automatiquement des équipes justes et équilibrées avec vos joueurs. Parfait pour les entraîneurs, les ligues récréatives et les matchs entre amis.",
          languageName: "Français",
          locale: "fr_FR",
        },
        de: {
          title: "Volleyball-Teamgenerator – Erstellen Sie faire und ausgewogene Teams im Handumdrehen",
          description:
            "Kostenlose Volleyball-Teamauslosung online. Erstellen Sie automatisch faire und ausgewogene Teams aus Ihren Spielern. Perfekt für Trainer, Freizeitligen und Freundschaftsspiele.",
          languageName: "Deutsch",
          locale: "de_DE",
        },
        id: {
          title: "Generator Tim Voli - Buat Tim yang Adil & Seimbang Secara Instan",
          description:
            "Pengundian tim voli online gratis. Buat tim yang adil dan seimbang secara otomatis dari pemain Anda. Sempurna untuk pelatih, liga rekreasi, dan pertandingan kasual.",
          languageName: "Bahasa Indonesia",
          locale: "id_ID",
        },
        ru: {
          title: "Генератор волейбольных команд — создавайте честные и сбалансированные команды мгновенно",
          description:
            "Бесплатная жеребьёвка волейбольных команд онлайн. Автоматически создавайте честные и сбалансированные команды из своих игроков. Идеально подходит для тренеров, любительских лиг и дружеских матчей.",
          languageName: "Русский",
          locale: "ru_RU",
        },
        ja: {
          title: "バレーボールチームジェネレーター - 公平でバランスの取れたチームをすぐに作成",
          description:
            "無料のオンラインバレーボールチーム分け。プレイヤーから自動的に公平でバランスの取れたチームを作成します。コーチ、レクリエーションリーグ、気軽な試合に最適です。",
          languageName: "日本語",
          locale: "ja_JP",
        },
        tr: {
          title: "Voleybol Takımı Oluşturucu - Adil ve Dengeli Takımları Anında Oluşturun",
          description:
            "Ücretsiz çevrimiçi voleybol takım çekilişi. Oyuncularınızdan otomatik olarak adil ve dengeli takımlar oluşturun. Antrenörler, amatör ligler ve günlük maçlar için mükemmel.",
          languageName: "Türkçe",
          locale: "tr_TR",
        },
        fa: {
          title: "مولد تیم والیبال - ایجاد تیم‌های عادلانه و متعادل در یک لحظه",
          description:
            "قرعه‌کشی رایگان تیم والیبال آنلاین. به صورت خودکار تیم‌های عادلانه و متعادل از بازیکنان خود ایجاد کنید. عالی برای مربیان، لیگ‌های تفریحی و بازی‌های دوستانه.",
          languageName: "فارسی",
          locale: "fa_IR",
        },
      }
      // Update title and meta tags based on the selected language
      const { title, description, languageName, locale } = seoData[lang] || seoData.en

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
      const rtlLanguages = ['ar', 'fa']
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
    }

    // Initial update
    updateSEO()

    // Update when language changes
    const handleLanguageChange = () => {
      setTimeout(updateSEO, 100) // Small delay to ensure i18n has updated
    }

    i18n.on('languageChanged', handleLanguageChange)
    return () => i18n.off('languageChanged', handleLanguageChange)
  }, [i18n])
}

export default useSEO
