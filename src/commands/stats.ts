import type { Command } from 'commander';
import chalk from 'chalk';
import { DocumentationLoader } from '../services/loader.js';
import { Searcher } from '../services/searcher.js';

export function registerStatsCommand(program: Command): void {
  program
    .command('stats')
    .description('Show statistics about the Angular codebase')
    .action(async function (this: Command) {
      const docPath = this.parent?.opts().docPath || './documentation.json';
      try {
        // Load documentation
        const loader = new DocumentationLoader(docPath);
        const data = await loader.load();

        // Get stats
        const searcher = new Searcher(data);
        const stats = searcher.getStats();

        // Display stats
        console.log(chalk.bold.cyan('\nAngular Codebase Statistics'));
        console.log(chalk.gray('─'.repeat(40)));
        console.log(`${chalk.blue('Components:')}     ${chalk.green(stats.components)}`);
        console.log(`${chalk.magenta('Injectables:')}    ${chalk.green(stats.injectables)}`);
        console.log(`${chalk.cyan('Directives:')}     ${chalk.green(stats.directives)}`);
        console.log(`${chalk.yellow('Pipes:')}          ${chalk.green(stats.pipes)}`);
        console.log(`${chalk.green('Modules:')}        ${chalk.green(stats.modules)}`);
        console.log(`${chalk.white('Classes:')}        ${chalk.green(stats.classes)}`);
        console.log(chalk.gray('─'.repeat(40)));
        console.log(`${chalk.bold('Total:')}          ${chalk.bold.green(stats.total)}`);
        console.log('');
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
