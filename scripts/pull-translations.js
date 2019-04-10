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

const formatTranslation = (translation: string): string =>
  translation.replace('\n', '').replace(/"/g, '\\"');

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
  const moocSlidesTranslations = await fetchTranslations(
    locale,
    'coorpacademy',
    'core/locales',
    'slides.json'
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
    cancel: formatTranslation(moocFormTranslations.cancel),
    accessTheLesson: formatTranslation(playerTranslations['Access the lesson']),
    backToHome: formatTranslation(playerTranslations['Back to home']),
    bonus: formatTranslation(playerTranslations['Bonus!']),
    clue: formatTranslation(playerTranslations.Clue),
    clueStarsToLoose: formatTranslation(componentsTranslations.clue_stars_to_loose),
    congratulations: formatTranslation(playerTranslations['Congratulations!']),
    context: formatTranslation(playerTranslations.Context),
    correction: formatTranslation(playerTranslations.Correction),
    demoMode: formatTranslation(playerTranslations['Demo mode mobile'].replace(/\\/g, '')),
    didYouKnowThat: formatTranslation(playerTranslations['Did you know that?']),
    finishLearning: formatTranslation(playerTranslations['Finish learning']),
    forYou: formatTranslation(playerTranslations['For you']),
    gameOver: formatTranslation(playerTranslations['Game over']),
    getAnExtralife: formatTranslation(
      playerTranslations['Get an extra life by viewing the lesson']
    ),
    goodAnswer: formatTranslation(playerTranslations['Good answer']),
    goodJob: formatTranslation(playerTranslations['Good job']),
    goToQuestion: formatTranslation(playerTranslations['Go to question']),
    highscore: formatTranslation(playerTranslations.Highscore || ''),
    keyPoint: formatTranslation(playerTranslations['Key point']),
    lesson: formatTranslation(playerTranslations.Media),
    loginButton: formatTranslation(playerTranslations['Scan your QR code']),
    loginFirstStepHeader: formatTranslation(playerTranslations.Step1),
    loginFirstStepDescription: formatTranslation(
      playerTranslations['Connect to your learning plateform with another device']
    ),
    loginSecondStepHeader: formatTranslation(playerTranslations.Step2),
    loginSecondStepDescription: formatTranslation(
      playerTranslations['Go to settings account in the upper right hand corner']
    ),
    loginThirdStepHeader: formatTranslation(playerTranslations.Step3),
    loginThirdStepDescription: formatTranslation(
      playerTranslations['Voila your qr code will be right there']
    ),
    loginHeader: formatTranslation(
      playerTranslations[
        'To open your companys learning app, you need to scan your personal QR code'
      ]
    ),
    logOut: formatTranslation(moocMenuTranslations.header.account_menu.logout),
    needHelp: formatTranslation(moocSlidesTranslations.indice.title),
    new: formatTranslation(moocTranslations.content.new),
    next: formatTranslation(playerTranslations.Next),
    nextLevel: formatTranslation(playerTranslations['Next level']),
    ok: formatTranslation(moocFormTranslations.ok),
    ooops: formatTranslation(playerTranslations.Ooops),
    open: formatTranslation(componentsTranslations.Open),
    // @todo get it from github
    openSettings: 'Open settings',
    ouch: formatTranslation(playerTranslations.Ouch),
    outOfLives: formatTranslation(playerTranslations['You are out of lives!']),
    // @todo get it from github
    permission: 'Permission',
    // @todo get it from github
    permissionCamera:
      'We need access to your camera in order to scan your QR code and authenticate you.',
    question: formatTranslation(playerTranslations.Question),
    quit: formatTranslation(playerTranslations.Quit),
    relatedSubjects: formatTranslation(playerTranslations['Related subjects']),
    retryLevel: formatTranslation(playerTranslations['Retry level']),
    seeClue: formatTranslation(componentsTranslations['See clue']),
    selectSomethingBelow: formatTranslation(playerTranslations['Select something below']),
    // @todo get it from mooc
    startLearning: formatTranslation(playerTranslations['Start learning']),
    selectAnAnswer: formatTranslation(playerTranslations['Select an answer']),
    typeHere: formatTranslation(playerTranslations['Type here']),
    validate: formatTranslation(playerTranslations.Validate),
    // @todo get it from github
    version: 'Version',
    // @todo get it from github
    unlockNextLevel: formatTranslation(playerTranslations['Unlock next level'] || ''),
    upgrade: 'Upgrade',
    // @todo get it from github
    upgradeDescription: 'Your app must be upgrade in order to enjoy learning!',
    winAdditionalStars: formatTranslation(componentsTranslations.media_stars_to_win_plural),
    wrongAnswer: formatTranslation(playerTranslations['Wrong answer']),
    yourAnswer: formatTranslation(playerTranslations['Your answer_']),
    yourAnswers: formatTranslation(playerTranslations['Your answers_'])
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
