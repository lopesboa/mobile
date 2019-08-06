// @flow strict

import type {DataLayer} from '../layer/data';
import type {SupportedLanguage} from '../translations/_types';

export type LanguageService = {|
  fetch: () => Promise<SupportedLanguage>,
  set: SupportedLanguage => void,
  getFromInterface: () => SupportedLanguage
|};

const service = (dataLayer: DataLayer): LanguageService => ({
  fetch: dataLayer.fetchLanguage,
  set: dataLayer.setLanguage,
  getFromInterface: dataLayer.getInterfaceLanguage
});

export default service;
