import { InfoCardBuilder } from '../../src/cards/info/info-card';
import { createTestBackground, createTestPhoto } from '../support/images';
import { describeVisual, toPng } from '../support/visual';

const background = createTestBackground(1000, 200);

describeVisual('InfoCardBuilder', () => {
  it('default: blue waves', async () => {
    const canvas = await new InfoCardBuilder({ mainText: { content: 'SERVER RULES' } }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('custom colors: orange waves', async () => {
    const canvas = await new InfoCardBuilder({
      backgroundColor: { background: '#FFF', waves: '#f48b2d' },
      mainText: { content: 'GAME NIGHT', color: '#B45309', weight: '700', size: 70 },
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('dark background without waves', async () => {
    const canvas = await new InfoCardBuilder({
      backgroundColor: { background: '#4d1821' },
      mainText: { content: 'LEADERBOARD', color: '#f0dbb9' },
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('background without text', async () => {
    const canvas = await new InfoCardBuilder({
      backgroundColor: { background: '#4d1821', waves: '#d24b5a' },
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('long text is truncated', async () => {
    const canvas = await new InfoCardBuilder({
      backgroundColor: { background: '#4d1821', waves: '#d24b5a' },
      mainText: {
        content:
          'Movie night moves to Saturday at nine, bring snacks and vote for the new film in #events',
        color: '#FFFFFF',
        size: 28,
      },
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('no params: completely default', async () => {
    const canvas = await new InfoCardBuilder().build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('empty text renders like no text', async () => {
    const emptyText = await new InfoCardBuilder({ mainText: { content: '' } }).build();
    const noText = await new InfoCardBuilder().build();
    expect(toPng(emptyText).equals(toPng(noText))).toBe(true);
  });

  it('background image with overlay 0.5', async () => {
    const canvas = await new InfoCardBuilder({
      backgroundImgURL: background,
      overlayOpacity: 0.5,
      mainText: { content: 'MOVIE NIGHT', color: '#FFFFFF' },
    }).build();
    expect(toPng(canvas)).toMatchImageSnapshot();
  });

  it('objectFit: cover crops a square photo', async () => {
    const canvas = await new InfoCardBuilder({
      backgroundImgURL: createTestPhoto(),
      mainText: { content: 'ANNOUNCEMENTS', color: '#FFFFFF' },
    }).build({ objectFit: 'cover' });
    expect(toPng(canvas)).toMatchImageSnapshot();
  });
});

describe('InfoCardBuilder setters', () => {
  it('match constructor params', async () => {
    const viaConstructor = await new InfoCardBuilder({
      backgroundColor: { background: '#1a1a2e', waves: '#e94560' },
      mainText: { content: 'ANNOUNCEMENTS', color: '#e94560' },
    }).build();
    const viaSetters = await new InfoCardBuilder()
      .setBackgroundColor({ background: '#1a1a2e', waves: '#e94560' })
      .setMainText({ content: 'ANNOUNCEMENTS', color: '#e94560' })
      .build();
    expect(toPng(viaSetters).equals(toPng(viaConstructor))).toBe(true);
  });

  it('match constructor params for the background image', async () => {
    const viaConstructor = await new InfoCardBuilder({
      backgroundImgURL: background,
      overlayOpacity: 0.7,
    }).build();
    const viaSetters = await new InfoCardBuilder()
      .setBackgroundImgURL(background)
      .setOverlayOpacity(0.7)
      .build();
    expect(toPng(viaSetters).equals(toPng(viaConstructor))).toBe(true);
  });
});

describe('InfoCardBuilder params', () => {
  it('keeps the caller text object intact when truncating', async () => {
    const content =
      'Movie night moves to Saturday at nine, bring snacks and vote for the next film in the poll';
    const mainText = { content };
    await new InfoCardBuilder({ mainText }).build();
    expect(mainText.content).toBe(content);
  });
});
