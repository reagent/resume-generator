#!/usr/bin/env node

import { join, resolve } from 'path';
import { copyFileSync, existsSync, mkdirSync, rmSync } from 'fs';

import { program } from 'commander';
import { File } from './file';
import { RenderContext } from './render-context';

import { ConfigurationFile } from './configuration-file';
import PDFMerger from 'pdf-merger-js';

program
  .command('init')
  .description('Initialize a directory to use as the source of a document')
  .argument('<path>')
  .action((relativePath) => {
    const path = resolve(relativePath);

    if (existsSync(path)) {
      console.error(`Path "${path}" exists, aborting.`);
      process.exit(1);
    }

    const assetsPath = join(path, 'assets');

    mkdirSync(join(assetsPath, 'images'), { recursive: true });
    mkdirSync(join(assetsPath, 'fonts'), { recursive: true });

    copyFileSync(
      join(__dirname, 'assets', 'icons.ttf'),
      join(path, 'assets', 'fonts', 'icons.ttf'),
    );

    mkdirSync(join(path, 'content'));

    copyFileSync(
      join(__dirname, 'assets', 'readme.md'),
      join(path, 'content', 'readme.md'),
    );

    mkdirSync(join(path, 'templates'));

    copyFileSync(
      join(__dirname, 'assets', 'resume.html.ejs'),
      join(path, 'templates', 'resume.html.ejs'),
    );

    ConfigurationFile.create(join(path, 'config.json'));
  });

program
  .command('generate')
  .description('Generate a PDF document from the content defined in the path')
  .argument('<path>')
  .action(async (relativePath) => {
    const path = resolve(relativePath);

    if (!existsSync(path)) {
      console.error(`Path "${path}" does not exist, aborting.`);
      process.exit(1);
    }

    const config = ConfigurationFile.read(join(path, 'config.json'));

    const contentPath = join(path, 'content');
    const fontPath = join(path, 'assets', 'fonts');
    const templatePath = join(path, 'templates');
    const outputPath = join(path, 'output');

    const allTemplates = File.ofType(join(path, 'templates'), '.html.ejs');

    const templates = allTemplates.filter((t) =>
      config.templates.includes(t.filename),
    );

    if (templates.length !== config.templates.length) {
      const templateNames = config.templates.join(', ');

      console.error(
        `Failed to find all configured templates: ${templateNames}`,
      );

      process.exit(1);
    }

    const context = new RenderContext({ contentPath, fontPath, templatePath });

    mkdirSync(outputPath, { recursive: true });

    const pages = [];
    const pdf = new PDFMerger();

    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      const basename = join(outputPath, template.basename());
      const filename = `${basename}.pdf`;

      const content = context.render(template.fullPath());

      await content.toPDF(filename, config.options);
      await pdf.add(filename);

      pages.push(filename);
    }

    await pdf.save(join(outputPath, config.filename));

    pages.forEach((p) => rmSync(p));
  });

program.parse();
