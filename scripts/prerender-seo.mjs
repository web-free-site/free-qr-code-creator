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

function setOgUrl(html, canonical) {
  const tag = `<meta property="og:url" content="${canonical}">`
  if (/<meta property="og:url"[^>]*>/.test(html)) {
    return html.replace(/<meta property="og:url"[^>]*>/, tag)
  }
  return html.replace(/<meta property="og:type"/, `${tag}\n    <meta property="og:type"`)
}

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
  html = setOgUrl(html, canonical)
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

const legalCopy = {
  privacy: {
    en: {
      title: 'Privacy Policy | Free QR Code Creator',
      description:
        'Privacy policy for Free QR Code Creator — browser-local QR and barcode processing, no server storage of payloads.',
      h1: 'Privacy Policy',
      body:
        'Free QR Code Creator processes QR and barcode data entirely in your browser. We do not store payloads on our servers. Optional Adsterra snippets may set third-party cookies when configured.'
    },
    fr: {
      title: 'Confidentialité | Free QR Code Creator',
      description: 'Politique de confidentialité — traitement local, sans stockage serveur.',
      h1: 'Confidentialité',
      body: 'Traitement local uniquement. Pas de stockage serveur. Publicités Adsterra optionnelles.'
    }
  },
  terms: {
    en: {
      title: 'Terms of Use | Free QR Code Creator',
      description: 'Terms of use for the free QR and barcode tools.',
      h1: 'Terms of Use',
      body: 'Use this free tool lawfully. Output is provided as-is. You are responsible for encoded content.'
    },
    fr: {
      title: 'Conditions | Free QR Code Creator',
      description: "Conditions d'utilisation.",
      h1: 'Conditions',
      body: 'Utilisation gratuite et légale. Fourni tel quel.'
    }
  },
  about: {
    en: {
      title: 'About | Free QR Code Creator',
      description: 'About Free QR Code Creator — client-side MIT QR and barcode utility.',
      h1: 'About',
      body: 'Free QR Code Creator is a client-side utility for static QR codes and barcodes, built with MIT libraries: qr-code-styling, JsBarcode, and qr-scanner.'
    },
    fr: {
      title: 'À propos | Free QR Code Creator',
      description: 'À propos de l’outil QR et codes-barres gratuit.',
      h1: 'À propos',
      body: 'Outil gratuit MIT pour QR et codes-barres.'
    }
  },
  contact: {
    en: {
      title: 'Contact | Free QR Code Creator',
      description: 'Contact Gentil M. for Free QR Code Creator.',
      h1: 'Contact',
      body: 'Email: gentil@quevvy.com — Gentil M.'
    },
    fr: {
      title: 'Contact | Free QR Code Creator',
      description: 'Contact pour Free QR Code Creator.',
      h1: 'Contact',
      body: 'gentil@quevvy.com'
    }
  }
}

for (const p of legalPages) {
  const en = legalCopy[p.slug].en
  const fr = legalCopy[p.slug].fr
  write(
    p.path,
    htmlPage({
      title: en.title,
      description: en.description,
      canonical: `${siteUrl}${p.path}`,
      alt: `${siteUrl}${p.pathFr}`,
      lang: 'en',
      h1: en.h1,
      body: [en.body],
      faq: []
    })
  )
  write(
    p.pathFr,
    htmlPage({
      title: fr.title,
      description: fr.description,
      canonical: `${siteUrl}${p.pathFr}`,
      alt: `${siteUrl}${p.path}`,
      lang: 'fr',
      h1: fr.h1,
      body: [fr.body],
      faq: []
    })
  )
}

const sourceCopy = {
  en: {
    title: 'Source code | Free QR Code Creator',
    description: 'MIT-licensed source for Free QR Code Creator and upstream QR libraries.',
    h1: 'Source code',
    body:
      'Free QR Code Creator is released under the MIT License. Libraries qr-code-styling, JsBarcode, and qr-scanner are MIT as well.'
  },
  fr: {
    title: 'Code source | Free QR Code Creator',
    description: 'Code source MIT pour Free QR Code Creator.',
    h1: 'Code source',
    body: 'Licence MIT. Bibliothèques qr-code-styling, JsBarcode et qr-scanner sous MIT.'
  }
}

write(
  '/source',
  htmlPage({
    title: sourceCopy.en.title,
    description: sourceCopy.en.description,
    canonical: `${siteUrl}/source`,
    alt: `${siteUrl}/fr/source`,
    lang: 'en',
    h1: sourceCopy.en.h1,
    body: [sourceCopy.en.body],
    faq: []
  })
)
write(
  '/fr/source',
  htmlPage({
    title: sourceCopy.fr.title,
    description: sourceCopy.fr.description,
    canonical: `${siteUrl}/fr/source`,
    alt: `${siteUrl}/source`,
    lang: 'fr',
    h1: sourceCopy.fr.h1,
    body: [sourceCopy.fr.body],
    faq: []
  })
)

const GUIDE_PATHS = ["/how-to-create-a-wifi-qr-code/", "/how-to-make-a-qr-code-for-a-website/"]
const urls = [
  '/',
  '/fr/',
  '/source',
  '/fr/source',
  ...landingPages.flatMap((p) => [`${p.path}/`, `${p.pathFr}/`]),
  ...legalPages.flatMap((p) => [p.path, p.pathFr]),
  ...GUIDE_PATHS
]
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${siteUrl}${u === '/' ? '/' : u}</loc></url>`).join('\n')}\n</urlset>`
)
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`)
const staticCount = landingPages.length * 2 + 1 + legalPages.length * 2 + 2
console.log('Prerendered', staticCount, 'pages')
