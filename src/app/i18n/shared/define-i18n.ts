import type { I18nDictionary, I18nSchema } from './i18n.types';

export function defineI18n<const T extends I18nDictionary>(schema: I18nSchema<T>): I18nSchema<T> {
  return schema;
}
