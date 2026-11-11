<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  slotKey: string
  class?: string
}>()

type BannerSpec = { key: string; width: number; height: number }
type AdsFile = {
  banners?: Record<string, BannerSpec>
  nativeBelowResult?: string
}

const sizes: Record<string, { w: number; h: number }> = {
  headerBanner728x90: { w: 728, h: 90 },
  betweenContent728x90: { w: 728, h: 90 },
  sidebar160x600: { w: 160, h: 600 },
  sidebar160x300: { w: 160, h: 300 },
  sidebar300x250: { w: 300, h: 250 },
  sidebar468x60: { w: 468, h: 60 },
  nativeBelowResult: { w: 320, h: 250 },
  mobileSticky320x50: { w: 320, h: 50 }
}

const config = ref<AdsFile | null>(null)
const nativeEl = ref<HTMLElement | null>(null)
const iframe = ref<HTMLIFrameElement | null>(null)

const banner = computed(() => config.value?.banners?.[props.slotKey])
const nativeHtml = computed(() =>
  props.slotKey === 'nativeBelowResult' ? config.value?.nativeBelowResult?.trim() ?? '' : ''
)
const reserved = computed(() => sizes[props.slotKey])

function mountBanner(spec: BannerSpec) {
  if (!iframe.value) return
  const srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;overflow:hidden;background:transparent;">
<script>atOptions = { 'key': '${spec.key}', 'format': 'iframe', 'height': ${spec.height}, 'width': ${spec.width}, 'params': {} };<\/script>
<script src="https://www.highrevenueformat.com/${spec.key}/invoke.js"><\/script>
</body></html>`
  iframe.value.srcdoc = srcdoc
}

function mountNative(html: string) {
  if (!nativeEl.value) return
  nativeEl.value.innerHTML = html
  nativeEl.value.querySelectorAll('script').forEach((old) => {
    const s = document.createElement('script')
    for (const a of old.attributes) s.setAttribute(a.name, a.value)
    s.text = old.textContent ?? ''
    old.replaceWith(s)
  })
}

onMounted(async () => {
  try {
    config.value = await (await fetch('/ads.json', { cache: 'no-store' })).json()
  } catch {
    config.value = {}
  }
  if (banner.value) mountBanner(banner.value)
  else if (nativeHtml.value) mountNative(nativeHtml.value)
})
</script>

<template>
  <div
    v-if="['socialBar', 'popunder'].indexOf(slotKey) === -1"
    :class="['ad-slot flex justify-center', props.class]"
    :aria-label="'Advertisement'"
  >
    <iframe
      v-if="banner"
      ref="iframe"
      :title="`Ad ${slotKey}`"
      class="max-w-full border-0 bg-transparent"
      :width="banner.width"
      :height="banner.height"
      :style="{ width: `min(100%, ${banner.width}px)`, height: `${banner.height}px` }"
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
    />
    <div v-else-if="nativeHtml" ref="nativeEl" class="w-full max-w-md" />
    <div
      v-else-if="reserved"
      class="mx-auto rounded-lg border border-dashed border-brand-500/25 bg-brand-50/40"
      :style="{ width: `min(100%, ${reserved.w}px)`, minHeight: `${reserved.h}px` }"
      aria-hidden="true"
    />
  </div>
</template>
