// Novo arquivo para gerar sitemap no build
import fs from 'fs'

const languages = ['en', 'pt', 'es', 'zh', 'hi', 'ar', 'fr', 'de', 'id', 'tr', 'ja', 'ru', 'fa', 'ur', 'bn', 'uk', 'it', 'sr']
const baseUrl = 'https://volleyball-team-generator.com'
const lastmod = new Date().toISOString().split('T')[0]

// Generate hreflang links for all languages
function generateHreflangLinks() {
  return languages.map(lang => {
    const href = lang === 'en' 
      ? `${baseUrl}/`
      : `${baseUrl}/${lang}/`
    return `    <xhtml:link
      rel="alternate"
      hreflang="${lang}"
      href="${href}" />`
  }).join('\n') + `\n    <xhtml:link
      rel="alternate"
      hreflang="x-default"
      href="${baseUrl}/" />`
}

// Generate sitemap with one URL entry per language
const urlEntries = languages.map(lang => {
  const loc = lang === 'en' 
    ? `${baseUrl}/`
    : `${baseUrl}/${lang}/`
  
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}T00:00:00+00:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
${generateHreflangLinks()}
  </url>`
}).join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>`

fs.writeFileSync('public/sitemap.xml', sitemap)
console.log('✅ Sitemap generated!')
