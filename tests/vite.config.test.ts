import { describe, it, expect } from 'vitest';
import config from '../vite.config';

import { resolve, dirname, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot: string = resolve(dirname(fileURLToPath(import.meta.url)), '..');

describe('vite.config', () => {
  it('exports a plain config object (not a function)', () => {
    expect(config).toBeDefined();
    expect(typeof config).toBe('object');
  });

  it('uses the demo directory as an absolute root', () => {
    expect(isAbsolute(config.root as string)).toBe(true);
    expect(config.root).toBe(resolve(projectRoot, 'demo'));
  });

  it('builds into dist at the project root and empties it first', () => {
    expect(config.build).toBeDefined();
    expect(config.build?.outDir).toBe(resolve(projectRoot, 'dist'));
    expect(config.build?.emptyOutDir).toBe(true);
  });
});