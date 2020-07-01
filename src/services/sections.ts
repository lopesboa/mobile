import type {DataLayer} from '../layer/data';
import type {Section} from '../types';

export type SectionsService = {
  find: (
    token: string,
    offset: number,
    limit: number,
  ) => Promise<{
    total: number;
    sections: Array<Section>;
  }>;
};

const service = (dataLayer: DataLayer): SectionsService => ({
  find: dataLayer.fetchSections,
});

export default service;
