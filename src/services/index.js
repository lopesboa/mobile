// @flow

import {Answers, Clues, Content, Progressions} from '@coorpacademy/player-services';

import type {
  AnswersService,
  CluesService,
  // DataLayer,
  ContentService,
  ProgressionsService
} from '@coorpacademy/player-services';

import type {DataLayer} from '../layer/data';
import type {DisciplineBundleService} from './discipline-bundle';
import DisciplineBundle from './discipline-bundle';

export type Services = {|
  Answers: AnswersService,
  Clues: CluesService,
  Content: ContentService,
  DisciplineBundle: DisciplineBundleService,
  Progressions: ProgressionsService
|};

const createServices = (dataLayer: DataLayer): Services => ({
  Answers: Answers(dataLayer),
  Clues: Clues(dataLayer),
  Content: Content(dataLayer),
  DisciplineBundle: DisciplineBundle(dataLayer),
  Progressions: Progressions(dataLayer)
});

export default createServices;
