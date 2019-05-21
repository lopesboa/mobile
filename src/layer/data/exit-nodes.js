// @flow strict
import type {ExitNodeAPI} from '@coorpacademy/player-services';

import type {SupportedLanguage} from '../../translations/_types';
import {mapToExitNodeAPI} from './mappers';
import {getItem} from './core';
import {CONTENT_TYPE} from './_const';
import type {ExitNode} from './_types';

export const getExitNode = (userLanguage: SupportedLanguage) => async (
  exitNodeRef: string
): Promise<ExitNodeAPI> => {
  // $FlowFixMe union type
  const item: ExitNode = await getItem(CONTENT_TYPE.EXIT_NODE, userLanguage, exitNodeRef);
  return mapToExitNodeAPI(item);
};

export default getExitNode;
