import type {SlideAPI} from '../../types/coorpacademy/player-services';

import translations from '../../translations';
import {mapToSlideAPI} from './mappers';
import {getItemsPerResourceType, getItem} from './core';
import {CONTENT_TYPE} from './_const';
import type {Slide} from './_types';

export const findById = async (universalRef: string): Promise<SlideAPI> => {
  const language = translations.getLanguage();
  // @ts-ignore union type
  const item: Slide = await getItem(CONTENT_TYPE.SLIDE, language, universalRef);
  return mapToSlideAPI(item);
};

export const findByChapter = async (chapterId: string): Promise<Array<SlideAPI>> => {
  const language = translations.getLanguage();
  const slides: Array<Slide> = await getItemsPerResourceType(CONTENT_TYPE.SLIDE, language);
  const flitredSlide = slides.filter((slide) => slide.chapter_id === chapterId);
  return flitredSlide.map((slide) => mapToSlideAPI(slide));
};
