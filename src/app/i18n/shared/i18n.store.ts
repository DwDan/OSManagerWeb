import { Injectable, signal } from '@angular/core';
import type { AppLanguage } from './i18n.types';

@Injectable({ providedIn: 'root' })
export class I18nStore {
  private readonly currentLanguageState = signal<AppLanguage>('pt-BR');

  readonly currentLanguage = this.currentLanguageState.asReadonly();

  setLanguage(language: AppLanguage): void {
    this.currentLanguageState.set(language);
  }

  toggleLanguage(): void {
    this.currentLanguageState.update((language) => (language === 'pt-BR' ? 'en-US' : 'pt-BR'));
  }
}
