<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppShell from '@/components/AppShell.vue'
import AppFooter from '@/components/AppFooter.vue'
import { AUTHOR_NAME, CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/config/site'

const route = useRoute()

const props = defineProps<{ slug: string; lang: string }>()

const copy = computed(() => {
  const en: Record<string, { t: string; b: string }> = {
    privacy: {
      t: 'Privacy Policy',
      b: `${SITE_NAME} processes QR and barcode data entirely in your browser. We do not store payloads on our servers. Optional Adsterra snippets in public/ads.json may set third-party cookies when configured. Contact ${CONTACT_EMAIL}.`
    },
    terms: {
      t: 'Terms of Use',
      b: `Use this free tool lawfully. Output is provided as-is. You are responsible for encoded content. Service by ${AUTHOR_NAME}.`
    },
    about: {
      t: 'About',
      b: `${SITE_NAME} is a client-side utility for static QR codes and barcodes, built for ${AUTHOR_NAME} in Kigali using MIT libraries: qr-code-styling, JsBarcode, and qr-scanner.`
    },
    contact: { t: 'Contact', b: `Email: ${CONTACT_EMAIL} — ${AUTHOR_NAME}` }
  }
  const fr: Record<string, { t: string; b: string }> = {
    privacy: {
      t: 'Confidentialité',
      b: `Traitement local uniquement. Pas de stockage serveur. Publicités Adsterra optionnelles. ${CONTACT_EMAIL}.`
    },
    terms: { t: 'Conditions', b: 'Utilisation gratuite et légale. Fourni tel quel.' },
    about: { t: 'À propos', b: 'Outil gratuit MIT pour QR et codes-barres, par Gentil M.' },
    contact: { t: 'Contact', b: CONTACT_EMAIL }
  }
  return (props.lang === 'fr' ? fr : en)[props.slug] ?? en.privacy
})

function applySeo() {
  const title = `${copy.value.t} | ${SITE_NAME}`
  document.title = title
  const canonical = `${SITE_URL}${route.path}`
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = canonical
  let og = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null
  if (!og) {
    og = document.createElement('meta')
    og.setAttribute('property', 'og:url')
    document.head.appendChild(og)
  }
  og.content = canonical
  document.documentElement.lang = props.lang === 'fr' ? 'fr' : 'en'
}

onMounted(applySeo)
watch(() => route.path, applySeo)
</script>

<template>
  <div class="flex min-h-screen flex-col bg-paper">
    <AppShell />
    <article class="mx-auto max-w-3xl flex-1 px-4 py-12">
      <h1 class="font-display text-3xl font-bold text-brand-700">{{ copy.t }}</h1>
      <p class="mt-6 leading-relaxed text-ink/85">{{ copy.b }}</p>
      <p class="mt-4 text-sm text-ink/60">{{ SITE_URL }}</p>
    </article>
    <AppFooter />
  </div>
</template>
