// @flow strict

import type {SlideAPI} from '@coorpacademy/player-services';
import {mapToSlideAPI} from './mappers';
import {getItemsPerResourceType, getItem} from './core';
import {CONTENT_TYPE} from './_const';
import type {Slide, Language} from './types';

export const findById = (userLanguage: Language) => async (
  universalRef: string
): Promise<SlideAPI> => {
  // $FlowFixMe union type
  const item: Slide = await getItem(CONTENT_TYPE.SLIDE, universalRef, userLanguage);
  return mapToSlideAPI(item);
};

export const findByChapter = (userLanguage: Language) => async (
  chapterId: string
): Promise<Array<SlideAPI>> => {
  const slides: Array<Slide> = await getItemsPerResourceType(CONTENT_TYPE.SLIDE, userLanguage);
  const flitredSlide = slides.filter(slide => slide.chapter_id === chapterId);
  return flitredSlide.map(slide => mapToSlideAPI(slide));
};
