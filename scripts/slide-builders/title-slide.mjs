export function renderTitle(fm) {
  return [
    '<!-- _class: title -->',
    '<!-- _paginate: false -->',
    '',
    `<div class="kicker">Unidad ${fm.unidad}${fm.bloque ? ' · ' + fm.bloque : ''}</div>`,
    '',
    `# ${fm.title}`,
    '',
    fm.lema ? `<p>${String(fm.lema).replace(/\n/g, ' ').trim()}</p>` : '',
  ].filter(Boolean).join('\n');
}
