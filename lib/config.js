// lib/config.js
import fs from 'fs';
import path from 'path';

const CONFIG_FILENAME = 'context-generator.config.json';

const defaultConfig = {
  ignoreDirs: [".git", "node_modules", ".vscode", "dist"],
  ignoreFiles: ["package-lock.json", ".env"],
  outDir: "./" // Directorio de salida por defecto: raíz del proyecto.
};

/**
 * Lee la configuración desde el archivo de configuración en la raíz del proyecto,
 * o devuelve la configuración por defecto si no existe.
 * 
 * Se normaliza el valor de outDir para que, si se define con "./" al inicio,
 * se transforme en el nombre de la carpeta (por ejemplo, "./context" se convertirá en "context"),
 * y se agregue a la lista de directorios a ignorar.
 * Además, se añade el patrón "*.context-generator.txt" a la lista de archivos a ignorar,
 * para que los archivos generados previamente no se incluyan en el contexto.
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
  
  // Copiar los valores o usar los predeterminados.
  let config = {
    ignoreDirs: userConfig.ignoreDirs ? [...userConfig.ignoreDirs] : [...defaultConfig.ignoreDirs],
    ignoreFiles: userConfig.ignoreFiles ? [...userConfig.ignoreFiles] : [...defaultConfig.ignoreFiles],
    outDir: userConfig.outDir || defaultConfig.outDir
  };

  // Normalizar outDir: si comienza con "./", se remueve ese prefijo.
  if (config.outDir.startsWith("./")) {
    config.outDir = config.outDir.slice(2);
  }
  
  // Siempre ignorar el archivo de configuración.
  if (!config.ignoreFiles.includes(CONFIG_FILENAME)) {
    config.ignoreFiles.push(CONFIG_FILENAME);
  }
  
  // Agregar el patrón para ignorar archivos generados, siempre.
  if (!config.ignoreFiles.includes("*.context-generator.txt")) {
    config.ignoreFiles.push("*.context-generator.txt");
  }
  
  // Si se especifica un directorio de salida distinto a la raíz, agregarlo a la lista de directorios a ignorar.
  if (config.outDir !== "" && config.outDir !== ".") {
    if (!config.ignoreDirs.includes(config.outDir)) {
      config.ignoreDirs.push(config.outDir);
    }
  }
  
  return config;
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
