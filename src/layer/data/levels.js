// @flow

import type {LevelAPI} from '@coorpacademy/player-services';
import {getItem} from './core';
import {CONTENT_TYPE} from './_const';
import type {Language, Level} from './types';
import {mapToLevelAPI} from './mappers';

export const findById = (userLanguage: Language) => async (ref: string): Promise<LevelAPI> => {
  // $FlowFixMe union type
  const item: Level = await getItem(CONTENT_TYPE.LEVEL, ref, userLanguage);
  return mapToLevelAPI(item);
};

export default findById;
