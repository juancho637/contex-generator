// lib/tree.js
import * as mm from 'minimatch';
import fs from 'fs';
import path from 'path';

/**
 * Comprueba si un nombre cumple con alguno de los patrones (wildcards).
 * @param {string} name - Nombre del archivo o directorio.
 * @param {string[]} patterns - Lista de patrones.
 * @returns {boolean}
 */
export function matchesPattern(name, patterns) {
  return patterns.some(pattern => mm.minimatch(name, pattern));
}

/**
 * Genera una representación en forma de "tree" del directorio.
 * @param {string} dir - Directorio a listar.
 * @param {object} config - Configuración con patrones de ignorar.
 * @param {string} prefix - Prefijo para la indentación.
 * @returns {string} Representación en árbol.
 */
export function generateTree(dir, config, prefix = '') {
  let treeStr = '';
  let items;
  try {
    items = fs.readdirSync(dir);
  } catch (err) {
    return treeStr;
  }
  // Filtrar elementos según los patrones de ignorar.
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
      // Ignorar errores de acceso.
    }
  });
  return treeStr;
}

/**
 * Obtiene recursivamente todos los archivos que no coincidan con los patrones de ignorar.
 * @param {string} dir - Directorio a recorrer.
 * @param {object} config - Configuración con patrones de exclusión.
 * @param {function} predicate - Función de filtrado para archivos.
 * @returns {string[]} Lista de rutas de archivos.
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
