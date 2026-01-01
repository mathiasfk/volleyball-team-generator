import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const localesDir = path.join(rootDir, 'src', 'locales')

const languages = ['en', 'pt', 'es', 'zh', 'hi', 'ar', 'fr', 'de', 'id', 'tr', 'ja', 'ru', 'fa', 'ur', 'bn', 'uk', 'it', 'sr', 'tl']
const baseUrl = 'https://volleyball-team-generator.com'

// Map language codes to Open Graph locale codes
const ogLocaleMap = {
  en: 'en_US',
  pt: 'pt_BR',
  es: 'es_ES',
  zh: 'zh_CN',
  hi: 'hi_IN',
  ar: 'ar_SA',
  fr: 'fr_FR',
  de: 'de_DE',
  id: 'id_ID',
  tr: 'tr_TR',
  ja: 'ja_JP',
  ru: 'ru_RU',
  fa: 'fa_IR',
  ur: 'ur_PK',
  bn: 'bn_BD',
  uk: 'uk_UA',
  it: 'it_IT',
  sr: 'sr_RS',
  tl: 'tl_PH'
}

// RTL languages
const rtlLanguages = ['ar', 'fa', 'ur']

// Escape HTML special characters
function escapeHtml(text) {
  if (!text) return ''
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Load translation file for a language
function loadTranslation(lang) {
  const filePath = path.join(localesDir, `${lang}.json`)
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

// Generate hreflang links for all languages
function generateHreflangLinks(currentLang) {
  return languages.map(lang => {
    const href = lang === 'en' 
      ? `${baseUrl}/`
      : `${baseUrl}/${lang}/`
    return `    <link rel="alternate" hreflang="${lang}" href="${href}" />`
  }).join('\n') + `\n    <link rel="alternate" hreflang="x-default" href="${baseUrl}/" />`
}

// Generate structured data JSON-LD for a specific language
function generateStructuredData(lang, translation) {
  const structuredData = translation.structuredData || {}
  const canonicalUrl = lang === 'en' ? `${baseUrl}/` : `${baseUrl}/${lang}/`
  
  // Load all translations to get language names for availableLanguage
  const languageNames = languages.map(l => {
    try {
      const t = loadTranslation(l)
      return t.seo?.languageName || l
    } catch {
      return l
    }
  })
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": structuredData.name || "Volleyball Team Generator",
    "alternateName": structuredData.alternateName || structuredData.name || "Volleyball Team Generator",
    "description": structuredData.description || "",
    "url": canonicalUrl,
    "screenshot": `${baseUrl}/og-image.png`,
    "applicationCategory": "SportsApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Person",
      "name": "Mathias Kriebel"
    },
    "publisher": {
      "@type": "Organization",
      "name": structuredData.name || "Volleyball Team Generator",
      "url": baseUrl
    },
    "inLanguage": languages,
    "availableLanguage": languageNames,
    "featureList": structuredData.featureList || [],
    "softwareVersion": "1.5",
    "releaseNotes": structuredData.releaseNotes || "Improving WPA support"
  }
  
  return JSON.stringify(schema, null, 2)
}

