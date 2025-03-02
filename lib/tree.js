// lib/tree.js
import * as mm from 'minimatch';
import fs from 'fs';
import path from 'path';

/**
 * Checks if a given name matches any of the specified wildcard patterns.
 * @param {string} name - The file or directory name.
 * @param {string[]} patterns - An array of wildcard patterns.
 * @returns {boolean}
 */
export function matchesPattern(name, patterns) {
  return patterns.some(pattern => mm.minimatch(name, pattern));
}

/**
 * Generates a tree-like representation of the directory.
 * @param {string} dir - The directory to list.
 * @param {object} config - The configuration with ignore patterns.
 * @param {string} prefix - The indentation prefix.
 * @returns {string} The directory tree as a string.
 */
export function generateTree(dir, config, prefix = '') {
  let treeStr = '';
  let items;
  try {
    items = fs.readdirSync(dir);
  } catch (err) {
    return treeStr;
  }
  // Filter items based on ignore patterns.
  items = items.filter(item => {
    if (matchesPattern(item, config.ignoreDirs)) return false;
    if (matchesPattern(item, config.ignoreFiles)) return false;
    return true;
  });
  
  items.forEach((item, index) => {
    const isLast = index === items.length - 1;
    const pointer = isLast ? '└── ' : '├── ';
    const fullPath = path.join(dir, item);
    treeStr += prefix + pointer + item + "\n";
    try {
      if (fs.statSync(fullPath).isDirectory()) {
        const newPrefix = prefix + (isLast ? '    ' : '│   ');
        treeStr += generateTree(fullPath, config, newPrefix);
      }
    } catch (err) {
      // Ignore access errors.
    }
  });
  return treeStr;
}

/**
 * Recursively retrieves all files that do not match the ignore patterns.
 * @param {string} dir - The directory to traverse.
 * @param {object} config - The configuration with ignore patterns.
 * @param {function} predicate - A filtering function.
 * @returns {string[]} An array of file paths.
 */
export function findFiles(dir, config, predicate) {
  let results = [];
  let list;
  try {
    list = fs.readdirSync(dir);
  } catch (err) {
    return results;
  }
  for (const file of list) {
    const fullPath = path.join(dir, file);
    let stat;
    try {
      stat = fs.statSync(fullPath);
    } catch (err) {
      continue;
    }
    if (stat.isDirectory()) {
      if (matchesPattern(file, config.ignoreDirs)) continue;
      results = results.concat(findFiles(fullPath, config, predicate));
    } else {
      if (matchesPattern(file, config.ignoreFiles)) continue;
      if (predicate(fullPath)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}
