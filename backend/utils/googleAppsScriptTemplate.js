const fs = require('fs');
const path = require('path');

let scriptContent = '';
try {
  scriptContent = fs.readFileSync(path.join(__dirname, 'GoogleAppsScript_Code.gs'), 'utf8');
} catch (e) {
  scriptContent = '';
}

const GOOGLE_APPS_SCRIPT_CODE = scriptContent;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GOOGLE_APPS_SCRIPT_CODE
  };
}
