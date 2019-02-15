// @flow

import type {Question} from '@coorpacademy/progression-engine';

import type {Slide} from '../layer/data/_types';
import {lessonWithVideo, lessonWithPdf} from './lessons';
import {image} from './medias';

export const createSlide = ({
  ref,
  chapterId,
  question,
  clue
}: {
  ref: string,
  chapterId: string,
  question: Question,
  clue?: string | null
}): Slide => ({
  _id: ref,
  universalRef: ref,
  clue: clue === null ? undefined : clue || 'Une question de gestion.',
  klf:
    'Open Compute Project permet de diffuser les solutions les plus efficaces de gestion énergétique dans les data centers et ainsi de réduire la consommation des grandes entreprises.',
  tips:
    "L'initiative de l'Open Compute Project remonte à 2011, lorsque Facebook a redesigné l'un de ses data centers dans l'Oregon et a décidé d'en rendre public le plan. Le réseau social a depuis été rejoint au sein de l'OCP par tous les géants du numérique, d'IBM à Google en passant par Alibaba, Nokia et Microsoft.",
  chapter_id: chapterId,
  __v: 0,
  authors: [],
  context: {
    media: image,
    description: 'This is a description',
    title: 'This is a title'
  },
  meta: {
    updatedAt: '2019-01-17T09:35:44.450Z',
    createdAt: '2019-01-17T09:35:44.450Z'
  },
  lessons: [lessonWithVideo, lessonWithPdf],
  question
});

export default {
  createSlide
};
