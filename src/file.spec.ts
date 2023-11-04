import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { mkdirSync, rmSync, writeFileSync } from 'fs';

import { File } from './file';

describe(File.name, () => {
  let dir: string;

  beforeEach(() => {
    dir = join(tmpdir(), randomUUID());
    mkdirSync(dir);
  });

  afterEach(() => rmSync(dir, { recursive: true }));

  describe('ofType()', () => {
    it('returns an empty array when there are no files in the directory', () => {
      expect(File.ofType(dir, 'md')).toHaveLength(0);
    });

    it('returns only files that match the extension provided', () => {
      writeFileSync(join(dir, 'valid.md'), '');
      writeFileSync(join(dir, 'invalid.txt'), '');

      const files = File.ofType(dir, 'md');

      expect(files).toHaveLength(1);

      const [file] = files;

      expect(file.filename).toEqual('valid.md');
      expect(file.path).toEqual(dir);
    });

    it('returns files that match any one of the specified extensions', () => {
      writeFileSync(join(dir, 'font.ttf'), '');
      writeFileSync(join(dir, 'font.woff'), '');

      const files = File.ofType(dir, ['woff', 'ttf']);

      expect(files).toHaveLength(2);

      const [first, second] = files;

      expect(first.filename).toEqual('font.ttf');
      expect(second.filename).toEqual('font.woff');
    });

    it('traverses a directory tree and returns all files', () => {
      writeFileSync(join(dir, 'parent.md'), '');

      const childDir = join(dir, 'child');
      mkdirSync(childDir);
      writeFileSync(join(childDir, 'child.md'), '');

      const files = File.ofType(dir, 'md');

      expect(files).toHaveLength(2);

      const [first, second] = files;

      expect(first.filename).toEqual('child.md');
      expect(first.path).toEqual(childDir);

      expect(second.filename).toEqual('parent.md');
      expect(second.path).toEqual(dir);
    });
  });

  describe('fullPath()', () => {
    it('returns the path and filename', () => {
      const file = new File('dir', 'filename.txt');
      expect(file.fullPath()).toEqual('dir/filename.txt');
    });
  });

  describe('relativePath()', () => {
    it('returns an empty string when the path and base path are the same', () => {
      const file = new File('dir', 'filename.txt');
      expect(file.relativePath('dir')).toEqual('');
    });

    it('returns the relative path based on a provided base path', () => {
      const file = new File('dir/subdir', 'filename.txt');
      expect(file.relativePath('dir')).toEqual('subdir');
    });
  });

  describe('basename()', () => {
    it('returns the filename without the extension', () => {
      const file = new File('', 'filename.txt');
      expect(file.basename()).toEqual('filename');
    });
  });
});
