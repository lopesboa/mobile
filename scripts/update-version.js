const fs = require('fs');

const shell = require('shelljs');

const packageJson = require('../package.json');

const OUTPUT_FILE_PATH = './src/modules/version.json';

const content = {
  branch: shell.exec('git rev-parse --abbrev-ref HEAD').replace('\n', ''),
  commit: shell.exec('git log -n 1 --pretty=format:"%h"'),
  tag: shell.exec('git describe --tags --abbrev=0').replace('\n', '') || packageJson.version
};

// eslint-disable-next-line no-console
console.log('[CONFIG]', 'Writing version config file : ' + OUTPUT_FILE_PATH);
fs.writeFileSync(OUTPUT_FILE_PATH, JSON.stringify(content, null, 2));
