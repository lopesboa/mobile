import type {DataLayer} from '../layer/data';
import type {Brand} from '../types';

export type BrandsService = {
  find: (token: string) => Promise<Brand>;
};

const service = (dataLayer: DataLayer): BrandsService => ({
  find: dataLayer.fetchBrand,
});

export default service;
