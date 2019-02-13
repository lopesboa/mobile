// @flow strict

import type {SupportedLanguage} from '../../translations/_types';
import type {OfflineContents, OfflineStatus} from '../reducers/discipline-bundle';

export const isContentReady = (language: SupportedLanguage, status: OfflineStatus): boolean =>
  status.ready.includes(language);

export const getContents = (
  language: SupportedLanguage,
  contents: OfflineContents
): Array<string> =>
  Object.keys(contents).filter(ref => {
    const status: OfflineStatus = contents[ref];
    return status.pending.concat(status.ready).includes(language);
  });
