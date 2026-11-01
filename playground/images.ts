export interface LoadedImage {
  dataURL?: string;
  error?: string;
  warning?: string;
}

const UNREACHABLE =
  "The browser can't load this image. The host doesn't send CORS headers or the address is unavailable. Your bot may still load it. To preview it here, download the image and upload the file.";
const INVALID_URL = 'Enter a full image URL, like https://example.com/avatar.png';

// Mirrors the .webp to .png rewrite in loadImageSafe
function discordPng(url: URL): string {
  if (
    ['cdn.discordapp.com', 'media.discordapp.net'].includes(url.hostname) &&
    !/^\/(attachments|ephemeral-attachments|external)\//.test(url.pathname)
  ) {
    url.pathname = url.pathname.replace(/\.webp$/i, '.png');
  }
  return url.href;
}

function sniffFormat(head: string): string | null {
  if (head.startsWith('RIFF') && head.slice(8, 12) === 'WEBP') return 'WebP';
  if (head.slice(4, 8) === 'ftyp' && /^avi[fs]$/.test(head.slice(8, 12))) return 'AVIF';
  return null;
}

function readAsDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function imageFromBlob(blob: Blob): Promise<LoadedImage> {
  let head: string;
  let dataURL: string;
  try {
    head = String.fromCharCode(...new Uint8Array(await blob.slice(0, 12).arrayBuffer()));
    dataURL = await readAsDataURL(blob);
  } catch {
    return { error: "Couldn't read this file." };
  }
  const image = new Image();
  image.src = dataURL;
  try {
    await image.decode();
  } catch {
    return { error: "This isn't an image the browser can draw." };
  }
  const format = sniffFormat(head);
  return {
    dataURL,
    warning: format
      ? `${format} works in browsers, but node-canvas in your bot can't decode it. Use PNG or JPEG.`
      : undefined,
  };
}

export async function imageFromURL(address: string): Promise<LoadedImage> {
  let url: URL;
  try {
    url = new URL(address);
  } catch {
    return { error: INVALID_URL };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return { error: INVALID_URL };
  try {
    const response = await fetch(discordPng(url));
    if (!response.ok) return { error: UNREACHABLE };
    return await imageFromBlob(await response.blob());
  } catch {
    return { error: UNREACHABLE };
  }
}
