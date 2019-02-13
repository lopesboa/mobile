// @flow strict

import type {LevelAPI} from '@coorpacademy/player-services';

import type {SupportedLanguage} from '../../translations/_types';
import {getItem} from './core';
import {CONTENT_TYPE} from './_const';
import type {Level} from './_types';
import {mapToLevelAPI} from './mappers';

export const findById = (userLanguage: SupportedLanguage) => async (
  ref: string
): Promise<LevelAPI> => {
  // $FlowFixMe union type
  const item: Level = await getItem(CONTENT_TYPE.LEVEL, ref, userLanguage);
  return mapToLevelAPI(item);
};

export default findById;
