# Context Generator

**Context Generator** is a CLI tool designed to create a comprehensive context file for your project. The generated file contains both the directory structure and the contents of your project’s files. This is especially useful for providing context to AI tools like CodeGPT or GitHub Copilot, or for generating detailed project documentation.

## Features

- **Directory Tree Structure:**  
  Generates a tree view of your project's directory, excluding files and directories specified in the configuration.
- **File Contents:**  
  Concatenates the content of each file in your project. Each file is preceded by a header displaying its relative path (prefixed with `./`).
- **Custom Configuration:**  
  Customize the tool’s behavior with a configuration file (`context-generator.config.json`). This file allows you to define:

  - **ignoreDirs:** An array of directory patterns to ignore.
  - **ignoreFiles:** An array of file patterns to ignore (the pattern `*.context-generator.txt` is automatically added so that generated files are excluded).
  - **outDir:** The output directory for the generated context file.
    - If set to the project root (`"./"`), the tool automatically appends the suffix `.context-generator.txt` to the output file name.
    - If set to a custom folder (e.g., `"./context"`), the tool creates that folder (if it doesn't exist) and saves the generated file there. The specified directory is then ignored in subsequent runs.

- **Automatic Suffix Addition:**  
  When generating the context file in the project root, the tool automatically appends `.context-generator.txt` to the output file name, which helps differentiate generated files and simplifies excluding them via `.gitignore`.
- **Prevents Recursive Inclusion:**  
  Files matching the pattern `*.context-generator.txt` (i.e., files generated in previous runs) are always ignored, preventing the context file from growing exponentially.

## Installation

Install **Context Generator** as a development dependency in your project:

```bash
npm install --save-dev context-generator
```

## Add a Script in package.json

To simplify execution, add a script to your project's `package.json`:

```json
"scripts": {
  "generate-context": "generate-context"
}
```

Then, you can execute:

```bash
npm run generate-context
```

## Commands and Options

### Display Help

To see all available commands and options, run:

```bash
generate-context --help
```

This displays a help message summarizing the usage, available commands, and options.

### Initialize Configuration (`init`)

To create a configuration template (`context-generator.config.json`) in your project’s root, run:

```bash
npm run generate-context init
```

This command generates a configuration file with the following structure:

```json
{
  "ignoreDirs": [".git", "node_modules", ".vscode", "dist"],
  "ignoreFiles": ["package-lock.json", ".env", ".gitignore"],
  "outDir": "./"
}
```

#### Explanation of `context-generator.config.json`:

- **ignoreDirs:**  
  Specifies directories to be ignored during context generation.  
  _Example:_

  - `".git"` ignores the Git folder.
  - `"node_modules"` ignores dependency directories.
  - `".vscode"` and `"dist"` are optional but often ignored.

- **ignoreFiles:**  
  Specifies file names or patterns to ignore.  
  _Example:_

  - `"package-lock.json"` and `".env"` are typically excluded.  
    **Note:** The tool automatically adds the pattern `*.context-generator.txt` to ignore previously generated files.

- **outDir:**  
  Specifies the output directory for the generated context file.

  - If set to `"./"`, the file is generated in the root, and the tool appends `.context-generator.txt` to its name.
  - If set to a folder (e.g., `"./context"`), the tool creates the folder (if it doesn’t exist) and places the generated file there. The folder is automatically ignored to prevent recursion.

### Generate the Context File

To generate the context file using the current configuration:

```bash
npm run generate-context
```

This scans the project, creates a directory tree, and includes the content of each file, excluding ignored items.

### Using the `-n` Flag to Specify a Custom Output File Name

By default, the generated file is named `project.context-generator.txt`. You can specify a custom file name using the `-n` or `--name` flag:

```bash
npm run generate-context --name my_context
```

This option allows you to create multiple versions of the context file with different names.

## Command Summary

1.  **Help:**

```bash
npm run generate-context --help
```

2.  **Initialize Configuration:**

```bash
npm run generate-context init
```

3.  **Generate Context File (Default):**

```bash
npm run generate-context
```

4.  **Generate Context with a Custom File Name:**

```bash
npm run generate-context --name my_context
```

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open issues or submit pull requests on the [GitHub repository](https://github.com/juancho637/contexto-generator).

---

Happy coding!
