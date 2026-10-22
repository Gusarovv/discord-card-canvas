import path from 'node:path';
import { registerFont } from 'canvas';
import { loadFont, loadFonts } from '../../src/utils/load-font';

vi.mock('canvas', () => ({ registerFont: vi.fn() }));

beforeEach(() => {
  vi.mocked(registerFont).mockReset();
});

describe('loadFont', () => {
  it('skips a font that is already registered', () => {
    loadFont('/fonts/Once.ttf', { family: 'Once', weight: '700' });
    loadFont('/fonts/Once.ttf', { family: 'Once', weight: '700' });
    expect(registerFont).toHaveBeenCalledTimes(1);
  });

  it('registers the same file again for another weight', () => {
    loadFont('/fonts/Twice.ttf', { family: 'Twice', weight: '400' });
    loadFont('/fonts/Twice.ttf', { family: 'Twice', weight: '700' });
    expect(registerFont).toHaveBeenCalledTimes(2);
  });
});

describe('loadFonts', () => {
  it('resolves font paths against basePath', () => {
    loadFonts([{ path: 'Based.ttf', family: 'Based', weight: '600' }], '/fonts');
    expect(registerFont).toHaveBeenCalledWith(path.resolve('/fonts', 'Based.ttf'), {
      family: 'Based',
      weight: '600',
      style: undefined,
    });
  });

  it('keeps the path as is without basePath', () => {
    loadFonts([{ path: 'relative/Plain.ttf', family: 'Plain' }]);
    expect(registerFont).toHaveBeenCalledWith('relative/Plain.ttf', expect.anything());
  });

  it('logs a failed font and registers the rest', () => {
    vi.mocked(registerFont).mockImplementationOnce(() => {
      throw new Error('broken file');
    });
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    loadFonts([
      { path: '/fonts/Broken.ttf', family: 'Broken' },
      { path: '/fonts/Fine.ttf', family: 'Fine' },
    ]);

    expect(consoleError).toHaveBeenCalledOnce();
    expect(registerFont).toHaveBeenCalledTimes(2);
    consoleError.mockRestore();
  });
});
