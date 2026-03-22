import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { RankCardBuilder } from '../cards/rating/rank/rank-card';
import { createTestAvatar } from './create-test-avatar';

expect.extend({ toMatchImageSnapshot });

// Discord default avatar colors
const avatarOrange = createTestAvatar('#f48b2d');
const avatarBlue = createTestAvatar('#5865F2');

// Orange theme from demo-canvas (Good_Hateful card)
const orangeParams = {
  currentLvl: 50,
  currentRank: 3,
  currentXP: 23478,
  requiredXP: 68195,
  nicknameText: { content: 'Good_Hateful' },
  userStatus: 'online' as const,
  avatarImgURL: avatarOrange,
  backgroundColor: { background: '#fff' as const, bubbles: '#f48b2d' as const },
  requiredXPColor: '#7F8381' as const,
  currentXPColor: '#f48b2d' as const,
  avatarBackgroundColor: '#fbbf60' as const,
  colorTextDefault: '#f48b2d' as const,
  progressBarColor: '#f48b2d' as const,
};

// Blue theme from demo-canvas (ChampionX card)
const blueParams = {
  currentLvl: 25,
  currentRank: 1,
  currentXP: 5000,
  requiredXP: 10000,
  nicknameText: { content: 'ChampionX', color: '#0CA7FF' as const, size: 42, weight: '700' },
  userStatus: 'online' as const,
  avatarImgURL: avatarBlue,
  backgroundColor: { background: '#000' as const, bubbles: '#0CA7FF' as const },
  colorTextDefault: '#0CA7FF' as const,
  progressBarColor: '#0CA7FF' as const,
  avatarBackgroundColor: '#0CA7FF' as const,
};

describe('RankCardBuilder', () => {
  it('should create canvas with correct dimensions', async () => {
    const canvas = await new RankCardBuilder(orangeParams).build();
    expect(canvas.width).toBe(1000);
    expect(canvas.height).toBe(250);
  });

  // --- Orange theme ---

  it('orange — default (circle, status, bubbles)', async () => {
    const canvas = await new RankCardBuilder(orangeParams).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('orange — bubblesEnable: false', async () => {
    const canvas = await new RankCardBuilder({
      ...orangeParams,
      bubblesEnable: false,
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('orange — userStatusEnable: false', async () => {
    const canvas = await new RankCardBuilder({
      ...orangeParams,
      userStatusEnable: false,
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('orange — avatarShape: square', async () => {
    const canvas = await new RankCardBuilder({
      ...orangeParams,
      avatarShape: 'square',
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('orange — square + no status + no bubbles', async () => {
    const canvas = await new RankCardBuilder({
      ...orangeParams,
      avatarShape: 'square',
      userStatusEnable: false,
      bubblesEnable: false,
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  // --- Blue theme ---

  it('blue — default (circle, status, bubbles)', async () => {
    const canvas = await new RankCardBuilder(blueParams).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('blue — bubblesEnable: false', async () => {
    const canvas = await new RankCardBuilder({
      ...blueParams,
      bubblesEnable: false,
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('blue — avatarShape: square + no status', async () => {
    const canvas = await new RankCardBuilder({
      ...blueParams,
      avatarShape: 'square',
      userStatusEnable: false,
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  // --- Other options ---

  it('avatarBackgroundEnable: false', async () => {
    const canvas = await new RankCardBuilder({
      ...orangeParams,
      avatarBackgroundEnable: false,
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('no bubbles color in backgroundColor', async () => {
    const canvas = await new RankCardBuilder({
      ...blueParams,
      backgroundColor: { background: '#000' as const },
    }).build();
    expect(canvas.toBuffer()).toMatchImageSnapshot();
  });

  it('all statuses render correctly', async () => {
    const statuses = ['online', 'idle', 'dnd', 'offline', 'invisible', 'streaming'] as const;
    for (const status of statuses) {
      const canvas = await new RankCardBuilder({
        ...blueParams,
        userStatus: status,
      }).build();
      expect(canvas.toBuffer()).toMatchImageSnapshot({
        customSnapshotIdentifier: `status-${status}`,
      });
    }
  });

  it('setters work via fluent API', async () => {
    const builder = new RankCardBuilder(orangeParams);
    builder.setAvatarShape('square');
    builder.setUserStatusEnable(false);
    builder.setBubblesEnable(false);
    const canvas = await builder.build();
    expect(canvas.toBuffer()).toMatchImageSnapshot({
      customSnapshotIdentifier: 'fluent-api-square-no-status-no-bubbles',
    });
  });
});
