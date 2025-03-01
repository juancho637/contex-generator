#!/usr/bin/env node
/**
 * Script to generate the project's context file.
 * 
 * Usage:
 *   generate-context [--name filename]        Generates the context.
 *   generate-context init                     Creates the configuration template.
 *   generate-context -h | --help              Shows this help message.
 */

// ======================================================
// Section 1: Imports and dependencies
// ======================================================
import minimist from 'minimist';
import fs from 'fs';
import path from 'path';
import { readConfig, initConfig } from '../lib/config.js';
import { generateTree, findFiles } from '../lib/tree.js';
import { showHelp } from '../lib/help.js';

// ======================================================
// Section 2: Process command-line arguments
// ======================================================
const args = minimist(process.argv.slice(2));
const command = args._[0];
const DEFAULT_OUTPUT = "context_project.txt";

// If a name is provided via -n or --name, append .txt if missing.
let rawOutput = args.n || args.name;
let outputFile = rawOutput
  ? (rawOutput.endsWith('.txt') ? rawOutput : rawOutput + '.txt')
  : DEFAULT_OUTPUT;

// Show help message if -h or --help flag is present.
if (args.h || args.help) {
  showHelp(DEFAULT_OUTPUT);
  process.exit(0);
}

// ======================================================
// Section 3: Command 'init' for configuration template
// ======================================================
if (command === 'init') {
  initConfig();
  process.exit(0);
}

// ======================================================
// Section 4: Read configuration
// ======================================================
const config = readConfig();

// ======================================================
// Section 5: Auxiliary function to write output in the specified directory
// ======================================================
function writeOutput(content) {
  // Determine the output directory.
  const outDir = config.outDir || "./";
  const fullOutDir = path.join(process.cwd(), outDir);
  // Create the directory if it doesn't exist.
  if (!fs.existsSync(fullOutDir)) {
    fs.mkdirSync(fullOutDir, { recursive: true });
  }
  // Combine the output directory with the output file name.
  const fullOutputPath = path.join(fullOutDir, outputFile);
  fs.writeFileSync(fullOutputPath, content, { encoding: 'utf8' });
}

// ======================================================
// Section 6: Main function to generate context
// ======================================================
function main() {
  let output = '';

  // 6.1: Directory tree structure.
  output += "### Directory and Files Structure ###\n";
  output += generateTree(process.cwd(), config);
  output += "\n";

  // 6.2: File contents.
  output += "\n### File Contents ###\n";
  const allFiles = findFiles(process.cwd(), config, () => true);
  const seen = new Set();
  allFiles.forEach(file => {
    // Avoid including the output file to prevent recursion.
    if (path.relative(process.cwd(), file) === outputFile) return;
    if (seen.has(file)) return;
    seen.add(file);

    // Get the relative path and prepend "./" to indicate the project root.
    const relPath = path.relative(process.cwd(), file);
    const displayPath = "./" + relPath;
    
    // Add header with the requested pattern.
    output += "\n================================================\n";
    output += "File: " + displayPath + "\n";
    output += "================================================\n";
    try {
      output += fs.readFileSync(file, 'utf8') + "\n";
    } catch (err) {
      output += `Error reading file: ${err.message}\n`;
    }
  });

  // Write the generated content to the output file.
  writeOutput(output);
  console.log(`File "${outputFile}" generated successfully in directory "${config.outDir}".`);
}

// ======================================================
// Section 7: Execute the script
// ======================================================
main();
