import { PLURAL_DICTIONARY, type PluralDictionaryKey, type PluralForms } from './pluralForms'

/**
 * Возвращает правильную форму слова для числа по правилам русского языка.
 *
 * @param count — число
 * @param forms — объект с тремя формами { one, few, many }
 *
 * @example
 * pluralize(5, { one: 'задача', few: 'задачи', many: 'задач' }) // → 'задач'
 */
export function pluralize(count: number, forms: PluralForms): string

/**
 * Возвращает правильную форму слова из централизованного словаря.
 *
 * @param count — число
 * @param key   — ключ из PLURAL_DICTIONARY
 *
 * @example
 * pluralize(5, 'task') // → 'задач'
 */
export function pluralize(count: number, key: PluralDictionaryKey): string

export function pluralize(count: number, formsOrKey: PluralForms | PluralDictionaryKey): string {
  const forms = typeof formsOrKey === 'string'
    ? PLURAL_DICTIONARY[formsOrKey]
    : formsOrKey

  if (!forms) {
    throw new Error(`[pluralize] Unknown dictionary key: ${formsOrKey}`)
  }

  const mod10 = count % 10
  const mod100 = count % 100

  if (mod10 === 1 && mod100 !== 11) {
    return forms.one
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return forms.few
  }

  return forms.many
}
