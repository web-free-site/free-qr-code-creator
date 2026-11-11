<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const url = ref('')

onMounted(async () => {
  try {
    const cfg = await (await fetch('/ads.json', { cache: 'no-store' })).json()
    url.value = (cfg.smartlinkUrl ?? '').trim()
  } catch {
    url.value = ''
  }
})
</script>

<template>
  <p v-if="url" class="mt-4 text-center text-xs text-ink/60">
    <span class="font-semibold uppercase tracking-wide text-ink/45">
      {{ locale === 'fr' ? 'Sponsorisé' : 'Sponsored' }}
    </span>
    —
    <a
      :href="url"
      class="text-brand-700 underline hover:text-brand-800"
      rel="noopener noreferrer sponsored"
      target="_blank"
    >
      {{ locale === 'fr' ? 'Offre partenaire' : 'Partner offer' }}
    </a>
  </p>
</template>
