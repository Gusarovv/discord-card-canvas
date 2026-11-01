const graphemeSegmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

/** Shortens text longer than maxLength graphemes to maxLength, ending with "..." */
export function truncate(text: string, maxLength: number): string {
  const graphemes = Array.from(graphemeSegmenter.segment(text), ({ segment }) => segment);
  return graphemes.length > maxLength ? `${graphemes.slice(0, maxLength - 3).join('')}...` : text;
}
