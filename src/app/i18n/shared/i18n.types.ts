export type AppLanguage = 'pt-BR' | 'en-US' | string;

export type I18nValue = string | number | boolean | I18nDictionary;

export type I18nDictionary = {
  [key: string]: I18nValue;
};

export type I18nSchema<T extends I18nDictionary> = {
  ptBR: T;
  enUS: T;
};
