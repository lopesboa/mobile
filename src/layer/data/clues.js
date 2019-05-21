// @flow strict

import type {SupportedLanguage} from '../../translations/_types';
import {getItem} from './core';
import {CONTENT_TYPE} from './_const';
import type {Slide} from './_types';

export const getClue = (userLanguage: SupportedLanguage) => async (
  id: string
): Promise<string | void> => {
  // $FlowFixMe union type
  const slide: Slide = await getItem(CONTENT_TYPE.SLIDE, userLanguage, id);
  return slide && slide.clue;
};

export default getClue;
