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

/**
 * Creates a colorful test background image as a data: URL.
 * Used to test overlayOpacity — a solid color background
 * would make overlay changes hard to distinguish visually.
 */
export function createTestBackground(width: number, height: number): string {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#ff6b6b');
  gradient.addColorStop(0.5, '#feca57');
  gradient.addColorStop(1, '#48dbfb');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL('image/png');
}
