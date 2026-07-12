/** @jsxImportSource preact */
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { type Locale, DEFAULT_LOCALE } from '@/i18n/locale';

// Shared across every game island tree. The game root sets it from the Astro
// page's `Astro.currentLocale`; children read it via useGameLocale(). Default
// 'es' so games render Spanish under `/` and without JS (SEO intact).
export const GameLocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export const useGameLocale = (): Locale => useContext(GameLocaleContext);
