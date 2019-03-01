// @flow strict

import type {DataLayer} from '../layer/data';
import type {Cards} from '../layer/data/_types';
import type {SupportedLanguage} from '../translations/_types';

export type CardsService = {|
  find: (language: SupportedLanguage, host: string, token: string) => Promise<Cards>
|};

const service = (dataLayer: DataLayer): CardsService => ({
  find: dataLayer.fetchCards
});

export default service;
