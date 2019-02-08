// @flow strict
import type {ExitNodeAPI} from '@coorpacademy/player-services';
import {mapToExitNodeAPI} from './mappers';

import {getItem} from './core';
import {CONTENT_TYPE} from './_const';
import type {ExitNode, Language} from './types';

export const getExitNode = (userLanguage: Language) => async (
  exitNodeRef: string
): Promise<ExitNodeAPI> => {
  // $FlowFixMe union type
  const item: ExitNode = await getItem(CONTENT_TYPE.EXIT_NODE, exitNodeRef, userLanguage);
  return mapToExitNodeAPI(item);
};

export default getExitNode;
