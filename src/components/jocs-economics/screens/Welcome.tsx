// src/components/jocs-economics/screens/Welcome.tsx
import { useState, useEffect } from 'preact/hooks';
import { api } from '../../../lib/jocs-economics/client/api';

interface Props {
  initialIdentity: { name: string; institute: string } | null;
  onStart: (name: string, institute: string) => void;
}

export function Welcome({ initialIdentity, onStart }: Props) {
  const [name, setName] = useState(initialIdentity?.name ?? '');
  const [institute, setInstitute] = useState(initialIdentity?.institute ?? '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [manifest, setManifest] = useState<{ totals: { preguntas: number; byCategoria: Record<string, number> } } | null>(null);

  useEffect(() => {
    fetch('/jocs-economics/manifest.json')
      .then((r) => r.ok ? r.json() : null)
      .then((m) => m && setManifest(m))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (institute.length < 2) {
      setSuggestions([]);
      return;
    }
    const handle = setTimeout(() => {
      api.institutes(institute)
        .then((res) => setSuggestions(res.suggestions))
        .catch(() => setSuggestions([]));
    }, 250);
    return () => clearTimeout(handle);
  }, [institute]);

  const canStart = name.trim().length >= 1 && name.trim().length <= 40
    && institute.trim().length >= 2 && institute.trim().length <= 80;

  return (
    <>
      <h1 class="jocs-title" style={{ fontSize: 36, fontStyle: 'italic', margin: '20px 0 4px' }}>
        Jocs Econòmics
      </h1>
      <p class="jocs-mute" style={{ marginBottom: 24 }}>
        Retos de economía, finanzas y empresa.
        <br />
        ¿Cuántos aciertos antes de perder 3 vidas?
      </p>

      {manifest && (
        <p class="jocs-mute" style={{ marginBottom: 16 }}>
          {manifest.totals.preguntas} preguntas · 3 categorías
        </p>
      )}

      <input
        class="jocs-input"
        placeholder="Tu nombre"
        value={name}
        maxLength={40}
        onInput={(e) => setName((e.target as HTMLInputElement).value)}
      />
      <input
        class="jocs-input"
        placeholder="Instituto o centro"
        value={institute}
        maxLength={80}
        list="jocs-institutes-list"
        onInput={(e) => setInstitute((e.target as HTMLInputElement).value)}
      />
      <datalist id="jocs-institutes-list">
        {suggestions.map((s) => <option key={s} value={s} />)}
      </datalist>

      <button
        class="jocs-button-primary"
        disabled={!canStart}
        onClick={() => onStart(name.trim(), institute.trim())}
      >
        Empezar
      </button>

      <p class="jocs-mute" style={{ marginTop: 20, fontSize: 11, lineHeight: 1.4 }}>
        Tu nombre e instituto aparecerán públicamente en el ranking.
      </p>

      <p style={{ textAlign: 'center', marginTop: 32 }}>
        <a class="jocs-link" href="/jocs-economics/leaderboard/">Ver ranking →</a>
      </p>
    </>
  );
}
