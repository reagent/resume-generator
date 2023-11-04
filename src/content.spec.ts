import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { mkdirSync, rmSync, writeFileSync } from 'fs';

import { Content } from './content';
import { File } from './file';

describe(Content.name, () => {
  let dir: string;

  beforeEach(() => {
    dir = join(tmpdir(), randomUUID());
    mkdirSync(dir);
  });

  afterEach(() => rmSync(dir, { recursive: true }));

  describe('id', () => {
    it('returns the filename without the extension', () => {
      const filename = 'content.md';
      writeFileSync(join(dir, filename), '# Content');

      const file = new File(dir, filename);

      const content = new Content(dir, file);
      expect(content.id).toEqual('content');
    });

    it('returns the relative path without the file extension', () => {
      const subdir = join(dir, 'experience');
      const filename = 'company-name.md';

      mkdirSync(subdir);
      writeFileSync(join(subdir, filename), '# Content');

      const file = new File(subdir, filename);
      const content = new Content(dir, file);

      expect(content.id).toEqual('experience/company-name');
    });
  });

  describe('render()', () => {
    it('renders the content of the file as HTML', () => {
      const filename = 'content.md';
      writeFileSync(join(dir, filename), '# Content');

      const file = new File(dir, filename);

      const content = new Content(dir, file);
      expect(content.render()).toEqual('<h1>Content</h1>');
    });
  });
});
