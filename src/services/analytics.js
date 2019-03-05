// @flow
import type {AnalyticsService} from '@coorpacademy/player-services';
import type {Lesson, Progression, Config} from '@coorpacademy/progression-engine';

const sendViewedMediaAnalytics = (resource: Lesson, location: string) => {};
const sendProgressionAnalytics = (currentProgression: Progression, engineConfig: Config) => {};

const service: AnalyticsService = {
  sendViewedMediaAnalytics,
  sendProgressionAnalytics
};

export default service;
