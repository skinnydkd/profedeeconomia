import { describe, it, expect } from 'vitest';
import { jsonLdToString } from './seo';

describe('jsonLdToString', () => {
  it('escapes < to avoid </script> injection', () => {
    const result = jsonLdToString({ name: '</script><script>alert(1)</script>' });
    expect(result).not.toContain('</script>');
    expect(result).toContain('\\u003c');
  });

  it('produces valid JSON after unescaping \\u003c', () => {
    const obj = { title: 'Economía <básica>', value: 42 };
    const str = jsonLdToString(obj);
    // The JSON parser understands < as < so round-trip is lossless.
    const parsed = JSON.parse(str);
    expect(parsed).toEqual(obj);
  });

  it('leaves regular content untouched', () => {
    const result = jsonLdToString({ name: 'profedeeconomia', type: 'Organization' });
    expect(result).toContain('profedeeconomia');
    expect(result).toContain('Organization');
  });
});
