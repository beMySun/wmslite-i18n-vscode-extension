const vscode = require('vscode');
const fileloader = require('./download');

module.exports = function (context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('i18n.downloadI18nResources', () => {
      const showInformationMessage = vscode.window.showInformationMessage;
      fileloader.download(showInformationMessage);
    })
  );
};
