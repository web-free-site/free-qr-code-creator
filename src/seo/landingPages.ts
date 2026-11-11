import type { QrDataType } from '@/lib/qrPayloads'

export type Tool = 'qr' | 'scan' | 'barcode'
export type BarFmt = 'EAN13' | 'EAN8' | 'UPC' | 'CODE128' | 'CODE39' | 'ITF14'

export interface LandingPage {
  path: string
  pathFr: string
  tool: Tool
  qrPreset?: QrDataType
  barcodeFormat?: BarFmt
  titleEn: string
  titleFr: string
  descriptionEn: string
  descriptionFr: string
  h1En: string
  h1Fr: string
  bodyEn: string[]
  bodyFr: string[]
  faqEn: { q: string; a: string }[]
  faqFr: { q: string; a: string }[]
}

const faqEn = (topic: string) => [
  {
    q: `Is this ${topic} tool free?`,
    a: 'Yes. Free QR Code Creator requires no account. Encoding happens in your browser; we do not store your QR or barcode data on a server.'
  },
  {
    q: 'Do static QR codes expire?',
    a: 'No. Downloaded PNG/SVG files keep working as long as the encoded link or text remains valid.'
  },
  {
    q: 'Can I add a logo and brand colors?',
    a: 'Yes. qr-code-styling supports logos, custom dot styles, and colors before you export.'
  }
]

const faqFr = (topic: string) => [
  {
    q: `Cet outil ${topic} est-il gratuit ?`,
    a: 'Oui, sans inscription. Le traitement reste dans votre navigateur.'
  },
  {
    q: 'Mes QR expirent-ils ?',
    a: 'Non pour les codes statiques téléchargés.'
  },
  {
    q: 'Logo et couleurs ?',
    a: 'Oui, personnalisez puis exportez en PNG ou SVG.'
  }
]

const extraEn =
  'Pick colors, optional center logos, and frames of mind for print or screens. Because generation is local, you can safely encode WiFi passwords, contact cards, and payment links. When you are ready, download PNG for slides or SVG for sharp print workflows. Explore related guides below for other free formats.'
const extraFr =
  'Personnalisez couleurs et logo, puis exportez. Le traitement local convient aux mots de passe WiFi et aux cartes de visite. PNG pour le web, SVG pour l’impression. Voir les autres pages gratuites ci-dessous.'

function page(
  path: string,
  tool: Tool,
  en: { title: string; desc: string; h1: string; intro: string },
  fr: { title: string; desc: string; h1: string; intro: string },
  opts: { qrPreset?: QrDataType; barcodeFormat?: BarFmt } = {}
): LandingPage {
  const pathFr = `/fr${path}`
  return {
    path,
    pathFr,
    tool,
    ...opts,
    titleEn: en.title,
    titleFr: fr.title,
    descriptionEn: en.desc,
    descriptionFr: fr.desc,
    h1En: en.h1,
    h1Fr: fr.h1,
    bodyEn: [en.intro, extraEn],
    bodyFr: [fr.intro, extraFr],
    faqEn: faqEn(tool === 'barcode' ? 'barcode' : 'QR'),
    faqFr: faqFr(tool === 'barcode' ? 'code-barres' : 'QR')
  }
}

