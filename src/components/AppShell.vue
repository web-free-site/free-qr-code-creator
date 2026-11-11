<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { SITE_NAME } from '@/config/site'
import { useLocalePath } from '@/composables/useLocalePath'

const { t, locale } = useI18n()
const route = useRoute()
const { path: lp } = useLocalePath()
const home = () => (route.path.startsWith('/fr') || locale.value === 'fr' ? '/fr' : '/')

function setLang(code: 'en' | 'fr') {
  locale.value = code
  localStorage.setItem('fqc-lang', code)
  const cur = route.path.replace(/\/$/, '')
  if (code === 'fr' && !cur.startsWith('/fr')) {
    window.location.assign(cur === '' || cur === '/' ? '/fr' : `/fr${cur}`)
  } else if (code === 'en' && cur.startsWith('/fr')) {
    const stripped = cur.slice(3) || '/'
    window.location.assign(stripped)
  }
}
</script>

<template>
  <header class="border-b border-brand-500/15 bg-paper/90 backdrop-blur">
    <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
      <RouterLink :to="home()" class="flex items-center gap-2 font-display text-xl font-bold text-brand-700">
        <img src="/favicon.svg" alt="" width="40" height="40" class="h-10 w-10" />
        {{ SITE_NAME }}
      </RouterLink>
      <nav class="flex flex-wrap items-center gap-3 text-sm font-medium text-ink/80">
        <RouterLink :to="lp('/wifi-qr-code')" class="hover:text-brand-600">{{ t('wifiQr') }}</RouterLink>
        <RouterLink :to="lp('/barcode-generator')" class="hover:text-brand-600">{{ t('barcodes') }}</RouterLink>
        <RouterLink :to="lp('/qr-code-scanner')" class="hover:text-brand-600">{{ t('scan') }}</RouterLink>
        <select
          :value="locale"
          class="rounded-lg border border-brand-500/30 bg-white px-2 py-1"
          :aria-label="t('language')"
          @change="setLang(($event.target as HTMLSelectElement).value as 'en' | 'fr')"
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </nav>
    </div>
  </header>
</template>
