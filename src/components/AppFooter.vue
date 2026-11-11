<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  ATTR_BARCODE,
  ATTR_QR,
  ATTR_SCANNER,
  AUTHOR_NAME,
  AUTHOR_URL,
  CONTACT_EMAIL
} from '@/config/site'
import { useLocalePath } from '@/composables/useLocalePath'
import SponsoredSmartlink from '@/components/ads/SponsoredSmartlink.vue'

const { t } = useI18n()
const { path: lp } = useLocalePath()
</script>

<template>
  <footer class="mt-auto border-t border-brand-600/20 bg-ink px-4 py-10 text-sm text-white/85">
    <div class="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
      <div>
        <p class="font-semibold text-brand-100">{{ t('freeForever') }}</p>
        <p class="mt-2 text-white/70">{{ t('privacyBlurb') }}</p>
      </div>
      <nav class="flex flex-col gap-2">
        <RouterLink :to="lp('/privacy')" class="hover:text-brand-100">{{ t('privacy') }}</RouterLink>
        <RouterLink :to="lp('/terms')" class="hover:text-brand-100">{{ t('terms') }}</RouterLink>
        <RouterLink :to="lp('/about')" class="hover:text-brand-100">{{ t('about') }}</RouterLink>
        <RouterLink :to="lp('/contact')" class="hover:text-brand-100">{{ t('contact') }}</RouterLink>
        <RouterLink :to="lp('/source')" class="hover:text-brand-100">{{ t('sourceCode') }}</RouterLink>
      </nav>
      <div>
        <p>
          {{ t('by') }}
          <a :href="AUTHOR_URL" class="font-medium text-brand-100">{{ AUTHOR_NAME }}</a>
        </p>
        <a :href="`mailto:${CONTACT_EMAIL}`" class="mt-2 block hover:text-brand-100">{{ CONTACT_EMAIL }}</a>
        <p class="mt-4 text-xs text-white/60">
          {{ t('credits') }}
          <a :href="ATTR_QR" class="underline" target="_blank" rel="noopener">qr-code-styling</a> ·
          <a :href="ATTR_BARCODE" class="underline" target="_blank" rel="noopener">JsBarcode</a> ·
          <a :href="ATTR_SCANNER" class="underline" target="_blank" rel="noopener">qr-scanner</a>
        </p>
      </div>
    </div>
    <div class="mx-auto mt-8 max-w-6xl border-t border-white/10 pt-6">
      <SponsoredSmartlink />
    </div>
  </footer>
</template>
