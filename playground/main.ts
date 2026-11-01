import './style.css';
import { cards, FONTS, WEIGHTS, type Card, type Field, type Params } from './cards';
import { fileName, fontFile, generateCode, highlight } from './code';
import { imageFromBlob, imageFromURL, type LoadedImage } from './images';
import subsets from '@fontsource-variable/montserrat/unicode.json';

const fontURLs: Record<string, string> = import.meta.glob(
  '../test/fonts/{Nunito,Inter}-{SemiBold,Bold,ExtraBold}.ttf',
  { query: '?url', import: 'default', eager: true },
);
const licenseURLs: Record<string, string> = import.meta.glob('../test/fonts/OFL-*.txt', {
  query: '?url',
  import: 'default',
  eager: true,
});
const fontsourceURLs: Record<string, string> = import.meta.glob(
  [
    '../node_modules/@fontsource-variable/*/files/*-{latin,cyrillic}-wght-normal.woff2',
    '../node_modules/@fontsource-variable/*/LICENSE',
  ],
  { query: '?url', import: 'default', eager: true },
);

interface ImageState {
  result: Promise<LoadedImage>;
  url: string;
  fromFile: boolean;
  loading?: boolean;
  failed?: boolean;
}

interface Form {
  card: Card;
  element: HTMLFormElement;
  inputs: Map<string, HTMLInputElement | HTMLSelectElement>;
  images: Map<string, ImageState>;
  syncs: (() => void)[];
}

const HEX = /^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;
const NO_IMAGE: ImageState = { result: Promise.resolve({}), url: '', fromFile: false };

const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const preview = $<HTMLDivElement>('#preview');
const status = $<HTMLParagraphElement>('#status');
const codeBlock = $<HTMLElement>('#code');
const presetList = $<HTMLDivElement>('#presets');
const announcer = $<HTMLSpanElement>('#announcer');

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> = {},
  ...children: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const element = Object.assign(document.createElement(tag), props);
  element.append(...children);
  return element;
}

const fieldsOf = (card: Card) => card.sections.flatMap(([, fields]) => fields);

function getPath(object: Params, path: string): unknown {
  return path.split('.').reduce<any>((value, key) => value?.[key], object);
}

function setPath(object: Params, path: string, value: unknown): void {
  const keys = path.split('.');
  const last = keys.pop()!;
  const parent = keys.reduce((target, key) => (target[key] ??= {}), object);
  parent[last] = value;
}

const fontsource = (family: string) =>
  `../node_modules/@fontsource-variable/${family.toLowerCase().replace(' ', '-')}`;

for (const family of FONTS) {
  if (family === 'Nunito' || family === 'Inter') {
    for (const weight of WEIGHTS) {
      const url = fontURLs[`../test/fonts/${fontFile(family, weight)}`];
      document.fonts.add(new FontFace(family, `url(${url})`, { weight }));
    }
    continue;
  }
  for (const subset of ['latin', 'cyrillic'] as const) {
    const file = `${fontsource(family)}/files/${family.toLowerCase().replace(' ', '-')}-${subset}-wght-normal.woff2`;
    const face = new FontFace(family, `url(${fontsourceURLs[file]})`, {
      weight: '100 900',
      unicodeRange: subsets[subset],
    });
    document.fonts.add(face);
  }
}

function uniquePairs(pairs: [string, string][]): [string, string][] {
  const keys = [...new Set(pairs.map((pair) => pair.join('|')))].sort();
  return keys.map((key) => key.split('|') as [string, string]);
}

