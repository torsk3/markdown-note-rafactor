// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "markdown-composer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('markdown-composer.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from markdown_refactor!');
	});

	// make note command
	let makenote = vscode.commands.registerCommand('markdown-composer.make-note', () => {
		
		// get workspace folder
		let folders = vscode.workspace.workspaceFolders;

		// if no workspace folder, show error
		if (!folders) {
			vscode.window.showErrorMessage("No workspace folder opened");
			return;
		}

		// get workspace folder uri
		let folderuri = folders[0].uri;

		// show input box, then write file
		let inputName = vscode.window.showInputBox({ prompt: "Enter note name" });
		inputName.then(name =>
			{
			if (name) 
				{
				let filepath = vscode.Uri.joinPath(folderuri, name + ".md");
				let content = "# " + name;
				let blob: Uint8Array = new TextEncoder().encode(content);
				vscode.workspace.fs.writeFile(filepath, blob);
				}
			});
		});

	let makenote2 = function(filename:string){
		// get workspace folder
		let folders = vscode.workspace.workspaceFolders;

		// if no workspace folder, show error
		if (!folders) {
			vscode.window.showErrorMessage("No workspace folder opened");
			return;
		}

		// get workspace folder uri
		let folderuri = folders[0].uri;

		// show input box, then write file
		let filepath = vscode.Uri.joinPath(folderuri, filename + ".md");
		let content = "# " + filename;
		let blob: Uint8Array = new TextEncoder().encode(content);
		vscode.workspace.fs.writeFile(filepath, blob);
	};
	

	// read note command
	let readnote = vscode.commands.registerCommand('markdown-composer.read-note', () => {

		// get active text editor
		let editor = vscode.window.activeTextEditor;
		if(!editor){
			vscode.window.showErrorMessage("No editor opened");
			return;
		}

		// if read document is not markdown, show error
		if(editor.document.languageId !== "markdown"){
			vscode.window.showErrorMessage("Not a markdown file");
			return;
		}
		
		// count read document line number
		let lineCount = editor.document.lineCount;

		// define line head
		let header = "## ";

		// read line by line, if line start with header, show line
		for(let i = 0; i < lineCount; i++){
			let line = editor.document.lineAt(i);
			if(line.text.startsWith(header)){
				vscode.window.showInformationMessage(line.text);
				makenote2(line.text.substring(header.length));
			}
		}

		vscode.window.showInformationMessage(editor.document.fileName);
		});

	context.subscriptions.push(disposable);
	context.subscriptions.push(makenote);
	context.subscriptions.push(readnote);
}

// This method is called when your extension is deactivated
export function deactivate() {}
