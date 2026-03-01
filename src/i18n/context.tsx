import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { I18nStrings } from './types'
import type { CompIndex } from '@/types'
import { ja } from './locales/ja'
import { en } from './locales/en'

const strings: Record<'ja' | 'en', I18nStrings> = { ja, en }

type Locale = 'ja' | 'en'

interface I18nContextValue {
  t: (key: keyof I18nStrings, params?: Record<string, string | number>) => string
  compLabel: (i: CompIndex) => string
  roleLabel: (role: string) => string
  locale: Locale
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

function interpolate(s: string, params?: Record<string, string | number>): string {
  if (!params) return s
  return s.replace(/\{\{(\w+)\}\}/g, (_, k) => String(params[k] ?? ''))
}

const compKeys: (keyof I18nStrings)[] = ['compDive', 'compRush', 'compPoke', 'compAnchor']

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('ja')
  const s = strings[locale]

  const t = useCallback(
    (key: keyof I18nStrings, params?: Record<string, string | number>) => {
      const raw = s[key]
      return typeof raw === 'string' ? interpolate(raw, params) : ''
    },
    [locale]
  )

  const compLabel = useCallback(
    (i: CompIndex) => t(compKeys[i] as keyof I18nStrings),
    [t]
  )

  const roleLabel = useCallback(
    (role: string) => {
      if (role === 'TANK') return locale === 'ja' ? 'タンク' : 'Tank'
      if (role === 'DPS') return 'DPS'
      if (role === 'SUPPORT') return locale === 'ja' ? 'サポート' : 'Support'
      return role
    },
    [locale]
  )

  return (
    <I18nContext.Provider value={{ t, compLabel, roleLabel, locale, setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
