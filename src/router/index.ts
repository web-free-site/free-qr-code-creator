import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LandingView from '@/views/LandingView.vue'
import LegalView from '@/views/LegalView.vue'
import SourceView from '@/views/SourceView.vue'
import { landingPages, legalPages } from '@/seo/landingPages'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/fr', component: HomeView },
    ...landingPages.flatMap((p) => [
      { path: p.path, component: LandingView },
      { path: p.pathFr, component: LandingView }
    ]),
    ...legalPages.flatMap((p) => [
      { path: p.path, component: LegalView, props: { slug: p.slug, lang: 'en' } },
      { path: p.pathFr, component: LegalView, props: { slug: p.slug, lang: 'fr' } }
    ]),
    { path: '/source', component: SourceView },
    { path: '/fr/source', component: SourceView }
  ],
  scrollBehavior: () => ({ top: 0 })
})
