// @flow

import {Answers, Clues, Content, Progressions} from '@coorpacademy/player-services';

import type {
  AnswersService,
  CluesService,
  ContentService,
  ProgressionsService
} from '@coorpacademy/player-services';

import type {DataLayer} from '../layer/data';
import type {DisciplineBundleService} from './discipline-bundle';
import DisciplineBundle from './discipline-bundle';
import type {CardsService} from './cards';
import Cards from './cards';

export type Services = {|
  Answers: AnswersService,
  Cards: CardsService,
  Clues: CluesService,
  Content: ContentService,
  DisciplineBundle: DisciplineBundleService,
  Progressions: ProgressionsService
|};

const createServices = (dataLayer: DataLayer): Services => ({
  Answers: Answers(dataLayer),
  Cards: Cards(dataLayer),
  Clues: Clues(dataLayer),
  Content: Content(dataLayer),
  DisciplineBundle: DisciplineBundle(dataLayer),
  Progressions: Progressions(dataLayer)
});

export default createServices;
