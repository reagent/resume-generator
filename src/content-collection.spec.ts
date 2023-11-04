import { tmpdir } from 'os';
import { ContentCollection } from './content-collection';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { mkdirSync, rmSync, writeFileSync } from 'fs';

describe(ContentCollection.name, () => {
  let dir: string;

  beforeEach(() => {
    dir = join(tmpdir(), randomUUID());
    mkdirSync(dir);
  });

  afterEach(() => rmSync(dir, { recursive: true }));

  describe('render()', () => {
    it('can render top-level Markdown content', () => {
      writeFileSync(join(dir, 'content.md'), '# Content');

      const collection = new ContentCollection(dir);
      expect(collection.render('content')).toEqual('<h1>Content</h1>');
    });

    it('can render Markdown content in a subdirectory', () => {
      const subDir = join(dir, 'subdir');
      mkdirSync(subDir, { recursive: true });

      writeFileSync(join(subDir, 'content.md'), '# Content');

      const collection = new ContentCollection(dir);
      expect(collection.render('subdir/content')).toEqual('<h1>Content</h1>');
    });
  });
});
