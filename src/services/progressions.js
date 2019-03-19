// @flow

import type {Progression} from '@coorpacademy/progression-engine';
import {Progressions} from '@coorpacademy/player-services';
import type {DataLayer} from '../layer/data';

export type ProgressionService = {
  ...Progressions,
  findLast: (engineRef: string, contentRef: string) => Promise<Progression | null>
};

const service = (dataLayer: DataLayer): ProgressionService => ({
  ...Progressions(dataLayer),
  findLast: dataLayer.findLast
});

export default service;
