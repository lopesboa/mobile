// @flow

import type {Progression} from '@coorpacademy/progression-engine';
import {Progressions} from '@coorpacademy/player-services';
import type {ProgressionsService as Service} from '@coorpacademy/player-services';
import type {DataLayer} from '../layer/data';

type BestOf = {|stars: number|};

export type ProgressionService = {
  ...Service,
  findLast: (engineRef: string, contentRef: string) => Promise<Progression | null>,
  synchronize: $PropertyType<DataLayer, 'synchronizeProgression'>,
  getAll: $PropertyType<DataLayer, 'getAllProgressions'>,
  findBestOf: (
    engineRef: string,
    contentType: string,
    contentRef: string,
    progressionId: string
  ) => Promise<BestOf>
};

const findBestOf = (dataLayer: DataLayer) => async (
  engineRef,
  contentType,
  contentRef,
  progressionId
): Promise<{|stars: number|}> => {
  const {findBestOf: getBestOf} = dataLayer;
  // $FlowFixMe
  const stars = await getBestOf(engineRef, contentType, contentRef, progressionId);
  return {stars};
};

// $FlowFixMe
const service = (dataLayer: DataLayer): ProgressionService => ({
  // $FlowFixMe
  ...Progressions(dataLayer),
  findLast: dataLayer.findLast,
  synchronize: dataLayer.synchronizeProgression,
  getAll: dataLayer.getAllProgressions,
  findBestOf: findBestOf(dataLayer)
});

export default service;
