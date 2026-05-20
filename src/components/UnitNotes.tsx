/** @jsxImportSource preact */
import { useEffect, useRef, useState } from 'preact/hooks';
import { loadJSON, removeKey, saveJSON } from '../lib/storage';

type Props = {
  /** Stable per-unit namespace for localStorage. Pass `${slug}-uNN`. */
  unitKey: string;
  /** Optional unit title, shown in the panel header for context. */
  unitTitle?: string;
};

/** localStorage key holding the free-text notes for this unit. */
function notesKey(unitKey: string): string {
  return `unit:${unitKey}:notes`;
}

/** localStorage key holding the bookmark boolean for this unit. */
function bookmarkKey(unitKey: string): string {
  return `unit:${unitKey}:bookmark`;
}

/** How long to wait after the last keystroke before persisting notes (ms). */
const SAVE_DEBOUNCE_MS = 600;

/** How long the "guardado" indicator stays visible after a save (ms). */
const SAVED_FLASH_MS = 1800;

export default function UnitNotes({ unitKey, unitTitle }: Props) {
  const [notes, setNotes] = useState('');
  const [bookmarked, setBookmarked] = useState(false);
  // `saved` shows a discreet confirmation after a successful persist.
  const [saved, setSaved] = useState(false);
  // Until hydrated we render an inert shell so the markup matches the server
  // output and we never touch localStorage during the server render.
  const [hydrated, setHydrated] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flashRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load persisted state once, after mount only — avoids an SSR/client
  // hydration mismatch (localStorage is unavailable during the server render).
  useEffect(() => {
    setNotes(loadJSON<string>(notesKey(unitKey), ''));
    setBookmarked(loadJSON<boolean>(bookmarkKey(unitKey), false));
    setHydrated(true);
  }, [unitKey]);

  // Clear any pending timers on unmount.
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (flashRef.current) clearTimeout(flashRef.current);
    };
  }, []);

  function flashSaved() {
    setSaved(true);
    if (flashRef.current) clearTimeout(flashRef.current);
    flashRef.current = setTimeout(() => setSaved(false), SAVED_FLASH_MS);
  }

  /** Persist notes immediately and flash the saved indicator. */
  function persistNotes(value: string) {
    if (saveJSON(notesKey(unitKey), value)) flashSaved();
  }

  function onInput(e: Event) {
    const value = (e.currentTarget as HTMLTextAreaElement).value;
    setNotes(value);
    // Debounce while typing so we don't write on every keystroke.
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => persistNotes(value), SAVE_DEBOUNCE_MS);
  }

  function onBlur() {
    // Flush any pending debounced write when the field loses focus.
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    persistNotes(notes);
  }

  function toggleBookmark() {
    const next = !bookmarked;
    setBookmarked(next);
    if (saveJSON(bookmarkKey(unitKey), next)) flashSaved();
  }

  function clearNotes() {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setNotes('');
    removeKey(notesKey(unitKey));
    flashSaved();
  }

  return (
    <section class="un" aria-labelledby="un-title">
      <div class="un__head">
        <div>
          <div class="un__eyebrow">Tus apuntes</div>
          <h2 id="un-title" class="un__title">
            Notas de esta unidad
          </h2>
        </div>
        <button
          type="button"
          class={['un__mark', bookmarked ? 'is-on' : ''].join(' ').trim()}
          onClick={toggleBookmark}
          disabled={!hydrated}
          aria-pressed={bookmarked}
        >
          {bookmarked ? 'Marcada ✓' : 'Marcar esta unidad'}
        </button>
      </div>

      <p class="un__hint">
        {unitTitle
          ? `Anota lo que quieras recordar de «${unitTitle}». Se guarda solo en este dispositivo.`
          : 'Anota lo que quieras recordar. Se guarda solo en este dispositivo.'}
      </p>

      <textarea
        class="un__area"
        value={notes}
        onInput={onInput}
        onBlur={onBlur}
        disabled={!hydrated}
        placeholder={hydrated ? 'Escribe aquí tus notas…' : 'Cargando…'}
        rows={6}
        aria-label="Notas de la unidad"
      />

      <div class="un__foot">
        <span class={['un__saved', saved ? 'is-visible' : ''].join(' ').trim()} aria-live="polite">
          Guardado
        </span>
        <button
          type="button"
          class="un__clear"
          onClick={clearNotes}
          disabled={!hydrated || notes.length === 0}
        >
          Borrar notas
        </button>
      </div>
    </section>
  );
}
