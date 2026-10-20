import { describe, it, expect } from 'vitest';
import { isBlobPdf, needsUpload } from './blob-pdfs.mjs';

describe('isBlobPdf', () => {
  it('accepts PDFs under the four served folders', () => {
    expect(isBlobPdf('downloads/eco-1bach-libro.pdf')).toBe(true);
    expect(isBlobPdf('slides/eco-4eso/01-intro.ca.pdf')).toBe(true);
    expect(isBlobPdf('ebau-examenes/madrid/2025-junio.pdf')).toBe(true);
    expect(isBlobPdf('olimpiada/simulacro-1.pdf')).toBe(true);
  });

  it('rejects non-PDFs and PDFs outside those folders', () => {
    expect(isBlobPdf('downloads/diario-molestias-eco-4eso.md')).toBe(false);
    expect(isBlobPdf('slides/eco-4eso/cover.webp')).toBe(false);
    expect(isBlobPdf('other/file.pdf')).toBe(false);
    expect(isBlobPdf('eco-1bach/downloads/x.pdf')).toBe(false);
  });

  it('normalizes Windows backslashes', () => {
    expect(isBlobPdf('slides\\eco-4eso\\01-intro.pdf')).toBe(true);
  });
});

describe('needsUpload', () => {
  const local = { size: 1000, mtimeMs: Date.parse('2026-10-20T10:00:00Z') };

  it('uploads when the blob does not exist', () => {
    expect(needsUpload(local, undefined)).toBe(true);
  });

  it('uploads when the size differs', () => {
    expect(needsUpload(local, { size: 999, uploadedAt: new Date('2026-10-21') })).toBe(true);
  });

  it('uploads when the local file is newer than the blob', () => {
    expect(needsUpload(local, { size: 1000, uploadedAt: new Date('2026-10-19') })).toBe(true);
  });

  it('skips when size matches and the blob is newer', () => {
    expect(needsUpload(local, { size: 1000, uploadedAt: new Date('2026-10-21') })).toBe(false);
  });
});
