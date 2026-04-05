import { HttpParams } from '@angular/common/http';

function toPascalCase(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function buildHttpParams<T extends object>(request: T): HttpParams {
  let params = new HttpParams();

  for (const [key, value] of Object.entries(request)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (typeof value === 'string' && value.trim() === '') {
      continue;
    }

    params = params.set(toPascalCase(key), String(value));
  }

  return params;
}
