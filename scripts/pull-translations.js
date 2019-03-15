// @flow

import fs from 'fs';
import path from 'path';

import fetch from 'cross-fetch';
import globby from 'globby';

import type {Translations} from '../src/translations/_types';

const GITHUB_API = 'https://api.github.com';

const {GITHUB_ACCESS_TOKEN: githubAccessToken} = process.env || {};

if (!githubAccessToken) {
  throw new Error('GITHUB_ACCESS_TOKEN environment variable missing.');
}

const fetchTranslations = (
  locale: string,
  repository: string,
  contentPath: string,
  file: string
  // We don't have any interface for translations
  // eslint-disable-next-line flowtype/no-weak-types
): Promise<Object> => {
  const apiLocale = locale.replace(/-(.*)/, found => '_' + found.replace('-', '').toUpperCase());
  return (
    fetch(
      `${GITHUB_API}/repos/coorpacademy/${repository}/contents/${contentPath}/${apiLocale}/${file}`,
      {
        headers: {
          Authorization: `token ${githubAccessToken}`
        }
      }
    )
      .then(response => response.text())
      .then(text => JSON.parse(text))
      .then(response => Buffer.from(response.content, 'base64').toString('utf8'))
      .then(content => JSON.parse(content))
      // eslint-disable-next-line no-console
      .catch(e => console.error(`Unavailable content for ${apiLocale}.`))
  );
};

const generate = async (locale: string) => {
  const moocTranslations = await fetchTranslations(
    locale,
    'coorpacademy',
    'core/locales',
    'global.json'
  );
  const moocMenuTranslations = await fetchTranslations(
    locale,
    'coorpacademy',
    'core/locales',
    'menu.json'
  );
  const moocFormTranslations = await fetchTranslations(
    locale,
    'coorpacademy',
    'core/locales',
    'form.json'
  );
  const playerTranslations = await fetchTranslations(
    locale,
    'components',
    'packages/@coorpacademy-player-web/locales',
    'player.json'
  );
  const componentsTranslations = await fetchTranslations(
    locale,
    'components',
    'packages/@coorpacademy-components/locales',
    'global.json'
  );
  const translations: Translations = {
    cancel: moocFormTranslations.cancel,
    accessTheLesson: playerTranslations['Access the lesson'],
    clue: playerTranslations.Clue,
    clueStarsToLoose: componentsTranslations.clue_stars_to_loose,
    congratulations: playerTranslations['Congratulations!'],
    context: playerTranslations.Context,
    correction: playerTranslations.Correction,
    didYouKnowThat: playerTranslations['Did you know that?'],
    finishLearning: playerTranslations['Finish learning'],
    forYou: playerTranslations['For you'],
    gameOver: playerTranslations['Game over'],
    goodAnswer: playerTranslations['Good answer'],
    goodJob: playerTranslations['Good job'],
    goToQuestion: playerTranslations['Go to question'],
    keyPoint: playerTranslations['Key point'],
    lesson: playerTranslations.Media,
    loginButton: playerTranslations['Scan your QR code'] || '',
    loginFirstStepHeader: playerTranslations.Step1 || '',
    loginFirstStepDescription:
      playerTranslations['Connect to your learning plateform with another device'] || '',
    loginSecondStepHeader: playerTranslations.Step2 || '',
    loginSecondStepDescription:
      playerTranslations['Go to settings account in the upper right hand corner'] || '',
    loginThirdStepHeader: playerTranslations.Step3 || '',
    loginThirdStepDescription: playerTranslations['Voila your qr code will be right there'] || '',
    loginHeader:
      playerTranslations[
        'To open your companys learning app, you need to scan your personal QR code'
      ] || '',
    logOut: moocMenuTranslations.header.account_menu.logout,
    new: moocTranslations.content.new,
    next: playerTranslations.Next,
    nextLevel: playerTranslations['Next level'],
    ok: moocFormTranslations.ok,
    open: componentsTranslations.Open,
    // @todo get it from github
    openSettings: 'Open settings',
    ouch: playerTranslations.Ouch,
    outOfLives: playerTranslations['You are out of lives!'],
    // @todo get it from github
    permission: 'Permission',
    // @todo get it from github
    permissionCamera:
      'We need access to your camera in order to scan your QR code and authenticate you.',
    question: playerTranslations.Question,
    quit: playerTranslations.Quit,
    retryLevel: playerTranslations['Retry level'],
    seeClue: componentsTranslations['See clue'],
    selectSomethingBelow: playerTranslations['Select something below'],
    // @todo get it from mooc
    startLearning: playerTranslations['Start learning'],
    selectAnAnswer: playerTranslations['Select an answer'],
    typeHere: playerTranslations['Type here'],
    validate: playerTranslations.Validate,
    // @todo get it from github
    version: 'Version',
    winAdditionalStars: componentsTranslations.media_stars_to_win_plural,
    wrongAnswer: playerTranslations['Wrong answer'],
    yourAnswer: playerTranslations['Your answer_'],
    yourAnswers: playerTranslations['Your answers_']
  };

  const outputFilePath = path.resolve(`${__dirname}/../src/translations/${locale}.js`);
  const properties = Object.keys(translations)
    .map(key => {
      const value = translations[key] !== undefined ? `"${translations[key]}"` : 'undefined';
      return `  ${key}: ${value}`;
    })
    .join(',\n');

  fs.writeFileSync(
    outputFilePath,
    `${'// @flow strict' +
      '\n\n' +
      "import type {Translations} from './_types';" +
      '\n\n' +
      'const translations: Translations = {' +
      '\n' +
      properties +
      '};' +
      '\n\n' +
      'export default translations;' +
      '\n'}`
  );
};

globby
  .sync(path.resolve(`${__dirname}/../src/translations/*.js`), {
    cwd: path.resolve(`${__dirname}/../src`),
    nodir: true
  })
  .map(filePath => path.basename(filePath))
  .filter(file => file !== 'index.js' && file !== '_types.js')
  .map(file => file.replace('.js', ''))
  .forEach(locale => generate(locale));
