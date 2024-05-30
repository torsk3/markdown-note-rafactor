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
    [fileName: string]: [content: string, lineCount: number];
  };

  // define line header
  let header = "## ";
  let bigHeader = ["# "];

  let headerSize = config.get<number>("headerSize");
  if (headerSize) {
    header = `${"#".repeat(headerSize)} `;
    // if ## -> bigHeader is #, ### -> #, ##
    for (let i = headerSize; i > 1; i--) {
      bigHeader.push(`${"#".repeat(headerSize - 1)} `);
    }
  }

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
    let insertHeader = config.get<string>("insertHeader");

    if(insertHeader){
      insertHeader = insertHeader.replace(/<br>/g, '\n');
    }

    // get workspace folder uri
    let folderUri = folders[0].uri;
    let directory = config.get<string>("makeNoteDir");
    if (directory) {
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
          content = `${insertHeader}# ${fileName}\n${newNoteDic[fileName]["0"]}`;
          blob = new TextEncoder().encode(content);
          vscode.workspace.fs.writeFile(filepath, blob);
          // show message Make a new Note
          vscode.window.showInformationMessage(`Make a new note ${fileName}`);
        } else {
          vscode.workspace.openTextDocument(filepath).then((doc) => {
            // get already content
            let alreadyContent = doc.getText();
            content = `${alreadyContent}\n${newNoteDic[fileName]["0"]}`;
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
        newNoteDic[fileName] = ["", 0];
      }
      
      // if line start with bigHeader
      if (isStartsWith(line.text, bigHeader)) {
        // set fileName to empty
        fileName = "";
      }

      // if fileName is not empty, copy text to fileName
      if (fileName !== "") {
        // set newNoteDic
        newNoteDic[fileName]["0"] = `${newNoteDic[fileName]["0"]}${line.text}\n`;
        newNoteDic[fileName]["1"] = newNoteDic[fileName]["1"] + 1 ;
      }

    }
    return newNoteDic;
  };

  // is start with headers
  function isStartsWith(text: string, headers: string[]): boolean {
    for (let header of headers) {
      if (text.startsWith(header)) {
        return true;
      }
    }
    return false;
  }

  // replace note
  let replaceNote = function (document: vscode.TextDocument, newNoteDic: noteDic) {
    // set workspace
    const workspaceEdit = new vscode.WorkspaceEdit();

    // search range for same content of noteDic in open document 
    for (let fileName in newNoteDic) {
      // set startLine and endLine
      let startLine = 0;
      let endLine = 0;

      for (let i = 0; i < document.lineCount; i++) {
        // get line text
        let line = document.lineAt(i);
        // if line text is same as fileName with header 
        if (line.text === `${header}${fileName}`) {
          startLine = i;
          endLine = i + newNoteDic[fileName]["1"];
          break;
        }
      }
      // 
      let range = new vscode.Range(startLine, 0, endLine, 0);
      let replaceText = `${header}${fileName}\n\nLink to -->[[${fileName}]]\n\n`;
      workspaceEdit.replace(document.uri, range, replaceText);
    }
    // apply edit
    vscode.workspace.applyEdit(workspaceEdit);
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

      console.log('readNote Done');

      // make note
      makeNote(newNoteDic);

      // replace note
      replaceNote(document, newNoteDic);

      // show message
      vscode.window.showInformationMessage("Run Note Refactor done");
    }
  );

  context.subscriptions.push(runNoteRefactor);
}

// This method is called when your extension is deactivated
export function deactivate() {}
