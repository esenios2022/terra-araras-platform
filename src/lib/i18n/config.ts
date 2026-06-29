// Nombre versionado a propósito: cambiarlo fuerza a que todos los navegadores
// (incluidos los que ya tenían "es" guardado de antes de que pt fuera el default)
// vuelvan a pasar por la detección automática.
export const LOCALE_COOKIE_NAME = "locale_v2";
export const LOCALE_HEADER_NAME = "x-locale";
export type Locale = "es" | "pt";
export const LOCALES: Locale[] = ["es", "pt"];
