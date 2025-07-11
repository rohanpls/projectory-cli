#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import ignore from 'ignore';

const program = new Command();

program
  .name('projectory')
  .version('0.1')
  .description('A simple CLI tool to generate a Markdown file containing the directory structure of a project.')
  .option('-o, --output <file>', 'output file name', 'projectory.md')
  .option('-d, --directory <path>', 'the directory to scan', '.')
  .action((options) => {
    const targetDirectory = path.resolve(options.directory);
    const outputFilePath = path.resolve(targetDirectory, options.output);

    const ig = ignore().add(['.git', 'node_modules', 'dist']);
    const gitignorePath = path.join(targetDirectory, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
      ig.add(gitignoreContent);
    }

    const generateTree = (dir: string, prefix: string): string => {
      let tree = '';
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      entries.sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name);
      });
      
      const filteredEntries = entries.filter(entry => {
        const relativePath = path.relative(targetDirectory, path.join(dir, entry.name));
        if (relativePath === '') return false;
        return !ig.ignores(relativePath);
      });

      filteredEntries.forEach((entry, index) => {
        const isLast = index === filteredEntries.length - 1;
        const connector = isLast ? '└── ' : '├── ';
        const entryPath = path.join(dir, entry.name);
        
        tree += `${prefix}${connector}${entry.name}\n`;

        if (entry.isDirectory()) {
          const newPrefix = prefix + (isLast ? '    ' : '│   ');
          tree += generateTree(entryPath, newPrefix);
        }
      });

      return tree;
    };

    try {
      const rootName = path.basename(targetDirectory);
      const treeContent = generateTree(targetDirectory, '');
      const markdownContent = '# projectory-cli\n\n---\n\n' + '```\n' + `${rootName}/\n` + treeContent + '```';

      fs.writeFileSync(outputFilePath, markdownContent);
      console.log(`Successfully generated project tree at: ${outputFilePath}`);
    } catch (error) {
      console.error('An error occurred while generating the project tree:', error);
    }
  });

program.parse(process.argv);
