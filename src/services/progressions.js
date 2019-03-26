// @flow

import type {Progression} from '@coorpacademy/progression-engine';
import {Progressions} from '@coorpacademy/player-services';
import type {ProgressionsService as Service} from '@coorpacademy/player-services';
import type {DataLayer} from '../layer/data';

export type ProgressionService = {
  ...Service,
  findLast: (engineRef: string, contentRef: string) => Promise<Progression | null>,
  synchronize: $PropertyType<DataLayer, 'synchronizeProgression'>,
  getAll: $PropertyType<DataLayer, 'getAllProgressions'>
};

const findBestOf = (engineRef, contentType, contentRef, progressionId) => ({stars: 0});

const service = (dataLayer: DataLayer): ProgressionService => ({
  ...Progressions(dataLayer),
  // $FlowFixMe
  findBestOf,
  findLast: dataLayer.findLast,
  synchronize: dataLayer.synchronizeProgression,
  getAll: dataLayer.getAllProgressions
});

export default service;
