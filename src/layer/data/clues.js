// @flow strict

import {getItem} from './core';
import {CONTENT_TYPE} from './_const';
import type {Slide, Language} from './types';

export const getClue = (userLanguage: Language) => async (id: string): Promise<string | void> => {
  // $FlowFixMe union type
  const result: Slide = await getItem(CONTENT_TYPE.SLIDE, id, userLanguage);
  return result.clue;
};

export default getClue;
