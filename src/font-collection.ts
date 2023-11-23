import { Font } from './font';
import { File } from './file';

class FontMissingError extends Error {
  constructor(name: string) {
    super(`Font "${name}" not found`);
  }
}

class FontCollection {
  constructor(readonly path: string) {}

  embed(filename: string): string {
    const font = this.fonts().find((f) => f.filename == filename);

    if (!font) {
      throw new FontMissingError(filename);
    }

    return font.render();
  }

  private fonts(): Array<Font> {
    const files = File.ofType(this.path, ['ttf', 'woff', 'woff2']);
    return files.map((f) => new Font(f.fullPath()));
  }
}

export { FontCollection, FontMissingError };
