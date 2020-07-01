import {AnalyticsService} from '../../../player-services/analytics';
import {AnswersService} from './answers';
import {CluesService} from './clues';
import {ContentService} from './content';
import {ExitNodesService} from './exit-nodes';
import {ProgressionsService} from './progressions';
import {RecommendationsService} from './recommendations';
import {SlidesService} from './slides';
import {VideosService} from './videos';

export type Services = {
  Analytics: AnalyticsService;
  Comments: unknown;
  LeaderBoard: unknown;
  Answers: AnswersService;
  Clues: CluesService;
  Content: ContentService;
  ExitNodes: ExitNodesService;
  Progressions: ProgressionsService;
  Recommendations: RecommendationsService;
  Slides: SlidesService;
  Videos: VideosService;
};
