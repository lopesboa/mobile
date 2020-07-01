import type {ChapterRule} from '../types/coorpacademy/progression-engine';
import type {ChapterRules} from '../layer/data/_types';

export const createChapterRule = ({
  chapterRef = 'cha_foo',
  index = 0,
  conditions = false,
}: {
  chapterRef?: string;
  index?: number;
  conditions?: boolean;
}): ChapterRule => ({
  ref: chapterRef + '.star-step-q' + index.toString(),
  conditions: !conditions
    ? []
    : [
        {
          operator: 'IN',
          values: [["J'y vais !"]],
          target: {
            scope: 'slide',
            ref: 'sli_4yHKRmBtz',
            field: 'answer',
          },
        },
      ],
  priority: 10,
  destination: {
    type: 'slide',
    ref: 'sli_4yHKRmBtz',
  },
  source: {
    type: 'slide',
    ref: '',
  },
  instructions: [
    {
      field: 'stars',
      type: 'set',
      value: 0,
    },
  ],
});

export const createChapterRules = ({
  ref = 'chapterRule_foo',
  chapterRef = 'cha_foo',
}: {
  ref?: string;
  chapterRef?: string;
}): ChapterRules => ({
  _id: '59564bb2479ce0c58b7ffa94',
  chapterRef,
  ref,
  meta: {
    updatedAt: '2019-01-15T15:19:43.244Z',
    createdAt: '2018-11-29T11:38:40.205Z',
  },
  rules: [
    createChapterRule({chapterRef, index: 1, conditions: false}),
    createChapterRule({chapterRef, index: 2, conditions: true}),
  ],
});

export default {
  createChapterRules,
};
