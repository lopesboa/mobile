// @flow

import {Answers, Clues, Content, LeaderBoard, Videos} from '@coorpacademy/player-services';

import type {
  AnswersService,
  CluesService,
  ContentService,
  VideosService
} from '@coorpacademy/player-services';

import type {DataLayer} from '../layer/data';
import type {BundleService} from './bundle';
import Bundle from './bundle';
import type {CardsService} from './cards';
import Cards from './cards';
import type {BrandsService} from './brands';
import type {UsersService} from './users';
import Brands from './brands';
import Users from './users';
import type {LanguageService} from './language';
import Language from './language';
import Analytics from './analytics';
import type {AnalyticsService} from './analytics';
import Permissions from './permissions';
import type {PermissionsService} from './permissions';
import Progressions from './progressions';
import Recommendations from './recommendations';
import type {ProgressionService} from './progressions';
import type {SectionsService} from './sections';
import Sections from './sections';

export type Services = {|
  Analytics: AnalyticsService,
  Answers: AnswersService,
  Cards: CardsService,
  Clues: CluesService,
  Content: ContentService,
  Bundle: BundleService,
  Progressions: ProgressionService,
  Brands: BrandsService,
  Language: LanguageService,
  Permissions: PermissionsService,
  LeaderBoard: typeof LeaderBoard,
  Users: UsersService,
  Recommendations: typeof Recommendations,
  Sections: SectionsService,
  Videos: VideosService
|};

const createServices = (dataLayer: DataLayer): Services => ({
  Analytics: Analytics(dataLayer),
  // $FlowFixMe datalayer definition error
  Answers: Answers(dataLayer),
  Cards: Cards(dataLayer),
  // $FlowFixMe datalayer definition error
  Clues: Clues(dataLayer),
  // $FlowFixMe datalayer definition error
  Content: Content(dataLayer),
  Bundle: Bundle(dataLayer),
  Progressions: Progressions(dataLayer),
  Brands: Brands(dataLayer),
  Language: Language(dataLayer),
  Recommendations: Recommendations(dataLayer),
  Permissions,
  LeaderBoard,
  Users: Users(dataLayer),
  Sections: Sections(dataLayer),
  // $FlowFixMe datalayer definition error
  Videos: Videos(dataLayer)
});

export default createServices;
