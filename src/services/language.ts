import type {DataLayer} from '../layer/data';

export type LanguageService = {
  set: Pick<DataLayer, 'setLanguage'>;
  getFromInterface: Pick<DataLayer, 'getInterfaceLanguage'>;
};

const service = (dataLayer: DataLayer): LanguageService => ({
  set: dataLayer.setLanguage,
  getFromInterface: dataLayer.getInterfaceLanguage,
});

export default service;
