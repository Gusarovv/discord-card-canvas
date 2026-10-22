import 'vitest';

declare module 'vitest' {
  interface Matchers<R> {
    toMatchImageSnapshot(): R;
  }
}
