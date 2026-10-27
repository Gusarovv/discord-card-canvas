import { createCanvas, Image } from 'canvas';
import { clearImageCache, loadImageSafe, setImageLoader } from '../../src/utils/load-image';

const png = createCanvas(4, 4).toBuffer('image/png');
const url = 'https://cdn.example.test/avatar.png';

afterEach(() => {
  setImageLoader(null);
  vi.restoreAllMocks();
});

describe('loadImageSafe', () => {
  it('returns null and logs an invalid URL', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const loader = vi.fn(async () => png);
    setImageLoader(loader);
    expect(await loadImageSafe('not a url')).toBeNull();
    expect(consoleError).toHaveBeenCalledOnce();
    expect(loader).not.toHaveBeenCalled();
  });

  it('returns null and logs a failed load', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    setImageLoader(async () => {
      throw new Error('offline');
    });
    expect(await loadImageSafe(url)).toBeNull();
    expect(consoleError).toHaveBeenCalledOnce();
  });

  it('serves a repeated request from the cache', async () => {
    const loader = vi.fn(async () => png);
    setImageLoader(loader);
    const first = await loadImageSafe(url);
    expect(await loadImageSafe(url)).toBe(first);
    expect(loader).toHaveBeenCalledOnce();
  });

  it('loads concurrent requests for one URL once', async () => {
    const loader = vi.fn(async () => png);
    setImageLoader(loader);
    await Promise.all([loadImageSafe(url), loadImageSafe(url)]);
    expect(loader).toHaveBeenCalledOnce();
  });

  it('does not cache a failed load', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const loader = vi.fn().mockRejectedValueOnce(new Error('flaky')).mockResolvedValue(png);
    setImageLoader(loader);
    expect(await loadImageSafe(url)).toBeNull();
    expect(await loadImageSafe(url)).toBeInstanceOf(Image);
    expect(loader).toHaveBeenCalledTimes(2);
  });

  it('keeps 200 entries and evicts the oldest one', async () => {
    const loader = vi.fn(async () => png);
    setImageLoader(loader);
    for (let index = 0; index <= 200; index++) {
      await loadImageSafe(`https://cdn.example.test/${index}.png`);
    }
    loader.mockClear();

    await loadImageSafe('https://cdn.example.test/1.png');
    expect(loader).not.toHaveBeenCalled();
    await loadImageSafe('https://cdn.example.test/0.png');
    expect(loader).toHaveBeenCalledOnce();
  });
});

describe('loadImageSafe with Discord CDN URLs', () => {
  it.each([
    [
      'https://cdn.discordapp.com/avatars/1/abc.webp?size=256',
      'https://cdn.discordapp.com/avatars/1/abc.png?size=256',
    ],
    [
      'https://media.discordapp.net/avatars/1/abc.WEBP?size=256',
      'https://media.discordapp.net/avatars/1/abc.png?size=256',
    ],
  ])('requests %s as PNG', async (webpURL, pngURL) => {
    const loader = vi.fn(async () => png);
    setImageLoader(loader);
    await loadImageSafe(webpURL);
    expect(loader).toHaveBeenCalledWith(pngURL);
  });

  it.each([
    'https://cdn.discordapp.com/attachments/1/2/photo.webp',
    'https://example.test/avatars/1/abc.webp',
    'https://cdn.discordapp.com',
    'https://cdn.example.test/my avatar.png',
  ])('passes %s to the loader unchanged', async (sourceURL) => {
    const loader = vi.fn(async () => png);
    setImageLoader(loader);
    await loadImageSafe(sourceURL);
    expect(loader).toHaveBeenCalledWith(sourceURL);
  });
});

describe('setImageLoader', () => {
  it('accepts an Image from the loader', async () => {
    const image = new Image();
    image.src = png;
    setImageLoader(async () => image);
    expect(await loadImageSafe(url)).toBe(image);
  });

  it('falls back to the default loader when the custom one returns null', async () => {
    setImageLoader(async () => null);
    const dataUrl = `data:image/png;base64,${png.toString('base64')}`;
    expect(await loadImageSafe(dataUrl)).toBeInstanceOf(Image);
  });

  it('clears the cache when a new loader is set', async () => {
    setImageLoader(async () => png);
    await loadImageSafe(url);
    const next = vi.fn(async () => png);
    setImageLoader(next);
    await loadImageSafe(url);
    expect(next).toHaveBeenCalledOnce();
  });
});

describe('clearImageCache', () => {
  it('makes the next request load again', async () => {
    const loader = vi.fn(async () => png);
    setImageLoader(loader);
    await loadImageSafe(url);
    clearImageCache();
    await loadImageSafe(url);
    expect(loader).toHaveBeenCalledTimes(2);
  });
});
