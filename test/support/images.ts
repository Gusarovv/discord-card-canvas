import fs from 'node:fs';
import path from 'node:path';
import { createCanvas, Image } from 'canvas';

/** Background and raccoon colors per avatar theme */
const avatarColors = {
  blue: ['#e0f4ff', '#0ca7ff'],
  burgundy: ['#fcefe5', '#d24b5a'],
  orange: ['#ffeedd', '#f48b2d'],
  red: ['#fdecea', '#f44336'],
  rose: ['#ffe6eb', '#f26bac'],
} as const;

/** Draws a Raccoon Bot avatar as a data: URL */
export function createTestAvatar(theme: keyof typeof avatarColors): string {
  const [background, raccoon] = avatarColors[theme];
  const mask = new Image();
  mask.src = fs.readFileSync(path.join(__dirname, 'raccoon-mask.png'));
  const canvas = createCanvas(mask.width, mask.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(mask, 0, 0);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = raccoon;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
}

/** Draws a dusk landscape as a data: URL */
export function createTestBackground(width: number, height: number): string {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#5b4bdb');
  sky.addColorStop(0.45, '#a66cf0');
  sky.addColorStop(0.75, '#f584bd');
  sky.addColorStop(1, '#ffc085');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#ffe8cc';
  ctx.beginPath();
  ctx.arc(width * 0.75, height * 0.5, Math.min(width, height) * 0.13, 0, Math.PI * 2);
  ctx.fill();

  const ridges = [
    [0.6, 3, 1, '#c08ef5'],
    [0.72, 5, 2.4, '#8e5be6'],
    [0.86, 2, 4.1, '#5b2fc0'],
  ] as const;
  for (const [top, waves, phase, color] of ridges) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let step = 0; step <= 60; step++) {
      const t = step / 60;
      const y =
        top + 0.07 * Math.sin(t * waves * Math.PI + phase) + 0.015 * Math.sin(t * 23 + phase);
      ctx.lineTo(t * width, y * height);
    }
    ctx.lineTo(width, height);
    ctx.fill();
  }
  return canvas.toDataURL('image/png');
}

/** Draws a square night sea with an off-center moon as a data: URL */
export function createTestPhoto(): string {
  const size = 600;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const sky = ctx.createLinearGradient(0, 0, 0, size / 2);
  sky.addColorStop(0, '#0b1633');
  sky.addColorStop(1, '#2f4a7d');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, size, size / 2);
  ctx.fillStyle = '#10213f';
  ctx.fillRect(0, size / 2, size, size / 2);

  ctx.fillStyle = '#f1ead2';
  ctx.beginPath();
  ctx.arc(size * 0.3, size * 0.38, size * 0.07, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#26406d';
  for (let bar = 0; bar < 6; bar++) {
    const half = 16 + bar * 10;
    ctx.fillRect(size * 0.3 - half, size / 2 + 8 + bar * (12 + bar * 4), half * 2, 5 + bar);
  }
  return canvas.toDataURL('image/png');
}
