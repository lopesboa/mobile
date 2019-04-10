// @flow

import type {Progression} from '@coorpacademy/progression-engine';
import {Progressions} from '@coorpacademy/player-services';
import type {ProgressionsService as Service} from '@coorpacademy/player-services';

import type {DataLayer} from '../layer/data';
import {ANALYTICS_EVENT_TYPE} from '../const';

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

const create = (dataLayer: DataLayer): $PropertyType<ProgressionService, 'create'> => (
  ref,
  engine,
  content,
  config
) => {
  dataLayer.logEvent(ANALYTICS_EVENT_TYPE.START_PROGRESSION, {
    type: engine.ref.charAt(0).toUpperCase() + engine.ref.slice(1)
  });
  // $FlowFixMe
  const playerService = Progressions(dataLayer);
  return playerService.create(ref, engine, content, config);
};

// $FlowFixMe
const service = (dataLayer: DataLayer): ProgressionService => ({
  // $FlowFixMe
  ...Progressions(dataLayer),
  create: create(dataLayer),
  findLast: dataLayer.findLast,
  synchronize: dataLayer.synchronizeProgression,
  getAll: dataLayer.getAllProgressions,
  findBestOf: findBestOf(dataLayer)
});

export default service;
