import type {Progression} from '@coorpacademy/progression-engine';
import {Progressions} from '@coorpacademy/player-services';

import {ProgressionsService as Service} from 'src/types/coorpacademy/player-store';
import type {DataLayer} from '../layer/data';
import {ANALYTICS_EVENT_TYPE} from '../const';

export interface ProgressionService extends Service {
  findLast: (engineRef: string, contentRef: string) => Promise<Progression | null>;
  synchronize: Pick<DataLayer, 'synchronizeProgression'>;
  getAll: Pick<DataLayer, 'getAllProgressions'>;
  getSynchronizedProgressionIds: Pick<DataLayer, 'getSynchronizedProgressionIds'>;
  findRemoteProgressionById: Pick<DataLayer, 'findRemoteProgressionById'>;
  updateSynchronizedProgressionIds: Pick<DataLayer, 'updateSynchronizedProgressionIds'>;
  findBestOf: Pick<DataLayer, 'findBestOf'>;
}

const create = (dataLayer: DataLayer): Pick<ProgressionService, 'create'> => (
  ref,
  engine,
  content,
  config,
) => {
  dataLayer.logEvent(ANALYTICS_EVENT_TYPE.START_PROGRESSION, {
    type: engine.ref.charAt(0).toUpperCase() + engine.ref.slice(1),
  });
  // @ts-ignore
  const playerService = Progressions(dataLayer);
  return playerService.create(ref, engine, content, config);
};

// @ts-ignore
const service = (dataLayer: DataLayer): ProgressionService => ({
  // @ts-ignore
  ...Progressions(dataLayer),
  create: create(dataLayer),
  findLast: dataLayer.findLast,
  synchronize: dataLayer.synchronizeProgression,
  getAll: dataLayer.getAllProgressions,
  getSynchronizedProgressionIds: dataLayer.getSynchronizedProgressionIds,
  findRemoteProgressionById: dataLayer.findRemoteProgressionById,
  findBestOf: dataLayer.findBestOf,
  updateSynchronizedProgressionIds: dataLayer.updateSynchronizedProgressionIds,
});

export default service;
