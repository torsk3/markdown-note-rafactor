# Markdown Note Refactor for VS Code

Markdown Note Refactor is a Visual Studio Code extension that aims to streamline the process of managing and organizing markdown files. This tool allows users to automatically split sections of a markdown file into separate files based on h2 headers and link them together for easy navigation. Inspired by the Obsidian community plugin [note-refactor-obsidian](https://github.com/lynchjames/note-refactor-obsidian), this extension brings similar functionality to VS Code, enhancing productivity for writers, developers, and note-takers working with markdown files.

## Features

- **Automated Section Splitting**: Splits the currently opened markdown file into sections based on h2 headers, each becoming its own separate file.
- **Dynamic File Generation**: Automatically generates new markdown files using the h2 header titles as filenames, placed in a specified directory.
- **Content Duplication**: Copies the text within the original file's sections into the corresponding new markdown files.
- **Link Creation**: Inserts wiki-style links in the original file that point to the newly created files, facilitating easy navigation between them.

## Getting Started

### Prerequisites

Ensure you have the following installed before you start using Markdown Note Refactor:

- Visual Studio Code

### Installation

To install Markdown Note Refactor:

#### From the VS Code Extensions Marketplace

1. Open Visual Studio Code.
1. Go to the Extensions view by clicking on the square icon on the sidebar or pressing *Ctrl+Shift+X*.
1. Search for "Markdown Note Refactor" and click on the install button.

#### From a VSIX File

1. Clone or download this repository.
1. In Visual Studio Code, open the Extensions view (*Ctrl+Shift+X*).
1. Click on the ... menu at the top-right corner and select *Install from VSIX....*
1. Locate and select the *.vsix* file that you downloaded or built.

### Usage

To use Markdown Note Refactor:

1. Open the markdown file you wish to refactor in VS Code.
1. Press *Ctrl+Shift+P* to open the Command Palette.
1. Type *Markdown Note Refactor: Refactor and Link Sections* and press Enter.

The extension will then process the current file, creating new markdown files for each h2 section and updating the original file with links to these new documents.

## Contributing

Your contributions make the open-source community a fantastic place for growth, inspiration, and creativity. If you have suggestions for improving Markdown Note Refactor, please fork the repo, create a pull request, or open an issue with the tag "enhancement". Contributions of all kinds are welcome!

## License

This project is licensed under the MIT License - see the *LICENSE* file for details.

## Acknowledgments

Special thanks to [note-refactor-obsidian](https://github.com/lynchjames/note-refactor-obsidian) for the inspiration behind this extension.
