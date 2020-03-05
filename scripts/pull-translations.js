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
  const branch = repository === 'coorpacademy' ? 'develop' : 'master';

  return (
    fetch(
      `${GITHUB_API}/repos/coorpacademy/${repository}/contents/${contentPath}/${apiLocale}/${file}?ref=${branch}`,
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
  const moocLoginTranslations = await fetchTranslations(
    locale,
    'coorpacademy',
    'core/locales',
    'login.json'
  );
  const moocErrorTranslations = await fetchTranslations(
    locale,
    'coorpacademy',
    'core/locales',
    'error.json'
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
  const moocDashboardTranslations = await fetchTranslations(
    locale,
    'coorpacademy',
    'core/locales',
    'dashboard.json'
  );
  const moocNotificationsTranslations = await fetchTranslations(
    locale,
    'coorpacademy',
    'core/locales',
    'notifications.json'
  );

  const translations: Translations = {
    accessTheLesson: formatTranslation(playerTranslations['Access the lesson']),
    authenticationMagicLinkHeader: formatTranslation(moocLoginTranslations.mobile.magicLink.header),
    authenticationMagicLinkStepOneDescription: formatTranslation(
      moocLoginTranslations.mobile.magicLink.stepOne
    ),
    authenticationMagicLinkStepTwoDescription: formatTranslation(
      moocLoginTranslations.mobile.magicLink.stepTwo
    ),
    authenticationMagicLinkStepThreeDescription: formatTranslation(
      moocLoginTranslations.mobile.magicLink.stepThree
    ),
    authenticationMagicLinkTitle: formatTranslation(moocLoginTranslations.mobile.magicLink.title),
    authenticationQRCodeHeader: formatTranslation(moocLoginTranslations.mobile.qrCode.header),
    authenticationQRCodeStepOneDescription: formatTranslation(
      moocLoginTranslations.mobile.qrCode.stepOne
    ),
    authenticationQRCodeStepTwoDescription: formatTranslation(
      moocLoginTranslations.mobile.qrCode.stepTwo
    ),
    authenticationQRCodeStepThreeDescription: formatTranslation(
      moocLoginTranslations.mobile.qrCode.stepThree
    ),
    authenticationQRCodeTitle: formatTranslation(moocLoginTranslations.mobile.qrCode.title),
    askForHelp: formatTranslation(moocErrorTranslations.modal.mobile.ask_for_help),
    backToHome: formatTranslation(playerTranslations['Back to home']),
    bonus: formatTranslation(playerTranslations['Bonus!']),
    cancel: formatTranslation(moocFormTranslations.cancel),
    clue: formatTranslation(playerTranslations.Clue),
    clueStarsToLoose: formatTranslation(componentsTranslations.clue_stars_to_loose),
    congratulations: formatTranslation(playerTranslations['Congratulations!']),
    connectionLost: formatTranslation(moocNotificationsTranslations.connectionLost),
    connectionRestored: formatTranslation(moocNotificationsTranslations.connectionRestored),
    context: formatTranslation(playerTranslations.Context),
    correction: formatTranslation(playerTranslations.Correction),
    dataLost: formatTranslation(moocErrorTranslations.modal.mobile.data_lost),
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
    highscore: formatTranslation(playerTranslations.Highscore),
    howToSignIn: formatTranslation(moocLoginTranslations.mobile.howToSignIn),
    iWantIt: formatTranslation(moocErrorTranslations.modal.mobile.i_want_it),
    keyPoint: formatTranslation(playerTranslations['Key point']),
    lesson: formatTranslation(playerTranslations.Media),
    logOut: formatTranslation(moocMenuTranslations.header.account_menu.logout),
    needHelp: formatTranslation(moocSlidesTranslations.indice.title),
    new: formatTranslation(moocTranslations.content.new),
    next: formatTranslation(playerTranslations.Next),
    nextChapter: formatTranslation(playerTranslations['Next chapter']),
    nextLevel: formatTranslation(playerTranslations['Next level']),
    noResults: formatTranslation(moocTranslations.content.noresultsfound),
    noResultsDescription: formatTranslation(moocTranslations.content.noresultsfoundDescription),
    ok: formatTranslation(moocFormTranslations.ok),
    ooops: formatTranslation(playerTranslations.Ooops),
    open: formatTranslation(componentsTranslations.Open),
    openBrowser: formatTranslation(moocLoginTranslations.mobile.openBrowser),
    openSettings: formatTranslation(moocTranslations.mobile.settings.open),
    ouch: formatTranslation(playerTranslations.Ouch),
    outOfLives: formatTranslation(playerTranslations['You are out of lives!']),
    permission: formatTranslation(moocTranslations.mobile.settings.permission),
    permissionCamera: formatTranslation(moocTranslations.mobile.settings.permissionCamera),
    platformHasBeenDisabled: formatTranslation(
      moocErrorTranslations.modal.mobile.platform_has_been_disabled
    ),
    question: formatTranslation(playerTranslations.Question),
    quit: formatTranslation(playerTranslations.Quit),
    reactivatePlatform: formatTranslation(moocErrorTranslations.modal.mobile.reactivate_platform),
    refresh: formatTranslation(moocErrorTranslations.modal.mobile.refresh),
    refreshEnjoyLearning: formatTranslation(
      moocErrorTranslations.modal.mobile.refresh_enjoy_learning
    ),
    refreshNotWorking: formatTranslation(moocErrorTranslations.modal.mobile.refresh_not_working),
    relatedSubjects: formatTranslation(playerTranslations['Related subjects']),
    resumeLearning: formatTranslation(moocDashboardTranslations.slider.resume.cta),
    retryChapter: formatTranslation(playerTranslations['Retry chapter']),
    retryLevel: formatTranslation(playerTranslations['Retry level']),
    scanQRCode: formatTranslation(moocLoginTranslations.mobile.scanQRCode),
    search: formatTranslation(moocTranslations.content.search.placeholder),
    seeClue: formatTranslation(componentsTranslations['See clue']),
    selectSomethingBelow: formatTranslation(playerTranslations['Select something below']),
    startDemo: formatTranslation(moocLoginTranslations.mobile.startDemo.replace(/\\/g, '')),
    startLearning: formatTranslation(playerTranslations['Start learning']),
    selectAnAnswer: formatTranslation(playerTranslations['Select an answer']),
    signInDesktop: formatTranslation(moocLoginTranslations.mobile.signInDesktop),
    signInMobile: formatTranslation(moocLoginTranslations.mobile.signInMobile),
    step: formatTranslation(moocLoginTranslations.mobile.step),
    typeHere: formatTranslation(playerTranslations['Type here']),
    validate: formatTranslation(playerTranslations.Validate),
    version: formatTranslation(moocTranslations.mobile.version.title),
    videoLoadingError: formatTranslation(componentsTranslations['Video Loading Error']),
    unlockNextLevel: formatTranslation(playerTranslations['Unlock next level']),
    upgrade: formatTranslation(moocTranslations.mobile.version.upgrade),
    upgradeDescription: formatTranslation(moocTranslations.mobile.version.upgradeDescription),
    winAdditionalStars: formatTranslation(componentsTranslations.media_stars_to_win_plural),
    welcome: formatTranslation(moocLoginTranslations.mobile.welcome),
    welcomeDescription: formatTranslation(moocLoginTranslations.mobile.welcomeDescription),
    welcomeUser: formatTranslation(moocDashboardTranslations.hello),
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