export const landingPages: LandingPage[] = [
  page(
    '/wifi-qr-code',
    'qr',
    {
      title: 'Free WiFi QR Code Generator',
      desc: 'Create a free WiFi QR code guests scan to join. No sign-up; data stays on your device.',
      h1: 'Free WiFi QR Code Generator',
      intro:
        'Hotels, cafés, and coworking spaces in Kigali and beyond print WiFi QR codes so guests skip typing passwords. Enter SSID, WPA/WEP/open security, optional hidden flag, then style and download.'
    },
    {
      title: 'QR code WiFi gratuit',
      desc: 'QR WiFi gratuit sans compte.',
      h1: 'Générateur QR WiFi gratuit',
      intro: 'Affichez un QR WiFi pour vos invités : SSID, sécurité, mot de passe, export immédiat.'
    },
    { qrPreset: 'wifi' }
  ),
  page(
    '/vcard-qr-code',
    'qr',
    {
      title: 'Free vCard QR Code',
      desc: 'Share contacts with a free vCard QR code. PNG/SVG export.',
      h1: 'Free vCard / Contact QR Code',
      intro:
        'Networking events and business cards benefit from vCard QR codes that add phone, email, and organization in one scan.'
    },
    {
      title: 'QR vCard gratuit',
      desc: 'Contact vCard en QR gratuit.',
      h1: 'QR code contact gratuit',
      intro: 'Partagez une fiche contact complète via QR vCard.'
    },
    { qrPreset: 'vcard' }
  ),
  page('/url-qr-code', 'qr', {
    title: 'Free URL QR Code Generator',
    desc: 'Turn links into free static URL QR codes.',
    h1: 'Free URL QR Code',
    intro: 'Marketing teams use URL QR codes on posters and packaging to drive traffic without typing.'
  }, {
    title: 'QR lien gratuit',
    desc: 'QR pour URL gratuit.',
    h1: 'QR code URL gratuit',
    intro: 'Redirigez vers votre site ou formulaire avec un QR URL statique.'
  }, { qrPreset: 'url' }),
  page('/text-qr-code', 'qr', {
    title: 'Free Text QR Code',
    desc: 'Encode plain text in a free QR code.',
    h1: 'Free Text QR Code',
    intro: 'Store serial numbers, short instructions, or multilingual notes that appear after a scan.'
  }, {
    title: 'QR texte gratuit',
    desc: 'Texte en QR gratuit.',
    h1: 'QR code texte',
    intro: 'Encodez du texte lisible après le scan.'
  }, { qrPreset: 'text' }),
  page('/email-qr-code', 'qr', {
    title: 'Free Email QR Code',
    desc: 'Mailto QR codes with subject and body — free.',
    h1: 'Free Email QR Code',
    intro: 'Support walls and feedback kiosks use mailto QR codes to open a pre-filled draft.'
  }, {
    title: 'QR e-mail gratuit',
    desc: 'QR mailto gratuit.',
    h1: 'QR code e-mail',
    intro: 'Ouvrez un e-mail prérempli en un scan.'
  }, { qrPreset: 'email' }),
  page('/sms-qr-code', 'qr', {
    title: 'Free SMS QR Code',
    desc: 'SMS QR with optional message.',
    h1: 'Free SMS QR Code',
    intro: 'Pre-fill SMS recipient and body so customers can text you in one step.'
  }, {
    title: 'QR SMS gratuit',
    desc: 'QR SMS gratuit.',
    h1: 'QR SMS',
    intro: 'SMS prérempli via QR.'
  }, { qrPreset: 'sms' }),
  page('/phone-qr-code', 'qr', {
    title: 'Free Phone QR Code',
    desc: 'Tap-to-call tel: QR codes for free.',
    h1: 'Free Phone QR Code',
    intro: 'Print tel: QR codes on menus or signage for instant calls.'
  }, {
    title: 'QR téléphone gratuit',
    desc: 'Appel par QR gratuit.',
    h1: 'QR appel',
    intro: 'Lancez un appel depuis un QR tel:'
  }, { qrPreset: 'phone' }),
  page('/whatsapp-qr-code', 'qr', {
    title: 'Free WhatsApp QR Code',
    desc: 'Open WhatsApp chat with a free QR code.',
    h1: 'Free WhatsApp QR Code',
    intro:
      'Shops across East Africa use WhatsApp QR codes on storefronts so buyers open chat with a preset greeting.'
  }, {
    title: 'QR WhatsApp gratuit',
    desc: 'Discuter sur WhatsApp via QR.',
    h1: 'QR WhatsApp gratuit',
    intro: 'Ouvrez WhatsApp avec numéro et message optionnel.'
  }, { qrPreset: 'whatsapp' }),
  page('/location-qr-code', 'qr', {
    title: 'Free Location QR Code',
    desc: 'GPS geo QR codes for venues.',
    h1: 'Free Location QR Code',
    intro: 'Share exact map coordinates for pop-ups, trailheads, or delivery pickup points.'
  }, {
    title: 'QR localisation gratuit',
    desc: 'Coordonnées GPS en QR.',
    h1: 'QR GPS',
    intro: 'Ouvrez la carte aux coordonnées indiquées.'
  }, { qrPreset: 'location' }),
  page('/event-qr-code', 'qr', {
    title: 'Free Event QR Code',
    desc: 'Add calendar events via iCal QR.',
    h1: 'Free Event QR Code',
    intro: 'Conference organizers encode title, place, and schedule so attendees save events quickly.'
  }, {
    title: 'QR événement gratuit',
    desc: 'Ajout calendrier via QR.',
    h1: 'QR événement',
    intro: 'Ajoutez un événement au calendrier.'
  }, { qrPreset: 'event' }),
  page('/menu-pdf-qr-code', 'qr', {
    title: 'Free Menu / PDF QR Code',
    desc: 'Link to PDF menus with a free QR code.',
    h1: 'Free Menu / PDF QR Code',
    intro: 'Restaurants replace paper menus with a QR that opens tonight’s PDF or ordering page.'
  }, {
    title: 'QR menu PDF gratuit',
    desc: 'Menu PDF via QR.',
    h1: 'QR menu / PDF',
    intro: 'Lien direct vers un menu PDF ou une page web.'
  }, { qrPreset: 'menuPdf' }),
  page('/qr-code-scanner', 'scan', {
    title: 'Free QR Code Scanner Online',
    desc: 'Scan QR codes in the browser — private and free.',
    h1: 'Free QR Code Scanner',
    intro:
      'Use your device camera with qr-scanner. Decoding stays local; nothing is uploaded to our servers.'
  }, {
    title: 'Scanner QR gratuit',
    desc: 'Scan QR dans le navigateur.',
    h1: 'Scanner QR gratuit',
    intro: 'Caméra + qr-scanner, traitement local.'
  }),
  page('/barcode-generator', 'barcode', {
    title: 'Free Barcode Generator',
    desc: 'EAN, UPC, Code 128/39, ITF-14 — free PNG/SVG and batch ZIP.',
    h1: 'Free Barcode Generator',
    intro:
      'Retailers and warehouses generate JsBarcode labels with validation, PNG/SVG export, and batch ZIP from a pasted list.'
  }, {
    title: 'Générateur codes-barres gratuit',
    desc: 'Codes-barres gratuits, lot CSV.',
    h1: 'Codes-barres gratuits',
    intro: 'JsBarcode en local, export PNG/SVG et ZIP.'
  }),
  page('/ean-13-barcode-generator', 'barcode', {
    title: 'Free EAN-13 Barcode Generator',
    desc: 'Create EAN-13 retail barcodes for free.',
    h1: 'Free EAN-13 Barcode Generator',
    intro: 'Standard 13-digit retail barcodes with checksum validation before download.'
  }, {
    title: 'EAN-13 gratuit',
    desc: 'Générateur EAN-13 gratuit.',
    h1: 'EAN-13 gratuit',
    intro: 'Code-barres retail 13 chiffres.'
  }, { barcodeFormat: 'EAN13' }),
  page('/ean-8-barcode-generator', 'barcode', {
    title: 'Free EAN-8 Barcode Generator',
    desc: 'Small-pack EAN-8 barcodes.',
    h1: 'Free EAN-8 Barcode Generator',
    intro: 'Compact EAN-8 for small products where space is tight.'
  }, {
    title: 'EAN-8 gratuit',
    desc: 'EAN-8 gratuit.',
    h1: 'EAN-8 gratuit',
    intro: 'Format compact pour petits emballages.'
  }, { barcodeFormat: 'EAN8' }),
  page('/upc-a-barcode-generator', 'barcode', {
    title: 'Free UPC-A Barcode Generator',
    desc: 'North American UPC-A labels.',
    h1: 'Free UPC-A Barcode Generator',
    intro: 'Generate UPC-A symbols accepted across North American retail scanners.'
  }, {
    title: 'UPC-A gratuit',
    desc: 'UPC-A gratuit.',
    h1: 'UPC-A gratuit',
    intro: 'Étiquettes retail UPC-A.'
  }, { barcodeFormat: 'UPC' }),
  page('/code128-barcode-generator', 'barcode', {
    title: 'Free Code 128 Barcode Generator',
    desc: 'Logistics Code 128 barcodes.',
    h1: 'Free Code 128 Barcode Generator',
    intro: 'Ship cartons and totes with dense Code 128 barcodes supporting full ASCII payloads.'
  }, {
    title: 'Code 128 gratuit',
    desc: 'Code 128 gratuit.',
    h1: 'Code 128',
    intro: 'Logistique et entrepôt.'
  }, { barcodeFormat: 'CODE128' }),
  page('/code39-barcode-generator', 'barcode', {
    title: 'Free Code 39 Barcode Generator',
    desc: 'Legacy-friendly Code 39.',
    h1: 'Free Code 39 Barcode Generator',
    intro: 'Code 39 remains common on badges and asset tags — generate labels without desktop software.'
  }, {
    title: 'Code 39 gratuit',
    desc: 'Code 39 gratuit.',
    h1: 'Code 39',
    intro: 'Étiquettes industrielles classiques.'
  }, { barcodeFormat: 'CODE39' }),
  page('/itf-14-barcode-generator', 'barcode', {
    title: 'Free ITF-14 Barcode Generator',
    desc: 'Carton-level ITF-14 symbols.',
    h1: 'Free ITF-14 Barcode Generator',
    intro: 'Pallet and master-carton labeling with ITF-14 plus batch export for supplier lists.'
  }, {
    title: 'ITF-14 gratuit',
    desc: 'ITF-14 gratuit.',
    h1: 'ITF-14',
    intro: 'Colis et palettes.'
  }, { barcodeFormat: 'ITF14' })
]

export const legalPages = [
  { path: '/privacy', pathFr: '/fr/privacy', slug: 'privacy' as const },
  { path: '/terms', pathFr: '/fr/terms', slug: 'terms' as const },
  { path: '/about', pathFr: '/fr/about', slug: 'about' as const },
  { path: '/contact', pathFr: '/fr/contact', slug: 'contact' as const }
]

function norm(p: string) {
  if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1)
  return p
}

export function findPage(path: string) {
  const n = norm(path)
  return landingPages.find((p) => p.path === n || p.pathFr === n)
}
