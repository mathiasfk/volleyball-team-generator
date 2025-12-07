// Novo arquivo para gerar sitemap no build
import fs from 'fs'

const languages = ['en', 'pt', 'es', 'zh', 'hi', 'ar', 'fr', 'de', 'id', 'tr', 'ja', 'ru', 'fa', 'ur', 'bn', 'uk', 'it', 'sr']
const baseUrl = 'https://volleyball-team-generator.com'
const lastmod = new Date().toISOString().split('T')[0]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${lastmod}T00:00:00+00:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    ${languages.map(lang => `
    <xhtml:link
      rel="alternate"
      hreflang="${lang}"
      href="${baseUrl}${lang !== 'en' ? `/?lang=${lang}` : '/'}" />`).join('')}
    <xhtml:link
      rel="alternate"
      hreflang="x-default"
      href="${baseUrl}/" />
  </url>
</urlset>`

fs.writeFileSync('public/sitemap.xml', sitemap)
console.log('✅ Sitemap generated!')
