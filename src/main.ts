import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { i18n } from './i18n'
import './assets/main.css'

const saved = localStorage.getItem('fqc-lang')
if (saved === 'fr' || saved === 'en') i18n.global.locale.value = saved

createApp(App).use(router).use(i18n).mount('#app')
