<script setup lang="ts">
import QRCodeStyling, { type DotType, type CornerSquareType, type CornerDotType } from 'qr-code-styling'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { buildQrPayload, type QrDataType, type QrFields } from '@/lib/qrPayloads'
import AdSlot from '@/components/ads/AdSlot.vue'
import SponsoredSmartlink from '@/components/ads/SponsoredSmartlink.vue'

const props = defineProps<{ preset?: QrDataType; compact?: boolean }>()
const { t } = useI18n()

const dataType = ref<QrDataType>(props.preset ?? 'url')
const fields = ref<QrFields>({
  url: 'https://example.com',
  text: 'Hello from Kigali',
  wifiSsid: 'GuestWiFi',
  wifiPassword: 'welcome',
  wifiEncryption: 'WPA',
  menuUrl: 'https://example.com/menu.pdf',
  waPhone: '+250788000000',
  waMessage: 'Hello'
})
const fg = ref('#134e4a')
const bg = ref('#faf8f5')
const dotType = ref<DotType>('rounded')
const logoUrl = ref('')
const canvasHost = ref<HTMLDivElement | null>(null)
let qr: QRCodeStyling | null = null

const payload = computed(() => buildQrPayload(dataType.value, fields.value))

const types: QrDataType[] = [
  'url',
  'text',
  'wifi',
  'vcard',
  'email',
  'sms',
  'phone',
  'whatsapp',
  'location',
  'event',
  'menuPdf'
]

function render() {
  if (!canvasHost.value || !payload.value) return
  const options = {
    width: props.compact ? 280 : 320,
    height: props.compact ? 280 : 320,
    type: 'svg' as const,
    data: payload.value,
    image: logoUrl.value || undefined,
    margin: 8,
    qrOptions: { errorCorrectionLevel: 'M' as const },
    dotsOptions: { color: fg.value, type: dotType.value },
    backgroundOptions: { color: bg.value },
    cornersSquareOptions: { color: fg.value, type: 'extra-rounded' as CornerSquareType },
    cornersDotOptions: { color: fg.value, type: 'dot' as CornerDotType },
    imageOptions: { crossOrigin: 'anonymous', margin: 6, imageSize: 0.35 }
  }
  if (!qr) {
    qr = new QRCodeStyling(options)
    qr.append(canvasHost.value)
  } else {
    qr.update(options)
  }
}

watch([payload, fg, bg, dotType, logoUrl], render, { flush: 'post' })
onMounted(render)

async function download(ext: 'png' | 'svg') {
  if (!qr) return
  await qr.download({ name: 'free-qr-code', extension: ext })
}
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-2">
    <div class="card space-y-4">
      <label class="field">
        <span>{{ t('type') }}</span>
        <select v-model="dataType" class="input">
          <option v-for="tp in types" :key="tp" :value="tp">{{ t(`types.${tp}`) }}</option>
        </select>
      </label>

      <template v-if="dataType === 'url' || dataType === 'menuPdf'">
        <label class="field">
          <span>URL</span>
          <input v-model="fields.menuUrl" v-if="dataType === 'menuPdf'" class="input" />
          <input v-model="fields.url" v-else class="input" />
        </label>
      </template>
      <label v-else-if="dataType === 'text'" class="field">
        <span>{{ t('types.text') }}</span>
        <textarea v-model="fields.text" class="input min-h-24" />
      </label>
      <template v-else-if="dataType === 'wifi'">
        <input v-model="fields.wifiSsid" class="input" placeholder="SSID" />
        <select v-model="fields.wifiEncryption" class="input">
          <option value="WPA">WPA/WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">Open</option>
        </select>
        <input v-model="fields.wifiPassword" class="input" placeholder="Password" />
        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="fields.wifiHidden" /> Hidden network
        </label>
      </template>
      <template v-else-if="dataType === 'vcard'">
        <input v-model="fields.vcardFirst" class="input" placeholder="First name" />
        <input v-model="fields.vcardLast" class="input" placeholder="Last name" />
        <input v-model="fields.vcardPhone" class="input" placeholder="Phone" />
        <input v-model="fields.vcardEmail" class="input" placeholder="Email" />
        <input v-model="fields.vcardOrg" class="input" placeholder="Organization" />
      </template>
      <template v-else-if="dataType === 'email'">
        <input v-model="fields.emailTo" class="input" placeholder="To" />
        <input v-model="fields.emailSubject" class="input" placeholder="Subject" />
        <textarea v-model="fields.emailBody" class="input" placeholder="Body" />
      </template>
      <template v-else-if="dataType === 'sms'">
        <input v-model="fields.smsPhone" class="input" placeholder="Phone" />
        <input v-model="fields.smsBody" class="input" placeholder="Message" />
      </template>
      <template v-else-if="dataType === 'phone'">
        <input v-model="fields.phone" class="input" placeholder="+250..." />
      </template>
      <template v-else-if="dataType === 'whatsapp'">
        <input v-model="fields.waPhone" class="input" placeholder="WhatsApp number" />
        <input v-model="fields.waMessage" class="input" placeholder="Prefilled message" />
      </template>
      <template v-else-if="dataType === 'location'">
        <input v-model="fields.latitude" class="input" placeholder="Latitude" />
        <input v-model="fields.longitude" class="input" placeholder="Longitude" />
      </template>
      <template v-else-if="dataType === 'event'">
        <input v-model="fields.eventTitle" class="input" placeholder="Title" />
        <input v-model="fields.eventLocation" class="input" placeholder="Location" />
        <input v-model="fields.eventStart" class="input" type="datetime-local" />
        <input v-model="fields.eventEnd" class="input" type="datetime-local" />
      </template>

      <div class="grid grid-cols-2 gap-3">
        <label class="field">
          <span>{{ t('fg') }}</span>
          <input v-model="fg" type="color" class="input h-11" />
        </label>
        <label class="field">
          <span>{{ t('bg') }}</span>
          <input v-model="bg" type="color" class="input h-11" />
        </label>
      </div>
      <label class="field">
        <span>{{ t('dotStyle') }}</span>
        <select v-model="dotType" class="input">
          <option value="square">Square</option>
          <option value="dots">Dots</option>
          <option value="rounded">Rounded</option>
          <option value="classy">Classy</option>
          <option value="extra-rounded">Extra rounded</option>
        </select>
      </label>
      <label class="field">
        <span>{{ t('logoUrl') }}</span>
        <input v-model="logoUrl" class="input" placeholder="https://..." />
      </label>
    </div>

    <div class="card flex flex-col items-center gap-4">
      <div ref="canvasHost" class="rounded-2xl bg-white p-4 shadow-inner" />
      <p v-if="!payload" class="text-sm text-red-600">Fill required fields.</p>
      <div class="flex flex-wrap justify-center gap-2">
        <button type="button" class="btn-primary" :disabled="!payload" @click="download('png')">
          {{ t('downloadPng') }}
        </button>
        <button type="button" class="btn-secondary" :disabled="!payload" @click="download('svg')">
          {{ t('downloadSvg') }}
        </button>
      </div>
      <AdSlot slot-key="nativeBelowResult" class="w-full" />
      <SponsoredSmartlink />
    </div>
  </div>
</template>
