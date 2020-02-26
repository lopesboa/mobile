// @flow

import type {Progression} from '@coorpacademy/progression-engine';
import {Progressions} from '@coorpacademy/player-services';
import type {ProgressionsService as Service} from '@coorpacademy/player-services';

import type {DataLayer} from '../layer/data';
import {ANALYTICS_EVENT_TYPE} from '../const';

export type ProgressionService = {|
  ...Service,
  findLast: (engineRef: string, contentRef: string) => Promise<Progression | null>,
  synchronize: $PropertyType<DataLayer, 'synchronizeProgression'>,
  getAll: $PropertyType<DataLayer, 'getAllProgressions'>,
  getSynchronizedProgressionIds: $PropertyType<DataLayer, 'getSynchronizedProgressionIds'>,
  getPendingProgressionId: $PropertyType<DataLayer, 'getPendingProgressionId'>,
  findRemoteProgressionById: $PropertyType<DataLayer, 'findRemoteProgressionById'>,
  updateSynchronizedProgressionIds: $PropertyType<DataLayer, 'updateSynchronizedProgressionIds'>,
  updatePendingProgressionId: $PropertyType<DataLayer, 'updatePendingProgressionId'>,
  findBestOf: $PropertyType<DataLayer, 'findBestOf'>
|};

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
  getSynchronizedProgressionIds: dataLayer.getSynchronizedProgressionIds,
  getPendingProgressionId: dataLayer.getPendingProgressionId,
  findRemoteProgressionById: dataLayer.findRemoteProgressionById,
  findBestOf: dataLayer.findBestOf,
  updateSynchronizedProgressionIds: dataLayer.updateSynchronizedProgressionIds,
  updatePendingProgressionId: dataLayer.updatePendingProgressionId
});

export default service;
