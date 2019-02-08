// @flow
import {getItem} from './core';
import {CONTENT_TYPE} from './_const';
import type {Slide, Language} from './types';

export const getCorrectAnswer = (userLanguage: Language) => async (
  slideId: string
): Promise<Array<Array<string>>> => {
  // $FlowFixMe union type
  const slide: Slide = await getItem(CONTENT_TYPE.SLIDE, slideId, userLanguage);
  return slide.question.content.answers;
};

export default getCorrectAnswer;
