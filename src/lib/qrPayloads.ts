export type QrDataType =
  | 'url'
  | 'text'
  | 'wifi'
  | 'vcard'
  | 'email'
  | 'sms'
  | 'phone'
  | 'whatsapp'
  | 'location'
  | 'event'
  | 'menuPdf'

export interface QrFields {
  url?: string
  text?: string
  wifiSsid?: string
  wifiPassword?: string
  wifiEncryption?: 'nopass' | 'WEP' | 'WPA'
  wifiHidden?: boolean
  vcardFirst?: string
  vcardLast?: string
  vcardEmail?: string
  vcardPhone?: string
  vcardOrg?: string
  emailTo?: string
  emailSubject?: string
  emailBody?: string
  smsPhone?: string
  smsBody?: string
  phone?: string
  waPhone?: string
  waMessage?: string
  latitude?: string
  longitude?: string
  eventTitle?: string
  eventLocation?: string
  eventStart?: string
  eventEnd?: string
  menuUrl?: string
}

const escWiFi = (s: string) => s.replace(/([\\;,:"\'])/g, '\\$1')

export function buildQrPayload(type: QrDataType, f: QrFields): string {
  switch (type) {
    case 'text':
      return f.text?.trim() ?? ''
    case 'url': {
      const u = f.url?.trim() ?? ''
      if (!u) return ''
      return /^https?:\/\//i.test(u) ? u : `https://${u}`
    }
    case 'menuPdf':
      return buildQrPayload('url', { url: f.menuUrl })
    case 'email': {
      if (!f.emailTo?.trim()) return ''
      const q: string[] = []
      if (f.emailSubject) q.push(`subject=${encodeURIComponent(f.emailSubject)}`)
      if (f.emailBody) q.push(`body=${encodeURIComponent(f.emailBody)}`)
      return `mailto:${f.emailTo}${q.length ? `?${q.join('&')}` : ''}`
    }
    case 'phone':
      return f.phone?.trim() ? `tel:${f.phone.trim()}` : ''
    case 'sms':
      return f.smsPhone?.trim() ? `SMSTO:${f.smsPhone}:${f.smsBody ?? ''}` : ''
    case 'whatsapp': {
      const d = (f.waPhone ?? '').replace(/\D/g, '')
      if (!d) return ''
      const base = `https://wa.me/${d}`
      if (f.waMessage?.trim()) return `${base}?text=${encodeURIComponent(f.waMessage.trim())}`
      return base
    }
    case 'wifi': {
      if (!f.wifiSsid?.trim()) return ''
      const ssid = escWiFi(f.wifiSsid)
      const hidden = f.wifiHidden ? 'H:true;' : ''
      if (f.wifiEncryption === 'nopass') return `WIFI:T:nopass;S:${ssid};;${hidden};`
      const pw = escWiFi(f.wifiPassword ?? '')
      return `WIFI:T:${f.wifiEncryption ?? 'WPA'};S:${ssid};P:${pw};${hidden};`
    }
    case 'location': {
      const lat = f.latitude?.trim()
      const lng = f.longitude?.trim()
      if (!lat || !lng) return ''
      return `geo:${lat},${lng}`
    }
    case 'event': {
      if (!f.eventTitle?.trim()) return ''
      const fmt = (iso: string) => {
        const d = new Date(iso)
        if (Number.isNaN(d.getTime())) return ''
        return (
          d.getUTCFullYear() +
          String(d.getUTCMonth() + 1).padStart(2, '0') +
          String(d.getUTCDate()).padStart(2, '0') +
          'T' +
          String(d.getUTCHours()).padStart(2, '0') +
          String(d.getUTCMinutes()).padStart(2, '0') +
          String(d.getUTCSeconds()).padStart(2, '0') +
          'Z'
        )
      }
      const lines = ['BEGIN:VEVENT', `SUMMARY:${f.eventTitle}`]
      const s = fmt(f.eventStart ?? '')
      const e = fmt(f.eventEnd ?? '')
      if (s) lines.push(`DTSTART:${s}`)
      if (e) lines.push(`DTEND:${e}`)
      if (f.eventLocation) lines.push(`LOCATION:${f.eventLocation}`)
      lines.push('END:VEVENT')
      return lines.join('\n')
    }
    case 'vcard': {
      const fn = [f.vcardFirst, f.vcardLast].filter(Boolean).join(' ')
      if (!fn && !f.vcardEmail && !f.vcardPhone) return ''
      const lines = ['BEGIN:VCARD', 'VERSION:3.0']
      if (fn) lines.push(`FN:${fn}`, `N:${f.vcardLast ?? ''};${f.vcardFirst ?? ''};;;`)
      if (f.vcardOrg) lines.push(`ORG:${f.vcardOrg}`)
      if (f.vcardPhone) lines.push(`TEL:${f.vcardPhone}`)
      if (f.vcardEmail) lines.push(`EMAIL:${f.vcardEmail}`)
      lines.push('END:VCARD')
      return lines.join('\n')
    }
    default:
      return ''
  }
}

export function detectPayloadType(data: string): QrDataType {
  if (/^WIFI:/i.test(data)) return 'wifi'
  if (/^BEGIN:VCARD/i.test(data)) return 'vcard'
  if (/^BEGIN:VEVENT/i.test(data)) return 'event'
  if (/^geo:/i.test(data)) return 'location'
  if (/^mailto:/i.test(data)) return 'email'
  if (/^tel:/i.test(data)) return 'phone'
  if (/^SMSTO:/i.test(data)) return 'sms'
  if (/^https:\/\/wa\.me\//i.test(data)) return 'whatsapp'
  if (/^https?:\/\//i.test(data)) return 'url'
  return 'text'
}
