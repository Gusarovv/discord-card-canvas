import type { Card, Params } from './cards';

const FONT_STYLES: Record<string, string> = { '600': 'SemiBold', '700': 'Bold', '800': 'ExtraBold' };

export const fileName = (card: Card) => `${card.label.toLowerCase().replace(' ', '-')}-card.png`;

export const fontFile = (family: string, weight: string) => `${family}-${FONT_STYLES[weight]}.ttf`;

const DOWNLOADED_PREFIXES: Record<string, string> = { Inter: 'Inter_18pt', 'Exo 2': 'Exo2' };

/** File name in the static folder of the Google Fonts download */
const downloadedFontFile = (family: string, weight: string) =>
  fontFile(DOWNLOADED_PREFIXES[family] ?? family, weight);

const quote = (value: string) =>
  `'${JSON.stringify(value).slice(1, -1).replace(/\\"/g, '"').replace(/'/g, "\\'")}'`;

function literal(value: unknown): string {
  if (typeof value === 'string') return quote(value);
  if (typeof value !== 'object' || value === null) return String(value);
  const entries = Object.entries(value).map(([key, item]) => `${key}: ${literal(item)}`);
  return `{ ${entries.join(', ')} }`;
}

export function generateCode(
  card: Card,
  params: Params,
  objectFit: string | undefined,
  fonts: [string, string][],
  notes: Record<string, string>,
): string {
  const lines = [
    `import { ${fonts.length ? 'loadFonts, ' : ''}${card.builder} } from 'discord-card-canvas';`,
    '',
  ];
  if (fonts.length) {
    const families = [...new Set(fonts.map(([family]) => family))];
    lines.push(
      '// Copy these files from the static folder of the Google Fonts download into ./fonts:',
      ...families.map((family) => `// https://fonts.google.com/specimen/${family.replace(' ', '+')}`),
      'loadFonts(',
      '  [',
      ...fonts.map(
        ([family, weight]) =>
          `    { path: '${downloadedFontFile(family, weight)}', family: '${family}', weight: '${weight}' },`,
      ),
      '  ],',
      "  './fonts',",
      ');',
      '',
    );
  }
  lines.push(`const card = await new ${card.builder}({`);
  for (const [key, value] of Object.entries(params)) {
    lines.push(`  ${key}: ${literal(value)},${notes[key] ? ` // ${notes[key]}` : ''}`);
  }
  lines.push(
    `}).build(${objectFit ? `{ objectFit: '${objectFit}' }` : ''});`,
    '',
    `// Send it with discord.js: new AttachmentBuilder(card.toBuffer(), { name: '${fileName(card)}' })`,
  );
  return lines.join('\n');
}

const TOKENS =
  /(\/\/.*)|('(?:\\.|[^'\\])*')|\b(import|from|const|await|new)\b|\b(\d+(?:\.\d+)?)\b/g;
const TOKEN_CLASSES = ['comment', 'string', 'keyword', 'number'];

export function highlight(target: HTMLElement, code: string): void {
  const nodes: Node[] = [];
  let last = 0;
  for (const match of code.matchAll(TOKENS)) {
    nodes.push(document.createTextNode(code.slice(last, match.index)));
    const span = document.createElement('span');
    span.className = TOKEN_CLASSES[match.slice(1).findIndex(Boolean)];
    span.textContent = match[0];
    nodes.push(span);
    last = match.index + match[0].length;
  }
  nodes.push(document.createTextNode(code.slice(last)));
  target.replaceChildren(...nodes);
}
