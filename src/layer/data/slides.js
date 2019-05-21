// @flow strict

import type {SlideAPI} from '@coorpacademy/player-services';

import type {SupportedLanguage} from '../../translations/_types';
import {mapToSlideAPI} from './mappers';
import {getItemsPerResourceType, getItem} from './core';
import {CONTENT_TYPE} from './_const';
import type {Slide} from './_types';

export const findById = (userLanguage: SupportedLanguage) => async (
  universalRef: string
): Promise<SlideAPI> => {
  // $FlowFixMe union type
  const item: Slide = await getItem(CONTENT_TYPE.SLIDE, userLanguage, universalRef);
  return mapToSlideAPI(item);
};

export const findByChapter = (userLanguage: SupportedLanguage) => async (
  chapterId: string
): Promise<Array<SlideAPI>> => {
  const slides: Array<Slide> = await getItemsPerResourceType(CONTENT_TYPE.SLIDE, userLanguage);
  const flitredSlide = slides.filter(slide => slide.chapter_id === chapterId);
  return flitredSlide.map(slide => mapToSlideAPI(slide));
};
