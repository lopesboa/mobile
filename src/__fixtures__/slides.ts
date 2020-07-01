import type {Lesson, Question, Context} from '../types/coorpacademy/progression-engine';
import type {Slide} from '../layer/data/_types';
import {createEmptyContext} from './context';

export const createSlide = ({
  ref,
  chapterId,
  question,
  clue,
  lessons = [],
  context,
}: {
  ref: string;
  chapterId: string;
  question: Question;
  clue?: string | null;
  lessons?: Array<Lesson>;
  context?: Context | null;
}): Slide => ({
  _id: ref,
  universalRef: ref,
  clue: clue === null ? undefined : clue || 'Une question de gestion.',
  klf:
    "Follow this <a href='https://coorpacademy.com'>linkCoorp</a> Open Compute Project permet de diffuser les solutions les plus efficaces de gestion énergétique dans les data centers et ainsi de réduire la consommation des grandes entreprises.",
  tips:
    " Follow this <a href='https://google.com'>linkGoogle</a> lorsque Facebook a redesigné l'un de ses data centers dans l'Oregon et a décidé d'en rendre public le plan. Le réseau social a depuis été rejoint au sein de l'OCP par tous les géants du numérique, d'IBM à Google en passant par Alibaba, Nokia et Microsoft.",
  chapter_id: chapterId,
  authors: [],
  context: context || createEmptyContext(),
  meta: {
    updatedAt: '2019-01-17T09:35:44.450Z',
    createdAt: '2019-01-17T09:35:44.450Z',
  },
  lessons,
  question,
});

export default {
  createSlide,
};
