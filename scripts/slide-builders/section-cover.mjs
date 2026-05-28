export function renderSectionCover(heading) {
  return [
    '<!-- _class: section -->',
    '<!-- _paginate: false -->',
    '',
    `# *${heading}*`,
  ].join('\n');
}
