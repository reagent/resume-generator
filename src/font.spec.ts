import { tmpdir } from 'os';
import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { Font } from './font';
import { join } from 'path';
import { randomUUID } from 'crypto';

describe(Font.name, () => {
  let dir: string;

  beforeEach(() => {
    dir = join(tmpdir(), randomUUID());
    mkdirSync(dir);
  });

  afterEach(() => rmSync(dir, { recursive: true }));

  describe('name', () => {
    it('returns name', () => {
      const src = join(dir, 'Cambria.ttf');
      writeFileSync(src, '');

      const font = new Font(src);
      expect(font.name).toEqual('Cambria');
    });
  });

  describe('format', () => {
    it('returns `truetype` when given a file with a `.ttf` extension', () => {
      const src = join(dir, 'Cambria.ttf');
      writeFileSync(src, '');

      const font = new Font(src);
      expect(font.format).toEqual('truetype');
    });

    it('returns `woff` when given a fiel with a `.woff` extension', () => {
      const src = join(dir, 'Cambria.woff');
      writeFileSync(src, '');

      const font = new Font(src);
      expect(font.format).toEqual('woff');
    });

    it('returns `woff2` when given a file with a `.woff2` extension', () => {
      const src = join(dir, 'Cambria.woff2');
      writeFileSync(src, '');

      const font = new Font(src);
      expect(font.format).toEqual('woff2');
    });
  });

  describe('contentType', () => {
    it('returns `application/x-font-truetype` when given a file with a `.ttf` extension', () => {
      const src = join(dir, 'Cambria.ttf');
      writeFileSync(src, '');

      const font = new Font(src);
      expect(font.contentType).toEqual('application/font-ttf');
    });

    it('returns `application/font-woff` when given a file with a `.woff` extension', () => {
      const src = join(dir, 'Cambria.woff');
      writeFileSync(src, '');

      const font = new Font(src);
      expect(font.contentType).toEqual('application/font-woff');
    });

    it('returns `application/font-woff2` when given a file with a `.woff2` extension', () => {
      const src = join(dir, 'Cambria.woff2');
      writeFileSync(src, '');

      const font = new Font(src);
      expect(font.contentType).toEqual('application/font-woff2');
    });
  });

  describe('render', () => {
    it('renders', () => {
      const src = join(dir, 'Cambria.ttf');
      writeFileSync(src, 'content');

      const font = new Font(src);
      expect(font.render()).toEqual(`
      @font-face {
        font-family: "Cambria";
        src: url("${dir}/Cambria.ttf") format("truetype");
      }`);
    });
  });
});
