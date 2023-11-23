import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { FontCollection, FontMissingError } from './font-collection';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import { join } from 'path';

describe(FontCollection.name, () => {
  let dir: string;

  beforeEach(() => {
    dir = join(tmpdir(), randomUUID());
    mkdirSync(dir);
  });

  afterEach(() => rmSync(dir, { recursive: true }));

  describe('embed()', () => {
    it('generates an embeddable font definition', () => {
      writeFileSync(join(dir, 'Cambria.ttf'), 'content');

      const collection = new FontCollection(dir);

      expect(collection.embed('Cambria.ttf')).toEqual(`
      @font-face {
        font-family: "Cambria";
        src: url(data:application/font-ttf;charset=utf-8;base64,Y29udGVudA==) format("truetype");
      }`);
    });

    it('throws an exception when the named font is not present', () => {
      const collection = new FontCollection(dir);

      expect(() => collection.embed('Cambria')).toThrow(FontMissingError);
    });
  });
});
