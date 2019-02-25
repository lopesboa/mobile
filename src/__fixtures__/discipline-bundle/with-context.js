// @flow strict

import type {BundledDiscipline} from '../../layer/data/_types';

import {createDiscipline} from '../disciplines';
import {createLevel} from '../levels';
import {createChapter} from '../chapters';
import {createSlide} from '../slides';
import {createQCM} from '../questions';
import {failureExitNode, successExitNode} from '../exit-nodes';
import {image} from '../medias';

const level = createLevel({ref: 'with_context_mod_1', chapterIds: ['with_context_cha_1']});
const qcm = createQCM({media: image});

const bundledDiscipline: BundledDiscipline = {
  disciplines: {
    with_context_dis_1: createDiscipline({
      ref: 'with_context_dis_1',
      levels: [level],
      name: 'With Context: course'
    })
  },
  chapters: {
    with_context_cha_1: createChapter({ref: 'with_context_cha_1', name: 'With Context: chapter'})
  },
  slides: {
    // group question type in a same chapter, because progression engine choose randomly one of it
    with_context_sli_1: createSlide({
      ref: 'with_context_sli_1',
      chapterId: 'with_context_cha_1',
      question: qcm,
      context: true
    }),
    with_context_sli_2: createSlide({
      ref: 'with_context_sli_2',
      chapterId: 'with_context_cha_1',
      question: qcm,
      context: true
    }),
    with_context_sli_3: createSlide({
      ref: 'with_context_sli_3',
      chapterId: 'with_context_cha_1',
      question: qcm,
      context: true
    }),
    with_context_sli_4: createSlide({
      ref: 'with_context_sli_4',
      chapterId: 'with_context_cha_1',
      question: qcm
    })
  },
  exitNodes: {
    [failureExitNode.ref]: failureExitNode,
    [successExitNode.ref]: successExitNode
  },
  chapterRules: {}
};

export default bundledDiscipline;
