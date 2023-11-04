import { Content } from './content';
import { File } from './file';

class ContentMissingError extends Error {
  constructor(id: string) {
    super(`Content not found for id: "${id}"`);
  }
}

class ContentCollection {
  constructor(readonly path: string) {}

  render(id: string): string {
    const content = this.files().find((f) => f.id === id);

    if (!content) {
      throw new ContentMissingError(id);
    }

    return content.render();
  }

  files(): Array<Content> {
    const files = File.ofType(this.path, 'md');

    return files.map((f) => new Content(this.path, f));
  }
}

export { ContentMissingError, ContentCollection };
