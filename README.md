# projectory-cli

A simple CLI tool to generate a Markdown file containing the directory structure of a project.

I built this because I often need a quick visual representation of a project's layout for documentation or sharing, and I wanted a simple, configurable tool for my personal development workflow.

## Usage

To generate the tree structure of the current directory:
```bash
projectory
```

This will create a `projectory.md` file in the current directory.

### Options

- `-o, --output <file>`: Specify a different output file name.
- `-d, --directory <path>`: Scan a different directory.

## License

This project is licensed under the [GNU GPLv3 License](LICENSE).
