export interface PluralForms {
  one: string
  few: string
  many: string
}

export const PLURAL_DICTIONARY = {
  task: { one: 'задача', few: 'задачи', many: 'задач' },
  column: { one: 'колонка', few: 'колонки', many: 'колонок' },
} satisfies Record<string, PluralForms>

export type PluralDictionaryKey = keyof typeof PLURAL_DICTIONARY