function buildField(form: Form, field: Field): HTMLElement {
  const id = `${form.card.id}-${field.path}`;
  const label = el('label', { htmlFor: id, textContent: field.label });
  if (field.kind === 'select') {
    const input = el('select', { id });
    if (field.placeholder) input.append(el('option', { value: '', textContent: field.placeholder }));
    input.append(
      ...field.options!.map((option) => {
        const item = el('option', { value: option, textContent: option });
        if (field.options === FONTS) item.style.fontFamily = `'${option}'`;
        return item;
      }),
    );
    form.inputs.set(field.path, input);
    return el('div', { className: 'field' }, label, input);
  }
  if (field.kind === 'image') return buildImageField(form, field, id, label);

  const input = el('input', {
    id,
    type: field.kind === 'number' ? 'number' : 'text',
    placeholder: field.placeholder ?? '',
    required: field.kind === 'number' && Boolean(field.required),
  });
  form.inputs.set(field.path, input);
  if (field.kind !== 'color') {
    return el('div', { className: `field ${field.kind}` }, label, input);
  }
  const swatch = el('input', { type: 'color', tabIndex: -1 });
  swatch.setAttribute('aria-hidden', 'true');
  const sync = () => {
    if (field.inherits) {
      const source = form.inputs.get(field.inherits) as HTMLInputElement;
      input.placeholder = HEX.test(source.value) ? source.value : source.placeholder;
    }
    const value = HEX.test(input.value) ? input.value : input.placeholder;
    const hex = value.length < 7 ? value.replace(/[\da-f]/gi, '$&$&') : value;
    if (HEX.test(hex)) swatch.value = hex.slice(0, 7).toLowerCase();
    input.setAttribute('aria-invalid', String(input.value !== '' && !HEX.test(input.value)));
  };
  form.syncs.push(sync);
  swatch.addEventListener('input', () => {
    input.value = swatch.value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  return el('div', { className: 'field color' }, label, el('div', { className: 'row' }, swatch, input));
}

function buildImageField(form: Form, field: Field, id: string, label: HTMLLabelElement) {
  const input = el('input', { id, type: 'url', placeholder: 'https://' });
  const file = el('input', { type: 'file', accept: 'image/*' });
  file.setAttribute('aria-label', `Upload ${field.label.toLowerCase()} file`);
  const remove = el('button', { type: 'button', className: 'remove', textContent: '\u00d7', hidden: true });
  remove.setAttribute('aria-label', `Remove ${field.label.toLowerCase()}`);
  form.inputs.set(field.path, input);

  const use = (state: ImageState) => {
    form.images.set(field.path, state);
    remove.hidden = state === NO_IMAGE;
    input.removeAttribute('aria-invalid');
    state.loading = state !== NO_IMAGE;
    state.result.then((result) => {
      state.loading = false;
      state.failed = Boolean(result.error);
      if (form.images.get(field.path) !== state) return;
      input.setAttribute('aria-invalid', String(Boolean(result.error)));
    });
    render();
  };
  const applyURL = () => {
    const url = input.value.trim();
    const previous = form.images.get(field.path) ?? NO_IMAGE;
    if (url && url === previous.url && !previous.failed) return;
    input.placeholder = 'https://';
    use(url ? { result: imageFromURL(url), url, fromFile: false } : NO_IMAGE);
  };
  input.addEventListener('input', (event) => {
    if ((event as InputEvent).inputType?.startsWith('insertFrom')) applyURL();
  });
  input.addEventListener('change', applyURL);
  file.addEventListener('change', () => {
    const chosen = file.files?.[0];
    if (!chosen) return;
    input.value = '';
    input.placeholder = chosen.name;
    use({ result: imageFromBlob(chosen), url: '', fromFile: true });
    file.value = '';
  });
  remove.addEventListener('click', () => {
    input.value = '';
    input.placeholder = 'https://';
    use(NO_IMAGE);
  });
  return el(
    'div',
    { className: 'field image' },
    label,
    el(
      'div',
      { className: 'row' },
      input,
      el('label', { className: 'button' }, 'Upload', file),
      remove,
    ),
  );
}

function applyPreset(form: Form, params: Params): void {
  for (const field of fieldsOf(form.card)) {
    const input = form.inputs.get(field.path)!;
    const value = getPath(params, field.path);
    input.value = value === undefined ? '' : String(value);
    if (field.kind === 'image') input.dispatchEvent(new Event('change'));
  }
  form.syncs.forEach((sync) => sync());
  render();
}

function readForm(form: Form) {
  const params: Params = {};
  let objectFit: string | undefined;
  for (const field of fieldsOf(form.card)) {
    if (field.kind === 'image') continue;
    const raw = form.inputs.get(field.path)!.value;
    const valid = field.kind !== 'color' || HEX.test(raw);
    if ((raw === '' || !valid) && !field.required) continue;
    const value = field.kind === 'number' ? Number(raw) : raw;
    if (field.path === 'objectFit') objectFit = raw;
    else setPath(params, field.path, value);
  }
  for (const field of fieldsOf(form.card)) {
    const owner = field.path.replace(/\.content$/, '');
    if (owner !== field.path && getPath(params, owner) && getPath(params, field.path) === undefined) {
      setPath(params, field.path, field.placeholder ?? '');
    }
  }
  if (params.backgroundColor) {
    params.backgroundColor = { ...form.card.backgroundDefaults, ...params.backgroundColor };
  }
  return { params, objectFit, fonts: uniquePairs(form.card.fonts(params)) };
}

let current: Form;
let renderCount = 0;

async function render(): Promise<void> {
  const form = current;
  if (!form) return;
  const run = ++renderCount;
  const { params, objectFit, fonts: pairs } = readForm(form);
  const codeParams: Params = { ...params };
  const notes: Record<string, string> = {};
  const drawParams: Params = { ...params };
  const messages: string[] = [];
  let failed = false;
  const images = fieldsOf(form.card)
    .filter((field) => field.kind === 'image')
    .map((field) => [field, form.images.get(field.path) ?? NO_IMAGE] as const);
  for (const [field, state] of images) {
    if (state.fromFile) {
      codeParams[field.path] = `https://example.com/${field.path.replace('ImgURL', '')}.png`;
      notes[field.path] = 'Uploaded file: replace with your image URL';
    } else if (state.url || field.required) {
      codeParams[field.path] = state.url;
    }
  }
  highlight(codeBlock, generateCode(form.card, codeParams, objectFit, pairs, notes));
  if (images.some(([, state]) => state.loading)) showStatus('Loading image...');
  for (const [field, state] of images) {
    const { dataURL, error, warning } = await state.result;
    if (dataURL || field.required) drawParams[field.path] = dataURL ?? '';
    if (error || warning) messages.push(`${field.label}: ${error ?? warning}`);
    failed ||= Boolean(error);
  }
  try {
    await Promise.all(
      pairs.map(([family, weight]) => document.fonts.load(`${weight} 16px '${family}'`, 'A\u042f')),
    );
    const canvas = (await form.card
      .create(drawParams)
      .build(objectFit ? { objectFit: 'cover' } : undefined)) as HTMLCanvasElement;
    if (run !== renderCount) return;
    canvas.dataset.file = fileName(form.card);
    preview.replaceChildren(canvas);
    showStatus(messages.join(' '), failed ? 'error' : 'warning');
  } catch (error) {
    if (run !== renderCount) return;
    preview.replaceChildren();
    showStatus(error instanceof Error ? error.message : String(error), 'error');
  }
}

function showStatus(text: string, kind: '' | 'warning' | 'error' = ''): void {
  status.textContent = text;
  status.className = `status ${kind}`;
}

const forms = cards.map((card) => {
  const form: Form = { card, element: el('form'), inputs: new Map(), images: new Map(), syncs: [] };
  form.element.hidden = true;
  form.element.addEventListener('submit', (event) => event.preventDefault());
  form.element.addEventListener('input', () => {
    form.syncs.forEach((sync) => sync());
    render();
  });
  for (const [title, fields, collapsed] of card.sections) {
    form.element.append(
      el(
        'details',
        { open: !collapsed },
        el('summary', { textContent: title }),
        el('div', { className: 'fields' }, ...fields.map((field) => buildField(form, field))),
      ),
    );
  }
  $('#forms').append(form.element);
  return form;
});

function selectCard(form: Form): void {
  if (current) current.element.hidden = true;
  current = form;
  form.element.hidden = false;
  presetList.replaceChildren(
    ...form.card.presets.map((preset) => {
      const button = el('button', { type: 'button', className: 'chip', textContent: preset.name });
      button.addEventListener('click', () => applyPreset(form, preset.params));
      return button;
    }),
  );
  render();
}

$('#types').append(
  ...forms.map((form) => {
    const radio = el('input', { type: 'radio', name: 'card', value: form.card.id });
    radio.addEventListener('change', () => selectCard(form));
    if (form.card.id === 'levelUp') radio.checked = true;
    return el('label', {}, radio, el('span', { textContent: form.card.label }));
  }),
);

const flashTimers = new Map<HTMLButtonElement, ReturnType<typeof setTimeout>>();

function flash(button: HTMLButtonElement, text: string): void {
  button.dataset.label ??= button.textContent ?? '';
  button.textContent = text;
  announcer.textContent = text;
  clearTimeout(flashTimers.get(button));
  flashTimers.set(button, setTimeout(() => (button.textContent = button.dataset.label!), 1500));
}

$<HTMLButtonElement>('#download').addEventListener('click', (event) => {
  const canvas = preview.querySelector('canvas');
  if (!canvas) return;
  el('a', { href: canvas.toDataURL('image/png'), download: canvas.dataset.file }).click();
  flash(event.currentTarget as HTMLButtonElement, 'Downloaded');
});

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-copy]')) {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($(button.dataset.copy!).textContent ?? '');
      flash(button, 'Copied');
    } catch {
      flash(button, 'Copy failed');
    }
  });
}

$('#licenses').append(
  ...FONTS.flatMap((family, index) => [
    index ? ', ' : '',
    el('a', {
      textContent: family,
      href:
        licenseURLs[`../test/fonts/OFL-${family}.txt`] ?? fontsourceURLs[`${fontsource(family)}/LICENSE`],
    }),
  ]),
);

for (const form of forms) applyPreset(form, form.card.presets[0].params);
selectCard(forms.find((form) => form.card.id === 'levelUp')!);
