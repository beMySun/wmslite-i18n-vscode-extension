const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const fetch = require('isomorphic-fetch');
const localesHash = require('./localesHash');
const { mkdirsSync } = require('../utils');
const argv = process.argv.slice(2);
const country = (argv[0] || '').toUpperCase();
const deployMap = {
  en: 'en_US',
  id: 'id_ID',
};

const getI18nServerURI = (locale) => {
  const keywords = {
    en: 'en',
    id: 'id',
  };
  const keyword = keywords[locale];
  return keyword === 'en'
    ? 'https://transify.seagroup.com/resources/572/json/download'
    : `https://transify.seagroup.com/resources/572/${keyword}/json/download`;
};

const fetchKeys = async (locale) => {
  const uri = getI18nServerURI(locale);
  console.log(`🚚 🚚 🚚 Downloading ${locale} keys...\n${uri}`);
  const response = await fetch(uri);
  const keys = await response.json();
  return keys;
};

const access = async (filePath) =>
  new Promise((resolve) => {
    fs.access(filePath, (err) => {
      if (err) {
        if (err.code === 'EXIST') {
          resolve(true);
        }
        resolve(false);
      }
      resolve(true);
    });
  });

const getCurrentOpenedFolderPath = () => {
  let path;
  if (vscode.window.activeTextEditor) {
    let workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri);
    path = workspaceFolder.uri.path;
  }
  return path;
};

const download = async (showInformationMessage) => {

  const currnetPath = getCurrentOpenedFolderPath();
  const projectName = currnetPath.split('/').pop();
  if (projectName !== 'wms-lite-fe') {
    showInformationMessage('❌❌❌ Sorry, This project is not in service.');
    return;
  }

  const locales = localesHash[country] || Object.values(localesHash).reduce((previous, current) => previous.concat(current), []);
  if (!locales) {
    showInformationMessage('This country is not in service.');
    return;
  }

  showInformationMessage('Downloading...');

  for (const locale of locales) {
    const keys = await fetchKeys(locale);
    const data = JSON.stringify(keys, null, 2);

    // https://github.com/jawil/blog/issues/18
    const directoryPath = path.resolve(currnetPath, 'src/i18n/locales');

    if (!fs.existsSync(directoryPath)) {
      mkdirsSync(directoryPath);
    }

    const filePath = path.resolve(currnetPath, `src/i18n/locales/${deployMap[locale]}.json`);
    const isExist = await access(filePath);
    const operation = isExist ? '🐱Update' : '🐶Create';

    fs.writeFileSync(filePath, `${data}\n`);

    console.log(`${operation}\t${filePath}`);
    showInformationMessage(`${operation}\t${filePath}`);
  }

  console.log('🎉🎉🎉 Download Success !');
  showInformationMessage('🎉🎉🎉 Download Success !');
};

module.exports = {
  download,
};
