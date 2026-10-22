import { rgbToHex } from '../../src/utils/rgb-hex';

describe('rgbToHex', () => {
  it('converts an rgb color', () => {
    expect(rgbToHex('rgb(12, 167, 255)')).toBe('#0ca7ff');
  });

  it('pads small channel values', () => {
    expect(rgbToHex('rgb(0,0,1)')).toBe('#000001');
  });

  it('throws on a value that is not an rgb color', () => {
    expect(() => rgbToHex('#fff')).toThrow('Bad Rgb');
  });
});
