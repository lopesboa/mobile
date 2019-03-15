// @flow

import {Answers, Clues, Content, Progressions} from '@coorpacademy/player-services';

import type {
  AnalyticsService,
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
import type {BrandsService} from './brands';
import Brands from './brands';
import Analytics from './analytics';
import Permissions from './permissions';
import type {PermissionsService} from './permissions';

export type Services = {|
  Analytics: AnalyticsService,
  Answers: AnswersService,
  Cards: CardsService,
  Clues: CluesService,
  Content: ContentService,
  DisciplineBundle: DisciplineBundleService,
  Progressions: ProgressionsService,
  Brands: BrandsService,
  Permissions: PermissionsService
|};

const createServices = (dataLayer: DataLayer): Services => ({
  Analytics,
  Answers: Answers(dataLayer),
  Cards: Cards(dataLayer),
  Clues: Clues(dataLayer),
  Content: Content(dataLayer),
  DisciplineBundle: DisciplineBundle(dataLayer),
  Progressions: Progressions(dataLayer),
  Brands: Brands(dataLayer),
  Permissions
});

export default createServices;
