export function renderSectionCover(heading) {
  return [
    '<!-- _class: section -->',
    '<!-- _paginate: false -->',
    '',
    `# <em>${heading}</em>`,
  ].join('\n');
}
