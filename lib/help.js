// lib/help.js
export function showHelp(defaultOutput) {
  console.log(`
Usage: generate-context [command] [options]

Commands:
  init                  Creates the configuration template ("context-generator.config.json").

Options:
  -n, --name <filename> Specifies the output file name (default: "${defaultOutput}").
  --outDir <directory>  Specifies the output directory (default: "./" i.e., project root).
  -h, --help            Show this help message.

Examples:
  generate-context                       Generates context using the current configuration.
  generate-context --name my_context.txt
  generate-context --outDir output       Generates context in the "output" directory.
  generate-context init                  Creates the configuration template.
`);
}
