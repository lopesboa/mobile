// @flow strict

import type {SupportedLanguage} from '../translations/_types';
import type {DataLayer} from '../layer/data';
import type {BundledDiscipline} from '../layer/data/_types';

type FindById = (ref: string, userLanguage: SupportedLanguage) => Promise<BundledDiscipline>;
type Store = (
  disciplineBundle: BundledDiscipline,
  userLanguage: SupportedLanguage
) => Promise<void>;

export type DisciplineBundleService = {|
  findById: FindById,
  // @todo change for setXXX
  store: Store
|};

const service = (dataLayer: DataLayer): DisciplineBundleService => ({
  findById: dataLayer.fetchDisciplineBundle,
  store: dataLayer.storeDisciplineBundle
});

export default service;
