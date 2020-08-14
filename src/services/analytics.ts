import type {AnalyticsService as PlayerAnalyticsService} from '@coorpacademy/player-services';
import type {Lesson, Progression, Config} from '@coorpacademy/progression-engine';
import type {DataLayer} from '../layer/data';

import {ANALYTICS_EVENT_TYPE} from '../const';

const sendViewedMediaAnalytics = (
  dataLayer: DataLayer,
): Pick<PlayerAnalyticsService, 'sendViewedMediaAnalytics'> => (
  resource: Lesson,
  location: string,
): void =>
  dataLayer.logEvent(ANALYTICS_EVENT_TYPE.MEDIA_VIEWED, {
    mediaType: resource.type,
    location,
  });

const sendProgressionFinished = (
  dataLayer: DataLayer,
): Pick<PlayerAnalyticsService, 'sendProgressionFinished'> => (
  currentProgression: Progression,
  engineConfig: Config,
): void => {
  const {state, engine} = currentProgression;

  if (!state) {
    return;
  }

  const nextContent = state.nextContent;

  const engineRef = engine.ref;
  const extraLife = engineConfig.remainingLifeRequests > state.remainingLifeRequests;
  dataLayer.logEvent(ANALYTICS_EVENT_TYPE.FINISH_PROGRESSION, {
    type: engineRef,
    state: nextContent.type,
    extraLife: Number(extraLife),
  });
};

export type AnalyticsService = PlayerAnalyticsService & {
  logEvent: Pick<DataLayer, 'logEvent'>;
};

const service = (dataLayer: DataLayer): AnalyticsService => ({
  sendViewedMediaAnalytics: sendViewedMediaAnalytics(dataLayer),
  sendProgressionFinished: sendProgressionFinished(dataLayer),
  logEvent: dataLayer.logEvent,
});

export default service;
