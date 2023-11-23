import { readFileSync, writeFileSync } from 'fs';
import { Configuration } from './types';

const DEFAULT: Configuration = {
  filename: 'resume.pdf',
  templates: ['resume.html.ejs'],
  options: {
    margins: {
      top: '0.25in',
      bottom: '0.25in',
      left: '0.25in',
      right: '0.25in',
    },
  },
};

export class ConfigurationFile {
  static create(path: string): void {
    writeFileSync(path, JSON.stringify(DEFAULT, null, 2));
  }

  static read(path: string): Configuration {
    const raw = readFileSync(path, { encoding: 'utf-8' });
    return JSON.parse(raw);
  }
}
