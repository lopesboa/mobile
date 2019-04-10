// @flow

import type {AnalyticsService as PlayerAnalyticsService} from '@coorpacademy/player-services';
import type {Lesson, Progression, Config} from '@coorpacademy/progression-engine';

import type {DataLayer} from '../layer/data';
import {CONTENT_TYPE, ANALYTICS_EVENT_TYPE} from '../const';

const sendViewedMediaAnalytics = (
  dataLayer: DataLayer
): $PropertyType<PlayerAnalyticsService, 'sendViewedMediaAnalytics'> => (
  resource: Lesson,
  location: string
): void =>
  dataLayer.logEvent(ANALYTICS_EVENT_TYPE.MEDIA_VIEWED, {
    mediaType: resource.type,
    location
  });

const sendProgressionAnalytics = (
  dataLayer: DataLayer
): $PropertyType<PlayerAnalyticsService, 'sendProgressionAnalytics'> => (
  currentProgression: Progression,
  engineConfig: Config
): void => {
  const {state, engine} = currentProgression;

  if (!state) {
    return;
  }

  const nextContent = state.nextContent;

  if ([CONTENT_TYPE.SUCCESS, CONTENT_TYPE.FAILURE].includes(nextContent.type)) {
    const engineRef = engine.ref;
    const extraLife = engineConfig.remainingLifeRequests > state.remainingLifeRequests;
    dataLayer.logEvent(ANALYTICS_EVENT_TYPE.FINISH_PROGRESSION, {
      type: engineRef,
      state: nextContent.type,
      extraLife: Number(extraLife)
    });
  }
};

export type AnalyticsService = $Exact<{
  ...PlayerAnalyticsService,
  setCurrentScreen: $PropertyType<DataLayer, 'setCurrentScreen'>,
  logEvent: $PropertyType<DataLayer, 'logEvent'>,
  setUserProperty: $PropertyType<DataLayer, 'setUserProperty'>
}>;

const service = (dataLayer: DataLayer): AnalyticsService => ({
  sendViewedMediaAnalytics: sendViewedMediaAnalytics(dataLayer),
  sendProgressionAnalytics: sendProgressionAnalytics(dataLayer),
  setCurrentScreen: dataLayer.setCurrentScreen,
  logEvent: dataLayer.logEvent,
  setUserProperty: dataLayer.setUserProperty
});

export default service;
