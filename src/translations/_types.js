// @flow strict

export type SupportedLanguage =
  | 'cs'
  | 'de'
  | 'en-US'
  | 'en'
  | 'es'
  | 'fr'
  | 'hu'
  | 'it'
  | 'ja'
  | 'ko'
  | 'nl'
  | 'pl'
  | 'pt'
  | 'ro'
  | 'ru'
  | 'tr'
  | 'uk'
  | 'vi'
  | 'zh-TW'
  | 'zh';

export type Translations = {|
  accessTheLesson: string,
  authenticationMagicLinkHeader: string,
  authenticationMagicLinkStepOneDescription: string,
  authenticationMagicLinkStepTwoDescription: string,
  authenticationMagicLinkStepThreeDescription: string,
  authenticationMagicLinkTitle: string,
  authenticationQRCodeHeader: string,
  authenticationQRCodeStepOneDescription: string,
  authenticationQRCodeStepTwoDescription: string,
  authenticationQRCodeStepThreeDescription: string,
  authenticationQRCodeTitle: string,
  askForHelp: string,
  backToHome: string,
  bonus: string,
  cancel: string,
  clue: string,
  clueStarsToLoose: string,
  congratulations: string,
  context: string,
  correction: string,
  dataLost: string,
  didYouKnowThat: string,
  finishLearning: string,
  forYou: string,
  gameOver: string,
  getAnExtralife: string,
  goodAnswer: string,
  goodJob: string,
  goToQuestion: string,
  highscore: string,
  howToSignIn: string,
  iWantIt: string,
  keyPoint: string,
  lesson: string,
  logOut: string,
  needHelp: string,
  new: string,
  next: string,
  nextChapter: string,
  nextLevel: string,
  nextChapter: string,
  ok: string,
  ooops: string,
  open: string,
  openBrowser: string,
  openSettings: string,
  ouch: string,
  outOfLives: string,
  permission: string,
  permissionCamera: string,
  platformHasBeenDisabled: string,
  question: string,
  quit: string,
  reactivatePlatform: string,
  refresh: string,
  refreshEnjoyLearning: string,
  refreshNotWorking: string,
  relatedSubjects: string,
  retryChapter: string,
  retryLevel: string,
  retryChapter: string,
  relatedSubjects: string,
  scanQRCode: string,
  seeClue: string,
  selectAnAnswer: string,
  selectSomethingBelow: string,
  signInDesktop: string,
  signInMobile: string,
  startDemo: string,
  startLearning: string,
  step: string,
  typeHere: string,
  unlockNextLevel: string,
  upgrade: string,
  upgradeDescription: string,
  validate: string,
  version: string,
  videoLoadingError: string,
  welcome: string,
  welcomeDescription: string,
  winAdditionalStars: string,
  wrongAnswer: string,
  yourAnswer: string,
  yourAnswers: string
|};
