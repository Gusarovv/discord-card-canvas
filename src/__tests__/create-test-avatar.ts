import { createCanvas } from 'canvas';

/**
 * Creates a simple Discord-style default avatar as a data: URL.
 * Works with loadImageSafe (passes isURL check and canvas loadImage).
 */
export function createTestAvatar(color = '#5865F2'): string {
  const size = 256;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);

  // Simple "user" silhouette
  ctx.fillStyle = '#FFFFFF';
  // Head
  ctx.beginPath();
  ctx.arc(size / 2, size * 0.35, size * 0.18, 0, Math.PI * 2);
  ctx.fill();
  // Body
  ctx.beginPath();
  ctx.arc(size / 2, size * 0.95, size * 0.35, Math.PI, 0);
  ctx.fill();

  return canvas.toDataURL('image/png');
}
