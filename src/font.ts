import { readFileSync } from 'fs';
import { basename, extname } from 'path';

type Format = 'truetype' | 'woff' | 'woff2';

type ContentType =
  | 'application/font-ttf'
  | 'application/font-woff'
  | 'application/font-woff2';

type ExtensionMapping = Record<
  string,
  { format: Format; contentType: ContentType }
>;

export class Font {
  private mapping: ExtensionMapping = {
    '.ttf': {
      format: 'truetype',
      contentType: 'application/font-ttf',
    },
    '.woff': {
      format: 'woff',
      contentType: 'application/font-woff',
    },
    '.woff2': {
      format: 'woff2',
      contentType: 'application/font-woff2',
    },
  };

  constructor(readonly path: string) {}

  get name(): string {
    return this.filename.replace(this.extension, '');
  }

  get format(): string {
    return this.mapping[this.extension].format;
  }

  get contentType(): string {
    return this.mapping[this.extension].contentType;
  }

  content(): string {
    return readFileSync(this.path).toString('base64');
  }

  render(): string {
    // prettier-ignore
    return `
      @font-face {
        font-family: "${this.name}";
        src: url(data:${this.contentType};charset=utf-8;base64,${this.content()}) format("${this.format}");
      }`;
  }

  private get filename(): string {
    return basename(this.path);
  }

  private get extension(): string {
    return extname(this.path);
  }
}
