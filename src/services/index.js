// @flow

import {Answers, Clues, Content, LeaderBoard} from '@coorpacademy/player-services';

import type {AnswersService, CluesService, ContentService} from '@coorpacademy/player-services';

import type {DataLayer} from '../layer/data';
import type {BundleService} from './bundle';
import Bundle from './bundle';
import type {CardsService} from './cards';
import Cards from './cards';
import type {BrandsService} from './brands';
import Brands from './brands';
import Analytics from './analytics';
import type {AnalyticsService} from './analytics';
import Permissions from './permissions';
import type {PermissionsService} from './permissions';
import Progressions from './progressions';
import Recommendations from './recommendations';
import type {ProgressionService} from './progressions';

export type Services = {|
  Analytics: AnalyticsService,
  Answers: AnswersService,
  Cards: CardsService,
  Clues: CluesService,
  Content: ContentService,
  Bundle: BundleService,
  Progressions: ProgressionService,
  Brands: BrandsService,
  Permissions: PermissionsService,
  LeaderBoard: typeof LeaderBoard,
  Recommendations: typeof Recommendations
|};

const createServices = (dataLayer: DataLayer): Services => ({
  Analytics: Analytics(dataLayer),
  // $FlowFixMe
  Answers: Answers(dataLayer),
  Cards: Cards(dataLayer),
  // $FlowFixMe
  Clues: Clues(dataLayer),
  // $FlowFixMe
  Content: Content(dataLayer),
  Bundle: Bundle(dataLayer),
  Progressions: Progressions(dataLayer),
  Brands: Brands(dataLayer),
  Recommendations: Recommendations(dataLayer),
  Permissions,
  LeaderBoard
});

export default createServices;
