#!/usr/bin/env node

import { Command } from 'commander';
import { loginCommand } from './commands/login.js';
import { scanCommand } from './commands/scan.js';

const program = new Command();

program
  .name('codebuff')
  .description('Codebuff CLI — AI-powered code generation from the terminal')
  .version('0.1.0');

program
  .command('login')
  .description('Authenticate the CLI with your Codebuff account')
  .action(loginCommand);

program
  .command('scan')
  .description('Walk a directory and produce a file manifest')
  .argument('[path]', 'Directory to scan', '.')
  .option('-v, --verbose', 'Show detailed output including ignored files')
  .action(scanCommand);

program.parse();
