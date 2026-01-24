import type { Command } from 'commander';
import { DocumentationLoader } from '../services/loader.js';
import { Searcher, ConstructType } from '../services/searcher.js';
import { Formatter } from '../services/formatter.js';

export function registerSearchCommand(program: Command): void {
  program
    .command('search')
    .description('Search for Angular components, services, directives, etc. (omit query to list all)')
    .argument('[query]', 'Search query (optional - omit to list all)')
    .option(
      '-t, --type <type>',
      'Filter by type (component, injectable, directive, pipe, module, class, all)',
      'all'
    )
    .option(
      '-p, --path <pattern>',
      'Filter by file path pattern (supports wildcards like apps/web/**)'
    )
    .option(
      '-l, --limit <number>',
      'Limit number of results',
      '50'
    )
    .action(async (query: string | undefined, options: { type: string; path?: string; limit: string }, command: Command) => {
      const docPath = command.parent?.opts().docPath || './documentation.json';
      try {
        // Validate type option
        const validTypes = [
          'component',
          'injectable',
          'directive',
          'pipe',
          'module',
          'class',
          'all',
        ];
        if (!validTypes.includes(options.type)) {
          console.error(
            `Invalid type: ${options.type}. Valid types: ${validTypes.join(', ')}`
          );
          process.exit(1);
        }

        // Load documentation
        const loader = new DocumentationLoader(docPath);
        const data = await loader.load();

        // Search or list
        const searcher = new Searcher(data);
        const limit = parseInt(options.limit, 10);

        let results;
        if (query) {
          // Search with query
          results = searcher.search(query, options.type as ConstructType, options.path, limit);
        } else {
          // List all (no query)
          results = searcher.listByType(options.type as ConstructType, options.path, limit);
        }

        // Format and display results
        const formatter = new Formatter();
        console.log(formatter.formatSearchResults(results));

        // Show count
        if (results.length > 0) {
          if (!query) {
            // When listing (no query), show total count
            const totalCount = searcher.getCountByType(options.type as ConstructType, options.path);
            if (results.length < totalCount) {
              console.log(`\nShowing ${results.length} of ${totalCount} result(s). Use --limit to show more.`);
            } else {
              console.log(`\nFound ${results.length} result(s)`);
            }
          } else {
            // When searching with query, just show count
            console.log(`\nFound ${results.length} result(s)`);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
        } else {
          console.error('An unexpected error occurred');
        }
        process.exit(1);
      }
    });
}
