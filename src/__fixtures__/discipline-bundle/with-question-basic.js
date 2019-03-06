// @flow strict

import type {BundledDiscipline} from '../../layer/data/_types';
import {createDiscipline} from '../disciplines';
import {createLevel} from '../levels';
import {createChapter} from '../chapters';
import {createSlide} from '../slides';
import {createBasicQuestion} from '../questions';
import {failureExitNode, successExitNode} from '../exit-nodes';

const level = createLevel({
  ref: 'question_basic_mod_1',
  chapterIds: ['question_basic_cha_1']
});

const basicQuestion = createBasicQuestion({maxTypos: null});

const bundledDiscipline: BundledDiscipline = {
  disciplines: {
    question_basic_dis_1: createDiscipline({
      ref: 'question_basic_dis_1',
      levels: [level],
      name: 'question_basic: course'
    })
  },
  chapters: {
    question_basic_cha_1: createChapter({
      ref: 'question_basic_cha_1',
      name: 'question_basic: QCM chapter 1'
    })
  },
  slides: {
    // group question type in a same chapter, because progression engine choose randomly one of it
    question_basic_sli_1: createSlide({
      ref: 'question_basic_sli_1',
      chapterId: 'question_basic_cha_1',
      question: basicQuestion
    }),
    question_basic_sli_2: createSlide({
      ref: 'question_basic_sli_2',
      chapterId: 'question_basic_cha_1',
      question: basicQuestion
    }),
    question_basic_sli_3: createSlide({
      ref: 'question_basic_sli_3',
      chapterId: 'question_basic_cha_1',
      question: basicQuestion
    }),
    question_basic_sli_4: createSlide({
      ref: 'question_basic_sli_4',
      chapterId: 'question_basic_cha_1',
      question: basicQuestion
    })
  },
  exitNodes: {
    [failureExitNode.ref]: failureExitNode,
    [successExitNode.ref]: successExitNode
  },
  chapterRules: {}
};

export default bundledDiscipline;