// Update meta tags in HTML for a specific language
function updateHTMLForLanguage(html, lang, translation) {
  const seo = translation.seo || {}
  const ogLocale = ogLocaleMap[lang] || 'en_US'
  const isRTL = rtlLanguages.includes(lang)
  const dir = isRTL ? 'rtl' : 'ltr'
  
  // Update lang attribute
  html = html.replace(/<html lang="[^"]*">/, `<html lang="${lang}" dir="${dir}">`)
  
  // Update title
  const title = escapeHtml(seo.title || 'Volleyball Team Generator')
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${title}</title>`
  )
  
  // Update meta title
  html = html.replace(
    /<meta name="title" content="[^"]*" \/>/,
    `<meta name="title" content="${title}" />`
  )
  
  // Update meta description
  const description = escapeHtml(seo.description || '')
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${description}" />`
  )
  
  // Update meta language
  const languageName = escapeHtml(seo.languageName || lang)
  html = html.replace(
    /<meta name="language" content="[^"]*" \/>/,
    `<meta name="language" content="${languageName}" />`
  )
  
  // Update canonical URL
  const canonicalUrl = lang === 'en' ? `${baseUrl}/` : `${baseUrl}/${lang}/`
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  )
  
  // Update hreflang links
  const hreflangPattern = /<!-- Language and Region -->[\s\S]*?<link rel="alternate" hreflang="x-default"[^>]*\/>/m
  const hreflangReplacement = `<!-- Language and Region -->\n    <meta name="language" content="${languageName}" />\n${generateHreflangLinks(lang)}`
  html = html.replace(hreflangPattern, hreflangReplacement)
  
  // Update Open Graph URL
  html = html.replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${canonicalUrl}" />`
  )
  
  // Update Open Graph title
  html = html.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${title}" />`
  )
  
  // Update Open Graph description
  html = html.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${description}" />`
  )
  
  // Update Open Graph locale
  html = html.replace(
    /<meta property="og:locale" content="[^"]*" \/>/,
    `<meta property="og:locale" content="${ogLocale}" />`
  )
  
  // Update Twitter URL
  html = html.replace(
    /<meta name="twitter:url" content="[^"]*" \/>/,
    `<meta name="twitter:url" content="${canonicalUrl}" />`
  )
  
  // Update Twitter title
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${title}" />`
  )
  
  // Update Twitter description
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${description}" />`
  )
  
  // Update Structured Data
  const structuredDataJson = generateStructuredData(lang, translation)
  // Match from <!-- Structured Data --> to the closing </script> tag
  const structuredDataPattern = /<!-- Structured Data -->[\s\S]*?<\/script>/m
  const structuredDataReplacement = `<!-- Structured Data -->\n    <script type="application/ld+json">\n    ${structuredDataJson}\n    </script>`
  html = html.replace(structuredDataPattern, structuredDataReplacement)
  
  return html
}

// Create redirect HTML for /en/
function createRedirectHTML() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=/" />
    <script>
      window.location.replace('/');
    </script>
  </head>
  <body>
    <p>Redirecting to <a href="/">home page</a>...</p>
  </body>
</html>`
}

// Main build function
async function buildMultilang() {
  console.log('🚀 Starting multi-language build...\n')
  
  // Step 1: Run Vite build
  console.log('📦 Running Vite build...')
  try {
    execSync('vite build', { 
      stdio: 'inherit',
      cwd: rootDir 
    })
    console.log('✅ Vite build completed\n')
  } catch (error) {
    console.error('❌ Vite build failed:', error.message)
    process.exit(1)
  }
  
  // Step 2: Read the generated index.html
  const indexPath = path.join(distDir, 'index.html')
  if (!fs.existsSync(indexPath)) {
    console.error('❌ dist/index.html not found after build')
    process.exit(1)
  }
  
  let baseHTML = fs.readFileSync(indexPath, 'utf-8')
  console.log('📄 Read base index.html\n')
  
  // Step 3: Create language-specific HTML files
  console.log('🌍 Generating language-specific HTML files...')
  
  for (const lang of languages) {
    if (lang === 'en') {
      // Skip 'en' - it will be handled separately
      continue
    }
    
    try {
      const translation = loadTranslation(lang)
      let langHTML = updateHTMLForLanguage(baseHTML, lang, translation)
      
      // Create language directory
      const langDir = path.join(distDir, lang)
      if (!fs.existsSync(langDir)) {
        fs.mkdirSync(langDir, { recursive: true })
      }
      
      // Write language-specific index.html
      const langIndexPath = path.join(langDir, 'index.html')
      fs.writeFileSync(langIndexPath, langHTML, 'utf-8')
      console.log(`  ✅ Generated /${lang}/index.html`)
    } catch (error) {
      console.error(`  ❌ Failed to generate /${lang}/index.html:`, error.message)
    }
  }
  
  // Step 4: Create /en/ redirect
  const enDir = path.join(distDir, 'en')
  if (!fs.existsSync(enDir)) {
    fs.mkdirSync(enDir, { recursive: true })
  }
  const enIndexPath = path.join(enDir, 'index.html')
  fs.writeFileSync(enIndexPath, createRedirectHTML(), 'utf-8')
  console.log(`  ✅ Generated /en/index.html (redirects to /)\n`)
  
  // Step 5: Update root index.html for English
  const enTranslation = loadTranslation('en')
  baseHTML = updateHTMLForLanguage(baseHTML, 'en', enTranslation)
  fs.writeFileSync(indexPath, baseHTML, 'utf-8')
  console.log('✅ Updated root index.html for English\n')
  
  console.log('🎉 Multi-language build completed successfully!')
}

// Run the build
buildMultilang().catch(error => {
  console.error('❌ Build failed:', error)
  process.exit(1)
})

