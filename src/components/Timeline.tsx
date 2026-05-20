/** @jsxImportSource preact */
import { useId, useState } from 'preact/hooks';

/**
 * A single point on the timeline.
 * - `year` is shown as the marker label (string or number, e.g. 1992 or "1999-2002").
 * - `title` is the short headline of the event.
 * - `description` is the longer text revealed when the event is active.
 */
export interface TimelineEvent {
  year: string | number;
  title: string;
  description: string;
}

export interface TimelineProps {
  /** Ordered list of events (chronological order is the caller's responsibility). */
  events: TimelineEvent[];
  /** Optional heading rendered above the timeline. */
  title?: string;
}

/**
 * Reusable, accessible editorial timeline (Variant C palette).
 *
 * Interaction model: it behaves like an accordion along a vertical rail. Clicking
 * (or pressing Enter/Space on) an event expands its description and collapses the
 * others, which stay visible as compact markers. The first event is open by default
 * so the component never renders "empty".
 *
 * Accessibility:
 * - Each event header is a real <button> (focusable, keyboard-operable for free).
 * - aria-expanded reflects the open/closed state; the panel is linked via
 *   aria-controls and toggled with the `hidden` attribute.
 * - Arrow Up/Down move focus between events (roving navigation), Home/End jump to
 *   the first/last one — the pattern users expect from a vertical list of controls.
 *
 * Self-contained <style> (scoped via a generated class) so it can be dropped into
 * any MDX unit without depending on global calc/* styles. Falls back to literal
 * hex values when the site CSS variables are absent (e.g. isolated rendering).
 */
export default function Timeline({ events, title }: TimelineProps) {
  const rawId = useId();
  // useId can contain ':' which is invalid in CSS selectors/ids — sanitise it.
  const uid = `tl-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [activeIndex, setActiveIndex] = useState(0);

  if (!events || events.length === 0) return null;

  // Roving keyboard navigation across the event buttons.
  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const last = events.length - 1;
    let next: number | null = null;
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        next = index >= last ? 0 : index + 1;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        next = index <= 0 ? last : index - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
      default:
        return;
    }
    e.preventDefault();
    setActiveIndex(next);
    // Move focus to the newly targeted button.
    const root = (e.currentTarget as HTMLElement).closest(`.${uid}`);
    const btn = root?.querySelector<HTMLButtonElement>(`#${uid}-btn-${next}`);
    btn?.focus();
  };

  return (
    <section class={`tl ${uid}`} aria-label={title ?? 'Línea de tiempo'}>
      {title && <h3 class="tl__title">{title}</h3>}

      <ol class="tl__list">
        {events.map((ev, i) => {
          const open = i === activeIndex;
          return (
            <li class={`tl__item ${open ? 'is-open' : ''}`} key={i}>
              <span class="tl__rail" aria-hidden="true">
                <span class="tl__dot" />
              </span>

              <div class="tl__body">
                <button
                  type="button"
                  id={`${uid}-btn-${i}`}
                  class="tl__header"
                  aria-expanded={open}
                  aria-controls={`${uid}-panel-${i}`}
                  onClick={() => setActiveIndex(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                >
                  <span class="tl__year">{ev.year}</span>
                  <span class="tl__headline">{ev.title}</span>
                  <span class="tl__chevron" aria-hidden="true">
                    {open ? '−' : '+'}
                  </span>
                </button>

                <div
                  id={`${uid}-panel-${i}`}
                  class="tl__panel"
                  role="region"
                  aria-labelledby={`${uid}-btn-${i}`}
                  hidden={!open}
                >
                  <p class="tl__desc">{ev.description}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <style>{`
        .tl {
          margin: 2rem 0;
          font-family: var(--font-sans, "Switzer", system-ui, sans-serif);
          color: var(--color-ink, #2A1F18);
        }
        .tl__title {
          font-family: var(--font-serif, "Fraunces", Georgia, serif);
          font-size: 1.45rem;
          line-height: 1.2;
          margin: 0 0 1.2rem;
          color: var(--color-ink, #2A1F18);
        }
        .tl__list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .tl__item {
          display: grid;
          grid-template-columns: 2.2rem 1fr;
          gap: 0;
          position: relative;
        }
        /* Vertical rail drawn through the dot column. */
        .tl__rail {
          position: relative;
          display: flex;
          justify-content: center;
        }
        .tl__rail::before {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 2px;
          transform: translateX(-50%);
          background: var(--color-line, #E5D4BD);
        }
        /* Trim the rail at the very top and bottom of the list. */
        .tl__item:first-child .tl__rail::before { top: 1.15rem; }
        .tl__item:last-child .tl__rail::before { bottom: auto; height: 1.15rem; }
        .tl__dot {
          position: relative;
          z-index: 1;
          margin-top: 1.05rem;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--color-bg, #FBF6EC);
          border: 2px solid var(--color-mustard, #D4A24C);
          transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
        }
        .tl__item.is-open .tl__dot {
          background: var(--color-terra, #C44E2C);
          border-color: var(--color-terra, #C44E2C);
          transform: scale(1.25);
        }
        .tl__body {
          padding: 0 0 1.4rem 0.6rem;
          min-width: 0;
        }
        .tl__header {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          padding: 0.85rem 0.2rem 0.3rem;
          cursor: pointer;
          color: inherit;
          font: inherit;
          border-radius: 4px;
        }
        .tl__header:focus-visible {
          outline: 2px solid var(--color-terra, #C44E2C);
          outline-offset: 2px;
        }
        .tl__year {
          flex: 0 0 auto;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: var(--color-terra-deep, #9C3A1C);
          padding-top: 0.1rem;
          white-space: nowrap;
        }
        .tl__headline {
          flex: 1 1 auto;
          font-family: var(--font-serif, "Fraunces", Georgia, serif);
          font-size: 1.08rem;
          line-height: 1.35;
          color: var(--color-ink, #2A1F18);
        }
        .tl__item.is-open .tl__headline { color: var(--color-terra-deep, #9C3A1C); }
        .tl__chevron {
          flex: 0 0 auto;
          font-family: var(--font-mono, ui-monospace, monospace);
          font-size: 1.1rem;
          line-height: 1;
          color: var(--color-ink-mute, #8A7868);
        }
        .tl__panel {
          padding: 0.1rem 0.2rem 0;
        }
        .tl__panel[hidden] { display: none; }
        .tl__desc {
          margin: 0;
          font-size: 1rem;
          line-height: 1.65;
          color: var(--color-ink-soft, #5C4A3D);
          max-width: 60ch;
        }
        @media (max-width: 480px) {
          .tl__header { flex-wrap: wrap; gap: 0.25rem 0.6rem; }
          .tl__chevron { margin-left: auto; }
        }
      `}</style>
    </section>
  );
}
