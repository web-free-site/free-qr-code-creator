import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createJiti } from 'jiti'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.join(__dirname, '..', 'dist')
const siteUrl = process.env.SITE_URL || 'https://free-qr-code-creator.web-free.site'
const jiti = createJiti(import.meta.url)
const { landingPages, legalPages } = jiti('../src/seo/landingPages.ts')
const baseHtml = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

const esc = (s) =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

function htmlPage({ title, description, canonical, alt, lang, h1, body, faq }) {
  let html = baseHtml
  html = html.replace(/<title>.*?<\/title>/, `<title>${esc(title)}</title>`)
  html = html.replace(
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="${esc(description)}">`
  )
  html = html.replace('<html lang="en">', `<html lang="${lang}">`)
  html = html.replace(
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="${lang}" href="${canonical}"><link rel="alternate" hreflang="${lang === 'en' ? 'fr' : 'en'}" href="${alt}">`
  )
  const faqBlock = faq.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')
  const article = `<article id="seo-static" style="max-width:42rem;margin:1rem auto;padding:0 1rem;font-family:system-ui,sans-serif"><h1>${esc(h1)}</h1>${body.map((p) => `<p>${esc(p)}</p>`).join('')}<section><h2>FAQ</h2>${faqBlock}</section></article>`
  html = html.replace('<div id="app"></div>', `${article}\n<div id="app"></div>`)
  return html
}

function write(p, html) {
  const dir = path.join(dist, p.replace(/^\//, ''))
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html)
}

for (const p of landingPages) {
  write(
    p.path,
    htmlPage({
      title: p.titleEn,
      description: p.descriptionEn,
      canonical: `${siteUrl}${p.path}/`,
      alt: `${siteUrl}${p.pathFr}/`,
      lang: 'en',
      h1: p.h1En,
      body: p.bodyEn,
      faq: p.faqEn
    })
  )
  write(
    p.pathFr,
    htmlPage({
      title: p.titleFr,
      description: p.descriptionFr,
      canonical: `${siteUrl}${p.pathFr}/`,
      alt: `${siteUrl}${p.path}/`,
      lang: 'fr',
      h1: p.h1Fr,
      body: p.bodyFr,
      faq: p.faqFr
    })
  )
}

write(
  '/fr',
  htmlPage({
    title: 'Free QR Code Creator — français',
    description: 'QR et codes-barres gratuits.',
    canonical: `${siteUrl}/fr/`,
    alt: `${siteUrl}/`,
    lang: 'fr',
    h1: 'Free QR Code Creator',
    body: ['Générateur gratuit de QR et codes-barres dans le navigateur.'],
    faq: landingPages[0].faqFr
  })
)

const urls = [
  '/',
  '/fr/',
  '/source',
  '/fr/source',
  ...landingPages.flatMap((p) => [`${p.path}/`, `${p.pathFr}/`]),
  ...legalPages.flatMap((p) => [p.path, p.pathFr])
]
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${siteUrl}${u === '/' ? '/' : u}</loc></url>`).join('\n')}\n</urlset>`
)
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`)
console.log('Prerendered', landingPages.length * 2 + 1, 'pages')
