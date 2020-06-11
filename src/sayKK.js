const vscode = require('vscode');
const a = require('./download');

module.exports = function(context) {
    context.subscriptions.push(vscode.commands.registerCommand('i18n.downloadI18nResources', () => {
        vscode.window.showInformationMessage('downloading...');
        a.download();
        vscode.window.showInformationMessage('downloaded.');

    }));
};