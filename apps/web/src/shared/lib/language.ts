export type Language = 'ru' | 'en'

export const DEFAULT_LANGUAGE: Language = 'ru'

export function resolveLanguage(value: string | null | undefined): Language {
  const baseLanguage = value?.toLowerCase().split(/[-_]/, 1)[0]
  return baseLanguage === 'en' ? 'en' : DEFAULT_LANGUAGE
}
