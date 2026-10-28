import { hexToRgbA } from '../../src/utils/hex-rgba';

describe('hexToRgbA', () => {
  it('converts a 6-digit hex color', () => {
    expect(hexToRgbA('#0CA7FF')).toBe('rgba(12,167,255,1)');
  });

  it('expands a 3-digit hex color and applies opacity', () => {
    expect(hexToRgbA('#0af', 0.5)).toBe('rgba(0,170,255,0.5)');
  });

  it('accepts a 4-digit hex color and ignores its alpha', () => {
    expect(hexToRgbA('#0af8', 0.5)).toBe('rgba(0,170,255,0.5)');
  });

  it('accepts an 8-digit hex color and ignores its alpha', () => {
    expect(hexToRgbA('#0CA7FF80', 0.5)).toBe('rgba(12,167,255,0.5)');
  });

  it('accepts rgb with and without spaces', () => {
    expect(hexToRgbA('rgb(12, 167, 255)', 0.3)).toBe('rgba(12,167,255,0.3)');
    expect(hexToRgbA('rgb(12,167,255)')).toBe('rgba(12,167,255,1)');
  });

  it('accepts rgba and ignores its alpha', () => {
    expect(hexToRgbA('rgba(12, 167, 255, 0.4)', 0.7)).toBe('rgba(12,167,255,0.7)');
    expect(hexToRgbA('rgba(12, 167, 255, 1e-1)')).toBe('rgba(12,167,255,1)');
  });

  it('accepts rgb and rgba with a space after the blue value', () => {
    expect(hexToRgbA('rgb(12, 167, 255 )')).toBe('rgba(12,167,255,1)');
    expect(hexToRgbA('rgba(12, 167, 255 , 0.5)')).toBe('rgba(12,167,255,1)');
  });

  it('throws on a value that is not a supported color', () => {
    expect(() => hexToRgbA('not-a-color')).toThrow('Bad Hex');
    expect(() => hexToRgbA('#12345')).toThrow('Bad Hex');
  });

  it('names the value in the error', () => {
    expect(() => hexToRgbA('red')).toThrow(
      'Bad Hex: "red" is not a supported hex, rgb() or rgba() color',
    );
    expect(() => hexToRgbA('#fff"\nx')).toThrow('Bad Hex: "#fff\\"\\nx" is not');
  });
});
