import Fuse from 'fuse.js';
import { minimatch } from 'minimatch';
import type { CompodocData, AngularConstruct } from '../types/compodoc.js';

export type ConstructType =
  | 'component'
  | 'injectable'
  | 'directive'
  | 'pipe'
  | 'module'
  | 'class'
  | 'all';

/**
 * Searcher service for finding Angular constructs in documentation
 */
export class Searcher {
  private allConstructs: AngularConstruct[] = [];
  private fuse: Fuse<AngularConstruct> | null = null;

  constructor(private data: CompodocData) {
    this.buildSearchIndex();
  }

  /**
   * Build search index from all constructs
   */
  private buildSearchIndex(): void {
    // Collect all constructs
    this.allConstructs = [
      ...(this.data.components || []),
      ...(this.data.injectables || []),
      ...(this.data.directives || []),
      ...(this.data.pipes || []),
      ...(this.data.modules || []),
      ...(this.data.classes || []),
    ];

    // Configure Fuse.js for fuzzy search
    this.fuse = new Fuse(this.allConstructs, {
      keys: [
        { name: 'name', weight: 2 },
        { name: 'description', weight: 1 },
        { name: 'file', weight: 0.5 },
        { name: 'selector', weight: 1.5 },
      ],
      threshold: 0.3,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }

  /**
   * Search for constructs by query string
   */
  search(query: string, type: ConstructType = 'all', pathPattern?: string, limit: number = 50): AngularConstruct[] {
    if (!this.fuse) {
      return [];
    }

    // Perform fuzzy search
    const results = this.fuse.search(query);

    // Extract items and filter by type
    let constructs = results.map((result) => result.item);

    if (type !== 'all') {
      constructs = constructs.filter((construct) => construct.type === type);
    }

    // Filter by path pattern if provided
    if (pathPattern) {
      constructs = this.filterByPath(constructs, pathPattern);
    }

    // Apply limit
    return constructs.slice(0, limit);
  }

  /**
   * Find a construct by exact name
   */
  findByName(name: string, type?: ConstructType): AngularConstruct | null {
    let constructs = this.allConstructs;

    if (type && type !== 'all') {
      constructs = constructs.filter((construct) => construct.type === type);
    }

    return (
      constructs.find(
        (construct) => construct.name.toLowerCase() === name.toLowerCase()
      ) || null
    );
  }

  /**
   * List all constructs of a specific type
   */
  listByType(type: ConstructType, pathPattern?: string, limit: number = 50): AngularConstruct[] {
    let constructs = type === 'all'
      ? this.allConstructs
      : this.allConstructs.filter((construct) => construct.type === type);

    // Filter by path pattern if provided
    if (pathPattern) {
      constructs = this.filterByPath(constructs, pathPattern);
    }

    // Apply limit
    return constructs.slice(0, limit);
  }

  /**
   * Get total count of constructs by type (before limit)
   */
  getCountByType(type: ConstructType, pathPattern?: string): number {
    let constructs = type === 'all'
      ? this.allConstructs
      : this.allConstructs.filter((construct) => construct.type === type);

    // Filter by path pattern if provided
    if (pathPattern) {
      constructs = this.filterByPath(constructs, pathPattern);
    }

    return constructs.length;
  }

  /**
   * Filter constructs by path pattern
   */
  private filterByPath(constructs: AngularConstruct[], pathPattern: string): AngularConstruct[] {
    return constructs.filter((construct) => {
      // Normalize path separators and remove leading ./
      const filePath = construct.file.replace(/^\.\//, '');
      return minimatch(filePath, pathPattern, { matchBase: true });
    });
  }

  /**
   * Get statistics about the documentation
   */
  getStats(): Record<string, number> {
    return {
      components: this.data.components?.length || 0,
      injectables: this.data.injectables?.length || 0,
      directives: this.data.directives?.length || 0,
      pipes: this.data.pipes?.length || 0,
      modules: this.data.modules?.length || 0,
      classes: this.data.classes?.length || 0,
      total: this.allConstructs.length,
    };
  }
}
