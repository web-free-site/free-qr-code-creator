<script setup lang="ts">
import QrScanner from 'qr-scanner'
import { onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{ scanned: [value: string] }>()
const { t } = useI18n()
const video = ref<HTMLVideoElement | null>(null)
const result = ref('')
const active = ref(false)
let scanner: QrScanner | null = null

async function start() {
  if (!video.value) return
  result.value = ''
  scanner = new QrScanner(
    video.value,
    (r) => {
      result.value = r.data
      emit('scanned', r.data)
    },
    { highlightScanRegion: true, preferredCamera: 'environment' }
  )
  await scanner.start()
  active.value = true
}

async function stop() {
  await scanner?.stop()
  scanner?.destroy()
  scanner = null
  active.value = false
}

onUnmounted(() => {
  void stop()
})
</script>

<template>
  <div class="card mx-auto max-w-lg space-y-4 text-center">
    <p class="text-sm text-ink/70">{{ t('scannerHint') }}</p>
    <video ref="video" class="mx-auto max-h-72 w-full rounded-2xl bg-black object-cover" playsinline muted />
    <div class="flex justify-center gap-2">
      <button v-if="!active" type="button" class="btn-primary" @click="start">{{ t('scannerStart') }}</button>
      <button v-else type="button" class="btn-secondary" @click="stop">{{ t('scannerStop') }}</button>
    </div>
    <p v-if="result" class="break-all text-left text-sm">
      <strong>{{ t('scannerResult') }}:</strong> {{ result }}
    </p>
  </div>
</template>
