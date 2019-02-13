// @flow strict

import type {SupportedLanguage} from '../../translations/_types';
import {getItem} from './core';
import {CONTENT_TYPE} from './_const';
import type {Slide} from './_types';

export const getClue = (userLanguage: SupportedLanguage) => async (
  id: string
): Promise<string | void> => {
  // $FlowFixMe union type
  const result: Slide = await getItem(CONTENT_TYPE.SLIDE, id, userLanguage);
  return result.clue;
};

export default getClue;
