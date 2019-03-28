// @flow
import {Recommendations} from '@coorpacademy/player-services';
import type {DataLayer} from '../layer/data';

export type RecommendationsService = {
  ...Recommendations
};

const service = (dataLayer: DataLayer): RecommendationsService => ({
  // $FlowFixMe
  ...Recommendations(dataLayer)
});

export default service;
