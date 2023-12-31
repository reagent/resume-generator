import { tmpdir } from 'os';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { readFileSync, rmSync, writeFileSync } from 'fs';

import ejs from 'ejs';
import puppeteer from 'puppeteer';

import { ContentCollection } from './content-collection';
import { FontCollection } from './font-collection';
import { PDFOutputOptions } from './types';

type RenderOptions = {
  contentPath: string;
  fontPath: string;
  templatePath: string;
};

class Target {
  constructor(readonly content: string) {}

  toHTML(path: string): void {
    writeFileSync(path, this.content);
  }

  async toPDF(path: string, options: PDFOutputOptions): Promise<void> {
    const htmlPath = join(tmpdir(), `${randomUUID()}.html`);
    this.toHTML(htmlPath);

    try {
      const browser = await puppeteer.launch({ headless: 'new' });
      const page = await browser.newPage();

      await page.goto(`file://${htmlPath}`);
      await page.pdf({ path, margin: options.margins });

      await browser.close();
    } finally {
      rmSync(htmlPath);
    }
  }
}

export class RenderContext {
  readonly contentPath: string;
  readonly fontPath: string;
  readonly templatePath: string;

  constructor(options: RenderOptions) {
    this.contentPath = options.contentPath;
    this.fontPath = options.fontPath;
    this.templatePath = options.templatePath;
  }

  get fonts(): FontCollection {
    return new FontCollection(this.fontPath);
  }

  get content(): ContentCollection {
    return new ContentCollection(this.contentPath);
  }

  render(templatePath: string): Target {
    const template = readFileSync(templatePath, { encoding: 'utf-8' });

    const content = ejs.render(
      template,
      {
        fonts: this.fonts,
        content: this.content,
      },
      {
        views: [this.templatePath],
      },
    );

    return new Target(content);
  }
}
