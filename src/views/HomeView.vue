<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppShell from '@/components/AppShell.vue'
import AppFooter from '@/components/AppFooter.vue'
import QrStudio from '@/components/QrStudio.vue'
import BarcodeStudio from '@/components/BarcodeStudio.vue'
import ScannerPanel from '@/components/ScannerPanel.vue'
import AdSlot from '@/components/ads/AdSlot.vue'
import { SITE_NAME, SITE_URL } from '@/config/site'

const { t, locale } = useI18n()
const route = useRoute()
const tab = ref<'create' | 'scan' | 'barcode'>('create')

watch(
  () => route.path,
  (p) => {
    locale.value = p.startsWith('/fr') ? 'fr' : 'en'
    document.title = locale.value === 'fr' ? `${SITE_NAME} — gratuit` : `${SITE_NAME} — Free tools`
  },
  { immediate: true }
)
</script>

<template>
  <div class="flex min-h-screen flex-col bg-paper">
    <AppShell />
    <AdSlot slot-key="headerBanner728x90" class="px-2 py-2" />
    <div class="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-4 py-8 lg:flex-row">
      <main class="min-w-0 flex-1">
        <p class="mb-6 text-center text-lg text-ink/80">{{ t('tagline') }}</p>
        <div class="mb-8 flex flex-wrap justify-center gap-2">
          <button type="button" class="chip" :class="{ 'chip-active': tab === 'create' }" @click="tab = 'create'">
            {{ t('create') }}
          </button>
          <button type="button" class="chip" :class="{ 'chip-active': tab === 'scan' }" @click="tab = 'scan'">
            {{ t('scan') }}
          </button>
          <button type="button" class="chip" :class="{ 'chip-active': tab === 'barcode' }" @click="tab = 'barcode'">
            {{ t('barcodes') }}
          </button>
        </div>
        <QrStudio v-if="tab === 'create'" />
        <ScannerPanel v-else-if="tab === 'scan'" />
        <BarcodeStudio v-else />
        <AdSlot slot-key="betweenContent728x90" class="mt-10" />
      </main>
      <aside class="hidden w-44 shrink-0 space-y-4 lg:block xl:w-52">
        <div class="sticky top-4 space-y-4">
          <AdSlot slot-key="sidebar160x600" />
          <AdSlot slot-key="sidebar160x300" />
          <AdSlot slot-key="sidebar300x250" />
          <AdSlot slot-key="sidebar468x60" />
        </div>
      </aside>
    </div>
    <AdSlot
      slot-key="mobileSticky320x50"
      class="fixed inset-x-0 bottom-0 z-30 border-t border-brand-500/20 bg-paper/95 p-1 lg:hidden"
    />
    <AppFooter />
    <link rel="canonical" :href="`${SITE_URL}${route.path.startsWith('/fr') ? '/fr' : '/'}`" />
  </div>
</template>
