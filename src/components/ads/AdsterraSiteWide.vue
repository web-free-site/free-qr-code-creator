<script setup lang="ts">
import { onMounted } from 'vue'

function injectScriptFromHtml(html: string, target: HTMLElement) {
  if (!html.trim()) return
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  tmp.querySelectorAll('script').forEach((old) => {
    const s = document.createElement('script')
    for (const a of old.attributes) s.setAttribute(a.name, a.value)
    if (!s.src) s.text = old.textContent ?? ''
    target.appendChild(s)
  })
}

onMounted(async () => {
  try {
    const cfg = await (await fetch('/ads.json', { cache: 'no-store' })).json()
    injectScriptFromHtml(cfg.popunder ?? '', document.head)
    injectScriptFromHtml(cfg.socialBar ?? '', document.body)
  } catch {
    /* ignore */
  }
})
</script>

<template><span class="sr-only">Site-wide ads</span></template>
