// lib/config.js
import fs from 'fs';
import path from 'path';

const CONFIG_FILENAME = 'context-generator.config.json';

const defaultConfig = {
  ignoreDirs: ['.git', 'node_modules'],
  ignoreFiles: ['package-lock.json', '.env'],
  outDir: "./generated_contexts"  // Directorio de salida por defecto: raíz del proyecto.
};

/**
 * Lee la configuración desde el archivo de configuración en la raíz del proyecto,
 * o devuelve la configuración por defecto si no existe.
 */
export function readConfig() {
  const configPath = path.join(process.cwd(), CONFIG_FILENAME);
  let userConfig = {};
  if (fs.existsSync(configPath)) {
    try {
      userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {
      console.error("Error al parsear el archivo de configuración:", e);
    }
  }
  return {
    ignoreDirs: userConfig.ignoreDirs || defaultConfig.ignoreDirs,
    ignoreFiles: userConfig.ignoreFiles || defaultConfig.ignoreFiles,
    outDir: userConfig.outDir || defaultConfig.outDir
  };
}

/**
 * Crea el archivo de configuración plantilla en la raíz del proyecto.
 */
export function initConfig() {
  const configPath = path.join(process.cwd(), CONFIG_FILENAME);
  if (fs.existsSync(configPath)) {
    console.log(`El archivo "${CONFIG_FILENAME}" ya existe.`);
  } else {
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
    console.log(`Archivo de configuración "${CONFIG_FILENAME}" creado.`);
  }
}
