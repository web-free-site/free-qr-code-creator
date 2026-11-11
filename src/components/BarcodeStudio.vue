<script setup lang="ts">
import JsBarcode from 'jsbarcode'
import JSZip from 'jszip'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AdSlot from '@/components/ads/AdSlot.vue'
import SponsoredSmartlink from '@/components/ads/SponsoredSmartlink.vue'

const props = defineProps<{ initial?: string }>()

const { t } = useI18n()
type Fmt = 'EAN13' | 'EAN8' | 'UPC' | 'CODE128' | 'CODE39' | 'ITF14'
const format = ref<Fmt>((props.initial as Fmt) ?? 'EAN13')
const value = ref('5901234123457')
const batch = ref('')
const mode = ref<'single' | 'batch'>('single')
const err = ref('')
const svg = ref<SVGSVGElement | null>(null)

const map: Record<Fmt, string> = {
  EAN13: 'EAN13',
  EAN8: 'EAN8',
  UPC: 'UPC',
  CODE128: 'CODE128',
  CODE39: 'CODE39',
  ITF14: 'ITF14'
}

function draw() {
  err.value = ''
  if (!svg.value) return
  try {
    JsBarcode(svg.value, value.value.trim(), {
      format: map[format.value],
      displayValue: true,
      margin: 14,
      height: 72,
      font: 'Inter'
    })
  } catch (e) {
    err.value = e instanceof Error ? e.message : String(e)
  }
}

watch([format, value], draw, { flush: 'post' })
onMounted(draw)

function dlSvg() {
  if (!svg.value) return
  const blob = new Blob([svg.value.outerHTML], { type: 'image/svg+xml' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `barcode-${format.value}.svg`
  a.click()
}

function dlPng() {
  if (!svg.value) return
  const url = URL.createObjectURL(new Blob([svg.value.outerHTML], { type: 'image/svg+xml' }))
  const img = new Image()
  img.onload = () => {
    const c = document.createElement('canvas')
    c.width = img.width
    c.height = img.height
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, c.width, c.height)
    ctx.drawImage(img, 0, 0)
    c.toBlob((b) => {
      if (!b) return
      const a = document.createElement('a')
      a.href = URL.createObjectURL(b)
      a.download = `barcode-${format.value}.png`
      a.click()
    })
    URL.revokeObjectURL(url)
  }
  img.src = url
}

async function batchZip() {
  const lines = batch.value
    .split(/[\r\n]+/)
    .map((l) => l.split(',')[0]?.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean)
  if (!lines.length) {
    err.value = t('batchHint')
    return
  }
  const zip = new JSZip()
  lines.forEach((line, i) => {
    const node = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    try {
      JsBarcode(node, line, { format: map[format.value], displayValue: true, margin: 10, height: 70 })
      zip.file(`${i + 1}-${line.slice(0, 20)}.svg`, new XMLSerializer().serializeToString(node))
    } catch {
      /* skip bad rows */
    }
  })
  const blob = await zip.generateAsync({ type: 'blob' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `barcodes-${format.value}.zip`
  a.click()
}
</script>

<template>
  <div class="card mx-auto max-w-xl space-y-4">
    <div class="flex gap-2">
      <button type="button" class="chip" :class="{ 'chip-active': mode === 'single' }" @click="mode = 'single'">
        {{ t('single') }}
      </button>
      <button type="button" class="chip" :class="{ 'chip-active': mode === 'batch' }" @click="mode = 'batch'">
        {{ t('batch') }}
      </button>
    </div>
    <label class="field">
      <span>{{ t('format') }}</span>
      <select v-model="format" class="input">
        <option value="EAN13">EAN-13</option>
        <option value="EAN8">EAN-8</option>
        <option value="UPC">UPC-A</option>
        <option value="CODE128">Code 128</option>
        <option value="CODE39">Code 39</option>
        <option value="ITF14">ITF-14</option>
      </select>
    </label>
    <template v-if="mode === 'single'">
      <input v-model="value" class="input" />
      <svg ref="svg" class="mx-auto max-w-full rounded-xl bg-white p-4 shadow-inner" />
      <div class="flex justify-center gap-2">
        <button type="button" class="btn-primary" @click="dlPng">{{ t('downloadPng') }}</button>
        <button type="button" class="btn-secondary" @click="dlSvg">{{ t('downloadSvg') }}</button>
      </div>
      <AdSlot slot-key="nativeBelowResult" />
      <SponsoredSmartlink />
    </template>
    <template v-else>
      <textarea v-model="batch" class="input min-h-32" :placeholder="t('batchHint')" />
      <button type="button" class="btn-primary w-full" @click="batchZip">{{ t('batchZip') }}</button>
    </template>
    <p v-if="err" class="text-sm text-red-600">{{ err }}</p>
  </div>
</template>
