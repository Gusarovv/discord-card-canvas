import { hexToRgbA } from '../../src/utils/hex-rgba';

describe('hexToRgbA', () => {
  it('converts a 6-digit hex color', () => {
    expect(hexToRgbA('#0CA7FF')).toBe('rgba(12,167,255,1)');
  });

  it('expands a 3-digit hex color and applies opacity', () => {
    expect(hexToRgbA('#0af', 0.5)).toBe('rgba(0,170,255,0.5)');
  });

  it('throws on a value that is not a hex color', () => {
    expect(() => hexToRgbA('not-a-color')).toThrow('Bad Hex');
  });
});
