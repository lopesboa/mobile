// @flow strict

import {storeDisciplineBundle} from './content';
import type {BundledDiscipline, Language} from './types';

const createContentService = (userLanguage: Language) => ({
  storeDisciplineBundle: storeDisciplineBundle(userLanguage)
});

export type {BundledDiscipline};
export default createContentService;
