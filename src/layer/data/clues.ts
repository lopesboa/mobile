import translations from '../../translations';
import {getItem} from './core';
import {CONTENT_TYPE} from './_const';
import type {Slide} from './_types';

export const getClue = async (id: string): Promise<string | void> => {
  const language = translations.getLanguage();
  // @ts-ignore union type
  const slide: Slide = await getItem(CONTENT_TYPE.SLIDE, language, id);
  return slide && slide.clue;
};

export default getClue;
