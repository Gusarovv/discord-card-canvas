import { Image, loadImage } from 'canvas';

export type ImageLoader = (url: string) => Promise<Buffer | Image | null>;

const MAX_CACHE_SIZE = 200;
const imageCache = new Map<string, Promise<Image>>();
let customLoader: ImageLoader | null = null;

function evictOldestIfFull(): void {
  if (imageCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = imageCache.keys().next().value;
    if (oldestKey !== undefined) {
      imageCache.delete(oldestKey);
    }
  }
}

async function resolveImage(url: string): Promise<Image> {
  if (customLoader) {
    const result = await customLoader(url);
    if (result === null || result === undefined) {
      return loadImage(url);
    }
    if (Buffer.isBuffer(result)) {
      return loadImage(result);
    }
    return result;
  }
  return loadImage(url);
}

async function loadCachedImage(url: string): Promise<Image> {
  const cached = imageCache.get(url);
  if (cached) {
    return cached;
  }

  evictOldestIfFull();

  const promise = resolveImage(url);
  promise.catch(() => imageCache.delete(url));
  imageCache.set(url, promise);
  return promise;
}

function isURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Registers a custom image loader, or pass `null` to revert to the default `loadImage` from `canvas`.
 *
 * The loader receives the URL and returns one of:
 * - `Buffer` — raw image bytes, decoded via `loadImage`.
 * - `Image` — already-decoded image, used as-is.
 * - `null` — delegate to the default loader (useful for selective loaders that handle only some URLs).
 *
 * Setting any loader (or `null`) automatically clears the in-memory cache to prevent
 * cross-loader contamination of cached entries.
 *
 * @example
 * setImageLoader(async (url) => {
 *   const cached = await myRedis.getBuffer(url);
 *   return cached ?? null;
 * });
 */
export function setImageLoader(loader: ImageLoader | null): void {
  customLoader = loader;
  imageCache.clear();
}

/**
 * Synchronously clears the in-memory image cache.
 *
 * Useful as an emergency lever in long-running processes — for instance, on a `SIGUSR1`
 * signal handler or when monitoring detects memory pressure.
 */
export function clearImageCache(): void {
  imageCache.clear();
}

export async function loadImageSafe(url: string): Promise<Image | null> {
  if (!isURL(url)) {
    console.error(`Invalid URL provided: ${url}`);
    return null;
  }

  try {
    const img = await loadCachedImage(url);
    return img;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to load image from ${url}: ${error.message}`);
    } else {
      console.error(`Failed to load image from ${url}: ${String(error)}`);
    }
    return null;
  }
}
