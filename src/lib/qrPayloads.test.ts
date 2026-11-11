import { describe, expect, it } from 'vitest'
import { buildQrPayload, detectPayloadType } from './qrPayloads'

describe('qrPayloads', () => {
  it('wifi round-trip', () => {
    const s = buildQrPayload('wifi', { wifiSsid: 'Cafe', wifiEncryption: 'WPA', wifiPassword: 'x' })
    expect(detectPayloadType(s)).toBe('wifi')
  })
  it('whatsapp', () => {
    const s = buildQrPayload('whatsapp', { waPhone: '+250788', waMessage: 'Hi' })
    expect(s).toContain('wa.me/250788')
    expect(detectPayloadType(s)).toBe('whatsapp')
  })
  it('url https prefix', () => {
    expect(buildQrPayload('url', { url: 'example.com' })).toBe('https://example.com')
  })
})
