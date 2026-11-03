/**
 * Cover illustrations for the subject cards on the home and the subject hub
 * hero. Flat, layered shapes in the subject's three tones (base, deep, soft)
 * plus cream and mustard — direction B of the mockup validated on 2026-10-22
 * (.superpowers/brainstorm, «caratules-targetes»). Each entry returns the full
 * inner markup (background included) for an SVG with viewBox "0 0 320 132".
 */
import { ACCENTS, type Asignatura, type AsignaturaSlug } from '@/lib/asignaturas';

const CREAM = '#FBF6EC';
const MUSTARD = '#D4A24C';
const TERRA = '#C44E2C';

type Tones = { base: string; deep: string; soft: string };
type Motif = (c: Tones) => string;

const bg = (c: Tones) => `<rect width="320" height="132" fill="${c.base}"/>`;

// Keyed by slug so adding a subject without a cover is a compile error.
export const MOTIFS: Record<AsignaturaSlug, Motif> = {
  // A shop front next to a business-plan sheet.
  'edmn-2bach': (c) => `${bg(c)}
    <circle cx="270" cy="20" r="60" fill="${c.deep}"/>
    <rect x="62" y="40" width="96" height="70" fill="${c.soft}"/>
    <path d="M56 40 L110 12 L164 40Z" fill="${CREAM}"/>
    <rect x="98" y="78" width="24" height="32" fill="${c.deep}"/>
    <rect x="72" y="52" width="18" height="16" fill="${MUSTARD}"/>
    <rect x="130" y="52" width="18" height="16" fill="${MUSTARD}"/>
    <rect x="184" y="62" width="70" height="48" rx="3" fill="${CREAM}"/>
    <g stroke="${c.base}" stroke-width="2"><line x1="194" y1="76" x2="244" y2="76"/><line x1="194" y1="86" x2="232" y2="86"/><line x1="194" y1="96" x2="238" y2="96"/></g>`,

  // Market stalls under one awning, with buyers.
  'eco-1bach': (c) => `${bg(c)}
    <circle cx="40" cy="120" r="70" fill="${c.deep}"/>
    <rect x="60" y="66" width="200" height="44" fill="${c.soft}"/>
    <path d="M50 66 L270 66 L250 44 L70 44Z" fill="${MUSTARD}"/>
    <g fill="${c.base}"><rect x="76" y="80" width="30" height="30"/><rect x="146" y="80" width="30" height="30"/><rect x="216" y="80" width="30" height="30"/></g>
    <g fill="${CREAM}"><circle cx="91" cy="32" r="8"/><circle cx="161" cy="28" r="8"/><circle cx="231" cy="32" r="8"/></g>`,

  // A lit idea beside a stack of coins.
  'eco-4eso': (c) => `${bg(c)}
    <circle cx="280" cy="110" r="64" fill="${c.deep}"/>
    <circle cx="160" cy="58" r="30" fill="${CREAM}"/>
    <rect x="148" y="88" width="24" height="16" fill="${c.soft}"/>
    <rect x="152" y="104" width="16" height="6" fill="#2A1F18" opacity=".5"/>
    <g stroke="${CREAM}" stroke-width="3" stroke-linecap="round"><line x1="160" y1="12" x2="160" y2="20"/><line x1="112" y1="58" x2="104" y2="58"/><line x1="208" y1="58" x2="216" y2="58"/><line x1="126" y1="24" x2="120" y2="18"/><line x1="194" y1="24" x2="200" y2="18"/></g>
    <g fill="${c.soft}"><ellipse cx="70" cy="104" rx="22" ry="6"/><ellipse cx="70" cy="96" rx="22" ry="6"/><ellipse cx="70" cy="88" rx="22" ry="6"/></g>`,

  // Steps climbing to a flag, a figure at the bottom.
  'fopp-4eso': (c) => `${bg(c)}
    <circle cx="300" cy="10" r="70" fill="${c.deep}"/>
    <g fill="${c.soft}"><rect x="50" y="98" width="60" height="14"/><rect x="110" y="80" width="60" height="32"/><rect x="170" y="62" width="60" height="50"/><rect x="230" y="44" width="50" height="68"/></g>
    <rect x="254" y="16" width="3" height="28" fill="${CREAM}"/>
    <path d="M257 16 L280 23 L257 30Z" fill="${MUSTARD}"/>
    <circle cx="80" cy="84" r="8" fill="${CREAM}"/>
    <rect x="74" y="92" width="12" height="6" fill="${CREAM}"/>`,

  // Everyday economy: a shopping basket and its receipt.
  'taller-eco-3eso': (c) => `${bg(c)}
    <circle cx="30" cy="10" r="64" fill="${c.deep}"/>
    <path d="M80 58 A 40 34 0 0 1 160 58" fill="none" stroke="${CREAM}" stroke-width="5"/>
    <path d="M64 58 L176 58 L164 110 L76 110Z" fill="${c.soft}"/>
    <g fill="${c.base}"><rect x="92" y="70" width="8" height="30"/><rect x="116" y="70" width="8" height="30"/><rect x="140" y="70" width="8" height="30"/></g>
    <circle cx="96" cy="50" r="10" fill="${TERRA}"/><circle cx="118" cy="46" r="10" fill="${MUSTARD}"/>
    <path d="M206 20 L262 20 L262 106 L255 100 L248 106 L241 100 L234 106 L227 100 L220 106 L213 100 L206 106Z" fill="${CREAM}"/>
    <g stroke="${c.base}" stroke-width="2"><line x1="214" y1="34" x2="254" y2="34"/><line x1="214" y1="46" x2="244" y2="46"/><line x1="214" y1="58" x2="250" y2="58"/><line x1="214" y1="80" x2="254" y2="80" stroke-width="3"/></g>`,

  // A CV with a portrait, under a magnifying glass.
  'ipe1-fp': (c) => `${bg(c)}
    <circle cx="290" cy="120" r="70" fill="${c.deep}"/>
    <rect x="96" y="14" width="88" height="106" rx="3" fill="${CREAM}"/>
    <circle cx="120" cy="40" r="12" fill="${c.soft}"/><rect x="110" y="54" width="20" height="8" fill="${c.soft}"/>
    <g stroke="${c.base}" stroke-width="2"><line x1="142" y1="34" x2="172" y2="34"/><line x1="142" y1="44" x2="164" y2="44"/><line x1="108" y1="76" x2="172" y2="76"/><line x1="108" y1="86" x2="160" y2="86"/><line x1="108" y1="96" x2="168" y2="96"/></g>
    <circle cx="206" cy="78" r="26" fill="none" stroke="${MUSTARD}" stroke-width="7"/>
    <line x1="225" y1="97" x2="248" y2="120" stroke="${MUSTARD}" stroke-width="9" stroke-linecap="round"/>`,

  // A briefcase and the two speech bubbles of an interview.
  'ipe2-fp': (c) => `${bg(c)}
    <circle cx="20" cy="120" r="66" fill="${c.deep}"/>
    <rect x="70" y="56" width="100" height="58" rx="4" fill="${c.soft}"/>
    <path d="M102 56 L102 44 L138 44 L138 56" fill="none" stroke="${c.soft}" stroke-width="6"/>
    <rect x="70" y="76" width="100" height="6" fill="${c.base}"/>
    <rect x="113" y="72" width="14" height="14" fill="${MUSTARD}"/>
    <path d="M196 24 h72 a6 6 0 0 1 6 6 v26 a6 6 0 0 1 -6 6 h-50 l-14 12 v-12 h-8 a6 6 0 0 1 -6 -6 v-26 a6 6 0 0 1 6 -6Z" fill="${CREAM}"/>
    <path d="M222 74 h56 a6 6 0 0 1 6 6 v20 a6 6 0 0 1 -6 6 h-6 v10 l-12 -10 h-38 a6 6 0 0 1 -6 -6 v-20 a6 6 0 0 1 6 -6Z" fill="${MUSTARD}"/>
    <g fill="${c.base}"><circle cx="216" cy="43" r="4"/><circle cx="232" cy="43" r="4"/><circle cx="248" cy="43" r="4"/></g>`,

  // A factory with its output growing in a bar chart.
  'eeae-bach': (c) => `${bg(c)}
    <circle cx="290" cy="14" r="62" fill="${c.deep}"/>
    <path d="M50 110 L50 66 L80 50 L80 66 L110 50 L110 66 L140 50 L140 110Z" fill="${c.soft}"/>
    <rect x="118" y="24" width="14" height="34" fill="${c.soft}"/>
    <circle cx="130" cy="16" r="7" fill="${CREAM}" opacity=".8"/><circle cx="144" cy="10" r="5" fill="${CREAM}" opacity=".55"/>
    <g fill="${c.base}"><rect x="62" y="80" width="14" height="14"/><rect x="88" y="80" width="14" height="14"/><rect x="114" y="80" width="14" height="14"/></g>
    <line x1="176" y1="110" x2="280" y2="110" stroke="${CREAM}" stroke-width="2"/>
    <g fill="${CREAM}"><rect x="184" y="88" width="18" height="22"/><rect x="210" y="74" width="18" height="36"/><rect x="236" y="58" width="18" height="52"/></g>
    <rect x="262" y="36" width="18" height="74" fill="${MUSTARD}"/>`,

  // A project timeline (Gantt) with a ticked checklist.
  'gpe-bach': (c) => `${bg(c)}
    <circle cx="30" cy="124" r="62" fill="${c.deep}"/>
    <rect x="60" y="18" width="160" height="96" rx="3" fill="${CREAM}"/>
    <g stroke="${c.soft}" stroke-width="1.5"><line x1="100" y1="26" x2="100" y2="106"/><line x1="140" y1="26" x2="140" y2="106"/><line x1="180" y1="26" x2="180" y2="106"/></g>
    <rect x="70" y="32" width="56" height="12" rx="2" fill="${c.base}"/>
    <rect x="104" y="52" width="60" height="12" rx="2" fill="${MUSTARD}"/>
    <rect x="140" y="72" width="44" height="12" rx="2" fill="${c.base}"/>
    <rect x="170" y="92" width="40" height="12" rx="2" fill="${c.deep}"/>
    <g fill="${c.soft}"><rect x="240" y="30" width="16" height="16" rx="2"/><rect x="240" y="58" width="16" height="16" rx="2"/><rect x="240" y="86" width="16" height="16" rx="2"/></g>
    <g fill="none" stroke="${c.deep}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="243,38 247,42 254,33"/><polyline points="243,66 247,70 254,61"/></g>
    <g stroke="${c.soft}" stroke-width="3"><line x1="264" y1="38" x2="290" y2="38"/><line x1="264" y1="66" x2="286" y2="66"/><line x1="264" y1="94" x2="290" y2="94"/></g>`,

  // The scales of justice beside a ballot box.
  'cjd-bach': (c) => `${bg(c)}
    <circle cx="290" cy="120" r="66" fill="${c.deep}"/>
    <rect x="112" y="26" width="6" height="80" fill="${CREAM}"/>
    <rect x="92" y="104" width="46" height="8" rx="2" fill="${CREAM}"/>
    <rect x="60" y="30" width="110" height="5" fill="${CREAM}"/>
    <g stroke="${CREAM}" stroke-width="1.5"><line x1="66" y1="35" x2="56" y2="66"/><line x1="66" y1="35" x2="76" y2="66"/><line x1="164" y1="35" x2="154" y2="66"/><line x1="164" y1="35" x2="174" y2="66"/></g>
    <path d="M50 66 h32 a16 10 0 0 1 -32 0Z" fill="${MUSTARD}"/>
    <path d="M148 66 h32 a16 10 0 0 1 -32 0Z" fill="${MUSTARD}"/>
    <circle cx="115" cy="24" r="6" fill="${MUSTARD}"/>
    <rect x="212" y="58" width="68" height="54" rx="3" fill="${c.soft}"/>
    <rect x="232" y="56" width="28" height="5" fill="${c.base}"/>
    <rect x="236" y="26" width="20" height="34" fill="${CREAM}" transform="rotate(-8 246 43)"/>
    <polyline points="240,42 245,48 253,36" fill="none" stroke="${c.base}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" transform="rotate(-8 246 43)"/>`,
};

/** Inner SVG markup for a subject's cover, in its own colour tones. */
export function caratulaMarkup(a: Pick<Asignatura, 'slug' | 'color'>): string {
  return MOTIFS[a.slug](ACCENTS[a.color]);
}
