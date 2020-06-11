const vscode = require('vscode');
module.exports = function(context) {
    context.subscriptions.push(vscode.commands.registerCommand('i18n.outside', () => {
        vscode.window.showInformationMessage('Hello KK, from outside !');
    }));
};