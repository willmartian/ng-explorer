#!/usr/bin/env node

import { Command } from 'commander';
import { readFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { registerSearchCommand } from './commands/search.js';
import { registerApiCommand } from './commands/api.js';
import { registerStatsCommand } from './commands/stats.js';

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
    .description('CLI tool to explore Angular components and services using Compodoc documentation')
    .version(version)
    .option(
      '-d, --doc-path <path>',
      'Path to documentation.json file',
      './documentation.json'
    );

  // Register commands - they will access docPath from parent options
  registerSearchCommand(program);
  registerApiCommand(program);
  registerStatsCommand(program);

  // Show help if no command provided
  if (process.argv.length <= 2) {
    program.help();
  }

  // Parse and execute
  await program.parseAsync(process.argv);
}

main().catch((error) => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
