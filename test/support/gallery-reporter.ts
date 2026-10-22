import fs from 'node:fs';
import path from 'node:path';
import type { Reporter, TestModule } from 'vitest/node';

const snapshotsDir = path.resolve(__dirname, '../__image_snapshots__');
const diffDir = path.join(snapshotsDir, '__diff_output__');
const galleryFile = path.resolve(__dirname, '../.gallery/index.html');

const css = `
:root{color-scheme:dark;--bar:#2b2d31;--line:#404249;--muted:#b5bac1;--bad:#da373c;--ring:#949cf7}
html{scroll-padding-top:5rem}body{margin:0;background:#313338;color:#dbdee1;font:14px/1.5 system-ui}
header{position:sticky;top:0;z-index:1;display:flex;flex-wrap:wrap;align-items:center;gap:6px 16px;
  padding:10px 24px;background:var(--bar);box-shadow:0 1px 0 #1e1f22}time{margin-left:auto}
nav{display:flex;flex-wrap:wrap;gap:4px;scroll-target-group:auto}main{padding:0 24px 48px}
nav a{padding:2px 10px;border-radius:12px;color:inherit;text-decoration:none}small{font-weight:400}
nav a:is(:hover,:target-current){background:var(--line)}nav a.bad{background:var(--bad);color:#fff}
small,time,figcaption{color:var(--muted)}h2{font-size:18px;margin:32px 0 12px}h3{margin:24px 0 8px}
.grid{display:grid;gap:24px;grid-template-columns:repeat(auto-fill,minmax(min(100%,400px),1fr))}
.diff{display:grid;gap:16px;grid-template-columns:repeat(3,minmax(0,1fr))}figure{margin:0}
#failed{padding-left:16px;border-left:3px solid var(--bad)}img,figure a{display:block}
figcaption{margin-top:6px;text-wrap:pretty}img{width:100%}
a:focus-visible,figure a:hover{outline:2px solid var(--ring);outline-offset:2px}
.crop{overflow:hidden}.crop img{width:300%;transform:translateX(calc(var(--i) * -100% / 3))}
.flip:is(:hover,:focus-within) img{--i:2}.flip:is(:hover,:focus-within) span:first-child,
.flip:not(:hover,:focus-within) span+span{display:none}`;

/** Alt text and caption for each third of a diff image */
const thirds = [
  ['Baseline', '<span>Baseline <small>hover to flip</small></span><span>Received</span>'],
  ['Diff', 'Diff <small>red: changed, yellow: anti-aliasing</small>'],
  ['Received', 'Received'],
];
const snapshotIdPattern = /^(.+?)-test-ts-(?:(.+?-builder)-)?(.+)$/;

function listPng(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.png'))
    .sort();
}

const squash = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');
const escapeHtml = (text: string) => text.replace(/[&<>"]/g, (char) => `&#${char.charCodeAt(0)};`);

/** Renders a figure with a link to the full-size image */
function figure(file: string, caption: string, alt = caption, third?: number): string {
  const src = path.relative(path.dirname(galleryFile), file);
  const crop = third === undefined ? '' : ` class="crop" style="--i:${third}"`;
  const flip = third === 0 ? ' class="flip"' : '';
  const link = `<a href="${src}" target="_blank"${crop}><img src="${src}" alt="${alt}"></a>`;
  return `<figure${flip}>${link}<figcaption>${caption}</figcaption></figure>`;
}

/** Writes the gallery page with failed comparisons and all baselines */
export default class GalleryReporter implements Reporter {
  /** Full test names by squashed snapshot id */
  private titles = new Map<string, string>();

  onTestRunEnd(testModules: ReadonlyArray<TestModule>): void {
    for (const test of testModules.flatMap((testModule) => [...testModule.children.allTests()])) {
      this.titles.set(squash(path.basename(test.module.moduleId) + test.fullName), test.fullName);
    }
    const baselines = listPng(snapshotsDir);
    const diffs = listPng(diffDir).filter((name) => {
      const baselineFile = path.join(snapshotsDir, name.replace('-diff.png', '.png'));
      const baseline = fs.statSync(baselineFile, { throwIfNoEntry: false });
      return (
        baseline !== undefined && baseline.mtimeMs <= fs.statSync(path.join(diffDir, name)).mtimeMs
      );
    });
    const groups = [...Map.groupBy(baselines, (name) => this.parseName(name)[0])];

    const failed = diffs.map((name) => {
      const [block, title] = this.parseName(name);
      const panels = thirds.map(([alt, caption], third) =>
        figure(path.join(diffDir, name), caption, alt, third),
      );
      return `<h3>${block} &rsaquo; ${title}</h3><div class="diff">${panels.join('')}</div>`;
    });
    const sections = groups.map(([block, names]) => {
      const figures = names.map((name) =>
        figure(path.join(snapshotsDir, name), this.parseName(name)[1]),
      );
      return `<section id="${block}"><h2>${block} <small>${names.length}</small></h2>
<div class="grid">${figures.join('')}</div></section>`;
    });
    const links = groups.map(
      ([block, names]) => `<a href="#${block}">${block} <small>${names.length}</small></a>`,
    );
    if (diffs.length) {
      links.unshift(`<a class="bad" href="#failed">Failed ${diffs.length}</a>`);
      sections.unshift(`<section id="failed"><h2>Failed <small>${diffs.length}</small></h2>
${failed.join('')}</section>`);
    }

    fs.mkdirSync(path.dirname(galleryFile), { recursive: true });
    fs.writeFileSync(
      galleryFile,
      `<!doctype html><html lang="en"><meta charset="utf-8">
<title>${diffs.length ? `${diffs.length} failed - ` : ''}discord-card-canvas gallery</title>
<style>${css}</style><header><b>discord-card-canvas</b><small>${baselines.length} baselines</small>
<nav>${links.join('')}</nav><time>Updated ${new Date().toTimeString().slice(0, 8)}</time></header>
<main>${sections.join('\n')}</main>`,
    );
  }

  /** Splits a snapshot name into describe and title */
  private parseName(name: string): [string, string] {
    const id = name.replace(/-\d+-snap(-diff)?\.png$/, '');
    const [, file = id, block, words = ''] = snapshotIdPattern.exec(id) ?? [];
    const pascal = (block ?? file).replace(/(^|-)\w/g, (match) => match.slice(-1).toUpperCase());
    const fullName = this.titles.get(squash(id)) ?? `${pascal} > ${words.replaceAll('-', ' ')}`;
    const [describe = '', ...title] = fullName.split(' > ');
    return [escapeHtml(describe), escapeHtml(title.join(' > '))];
  }
}
