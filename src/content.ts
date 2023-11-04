import { readFileSync } from 'fs';
import { marked } from 'marked';
import { File } from './file';

const notBlank = (value: undefined | string): boolean => {
  return !!value;
};

export class Content {
  constructor(
    readonly basePath: string,
    readonly file: File,
  ) {}

  get id(): string {
    const elements = [
      this.file.relativePath(this.basePath),
      this.file.basename(),
    ];

    return elements.filter(notBlank).join('/');
  }

  render(): string {
    const raw = readFileSync(this.file.fullPath(), { encoding: 'utf-8' });
    return marked.parse(raw, { async: false }).trim();
  }
}
