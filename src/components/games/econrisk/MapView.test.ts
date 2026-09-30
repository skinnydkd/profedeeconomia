import { describe, it, expect, vi } from 'vitest';
import { h, options, type VNode } from 'preact';
import { renderToString } from 'preact-render-to-string';
import { MapView } from './MapView';
import { GameLocaleContext } from '../locale-context';
import { createInitialState } from '@/lib/games/econrisk/engine';
import { TERRITORIES } from '@/lib/games/econrisk/map';

type NodeProps = {
  class?: string;
  onKeyDown?: (e: { key: string; preventDefault: () => void }) => void;
};

/** Renders the map and keeps the territory nodes' vnodes to call their handlers. */
function renderMap(selectedId: string | null = null) {
  const onSelect = vi.fn();
  const nodes: VNode<NodeProps>[] = [];
  const previous = options.vnode;
  options.vnode = (vnode) => {
    if ((vnode.props as NodeProps).class === 'er-node') nodes.push(vnode as VNode<NodeProps>);
    previous?.(vnode);
  };
  try {
    const state = createInitialState(['keynes'], () => 0.5);
    const html = renderToString(
      h(GameLocaleContext.Provider, { value: 'es' }, h(MapView, { state, selectedId, onSelect })),
    );
    return { html, nodes, onSelect };
  } finally {
    options.vnode = previous;
  }
}

describe('MapView accessibility', () => {
  it('exposes the territories instead of hiding them inside role="img"', () => {
    const { html } = renderMap();
    expect(html).toMatch(/<svg[^>]*role="group"/);
    expect(html).not.toMatch(/role="img"/);
  });

  it('makes every territory a focusable button with its name and units', () => {
    const { html } = renderMap();
    const buttons = html.match(/<g[^>]*role="button"[^>]*>/g) ?? [];
    expect(buttons).toHaveLength(TERRITORIES.length);
    for (const b of buttons) {
      // Lowercase on purpose: SVG attributes are case-sensitive.
      expect(b).toContain('tabindex="0"');
      expect(b).toMatch(/aria-label="[^"]+: \d+ unidades \([^)]+\)"/);
    }
  });

  it('marks the selected territory as pressed', () => {
    const id = TERRITORIES[0].id;
    const { html } = renderMap(id);
    expect(html.match(/aria-pressed="true"/g) ?? []).toHaveLength(1);
  });

  it('selects a territory with Enter or Space, and ignores other keys', () => {
    const { nodes, onSelect } = renderMap();
    const first = nodes[0];
    const preventDefault = vi.fn();
    first.props.onKeyDown?.({ key: 'Enter', preventDefault });
    first.props.onKeyDown?.({ key: ' ', preventDefault });
    first.props.onKeyDown?.({ key: 'Tab', preventDefault });
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenCalledWith(TERRITORIES[0].id);
    // Space must not scroll the page.
    expect(preventDefault).toHaveBeenCalledTimes(2);
  });
});
