import type {DataLayer} from '../layer/data';

export type LanguageService = {
  set: $PropertyType<DataLayer, 'setLanguage'>,
  getFromInterface: $PropertyType<DataLayer, 'getInterfaceLanguage'>
};

const service = (dataLayer: DataLayer): LanguageService => ({
  set: dataLayer.setLanguage,
  getFromInterface: dataLayer.getInterfaceLanguage
});

export default service;
