import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { InfoCardBuilder } from '../cards/info/info-card';

expect.extend({ toMatchImageSnapshot });

describe('InfoCardBuilder', () => {
  it('should create canvas with correct dimensions', async () => {
    const canvas = await new InfoCardBuilder().build();
    expect(canvas.width).toBe(1000);
    expect(canvas.height).toBe(200);
  });

  it('default — blue waves', async () => {
    const canvas = await new InfoCardBuilder({
      mainText: { content: 'INFORMATION' },
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('custom colors — orange waves', async () => {
    const canvas = await new InfoCardBuilder({
      backgroundColor: { background: '#FFF', waves: '#f48b2d' },
      mainText: { content: 'STATISTICS', color: '#f48b2d', weight: '700', size: 70 },
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('dark background — no waves', async () => {
    const canvas = await new InfoCardBuilder({
      backgroundColor: { background: '#0d1117' },
      mainText: { content: 'LEADERBOARD', color: '#58a6ff' },
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('no text — only background', async () => {
    const canvas = await new InfoCardBuilder({
      backgroundColor: { background: '#000', waves: '#0CA7FF' },
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('fluent API', async () => {
    const builder = new InfoCardBuilder();
    builder.setBackgroundColor({ background: '#1a1a2e', waves: '#e94560' });
    builder.setMainText({ content: 'ANNOUNCEMENTS', color: '#e94560' });
    const canvas = await builder.build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  // --- Edge cases ---

  it('very long text — should be truncated', async () => {
    const canvas = await new InfoCardBuilder({
      mainText: {
        content:
          'This Is An Extremely Long Info Card Text That Should Definitely Be Truncated At Some Point Because It Exceeds Limit',
      },
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('empty text', async () => {
    const canvas = await new InfoCardBuilder({
      mainText: { content: '' },
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('no params — completely default', async () => {
    const canvas = await new InfoCardBuilder().build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });
});
