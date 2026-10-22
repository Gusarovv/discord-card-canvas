declare module 'jest-image-snapshot' {
  function configureToMatchImageSnapshot(options: {
    customSnapshotsDir?: string;
    runInProcess?: boolean;
  }): (this: unknown, received: Buffer) => { pass: boolean; message: () => string };
}
