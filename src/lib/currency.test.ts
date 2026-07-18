import { describe, expect, it } from 'vitest';
import { formatARS, formatProductPrice } from './currency';

describe('currency helpers', () => {
  it('formats positive amounts as Argentine pesos without decimals', () => {
    const result = formatARS(1234.6);

    expect(result).toContain('$');
    expect(result).toContain('1.235');
  });

  it('shows a clear message when a product has no confirmed price', () => {
    expect(formatProductPrice(0)).toBe('Consultar precio');
    expect(formatProductPrice(-1)).toBe('Consultar precio');
  });
});
