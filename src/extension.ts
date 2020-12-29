// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as zlib from 'zlib';
import * as manolo from 'manolo';
//var manolo = require('node_modules/manolo');

let syscalls: {[names: string]: string} = [];
const man2Path = '/usr/share/man/man2/';

function enumarateSyscalls() {
	console.log('enumarateSyscalls');
	fs.readdirSync(man2Path).forEach(file => {
			syscalls[file.split('.', 1)] = man2Path + file;
		});
	});
	console.log(`size: ${syscalls.length}`)
}

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "vsman" is now active!');

	enumarateSyscalls();

	let helloVsmanToken = vscode.commands.registerCommand('vsman.helloVsman', () => {
		vscode.window.showInformationMessage('vsman extension has loaded succesfully');
	});

	vscode.languages.registerHoverProvider('c', {
        provideHover(document, position, token) {

            const range = document.getWordRangeAtPosition(position);
            const word = document.getText(range);

			if (word in syscalls){
				var compressed = fs.readFileSync(syscalls[word], {})
				var data = zlib.gunzipSync(compressed).toString()

				var parsedData = {}
				try {
					console.log(`${typeof manolo}`)
					parsedData = manolo(data)
				} catch(error) {
					console.error(error);	
				}
				//console.log(`aa: ${parsedData}`)
				return new vscode.Hover({
					language: "kaki",
					value: `${parsedData}`
				})
			}
        }
    });

	context.subscriptions.push(helloVsmanToken);
}

export function deactivate() {}
