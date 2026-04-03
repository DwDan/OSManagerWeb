import { Injectable, signal } from '@angular/core';
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from './i18n.constants';
import type { AppLanguage } from './i18n.types';

@Injectable({ providedIn: 'root' })
export class I18nStore {
  private readonly currentLanguageState = signal<AppLanguage>(
    (localStorage.getItem(LANGUAGE_STORAGE_KEY) as AppLanguage) || DEFAULT_LANGUAGE,
  );

  readonly currentLanguage = this.currentLanguageState.asReadonly();

  setLanguage(language: AppLanguage): void {
    this.currentLanguageState.set(language);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }

  toggleLanguage(): void {
    this.currentLanguageState.update((language) => (language === 'pt-BR' ? 'en-US' : 'pt-BR'));

    localStorage.setItem(LANGUAGE_STORAGE_KEY, this.currentLanguageState());
  }
}
