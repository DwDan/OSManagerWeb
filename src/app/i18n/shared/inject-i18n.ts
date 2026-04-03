import { computed, inject, type Signal } from '@angular/core';
import { I18nStore } from './i18n.store';
import type { I18nDictionary, I18nSchema } from './i18n.types';

export function injectI18n<const T extends I18nDictionary>(schema: I18nSchema<T>): Signal<T> {
  const i18nStore = inject(I18nStore);

  return computed(() => {
    const language = i18nStore.currentLanguage();

    return language === 'pt-BR' ? schema.ptBR : schema.enUS;
  });
}
