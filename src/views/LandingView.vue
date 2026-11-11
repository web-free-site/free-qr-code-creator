<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppShell from '@/components/AppShell.vue'
import AppFooter from '@/components/AppFooter.vue'
import QrStudio from '@/components/QrStudio.vue'
import BarcodeStudio from '@/components/BarcodeStudio.vue'
import ScannerPanel from '@/components/ScannerPanel.vue'
import AdSlot from '@/components/ads/AdSlot.vue'
import { findPage, landingPages } from '@/seo/landingPages'
import { SITE_NAME, SITE_URL } from '@/config/site'

const route = useRoute()
const { locale } = useI18n()
const page = computed(() => findPage(route.path))
const fr = computed(() => route.path.startsWith('/fr'))
const title = computed(() => (page.value ? (fr.value ? page.value.titleFr : page.value.titleEn) : SITE_NAME))
const h1 = computed(() => (page.value ? (fr.value ? page.value.h1Fr : page.value.h1En) : ''))
const desc = computed(() => (page.value ? (fr.value ? page.value.descriptionFr : page.value.descriptionEn) : ''))
const body = computed(() => (page.value ? (fr.value ? page.value.bodyFr : page.value.bodyEn) : []))
const faq = computed(() => (page.value ? (fr.value ? page.value.faqFr : page.value.faqEn) : []))

const related = computed(() => landingPages.filter((p) => p.path !== page.value?.path).slice(0, 6))

let ld: HTMLScriptElement[] = []

function meta() {
  document.title = title.value
  const d = document.querySelector('meta[name="description"]')
  if (d) d.setAttribute('content', desc.value)
  let c = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!c) {
    c = document.createElement('link')
    c.rel = 'canonical'
    document.head.appendChild(c)
  }
  c.href = `${SITE_URL}${route.path.endsWith('/') ? route.path : route.path + '/'}`
  document.documentElement.lang = fr.value ? 'fr' : 'en'
  locale.value = fr.value ? 'fr' : 'en'
}

function jsonLd() {
  ld.forEach((s) => s.remove())
  ld = []
  if (!page.value) return
  const url = `${SITE_URL}${route.path}`
  const blocks = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: title.value,
      url,
      applicationCategory: 'UtilityApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: desc.value
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.value.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: h1.value, item: url }
      ]
    }
  ]
  for (const b of blocks) {
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.text = JSON.stringify(b)
    document.head.appendChild(s)
    ld.push(s)
  }
}

onMounted(() => {
  meta()
  jsonLd()
})
onBeforeUnmount(() => ld.forEach((s) => s.remove()))
watch(() => route.path, () => {
  meta()
  jsonLd()
})
</script>

<template>
  <div v-if="page" class="flex min-h-screen flex-col bg-paper">
    <AppShell />
    <AdSlot slot-key="headerBanner728x90" class="px-2 py-2" />
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 lg:flex-row">
      <article class="min-w-0 flex-1">
        <h1 class="font-display text-3xl font-bold text-brand-700 md:text-4xl">{{ h1 }}</h1>
        <p v-for="(p, i) in body" :key="i" class="mt-4 leading-relaxed text-ink/85">{{ p }}</p>
        <section class="my-8 rounded-3xl border border-brand-500/10 bg-white p-4 shadow-card">
          <QrStudio v-if="page.tool === 'qr'" :preset="page.qrPreset" compact />
          <ScannerPanel v-else-if="page.tool === 'scan'" />
          <BarcodeStudio v-else :initial="page.barcodeFormat" />
        </section>
        <AdSlot slot-key="betweenContent728x90" />
        <section class="mt-10">
          <h2 class="text-xl font-semibold">{{ fr ? 'FAQ' : 'FAQ' }}</h2>
          <dl class="mt-4 space-y-4">
            <div v-for="(item, idx) in faq" :key="idx">
              <dt class="font-medium text-brand-700">{{ item.q }}</dt>
              <dd class="mt-1 text-ink/80">{{ item.a }}</dd>
            </div>
          </dl>
        </section>
        <nav class="mt-10">
          <h2 class="font-semibold">{{ fr ? 'Autres outils' : 'More free tools' }}</h2>
          <ul class="mt-3 flex flex-wrap gap-2">
            <li v-for="lnk in related" :key="lnk.path">
              <router-link
                :to="fr ? lnk.pathFr : lnk.path"
                class="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700 hover:bg-brand-100"
              >
                {{ fr ? lnk.h1Fr : lnk.h1En }}
              </router-link>
            </li>
          </ul>
        </nav>
      </article>
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
  </div>
</template>
