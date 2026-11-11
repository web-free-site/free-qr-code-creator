import { useI18n } from 'vue-i18n'

/** Prefix with /fr when the active locale is French. */
export function useLocalePath() {
  const { locale } = useI18n()
  const prefix = () => (locale.value === 'fr' ? '/fr' : '')
  const path = (p: string) => {
    if (p.startsWith('/fr')) return p
    return `${prefix()}${p.startsWith('/') ? p : `/${p}`}`
  }
  return { path, isFr: () => locale.value === 'fr' }
}
