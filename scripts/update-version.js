// @flow

import fs from 'fs';
import shell from 'shelljs';

import type {Version} from '../src/modules/version';
import packageJson from '../package';

const {REACT_NATIVE_BUILD_TYPE: buildType, REACT_NATIVE_FLAVOR: buildFlavor} = process.env;
const OUTPUT_FILE_PATH = './src/modules/version.json';

if (buildType && !['adhoc', 'distribution'].includes(buildType)) {
  throw new Error(`Unsupported build type: ${buildType}`);
}

if (buildFlavor && !['storybook', 'e2e'].includes(buildFlavor)) {
  throw new Error(`Unsupported build flavor: ${buildFlavor}`);
}

const version: Version = {
  branch: shell.exec('git rev-parse --abbrev-ref HEAD', {silent: true}).replace('\n', ''),
  commit: shell.exec('git log -n 1 --pretty=format:"%h"', {silent: true}),
  tag:
    shell.exec('git describe --tags --abbrev=0', {silent: true}).replace('\n', '') ||
    packageJson.version,
  // $FlowFixMe this string is tested above
  buildType,
  // $FlowFixMe this string is tested above
  buildFlavor
};
const output = JSON.stringify(version, null, 2);

// eslint-disable-next-line no-console
console.log('[CONFIG]', `Writing version config file (${OUTPUT_FILE_PATH}):`, `\n${output}`);
fs.writeFileSync(OUTPUT_FILE_PATH, output);
