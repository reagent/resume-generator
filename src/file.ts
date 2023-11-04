import { readdirSync } from 'fs';
import { join, relative } from 'path';

type DotExtension = `.${string}`;

const normalizeExtensions = (types: string | string[]): Array<DotExtension> => {
  const collection = Array.isArray(types) ? types : [types];
  return collection.map((t) => t.replace(/^\.?(\w+)$/, '.$1') as DotExtension);
};

const findFiles = (
  path: string,
  extensions: Array<DotExtension>,
): Array<File> => {
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) {
      return findFiles(join(path, entry.name), extensions);
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      return [new File(path, entry.name)];
    }

    return [];
  });
};

export class File {
  readonly path: string;
  readonly filename: string;

  static ofType(path: string, types: string | string[]): Array<File> {
    return findFiles(path, normalizeExtensions(types));
  }

  constructor(path: string, filename: string) {
    this.path = path;
    this.filename = filename;
  }

  relativePath(basePath: string): string {
    return relative(basePath, this.path);
  }

  fullPath(): string {
    return join(this.path, this.filename);
  }

  basename(): string {
    return this.filename.replace(/\.\w+$/, '');
  }
}
