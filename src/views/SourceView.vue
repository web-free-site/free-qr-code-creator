<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppShell from '@/components/AppShell.vue'
import AppFooter from '@/components/AppFooter.vue'
import {
  ATTR_BARCODE,
  ATTR_QR,
  ATTR_SCANNER,
  SITE_NAME,
  SITE_URL,
  SOURCE_REPO
} from '@/config/site'

const route = useRoute()
const fr = computed(() => route.path.startsWith('/fr'))

const copy = computed(() =>
  fr.value
    ? {
        t: 'Code source',
        p: `${SITE_NAME} est sous licence MIT. Les bibliothèques qr-code-styling, JsBarcode et qr-scanner sont également MIT. Le dépôt public Git sera lié ici lorsqu’il est publié ; en attendant, contactez gentil@quevvy.com pour le code.`
      }
    : {
        t: 'Source code',
        p: `${SITE_NAME} is released under the MIT License. Upstream libraries qr-code-styling, JsBarcode, and qr-scanner are MIT as well. When the public Git repository is live, it will be linked below; until then email gentil@quevvy.com for source access.`
      }
)

function applySeo() {
  document.title = `${copy.value.t} | ${SITE_NAME}`
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
  document.documentElement.lang = fr.value ? 'fr' : 'en'
}

onMounted(applySeo)
watch(() => route.path, applySeo)
</script>

<template>
  <div class="flex min-h-screen flex-col bg-paper">
    <AppShell />
    <article class="mx-auto max-w-3xl flex-1 px-4 py-12">
      <h1 class="font-display text-3xl font-bold text-brand-700">{{ copy.t }}</h1>
      <p class="mt-6 leading-relaxed text-ink/85">{{ copy.p }}</p>
      <ul class="mt-6 list-disc space-y-2 pl-6 text-ink/80">
        <li>
          <a :href="ATTR_QR" target="_blank" rel="noopener" class="text-brand-700 underline">qr-code-styling</a>
        </li>
        <li>
          <a :href="ATTR_BARCODE" target="_blank" rel="noopener" class="text-brand-700 underline">JsBarcode</a>
        </li>
        <li>
          <a :href="ATTR_SCANNER" target="_blank" rel="noopener" class="text-brand-700 underline">qr-scanner</a>
        </li>
      </ul>
      <p v-if="SOURCE_REPO" class="mt-6">
        <a :href="SOURCE_REPO" class="text-brand-700 underline" rel="noopener" target="_blank">{{ SOURCE_REPO }}</a>
      </p>
      <p class="mt-8 text-sm text-ink/60">LICENSE and NOTICE in the project root describe third-party attributions.</p>
    </article>
    <AppFooter />
  </div>
</template>
