// @flow strict

import type {SupportedLanguage} from '../../translations/_types';
import {getItem} from './core';
import {CONTENT_TYPE} from './_const';
import type {Slide} from './_types';

export const getCorrectAnswer = (userLanguage: SupportedLanguage) => async (
  slideId: string
): Promise<Array<Array<string>>> => {
  // $FlowFixMe union type
  const slide: Slide = await getItem(CONTENT_TYPE.SLIDE, userLanguage, slideId);
  return slide.question.content.answers;
};

export default getCorrectAnswer;
