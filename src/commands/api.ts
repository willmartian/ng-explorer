import type { Command } from 'commander';
import { DocumentationLoader } from '../services/loader.js';
import { Searcher, ConstructType } from '../services/searcher.js';
import { Formatter } from '../services/formatter.js';

export function registerApiCommand(program: Command): void {
  program
    .command('api')
    .description('Display API details for a component, service, or other construct')
    .argument('<name>', 'Name of the construct')
    .option(
      '-t, --type <type>',
      'Filter by type (component, injectable, directive, pipe, module, class)',
      'all'
    )
    .action(async (name: string, options: { type: string }, command: Command) => {
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

        // Search for exact match
        const searcher = new Searcher(data);
        const construct = searcher.findByName(name, options.type as ConstructType);

        if (!construct) {
          console.error(`No construct found with name: ${name}`);

          // Try fuzzy search to suggest similar names
          const similar = searcher.search(name, options.type as ConstructType);
          if (similar.length > 0) {
            console.error('\nDid you mean one of these?');
            similar.slice(0, 5).forEach((s) => {
              console.error(`  • ${s.name} (${s.type})`);
            });
          }

          process.exit(1);
        }

        // Format and display API details
        const formatter = new Formatter();
        console.log(formatter.formatApiDetails(construct));
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
