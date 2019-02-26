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
  clue: string,
  clueStarsToLoose: string,
  congratulations: string,
  correction: string,
  context: string,
  didYouKnowThat: string,
  gameOver: string,
  goodAnswer: string,
  goodJob: string,
  goToQuestion: string,
  keyPoint: string,
  lesson: string,
  next: string,
  nextLevel: string,
  open: string,
  ouch: string,
  outOfLives: string,
  question: string,
  retryLevel: string,
  seeClue: string,
  validate: string,
  version: string,
  winAdditionalStars: string,
  wrongAnswer: string,
  yourAnswer: string,
  yourAnswers: string
|};
