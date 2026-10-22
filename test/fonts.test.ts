import { createCanvas } from 'canvas';
import { describeVisual, fontFixtures } from './support/visual';

describeVisual('font fixtures', () => {
  it('every registered weight renders with its own metrics', () => {
    const ctx = createCanvas(10, 10).getContext('2d');
    const widths = fontFixtures.map(([, family, weight]) => {
      ctx.font = `${weight} 40px '${family}'`;
      return ctx.measureText('Discord Card 0123 Привет').width;
    });
    expect(new Set(widths).size).toBe(fontFixtures.length);
  });
});
