export function renderTitle(fm) {
  const lines = [
    '<!-- _class: title -->',
    '<!-- _paginate: false -->',
    '',
    `<div class="kicker">Unidad ${fm.unidad}${fm.bloque ? ' · ' + fm.bloque : ''}</div>`,
    '',
    `# ${fm.title}`,
  ];
  if (fm.lema) {
    lines.push('', `<p>${String(fm.lema).replace(/\n/g, ' ').trim()}</p>`);
  }
  return lines.join('\n');
}
