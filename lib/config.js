// lib/config.js
import fs from 'fs';
import path from 'path';

const CONFIG_FILENAME = 'context-generator.config.json';

const defaultConfig = {
  ignoreDirs: [".git", "node_modules", ".vscode", "dist"],
  ignoreFiles: ["package-lock.json", ".env", ".gitignore"],
  outDir: "./" // Default output directory: project root.
};

/**
 * Reads the configuration from the configuration file in the project root,
 * or returns the default configuration if it does not exist.
 * 
 * The outDir value is normalized so that if it is defined with a "./" prefix,
 * it is converted to just the folder name (e.g., "./context" becomes "context")
 * and added to the ignoreDirs list.
 * Additionally, the "*.context-generator.txt" pattern is added to ignoreFiles
 * so that previously generated files are not included in the context.
 */
export function readConfig() {
  const configPath = path.join(process.cwd(), CONFIG_FILENAME);
  let userConfig = {};
  if (fs.existsSync(configPath)) {
    try {
      userConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {
      console.error("Error parsing configuration file:", e);
    }
  }
  
  // Copy values or use defaults.
  let config = {
    ignoreDirs: userConfig.ignoreDirs ? [...userConfig.ignoreDirs] : [...defaultConfig.ignoreDirs],
    ignoreFiles: userConfig.ignoreFiles ? [...userConfig.ignoreFiles] : [...defaultConfig.ignoreFiles],
    outDir: userConfig.outDir || defaultConfig.outDir
  };

  // Normalize outDir: if it starts with "./", remove that prefix.
  if (config.outDir.startsWith("./")) {
    config.outDir = config.outDir.slice(2);
  }
  
  // Always ignore the configuration file.
  if (!config.ignoreFiles.includes(CONFIG_FILENAME)) {
    config.ignoreFiles.push(CONFIG_FILENAME);
  }
  
  // Always add pattern to ignore generated context files.
  if (!config.ignoreFiles.includes("*.context-generator.txt")) {
    config.ignoreFiles.push("*.context-generator.txt");
  }
  
  // If a non-root output directory is specified, add it to ignoreDirs.
  if (config.outDir !== "" && config.outDir !== ".") {
    if (!config.ignoreDirs.includes(config.outDir)) {
      config.ignoreDirs.push(config.outDir);
    }
  }
  
  return config;
}

/**
 * Creates the configuration template file in the project root.
 */
export function initConfig() {
  const configPath = path.join(process.cwd(), CONFIG_FILENAME);
  if (fs.existsSync(configPath)) {
    console.log(`The file "${CONFIG_FILENAME}" already exists.`);
  } else {
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
    console.log(`Configuration template "${CONFIG_FILENAME}" created.`);
  }
}
