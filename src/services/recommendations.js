// @flow

import {Recommendations} from '@coorpacademy/player-services';
import type {RecommendationsService} from '@coorpacademy/player-services';

import type {DataLayer} from '../layer/data';

// $FlowFixMe types between mobile and player are not synced
const service = (dataLayer: DataLayer): RecommendationsService => Recommendations(dataLayer);

export default service;
