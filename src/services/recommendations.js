// @flow
import {Recommendations} from '@coorpacademy/player-services';
import type {DataLayer} from '../layer/data';

export type RecommendationsService = {
  // $FlowFixMe
  ...Recommendations
};

const service = (dataLayer: DataLayer): RecommendationsService => ({
  // $FlowFixMe
  ...Recommendations(dataLayer)
});

export default service;
