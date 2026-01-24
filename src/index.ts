#!/usr/bin/env node

import { Command } from 'commander';
import { readFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { DocumentationLoader } from './services/loader.js';
import { Searcher, ConstructType } from './services/searcher.js';
import { Formatter } from './services/formatter.js';

// Get package.json for version
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJsonPath = resolve(__dirname, '../package.json');

async function getVersion(): Promise<string> {
  try {
    const content = await readFile(packageJsonPath, 'utf-8');
    const pkg = JSON.parse(content);
    return pkg.version || '1.0.0';
  } catch {
    return '1.0.0';
  }
}

async function main() {
  const version = await getVersion();

  const program = new Command();

  program
    .name('ng-explorer')
    .description('Search and explore Angular components, services, directives, etc.')
    .version(version)
    .argument('[query]', 'Search query (optional - omit to list all)')
    .option(
      '-d, --doc-path <path>',
      'Path to documentation.json file',
      './documentation.json'
    )
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
    .option(
      '-v, --verbose',
      'Show full API details for each result'
    )
    .option(
      '-e, --exact',
      'Use exact name matching instead of fuzzy search'
    )
    .action(async (query: string | undefined, options: { docPath: string; type: string; path?: string; limit: string; verbose?: boolean; exact?: boolean }) => {
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
        const loader = new DocumentationLoader(options.docPath);
        const data = await loader.load();

        // Search or list
        const searcher = new Searcher(data);
        const limit = parseInt(options.limit, 10);

        let results;
        if (query) {
          // Search with query
          if (options.exact) {
            // Exact name matching
            results = searcher.searchExact(query, options.type as ConstructType, options.path, limit);
          } else {
            // Fuzzy search
            results = searcher.search(query, options.type as ConstructType, options.path, limit);
          }
        } else {
          // List all (no query)
          results = searcher.listByType(options.type as ConstructType, options.path, limit);
        }

        // Format and display results
        const formatter = new Formatter();
        if (options.verbose) {
          // Show full API details for each result
          results.forEach((result, index) => {
            if (index > 0) {
              console.log('\n' + '─'.repeat(80) + '\n');
            }
            console.log(formatter.formatApiDetails(result));
          });
        } else {
          // Show list view
          console.log(formatter.formatSearchResults(results));
        }

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

  // Parse and execute
  await program.parseAsync(process.argv);
}

main().catch((error) => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
