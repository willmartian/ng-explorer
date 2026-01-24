import { readFile } from 'fs/promises';
import { resolve } from 'path';
import type { CompodocData } from '../types/compodoc.js';

/**
 * Loader service for Compodoc documentation.json
 * Implements caching to avoid re-reading the file on subsequent calls
 */
export class DocumentationLoader {
  private cache: CompodocData | null = null;
  private docPath: string;

  constructor(docPath: string = './documentation.json') {
    this.docPath = resolve(process.cwd(), docPath);
  }

  /**
   * Load the documentation.json file
   * Uses cache if available, otherwise reads from disk
   */
  async load(): Promise<CompodocData> {
    if (this.cache) {
      return this.cache;
    }

    try {
      const content = await readFile(this.docPath, 'utf-8');
      const data = JSON.parse(content) as CompodocData;
      this.cache = data;
      return data;
    } catch (error) {
      if (error instanceof Error) {
        if ('code' in error && error.code === 'ENOENT') {
          throw new Error(
            `Documentation file not found at: ${this.docPath}\n\n` +
              'Please run Compodoc to generate the documentation.json file:\n' +
              '  npx compodoc -p tsconfig.json -e json -d . --disablePrivate --disableProtected'
          );
        }
        if (error instanceof SyntaxError) {
          throw new Error(
            `Failed to parse documentation.json at: ${this.docPath}\n` +
              `The file may be corrupted. Error: ${error.message}`
          );
        }
        throw new Error(`Failed to load documentation: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Clear the cache, forcing a reload on next load() call
   */
  clearCache(): void {
    this.cache = null;
  }

  /**
   * Get the documentation path being used
   */
  getDocPath(): string {
    return this.docPath;
  }
}
