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
  advanced: string,
  base: string,
  clue: string,
  coach: string,
  congratulations: string,
  correction: string,
  didYouKnowThat: string,
  gameOver: string,
  goodAnswer: string,
  goodJob: string,
  keyPoint: string,
  lesson: string,
  next: string,
  nextLevel: string,
  open: string,
  ouch: string,
  outOfLives: string,
  question: string,
  retryLevel: string,
  validate: string,
  wrongAnswer: string,
  yourAnswer: string,
  yourAnswers: string
|};
