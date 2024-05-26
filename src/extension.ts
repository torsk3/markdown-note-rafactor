// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "markdown-note-refactor" is now active!'
  );

	const config = vscode.workspace.getConfiguration("markdown-note-refactor");

  // set noteDic type
  type noteDic = {
    [fileName: string]: string;
  };

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "markdown-note-refactor.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage(
        "Hello World from markdown_refactor!"
      );
    }
  );

  // make note
  let makeNote = function (newNoteDic: noteDic) {
    // get workspace folder
    let folders = vscode.workspace.workspaceFolders;
    // if no workspace folder, show error
    if (!folders) {
      vscode.window.showErrorMessage("No workspace folder opened");
      return;
    }

    // set from config
    let header = config.get<string>("insertHeader");
    // get workspace folder uri
    let folderUri = folders[0].uri;
		let directory = config.get<string>("makeNoteDir");
		if(directory){
			folderUri = vscode.Uri.joinPath(folderUri, directory);
		}
    // for each file name in newNoteDic
    // set file path, then write file
    Object.keys(newNoteDic).forEach((fileName) => {
			// set file path
      let filepath = vscode.Uri.joinPath(folderUri, fileName + ".md");
      let content = "";
			let blob: Uint8Array = new TextEncoder().encode(content);

      // If the file path does not exist, create the file with the initial content
      vscode.workspace.findFiles(`**/${fileName}.md`).then((files) => {
        // if file path not exist
        if (files.length === 0) {
          // set initial content
          content = `${header}# ${fileName}\n${newNoteDic[fileName]}`;
					blob = new TextEncoder().encode(content);
					vscode.workspace.fs.writeFile(filepath, blob);
					// show message Make a new Note
					vscode.window.showInformationMessage(`Make a new note ${fileName}`);
        } else {
          vscode.workspace.openTextDocument(filepath).then((doc) => {
            // get already content
            let alreadyContent = doc.getText();
            content = `${alreadyContent}\n${newNoteDic[fileName]}`;
						// write file
						blob = new TextEncoder().encode(content);
						vscode.workspace.fs.writeFile(filepath, blob);
						// show message Make a new Note
						vscode.window.showInformationMessage(`Add note ${fileName}`);
          });
        }
      });
    });
  };

  // read note
  let readNote = function (document: vscode.TextDocument) {
    // set lineCount from document line number
    let lineCount = document.lineCount;
    // define line header
		let header = "## ";
		let bigHeader = ["# "];

		let headerSize = config.get<number>("headerSize");
		if(headerSize){
			header = `${"#".repeat(headerSize)} `;
			// if ## -> bigHeader is #, ### -> #, ##
			for(let i = headerSize; i > 1; i--) {
				bigHeader.push(`${"#".repeat(headerSize - 1)} `);
			}
		}

    // define file name
    let fileName = "";
    // define newNoteDic
    const newNoteDic: noteDic = {};
    // read line by line, if line start with header
    for (let i = 0; i < lineCount; i++) {
      let line = document.lineAt(i);
      // if line start with header
      if (line.text.startsWith(header)) {
        // get file name from line text
        fileName = line.text.substring(header.length);
        // set newNoteDic init
        newNoteDic[fileName] = "";
      }

      // if fileName is not empty, copy text to fileName
      if (fileName !== "") {
        // set newNoteDic
        newNoteDic[fileName] = `${newNoteDic[fileName]}${line.text}\n`;
      }

      // if line start with bigHeader
      if (isStartsWith(line.text, bigHeader)) {
        // set fileName to empty
        fileName = "";
      }
    }
    console.log(newNoteDic);
    return newNoteDic;
  };

	// is start with headers
	function isStartsWith(text: string, headers: string[]): boolean {
		for(let header of headers) {
			if(text.startsWith(header)) {
				return true;
			}
		}
		return false;
	}

	// replace note
	let replaceNote = function(editor: vscode.TextEditor, newNoteDic: noteDic) {
		const workspaceEdit = new vscode.WorkspaceEdit();
		
		workspaceEdit.replace(editor.document.uri, new vscode.Range(0, 0, editor.document.lineCount, 0), '');
	};

  // run note refactor
  let runNoteRefactor = vscode.commands.registerCommand(
    "markdown-note-refactor.run-note-refactor",
    () => {
      // show message
      vscode.window.showInformationMessage("Run Note Refactor start");
      // get active text editor
      let editor = vscode.window.activeTextEditor;
      // if not open text editor, show error
      if (!editor) {
        vscode.window.showErrorMessage("No editor opened");
        return;
      }

      // get read document
      let document = editor.document;
      // if read document is not markdown, show error
      if (document.languageId !== "markdown") {
        vscode.window.showErrorMessage("Not a markdown file");
        return;
      }

      // read note
      let newNoteDic: noteDic = readNote(document);

      // make note
      makeNote(newNoteDic);

			// replace note
			// replaceNote(editor, newNoteDic);

      // show message
      vscode.window.showInformationMessage("Run Note Refactor done");
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(runNoteRefactor);
}

// This method is called when your extension is deactivated
export function deactivate() {}
