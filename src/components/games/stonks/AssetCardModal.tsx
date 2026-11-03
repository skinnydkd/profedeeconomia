/** @jsxImportSource preact */
import { useEffect, useRef } from 'preact/hooks';
import { cardFor } from '@/lib/games/stonks/data/cards';
import { useGameLocale } from '../locale-context';
import { localizeCard } from '@/i18n/games/stonks-ca';

// The deep explanation card. Opened automatically the first time an asset
// becomes available, and re-openable from the ⓘ button on any row.

interface Props {
  id: string;
  onClose: () => void;
}

const COPY = {
  es: { close: 'Entendido', label: 'Explicación del activo' },
  ca: { close: 'Entesos', label: 'Explicació de l’actiu' },
};

export function AssetCardModal({ id, onClose }: Props) {
  const locale = useGameLocale();
  const c = COPY[locale];
  const card = localizeCard(cardFor(id), locale);
  const closeRef = useRef<HTMLButtonElement>(null);

  // The modal is the one place in this game where a keyboard user could get
  // stranded, so it takes focus on open and gives Escape a way out.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!card) return null;

  return (
    <div class="sk-modal-backdrop" onClick={onClose}>
      <div
        class="sk-modal"
        role="dialog"
        aria-modal="true"
        aria-label={c.label}
        aria-labelledby="sk-card-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="sk-card-title" class="serif">
          {card.title}
        </h2>
        {card.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <button ref={closeRef} class="sk-cta" onClick={onClose}>
          {c.close}
        </button>
      </div>
    </div>
  );
}
