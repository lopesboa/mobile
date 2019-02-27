// @flow strict

import type {SupportedLanguage} from '../translations/_types';
import type {DataLayer} from '../layer/data';
import type {BundledDiscipline} from '../layer/data/_types';

export type DisciplineBundleService = {|
  findById: (ref: string, userLanguage: SupportedLanguage) => Promise<BundledDiscipline>,
  // @todo change for setXXX
  store: (disciplineBundle: BundledDiscipline, userLanguage: SupportedLanguage) => Promise<void>
|};

const service = (dataLayer: DataLayer): DisciplineBundleService => ({
  findById: dataLayer.fetchDisciplineBundle,
  store: dataLayer.storeDisciplineBundle
});

export default service;
